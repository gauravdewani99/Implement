import { cn } from "@/lib/utils"
import { ProgressBar } from "./ProgressBar"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { computeProgress } from "@/lib/progress"
import { ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { expandCollapse } from "@/styles/animations"

const SECTION_ICONS: Record<string, string> = {
  return_initiation: "1",
  first_mile: "2",
  processing: "3",
  last_mile: "4",
  notifications_messaging: "5",
  data_insights: "6",
}

export function SectionStepper() {
  const { sections, activeSection, setActiveSection, answers } = useOnboarding()
  const progress = computeProgress(sections, answers)

  return (
    <nav className="p-4 space-y-1">
      <div className="mb-4">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">Overall Progress</p>
        <ProgressBar percentage={progress.overall.percentage} />
      </div>
      {sections.map((section) => {
        const isActive = activeSection === section.key
        const sectionProgress = progress.sections[section.key]
        return (
          <div key={section.key}>
            <button
              onClick={() => setActiveSection(section.key)}
              aria-expanded={isActive}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium shrink-0",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  sectionProgress?.percentage === 100 && !isActive && "bg-status-completed text-status-completed-foreground",
                )}
              >
                {SECTION_ICONS[section.key]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{section.title}</p>
                {sectionProgress && (
                  <ProgressBar percentage={sectionProgress.percentage} size="sm" showLabel={false} className="mt-1" />
                )}
              </div>
              <ChevronRight
                className={cn("w-4 h-4 shrink-0 transition-transform text-muted-foreground", isActive && "rotate-90")}
              />
            </button>
            <AnimatePresence>
              {isActive && (
                <motion.div {...expandCollapse} className="ml-9 mt-1 space-y-0.5 overflow-hidden">
                  {section.subsections.map((sub) => {
                    const subKey = `${section.key}.${sub.key}`
                    const subProgress = progress.subsections[subKey]
                    return (
                      <a
                        key={sub.key}
                        href={`#${sub.key}`}
                        className="flex items-center justify-between px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <span className="truncate">{sub.title}</span>
                        {subProgress && (
                          <span className="text-xs tabular-nums shrink-0 ml-2">{subProgress.percentage}%</span>
                        )}
                      </a>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </nav>
  )
}
