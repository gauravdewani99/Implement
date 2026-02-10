import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { clientsApi } from "@/api/endpoints/clients"
import { responsesApi } from "@/api/endpoints/responses"
import { questionsApi } from "@/api/endpoints/questions"
import type { ClientResponse } from "@/api/types"
import { AppLayout } from "@/components/layout/AppLayout"
import { SectionStepper } from "@/components/onboarding/SectionStepper"
import { SectionPage } from "@/components/onboarding/SectionPage"
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
  const { sections, setSections, activeSection, setActiveSection, setAnswers } = useOnboarding()
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

  const currentSectionData = sections.find((s) => s.key === activeSection)
  const currentIdx = sections.findIndex((s) => s.key === activeSection)

  const goToSection = async (key: string) => {
    await flush()
    setActiveSection(key)
    setShowReview(false)
    if (clientId) {
      clientsApi.update(clientId, { current_section: key }).catch(() => {})
    }
  }

  const handleComplete = async () => {
    await flush()
    if (clientId) {
      await clientsApi.update(clientId, { status: "completed" })
      toast.success("Configuration marked as complete!")
      // Fire placeholder toasts for each config_description
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

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Clients
        </button>
        <h2 className="text-sm font-semibold text-foreground truncate">{client.name}</h2>
        <SaveIndicator status={saveStatus} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <SectionStepper />
      </div>
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            setShowReview(true)
          }}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm border border-input hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          <ClipboardCheck className="w-4 h-4" />
          Review
        </button>
      </div>
    </div>
  )

  return (
    <AppLayout sidebar={sidebar}>
      <Toaster position="top-right" />
      {showReview ? (
        <div>
          <ReviewSummary />
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
            <button
              onClick={handleComplete}
              className="w-full py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              Mark as Complete
            </button>
          </div>
        </div>
      ) : currentSectionData ? (
        <div>
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} {...fadeInUp}>
              <SectionPage section={currentSectionData} />
            </motion.div>
          </AnimatePresence>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-8 flex justify-between">
            <button
              onClick={() => currentIdx > 0 && goToSection(sections[currentIdx - 1].key)}
              disabled={currentIdx === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-md text-sm border border-input hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() =>
                currentIdx < sections.length - 1
                  ? goToSection(sections[currentIdx + 1].key)
                  : setShowReview(true)
              }
              className="flex items-center gap-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              {currentIdx < sections.length - 1 ? "Next" : "Review"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
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
