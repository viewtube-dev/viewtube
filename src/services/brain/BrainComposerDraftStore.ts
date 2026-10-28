export type BrainComposerDraftOrigin = {
 promptId: string
 promptVersion: string
 action: "edited"
}

export type BrainComposerDraft = {
 text: string
 activePromptTitle: string | null
 promptOrigin: BrainComposerDraftOrigin | null
}

const DRAFT_KEY_PREFIX = "vt_ai_brain_composer_draft_v1:"
const MAX_DRAFT_LENGTH = 50_000

const storageKey = (channelId: string) => `${DRAFT_KEY_PREFIX}${encodeURIComponent(channelId)}`

const isDraftOrigin = (value: unknown): value is BrainComposerDraftOrigin => {
 if (!value || typeof value !== "object") return false
 const origin = value as Record<string, unknown>
 return typeof origin.promptId === "string"
  && typeof origin.promptVersion === "string"
  && origin.action === "edited"
}

const isBrainComposerDraft = (value: unknown): value is BrainComposerDraft => {
 if (!value || typeof value !== "object") return false
 const draft = value as Record<string, unknown>
 return typeof draft.text === "string"
  && draft.text.length <= MAX_DRAFT_LENGTH
  && (typeof draft.activePromptTitle === "string" || draft.activePromptTitle === null)
  && (draft.promptOrigin === null || isDraftOrigin(draft.promptOrigin))
}

/** Read a channel-scoped draft from this browser only; storage failures are non-fatal. */
export const readBrainComposerDraft = (channelId: string | null | undefined): BrainComposerDraft | null => {
 if (!channelId || typeof window === "undefined") return null
 try {
  const raw = window.localStorage.getItem(storageKey(channelId))
  if (!raw) return null
  const parsed: unknown = JSON.parse(raw)
  return isBrainComposerDraft(parsed) ? parsed : null
 } catch {
  return null
 }
}

/** Persist only the current unsent draft; empty drafts remove their local record. */
export const writeBrainComposerDraft = (
 channelId: string | null | undefined,
 draft: BrainComposerDraft,
): void => {
 if (!channelId || typeof window === "undefined") return
 try {
  const key = storageKey(channelId)
  if (!draft.text.trim() && !draft.activePromptTitle && !draft.promptOrigin) {
   window.localStorage.removeItem(key)
   return
  }
  if (draft.text.length > MAX_DRAFT_LENGTH) return
  window.localStorage.setItem(key, JSON.stringify({
   text: draft.text,
   activePromptTitle: draft.activePromptTitle,
   promptOrigin: draft.promptOrigin,
  } satisfies BrainComposerDraft))
 } catch {
  // Private browsing, quota, and storage-policy errors must never block chat.
 }
}
