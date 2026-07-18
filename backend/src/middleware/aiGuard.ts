import { NextFunction, Request, Response } from "express";
import { User } from "../models";
import { ApiError } from "../utils/ApiError";

export async function requireAiActive(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const user = await User.findById(req.user!.id).select("aiPaused");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.aiPaused) {
    throw new ApiError(403, "AI generation is paused for this account. Resume it in your profile to continue.");
  }
  next();
}
