import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type InsertHabit } from "@shared/schema";
import { toApiUrl, DEFAULT_USER_ID } from "@/lib/api";
import {
  buildCompletionNotes,
  buildHabitMetaDescription,
  createRoadmapFromHabit,
  toFrontendHabit,
  toFrontendHabitLog,
} from "@/lib/backend-adapters";

export function useHabits() {
  return useQuery({
    queryKey: ["habits", DEFAULT_USER_ID],
    queryFn: async () => {
      const res = await fetch(toApiUrl(`/api/habits/user/${DEFAULT_USER_ID}/active`));
      if (!res.ok) throw new Error("Failed to fetch habits");

      const habits = (await res.json()) as Array<{
        id: number;
        name: string;
        description?: string | null;
        category?: string | null;
        frequency?: string | null;
        targetCount?: number | null;
        userId?: number | null;
      }>;

      const streaks = await Promise.all(
        habits.map(async (habit) => {
          const statsRes = await fetch(toApiUrl(`/api/completions/habit/${habit.id}/stats`));
          if (!statsRes.ok) return 0;
          const stats = (await statsRes.json()) as { currentStreak?: number };
          return Number(stats.currentStreak ?? 0);
        }),
      );

      return habits.map((habit, index) => toFrontendHabit({ ...habit, currentStreak: streaks[index] }));
    },
  });
}

export function useHabit(id: number) {
  return useQuery({
    queryKey: ["habit", id],
    queryFn: async () => {
      const res = await fetch(toApiUrl(`/api/habits/${id}/with-stats`));
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch habit");

      const data = (await res.json()) as {
        id: number;
        name: string;
        description?: string | null;
        category?: string | null;
        frequency?: string | null;
        targetCount?: number | null;
        userId?: number | null;
        currentStreak?: number | null;
      };

      return toFrontendHabit(data);
    },
    enabled: !!id,
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertHabit) => {
      const payload = {
        name: data.name,
        description: buildHabitMetaDescription(data.level, data.goalDuration),
        category: data.category,
        frequency: "DAILY",
        targetCount: data.goalDuration,
        userId: DEFAULT_USER_ID,
        isActive: true,
      };

      const res = await fetch(toApiUrl("/api/habits"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create habit");

      const result = (await res.json()) as {
        id: number;
        name: string;
        description?: string | null;
        category?: string | null;
        frequency?: string | null;
        targetCount?: number | null;
        userId?: number | null;
      };

      return toFrontendHabit({ ...result, currentStreak: 0 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}

export function useHabitRoadmap(id: number) {
  return useQuery({
    queryKey: ["habit-roadmap", id],
    queryFn: async () => {
      const res = await fetch(toApiUrl(`/api/habits/${id}/with-stats`));
      if (res.status === 404) return [];
      if (!res.ok) throw new Error("Failed to fetch roadmap");
      const data = (await res.json()) as {
        id: number;
        name: string;
        description?: string | null;
        category?: string | null;
        frequency?: string | null;
        targetCount?: number | null;
        userId?: number | null;
        currentStreak?: number | null;
      };
      const habit = toFrontendHabit(data);
      return createRoadmapFromHabit(habit);
    },
    enabled: !!id,
  });
}

export function useHabitLogs(id: number) {
  return useQuery({
    queryKey: ["habit-logs", id],
    queryFn: async () => {
      const res = await fetch(toApiUrl(`/api/completions/habit/${id}`));
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = (await res.json()) as Array<{
        id: number;
        completedAt: string;
        notes?: string | null;
      }>;
      return data.map((completion) => toFrontendHabitLog(completion, id));
    },
    enabled: !!id,
  });
}

export function useLogHabit(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { date: string; durationInvested: number; isCompleted: boolean }) => {
      const payload = {
        habitId: id,
        completedAt: `${data.date}T09:00:00`,
        notes: buildCompletionNotes(data.durationInvested, data.isCompleted),
        userId: DEFAULT_USER_ID,
      };

      const res = await fetch(toApiUrl("/api/completions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to log habit");
      const result = (await res.json()) as { id: number; completedAt: string; notes?: string | null };
      return toFrontendHabitLog(result, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", id] });
      queryClient.invalidateQueries({ queryKey: ["habit", id] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}
