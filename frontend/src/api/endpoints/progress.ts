import { api } from "../client"
import type { ProgressResponse } from "../types"

export const progressApi = {
  get: (clientId: string) => api.get<ProgressResponse>(`/clients/${clientId}/progress`),
}
