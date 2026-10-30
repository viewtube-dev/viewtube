import { Type, type Schema } from "@google/genai"
import type { SeoResult } from "../../../types"
import type { AssetGeneratorStrategy, AssetRequest, RubricFinding } from "../AssetGenerator"

const schema: Schema = {
 type: Type.OBJECT,
 properties: {
  analysis: { type: Type.STRING },
  filenames: {
   type: Type.OBJECT,
   properties: { video: { type: Type.STRING }, thumbnail: { type: Type.STRING } },
   required: ["video", "thumbnail"],
  },
  titleSets: {
   type: Type.ARRAY,
   items: {
    type: Type.OBJECT,
    properties: {
     title: { type: Type.STRING },
     thumbnailPrompt: { type: Type.STRING },
     thumbnailText: { type: Type.STRING },
     description: { type: Type.STRING },
     tags: { type: Type.STRING },
     category: { type: Type.STRING },
    },
    required: ["title", "thumbnailPrompt", "thumbnailText", "description", "tags", "category"],
   },
  },
  description: { type: Type.STRING },
  tags: { type: Type.STRING },
  category: { type: Type.STRING },
  pinnedComment: { type: Type.ARRAY, items: { type: Type.STRING } },
  communityPost: { type: Type.ARRAY, items: { type: Type.STRING } },
  shortsScript: { type: Type.STRING },
  educationMoments: { type: Type.STRING },
  social: {
   type: Type.OBJECT,
   properties: { twitter: { type: Type.STRING }, email: { type: Type.STRING } },
   required: ["twitter", "email"],
  },
 },
 required: ["analysis", "filenames", "titleSets", "description", "tags", "category", "pinnedComment", "communityPost", "shortsScript", "educationMoments", "social"],
}

const input = (request: AssetRequest, key: string): string => {
 const value = request.inputs?.[key]
 return typeof value === "string" ? value.trim() : ""
}

export const videoPublisherSeoStrategy: AssetGeneratorStrategy<SeoResult> = {
 assetType: "title",
 promptVersion: "video-publisher-seo-package-v1",
 outputSchemaVersion: "video-publisher-seo-package-v1",
 evidenceClasses: ["channel_profile", "top_videos"],
 schema,
 buildTaskInstruction: (request, evidence) => [
  "Create a complete YouTube publishing SEO package while preserving every requested output field.",
  "Return six distinct title candidates. Each candidate must include a specific thumbnail image prompt, a 2–3 word overlay, a coherent description, candidate-specific comma-separated tags, and a YouTube category.",
  "Also provide the main ready-to-paste description, comma-separated tags, category, three distinct pinned comment options, three community post options, a Shorts adaptation script, timestamped education moments, and social copy for Twitter and email.",
  "Ground claims about the channel, audience, performance, and search demand only in supplied evidence. Never invent statistics, keyword volumes, competitor findings, or search trends. Clearly label hypotheses as hypotheses.",
  "Do not include markdown fences or explanatory preamble outside the requested JSON fields.",
  `Concept: ${input(request, "concept") || "Use the supplied video title and script"}`,
  `Niche: ${input(request, "niche") || "Not specified"}`,
  `Audience: ${input(request, "audience") || "Not specified"}`,
  `Script: ${input(request, "script") || "Not supplied"}`,
  `Existing title: ${input(request, "videoTitle") || "Not supplied"}`,
  `Video length: ${input(request, "videoLength") || "Not supplied"}`,
  `Format: ${input(request, "videoFormat") || "Longform"}`,
  `Channel handle or URL: ${input(request, "channelHandle") || "Not supplied"}`,
  `Additional creator context and links: ${input(request, "resourceLinks") || "Not supplied"}`,
  `Current statistics: ${input(request, "stats") || "Not supplied"}`,
  `Evidence available: ${evidence.summary || "No channel evidence was resolved."}`,
  evidence.missing.length ? `Missing evidence: ${evidence.missing.join(", ")}. Do not invent it.` : "Use only the evidence provided.",
 ].join("\n"),
 toGradeableText: output => [
  output.titleSets?.map(item => item.title).join("\n") || "",
  output.description || "",
  output.tags || "",
  output.titleSets?.map(item => [item.description, item.tags].join("\n")).join("\n") || "",
 ].join("\n"),
 rubric: (output): RubricFinding[] => {
  const findings: RubricFinding[] = []
  if (!Array.isArray(output.titleSets) || output.titleSets.length < 3) {
   findings.push({ rule: "title_candidate_count", detail: "At least three distinct title candidates are required.", severity: "blocking" })
  }
  const titles = (output.titleSets || []).map(item => item.title?.trim()).filter(Boolean)
  if (new Set(titles).size !== titles.length) {
   findings.push({ rule: "title_candidate_uniqueness", detail: "Title candidates must be distinct.", severity: "blocking" })
  }
  if (!output.description?.trim()) findings.push({ rule: "description_required", detail: "A ready-to-paste video description is required.", severity: "blocking" })
  if (!output.tags?.trim()) findings.push({ rule: "tags_required", detail: "A comma-separated tag list is required.", severity: "blocking" })
  return findings
 },
}
