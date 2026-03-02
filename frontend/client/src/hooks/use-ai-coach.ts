import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DEFAULT_USER_ID } from "@/lib/api";

type ChatMessage = {
  id: number;
  userId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "smart-ai-habit-tracker-chat-history";

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(history: ChatMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function buildCoachReply(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("consisten")) {
    return "Consistency ke liye 2-minute rule use karo: har din bas 2 minute start karo. Start karte hi momentum banega.";
  }

  if (normalized.includes("streak")) {
    return "Streak bachane ka best hack: daily minimum target set karo jo miss na ho. Extra effort bonus samjho, baseline fixed rakho.";
  }

  if (normalized.includes("today") || normalized.includes("aaj")) {
    return "Aaj ka plan: 1) 5 min warm-up, 2) 15 min focused practice, 3) 2 min reflection. Bas isko complete karo.";
  }

  return "Great question. Goal ko micro-task me break karo, same time slot choose karo, aur completion ke turant baad progress log karo.";
}

export function useAiChatHistory() {
  return useQuery({
    queryKey: ["ai-coach-history", DEFAULT_USER_ID],
    queryFn: async () => {
      return loadHistory();
    },
  });
}

export function useSendAiMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      const current = loadHistory();
      const now = new Date().toISOString();

      const userMessage: ChatMessage = {
        id: Date.now(),
        userId: String(DEFAULT_USER_ID),
        role: "user",
        content: message,
        createdAt: now,
      };

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        userId: String(DEFAULT_USER_ID),
        role: "assistant",
        content: buildCoachReply(message),
        createdAt: new Date(Date.now() + 200).toISOString(),
      };

      const updated = [...current, userMessage, assistantMessage];
      saveHistory(updated);

      return { response: assistantMessage.content };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-coach-history"] });
    },
  });
}
