import { Schema, model, Document, Types } from "mongoose";

export type Cadence = "daily" | "weekly" | "monthly";
export type UserRole = "user" | "admin";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  subscription: {
    planId?: Types.ObjectId;
    cadence?: Cadence;
    status: "trialing" | "active" | "past_due" | "canceled" | "none";
    currentPeriodEnd?: Date;
  };
  onboardingComplete: boolean;
  aiPaused: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    subscription: {
      planId: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan" },
      cadence: { type: String, enum: ["daily", "weekly", "monthly"] },
      status: {
        type: String,
        enum: ["trialing", "active", "past_due", "canceled", "none"],
        default: "none",
      },
      currentPeriodEnd: { type: Date },
    },
    onboardingComplete: { type: Boolean, default: false },
    aiPaused: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
