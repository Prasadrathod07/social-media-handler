import { Request, Response } from "express";
import { z } from "zod";
import { Conversation, Message } from "../models";
import { ApiError } from "../utils/ApiError";
import { chatWithAgent } from "../services/aiServiceClient";

export async function listMyConversations(req: Request, res: Response): Promise<void> {
  const conversations = await Conversation.find({ userId: req.user!.id }).sort({ lastMessageAt: -1 });
  res.json(conversations);
}

export async function getConversationMessages(req: Request, res: Response): Promise<void> {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  const conversation = await Conversation.findOne({ _id: id, userId: req.user!.id });
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }
  const messages = await Message.find({ conversationId: id }).sort({ createdAt: 1 });
  res.json(messages);
}

export async function sendMessage(req: Request, res: Response): Promise<void> {
  const { conversationId, text, imageUrls } = z
    .object({
      conversationId: z.string().optional(),
      text: z.string().min(1),
      imageUrls: z.array(z.string()).optional(),
    })
    .parse(req.body);

  let conversation = conversationId
    ? await Conversation.findOne({ _id: conversationId, userId: req.user!.id })
    : null;

  if (!conversation) {
    conversation = await Conversation.create({ userId: req.user!.id });
  }

  await Message.create({
    conversationId: conversation._id,
    role: "user",
    text,
    imageUrls: imageUrls ?? [],
  });

  const { reply } = await chatWithAgent(req.user!.id, conversation._id.toString(), text);

  const agentMessage = await Message.create({
    conversationId: conversation._id,
    role: "agent",
    text: reply,
  });

  conversation.lastMessageAt = new Date();
  await conversation.save();

  res.status(201).json({ conversationId: conversation._id, message: agentMessage });
}
