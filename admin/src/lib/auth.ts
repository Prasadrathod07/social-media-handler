import { api, tokenStorage } from "./api";
import { AdminUser } from "@/types";

interface LoginResponse {
  user: AdminUser;
  accessToken: string;
  refreshToken: string;
}

export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  const data = await api.post<LoginResponse>("/auth/login", { email, password }, false);
  if (data.user.role !== "admin") {
    throw new Error("This account does not have admin access.");
  }
  tokenStorage.set(data.accessToken);
  return data.user;
}

export async function fetchMe(): Promise<AdminUser> {
  return api.get<AdminUser>("/auth/me");
}

export function logoutAdmin() {
  tokenStorage.clear();
}
