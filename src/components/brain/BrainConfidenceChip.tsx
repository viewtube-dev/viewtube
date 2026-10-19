import React from "react"
import type { BrainConfidenceLevel } from "../../types"
import { StudioSplitLeftBadge } from "../../studio-ui"

export type BrainConfidenceValue = BrainConfidenceLevel | "missing"

const CONFIDENCE_TONE: Record<BrainConfidenceValue, { background: string; label: string }> = {
 high: { background: "#3FEE56", label: "Strong evidence" },
 medium: { background: "#FFDA47", label: "Partial evidence" },
 low: { background: "#FFA85C", label: "Early read" },
 missing: { background: "#FA618A", label: "Needs channel data" },
}

/**
 * One shared confidence indicator for Brain surfaces.
 *
 * The visual shell intentionally uses the production StudioSplitLeftBadge rather
 * than a local rounded-chip implementation. Confidence meaning and its existing
 * evidence mapping stay Brain-owned; geometry, typography, split anatomy, and
 * size tokens stay owned by Studio Controls.
 */
export const BrainConfidenceChip: React.FC<{
 confidence: BrainConfidenceValue
 showLabel?: boolean
 className?: string
}> = ({ confidence, showLabel = true, className = "" }) => {
 const tone = CONFIDENCE_TONE[confidence] || CONFIDENCE_TONE.missing
 const label = showLabel ? tone.label : confidence
 return (
  <StudioSplitLeftBadge
   sizeVariant="micro"
   className={className}
   icon={<span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full border border-black bg-black/70" />}
   style={{ backgroundColor: tone.background, width: "max-content", maxWidth: "100%" }}
   aria-label={`${tone.label}; confidence ${confidence}`}
   title={tone.label}
   data-vt-brain-confidence={confidence}
  >
   {label}
  </StudioSplitLeftBadge>
 )
}

export const confidenceForEvidence = (input: {
 hasProfile: boolean
 videoCount: number
 dataStatus: "ready" | "partial" | "missing"
}): BrainConfidenceValue => {
 if (input.dataStatus === "missing" || input.videoCount === 0) return "missing"
 if (input.hasProfile && input.dataStatus === "ready") return "high"
 if (input.hasProfile) return "medium"
 return "low"
}

export default BrainConfidenceChip
