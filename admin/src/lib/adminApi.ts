import { api } from "./api";
import { PlatformStats, PlatformUser, Post, SubscriptionPlan } from "@/types";

export function getStats(): Promise<PlatformStats> {
  return api.get("/admin/stats");
}

export function listUsers(page = 1, limit = 20): Promise<{ users: PlatformUser[]; total: number }> {
  return api.get(`/admin/users?page=${page}&limit=${limit}`);
}

export function setUserRole(id: string, role: "user" | "admin"): Promise<PlatformUser> {
  return api.patch(`/admin/users/${id}/role`, { role });
}

export function listAllPosts(status?: string): Promise<Post[]> {
  return api.get(status ? `/admin/posts?status=${status}` : "/admin/posts");
}

export function listPlans(): Promise<SubscriptionPlan[]> {
  return api.get("/admin/plans");
}

export function createPlan(payload: Omit<SubscriptionPlan, "_id" | "active">): Promise<SubscriptionPlan> {
  return api.post("/admin/plans", payload);
}

export function updatePlan(id: string, payload: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
  return api.patch(`/admin/plans/${id}`, payload);
}
