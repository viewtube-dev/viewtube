/**
 * AssetGenerator — one governed path for every creator asset.
 *
 * `gemini.ts` holds 60 generators, each of which builds a template string, calls the model
 * and returns markdown. None of them consults evidence, applies a style, grades its output,
 * records a trace, or leaves anything an outcome could later be joined to. That is the whole
 * creator-facing asset feature set — scripts, community posts, comment replies, titles,
 * tags, timestamps — running outside the architecture.
 *
 * A new asset type registers a strategy here instead. A strategy supplies only what is
 * genuinely specific to it:
 *
 *   - the evidence classes it needs
 *   - a task instruction (not a whole system prompt)
 *   - a typed output schema (never a markdown string)
 *   - how to read gradeable prose out of that output
 *   - an optional rubric
 *
 * Everything else — style resolution, prompt composition, grounding checks, style scoring,
 * repair, tracing, persistence — is inherited, which is what stops the 61st generator from
 * re-introducing the same gaps.
 *
 * The model call is injected. That keeps this module free of the 4,885-line gemini.ts
 * import, makes every path testable without a provider, and means the Phase 1 gateway
 * becomes a different runner rather than a rewrite.
 */

import type { Schema } from "@google/genai"
import { beginBrainTrace, type BrainTrace } from "./BrainTrace"
import type { EvidenceRecord } from "./EvidenceRecord"
import { auditNumericClaims } from "./numericClaims"
import type { ModelResolution } from "./modelRouting"
import { getContentBuild } from "../asset-engine/ContentBuildRepository"
import { assertContentBuildCapability } from "../asset-engine/ContentBuildCapabilities"
import { buildBrainPromptRunReceipt, promptFamilyForAsset, validateBrainPromptFamilyContext, validateBrainPromptRunReceipt, type BrainPromptRunReceipt } from "./BrainPromptGovernance"
import { formatBrainOutputValidationIssues, validateBrainStructuredOutput } from "./BrainOutputValidation"
import {
 buildStylePromptSection,
 evaluateStyleFidelity,
 resolveStyleProfile,
 type StyleEvaluation,
 type StyleProfile,
} from "./StyleProfile"

export type AssetType =
 | "community_post"
 | "comment_reply"
 | "script"
 | "hook"
 | "short"
 | "broll_plan"
 | "video_topic"
 | "title"
 | "description"
 | "tags"
 | "timestamps"
 | "education_questions"
 | "thumbnail_concept"
 | "thumbnail_analysis"
 | "concept_direction"
 | "scene_plan"

/**
 * The shared constitution. Deliberately small: rules that belong to a single asset type
 * live with that strategy, and rules restated per prompt drift independently — which is how
 * prompts.ts reached 49 standalone system prompts with no shared core.
 */
export const ASSET_CONSTITUTION = [
 "You are ViewTube's creator assistant. You help one specific YouTube creator make better content.",
 "Ground every channel-specific or numeric claim in the supplied evidence. If the evidence does not support a figure, omit it rather than estimating.",
 "When evidence is missing, say plainly what you would need. Never fill a gap with a plausible invention.",
 "Write as this creator writes. The style section is binding, and it outranks your own instincts about what sounds good.",
 "Produce the asset itself, not advice about how to produce it.",
].join("\n")

export const ASSET_CONSTITUTION_VERSION = "asset-constitution-v1"
export const ASSET_CONTEXT_COMPOSITION_VERSION = "asset-context-composition-v1"

export interface RubricFinding {
 /** Rule that failed, e.g. "post_count". */
 rule: string
 detail: string
 /** A blocking finding forces repair; a warning is recorded only. */
 severity: "blocking" | "warning"
}

export interface AssetEvidence {
 /** Canonical typed evidence records, preserved through prompt and trace provenance. */
 records?: EvidenceRecord[]
 /** Evidence class names that were requested. */
 requested: string[]
 /** Stable refs for what resolved, recorded on the trace. */
 refs: string[]
 /** Requested and unavailable. Stated to the model so it can say so honestly. */
 missing: string[]
 /**
  * The evidence payload. Numeric grounding is checked against this, so anything the
  * asset is allowed to cite must be reachable here.
  */
 payload: unknown
 /** Rendered for the prompt. */
 summary: string
}

