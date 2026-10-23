import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const source = readFileSync(new URL("./AIBrainCommandInterface.tsx", import.meta.url), "utf8")

describe("AI Brain Studio status and evidence chrome", () => {
  it("uses compact Studio split badges for active creator context", () => {
    const start = source.indexOf("const BrainContextStrip")
    const end = source.indexOf("const shellCard", start)
    const contextStrip = source.slice(start, end)

    expect(source).toContain("StudioSplitLeftBadge")
    expect(contextStrip.match(/<StudioSplitLeftBadge\b/g)).toHaveLength(4)
    expect(contextStrip).toContain('sizeVariant="micro"')
    expect(contextStrip).not.toContain('rounded-[4px] border border-black bg-[#36E0F6]')
    expect(contextStrip).not.toContain('rounded-[4px] border border-black bg-[#3FEE56]')
  })

  it("uses canonical Brain status badges for generation and evidence readiness", () => {
    const generationStart = source.indexOf("export const BrainGenerationBadge")
    const generationEnd = source.indexOf("const makeMessageId", generationStart)
    const generationBadge = source.slice(generationStart, generationEnd)
    const readinessStart = source.indexOf("const BrainDataReadiness")
    const readinessEnd = source.indexOf("export const UserMessage", readinessStart)
    const readiness = source.slice(readinessStart, readinessEnd)

    expect(source).toContain("BrainChatStatusBadge")
    expect(generationBadge).toContain("<BrainChatStatusBadge")
    expect(generationBadge).not.toContain("style={{ backgroundColor: badge.color }}")
    expect(readiness).toContain("<BrainChatStatusBadge")
    expect(readiness).not.toContain('rounded-[4px] border-[1.5px] border-black')
  })

  it("keeps learning receipt status compact and visually owned by Studio", () => {
    const start = source.indexOf("const BrainLearningReceiptCard")
    const end = source.indexOf("const CreatorResponseCard", start)
    const receipt = source.slice(start, end)

    expect(receipt).toContain('<StudioSplitLeftBadge sizeVariant="micro"')
    expect(receipt).not.toContain('rounded-[5px] border-[1.5px] border-black bg-white')
  })
})


describe("AI Brain native disclosure trigger contract", () => {
  it("keeps context/readiness disclosure semantics while using the shared Studio trigger skin", () => {
    expect(source).toContain('data-vt-studio-disclosure-summary="true"')
    expect(source).toContain('data-vt-brain-part="context-used-trigger"')
    expect(source).toContain('data-vt-brain-part="evidence-readiness-trigger"')
    expect(source).toContain("<StudioDisclosureSummary")
    expect(source).toContain("sizeVariant=\"compact\"")
    expect(source).toContain("sizeVariant=\"standard\"")
    expect(source).not.toContain('hover:bg-[#36E0F6] focus-visible:ring-2 focus-visible:ring-black')
    expect(source).not.toContain('hover:bg-[#FFDA47] focus-visible:ring-2 focus-visible:ring-black')
  })
})
