import { Request, Response } from "express";
import { z } from "zod";
import { Post, Topic } from "../models";
import { ApiError } from "../utils/ApiError";
import { generatePostContent, generatePostImage } from "../services/aiServiceClient";
import { saveBase64Image } from "../utils/fileStorage";

export async function listMyPosts(req: Request, res: Response): Promise<void> {
  const { status } = z.object({ status: z.string().optional() }).parse(req.query);
  const filter: Record<string, unknown> = { userId: req.user!.id };
  if (status) filter.status = status;
  const posts = await Post.find(filter).sort({ createdAt: -1 });
  res.json(posts);
}

const generateSchema = z.object({
  topicId: z.string(),
  platform: z.enum(["linkedin", "x", "instagram", "facebook", "blog"]),
});

export async function generatePost(req: Request, res: Response): Promise<void> {
  const { topicId, platform } = generateSchema.parse(req.body);

  const topic = await Topic.findOne({ _id: topicId, userId: req.user!.id });
  if (!topic) {
    throw new ApiError(404, "Topic not found");
  }

  const { content } = await generatePostContent(req.user!.id, platform, topic.subjectText);

  const post = await Post.create({
    userId: req.user!.id,
    topicId: topic._id,
    platform,
    content,
    status: "pendingApproval",
  });

  res.status(201).json(post);
}

export async function generatePostImageForPost(req: Request, res: Response): Promise<void> {
  const { id } = z.object({ id: z.string() }).parse(req.params);

  const post = await Post.findOne({ _id: id, userId: req.user!.id });
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const topic = post.topicId ? await Topic.findById(post.topicId) : null;
  const subjectText = topic?.subjectText ?? post.content.slice(0, 120);

  const { imageBase64 } = await generatePostImage(req.user!.id, post.platform, subjectText, post.content);
  const imageUrl = await saveBase64Image("posts", imageBase64);

  post.mediaUrls.push(imageUrl);
  await post.save();

  res.status(201).json(post);
}

export async function updatePostStatus(req: Request, res: Response): Promise<void> {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  const { status, content, scheduledAt } = z
    .object({
      status: z.enum(["approved", "scheduled", "draft"]).optional(),
      content: z.string().optional(),
      scheduledAt: z.string().datetime().optional(),
    })
    .parse(req.body);

  const update: Record<string, unknown> = {};
  if (status) update.status = status;
  if (content) update.content = content;
  if (scheduledAt) update.scheduledAt = new Date(scheduledAt);

  const post = await Post.findOneAndUpdate({ _id: id, userId: req.user!.id }, { $set: update }, { new: true });
  res.json(post);
}
