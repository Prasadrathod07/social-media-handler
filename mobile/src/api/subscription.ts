import { api } from "./client";
import { Cadence, Platform } from "../types";

export interface SubscriptionPlan {
  _id: string;
  name: string;
  cadence: Cadence;
  price: number;
  postsPerCycle: number;
  platformsIncluded: Platform[];
  features: string[];
  active: boolean;
}

export async function listPlans(): Promise<SubscriptionPlan[]> {
  return api.get<SubscriptionPlan[]>("/subscription/plans");
}

export async function selectPlan(planId: string): Promise<{ subscription: unknown }> {
  return api.post("/subscription/select", { planId });
}
