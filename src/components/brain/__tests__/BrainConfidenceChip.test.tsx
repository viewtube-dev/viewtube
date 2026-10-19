import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { BrainConfidenceChip, confidenceForEvidence } from "../BrainConfidenceChip"

describe("BrainConfidenceChip", () => {
  it("uses the canonical Studio split-left badge at the registered micro tier", () => {
    const html = renderToStaticMarkup(<BrainConfidenceChip confidence="high" />)
    expect(html).toContain('data-vt-studio-split-badge="left"')
    expect(html).toContain('data-size="micro"')
    expect(html).toContain('data-vt-brain-confidence="high"')
    expect(html).toContain("Strong evidence")
    expect(html).toContain('aria-label="Strong evidence; confidence high"')
  })

  it("preserves concise labels when full labels are hidden", () => {
    const html = renderToStaticMarkup(<BrainConfidenceChip confidence="missing" showLabel={false} />)
    expect(html).toContain(">missing</span>")
    expect(html).toContain('data-vt-brain-confidence="missing"')
  })

  it("keeps confidence mapping based on the existing evidence readiness contract", () => {
    expect(confidenceForEvidence({ hasProfile: true, videoCount: 8, dataStatus: "ready" })).toBe("high")
    expect(confidenceForEvidence({ hasProfile: true, videoCount: 8, dataStatus: "partial" })).toBe("medium")
    expect(confidenceForEvidence({ hasProfile: false, videoCount: 8, dataStatus: "ready" })).toBe("low")
    expect(confidenceForEvidence({ hasProfile: true, videoCount: 0, dataStatus: "ready" })).toBe("missing")
  })
})
