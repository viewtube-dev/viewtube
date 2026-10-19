import React from "react"
import type { AIBrainEvidencePack } from "../../types"
import { BrainConfidenceChip, type BrainConfidenceValue } from "./BrainConfidenceChip"
import { BrainEvidenceDrawer } from "./BrainEvidenceDrawer"

export type BrainClaimEvidenceProps = {
  evidencePack: AIBrainEvidencePack
  confidence?: BrainConfidenceValue
  label?: string
  compact?: boolean
  className?: string
}

/**
 * Shared claim/evidence grammar for a Brain statement.
 * Confidence is shown only when the caller has a real evidence-backed value;
 * the evidence drawer keeps the canonical evidence-pack schema and source links.
 */
export const BrainClaimEvidence: React.FC<BrainClaimEvidenceProps> = ({
  evidencePack,
  confidence,
  label = "Why this recommendation",
  compact = false,
  className = "",
}) => (
  <div className={`flex min-w-0 flex-wrap items-start gap-1 ${className}`}>
    {confidence ? <BrainConfidenceChip confidence={confidence} /> : null}
    <BrainEvidenceDrawer
      evidencePack={evidencePack}
      summaryLabel={label}
      compact={compact}
    />
  </div>
)

export default BrainClaimEvidence
