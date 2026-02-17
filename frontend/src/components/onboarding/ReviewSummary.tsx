import type { QuestionType } from "@/api/types"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { computeProgress } from "@/lib/progress"
import { shouldDisplay } from "@/lib/visibility"
import { ProgressBar } from "./ProgressBar"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { expandCollapse, staggerContainer, fadeInUp } from "@/styles/animations"
import { cn } from "@/lib/utils"

function formatAnswer(answer: unknown, questionType: QuestionType): string {
  if (answer === null || answer === undefined) return "—"
  if (typeof answer === "boolean") return answer ? "Yes" : "No"
  if (typeof answer === "string") return answer
  if (typeof answer === "number") return String(answer)

  if (Array.isArray(answer)) {
    if (answer.length === 0) return "—"
    // email_list or multi_select: array of strings
    if (typeof answer[0] === "string") return (answer as string[]).join(", ")
    // lane_builder: array of objects — show count
    if (questionType === "lane_builder") return `${answer.length} lane${answer.length !== 1 ? "s" : ""} configured`
    // key_value: array of {key, value}
    if (questionType === "key_value") return `${answer.length} header${answer.length !== 1 ? "s" : ""} set`
    return `${answer.length} item${answer.length !== 1 ? "s" : ""}`
  }

  if (typeof answer === "object") {
    // address_form or object: show filled field count
    const obj = answer as Record<string, unknown>
    const filledCount = Object.values(obj).filter((v) => v !== null && v !== undefined && v !== "").length
    const totalCount = Object.keys(obj).length
    if (questionType === "address_form") return `${filledCount} of ${totalCount} fields filled`
    if (questionType === "object") return `${filledCount} of ${totalCount} fields configured`
    return JSON.stringify(answer)
  }

  return String(answer)
}

export function ReviewSummary() {
  const { sections, answers } = useOnboarding()
  const progress = computeProgress(sections, answers)
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-xl font-semibold text-foreground mb-2">Review Configuration</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Review all answers before marking the configuration as complete.
      </p>

      <div className="mb-8">
        <p className="text-sm font-medium text-foreground mb-2">Overall Completion</p>
        <ProgressBar percentage={progress.overall.percentage} />
        <p className="text-xs text-muted-foreground mt-1">
          {progress.overall.answered} of {progress.overall.total} required questions answered
        </p>
      </div>

      <motion.div initial="initial" animate="animate" variants={staggerContainer} className="space-y-2">
        {sections.map((section) => {
          const isExpanded = expanded === section.key
          const sectionProgress = progress.sections[section.key]
          return (
            <motion.div key={section.key} variants={fadeInUp} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpanded(isExpanded ? null : section.key)}
                aria-expanded={isExpanded}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{section.title}</span>
                  <ProgressBar
                    percentage={sectionProgress?.percentage ?? 0}
                    size="sm"
                    className="w-24"
                  />
                </div>
                <ChevronDown
                  className={cn("w-4 h-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")}
                />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div {...expandCollapse} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-4">
                      {section.subsections.map((sub) => (
                        <div key={sub.key}>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            {sub.title}
                          </p>
                          <div className="space-y-2">
                            {sub.questions.map((q) => {
                              if (!shouldDisplay(q.depends_on, answers)) return null
                              const answer = answers[q.key]
                              const hasAnswer = answer !== undefined && answer !== null && answer !== ""
                                && !(Array.isArray(answer) && answer.length === 0)
                                && !(typeof answer === "object" && !Array.isArray(answer) && Object.keys(answer as object).length === 0)
                              return (
                                <div key={q.key} className="flex justify-between items-start gap-4 text-sm">
                                  <span className="text-muted-foreground flex-1">
                                    {q.question_text}
                                    {q.required && !hasAnswer && (
                                      <span className="text-amber-500 text-xs ml-1">(unanswered)</span>
                                    )}
                                  </span>
                                  <span className={cn("text-right max-w-[50%] break-words", hasAnswer ? "text-foreground font-medium" : "text-muted-foreground/50")}>
                                    {hasAnswer
                                      ? formatAnswer(answer, q.question_type)
                                      : "—"}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
