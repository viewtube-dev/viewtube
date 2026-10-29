import React from "react"

export interface EvidenceRef {
  /** Canonical evidence ID — must be the exact ID supplied to the turn (guardrail). */
  evidenceId: string
  source: string
  freshness: string
  missing: string[]
}

export interface EvidencePanelProps {
  packId: string
  items: EvidenceRef[]
}

/**
 * Roadmap item 16 companion: render ONLY actual quality diagnostics and
 * canonical evidence references. Render nothing (with an explicit note) when
 * the evidence pack is absent — never a fabricated pack.
 */
export function EvidencePanel({ packId, items }: EvidencePanelProps) {
  if (!packId || items.length === 0) {
    return (
      <p className="rounded-md border border-dashed p-3 text-sm opacity-70">
        No evidence pack was supplied for this turn, so none is displayed.
      </p>
    )
  }
  return (
    <section className="rounded-md border p-3 text-sm">
      <p className="mb-2 text-xs uppercase tracking-wide opacity-60">Evidence pack {packId}</p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.evidenceId} className="flex flex-col gap-0.5">
            <code className="text-xs">{item.evidenceId}</code>
            <span>{item.source}</span>
            <span className="text-xs opacity-70">Freshness: {item.freshness}</span>
            {item.missing.length > 0 ? (
              <span className="text-xs text-amber-500">Missing: {item.missing.join(", ")}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
