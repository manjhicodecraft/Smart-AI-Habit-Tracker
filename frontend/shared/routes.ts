import { z } from 'zod';
import { insertHabitSchema, habits, habitRoadmaps, habitLogs, aiChats } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  habits: {
    list: {
      method: 'GET' as const,
      path: '/api/habits' as const,
      responses: {
        200: z.array(z.custom<typeof habits.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/habits' as const,
      input: insertHabitSchema,
      responses: {
        201: z.custom<typeof habits.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/habits/:id' as const,
      responses: {
        200: z.custom<typeof habits.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getRoadmap: {
      method: 'GET' as const,
      path: '/api/habits/:id/roadmap' as const,
      responses: {
        200: z.array(z.custom<typeof habitRoadmaps.$inferSelect>()),
        404: errorSchemas.notFound,
      },
    },
    log: {
      method: 'POST' as const,
      path: '/api/habits/:id/log' as const,
      input: z.object({
        date: z.string(),
        durationInvested: z.number(),
        isCompleted: z.boolean()
      }),
      responses: {
        201: z.custom<typeof habitLogs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    getLogs: {
      method: 'GET' as const,
      path: '/api/habits/:id/logs' as const,
      responses: {
        200: z.array(z.custom<typeof habitLogs.$inferSelect>()),
      },
    }
  },
  aiCoach: {
    chat: {
      method: 'POST' as const,
      path: '/api/ai-coach/chat' as const,
      input: z.object({
        message: z.string()
      }),
      responses: {
        200: z.object({ response: z.string() }),
      }
    },
    history: {
      method: 'GET' as const,
      path: '/api/ai-coach/history' as const,
      responses: {
        200: z.array(z.custom<typeof aiChats.$inferSelect>())
      }
    }
  },
  analytics: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/analytics/dashboard' as const,
      responses: {
        200: z.object({
          totalTimeInvested: z.number(),
          completionRate: z.number(),
          activeStreak: z.number(),
          activeHabits: z.number()
        })
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
