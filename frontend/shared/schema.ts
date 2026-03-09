import { sql } from "drizzle-orm";
import { mysqlTable, serial, int, boolean, timestamp, varchar, text } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export Auth schemas created by the integration
export * from "./models/auth";

export const habits = mysqlTable("habits", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  name: text("name").notNull(),
  level: text("level").notNull(), // beginner, intermediate, advanced
  category: text("category").notNull(), // skill, custom
  goalDuration: int("goal_duration").notNull(), // in minutes
  streak: int("streak").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const habitRoadmaps = mysqlTable("habit_roadmaps", {
  id: serial("id").primaryKey(),
  habitId: int("habit_id").notNull(),
  dayNumber: int("day_number").notNull(),
  task: text("task").notNull(),
  duration: int("duration").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
});

export const habitLogs = mysqlTable("habit_logs", {
  id: serial("id").primaryKey(),
  habitId: int("habit_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  durationInvested: int("duration_invested").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiChats = mysqlTable("ai_chats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversations = mysqlTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: int("conversation_id").notNull(),
  role: text("role").notNull(),
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
