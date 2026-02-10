import { useEffect, useRef, useState, useCallback } from "react"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { responsesApi } from "@/api/endpoints/responses"
import type { ResponseItem, SectionOut } from "@/api/types"

type SaveStatus = "idle" | "saving" | "saved" | "error"

export function useAutoSave(clientId: string | undefined, debounceMs = 2000) {
  const { answers, dirtyKeys, clearDirty, sections } = useOnboarding()
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sectionsRef = useRef<SectionOut[]>(sections)
  sectionsRef.current = sections

  const flush = useCallback(async () => {
    if (!clientId || dirtyKeys.size === 0) return

    const keysToSave = new Set(dirtyKeys)
    const questionMap = new Map<string, { section: string; subsection: string }>()
    for (const sec of sectionsRef.current) {
      for (const sub of sec.subsections) {
        for (const q of sub.questions) {
          questionMap.set(q.key, { section: sec.key, subsection: sub.key })
        }
      }
    }

    const items: ResponseItem[] = []
    for (const key of keysToSave) {
      const meta = questionMap.get(key)
      if (!meta) continue
      items.push({
        question_key: key,
        section: meta.section,
        subsection: meta.subsection,
        answer: answers[key] ?? null,
      })
    }

    if (items.length === 0) return

    setSaveStatus("saving")
    try {
      await responsesApi.bulkUpsert(clientId, items)
      clearDirty()
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch {
      setSaveStatus("error")
    }
  }, [clientId, dirtyKeys, answers, clearDirty])

  // Debounced auto-save
  useEffect(() => {
    if (dirtyKeys.size === 0) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(flush, debounceMs)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [dirtyKeys, debounceMs, flush])

  return { saveStatus, flush }
}
