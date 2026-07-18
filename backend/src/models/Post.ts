import { Schema, model, Document, Types } from "mongoose";
import { Platform } from "./SocialAccount";

export type PostStatus =
  | "draft"
  | "pendingApproval"
  | "approved"
  | "scheduled"
  | "published"
  | "failed";

export interface IPost extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  topicId?: Types.ObjectId;
  platform: Platform;
  content: string;
  mediaUrls: string[];
  status: PostStatus;
  scheduledAt?: Date;
  publishedAt?: Date;
  platformPostId?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
    scheduledAt: { type: Date },
    publishedAt: { type: Date },
    platformPostId: { type: String },
    error: { type: String },
  },
  { timestamps: true }
);

postSchema.index({ status: 1, scheduledAt: 1 });

export const Post = model<IPost>("Post", postSchema);
