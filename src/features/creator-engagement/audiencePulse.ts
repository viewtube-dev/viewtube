export type AudienceFeedbackSource = "comment" | "community-post"

export type AudienceIntent = "request" | "confusion" | "praise" | "complaint" | "desire" | "unknown"

export interface AudienceFeedbackRecord {
  /** Canonical source record ID; never replace it with a generated duplicate. */
  sourceId: string
  source: AudienceFeedbackSource
  text: string | null | undefined
  channelId?: string | null
  videoId?: string | null
  projectId?: string | null
  observedAt?: string | null
}

export interface AudiencePulseSignal {
  id: string
  intent: AudienceIntent
  channelId: string | null
  videoId: string | null
  projectId: string | null
  sourceIds: string[]
  sourceKinds: AudienceFeedbackSource[]
  evidenceIds: string[]
  sourceWindow: { start: string | null; end: string | null }
  confidence: number | null
  interpretation: string
  suggestedTargets: string[]
  limitations: string[]
}

const INTENT_RULES: Array<{ intent: Exclude<AudienceIntent, "unknown">; pattern: RegExp; confidence: number }> = [
  { intent: "request", pattern: /\b(can you|could you|please make|please show|please explain|would you|tutorial on|how do i|how to)\b/i, confidence: 0.72 },
  { intent: "confusion", pattern: /\b(i don't understand|i do not understand|confused|what does .* mean|how does .* work|unclear|lost me)\b/i, confidence: 0.7 },
  { intent: "complaint", pattern: /\b(broken|doesn't work|does not work|wrong|disappointed|too long|too short|problem with|issue with|stop doing)\b/i, confidence: 0.68 },
  { intent: "praise", pattern: /\b(thank you|thanks|love this|loved this|helpful|great video|excellent|awesome|well explained)\b/i, confidence: 0.7 },
  { intent: "desire", pattern: /\b(i wish|i want|i would love|more videos about|more of this|next time|another video on)\b/i, confidence: 0.68 },
]

/** Conservative, explainable classification. Unknown text stays unknown; no model output is fabricated. */
export const classifyAudienceIntent = (text: string | null | undefined): { intent: AudienceIntent; confidence: number | null } => {
  const normalized = typeof text === "string" ? text.trim() : ""
  if (!normalized) return { intent: "unknown", confidence: null }
  const matches = INTENT_RULES.filter((rule) => rule.pattern.test(normalized))
  if (matches.length !== 1) return { intent: "unknown", confidence: null }
  return { intent: matches[0].intent, confidence: matches[0].confidence }
}

const targetFor = (intent: AudienceIntent, sourceKinds: AudienceFeedbackSource[]): string[] => {
  if (intent === "unknown") return []
  const targets: string[] = []
  if (["request", "confusion", "desire"].includes(intent)) targets.push("content-architect")
  if (["complaint", "praise"].includes(intent)) targets.push("experiment-lab")
  if (sourceKinds.includes("comment")) targets.push("comment-responder")
  if (sourceKinds.includes("community-post")) targets.push("community-posts")
  return [...new Set(targets)]
}

const parseDate = (value: string | null | undefined): number | null => {
  if (!value) return null
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * Read-only projection over existing comment/community records.
 * It stores no feedback and does not enqueue or publish any action.
 */
export const buildAudiencePulseSignals = (records: AudienceFeedbackRecord[]): AudiencePulseSignal[] => {
  const unique = new Map<string, AudienceFeedbackRecord>()
  for (const record of records) {
    const sourceId = typeof record.sourceId === "string" ? record.sourceId.trim() : ""
    if (!sourceId) continue
    const key = `${record.source}:${sourceId}`
    if (!unique.has(key)) unique.set(key, { ...record, sourceId })
  }

  const groups = new Map<string, { intent: AudienceIntent; records: AudienceFeedbackRecord[]; confidences: number[] }>()
  for (const record of unique.values()) {
    const classification = classifyAudienceIntent(record.text)
    const scope = [record.channelId || "unscoped", record.videoId || "no-video", record.projectId || "no-project"].join(":")
    // Unknown observations are deliberately not clustered into a false shared theme.
    const key = classification.intent === "unknown"
      ? `${scope}:unknown:${record.source}:${record.sourceId}`
      : `${scope}:${classification.intent}`
    const group = groups.get(key) || { intent: classification.intent, records: [], confidences: [] }
    group.records.push(record)
    if (classification.confidence !== null) group.confidences.push(classification.confidence)
    groups.set(key, group)
  }

  return [...groups.entries()].map(([key, group]) => {
    const times = group.records.map((record) => parseDate(record.observedAt)).filter((value): value is number => value !== null).sort((a, b) => a - b)
    const sourceIds = [...new Set(group.records.map((record) => record.sourceId))]
    const sourceKinds = [...new Set(group.records.map((record) => record.source))]
    const intent = group.intent
    const limitations = [
      "Intent is a conservative text-pattern inference, not a verified statement of audience intent.",
      "Only supplied source records are represented; this is not a complete audience sample.",
    ]
    if (intent === "unknown") limitations.push("Insufficient unambiguous text evidence to classify this observation.")
    if (!times.length) limitations.push("Source timestamps are missing or invalid.")
    if (group.records.some((record) => !record.channelId)) limitations.push("One or more source records have no channel scope.")
    return {
      id: `audience-pulse:${key}`,
      intent,
      channelId: group.records[0].channelId || null,
      videoId: group.records[0].videoId || null,
      projectId: group.records[0].projectId || null,
      sourceIds,
      sourceKinds,
      evidenceIds: sourceIds,
      sourceWindow: {
        start: times.length ? new Date(times[0]).toISOString() : null,
        end: times.length ? new Date(times[times.length - 1]).toISOString() : null,
      },
      confidence: group.confidences.length
        ? Math.round(group.confidences.reduce((sum, value) => sum + value, 0) / group.confidences.length * 100) / 100
        : null,
      interpretation: intent === "unknown"
        ? "Unclassified audience observation; review the source before taking action."
        : `${intent[0].toUpperCase()}${intent.slice(1)} signal from ${sourceIds.length} distinct source record(s).`,
      suggestedTargets: targetFor(intent, sourceKinds),
      limitations,
    }
  }).sort((a, b) => b.sourceIds.length - a.sourceIds.length || a.id.localeCompare(b.id))
}

/** Adapter from the existing YouTube comment-thread shape; source records remain owned by the comment controller/API. */
export const projectCommentThreadsToAudienceFeedback = (
  threads: Array<{
    id?: string
    snippet?: { videoId?: string; topLevelComment?: { id?: string; snippet?: { textOriginal?: string; textDisplay?: string; publishedAt?: string } } }
  }>,
  channelId?: string | null,
): AudienceFeedbackRecord[] => threads.flatMap((thread) => {
  const comment = thread.snippet?.topLevelComment
  const sourceId = comment?.id || thread.id
  if (!sourceId) return []
  return [{
    sourceId,
    source: "comment" as const,
    text: comment?.snippet?.textOriginal ?? comment?.snippet?.textDisplay ?? "",
    channelId: channelId || null,
    videoId: thread.snippet?.videoId || null,
    observedAt: comment?.snippet?.publishedAt || null,
  }]
})

/** Project a signal into the existing Brain evidence contract; this is a projection, not a second evidence store. */
export const audiencePulseSignalToBrainClaim = (
  signal: AudiencePulseSignal,
): import("../../services/brain/BrainEvidenceContract").BrainEvidenceClaim => ({
  id: signal.id,
  sourceOwner: "creator-engagement",
  sourceId: signal.id,
  sourceSnapshotId: null,
  channelId: signal.channelId,
  projectId: signal.projectId,
  contentBuildId: null,
  videoId: signal.videoId,
  entityType: "audience-signal",
  entityId: signal.id,
  claim: signal.intent === "unknown"
    ? "Unclassified audience observation"
    : `Audience ${signal.intent} signal`,
  metric: "source-record-count",
  value: signal.sourceIds.length,
  unit: "source-records",
  timeframe: signal.sourceWindow.start || signal.sourceWindow.end
    ? { kind: "source-observed-window", start: signal.sourceWindow.start, end: signal.sourceWindow.end }
    : null,
  freshness: "unknown",
  epistemicState: signal.intent === "unknown" ? "OBSERVED" : "INFERRED",
  confidence: signal.confidence,
  provenance: {
    evidenceIds: [...signal.evidenceIds],
    sourceRoute: "/studio#comment-responder",
    sourceVersion: "audience-pulse-patterns-v1",
  },
  limitations: [...signal.limitations],
})
