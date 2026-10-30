import { defaultBrainModelGateway } from "./runtime/BrainModelGateway"

type AvailableVideo = {
 id: string
 title: string
 description?: string
 tags?: string[]
}

const REPLY_SCHEMA: Record<string, unknown> = {
 type: "OBJECT",
 properties: {
  reply: { type: "STRING" },
  suggestedVideoId: { type: "STRING" },
 },
 required: ["reply"],
}

const RECOMMENDATION_SCHEMA: Record<string, unknown> = {
 type: "OBJECT",
 properties: {
  recommendedVideoId: { type: "STRING" },
  matchStrength: { type: "NUMBER" },
  reason: { type: "STRING" },
  bridgePhrase: { type: "STRING" },
 },
 required: ["recommendedVideoId", "matchStrength", "reason", "bridgePhrase"],
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
 Boolean(value) && typeof value === "object" && !Array.isArray(value)

const gatewayGenerate = () => {
 const generate = defaultBrainModelGateway.generateJsonObject
 if (!generate) throw new Error("The Brain model gateway does not support structured JSON generation.")
 return generate
}

export const draftCommentReply = async (input: {
 commentText: string
 authorName: string
 channelContext: string
 availableVideos: AvailableVideo[]
 existingReply?: string
}): Promise<{ reply: string; suggestedVideoId?: string }> => {
 const videos = input.availableVideos.slice(0, 10).map(video => ({
  id: video.id,
  title: video.title,
 }))
 const result = await gatewayGenerate()({
  capability: "analysis",
  systemInstruction: [
   "You are a thoughtful YouTube community manager writing in the creator's voice.",
   "Be warm, concise, specific and useful. Do not invent personal experiences, channel facts, or video details.",
   "A suggested video ID, if any, must be selected from the supplied creator-owned video list.",
   "Do not post the reply. Return a draft for the creator to review.",
  ].join("\n"),
  userText: [
   `Viewer: ${input.authorName || "Viewer"}`,
   `Channel focus: ${input.channelContext || "Not supplied"}`,
   `Viewer comment:\n${input.commentText}`,
   input.existingReply?.trim()
    ? `Existing reply to refine while preserving its intent:\n${input.existingReply.trim()}`
    : "Write a new reply.",
   `Available creator-owned videos (optional recommendations): ${JSON.stringify(videos)}`,
   "Return a JSON object containing reply and an optional suggestedVideoId.",
  ].join("\n\n"),
  responseSchema: REPLY_SCHEMA,
 })
 if (!isRecord(result) || typeof result.reply !== "string" || !result.reply.trim()) {
  throw new Error("The comment reply model returned an empty reply.")
 }
 const candidate = typeof result.suggestedVideoId === "string" ? result.suggestedVideoId.trim() : ""
 const suggestedVideoId = candidate && videos.some(video => video.id === candidate) ? candidate : undefined
 return { reply: result.reply.trim(), ...(suggestedVideoId ? { suggestedVideoId } : {}) }
}

export const recommendVideoForComment = async (input: {
 commentText: string
 availableVideos: AvailableVideo[]
}): Promise<{
 recommendedVideoId: string | null
 matchStrength: number
 reason: string
 bridgePhrase: string
}> => {
 const videos = input.availableVideos.slice(0, 20).map(video => ({
  id: video.id,
  title: video.title,
  description: (video.description || "").slice(0, 200),
  tags: (video.tags || []).slice(0, 5),
 }))
 const result = await gatewayGenerate()({
  capability: "analysis",
  systemInstruction: [
   "You recommend videos from one creator's supplied video library to answer a viewer comment.",
   "Recommend only a supplied video that meaningfully answers or extends the viewer's request.",
   "Never invent video IDs, titles, descriptions, or channel ownership.",
   "If no supplied video is a strong fit, return recommendedVideoId as an empty string and matchStrength 0.",
  ].join("\n"),
  userText: [
   `Viewer comment:\n${input.commentText}`,
   `Available creator-owned videos:\n${JSON.stringify(videos)}`,
   "Return recommendedVideoId, matchStrength from 0 to 100, reason, and a short natural bridgePhrase.",
  ].join("\n\n"),
  responseSchema: RECOMMENDATION_SCHEMA,
 })
 if (!isRecord(result)) throw new Error("The video recommendation model returned an invalid response.")
 const candidate = typeof result.recommendedVideoId === "string" ? result.recommendedVideoId.trim() : ""
 const allowed = candidate && videos.some(video => video.id === candidate)
 if (!allowed) {
  return { recommendedVideoId: null, matchStrength: 0, reason: "", bridgePhrase: "" }
 }
 const strength = Number(result.matchStrength)
 return {
  recommendedVideoId: candidate,
  matchStrength: Number.isFinite(strength) ? Math.min(100, Math.max(0, strength)) : 0,
  reason: typeof result.reason === "string" ? result.reason.trim() : "",
  bridgePhrase: typeof result.bridgePhrase === "string" ? result.bridgePhrase.trim() : "",
 }
}