export const EMPTY_ASSET_EVIDENCE: AssetEvidence = {
 requested: [],
 refs: [],
 missing: [],
 payload: {},
 summary: "",
}

export interface AssetRequest {
 channelId: string
 /** Canonical lifecycle identity for provider-side stage/revision revalidation. */
 contentBuildId?: string
 /** Captured ContentBuild revision; required whenever contentBuildId is supplied. */
 contextRevision?: number
 /** Shared operation identity supplied by the orchestration/handoff layer. */
 operationId?: string
 workflowId?: string
 assetType: AssetType
 /** What the creator asked for. */
 instruction: string
 projectId?: string
 /** Extra strategy-specific inputs, e.g. a publishing schedule or a comment thread. */
 inputs?: Record<string, unknown>
}

export interface AssetModelCall {
 systemInstruction: string
 userText: string
 schema: Schema
 mediaAttachments?: string[]
 tools?: Array<Record<string, unknown>>
}

export interface AssetModelResponse<TOutput> {
 output: TOutput
 model?: ModelResolution
}

export type AssetModelRunner = <TOutput>(
 call: AssetModelCall,
) => Promise<AssetModelResponse<TOutput>>

export interface AssetGeneratorStrategy<TOutput> {
 assetType: AssetType
 /** Versioned independently of the constitution so outcomes are attributable. */
 promptVersion: string
 evidenceClasses: string[]
 schema: Schema
 /** Provider tools explicitly approved for this specialist strategy. */
 tools?: Array<Record<string, unknown>>
 buildTaskInstruction: (request: AssetRequest, evidence: AssetEvidence) => string
 /** Prose to grade for style and numeric grounding. */
 toGradeableText: (output: TOutput) => string
 rubric?: (output: TOutput, request: AssetRequest) => RubricFinding[]
 /** Stable schema version for output validation and outcome attribution. */
 outputSchemaVersion?: string
}

export type AssetStatus =
 /** Passed every gate. */
 | "delivered"
 /** Non-blocking findings only, e.g. an unverified percentage. */
 | "delivered_with_warnings"
 /** Still failing a blocking gate after repair. Surfaced, never silently delivered. */
 | "needs_review"
 /** The model or runner failed. */
 | "failed"

export interface AssetRecord<TOutput = unknown> {
 /** Stable id. This is what an outcome is joined to. */
 id: string
 channelId: string
 projectId?: string
 /** Canonical lifecycle and orchestration identity carried from the request. */
 contentBuildId?: string
 contextRevision?: number
 operationId?: string
 workflowId?: string
 assetType: AssetType
 status: AssetStatus
 output?: TOutput
 createdAt: string
 traceId: string
 evidenceRefs: string[]
 styleProfileId?: string
 styleScore?: number
 /** Figures with no basis in evidence. Non-empty means the asset was not deliverable. */
 fabricatedNumbers: string[]
 unverifiedDerivedNumbers: string[]
 rubricFindings: RubricFinding[]
 repairAttempts: number
 promptVersions: Record<string, string>
 promptReceipt?: BrainPromptRunReceipt
}

export interface AssetGenerationResult<TOutput> {
 record: AssetRecord<TOutput>
 trace: BrainTrace
 style: StyleEvaluation
}

const STORAGE_KEY = "vt_generated_assets_v1"
const MAXIMUM_RETAINED = 300
export const ASSET_RECORDED_EVENT = "vt_asset_recorded"

const canUseStorage = (): boolean =>
 typeof window !== "undefined" && typeof localStorage !== "undefined"

const readAssets = (): AssetRecord[] => {
 if (!canUseStorage()) return []
 try {
  const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  return Array.isArray(parsed) ? (parsed as AssetRecord[]) : []
 } catch {
  return []
 }
}

