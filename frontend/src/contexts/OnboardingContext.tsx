import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { SectionOut } from "@/api/types"

interface OnboardingContextType {
  sections: SectionOut[]
  setSections: (s: SectionOut[]) => void
  activeSection: string
  setActiveSection: (s: string) => void
  activeSubsection: string
  setActiveSubsection: (s: string) => void
  answers: Record<string, unknown>
  setAnswers: (a: Record<string, unknown>) => void
  updateAnswer: (key: string, value: unknown) => void
  dirtyKeys: Set<string>
  clearDirty: () => void
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<SectionOut[]>([])
  const [activeSection, setActiveSection] = useState("general")
  const [activeSubsection, setActiveSubsection] = useState("")
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set())

  const updateAnswer = useCallback((key: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setDirtyKeys((prev) => new Set(prev).add(key))
  }, [])

  const clearDirty = useCallback(() => {
    setDirtyKeys(new Set())
  }, [])

  return (
    <OnboardingContext.Provider
      value={{
        sections,
        setSections,
        activeSection,
        setActiveSection,
        activeSubsection,
        setActiveSubsection,
        answers,
        setAnswers,
        updateAnswer,
        dirtyKeys,
        clearDirty,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider")
  return ctx
}
