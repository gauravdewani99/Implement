export function shouldDisplay(
  dependsOn: Record<string, unknown> | null | undefined,
  answers: Record<string, unknown>,
): boolean {
  if (!dependsOn) return true
  return Object.entries(dependsOn).every(([key, expected]) => {
    const actual = answers[key]

    // Handle $not_empty operator
    if (
      typeof expected === "object" &&
      expected !== null &&
      !Array.isArray(expected) &&
      "$not_empty" in (expected as Record<string, unknown>)
    ) {
      if (actual === undefined || actual === null || actual === "") return false
      if (Array.isArray(actual)) return actual.length > 0
      if (typeof actual === "object") {
        return Object.values(actual as Record<string, unknown>).some(
          (v) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0),
        )
      }
      return true
    }

    if (Array.isArray(expected)) return expected.includes(actual as string)
    return actual === expected
  })
}
