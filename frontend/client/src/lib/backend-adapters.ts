import type { Habit, HabitLog, HabitRoadmap } from "@shared/schema";

type BackendHabit = {
  id: number;
  name: string;
  description?: string | null;
  category?: string | null;
  frequency?: string | null;
  targetCount?: number | null;
  userId?: number | null;
};

type BackendHabitWithStats = BackendHabit & {
  currentStreak?: number | null;
};

type BackendCompletion = {
  id: number;
  completedAt: string;
  notes?: string | null;
};

type ParsedMeta = {
  level: "beginner" | "intermediate" | "advanced";
  goalDuration: number;
};

const DEFAULT_META: ParsedMeta = {
  level: "beginner",
  goalDuration: 15,
};

export function buildHabitMetaDescription(level: string, goalDuration: number): string {
  const normalizedLevel = normalizeLevel(level);
  const safeDuration = Number.isFinite(goalDuration) ? Math.max(5, Math.floor(goalDuration)) : 15;
  const payload = JSON.stringify({ level: normalizedLevel, goalDuration: safeDuration });
  return `[SMART_META]${payload}[/SMART_META]`;
}

export function parseHabitMeta(description?: string | null, fallbackGoalDuration?: number | null): ParsedMeta {
  const fromTarget = Number.isFinite(fallbackGoalDuration)
    ? Math.max(5, Math.floor(Number(fallbackGoalDuration)))
    : DEFAULT_META.goalDuration;

  if (!description) {
    return { ...DEFAULT_META, goalDuration: fromTarget };
  }

  const match = description.match(/\[SMART_META\](.*?)\[\/SMART_META\]/);
  if (!match?.[1]) {
    return { ...DEFAULT_META, goalDuration: fromTarget };
  }

  try {
    const parsed = JSON.parse(match[1]) as { level?: string; goalDuration?: number };
    return {
      level: normalizeLevel(parsed.level),
      goalDuration: Number.isFinite(parsed.goalDuration) ? Math.max(5, Math.floor(parsed.goalDuration as number)) : fromTarget,
    };
  } catch {
    return { ...DEFAULT_META, goalDuration: fromTarget };
  }
}

function normalizeLevel(level?: string): ParsedMeta["level"] {
  if (level === "intermediate" || level === "advanced") return level;
  return "beginner";
}

export function toFrontendHabit(habit: BackendHabit | BackendHabitWithStats): Habit {
  const meta = parseHabitMeta(habit.description, habit.targetCount);
  return {
    id: habit.id,
    userId: String(habit.userId ?? 1),
    name: habit.name,
    level: meta.level,
    category: habit.category ?? "custom",
    goalDuration: meta.goalDuration,
    streak: Number(habit.currentStreak ?? 0),
    createdAt: new Date(),
  };
}

type ParsedCompletionNotes = {
  durationInvested: number;
  isCompleted: boolean;
};

function parseCompletionNotes(notes?: string | null): ParsedCompletionNotes {
  if (!notes) return { durationInvested: 0, isCompleted: true };

  try {
    const parsed = JSON.parse(notes) as { durationInvested?: number; isCompleted?: boolean };
    return {
      durationInvested: Number.isFinite(parsed.durationInvested) ? Math.max(0, Math.floor(parsed.durationInvested as number)) : 0,
      isCompleted: typeof parsed.isCompleted === "boolean" ? parsed.isCompleted : true,
    };
  } catch {
    return { durationInvested: 0, isCompleted: true };
  }
}

export function buildCompletionNotes(durationInvested: number, isCompleted: boolean): string {
  return JSON.stringify({
    durationInvested: Math.max(0, Math.floor(durationInvested)),
    isCompleted,
  });
}

export function toFrontendHabitLog(completion: BackendCompletion, habitId: number): HabitLog {
  const parsed = parseCompletionNotes(completion.notes);
  const date = completion.completedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10);

  return {
    id: completion.id,
    habitId,
    date,
    durationInvested: parsed.durationInvested,
    isCompleted: parsed.isCompleted,
    createdAt: new Date(completion.completedAt),
  };
}

export function createRoadmapFromHabit(habit: Habit): HabitRoadmap[] {
  const baseTasks = {
    beginner: [
      `Start small: ${habit.name} for ${habit.goalDuration} minutes`,
      `Repeat and track consistency`,
      `Focus on foundation practice`,
      `Do one focused session without distractions`,
      `Review what improved this week`,
      `Increase challenge slightly`,
      `Weekly reflection + next goal`,
    ],
    intermediate: [
      `Warm up and practice ${habit.name}`,
      `Do a focused skill drill`,
      `Apply skill in a practical scenario`,
      `Measure your output quality`,
      `Refine weak areas`,
      `Push intensity by 10%`,
      `Weekly review + strategy update`,
    ],
    advanced: [
      `High-focus deep work session`,
      `Advanced technique practice`,
      `Performance benchmark run`,
      `Target weakest micro-skill`,
      `Simulate real-world pressure`,
      `Optimize routine and timing`,
      `Retrospective and next-level target`,
    ],
  } as const;

  return baseTasks[habit.level].map((task, index) => ({
    id: index + 1,
    habitId: habit.id,
    dayNumber: index + 1,
    task,
    duration: habit.goalDuration,
    isCompleted: false,
  }));
}
