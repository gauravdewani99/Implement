import { api } from "../client"
import type { ConfigurationResponseOut, ResponseItem } from "../types"

export const responsesApi = {
  list: (clientId: string, section?: string) => {
    const params = section ? `?section=${section}` : ""
    return api.get<ConfigurationResponseOut[]>(`/clients/${clientId}/responses${params}`)
  },

  bulkUpsert: (clientId: string, responses: ResponseItem[]) =>
    api.put<{ upserted: number }>(`/clients/${clientId}/responses`, { responses }),

  update: (clientId: string, questionKey: string, data: { answer?: unknown; answer_text?: string; notes?: string }) =>
    api.patch<ConfigurationResponseOut>(`/clients/${clientId}/responses/${questionKey}`, data),
}
