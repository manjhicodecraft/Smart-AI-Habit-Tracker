import { sql } from "drizzle-orm";
import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export Auth schemas created by the integration
export * from "./models/auth";

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  level: text("level").notNull(), // beginner, intermediate, advanced
  category: text("category").notNull(), // skill, custom
  goalDuration: integer("goal_duration").notNull(), // in minutes
  streak: integer("streak").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const habitRoadmaps = pgTable("habit_roadmaps", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull(),
  dayNumber: integer("day_number").notNull(),
  task: text("task").notNull(),
  duration: integer("duration").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
});

export const habitLogs = pgTable("habit_logs", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  durationInvested: integer("duration_invested").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiChats = pgTable("ai_chats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas
export const insertHabitSchema = createInsertSchema(habits).omit({ id: true, userId: true, streak: true, createdAt: true });
export const insertHabitLogSchema = createInsertSchema(habitLogs).omit({ id: true, createdAt: true });
export const insertAiChatSchema = createInsertSchema(aiChats).omit({ id: true, userId: true, createdAt: true });

// Types
export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type HabitRoadmap = typeof habitRoadmaps.$inferSelect;
export type HabitLog = typeof habitLogs.$inferSelect;
export type InsertHabitLog = z.infer<typeof insertHabitLogSchema>;
export type AiChat = typeof aiChats.$inferSelect;
export type InsertAiChat = z.infer<typeof insertAiChatSchema>;
