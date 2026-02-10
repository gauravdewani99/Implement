export function shouldDisplay(
  dependsOn: Record<string, unknown> | null | undefined,
  answers: Record<string, unknown>,
): boolean {
  if (!dependsOn) return true
  return Object.entries(dependsOn).every(([key, expected]) => {
    const actual = answers[key]
    if (Array.isArray(expected)) return expected.includes(actual as string)
    return actual === expected
  })
}
