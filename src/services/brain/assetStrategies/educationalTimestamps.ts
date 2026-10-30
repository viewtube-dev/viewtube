import { Type, type Schema } from "@google/genai"
import type { AssetGeneratorStrategy, AssetRequest, RubricFinding } from "../AssetGenerator"

const schema: Schema = {
 type: Type.ARRAY,
 items: { type: Type.STRING, description: "A suggested MM:SS planning marker followed by one educational viewer question." },
}

const read = (request: AssetRequest, key: string): string => {
 const value = request.inputs?.[key]
 return typeof value === "string" ? value.trim() : ""
}

export const educationalTimestampStrategy: AssetGeneratorStrategy<string[]> = {
 assetType: "timestamps",
 promptVersion: "educational-timestamp-questions-v1",
 outputSchemaVersion: "educational-timestamp-questions-v1",
 evidenceClasses: ["channel_profile", "top_videos"],
 schema,
 buildTaskInstruction: (request, evidence) => {
  const tags = Array.isArray(request.inputs?.tags)
   ? request.inputs.tags.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim()))
   : []
  return [
   "Generate exactly five concise educational viewer questions for the supplied video topic.",
   "Each item must begin with a plausible MM:SS planning marker, then an em dash, then one clear question.",
   "These are suggested planning markers, not verified video timestamps. Never claim you inspected the video or know its actual timeline.",
   "Do not invent source facts, quotes, links, chapters or completed timestamps.",
   "Keep the questions useful for planning or validating an educational section.",
   `Video title: ${read(request, "title") || "Untitled educational video"}`,
   `Description: ${read(request, "description") || "No description supplied."}`,
   `Tags: ${tags.length ? tags.join(", ") : "No tags supplied."}`,
   evidence.summary ? `Channel context:\n${evidence.summary}` : "No additional channel evidence was supplied.",
   evidence.missing.length ? `Avoid inventing missing channel facts: ${evidence.missing.join(", ")}.` : "",
   "Return only a JSON array containing exactly five strings.",
  ].filter(Boolean).join("\n")
 },
 toGradeableText: output => output.join("\n"),
 rubric: (output): RubricFinding[] => {
  const findings: RubricFinding[] = []
  if (!Array.isArray(output) || output.length !== 5) {
   findings.push({ rule: "timestamp_question_count", detail: "Exactly five timestamp questions are required.", severity: "blocking" })
  }
  ;(Array.isArray(output) ? output : []).forEach((entry, index) => {
   if (typeof entry !== "string" || !/^\d{2}:\d{2}\s+[—-]\s+\S/.test(entry.trim())) {
    findings.push({ rule: "timestamp_marker_format", detail: `Question ${index + 1} must begin with an MM:SS planning marker and an em dash.`, severity: "blocking" })
   }
  })
  return findings
 },
}
