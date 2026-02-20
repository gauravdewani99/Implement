import { useEffect, useState, useMemo, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { clientsApi } from "@/api/endpoints/clients"
import { responsesApi } from "@/api/endpoints/responses"
import { questionsApi } from "@/api/endpoints/questions"
import type { ClientResponse } from "@/api/types"
import { AppLayout } from "@/components/layout/AppLayout"
import { SidebarStepper } from "@/components/onboarding/SidebarStepper"
import { SubsectionStepper } from "@/components/onboarding/SubsectionStepper"
import { QuestionGroup } from "@/components/onboarding/QuestionGroup"
import { ReviewSummary } from "@/components/onboarding/ReviewSummary"
import { SaveIndicator } from "@/components/common/SaveIndicator"
import { useOnboarding, OnboardingProvider } from "@/contexts/OnboardingContext"
import { useAutoSave } from "@/hooks/useAutoSave"
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, ClipboardCheck } from "lucide-react"
import { toast, Toaster } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInUp } from "@/styles/animations"

function OnboardingContent() {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<ClientResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReview, setShowReview] = useState(false)
  const {
    sections,
    setSections,
    activeSection,
    setActiveSection,
    activeSubsection,
    setActiveSubsection,
    setAnswers,
  } = useOnboarding()
  const { saveStatus, flush } = useAutoSave(clientId)

  useEffect(() => {
    if (!clientId) return
    loadData()
  }, [clientId])

  async function loadData() {
    try {
      const [clientData, sectionData, responsesData] = await Promise.all([
        clientsApi.get(clientId!),
        questionsApi.list(),
        responsesApi.list(clientId!),
      ])
      setClient(clientData)
      setSections(sectionData)
      setActiveSection(clientData.current_section)

      // Set initial subsection to the first subsection of the active section
      const section = sectionData.find((s) => s.key === clientData.current_section)
      if (section && section.subsections.length > 0) {
        setActiveSubsection(section.subsections[0].key)
      }

      const answersMap: Record<string, unknown> = {}
      for (const r of responsesData) {
        answersMap[r.question_key] = r.answer
      }
      setAnswers(answersMap)
    } catch {
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  // Build a flat list of all (sectionKey, subsectionKey) pairs for wizard navigation
  const flatSteps = useMemo(() => {
    const steps: { sectionKey: string; subsectionKey: string }[] = []
    for (const sec of sections) {
      for (const sub of sec.subsections) {
        steps.push({ sectionKey: sec.key, subsectionKey: sub.key })
      }
    }
    return steps
  }, [sections])

  const currentFlatIdx = useMemo(() => {
    return flatSteps.findIndex(
      (s) => s.sectionKey === activeSection && s.subsectionKey === activeSubsection,
    )
  }, [flatSteps, activeSection, activeSubsection])

  const currentSectionData = sections.find((s) => s.key === activeSection)
  const currentSubsectionData = currentSectionData?.subsections.find(
    (sub) => sub.key === activeSubsection,
  )

  const goToSection = useCallback(
    async (sectionKey: string) => {
      await flush()
      setActiveSection(sectionKey)
      const section = sections.find((s) => s.key === sectionKey)
      if (section && section.subsections.length > 0) {
        setActiveSubsection(section.subsections[0].key)
      }
      setShowReview(false)
      if (clientId) {
        clientsApi.update(clientId, { current_section: sectionKey }).catch(() => {})
      }
    },
    [flush, sections, clientId, setActiveSection, setActiveSubsection],
  )

  const goToSubsection = useCallback(
    async (subsectionKey: string) => {
      await flush()
      setActiveSubsection(subsectionKey)
      setShowReview(false)
    },
    [flush, setActiveSubsection],
  )

  const goNext = useCallback(async () => {
    await flush()
    if (currentFlatIdx < flatSteps.length - 1) {
      const next = flatSteps[currentFlatIdx + 1]
      if (next.sectionKey !== activeSection) {
        setActiveSection(next.sectionKey)
        if (clientId) {
          clientsApi.update(clientId, { current_section: next.sectionKey }).catch(() => {})
        }
      }
      setActiveSubsection(next.subsectionKey)
      setShowReview(false)
    } else {
      // Last subsection of last section → show review
      setShowReview(true)
    }
  }, [flush, currentFlatIdx, flatSteps, activeSection, clientId, setActiveSection, setActiveSubsection])

  const goPrev = useCallback(async () => {
    await flush()
    if (showReview) {
      setShowReview(false)
      return
    }
    if (currentFlatIdx > 0) {
      const prev = flatSteps[currentFlatIdx - 1]
      if (prev.sectionKey !== activeSection) {
        setActiveSection(prev.sectionKey)
        if (clientId) {
          clientsApi.update(clientId, { current_section: prev.sectionKey }).catch(() => {})
        }
      }
      setActiveSubsection(prev.subsectionKey)
    }
  }, [flush, showReview, currentFlatIdx, flatSteps, activeSection, clientId, setActiveSection, setActiveSubsection])

  const handleComplete = async () => {
    await flush()
    if (clientId) {
      await clientsApi.update(clientId, { status: "completed" })
      toast.success("Configuration marked as complete!")
      for (const section of sections) {
        for (const sub of section.subsections) {
          for (const q of sub.questions) {
            if (q.config_description) {
              toast.info(q.config_description, { duration: 3000 })
            }
          }
        }
      }
    }
  }

  if (loading || !client) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    )
  }

  const isFirstStep = currentFlatIdx === 0 && !showReview
  const isLastStep = currentFlatIdx === flatSteps.length - 1

  return (
    <AppLayout
      sidebar={
        <SidebarStepper
          onSectionClick={goToSection}
          onSubsectionClick={goToSubsection}
        />
      }
    >
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top bar: Back + client name + save + review */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-1 py-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Clients</span>
            </button>
            <div className="h-5 w-px bg-border shrink-0" />
            <h2 className="text-sm font-semibold text-foreground truncate">{client.name}</h2>
            <SaveIndicator status={saveStatus} />
          </div>
          <button
            onClick={() => setShowReview(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-input hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] shrink-0"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Review</span>
          </button>
        </div>

        {showReview ? (
          <div>
            <ReviewSummary />
            <div className="mt-6 pb-8">
              <button
                onClick={handleComplete}
                className="w-full py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
              >
                Mark as Complete
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Subsection tabs */}
            <div className="mb-6">
              <SubsectionStepper onSubsectionClick={goToSubsection} />
            </div>

            {/* Content: single subsection */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSection}-${activeSubsection}`}
                {...fadeInUp}
                className="min-h-[300px]"
              >
                {currentSubsectionData && (
                  <div className="max-w-2xl">
                    {/* Section + Subsection title */}
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-foreground">
                        {currentSectionData?.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {currentSubsectionData.title}
                      </p>
                    </div>
                    <QuestionGroup subsection={currentSubsectionData} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next navigation */}
            <div className="flex justify-between items-center mt-8 pb-8 border-t border-border pt-6">
              <button
                onClick={goPrev}
                disabled={isFirstStep}
                className="flex items-center gap-1 px-4 py-2 rounded-md text-sm border border-input hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={goNext}
                className="flex items-center gap-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
              >
                {isLastStep ? "Review" : "Next"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  )
}