const persistAsset = (record: AssetRecord): void => {
 if (!canUseStorage()) return
 const next = [record, ...readAssets().filter((entry) => entry.id !== record.id)]
  .slice(0, MAXIMUM_RETAINED)
 try {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent(ASSET_RECORDED_EVENT, { detail: record }))
 } catch {
  // Never lose a generation the creator is looking at over a storage quota.
 }
}

export const listGeneratedAssets = (input?: {
 channelId?: string
 assetType?: AssetType
}): AssetRecord[] =>
 readAssets().filter((record) => {
  if (input?.channelId && record.channelId !== input.channelId) return false
  if (input?.assetType && record.assetType !== input.assetType) return false
  return true
 })

export const getGeneratedAsset = (id: string): AssetRecord | null =>
 readAssets().find((record) => record.id === id) || null

const makeAssetId = (): string =>
 typeof crypto !== "undefined" && "randomUUID" in crypto
  ? `asset_${crypto.randomUUID()}`
  : `asset_${Date.now()}_${Math.random().toString(36).slice(2)}`

const buildSystemInstruction = (input: {
 evidence: AssetEvidence
 style: StyleProfile | null
 taskInstruction: string
 repairInstructions: string[]
}): string => {
 const sections = [ASSET_CONSTITUTION]

 if (input.evidence.summary) {
  sections.push(`CHANNEL EVIDENCE\n${input.evidence.summary}`)
 }
 if (input.evidence.missing.length) {
  // Stated explicitly so the model can name the gap instead of inventing around it.
  sections.push(
   `EVIDENCE NOT AVAILABLE\n${input.evidence.missing.map((entry) => `- ${entry}`).join("\n")}\n` +
   "Do not infer values for anything listed here. Say what is missing if it matters.",
  )
 }

 const styleSection = buildStylePromptSection(input.style)
 if (styleSection) sections.push(styleSection)

 sections.push(`TASK\n${input.taskInstruction}`)

 if (input.repairInstructions.length) {
  sections.push(
   `FIX THE PREVIOUS DRAFT\n${input.repairInstructions.map((entry) => `- ${entry}`).join("\n")}`,
  )
 }

 return sections.join("\n\n")
}

interface GradeResult {
 fabricated: string[]
 unverifiedDerived: string[]
 style: StyleEvaluation
 rubricFindings: RubricFinding[]
 blocking: string[]
}

const grade = <TOutput>(input: {
 output: TOutput
 strategy: AssetGeneratorStrategy<TOutput>
 request: AssetRequest
 evidence: AssetEvidence
 style: StyleProfile | null
}): GradeResult => {
 const text = input.strategy.toGradeableText(input.output)
 const numeric = auditNumericClaims({ text, evidence: input.evidence.payload })
 const style = evaluateStyleFidelity({ text, profile: input.style })
 const schemaIssues = validateBrainStructuredOutput(input.strategy.schema, input.output)
 const schemaFindings: RubricFinding[] = formatBrainOutputValidationIssues(schemaIssues).map((detail) => ({
  rule: "output_schema", detail, severity: "blocking",
 }))
 const rubricFindings = [...schemaFindings, ...(input.strategy.rubric?.(input.output, input.request) || [])]

 const fabricated = numeric.fabricated.map((claim) => claim.token)
 const blocking: string[] = []

 if (fabricated.length) {
  blocking.push(
   `These figures are not supported by the evidence: ${fabricated.join(", ")}. Remove them or replace them with supported values.`,
  )
 }
 if (!style.passed) blocking.push(...style.repairInstructions)
 blocking.push(
  ...rubricFindings.filter((finding) => finding.severity === "blocking").map((finding) => finding.detail),
 )

 return {
  fabricated,
  unverifiedDerived: numeric.unverifiedDerived.map((claim) => claim.token),
  style,
  rubricFindings,
  blocking,
 }
}

/**
 * Generate one asset under every contract.
 *
 * Repairs at most once. A second failure returns `needs_review` rather than either
 * delivering output that failed a gate or looping against a model that is not converging.
 */
