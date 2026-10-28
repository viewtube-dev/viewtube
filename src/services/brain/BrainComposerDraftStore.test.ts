import { beforeEach, describe, expect, it } from "vitest"
import { readBrainComposerDraft, writeBrainComposerDraft } from "./BrainComposerDraftStore"

describe("Brain composer draft store", () => {
 beforeEach(() => {
  window.localStorage.clear()
 })

 it("restores text, prompt label, and origin for the matching channel", () => {
  const draft = {
   text: "Build a research-backed video plan",
   activePromptTitle: "Research plan",
   promptOrigin: { promptId: "research-plan", promptVersion: "1", action: "edited" as const },
  }
  writeBrainComposerDraft("channel-a", draft)
  expect(readBrainComposerDraft("channel-a")).toEqual(draft)
  expect(readBrainComposerDraft("channel-b")).toBeNull()
 })

 it("removes the saved draft after the composer becomes empty", () => {
  writeBrainComposerDraft("channel-a", {
   text: "unsent text",
   activePromptTitle: "Saved prompt",
   promptOrigin: null,
  })
  writeBrainComposerDraft("channel-a", { text: "", activePromptTitle: null, promptOrigin: null })
  expect(readBrainComposerDraft("channel-a")).toBeNull()
 })

 it("ignores malformed or unsupported stored payloads", () => {
  window.localStorage.setItem("vt_ai_brain_composer_draft_v1:channel-a", "{not-json")
  expect(readBrainComposerDraft("channel-a")).toBeNull()
  window.localStorage.setItem("vt_ai_brain_composer_draft_v1:channel-b", JSON.stringify({ text: 5 }))
  expect(readBrainComposerDraft("channel-b")).toBeNull()
 })

 it("does not write drafts without a channel scope or over the size limit", () => {
  writeBrainComposerDraft(null, { text: "private draft", activePromptTitle: null, promptOrigin: null })
  writeBrainComposerDraft("channel-a", { text: "x".repeat(50_001), activePromptTitle: null, promptOrigin: null })
  expect(window.localStorage.length).toBe(0)
 })
})
