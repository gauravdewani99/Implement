import { api } from "../client"
import type { ClientResponse } from "../types"

export const clientsApi = {
  list: () => api.get<ClientResponse[]>("/clients"),

  create: (name: string, metadata?: Record<string, unknown>) =>
    api.post<ClientResponse>("/clients", { name, metadata }),

  get: (id: string) => api.get<ClientResponse>(`/clients/${id}`),

  update: (id: string, data: { name?: string; status?: string; current_section?: string; metadata?: Record<string, unknown> }) =>
    api.patch<ClientResponse>(`/clients/${id}`, data),

  delete: (id: string) => api.delete<void>(`/clients/${id}`),
}
