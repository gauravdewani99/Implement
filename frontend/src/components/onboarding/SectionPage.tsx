import type { SectionOut } from "@/api/types"
import { QuestionGroup } from "./QuestionGroup"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/styles/animations"

export function SectionPage({ section }: { section: SectionOut }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial="initial" animate="animate" variants={staggerContainer}>
        <motion.div variants={fadeInUp} className="mb-8">
          <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
        </motion.div>

        <div className="space-y-10">
          {section.subsections.map((sub) => (
            <motion.div key={sub.key} variants={fadeInUp}>
              <QuestionGroup subsection={sub} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
