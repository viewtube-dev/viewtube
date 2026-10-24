import type { AIBrainAnswerModule } from "../types"

const normalizeForExactComparison = (value: string): string =>
 value.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase()

/**
 * Removes only exact duplicate prose. Prefix similarity is not proof of duplication:
 * a longer module may add the actionable detail that the headline leaves out.
 * Structured payloads and explicit missing-data explanations always remain visible.
 */
export const selectBrainAnswerModules = (
 modules: AIBrainAnswerModule[],
 keyInsight: string,
): AIBrainAnswerModule[] => {
 const normalizedInsight = normalizeForExactComparison(keyInsight)

 return modules.filter((module) => {
  const body = normalizeForExactComparison(module.body || "")
  const hasStructuredData = Boolean(
   module.data?.metrics?.length ||
   module.data?.items?.length ||
   (module.data?.points?.length || 0) >= 2,
  )
  const hasMissingDataExplanation = Boolean(module.data?.missingReason?.trim())

  if (hasStructuredData || hasMissingDataExplanation) return true
  if (!body) return false
  return !normalizedInsight || body !== normalizedInsight
 })
}
