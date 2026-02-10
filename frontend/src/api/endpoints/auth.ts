import { api } from "../client"
import type { TokenResponse, UserResponse } from "../types"

export const authApi = {
  register: (email: string, password: string, full_name?: string) =>
    api.post<TokenResponse>("/auth/register", { email, password, full_name }),

  login: (email: string, password: string) =>
    api.post<TokenResponse>("/auth/login", { email, password }),

  me: () => api.get<UserResponse>("/auth/me"),
}
