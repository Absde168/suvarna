import { api } from "../axios";
import type { LoginRequest, LoginResponse } from "./types";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/admin/auth/login", data);
  return res.data;
}
