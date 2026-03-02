import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, isAuthenticated, registerAuthRoutes } from "./replit_integrations/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up Replit Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.habits.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const items = await storage.getHabits(userId);
    res.json(items);
  });

  app.post(api.habits.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.habits.create.input.parse(req.body);
      
      const habit = await storage.createHabit(userId, input);
      
      // Generate AI Roadmap based on habit level and goal
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { 
              role: "system", 
              content: "You are an AI Coach that generates a 7-day initial roadmap for a user trying to build a habit. Respond with a JSON array of objects, each containing 'dayNumber' (1-7), 'task' (string), 'duration' (number in minutes, try to match their goal duration), and 'isCompleted' (false)." 
            },
            {
              role: "user",
              content: `Create a 7-day roadmap for a ${input.level} level person trying to learn/do ${input.name} (${input.category}) for ${input.goalDuration} minutes daily.`
            }
          ],
          response_format: { type: "json_object" }
        });
        
        const content = response.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          let roadmaps = parsed.roadmap || parsed.days || parsed;
          if (Array.isArray(roadmaps)) {
            const validRoadmaps = roadmaps.map((r: any) => ({
              habitId: habit.id,
              dayNumber: r.dayNumber || r.day_number || 1,
              task: r.task || "Practice",
              duration: r.duration || input.goalDuration,
              isCompleted: false
            })).slice(0, 7);
            
            await storage.createHabitRoadmaps(habit.id, validRoadmaps);
          }
        }
      } catch (aiError) {
        console.error("AI Roadmap generation failed:", aiError);
        // Fallback simple roadmap
        const fallbackRoadmaps = Array.from({ length: 7 }).map((_, i) => ({
          habitId: habit.id,
          dayNumber: i + 1,
          task: `Practice ${input.name}`,
          duration: input.goalDuration,
          isCompleted: false
        }));
        await storage.createHabitRoadmaps(habit.id, fallbackRoadmaps);
      }

      res.status(201).json(habit);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.habits.get.path, isAuthenticated, async (req: any, res) => {
    const habit = await storage.getHabit(Number(req.params.id));
    if (!habit || habit.userId !== req.user.claims.sub) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json(habit);
  });

  app.get(api.habits.getRoadmap.path, isAuthenticated, async (req: any, res) => {
    const habit = await storage.getHabit(Number(req.params.id));
    if (!habit || habit.userId !== req.user.claims.sub) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    const roadmaps = await storage.getHabitRoadmaps(habit.id);
    res.json(roadmaps);
  });

  app.post(api.habits.log.path, isAuthenticated, async (req: any, res) => {
    try {
      const habit = await storage.getHabit(Number(req.params.id));
      if (!habit || habit.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: 'Habit not found' });
      }
      
      const input = api.habits.log.input.parse(req.body);
      const log = await storage.createHabitLog(habit.id, input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.habits.getLogs.path, isAuthenticated, async (req: any, res) => {
    const habit = await storage.getHabit(Number(req.params.id));
    if (!habit || habit.userId !== req.user.claims.sub) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    const logs = await storage.getHabitLogs(habit.id);
    res.json(logs);
  });

  app.post(api.aiCoach.chat.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.aiCoach.chat.input.parse(req.body);
      
      // Save user message
      await storage.createAiChat(userId, { role: "user", content: input.message });
      
      // Get brief chat history
      const history = await storage.getAiChats(userId);
      const recentHistory = history.slice(-5).map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
      
      // Get AI response
      const aiRes = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an AI Personal Coach for a habit tracking app. You motivate the user, give them practical advice on how to build consistency, and help them overcome obstacles. Be concise, empathetic, and actionable." },
          ...recentHistory,
          { role: "user", content: input.message }
        ]
      });
      
      const reply = aiRes.choices[0]?.message?.content || "I'm here to help, but I'm having trouble thinking right now. Let's try again.";
      
      // Save AI response
      await storage.createAiChat(userId, { role: "assistant", content: reply });
      
      res.json({ response: reply });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "AI Coach error" });
    }
  });

  app.get(api.aiCoach.history.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const history = await storage.getAiChats(userId);
    res.json(history);
  });

  app.get(api.analytics.dashboard.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const stats = await storage.getAnalytics(userId);
    res.json(stats);
  });

  // Seed data is tricky with Replit Auth since we don't have users upfront. 
  // Skipping global seed data, real users will start with empty states.

  return httpServer;
}
