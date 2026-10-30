import { BrainSignal, ContextPacket, BrainMemorySchema } from "../../types"
import { getVaultKey } from "../keyVault"
import * as db from "./Persistence"
import {
 getActiveBrainControlChannel,
 readBrainUserControls,
 shouldBrainLearnFromInteraction,
} from "./BrainUserControls"
import { buildToolChannelProfileContext } from "./ChannelProfileAdapter"
import { defaultBrainModelGateway } from "./runtime/BrainModelGateway"

// Brain Core depends on the provider-neutral gateway. The gateway defers
// loading the Gemini compatibility provider until a generation method is used.
// `hasGeminiKey` runs synchronously in the hot `emitSignal` path, so this
// module keeps its lightweight localStorage probe instead of loading a provider.
const hasGeminiKey = (): boolean => {
 if (typeof window === "undefined") return false
 try {
  const configured =
   getVaultKey("gemini") ||
   localStorage.getItem("yt_api_key") ||
   localStorage.getItem("vt_gemini_api_key") ||
   localStorage.getItem("gemini_api_key") ||
   localStorage.getItem("google_api_key") ||
   ""
  return configured.trim().length > 0
 } catch {
  return false
 }
}

let brainCache: BrainMemorySchema | null = null;
let reflectionScheduled = false
let reflectionInFlight: Promise<void> | null = null

const DEFAULT_SCHEMA: BrainMemorySchema = {
 identityAndAspirations: "User is a YouTube creator exploring their niche.",
 contentDNA: "Standard YouTube format, no strong visual style defined yet.",
 performanceLedger: "Awaiting analytics data.",
 futureStateMap: "Focusing on consistent uploads.",
 interactionCount: 0,
 lastReflection: Date.now(),
 tools: []
}

export const getBrainMemory = (): BrainMemorySchema => {
 return brainCache || DEFAULT_SCHEMA;
}

export const initializeBrain = async () => {
 try {
  const saved = await db.getBrainSchemaDB();
  brainCache = saved ? { ...DEFAULT_SCHEMA, ...saved } : DEFAULT_SCHEMA;
 } catch {
  brainCache = DEFAULT_SCHEMA;
 }
}

export const saveBrainMemory = async (schema: BrainMemorySchema) => {
 brainCache = schema;
 await db.saveBrainSchemaDB(schema);
}

export const emitSignal = async (toolId: string, action: string, payload: unknown) => {
 const controls = readBrainUserControls()
 if (!shouldBrainLearnFromInteraction(controls)) return

 const schema = { ...getBrainMemory(), tools: [...getBrainMemory().tools] }
 
 if (!schema.tools.includes(toolId)) {
  schema.tools.push(toolId)
 }
 
 schema.interactionCount += 1
 await saveBrainMemory(schema)

 const signal: BrainSignal = {
  id: crypto.randomUUID(),
  toolId,
  action,
  payload,
  timestamp: Date.now()
 }

 await db.addBrainSignalDB(signal);

 const TIME_THRESHOLD = 24 * 60 * 60 * 1000
 if (schema.interactionCount >= 5 || (Date.now() - schema.lastReflection > TIME_THRESHOLD)) {
  if (!hasGeminiKey()) {
   return
  }
  if (reflectionScheduled || reflectionInFlight) return
  reflectionScheduled = true
  setTimeout(() => {
   reflectionScheduled = false
   reflectAndCompress().catch(e => console.error("Reflection background task failed:", e))
  }, 0)
 }
}

