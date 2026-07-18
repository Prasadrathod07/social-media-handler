import { api } from "./client";
import { Platform, Post } from "../types";

export async function listPosts(status?: string): Promise<Post[]> {
  return api.get<Post[]>(status ? `/posts?status=${status}` : "/posts");
}

export async function generatePost(topicId: string, platform: Platform): Promise<Post> {
  return api.post<Post>("/posts/generate", { topicId, platform });
}

export async function updatePostStatus(
  id: string,
  payload: { status?: "approved" | "scheduled" | "draft"; content?: string; scheduledAt?: string }
): Promise<Post> {
  return api.patch<Post>(`/posts/${id}/status`, payload);
}

export async function generatePostImage(id: string): Promise<Post> {
  return api.post<Post>(`/posts/${id}/generate-image`);
}
