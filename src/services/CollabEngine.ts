import { defaultBrainModelGateway } from "./brain/runtime/BrainModelGateway"

export interface CollabPeer {
 id: string
 name: string
 handle: string
 subscriberCount: number
 thumbnail: string
 nicheMatch: number // 0-100
 collabIdea?: string
 outreachMessage?: string
}

const COLLAB_IDEA_SCHEMA: Record<string, unknown> = {
 type: "OBJECT",
 properties: {
  peers: {
   type: "ARRAY",
   items: {
    type: "OBJECT",
    properties: {
     id: { type: "STRING" },
     name: { type: "STRING" },
     handle: { type: "STRING" },
     subscriberCount: { type: "NUMBER" },
     nicheMatch: { type: "NUMBER" },
     collabIdea: { type: "STRING" },
     outreachMessage: { type: "STRING" },
     thumbnail: { type: "STRING" },
    },
    required: ["id", "name", "handle", "subscriberCount", "nicheMatch", "collabIdea", "outreachMessage"],
   },
  },
 },
 required: ["peers"],
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
 Boolean(value) && typeof value === "object" && !Array.isArray(value)

const normalizePeer = (value: unknown): CollabPeer | null => {
 if (!isRecord(value)) return null
 const id = typeof value.id === "string" ? value.id.trim() : ""
 const name = typeof value.name === "string" ? value.name.trim() : ""
 const handle = typeof value.handle === "string" ? value.handle.trim() : ""
 const subscriberCount = Number(value.subscriberCount)
 const nicheMatch = Number(value.nicheMatch)
 const collabIdea = typeof value.collabIdea === "string" ? value.collabIdea.trim() : ""
 const outreachMessage = typeof value.outreachMessage === "string" ? value.outreachMessage.trim() : ""
 if (!id || !name || !handle || !Number.isFinite(subscriberCount) || subscriberCount < 0 ||
  !Number.isFinite(nicheMatch) || nicheMatch < 0 || nicheMatch > 100 || !collabIdea || !outreachMessage) {
  return null
 }
 return {
  id,
  name,
  handle,
  subscriberCount,
  nicheMatch,
  collabIdea,
  outreachMessage,
  thumbnail: typeof value.thumbnail === "string" ? value.thumbnail : "",
 }
}

export const generateCollabOpportunities = async (
 myChannelName: string,
 myNiche: string,
 mySubCount: number,
): Promise<CollabPeer[]> => {
 const prompt = [
  "Identify 6-8 real YouTube peer channels suitable for collaboration.",
  `User channel: "${myChannelName}"`,
  `Niche: "${myNiche}"`,
  `Subscriber count: ${mySubCount}`,
  `Target range: approximately ${Math.round(mySubCount * 0.7)}-${Math.round(mySubCount * 1.3)} subscribers.`,
  "Use Google Search grounding to verify that each suggested channel exists and is relevant.",
  "Do not invent channel names, handles, subscriber counts, thumbnails, or claim that a placeholder is a real creator.",
  "For each channel, give a specific collaboration idea and a concise outreach message describing mutual value.",
  "If a fact cannot be verified from search results, omit that candidate rather than guessing.",
  "Return a JSON object with a peers array matching the response schema.",
 ].join("\n")

 const generateJsonObject = defaultBrainModelGateway.generateJsonObject
 if (!generateJsonObject) throw new Error("The Brain model gateway does not support structured JSON generation.")

 const result = await generateJsonObject({
  userText: prompt,
  systemInstruction: "You are a YouTube collaboration researcher. Ground candidate selection in the supplied live search results. Never fabricate real-world creator identities or metrics.",
  responseSchema: COLLAB_IDEA_SCHEMA,
  capability: "analysis",
  tools: [{ googleSearch: {} }],
 })

 if (!isRecord(result) || !Array.isArray(result.peers)) {
  throw new Error("The collaboration model returned an invalid peer list.")
 }
 const peers = result.peers.map(normalizePeer).filter((peer): peer is CollabPeer => peer !== null)
 if (!peers.length) throw new Error("No collaboration candidates could be verified from the available search results.")
 return peers
}
