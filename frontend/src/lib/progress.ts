import type { ProgressDetail, SectionOut } from "@/api/types"
import { shouldDisplay } from "./visibility"

interface ProgressResult {
  overall: ProgressDetail
  sections: Record<string, ProgressDetail>
  subsections: Record<string, ProgressDetail>
}

/**
 * Check if an answer is considered "answered" for progress tracking.
 * Handles complex types: arrays of objects (lane_builder), objects (address_form, SFTP),
 * arrays of strings (email_list), key-value pairs, etc.
 */
function isAnswered(answer: unknown): boolean {
  if (answer === undefined || answer === null) return false
  if (typeof answer === "string") return answer !== ""
  if (typeof answer === "number") return true
  if (typeof answer === "boolean") return true
  if (Array.isArray(answer)) return answer.length > 0
  if (typeof answer === "object") {
    return Object.values(answer as Record<string, unknown>).some(
      (v) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0),
    )
  }
  return true
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
        if (isAnswered(answers[q.key])) {
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
