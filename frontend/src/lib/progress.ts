import type { ProgressDetail, SectionOut } from "@/api/types"
import { shouldDisplay } from "./visibility"

interface ProgressResult {
  overall: ProgressDetail
  sections: Record<string, ProgressDetail>
  subsections: Record<string, ProgressDetail>
}

export function computeProgress(
  sections: SectionOut[],
  answers: Record<string, unknown>,
): ProgressResult {
  let overallAnswered = 0
  let overallTotal = 0
  const sectionsProgress: Record<string, ProgressDetail> = {}
  const subsectionsProgress: Record<string, ProgressDetail> = {}

  for (const section of sections) {
    let sectionAnswered = 0
    let sectionTotal = 0

    for (const sub of section.subsections) {
      const subKey = `${section.key}.${sub.key}`
      let subAnswered = 0
      let subTotal = 0

      for (const q of sub.questions) {
        if (!q.required) continue
        if (!shouldDisplay(q.depends_on, answers)) continue

        subTotal++
        const answer = answers[q.key]
        if (answer !== undefined && answer !== null && answer !== "" && !(Array.isArray(answer) && answer.length === 0)) {
          subAnswered++
        }
      }

      subsectionsProgress[subKey] = {
        answered: subAnswered,
        total: subTotal,
        percentage: subTotal === 0 ? 100 : Math.round((subAnswered / subTotal) * 100),
      }
      sectionAnswered += subAnswered
      sectionTotal += subTotal
    }

    sectionsProgress[section.key] = {
      answered: sectionAnswered,
      total: sectionTotal,
      percentage: sectionTotal === 0 ? 100 : Math.round((sectionAnswered / sectionTotal) * 100),
    }
    overallAnswered += sectionAnswered
    overallTotal += sectionTotal
  }

  return {
    overall: {
      answered: overallAnswered,
      total: overallTotal,
      percentage: overallTotal === 0 ? 100 : Math.round((overallAnswered / overallTotal) * 100),
    },
    sections: sectionsProgress,
    subsections: subsectionsProgress,
  }
}
