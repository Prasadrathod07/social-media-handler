import { Schema, model, Document, Types } from "mongoose";

export type Platform = "linkedin" | "x" | "instagram" | "facebook" | "blog";

export interface ISocialAccount extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  platform: Platform;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  platformUserId: string;
  platformHandle?: string;
  connectedAt: Date;
  status: "active" | "expired" | "revoked";
}

const socialAccountSchema = new Schema<ISocialAccount>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  platform: { type: String, enum: ["linkedin", "x", "instagram", "facebook", "blog"], required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  tokenExpiresAt: { type: Date },
  platformUserId: { type: String, required: true },
  platformHandle: { type: String },
  connectedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "expired", "revoked"], default: "active" },
});

socialAccountSchema.index({ userId: 1, platform: 1 }, { unique: true });

export const SocialAccount = model<ISocialAccount>("SocialAccount", socialAccountSchema);
