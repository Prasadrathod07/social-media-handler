import { Schema, model, Document, Types } from "mongoose";
import { Cadence } from "./User";
import { Platform } from "./SocialAccount";

export interface ISubscriptionPlan extends Document {
  _id: Types.ObjectId;
  name: string;
  cadence: Cadence;
  price: number;
  postsPerCycle: number;
  platformsIncluded: Platform[];
  features: string[];
  active: boolean;
}

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  name: { type: String, required: true },
  cadence: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
  price: { type: Number, required: true },
  postsPerCycle: { type: Number, required: true },
  platformsIncluded: { type: [String], default: [] },
  features: { type: [String], default: [] },
  active: { type: Boolean, default: true },
});

export const SubscriptionPlan = model<ISubscriptionPlan>("SubscriptionPlan", subscriptionPlanSchema);
