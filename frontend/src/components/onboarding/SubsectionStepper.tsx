import { useOnboarding } from "@/contexts/OnboardingContext"
import { computeProgress } from "@/lib/progress"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

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
    <div className="relative border-b border-border">
      <div className="flex items-center gap-1 overflow-x-auto">
        {currentSection.subsections.map((sub) => {
          const subKey = `${activeSection}.${sub.key}`
          const subProgress = progress.subsections[subKey]
          const isActive = activeSubsection === sub.key
          const isComplete = subProgress?.percentage === 100

          return (
            <button
              key={sub.key}
              onClick={() => onSubsectionClick(sub.key)}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                isActive
                  ? "text-brand-navy"
                  : isComplete
                    ? "text-brand-teal hover:text-brand-teal/80"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isComplete && <Check className="w-3.5 h-3.5" />}
              <span>{sub.title}</span>
              {!isComplete && subProgress && subProgress.total > 0 && (
                <span className="text-[10px] opacity-60 tabular-nums">{subProgress.percentage}%</span>
              )}

              {/* Animated underline indicator */}
              {isActive && (
                <motion.div
                  layoutId="subsection-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
