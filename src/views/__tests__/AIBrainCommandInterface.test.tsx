import React, { act } from "react"
import { createRoot } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { GlobalDataContext, fallbackContext } from "../../context/GlobalDataContextTypes"
import { buildCreatorBrainPromptCards } from "../../services/aiBrainCommandInterface"
import { BrainCapabilityBrowser, capabilityPromptFor } from "../../components/brain/BrainCapabilityBrowser"
import type { AIBrainContextSnapshot } from "../../services/aiBrainCommandInterface"
import type { BrainUserControls } from "../../services/brain/BrainUserControls"
import type { BrainCapabilityDefinition } from "../../types"
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

 it("renders the Studio workspace with clear local destinations", () => {
  const html = renderHub()

  expect(html).toContain("AI Brain")
  expect(html).toContain('role="tablist" aria-label="Brain pages"')
  expect(html).toContain('role="tab"')
  expect(html).toContain("Chat")
  expect(html).toContain("My Brain")
  expect(html).toContain("Review")
  expect(html).toContain("Controls")
  expect(html).toContain('aria-label="Open prompt library"')
  expect(html).not.toContain("Ask ViewTube Copilot Anything")
  expect(html).not.toContain("views pending sign-in")
  expect(html).not.toContain(">Growth Prompts<")
  expect(html).not.toContain(">Daily Oracle<")
  expect(html).not.toContain(">Analytics Signals<")
  expect(html).not.toContain(">Channel Knowledge<")
  expect(html).not.toContain(">Brain Learning Lab<")
  expect(html).not.toContain(">Tool Handoffs<")
  expect(html).not.toContain(">Advanced Health<")
 })

 it("renders the prompt library as a standard Studio intermodule with nested category modules", () => {
  const html = renderToStaticMarkup(
   <BrainPromptLibrary
    cards={buildCreatorBrainPromptCards().slice(0, 1)}
    summarize={promptCardSummary}
    onPrompt={vi.fn()}
    onEdit={vi.fn()}
   />,
  )

  expect(html).toContain('data-vt-studio-inter-module="true"')
  expect(html).toContain("brain-prompt-library-shell")
  expect(html).toContain('data-vt-brain-part="prompt-library-title"')
  expect(html).toContain('data-vt-brain-part="prompt-category-module"')
  expect(html).toContain('data-prompt-category="strategy"')
  expect(html).toContain('data-vt-brain-part="prompt-collapsible-module"')
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

 it("presents capability launches with the same Send to Chat and Edit First actions as prompts", async () => {
  const capability = {
   id: "audience-promise",
   label: "Audience promise",
   description: "Connects topics and formats to a clear viewer payoff.",
   intents: ["audience", "strategy", "publishing"],
   maximumInvocationsPerTurn: 1,
  } as BrainCapabilityDefinition
  const snapshot = {
   inferredProfile: { videoCount: 4 },
   brain: { activeProjects: 1 },
  } as unknown as AIBrainContextSnapshot
  const controls = {
   enabled: true,
   allowAnalytics: true,
   personalization: true,
   allowProjects: true,
  } as BrainUserControls
  const host = document.createElement("div")
  document.body.appendChild(host)
  const root = createRoot(host)

  try {
   await act(async () => {
    root.render(
     <BrainCapabilityBrowser
      snapshot={snapshot}
      controls={controls}
      onPrompt={() => undefined}
      onEdit={() => undefined}
     />,
    )
   })
   const capabilityButton = host.querySelector<HTMLButtonElement>('button[title="Audience promise"]')
   expect(capabilityButton).not.toBeNull()
   await act(async () => capabilityButton!.click())

   expect(host.innerHTML).toContain("SEND TO")
   expect(host.innerHTML).toContain("CHAT")
   expect(host.innerHTML).toContain("EDIT")
   expect(host.innerHTML).toContain("FIRST")
   expect(host.innerHTML).not.toContain(">Ask Brain<")
   expect(host.innerHTML).not.toContain(">Edit prompt first<")
   expect(capabilityPromptFor(capability)).toContain("audience promise")
  } finally {
   await act(async () => root.unmount())
   host.remove()
  }
 })

 it("keeps every guided prompt available in its expanded category modules", () => {
  const cards = buildCreatorBrainPromptCards()
  const html = renderToStaticMarkup(
   <BrainPromptLibrary cards={cards} summarize={promptCardSummary} onPrompt={() => undefined} onEdit={() => undefined} />,
  )

  expect(cards.length).toBeGreaterThanOrEqual(12)
  expect(new Set(cards.map((card) => card.id)).size).toBe(cards.length)
  cards.forEach((card) => expect(html).toContain(card.label))
  expect(html).toContain('aria-labelledby="brain-prompt-library-title"')
  expect(html).toContain("Analyze Channel Niche")
  expect(html).toContain("Revenue Levers")
  expect(html).toContain("Best Video Autopsy")
  expect(html).toContain("Run Daily Oracle")
  expect(html).toContain("Pinned Comments")
  expect(html).toContain("10 Video Ideas")
  expect(html).toContain("Shorts Funnel Plan")
  expect(html).toContain('data-vt-brain-part="prompt-collapsible-module"')
  expect((html.match(/data-vt-brain-part="prompt-collapsible-module"/g) || []).length).toBe(cards.length)
  expect(html).toContain("Find your niche and fuzzy edges.")
  expect(html).not.toContain("SEND TO")
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

 it("renders creator prompts as an accessible cyan message card", () => {
  const html = renderToStaticMarkup(<UserMessage text="Plan my next upload." />)

  expect(html).toContain('data-vt-brain-component="BrainUserChatEntry"')
  expect(html).toContain("YOU")
  expect(html).toContain('data-message-role="user"')
  expect(html).toContain('aria-label="Your message"')
  expect(html).toContain("bg-[#36E0F6]")
  expect(html).toContain("Plan my next upload.")
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
  expect(html).toMatch(/max-height:\s*144px/)
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
  expect(html).toContain('aria-label="Brain message composer"')
  expect(html).toContain('aria-label="Brain tools"')
  expect(html).not.toContain("custom-scrollbar")
 })

 it("mounts the conversation directly against the Studio Workspace layout", () => {
  const html = renderHub()

  expect(html).not.toContain("grid min-h-0 flex-1 gap-2 bg-white p-2")
  expect(html).toContain("vt-brain-studio-workspace__conversation")
  expect(html).toContain("vt-brain-chat-column")
  expect(html).toContain("xl:grid-cols-[64px_minmax(0,1.45fr)_minmax(320px,1fr)]")
  expect(html).toContain("xl:pt-3")
  expect(html).toContain("brain-chat-scrollbar")
  expect(html).toContain('aria-label="Open AI Journal"')
 })

 it("bounds the mobile Brain workspace and preserves a flex-sized chat/composer layout", () => {
  const html = renderHub()

  expect(html).toContain('data-keyboard-open="false"')
  expect(html).toContain("max-xl:h-[100dvh]")
  expect(html).toContain("max-xl:overflow-hidden")
  expect(html).toContain("vt-brain-studio-workspace__surface")
  expect(html).toContain("vt-brain-studio-workspace__composer")
  expect(html).toContain('aria-label="Brain message composer"')
  expect(html).toContain('aria-label="Brain conversation"')
  expect(html).toContain("max-xl:rounded-none")
  expect(html).toContain("max-xl:border-x-0")
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
