import type { User } from "@shared/models/auth";

const DEMO_USER: User = {
  id: "local-user",
  email: "demo@habitai.local",
  firstName: "Demo",
  lastName: "User",
  profileImageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function useAuth() {
  return {
    user: DEMO_USER,
    isLoading: false,
    isAuthenticated: true,
    logout: () => undefined,
    isLoggingOut: false,
  };
}
