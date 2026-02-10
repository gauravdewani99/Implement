import type { SubsectionOut } from "@/api/types"
import { QuestionRenderer } from "./QuestionRenderer"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { shouldDisplay } from "@/lib/visibility"
import { motion, AnimatePresence } from "framer-motion"
import { expandCollapse } from "@/styles/animations"

export function QuestionGroup({ subsection }: { subsection: SubsectionOut }) {
  const { answers } = useOnboarding()

  return (
    <div id={subsection.key} className="scroll-mt-6">
      <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border">
        {subsection.title}
      </h3>
      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {subsection.questions.map((q) => {
            const visible = shouldDisplay(q.depends_on, answers)
            if (!visible) return null
            return (
              <motion.div key={q.key} layout {...expandCollapse}>
                <QuestionRenderer question={q} />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
