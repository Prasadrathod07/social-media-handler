import { api } from "./client";
import { Profile } from "../types";

export async function getMyProfile(): Promise<Profile | null> {
  return api.get<Profile | null>("/profile/me");
}

export async function upsertMyProfile(data: Partial<Profile>): Promise<Profile> {
  return api.put<Profile>("/profile/me", data);
}

export async function addUpload(type: "resume" | "note" | "image", fileUrl: string): Promise<Profile> {
  return api.post<Profile>("/profile/me/uploads", { type, fileUrl });
}
