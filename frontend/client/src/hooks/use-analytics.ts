import { useQuery } from "@tanstack/react-query";
import { toApiUrl, DEFAULT_USER_ID } from "@/lib/api";

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["analytics", "dashboard", DEFAULT_USER_ID],
    queryFn: async () => {
      const [overviewRes, habitsRes, completionsRes] = await Promise.all([
        fetch(toApiUrl(`/api/statistics/user/${DEFAULT_USER_ID}/overview`)),
        fetch(toApiUrl(`/api/habits/user/${DEFAULT_USER_ID}/active`)),
        fetch(toApiUrl(`/api/completions/user/${DEFAULT_USER_ID}`)),
      ]);

      if (!overviewRes.ok || !habitsRes.ok || !completionsRes.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const overview = (await overviewRes.json()) as { averageCompletionRate?: number };
      const habits = (await habitsRes.json()) as Array<{ id: number }>;
      const completions = (await completionsRes.json()) as Array<{ notes?: string | null; completedAt: string }>;

      const streaks = await Promise.all(
        habits.map(async (habit) => {
          const res = await fetch(toApiUrl(`/api/completions/habit/${habit.id}/stats`));
          if (!res.ok) return 0;
          const stats = (await res.json()) as { currentStreak?: number };
          return Number(stats.currentStreak ?? 0);
        }),
      );

      const last30Days = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const recentCompletionsCount = completions.filter((item) => new Date(item.completedAt).getTime() >= last30Days).length;

      const totalTimeInvested = completions.reduce((sum, completion) => {
        if (!completion.notes) return sum;
        try {
          const parsed = JSON.parse(completion.notes) as { durationInvested?: number };
          return sum + (Number.isFinite(parsed.durationInvested) ? Number(parsed.durationInvested) : 0);
        } catch {
          return sum;
        }
      }, 0);

      const activeHabits = habits.length;
      const completionRate =
        activeHabits > 0
          ? Math.min(100, Math.round((recentCompletionsCount / (activeHabits * 30)) * 100))
          : Math.round(Number(overview.averageCompletionRate ?? 0));

      return {
        totalTimeInvested,
        completionRate,
        activeStreak: streaks.length ? Math.max(...streaks) : 0,
        activeHabits,
      };
    },
  });
}
