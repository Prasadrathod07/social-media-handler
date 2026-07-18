import { Request, Response } from "express";
import { z } from "zod";
import { Schedule } from "../models";

const scheduleSchema = z.object({
  cadence: z.enum(["daily", "weekly", "monthly"]),
  dayOfWeek: z.number().min(0).max(6).optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  timezone: z.string(),
  requireApproval: z.boolean().optional(),
  platforms: z.array(z.enum(["linkedin", "x", "instagram", "facebook", "blog"])),
});

export async function listMySchedules(req: Request, res: Response): Promise<void> {
  const schedules = await Schedule.find({ userId: req.user!.id });
  res.json(schedules);
}

export async function createSchedule(req: Request, res: Response): Promise<void> {
  const data = scheduleSchema.parse(req.body);
  const schedule = await Schedule.create({ ...data, userId: req.user!.id });
  res.status(201).json(schedule);
}

export async function updateSchedule(req: Request, res: Response): Promise<void> {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  const data = scheduleSchema.partial().parse(req.body);
  const schedule = await Schedule.findOneAndUpdate({ _id: id, userId: req.user!.id }, { $set: data }, { new: true });
  res.json(schedule);
}

export async function deleteSchedule(req: Request, res: Response): Promise<void> {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  await Schedule.deleteOne({ _id: id, userId: req.user!.id });
  res.status(204).send();
}
