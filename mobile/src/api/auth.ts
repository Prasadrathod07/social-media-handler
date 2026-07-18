import { api, tokenStorage } from "./client";
import { User } from "../types";

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function registerUser(email: string, password: string, name: string): Promise<User> {
  const data = await api.post<AuthResponse>("/auth/register", { email, password, name }, false);
  await tokenStorage.setTokens(data.accessToken, data.refreshToken);
  return data.user;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const data = await api.post<AuthResponse>("/auth/login", { email, password }, false);
  await tokenStorage.setTokens(data.accessToken, data.refreshToken);
  return data.user;
}

export async function fetchMe(): Promise<User> {
  return api.get<User>("/auth/me");
}

export async function logout(): Promise<void> {
  await tokenStorage.clear();
}

export async function completeOnboarding(): Promise<void> {
  await api.post("/auth/me/complete-onboarding");
}

export async function setAiPaused(paused: boolean): Promise<{ aiPaused: boolean }> {
  return api.post("/auth/me/ai-paused", { paused });
}
