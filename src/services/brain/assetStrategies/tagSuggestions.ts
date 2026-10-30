import { Type, type Schema } from "@google/genai"
import type { AssetGeneratorStrategy, AssetRequest, RubricFinding } from "../AssetGenerator"

export interface TagSuggestion {
 tag: string
 score: number
 searchVolume: number
 competition: number
 rank: number
 tripleKeyword: boolean
}

const schema: Schema = {
 type: Type.ARRAY,
 items: {
  type: Type.OBJECT,
  properties: {
   tag: { type: Type.STRING, description: "A relevant YouTube tag." },
   score: { type: Type.INTEGER, description: "Subjective SEO fit estimate from 1 to 100; not a measured metric." },
   searchVolume: { type: Type.INTEGER, description: "Directional estimated monthly search volume, not live YouTube data." },
   competition: { type: Type.INTEGER, description: "Directional estimated competing-video count, not a live measurement." },
   rank: { type: Type.INTEGER, description: "Speculative potential ranking position, not a measured current position." },
   tripleKeyword: { type: Type.BOOLEAN, description: "Whether the tag phrase occurs in both supplied title and description." },
  },
  required: ["tag", "score", "searchVolume", "competition", "rank", "tripleKeyword"],
 },
}

const read = (request: AssetRequest, key: string): string => {
 const value = request.inputs?.[key]
 return typeof value === "string" ? value.trim() : ""
}

export const tagSuggestionsStrategy: AssetGeneratorStrategy<TagSuggestion[]> = {
 assetType: "tags",
 promptVersion: "tag-suggestions-v1",
 outputSchemaVersion: "tag-suggestions-v1",
 evidenceClasses: ["channel_profile", "top_videos"],
 schema,
 buildTaskInstruction: (request, evidence) => {
  const tags = Array.isArray(request.inputs?.tags)
   ? request.inputs.tags.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim()))
   : []
  const analyze = read(request, "mode") === "analyze"
  return [
   analyze
    ? "Analyze the supplied tags and return one assessment per supplied tag. Do not silently replace them with new tags."
    : "Generate up to 10 distinct, highly relevant YouTube tags for the supplied video.",
   "Use a balanced mix of specific long-tail phrases and broader topic terms.",
   "Scores are subjective relevance estimates. Search volume, competition and potential rank are directional estimates, not live YouTube search measurements or verified current positions.",
   "Never describe estimates as measured facts. If a number cannot be responsibly estimated, use zero and explain the uncertainty in the tag context rather than inventing precision.",
   "Set tripleKeyword true only when the tag phrase appears in both the supplied title and description, ignoring case.",
   "Do not claim access to live search volume, competitor counts, or actual search rank.",
   `Title: ${read(request, "title") || "Not supplied"}`,
   `Description: ${read(request, "description") || "Not supplied"}`,
   `Existing tags: ${tags.length ? tags.join(", ") : "None supplied"}`,
   evidence.summary ? `Channel context:\n${evidence.summary}` : "No additional channel evidence was supplied.",
   evidence.missing.length ? `Do not invent missing channel facts: ${evidence.missing.join(", ")}.` : "",
   "Return only the structured array. Keep tag text concise and do not include hashtags.",
  ].filter(Boolean).join("\n")
 },
 toGradeableText: output => output.map(item => item.tag).join("\n"),
 rubric: (output): RubricFinding[] => {
  const findings: RubricFinding[] = []
  const seen = new Set<string>()
  if (!Array.isArray(output) || output.length === 0) {
   findings.push({ rule: "tags_required", detail: "At least one tag suggestion is required.", severity: "blocking" })
   return findings
  }
  output.forEach((item, index) => {
   const tag = typeof item.tag === "string" ? item.tag.trim() : ""
   const normalized = tag.toLowerCase()
   if (!tag) findings.push({ rule: "tag_required", detail: `Tag ${index + 1} must not be empty.`, severity: "blocking" })
   if (normalized && seen.has(normalized)) findings.push({ rule: "tag_unique", detail: `Tag ${index + 1} duplicates an earlier suggestion.`, severity: "blocking" })
   if (normalized) seen.add(normalized)
   if (!Number.isInteger(item.score) || item.score < 1 || item.score > 100) findings.push({ rule: "tag_score_range", detail: `Tag ${index + 1} score must be an integer from 1 to 100.`, severity: "blocking" })
   if (![item.searchVolume, item.competition].every(value => Number.isInteger(value) && value >= 0)) findings.push({ rule: "tag_estimate_nonnegative", detail: `Tag ${index + 1} search and competition estimates must be non-negative integers.`, severity: "blocking" })
   if (!Number.isInteger(item.rank) || item.rank < 1) findings.push({ rule: "tag_rank_positive", detail: `Tag ${index + 1} potential rank must be a positive integer.`, severity: "blocking" })
   if (typeof item.tripleKeyword !== "boolean") findings.push({ rule: "tag_keyword_flag", detail: `Tag ${index + 1} must declare its title/description keyword match.`, severity: "blocking" })
  })
  return findings
 },
}
