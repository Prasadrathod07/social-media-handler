import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

async function aiFetch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${env.aiServiceBaseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Api-Key": env.aiServiceApiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiError(502, `AI service error (${response.status}) on ${path}`);
  }

  return (await response.json()) as T;
}

export interface TopicSuggestion {
  subjectText: string;
  rationale?: string;
}

export function suggestTopics(userId: string, platform: string, count = 3): Promise<{ suggestions: TopicSuggestion[] }> {
  return aiFetch("/agents/ideation/suggest", { userId, platform, count });
}

export function generatePostContent(
  userId: string,
  platform: string,
  subjectText: string
): Promise<{ content: string }> {
  return aiFetch("/agents/content/generate", { userId, platform, subjectText });
}

export function embedAndIndexText(
  userId: string,
  sourceType: string,
  sourceRefId: string | undefined,
  text: string
): Promise<{ faissVectorId: number; faissIndexNamespace: string }> {
  return aiFetch("/knowledge/index", { userId, sourceType, sourceRefId, text });
}

export function chatWithAgent(userId: string, conversationId: string, message: string): Promise<{ reply: string }> {
  return aiFetch("/agents/chat", { userId, conversationId, message });
}

export function generatePostImage(
  userId: string,
  platform: string,
  subjectText: string,
  content: string
): Promise<{ imageBase64: string }> {
  return aiFetch("/agents/image/generate", { userId, platform, subjectText, content });
}
