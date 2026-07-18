import { api } from "./client";
import { ChatMessage } from "../types";

export async function listConversations(): Promise<{ _id: string; lastMessageAt: string }[]> {
  return api.get("/conversations");
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  return api.get<ChatMessage[]>(`/conversations/${conversationId}/messages`);
}

export async function sendMessage(
  text: string,
  conversationId?: string,
  imageUrls?: string[]
): Promise<{ conversationId: string; message: ChatMessage }> {
  return api.post("/conversations/messages", { text, conversationId, imageUrls });
}
