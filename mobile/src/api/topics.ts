import { api } from "./client";
import { Platform, Topic } from "../types";

export async function listTopics(): Promise<Topic[]> {
  return api.get<Topic[]>("/topics");
}

export async function createTopic(subjectText: string, platformTargets: Platform[]): Promise<Topic> {
  return api.post<Topic>("/topics", { subjectText, platformTargets });
}

export async function suggestTopics(platform: Platform, count = 3): Promise<Topic[]> {
  return api.post<Topic[]>("/topics/suggest", { platform, count });
}

export async function updateTopicStatus(id: string, status: "approved" | "rejected"): Promise<Topic> {
  return api.patch<Topic>(`/topics/${id}/status`, { status });
}
