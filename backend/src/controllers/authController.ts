import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models";
import { ApiError } from "../utils/ApiError";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function issueTokens(user: { id: string; role: "user" | "admin" }) {
  return {
    accessToken: signAccessToken({ sub: user.id, role: user.role }),
    refreshToken: signRefreshToken({ sub: user.id, role: user.role }),
  };
}

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, name } = registerSchema.parse(req.body);

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, name });

  const tokens = issueTokens({ id: user._id.toString(), role: user.role });
  res.status(201).json({
    user: { id: user._id, email: user.email, name: user.name, onboardingComplete: user.onboardingComplete },
    ...tokens,
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const tokens = issueTokens({ id: user._id.toString(), role: user.role });
  res.json({
    user: { id: user._id, email: user.email, name: user.name, onboardingComplete: user.onboardingComplete },
    ...tokens,
  });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body);

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const tokens = issueTokens({ id: user._id.toString(), role: user.role });
  res.json(tokens);
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.user!.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    onboardingComplete: user.onboardingComplete,
    aiPaused: user.aiPaused,
    subscription: user.subscription,
  });
}

export async function completeOnboarding(req: Request, res: Response): Promise<void> {
  const user = await User.findByIdAndUpdate(
    req.user!.id,
    { $set: { onboardingComplete: true } },
    { new: true }
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json({ onboardingComplete: user.onboardingComplete });
}

export async function setAiPaused(req: Request, res: Response): Promise<void> {
  const { paused } = z.object({ paused: z.boolean() }).parse(req.body);
  const user = await User.findByIdAndUpdate(req.user!.id, { $set: { aiPaused: paused } }, { new: true });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json({ aiPaused: user.aiPaused });
}
