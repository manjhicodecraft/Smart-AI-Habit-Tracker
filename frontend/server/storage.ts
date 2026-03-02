import { db } from "./db";
import { 
  habits, habitRoadmaps, habitLogs, aiChats,
  type Habit, type InsertHabit,
  type HabitRoadmap, type HabitLog, type InsertHabitLog,
  type AiChat, type InsertAiChat
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Habits
  getHabits(userId: string): Promise<Habit[]>;
  getHabit(id: number): Promise<Habit | undefined>;
  createHabit(userId: string, habit: InsertHabit): Promise<Habit>;
  
  // Roadmaps
  getHabitRoadmaps(habitId: number): Promise<HabitRoadmap[]>;
  createHabitRoadmaps(habitId: number, roadmaps: Omit<HabitRoadmap, "id">[]): Promise<void>;
  
  // Logs
  getHabitLogs(habitId: number): Promise<HabitLog[]>;
  createHabitLog(habitId: number, log: Omit<InsertHabitLog, "habitId">): Promise<HabitLog>;
  
  // AI Chat
  getAiChats(userId: string): Promise<AiChat[]>;
  createAiChat(userId: string, chat: Omit<InsertAiChat, "userId">): Promise<AiChat>;
  
  // Analytics Dashboard
  getAnalytics(userId: string): Promise<{
    totalTimeInvested: number;
    completionRate: number;
    activeStreak: number;
    activeHabits: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getHabits(userId: string): Promise<Habit[]> {
    return await db.select().from(habits).where(eq(habits.userId, userId));
  }

  async getHabit(id: number): Promise<Habit | undefined> {
    const [habit] = await db.select().from(habits).where(eq(habits.id, id));
    return habit;
  }

  async createHabit(userId: string, insertHabit: InsertHabit): Promise<Habit> {
    const [habit] = await db
      .insert(habits)
      .values({ ...insertHabit, userId })
      .returning();
    return habit;
  }

  async getHabitRoadmaps(habitId: number): Promise<HabitRoadmap[]> {
    return await db
      .select()
      .from(habitRoadmaps)
      .where(eq(habitRoadmaps.habitId, habitId))
      .orderBy(habitRoadmaps.dayNumber);
  }

  async createHabitRoadmaps(habitId: number, insertRoadmaps: Omit<HabitRoadmap, "id">[]): Promise<void> {
    if (insertRoadmaps.length === 0) return;
    await db.insert(habitRoadmaps).values(insertRoadmaps);
  }

  async getHabitLogs(habitId: number): Promise<HabitLog[]> {
    return await db
      .select()
      .from(habitLogs)
      .where(eq(habitLogs.habitId, habitId))
      .orderBy(desc(habitLogs.date));
  }

  async createHabitLog(habitId: number, log: Omit<InsertHabitLog, "habitId">): Promise<HabitLog> {
    const [createdLog] = await db
      .insert(habitLogs)
      .values({ ...log, habitId })
      .returning();
      
    // Update streak if needed (simplified logic)
    const habit = await this.getHabit(habitId);
    if (habit && log.isCompleted) {
      await db
        .update(habits)
        .set({ streak: habit.streak + 1 })
        .where(eq(habits.id, habitId));
    } else if (habit && !log.isCompleted) {
      await db
        .update(habits)
        .set({ streak: 0 })
        .where(eq(habits.id, habitId));
    }
      
    return createdLog;
  }

  async getAiChats(userId: string): Promise<AiChat[]> {
    return await db
      .select()
      .from(aiChats)
      .where(eq(aiChats.userId, userId))
      .orderBy(aiChats.createdAt);
  }

  async createAiChat(userId: string, chat: Omit<InsertAiChat, "userId">): Promise<AiChat> {
    const [createdChat] = await db
      .insert(aiChats)
      .values({ ...chat, userId })
      .returning();
    return createdChat;
  }

  async getAnalytics(userId: string) {
    const userHabits = await this.getHabits(userId);
    
    if (userHabits.length === 0) {
      return { totalTimeInvested: 0, completionRate: 0, activeStreak: 0, activeHabits: 0 };
    }
    
    let totalTimeInvested = 0;
    let completedLogsCount = 0;
    let totalLogsCount = 0;
    let maxStreak = 0;
    
    for (const habit of userHabits) {
      if (habit.streak > maxStreak) {
        maxStreak = habit.streak;
      }
      
      const logs = await this.getHabitLogs(habit.id);
      for (const log of logs) {
        totalTimeInvested += log.durationInvested;
        totalLogsCount++;
        if (log.isCompleted) completedLogsCount++;
      }
    }
    
    const completionRate = totalLogsCount > 0 ? Math.round((completedLogsCount / totalLogsCount) * 100) : 0;
    
    return {
      totalTimeInvested,
      completionRate,
      activeStreak: maxStreak,
      activeHabits: userHabits.length
    };
  }
}

export const storage = new DatabaseStorage();
