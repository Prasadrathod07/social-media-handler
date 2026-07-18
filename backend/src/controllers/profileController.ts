import { Request, Response } from "express";
import { z } from "zod";
import { Profile } from "../models";

const upsertProfileSchema = z.object({
  resumeText: z.string().optional(),
  bio: z.string().optional(),
  aboutMe: z.string().optional(),
  tone: z.array(z.string()).optional(),
  focusAreas: z.array(z.string()).optional(),
});

export async function getMyProfile(req: Request, res: Response): Promise<void> {
  const profile = await Profile.findOne({ userId: req.user!.id });
  res.json(profile ?? null);
}

export async function upsertMyProfile(req: Request, res: Response): Promise<void> {
  const data = upsertProfileSchema.parse(req.body);
  const profile = await Profile.findOneAndUpdate(
    { userId: req.user!.id },
    { $set: data },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(profile);
}

export async function addUpload(req: Request, res: Response): Promise<void> {
  const { type, fileUrl } = z
    .object({ type: z.enum(["resume", "note", "image"]), fileUrl: z.string().url() })
    .parse(req.body);

  const profile = await Profile.findOneAndUpdate(
    { userId: req.user!.id },
    { $push: { rawUploads: { type, fileUrl, uploadedAt: new Date() } } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(profile);
}
