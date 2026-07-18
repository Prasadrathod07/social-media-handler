import { Request, Response } from "express";
import { z } from "zod";
import { Topic } from "../models";
import { suggestTopics } from "../services/aiServiceClient";

export async function listMyTopics(req: Request, res: Response): Promise<void> {
  const topics = await Topic.find({ userId: req.user!.id }).sort({ createdAt: -1 });
  res.json(topics);
}

const createTopicSchema = z.object({
  subjectText: z.string().min(1),
  platformTargets: z.array(z.enum(["linkedin", "x", "instagram", "facebook", "blog"])),
});

export async function createTopic(req: Request, res: Response): Promise<void> {
  const data = createTopicSchema.parse(req.body);
  const topic = await Topic.create({ ...data, userId: req.user!.id, suggestedBy: "user", status: "approved" });
  res.status(201).json(topic);
}

export async function generateTopicSuggestions(req: Request, res: Response): Promise<void> {
  const { platform, count } = z
    .object({ platform: z.enum(["linkedin", "x", "instagram", "facebook", "blog"]), count: z.number().min(1).max(10).optional() })
    .parse(req.body);

  const { suggestions } = await suggestTopics(req.user!.id, platform, count);

  const topics = await Topic.insertMany(
    suggestions.map((s) => ({
      userId: req.user!.id,
      subjectText: s.subjectText,
      suggestedBy: "ai" as const,
      status: "pending" as const,
      platformTargets: [platform],
    }))
  );

  res.status(201).json(topics);
}

export async function updateTopicStatus(req: Request, res: Response): Promise<void> {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  const { status } = z.object({ status: z.enum(["approved", "rejected"]) }).parse(req.body);

  const topic = await Topic.findOneAndUpdate({ _id: id, userId: req.user!.id }, { $set: { status } }, { new: true });
  res.json(topic);
}
