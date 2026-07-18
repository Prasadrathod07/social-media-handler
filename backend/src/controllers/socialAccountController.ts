import { Request, Response } from "express";
import { z } from "zod";
import { SocialAccount } from "../models";

export async function listMySocialAccounts(req: Request, res: Response): Promise<void> {
  const accounts = await SocialAccount.find({ userId: req.user!.id }).select("-accessToken -refreshToken");
  res.json(accounts);
}

const connectSchema = z.object({
  platform: z.enum(["linkedin", "x", "instagram", "facebook", "blog"]),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  tokenExpiresAt: z.string().datetime().optional(),
  platformUserId: z.string(),
  platformHandle: z.string().optional(),
});

export async function connectSocialAccount(req: Request, res: Response): Promise<void> {
  const data = connectSchema.parse(req.body);

  const account = await SocialAccount.findOneAndUpdate(
    { userId: req.user!.id, platform: data.platform },
    {
      $set: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenExpiresAt: data.tokenExpiresAt ? new Date(data.tokenExpiresAt) : undefined,
        platformUserId: data.platformUserId,
        platformHandle: data.platformHandle,
        status: "active",
        connectedAt: new Date(),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({ id: account._id, platform: account.platform, status: account.status });
}

export async function disconnectSocialAccount(req: Request, res: Response): Promise<void> {
  const { platform } = z.object({ platform: z.enum(["linkedin", "x", "instagram", "facebook", "blog"]) }).parse(
    req.params
  );
  await SocialAccount.findOneAndUpdate(
    { userId: req.user!.id, platform },
    { $set: { status: "revoked" } }
  );
  res.status(204).send();
}
