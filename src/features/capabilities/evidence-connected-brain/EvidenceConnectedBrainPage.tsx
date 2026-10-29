/**
 * Roadmap item 2: Evidence-Connected AI Brain — full page UI.
 *
 * Composer + answer view where every displayed evidence item is the exact pack
 * supplied to the turn (canonical IDs preserved), limits are explicit, and the
 * invented-number scan result is shown. Retry only re-runs generation — it
 * never replays external side effects (roadmap handoff guardrail).
 */
import React, { useEffect, useMemo, useState } from "react"
import { CapabilityPageShell } from "../shared/CapabilityPageShell"
import { CAPABILITY_BY_SLUG } from "../../capabilities/registry"
import type { BrainUserControlsView } from "../shared/brainContracts"
import {
  buildEvidenceConnectedAnswer,
  type SuppliedEvidenceRef,
} from "./evidenceLink"
import { useEvidenceConnectedBrain } from "./useEvidenceConnectedBrain"

const capability = CAPABILITY_BY_SLUG["evidence-connected-brain"]

/** Review-preview controls; replace with canonical readBrainUserControls at wiring time. */
const REVIEW_PREVIEW_CONTROLS: BrainUserControlsView = {
  enabled: true,
  personalization: true,
  allowAnalytics: true,
  learnFromInteractions: true,
}

interface AnswerHistoryEntry {
  question: string
  answerId: string
  answerText: string
  evidencePackId: string | null
  linkedEvidence: Array<{ evidenceId: string; label: string; source: string }>
  droppedNonCanonicalIds: string[]
  unsupportedNumbers: string[]
  limits: string[]
}

export default function EvidenceConnectedBrainPage() {
  const { snapshot, ask, reset } = useEvidenceConnectedBrain()
  const [question, setQuestion] = useState("")
  const [history, setHistory] = useState<AnswerHistoryEntry[]>([])

  // Review preview: an empty pack until the canonical evidence loader is wired.
  // linkAnswerToEvidence therefore drops nothing and shows "no evidence supplied".
  const suppliedPack: SuppliedEvidenceRef[] = useMemo(() => [], [])

  const lastTurn = snapshot.status === "ready" && snapshot.data != null ? snapshot.data : null
  const endpointNotWired =
    snapshot.status === "error" && snapshot.error != null && /not wired/i.test(snapshot.error)

  const submit = () => {
    const trimmed = question.trim()
    if (!trimmed) return
    ask(trimmed, null)
  }

  const answer = useMemo(() => {
    if (!lastTurn) return null
    return buildEvidenceConnectedAnswer(lastTurn, suppliedPack, REVIEW_PREVIEW_CONTROLS)
    // suppliedPack is stable (module-scope review preview); lastTurn drives the rebuild.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastTurn])

  // Track completed answers newest-first, outside render.
  useEffect(() => {
    if (!answer) return
    setHistory((previous) =>
      previous[0]?.answerId === answer.answerId
        ? previous
        : [
            {
              question: answer.question,
              answerId: answer.answerId,
              answerText: answer.answerText,
              evidencePackId: answer.evidencePackId,
              linkedEvidence: answer.linkedEvidence,
              droppedNonCanonicalIds: answer.droppedNonCanonicalIds,
              unsupportedNumbers: answer.unsupportedNumbers,
              limits: answer.limits,
            },
            ...previous,
          ].slice(0, 10),
    )
  }, [answer])

  const entry = answer

  return (
    <CapabilityPageShell capability={capability}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) submit()
            }}
            aria-label="Ask the Brain — answers link to the exact evidence pack supplied to the turn"
            rows={3}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={!question.trim()}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10"
            >
              Ask
            </button>
            <button
              type="button"
              onClick={() => question.trim() && ask(question.trim(), null)}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
            >
              Retry (regenerate only)
            </button>
            <button
              type="button"
              onClick={() => {
                reset()
                setHistory([])
              }}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
            >
              Reset
            </button>
          </div>
          <p className="text-xs opacity-60">
            Retry re-runs generation for the same question; it never replays external side
            effects (review-only handoffs, per the roadmap guardrails).
          </p>
        </div>

        {snapshot.status === "loading" ? (
          <p className="text-sm opacity-70" role="status">Running Brain turn…</p>
        ) : null}

        {endpointNotWired ? (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
            <p className="font-medium">Source not wired.</p>
            <p className="opacity-80">{snapshot.error}</p>
          </div>
        ) : snapshot.status === "error" ? (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm">
            <p className="font-medium">Request failed — showing the real error, no invented data.</p>
            <p className="opacity-80">{snapshot.error}</p>
          </div>
        ) : null}

        {entry ? (
          <section className="rounded-md border p-3">
            <p className="text-xs uppercase tracking-wide opacity-60">
              Answer {entry.answerId}
              {entry.evidencePackId ? ` · evidence pack ${entry.evidencePackId}` : " · no evidence pack supplied"}
            </p>
            <p className="mt-1 text-sm font-medium">{entry.question}</p>
            <p className="mt-1 text-sm opacity-90">{entry.answerText}</p>

            {entry.unsupportedNumbers.length > 0 ? (
              <div className="mt-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs">
                Unsupported figures (not present in the supplied evidence):{" "}
                {entry.unsupportedNumbers.join(", ")} — treat as unverified.
              </div>
            ) : null}

            <div className="mt-2">
              <p className="text-xs uppercase tracking-wide opacity-60">Evidence</p>
              {entry.linkedEvidence.length === 0 ? (
                <p className="mt-1 rounded-md border border-dashed p-2 text-xs opacity-70">
                  No evidence pack was supplied for this turn, so none is displayed.
                </p>
              ) : (
                <ul className="mt-1 flex flex-col gap-1">
                  {entry.linkedEvidence.map((ref) => (
                    <li key={ref.evidenceId} className="text-xs">
                      <code>{ref.evidenceId}</code> — {ref.label}{" "}
                      <span className="opacity-70">({ref.source})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-2">
              <p className="text-xs uppercase tracking-wide opacity-60">Limits</p>
              <ul className="mt-1 flex flex-col gap-0.5">
                {entry.limits.map((limit) => (
                  <li key={limit} className="text-xs opacity-80">• {limit}</li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {history.length > 1 ? (
          <section className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wide opacity-60">Earlier turns</p>
            {history.slice(1).map((previous) => (
              <details key={previous.answerId} className="rounded-md border p-2 text-sm">
                <summary className="cursor-pointer text-xs opacity-80">{previous.question}</summary>
                <p className="mt-1 text-xs opacity-90">{previous.answerText}</p>
                <p className="mt-1 text-[11px] opacity-60">
                  {previous.linkedEvidence.length} evidence ref(s) · {previous.limits.length} limit(s)
                </p>
              </details>
            ))}
          </section>
        ) : null}
      </div>
    </CapabilityPageShell>
  )
}
