import { Schema, model, Document, Types } from "mongoose";
import { Platform } from "./SocialAccount";

export interface ITopic extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  subjectText: string;
  suggestedBy: "ai" | "user";
  status: "pending" | "approved" | "rejected";
  scheduledFor?: Date;
  platformTargets: Platform[];
  createdAt: Date;
}

const topicSchema = new Schema<ITopic>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  subjectText: { type: String, required: true },
  suggestedBy: { type: String, enum: ["ai", "user"], required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  scheduledFor: { type: Date },
  platformTargets: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const Topic = model<ITopic>("Topic", topicSchema);
