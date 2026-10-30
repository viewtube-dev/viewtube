import { Type, type Schema } from "@google/genai"
import type { AssetGeneratorStrategy, AssetRequest, RubricFinding } from "../AssetGenerator"

export interface PinnedCommentDraft {
 body: string
 intent: string
}

const schema: Schema = {
 type: Type.OBJECT,
 properties: {
  body: { type: Type.STRING, description: "One pinned comment draft, in the creator's voice." },
  intent: { type: Type.STRING, description: "The discussion or next step this comment invites." },
 },
 required: ["body", "intent"],
}

const value = (request: AssetRequest, key: string): string => {
 const entry = request.inputs?.[key]
 return typeof entry === "string" ? entry.trim() : ""
}

export const pinnedCommentStrategy: AssetGeneratorStrategy<PinnedCommentDraft> = {
 assetType: "comment_reply",
 promptVersion: "pinned-comment-v1",
 outputSchemaVersion: "pinned-comment-v1",
 evidenceClasses: ["channel_profile", "top_videos"],
 schema,
 buildTaskInstruction: (request, evidence) => [
  "Write exactly one pinned top-level comment for the creator's own YouTube video.",
  "Keep the comment at or below 280 characters.",
  "Sound natural and specific to the video, not like a generic engagement template.",
  "Invite a genuine discussion, useful viewer response, or relevant next step.",
  "Do not use hashtags, numbering, quotation marks, or explanatory preamble.",
  `Video title: ${value(request, "videoTitle") || "Not supplied"}`,
  `Video ID: ${value(request, "videoId") || "Not supplied"}`,
  `Published at: ${value(request, "publishedAt") || "Unknown"}`,
  evidence.missing.length
   ? `Do not invent missing channel facts: ${evidence.missing.join(", ")}.`
   : "Use only the supplied channel and video context for factual claims.",
  "Return the comment itself as body and a short internal intent. Do not include the intent in the comment.",
 ].join("\n"),
 toGradeableText: output => output.body || "",
 rubric: output => {
  const findings: RubricFinding[] = []
  const body = output.body?.trim() || ""
  if (!body) findings.push({ rule: "comment_body", detail: "A pinned comment body is required.", severity: "blocking" })
  if (body.length > 280) findings.push({ rule: "comment_length", detail: `Pinned comment must be 280 characters or fewer; received ${body.length}.`, severity: "blocking" })
  if (!output.intent?.trim()) findings.push({ rule: "comment_intent", detail: "Record the discussion purpose for the draft.", severity: "warning" })
  return findings
 },
}
