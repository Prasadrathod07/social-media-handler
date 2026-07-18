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
  autoPublish: boolean;
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
  autoPublish: { type: Boolean, default: false },
  platforms: { type: [String], default: [] },
  active: { type: Boolean, default: true },
});

export const Schedule = model<ISchedule>("Schedule", scheduleSchema);
