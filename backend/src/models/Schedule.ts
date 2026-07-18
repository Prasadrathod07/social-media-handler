import { Schema, model, Document, Types } from "mongoose";
import { Cadence } from "./User";
import { Platform } from "./SocialAccount";

export interface ISchedule extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  cadence: Cadence;
  dayOfWeek?: number; // 0-6, used when cadence === "weekly"
  dayOfMonth?: number; // 1-31, used when cadence === "monthly"
  time: string; // "HH:mm" in the user's timezone
  timezone: string;
  /**
   * Default false: the platform behaves autonomously — a cleanly-reviewed
   * (low risk) post is approved automatically without waiting on the user.
   * Set true to require the user's explicit approval on every post
   * regardless of the safety review outcome. Either way, a medium/high risk
   * post always waits for a human — this flag only affects the low-risk path.
   */
  requireApproval: boolean;
  platforms: Platform[];
  active: boolean;
}

const scheduleSchema = new Schema<ISchedule>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  cadence: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
  dayOfWeek: { type: Number, min: 0, max: 6 },
  dayOfMonth: { type: Number, min: 1, max: 31 },
  time: { type: String, required: true, default: "09:00" },
  timezone: { type: String, required: true, default: "UTC" },
  requireApproval: { type: Boolean, default: false },
  platforms: { type: [String], default: [] },
  active: { type: Boolean, default: true },
});

export const Schedule = model<ISchedule>("Schedule", scheduleSchema);