export const generateAsset = async <TOutput>(input: {
 request: AssetRequest
 strategy: AssetGeneratorStrategy<TOutput>
 evidence?: AssetEvidence
 runner: AssetModelRunner
 /** Inline media is forwarded to the provider runner, never embedded into prompt text. */
 mediaAttachments?: string[]
 /** Override style resolution, chiefly for tests and previews. */
 styleProfile?: StyleProfile | null
}): Promise<AssetGenerationResult<TOutput>> => {
 const { request, strategy, runner } = input
 const evidence = input.evidence || EMPTY_ASSET_EVIDENCE
 const style = input.styleProfile !== undefined
  ? input.styleProfile
  : resolveStyleProfile({ channelId: request.channelId, assetType: request.assetType })
 const hasInputValue = (...keys: string[]): boolean => keys.some((key) => {
  const value = request.inputs?.[key]
  if (typeof value === "string") return Boolean(value.trim())
  if (Array.isArray(value)) return value.length > 0
  if (value && typeof value === "object") return Object.keys(value).length > 0
  return value !== undefined && value !== null && value !== false
 })
 const availablePromptContext = [
  ...(request.instruction.trim() ? ["creator_instruction", "creator_goal"] : []),
  ...(request.assetType === strategy.assetType && strategy.schema ? ["asset_constraints"] : []),
  ...(hasInputValue("contentPromise", "content_promise", "topic", "videoTopic", "videoTitle", "outline", "script") ? ["content_promise"] : []),
  ...(evidence.summary.trim() && evidence.refs.length ? ["relevant_evidence"] : []),
  ...(style ? ["creator_voice"] : []),
  ...(hasInputValue("currentMetadata", "metadata", "transcript", "duration", "videoDuration", "title", "description", "timestamps") ? ["current_metadata"] : []),
  ...(hasInputValue("publishConstraints", "schedule", "visibility", "audience", "playlist", "publishAt", "plannedPublishAt") ? ["publish_constraints"] : []),
  ...(hasInputValue("schedule") ? ["publishing_schedule"] : []),
  ...(hasInputValue("projectContext", "projectDetails", "projectAssets") ? ["project_context", "project_assets"] : []),
  ...(hasInputValue("targetEntity", "targetId") ? ["target_entity"] : []),
  ...(hasInputValue("allowedOperations") ? ["allowed_operations"] : []),
  ...(hasInputValue("sourceProvenance") && evidence.refs.length ? ["source_provenance"] : []),
  ...(hasInputValue("reportingWindow", "dateRange", "window") ? ["reporting_window"] : []),
  ...(hasInputValue("audienceEvidence") ? ["audience_evidence"] : []),
  ...(hasInputValue("revenueEvidence") ? ["revenue_evidence"] : []),
  ...(hasInputValue("researchQuestion") ? ["research_question"] : []),
 ]
 const promptFamily = promptFamilyForAsset(strategy.assetType)
 const promptFamilyContextIssues = validateBrainPromptFamilyContext(promptFamily, availablePromptContext)

 const trace = beginBrainTrace({
  kind: "asset",
  channelId: request.channelId,
  assetType: request.assetType,
  operationId: request.operationId,
  workflowId: request.workflowId,
 })
 trace.setIntent({ intent: "content_generation" })
 trace.recordCapabilities(["content-generation"])
 trace.recordEvidence({
  requested: strategy.evidenceClasses,
  returned: evidence.refs,
  missing: evidence.missing,
  records: evidence.records,
 })
 trace.recordPromptVersion("constitution", ASSET_CONSTITUTION_VERSION)
 trace.recordPromptVersion(strategy.assetType, strategy.promptVersion)
 trace.recordPromptVersion("prompt_family", promptFamilyForAsset(strategy.assetType))
 trace.recordPromptVersion("context_composer", ASSET_CONTEXT_COMPOSITION_VERSION)
 // Record the context contract before dispatch gating so rejected generations remain
 // diagnosable in the trace even though no provider call was made.
 trace.recordContext({
  sectionsIncluded: availablePromptContext,
  sectionsDropped: promptFamilyContextIssues,
 })
 if (style) trace.recordStyle({ styleProfileId: style.id })

 const assetId = makeAssetId()
 const baseRecord: AssetRecord<TOutput> = {
  id: assetId,
  channelId: request.channelId,
  ...(request.projectId ? { projectId: request.projectId } : {}),
  ...(request.contentBuildId ? { contentBuildId: request.contentBuildId } : {}),
  ...(request.contextRevision !== undefined ? { contextRevision: request.contextRevision } : {}),
  ...(request.operationId ? { operationId: request.operationId } : {}),
  ...(request.workflowId ? { workflowId: request.workflowId } : {}),
  assetType: request.assetType,
  status: "failed",
  createdAt: new Date().toISOString(),
  traceId: trace.id,
  evidenceRefs: evidence.refs,
  ...(style ? { styleProfileId: style.id } : {}),
  fabricatedNumbers: [],
  unverifiedDerivedNumbers: [],
  rubricFindings: [],
  repairAttempts: 0,
  promptVersions: {
   constitution: ASSET_CONSTITUTION_VERSION,
   [strategy.assetType]: strategy.promptVersion,
  },
 }

 const assertProviderDispatchAllowed = () => {
  // Non-ContentBuild previews remain supported. Once a request claims a canonical
  // lifecycle identity, however, both its ID and captured revision are mandatory.
  if (!request.contentBuildId && request.contextRevision === undefined) return
  if (!request.contentBuildId || request.contextRevision === undefined) {
   throw new Error("Provider dispatch requires both ContentBuild ID and captured revision.")
  }
  const build = getContentBuild(request.contentBuildId)
  if (!build) throw new Error(`Provider dispatch denied: unknown ContentBuild ${request.contentBuildId}.`)
  if (build.channelId && build.channelId !== request.channelId) {
   throw new Error(`Provider dispatch denied: channel scope mismatch for ContentBuild ${build.id}.`)
  }
  if (request.projectId && build.legacyProjectId && request.projectId !== build.legacyProjectId) {
   throw new Error(`Provider dispatch denied: project scope mismatch for ContentBuild ${build.id}.`)
  }
  assertContentBuildCapability(build, "generate")
  if (build.revision !== request.contextRevision) {
   throw new Error(`Provider dispatch denied: ContentBuild ${build.id} revision is stale; expected current revision ${build.revision}, received ${request.contextRevision}.`)
  }
 }

 const callModel = async (repairInstructions: string[]) => {
  // Revalidate immediately before each provider call, including the repair call.
  // A stage/revision change while the first request was in flight cannot authorize
  // a second provider request against stale lifecycle context.
  assertProviderDispatchAllowed()
  if (promptFamilyContextIssues.length) {
   throw new Error(`Prompt family ${promptFamily} contract failed: ${promptFamilyContextIssues.join("; ")}`)
  }
  const systemInstruction = buildSystemInstruction({
   evidence,
   style,
   taskInstruction: strategy.buildTaskInstruction(request, evidence),
   repairInstructions,
  })
  trace.recordContext({
   // Character-based estimate. Real tokenisation arrives with the context broker rewrite.
   tokensEstimated: Math.ceil(systemInstruction.length / 4),
   sectionsIncluded: [
    "constitution",
    ...(evidence.summary ? ["evidence"] : []),
    ...(evidence.missing.length ? ["evidence_gaps"] : []),
    ...(style ? ["style"] : []),
    "task",
    ...(repairInstructions.length ? ["repair"] : []),
   ],
  })
  return runner<TOutput>({
   systemInstruction,
   userText: request.instruction,
   schema: strategy.schema,
   ...(strategy.tools?.length ? { tools: strategy.tools } : {}),
   ...(input.mediaAttachments?.length
    ? { mediaAttachments: input.mediaAttachments }
    : {}),
  })
 }

 try {
  let response = await callModel([])
  if (response.model) trace.recordModel(response.model)
  let assessment = grade({ output: response.output, strategy, request, evidence, style })
  let repairAttempts = 0

  if (assessment.blocking.length) {
   repairAttempts = 1
   trace.recordRepairAttempt()
   const repaired = await callModel(assessment.blocking)
   if (repaired.model) trace.recordModel(repaired.model)
   const repairedAssessment = grade({
    output: repaired.output,
    strategy,
    request,
    evidence,
    style,
   })
   // Keep the repair only when it actually resolved the blockers. A repair that trades
   // one blocking failure for another is not progress.
   if (repairedAssessment.blocking.length < assessment.blocking.length) {
    response = repaired
    assessment = repairedAssessment
   }
  }

  const status: AssetStatus = assessment.blocking.length
   ? "needs_review"
   : assessment.unverifiedDerived.length || assessment.rubricFindings.length
    ? "delivered_with_warnings"
    : "delivered"

  trace.recordClaims({
   fabricated: assessment.fabricated,
   unverifiedDerived: assessment.unverifiedDerived,
  })
  trace.recordStyle({ styleScore: assessment.style.score })
  trace.recordGrade("styleFidelity", assessment.style.score)
  trace.recordGrade("grounding", assessment.fabricated.length ? 0 : 100)

  const promptReceipt = buildBrainPromptRunReceipt({
   traceId: trace.id,
   outputId: assetId,
   channelId: request.channelId,
   projectId: request.projectId || null,
   operationId: request.operationId || null,
   workflowId: request.workflowId || null,
   contentBuildId: request.contentBuildId || null,
   contextRevision: request.contextRevision ?? null,
   promptFamily: promptFamilyForAsset(strategy.assetType),
   promptVersion: strategy.promptVersion,
   constitutionVersion: ASSET_CONSTITUTION_VERSION,
   contextResolverVersion: ASSET_CONTEXT_COMPOSITION_VERSION,
   outputSchemaVersion: strategy.outputSchemaVersion || `${strategy.assetType}-schema-v1`,
   requestedModel: response.model?.requested || null,
   servedModel: response.model?.served || null,
   evidenceSnapshotIds: Array.isArray(request.inputs?.evidenceSnapshotIds) ? request.inputs.evidenceSnapshotIds.filter((value): value is string => typeof value === "string") : [],
   evidenceRefs: evidence.refs,
   channelKnowledgeFingerprint: typeof request.inputs?.channelKnowledgeFingerprint === "string" ? request.inputs.channelKnowledgeFingerprint : null,
   projectRevision: typeof request.inputs?.projectRevision === "string" ? request.inputs.projectRevision : null,
   styleProfileVersion: style?.id || null,
   creatorConstraints: Array.isArray(request.inputs?.creatorConstraints)
    ? request.inputs.creatorConstraints.filter((value): value is string => typeof value === "string")
    : [],
   repairCount: repairAttempts,
  })
  const receiptIssues = validateBrainPromptRunReceipt(promptReceipt)
  const finalStatus: AssetStatus = receiptIssues.length ? "needs_review" : status
  if (receiptIssues.length) {
   assessment.rubricFindings.push(...receiptIssues.map((detail) => ({
    rule: "prompt_provenance",
    detail,
    severity: "blocking" as const,
   })))
  }

  const record: AssetRecord<TOutput> = {
   ...baseRecord,
   status: finalStatus,
   output: response.output,
   styleScore: assessment.style.score,
   fabricatedNumbers: assessment.fabricated,
   unverifiedDerivedNumbers: assessment.unverifiedDerived,
   rubricFindings: assessment.rubricFindings,
   repairAttempts,
   promptReceipt,
  }
  persistAsset(record as AssetRecord)

  return {
   record,
   trace: trace.complete({
    status: finalStatus === "needs_review" ? "fallback" : "complete",
    outputRef: record.id,
   }),
   style: assessment.style,
  }
 } catch (error) {
  const failureReason = error instanceof Error ? error.message : String(error)
  const record: AssetRecord<TOutput> = { ...baseRecord, status: "failed" }
  persistAsset(record as AssetRecord)
  return {
   record,
   trace: trace.complete({ status: "failed", outputRef: record.id, failureReason }),
   style: { score: 0, passed: true, deltas: [], violations: [], repairInstructions: [] },
  }
 }
}
