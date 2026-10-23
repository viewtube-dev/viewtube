import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { GlobalDataContext, fallbackContext } from "../../context/GlobalDataContextTypes"
import { buildCreatorBrainPromptCards } from "../../services/aiBrainCommandInterface"
import AIBrainCommandInterface, {
 BrainGenerationBadge,
 BrainFeedbackControls,
 BrainPromptLibrary,
 promptCardSummary,
 readPromptEvidenceRecords,
 getPromptEvidenceIntegrityStatus,
 shouldSendBrainComposerKey,
 shouldFollowBrainConversation,
 UserMessage,
} from "../AIBrainCommandInterface"

const createStorage = () => {
 const store = new Map<string, string>()
 return {
  getItem: vi.fn((key: string) => store.get(key) || null),
  setItem: vi.fn((key: string, value: string) => {
   store.set(key, value)
  }),
  removeItem: vi.fn((key: string) => {
   store.delete(key)
  }),
  clear: vi.fn(() => {
   store.clear()
  }),
 }
}

const renderHub = () =>
 renderToStaticMarkup(
  <MemoryRouter initialEntries={["/ai-brain"]}>
   <GlobalDataContext.Provider value={fallbackContext}>
    <AIBrainCommandInterface />
   </GlobalDataContext.Provider>
  </MemoryRouter>,
 )

