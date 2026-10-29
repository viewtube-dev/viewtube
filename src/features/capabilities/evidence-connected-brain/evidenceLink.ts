/**
 * Evidence-Connected AI Brain — pure linking core (roadmap item 2).
 *
 * Enforces the roadmap guardrail that answers display the exact evidence pack
 * supplied to the turn, with canonical IDs preserved, plus clear limits:
 *   - `linkAnswerToEvidence` — only evidence from the supplied pack can appear,
 *     keyed by canonical evidence ID (fabricated refs are dropped and reported).
 *   - `detectUnsupportedNumbers` — the invented-figure scan, ported from
 *     `BrainOrchestrator.ts` (`unsupportedNumbers`): any number in the response
 *     that does not appear in the evidence snapshot is surfaced as unsupported.
 *   - `deriveAnswerLimits` — limits assembled from evidence missingness,
 *     freshness, limitations and creator controls.
 */
import type { BrainUserControlsView } from "../shared/brainContracts"
import type { BrainTurnSourceData } from "../shared/capabilityAdapter"

/** Canonical evidence reference as supplied to the turn (see shared/brainContracts.ts). */
export interface SuppliedEvidenceRef {
  /** Canonical evidence ID — must be preserved verbatim into the answer UI. */
  evidenceId: string
  label: string
  source: string
  /** Numeric/text values this evidence legitimately contains (for the number scan). */
  knownValues?: Array<string | number>
}

export interface LinkedEvidenceRef {
  evidenceId: string
  label: string
  source: string
}

export interface EvidenceLinkResult {
  linked: LinkedEvidenceRef[]
  /** IDs claimed by the answer that were NOT in the supplied pack (dropped). */
  droppedNonCanonicalIds: string[]
}

const collectKnownNumbers = (refs: SuppliedEvidenceRef[]): Set<string> => {
  const known = new Set<string>(["1", "2", "3", "4", "5", "7", "30", "60", "90"])
  for (const ref of refs) {
    for (const value of ref.knownValues ?? []) {
      const raw = String(value)
      const normalized = raw.replace(/,/g, "")
      known.add(normalized)
      // Also admit the compact display form the orchestrator tolerates (e.g. 480K).
      const compact = raw.match(/^([\d.,]+)\s*([KMB])$/i)
      if (compact) known.add(normalized)
      for (const piece of normalized.split(/\D+/)) {
        if (piece) known.add(piece)
      }
    }
  }
  return known
}

/**
 * Port of `BrainOrchestrator.unsupportedNumbers`: every numeric token in the
 * answer that the supplied evidence cannot account for.
 */
export function detectUnsupportedNumbers(answerText: string, refs: SuppliedEvidenceRef[]): string[] {
  const known = collectKnownNumbers(refs)
  const matches = answerText.match(/\b\d[\d,]*(?:\.\d+)?%?(?:[KMB])?(?![\w])/g) || []
  return Array.from(
    new Set(
      matches.filter((match) => {
        const normalized = match.replace(/,/g, "")
        if (known.has(normalized)) return false
        // Percent forms compare on the bare base ("4.2%" against known "4.2").
        const bare = normalized.replace(/%$/, "")
        if (bare !== normalized && known.has(bare)) return false
        return true
      }),
    ),
  )
}

/** Link the answer to the supplied pack; never let non-canonical refs through. */
export function linkAnswerToEvidence(
  claimedEvidenceIds: string[],
  suppliedPack: SuppliedEvidenceRef[],
): EvidenceLinkResult {
  const suppliedById = new Map(suppliedPack.map((ref) => [ref.evidenceId, ref]))
  const linked: LinkedEvidenceRef[] = []
  const dropped: string[] = []
  for (const id of claimedEvidenceIds) {
    const ref = suppliedById.get(id)
    if (ref) {
      // Canonical ID preserved verbatim.
      linked.push({ evidenceId: ref.evidenceId, label: ref.label, source: ref.source })
    } else {
      dropped.push(id)
    }
  }
  return { linked, droppedNonCanonicalIds: dropped }
}

/**
 * Limits shown next to every answer: what the evidence could not support,
 * what was missing/stale, and which creator permissions narrowed the turn.
 */
export function deriveAnswerLimits(input: {
  userText: string
  suppliedPack: SuppliedEvidenceRef[]
  controls: BrainUserControlsView
  unsupportedNumbers: string[]
  droppedNonCanonicalIds: string[]
}): string[] {
  const limits: string[] = []
  if (!input.controls.enabled) limits.push("Brain is disabled in Brain User Controls.")
  if (!input.controls.personalization)
    limits.push("Personalization is disabled: no memory or creator context was used for this answer.")
  if (!input.controls.allowAnalytics)
    limits.push(
      "Analytics evidence access is disabled by the creator: private channel metrics were not read, inferred or quoted.",
    )
  if (input.suppliedPack.length === 0)
    limits.push("No evidence pack was supplied for this turn, so no evidence is displayed.")
  for (const number_ of input.unsupportedNumbers) {
    limits.push(
      `The response contains the figure ${number_}, which the supplied evidence does not support. Treat it as unverified.`,
    )
  }
  for (const id of input.droppedNonCanonicalIds) {
    limits.push(
      `The response referenced “${id}”, which is not in the supplied evidence pack; it was removed from the evidence list.`,
    )
  }
  limits.push(
    "Tool handoffs from this answer are review-only: retry regenerates the answer, it never replays external side effects.",
  )
  return limits
}

/** Assembled answer view from one turn result + the pack that was actually supplied. */
export function buildEvidenceConnectedAnswer(
  turn: BrainTurnSourceData,
  suppliedPack: SuppliedEvidenceRef[],
  controls: BrainUserControlsView,
) {
  const link = linkAnswerToEvidence(
    turn.evidence.map((ref) => ref.evidenceId),
    suppliedPack,
  )
  const unsupportedNumbers = detectUnsupportedNumbers(turn.answerText, suppliedPack)
  return {
    answerId: turn.answerId,
    question: turn.question,
    answerText: turn.answerText,
    evidencePackId: turn.evidencePackId,
    linkedEvidence: link.linked,
    droppedNonCanonicalIds: link.droppedNonCanonicalIds,
    unsupportedNumbers,
    limits: deriveAnswerLimits({
      userText: turn.question,
      suppliedPack,
      controls,
      unsupportedNumbers,
      droppedNonCanonicalIds: link.droppedNonCanonicalIds,
    }),
  }
}
