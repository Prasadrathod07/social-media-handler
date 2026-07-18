import { Request, Response } from "express";
import { z } from "zod";
import { Post, PostStatus, Schedule, Topic } from "../models";
import { ApiError } from "../utils/ApiError";
import { generatePostContent, generatePostImage, reviewContent, SafetyReviewResult } from "../services/aiServiceClient";
import { saveBase64Image } from "../utils/fileStorage";

/**
 * Autonomous-by-default decision: a schedule with requireApproval=false (the
 * default) lets a low-risk post go straight to "approved" without a human.
 * Medium/high risk always waits for a human regardless of that setting —
 * the safety floor is not configurable.
 */
async function decideInitialStatus(
  userId: string,
  review: SafetyReviewResult
): Promise<{ status: PostStatus; decidedBy?: "ai" }> {
  if (review.riskLevel !== "low") {
    return { status: "pendingApproval" };
  }

  const schedule = await Schedule.findOne({ userId, active: true });
  if (schedule?.requireApproval) {
    return { status: "pendingApproval" };
  }

  return { status: "approved", decidedBy: "ai" };
}

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
  const review = await reviewContent(req.user!.id, platform, content);
  const { status, decidedBy } = await decideInitialStatus(req.user!.id, review);

  const post = await Post.create({
    userId: req.user!.id,
    topicId: topic._id,
    platform,
    content,
    status,
    decidedBy,
    safetyReview: { ...review, reviewedAt: new Date() },
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

  const existing = await Post.findOne({ _id: id, userId: req.user!.id });
  if (!existing) {
    throw new ApiError(404, "Post not found");
  }

  const update: Record<string, unknown> = {};
  if (status) {
    update.status = status;
    if (status === "approved") update.decidedBy = "user";
  }
  if (scheduledAt) update.scheduledAt = new Date(scheduledAt);

  if (content && content !== existing.content) {
    update.content = content;
    const review = await reviewContent(req.user!.id, existing.platform, content);
    update.safetyReview = { ...review, reviewedAt: new Date() };
  }

  const post = await Post.findOneAndUpdate({ _id: id, userId: req.user!.id }, { $set: update }, { new: true });
  res.json(post);
}
