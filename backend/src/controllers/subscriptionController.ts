import { Request, Response } from "express";
import { z } from "zod";
import { SubscriptionPlan, User } from "../models";
import { ApiError } from "../utils/ApiError";

export async function listActivePlans(_req: Request, res: Response): Promise<void> {
  const plans = await SubscriptionPlan.find({ active: true }).sort({ price: 1 });
  res.json(plans);
}

export async function selectPlan(req: Request, res: Response): Promise<void> {
  const { planId } = z.object({ planId: z.string() }).parse(req.body);

  const plan = await SubscriptionPlan.findOne({ _id: planId, active: true });
  if (!plan) {
    throw new ApiError(404, "Plan not found");
  }

  const user = await User.findByIdAndUpdate(
    req.user!.id,
    {
      $set: {
        "subscription.planId": plan._id,
        "subscription.cadence": plan.cadence,
        "subscription.status": "trialing",
      },
    },
    { new: true }
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({ subscription: user.subscription });
}