export const consultBrain = async (
 toolId: string,
 requestDetails?: unknown,
): Promise<ContextPacket> => {
 void requestDetails
 const controls = readBrainUserControls()
 const schema = controls.enabled && controls.personalization
  ? getBrainMemory()
  : DEFAULT_SCHEMA
 const activeChannelId = getActiveBrainControlChannel()
 const toolProfile = controls.enabled && controls.personalization && activeChannelId
  ? await buildToolChannelProfileContext({ channelId: activeChannelId, toolId }).catch(() => null)
  : null
 const profileContext = toolProfile
  ? [toolProfile.profileSummary, ...toolProfile.learnedClaims.map((claim) => `Learned: ${claim}`)]
    .filter(Boolean)
    .join("\n")
    .slice(0, 3200)
  : ""
 
 const packet: ContextPacket = {
  identityAndAspirations: schema.identityAndAspirations,
  contentDNA: schema.contentDNA,
  performanceLedger: controls.allowAnalytics
   ? schema.performanceLedger
   : "Channel analytics access is disabled by the creator.",
  futureStateMap: schema.futureStateMap,
  learnedPreferences: controls.personalization
   ? profileContext || "No channel-specific profile context is available yet."
   : "Personalization is disabled by the creator.",
  strategicAdvice: controls.enabled ? schema.strategicAdvice : undefined
 }
 
 return packet
}

const runReflection = async (): Promise<void> => {
 const controls = readBrainUserControls()
 if (!shouldBrainLearnFromInteraction(controls)) return

 const signals = await db.getBrainSignalsDB();
 if (signals.length === 0) return

 const schema = getBrainMemory()
 
 const prompt = `
  You are the "ViewTube Brain" Central Intelligence Layer.
  Your task is to compress recent tool interactions into the permanent Global User Context.
  
  CURRENT STATE:
  ${JSON.stringify({
   identityAndAspirations: schema.identityAndAspirations,
   contentDNA: schema.contentDNA,
   performanceLedger: controls.allowAnalytics ? schema.performanceLedger : "Analytics access disabled",
   futureStateMap: schema.futureStateMap
  }, null, 2)}
  
  RECENT TOOL SIGNALS:
  ${JSON.stringify(signals, null, 2)}
  
  Identify user preference patterns and update the state.
  
  CRITICAL USER-CONTROL RULES:
  - Do not reconstruct or infer private analytics when analytics access is disabled.
  - Do not promote tool interactions into creator memory when personalization or learning is disabled.
  - User corrections and explicit preferences outrank inferred patterns.
  
  CRITICAL: Look for "Conflict Signals":
  - If user stated goals (Aspirations) clash with current performance (Ledger), suggest a pivot in futureStateMap.
  - If contentDNA is inconsistent across tools, consolidate into a "Primary Style" and "Secondary Style".
  - If tool feedback (THUMBS_DOWN) highlights recurring failures, document them as "Anti-Patterns" in Content DNA.

  Return a new JSON object with ONLY these 5 updated string fields:
  - identityAndAspirations
  - contentDNA
  - performanceLedger
  - futureStateMap
  - strategicAdvice (A 1-sentence "OODA Loop" directive for the user)
  
  Make the summaries dense, strategic, and highly actionable for AI agents.
  Use a direct, evidence-aware tone.
 `

 try {
  // The gateway keeps Brain orchestration provider-neutral while its
  // compatibility provider dynamically loads Gemini only when generation runs.
  const generateJsonObject = defaultBrainModelGateway.generateJsonObject
  if (!generateJsonObject) {
   throw new Error("The Brain model gateway does not support JSON generation")
  }
  const result = await generateJsonObject({
   userText: prompt,
   systemInstruction: "Follow the user message instructions and return only the requested JSON object.",
   capability: "analysis",
  })
  if (!result || typeof result !== "object" || Array.isArray(result)) {
   throw new Error("The Brain reflection model returned an invalid JSON object")
  }

  const newSchema = { 
   ...schema, 
   ...result, 
   interactionCount: 0, 
   lastReflection: Date.now() 
  }
  await saveBrainMemory(newSchema)
  await db.clearBrainSignalsDB();
 } catch (error) {
  const reason = error instanceof Error ? error.message : String(error)
  if (/requires a paid plan|Gemini API key is missing/i.test(reason)) {
   return
  }
  console.error("[BrainEngine] Reflection failed:", error)
 }
}

export const reflectAndCompress = (): Promise<void> => {
 if (reflectionInFlight) return reflectionInFlight
 reflectionInFlight = runReflection().finally(() => {
  reflectionInFlight = null
 })
 return reflectionInFlight
}