describe("AIBrainCommandInterface", () => {
 let storage: ReturnType<typeof createStorage>

 beforeEach(() => {
  storage = createStorage()
  vi.stubGlobal("localStorage", storage)
  vi.stubGlobal("window", { localStorage: storage })
 })

 afterEach(() => {
  vi.unstubAllGlobals()
 })


 it("distinguishes missing legacy prompt manifests from mismatched evidence records", () => {
  const record = {
   id: "analytics:snapshot-1:channel_summary:views",
   owner: "analytics-canon",
   sourceRef: "channel_summary",
   sourceSnapshotId: "snapshot-1",
   metric: "views",
   value: 2800,
   freshness: "fresh",
   epistemicState: "OBSERVED",
   provenance: { evidenceIds: ["source-1"], sourceRoute: "/analytics" },
  }
  expect(getPromptEvidenceIntegrityStatus(undefined)).toBe("unavailable")
  expect(getPromptEvidenceIntegrityStatus({ evidenceRecords: [record] })).toBe("unavailable")
  expect(getPromptEvidenceIntegrityStatus({ evidenceRecords: [record], promptEvidenceRecordIds: [record.id] })).toBe("verified")
  expect(getPromptEvidenceIntegrityStatus({ evidenceRecords: [record], promptEvidenceRecordIds: ["different-id"] })).toBe("mismatch")
  expect(getPromptEvidenceIntegrityStatus({ evidenceRecords: [], promptEvidenceRecordIds: [record.id] })).toBe("mismatch")
 })

 it("renders one autonomous surface with no tab or mode selector", () => {
  const html = renderHub()

  expect(html).toContain("ViewTube Brain Hub")
  expect(html).toContain("Prompt Library")
  expect(html).not.toContain("Ask ViewTube Copilot Anything")
  expect(html).not.toContain("views pending sign-in")

  // The creator never picks a mode: no tab controls of any kind.
  expect(html).not.toContain('role="tab"')
  expect(html).not.toContain(">Ask Copilot<")
  expect(html).not.toContain(">Growth Prompts<")
  expect(html).not.toContain(">Daily Oracle<")
  expect(html).not.toContain(">Analytics Signals<")
  expect(html).not.toContain(">Channel Knowledge<")
  expect(html).not.toContain(">Brain Learning Lab<")
  expect(html).not.toContain(">Tool Handoffs<")
  expect(html).not.toContain(">Advanced Health<")
 })


 it("restores only typed prompt evidence whose ordered IDs match the saved turn contract", () => {
  const record = {
   id: "analytics:snapshot-1:channel_summary:views",
   owner: "analytics-canon",
   sourceRef: "channel_summary",
   sourceSnapshotId: "snapshot-1",
   metric: "views",
   value: 2800,
   freshness: "fresh",
   epistemicState: "OBSERVED",
   provenance: { evidenceIds: ["source-1"], sourceRoute: "/analytics" },
  }

  expect(readPromptEvidenceRecords({
   evidenceRecords: [record],
   promptEvidenceRecordIds: [record.id],
  })).toEqual([record])
  expect(readPromptEvidenceRecords({
   evidenceRecords: [record],
   promptEvidenceRecordIds: ["different-record"],
  })).toBeUndefined()
  expect(readPromptEvidenceRecords({
   evidenceRecords: [{ ...record, owner: "not-canonical" }],
   promptEvidenceRecordIds: [record.id],
  })).toBeUndefined()
  expect(readPromptEvidenceRecords({})).toBeUndefined()
 })

 it("shows the ambient context rail without requiring any selection", () => {
  const html = renderHub()

  expect(html).toContain("What the Brain currently knows")
  expect(html).toContain("Your channel")
  // Current goal context stays in the channel panel while an unanswered goal
  // check is a dedicated actionable module in the rail.
  expect(html).toContain("Goal ·")
  expect(html).toContain("Goal check")
 })

 it("opens with the Brain's own read instead of an empty chat box", () => {
  const html = renderHub()

  // With no channel evidence the Brain must name what it is missing rather than
  // emit a confident generic greeting.
  expect(html).toContain("Let&#x27;s get me enough to be useful")
  expect(html).toContain("Needs channel data")
  expect(html).toContain("Why this recommendation")
 })

 it("renders each piece of context once, never in both the chat and the rail", () => {
  const html = renderHub()

  // The opening read is narrative and belongs to the conversation; the rail holds
  // structured state. Duplicating either is what previously made the page endless.
  const briefingHeadings = html.match(/Here&#x27;s what I&#x27;m seeing|Let&#x27;s get me enough to be useful/g) || []
  expect(briefingHeadings).toHaveLength(1)

  const railLabel = html.match(/What the Brain currently knows/g) || []
  expect(railLabel).toHaveLength(1)
 })

 it("keeps journal capture available as a bounded workspace action", () => {
  const html = renderHub()

  // Journal capture is an inline affordance in the composer, not a mode/tab.
  expect(html).toContain("AI Journal")
 })

 it("keeps every guided prompt available independently of chat history", () => {
  const cards = buildCreatorBrainPromptCards()
  const html = renderToStaticMarkup(
   <BrainPromptLibrary cards={cards} onPrompt={() => undefined} />,
  )

  expect(cards.length).toBeGreaterThanOrEqual(12)
  // Every card renders, whatever the count, and ids are unique.
  expect(new Set(cards.map((card) => card.id)).size).toBe(cards.length)
  cards.forEach((card) => expect(html).toContain(card.label))
  expect(html).toContain('aria-labelledby="brain-prompt-library-title"')
  expect(html).toContain("Analyze Channel Niche")
  expect(html).toContain("Revenue Levers")
  expect(html).toContain("Best Video Autopsy")
  expect(html).toContain("Run Daily Oracle")
  // The newly added creator-requested prompts are present.
  expect(html).toContain("Pinned Comments")
  expect(html).toContain("10 Video Ideas")
  expect(html).toContain("Shorts Funnel Plan")
  expect(html).toContain("sm:grid-cols-2")
  expect(html).toContain("xl:grid-cols-1")
  expect(html).toContain("line-clamp-2")
  expect(html).toContain("border-b-[2px]")
  // Cards remain selectable within their collapsed category module and preview before sending, not instant-send.
  expect(html).toContain('aria-pressed="false"')
  expect(html).toContain("Choose a prompt to preview and send it here.")
  expect(html).toContain("data-vt-brain-component=\"BrainPromptLibraryModule\"")
  expect(html).toContain("data-prompt-category=")
  expect(html).toContain("prompt-module-body")
  expect(html).toContain("Open a task module to browse its related prompts.")
  // Card bodies show the short summary (the full prompt lives in the title tooltip
  // and the preview panel, not dumped into the card body).
  expect(html).toContain("A fresh, on-brand thumbnail concept for your next video.")
  // One prompt-selection button per card (no preview action buttons until a prompt is selected).
  expect((html.match(/type="button"/g) || [])).toHaveLength(cards.length)
  expect(promptCardSummary(cards[0])).toBe("Find your niche and fuzzy edges.")
  expect(html).toContain("Find your niche and fuzzy edges.")
 })

 it("exposes persistent response rating states instead of inert icon buttons", () => {
  const message = { id: "response-1", role: "model", text: "Answer", response: undefined } as const
  const html = renderToStaticMarkup(
   <BrainFeedbackControls message={message} onFeedback={async () => undefined} />,
  )

  expect(html).toContain('aria-label="Rate this response"')
  expect(html).toContain('aria-pressed="false"')
  expect(html).toContain('role="status"')
  expect(html).toContain("Rate answer")
 })

 it("renders creator prompts as cyan split-row messages", () => {
  const html = renderToStaticMarkup(<UserMessage text="Plan my next upload." />)

  expect(html).toContain("bg-[#36E0F6]")
  expect(html).toContain("grid-cols-[84px_minmax(0,1fr)]")
  expect(html).toContain("text-[14px]")
  expect(html).toContain("You:")
 })

 it("follows new turns at the bottom but preserves scroll when reading history", () => {
  expect(shouldFollowBrainConversation(1000, 900, 100)).toBe(true)
  expect(shouldFollowBrainConversation(1000, 500, 100)).toBe(false)
  expect(shouldFollowBrainConversation(1000, 828, 100)).toBe(true)
 })

 it("sends with Enter, preserves Shift+Enter newlines, and ignores IME composition", () => {
  expect(shouldSendBrainComposerKey({ key: "Enter", isComposing: false, shiftKey: false })).toBe(true)
  expect(shouldSendBrainComposerKey({ key: "Enter", isComposing: false, shiftKey: true })).toBe(false)
  expect(shouldSendBrainComposerKey({ key: "Enter", isComposing: true, shiftKey: false })).toBe(false)
  expect(shouldSendBrainComposerKey({ key: "Escape", isComposing: false, shiftKey: false })).toBe(false)
 })

 it("renders a multiline composer with a documented Shift+Enter newline", () => {
  const html = renderHub()
  expect(html).toContain('<textarea')
  expect(html).toContain('id="brain-composer"')
  expect(html).toContain("Shift+Enter for a new line")
  expect(html).toContain("max-h-36")
 })

 it("keeps prompt and channel-context launchers reachable on smaller screens", () => {
  const html = renderHub()

  expect(html).toContain('aria-label="Open prompt library"')
  expect(html).toContain('aria-label="Open channel context"')
  expect(html).not.toContain(">Growth prompts<")
 })

 it("uses one themed scrollbar for the Brain conversation", () => {
  const html = renderHub()

  expect(html).toContain("brain-chat-scrollbar")
  expect(html).toContain("touch-pan-y")
  expect(html).toContain('aria-label="Brain conversation"')
  expect(html).toContain('aria-label="Prompt library"')
  expect(html).toContain('aria-label="Channel context"')
  expect(html).not.toContain("custom-scrollbar")
 })

 it("mounts the conversation directly against its panel instead of adding a second content mat", () => {
  const html = renderHub()

  expect(html).not.toContain("grid min-h-0 flex-1 gap-2 bg-white p-2")
  expect(html).toContain("flex min-h-0 flex-1 flex-col overflow-hidden bg-white")
  expect(html).toContain("xl:grid-cols-[64px_minmax(0,1.45fr)_minmax(320px,1fr)]")
  expect(html).toContain("xl:pt-3")
  expect(html).toContain("brain-chat-scrollbar")
  expect(html).toContain('aria-label="Open AI Journal"')
  expect(html).not.toContain("shrink-0 border-t-[4px] border-black bg-[#f8f8f4]")
 })

 it("keeps the mobile Brain workspace scrollable and removes nested-card chrome", () => {
  const html = renderHub()

  expect(html).toContain("max-xl:!h-auto")
  expect(html).toContain("max-xl:overflow-visible")
  expect(html).toContain("max-xl:min-h-[70dvh]")
  expect(html).toContain("max-xl:min-h-[420px]")
  expect(html).toContain('data-vt-brain-runtime-shell="merged"')
  expect(html).toContain("max-xl:rounded-none")
  expect(html).toContain("max-xl:border-x-0")
  expect(html).not.toContain("max-xl:min-h-[520px]")
  expect(html).not.toContain("LIVE BRAIN RUNTIME")
 })

 it("keeps internal diagnostics out of the creator workspace", () => {
  const html = renderHub()

  expect(html).not.toContain("Brain diagnostics")
  expect(html).not.toContain("IndexedDB")
  expect(html).not.toContain("localStorage")
  expect(html).not.toContain("VT-SYNC")
  expect(html).not.toContain("manifest")
 })

 it.each([
  ["model", "Full Brain"],
  ["repaired_model", "Refined Answer"],
  ["basic_guidance", "Basic Guidance"],
 ] as const)("renders an accessible, wrapping %s generation badge", (path, label) => {
  const html = renderToStaticMarkup(<BrainGenerationBadge path={path} />)

  expect(html).toContain(label)
  expect(html).toContain('role="status"')
  expect(html).toContain('tabindex="0"')
  expect(html).toContain(`aria-label="${label} response status"`)
  expect(html).toContain("response was prepared")
  expect(html).toContain("whitespace-normal")
  expect(html).not.toMatch(/provider|account|credit|consent|internal error/i)
 })
})
