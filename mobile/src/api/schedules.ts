import { api } from "./client";
import { Schedule } from "../types";

export async function listSchedules(): Promise<Schedule[]> {
  return api.get<Schedule[]>("/schedules");
}

export async function createSchedule(payload: Omit<Schedule, "_id">): Promise<Schedule> {
  return api.post<Schedule>("/schedules", payload);
}

export async function updateSchedule(id: string, payload: Partial<Schedule>): Promise<Schedule> {
  return api.patch<Schedule>(`/schedules/${id}`, payload);
}

export async function deleteSchedule(id: string): Promise<void> {
  return api.delete(`/schedules/${id}`);
}
