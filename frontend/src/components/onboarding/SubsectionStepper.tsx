import { useOnboarding } from "@/contexts/OnboardingContext"
import { computeProgress } from "@/lib/progress"
import { cn } from "@/lib/utils"
import { Check, AlertCircle } from "lucide-react"

export function SubsectionStepper({
  onSubsectionClick,
}: {
  onSubsectionClick: (subsectionKey: string) => void
}) {
  const { sections, activeSection, activeSubsection, answers } = useOnboarding()
  const progress = computeProgress(sections, answers)
  const currentSection = sections.find((s) => s.key === activeSection)

  if (!currentSection || currentSection.subsections.length <= 1) return null

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {currentSection.subsections.map((sub, idx) => {
        const subKey = `${activeSection}.${sub.key}`
        const subProgress = progress.subsections[subKey]
        const isActive = activeSubsection === sub.key
        const isComplete = subProgress?.percentage === 100
        const hasIncomplete = subProgress && subProgress.percentage < 100 && subProgress.total > 0

        return (
          <div key={sub.key} className="flex items-center">
            <button
              onClick={() => onSubsectionClick(sub.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : isComplete
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {isComplete ? (
                <Check className="w-3 h-3" />
              ) : hasIncomplete && !isActive ? (
                <AlertCircle className="w-3 h-3 text-amber-500" />
              ) : (
                <span className="w-4 text-center">{idx + 1}</span>
              )}
              <span>{sub.title}</span>
              {subProgress && !isComplete && (
                <span className="text-[10px] opacity-70">{subProgress.percentage}%</span>
              )}
            </button>

            {idx < currentSection.subsections.length - 1 && (
              <div className="w-2 h-px bg-border mx-0.5 shrink-0" />
            )}
          </div>
        )
      })}
    </div>
  )
}
