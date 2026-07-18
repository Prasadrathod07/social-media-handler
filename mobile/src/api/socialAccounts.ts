import { api } from "./client";
import { Platform, SocialAccount } from "../types";

export async function listSocialAccounts(): Promise<SocialAccount[]> {
  return api.get<SocialAccount[]>("/social-accounts");
}

export async function connectSocialAccount(payload: {
  platform: Platform;
  accessToken: string;
  refreshToken?: string;
  platformUserId: string;
  platformHandle?: string;
}): Promise<{ id: string; platform: Platform; status: string }> {
  return api.post("/social-accounts", payload);
}

export async function disconnectSocialAccount(platform: Platform): Promise<void> {
  return api.delete(`/social-accounts/${platform}`);
}
