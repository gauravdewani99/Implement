import { useOnboarding } from "@/contexts/OnboardingContext"
import { computeProgress } from "@/lib/progress"
import { SECTION_ICONS } from "@/lib/sectionIcons"
import { cn } from "@/lib/utils"
import { ProgressBar } from "./ProgressBar"
import { Check, ChevronRight, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { expandCollapse } from "@/styles/animations"

export function SidebarStepper({
  onSectionClick,
  onSubsectionClick,
}: {
  onSectionClick: (sectionKey: string) => void
  onSubsectionClick: (subsectionKey: string) => void
}) {
  const { sections, activeSection, activeSubsection, answers } = useOnboarding()
  const progress = computeProgress(sections, answers)

  // Time estimate: ~30 seconds per unanswered required question
  const unanswered = progress.overall.total - progress.overall.answered
  const minutesRemaining = Math.max(1, Math.ceil((unanswered * 30) / 60))

  return (
    <nav className="h-full flex flex-col">
      {/* Overall progress */}
      <div className="p-5 border-b border-sidebar-border">
        <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3">
          Overall Progress
        </p>
        <ProgressBar percentage={progress.overall.percentage} variant="sidebar" size="md" showLabel={false} />
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-white">
            {progress.overall.percentage}%
          </span>
          <span className="text-xs text-sidebar-foreground/50">
            {progress.overall.answered} of {progress.overall.total} completed
          </span>
        </div>
      </div>

      {/* Section list */}
      <div className="flex-1 overflow-y-auto py-2">
        {sections.map((section) => {
          const isActive = activeSection === section.key
          const sectionProgress = progress.sections[section.key]
          const isComplete = sectionProgress?.percentage === 100
          const Icon = SECTION_ICONS[section.key]

          return (
            <div key={section.key}>
              <button
                onClick={() => onSectionClick(section.key)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-inset",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground",
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isComplete
                      ? "bg-brand-teal/20 text-brand-teal"
                      : isActive
                        ? "bg-brand-teal text-white"
                        : "bg-white/10 text-sidebar-foreground/60",
                  )}
                >
                  {isComplete ? (
                    <Check className="w-4 h-4" />
                  ) : Icon ? (
                    <Icon className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-semibold">{sections.indexOf(section) + 1}</span>
                  )}
                </div>

                {/* Label + progress */}
                <div className="flex-1 min-w-0">
                  <span className={cn(
                    "text-sm font-medium block truncate",
                    isActive ? "text-white" : isComplete ? "text-sidebar-foreground" : "",
                  )}>
                    {section.title}
                  </span>
                  {isComplete ? (
                    <span className="text-[11px] text-brand-teal">Complete</span>
                  ) : sectionProgress && sectionProgress.total > 0 ? (
                    <div className="mt-1">
                      <ProgressBar
                        percentage={sectionProgress.percentage}
                        variant="sidebar"
                        size="sm"
                        showLabel={false}
                      />
                    </div>
                  ) : null}
                </div>

                {/* Chevron for active */}
                <ChevronRight
                  className={cn(
                    "w-4 h-4 shrink-0 transition-transform duration-200",
                    isActive ? "rotate-90 text-white" : "text-sidebar-foreground/30",
                  )}
                />
              </button>

              {/* Expanded subsections */}
              <AnimatePresence>
                {isActive && section.subsections.length > 1 && (
                  <motion.div
                    key={`sub-${section.key}`}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={expandCollapse}
                    className="overflow-hidden"
                  >
                    <div className="pb-2 pl-11 pr-4">
                      {section.subsections.map((sub) => {
                        const subKey = `${section.key}.${sub.key}`
                        const subProgress = progress.subsections[subKey]
                        const isSubActive = activeSubsection === sub.key
                        const isSubComplete = subProgress?.percentage === 100

                        return (
                          <button
                            key={sub.key}
                            onClick={() => onSubsectionClick(sub.key)}
                            className={cn(
                              "w-full flex items-center gap-2.5 py-2 text-left text-sm transition-colors rounded-md px-2 -mx-2",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-inset",
                              isSubActive
                                ? "text-white bg-white/5"
                                : "text-sidebar-foreground/60 hover:text-sidebar-foreground/80",
                            )}
                          >
                            {/* Dot indicator */}
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                isSubComplete
                                  ? "bg-brand-teal"
                                  : isSubActive
                                    ? "bg-white"
                                    : "bg-sidebar-foreground/30",
                              )}
                            />
                            <span className="flex-1 truncate">{sub.title}</span>
                            {isSubComplete ? (
                              <Check className="w-3 h-3 text-brand-teal shrink-0" />
                            ) : subProgress && subProgress.total > 0 ? (
                              <span className="text-[10px] text-sidebar-foreground/40 tabular-nums shrink-0">
                                {subProgress.percentage}%
                              </span>
                            ) : null}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Time estimate */}
      {unanswered > 0 && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 text-xs text-sidebar-foreground/50">
            <Clock className="w-3.5 h-3.5" />
            <span>~{minutesRemaining} min remaining</span>
          </div>
        </div>
      )}
    </nav>
  )
}
