import { Schema, model, Document, Types } from "mongoose";
import { Platform } from "./SocialAccount";

export type PostStatus =
  | "draft"
  | "pendingApproval"
  | "approved"
  | "scheduled"
  | "published"
  | "failed";

export type RiskLevel = "low" | "medium" | "high";
export type JudgeRecommendation = "approve" | "needs_review" | "block";

export interface ISafetyReview {
  riskLevel: RiskLevel;
  issues: string[];
  recommendation: JudgeRecommendation;
  reviewedAt: Date;
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  topicId?: Types.ObjectId;
  platform: Platform;
  content: string;
  mediaUrls: string[];
  status: PostStatus;
  safetyReview?: ISafetyReview;
  scheduledAt?: Date;
  publishedAt?: Date;
  platformPostId?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const safetyReviewSchema = new Schema<ISafetyReview>(
  {
    riskLevel: { type: String, enum: ["low", "medium", "high"], required: true },
    issues: { type: [String], default: [] },
    recommendation: { type: String, enum: ["approve", "needs_review", "block"], required: true },
    reviewedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const postSchema = new Schema<IPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic" },
    platform: { type: String, enum: ["linkedin", "x", "instagram", "facebook", "blog"], required: true },
    content: { type: String, required: true },
    mediaUrls: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["draft", "pendingApproval", "approved", "scheduled", "published", "failed"],
      default: "draft",
    },
    safetyReview: { type: safetyReviewSchema },
    scheduledAt: { type: Date },
    publishedAt: { type: Date },
    platformPostId: { type: String },
    error: { type: String },
  },
  { timestamps: true }
);

postSchema.index({ status: 1, scheduledAt: 1 });

export const Post = model<IPost>("Post", postSchema);
