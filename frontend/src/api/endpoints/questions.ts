import { api } from "../client"
import type { SectionOut } from "../types"

export const questionsApi = {
  list: () => api.get<SectionOut[]>("/questions"),

  getSection: (sectionKey: string) => api.get<SectionOut>(`/questions/${sectionKey}`),
}
