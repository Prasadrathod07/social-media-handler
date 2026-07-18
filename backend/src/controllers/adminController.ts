import { Request, Response } from "express";
import { z } from "zod";
import { Post, Profile, Schedule, SocialAccount, SubscriptionPlan, User } from "../models";
import { ApiError } from "../utils/ApiError";

export async function listUsers(req: Request, res: Response): Promise<void> {
  const { page = "1", limit = "20" } = z
    .object({ page: z.string().optional(), limit: z.string().optional() })
    .parse(req.query);

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const [users, total] = await Promise.all([
    User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(),
  ]);

  res.json({ users, total, page: pageNum, limit: limitNum });
}

export async function getUserDetail(req: Request, res: Response): Promise<void> {
  const { id } = z.object({ id: z.string() }).parse(req.params);

  const user = await User.findById(id).select("-passwordHash");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const [profile, schedules, socialAccounts, recentPosts, postCounts] = await Promise.all([
    Profile.findOne({ userId: id }),
    Schedule.find({ userId: id }),
    SocialAccount.find({ userId: id }).select("-accessToken -refreshToken"),
    Post.find({ userId: id }).sort({ createdAt: -1 }).limit(20),
    Post.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  res.json({
    user,
    profile,
    schedules,
    socialAccounts,
    recentPosts,
    postCounts: Object.fromEntries(postCounts.map((c) => [c._id, c.count])),
  });
}

export async function getPlatformStats(_req: Request, res: Response): Promise<void> {
  const [totalUsers, activeSubscriptions, postsPublished, postsPendingApproval, postsFlaggedHighRisk] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ "subscription.status": "active" }),
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "pendingApproval" }),
      Post.countDocuments({ "safetyReview.riskLevel": "high" }),
    ]);

  res.json({ totalUsers, activeSubscriptions, postsPublished, postsPendingApproval, postsFlaggedHighRisk });
}

export async function listAllPosts(req: Request, res: Response): Promise<void> {
  const { status } = z.object({ status: z.string().optional() }).parse(req.query);
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  const posts = await Post.find(filter).sort({ createdAt: -1 }).limit(200).populate("userId", "name email");
  res.json(posts);
}

export async function listPlans(_req: Request, res: Response): Promise<void> {
  const plans = await SubscriptionPlan.find().sort({ price: 1 });
  res.json(plans);
}

const planSchema = z.object({
  name: z.string(),
  cadence: z.enum(["daily", "weekly", "monthly"]),
  price: z.number().nonnegative(),
  postsPerCycle: z.number().positive(),
  platformsIncluded: z.array(z.enum(["linkedin", "x", "instagram", "facebook", "blog"])),
  features: z.array(z.string()).optional(),
});

export async function createPlan(req: Request, res: Response): Promise<void> {
  const data = planSchema.parse(req.body);
  const plan = await SubscriptionPlan.create(data);
  res.status(201).json(plan);
}

export async function updatePlan(req: Request, res: Response): Promise<void> {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  const data = planSchema.partial().parse(req.body);
  const plan = await SubscriptionPlan.findByIdAndUpdate(id, { $set: data }, { new: true });
  res.json(plan);
}

export async function setUserRole(req: Request, res: Response): Promise<void> {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  const { role } = z.object({ role: z.enum(["user", "admin"]) }).parse(req.body);
  const user = await User.findByIdAndUpdate(id, { $set: { role } }, { new: true }).select("-passwordHash");
  res.json(user);
}
