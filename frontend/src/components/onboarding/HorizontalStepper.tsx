import { useOnboarding } from "@/contexts/OnboardingContext"
import { computeProgress } from "@/lib/progress"
import { SECTION_ICONS } from "@/lib/sectionIcons"
import { cn } from "@/lib/utils"
import { Check, Clock, AlertCircle } from "lucide-react"

export function HorizontalStepper({
  onSectionClick,
}: {
  onSectionClick: (sectionKey: string) => void
}) {
  const { sections, activeSection, answers } = useOnboarding()
  const progress = computeProgress(sections, answers)

  // Compute estimated time remaining: ~30 seconds per unanswered required question
  const unanswered = progress.overall.total - progress.overall.answered
  const minutesRemaining = Math.max(1, Math.ceil((unanswered * 30) / 60))

  return (
    <div className="w-full">
      {/* Stepper nodes */}
      <div className="flex items-center justify-between relative">
        {sections.map((section, idx) => {
          const isActive = activeSection === section.key
          const sectionProgress = progress.sections[section.key]
          const isComplete = sectionProgress?.percentage === 100
          const hasIncomplete = sectionProgress && sectionProgress.percentage < 100 && sectionProgress.total > 0
          const Icon = SECTION_ICONS[section.key]

          return (
            <div key={section.key} className="flex items-center flex-1 last:flex-0">
              {/* Node */}
              <button
                onClick={() => onSectionClick(section.key)}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 group z-10",
                  "focus-visible:outline-none",
                )}
                title={section.title}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shrink-0",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isComplete && !isActive
                      ? "bg-emerald-500 text-white shadow-sm"
                      : isActive
                        ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  {isComplete && !isActive ? (
                    <Check className="w-5 h-5" />
                  ) : Icon ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{idx + 1}</span>
                  )}
                  {/* Warning dot for incomplete sections */}
                  {hasIncomplete && !isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-background flex items-center justify-center">
                      <AlertCircle className="w-2 h-2 text-amber-900" />
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium text-center leading-tight max-w-[72px] hidden sm:block",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {section.title}
                </span>
              </button>

              {/* Connecting line */}
              {idx < sections.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 sm:mx-2 relative -mt-5 sm:-mt-5">
                  <div className="absolute inset-0 bg-muted rounded-full" />
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
                      isComplete ? "bg-emerald-500" : isActive ? "bg-primary/40" : "bg-muted",
                    )}
                    style={{
                      width: isComplete ? "100%" : isActive ? "50%" : "0%",
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Time estimate */}
      {unanswered > 0 && (
        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>~{minutesRemaining} min remaining</span>
        </div>
      )}
    </div>
  )
}
