import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")

describe("Comment Responder Studio Hub contract", () => {
 const view = read("src/components/CommentResponder.tsx")
 const controller = read("src/features/creator-engagement/useCommentResponderController.ts")

 it("keeps the workspace mounted and exposes explicit data states", () => {
  expect(view).toContain("data-vt-comment-responder")
  expect(view).toContain('dataState = !context.connected ? "disconnected"')
  expect(view).toContain('dataState === "empty"')
  expect(view).toContain('dataState === "error"')
 })

 it("uses canonical Studio controls for freeform reply and queue navigation", () => {
  expect(view).toContain("StudioTextArea")
  expect(view).toContain("StudioButton")
  expect(view).toContain("StudioSquareIconButton")
  expect(view).toContain("animate />")
  expect(view).not.toContain("StandardTextArea")
 })

 it("does not report disconnection as a comment-load error", () => {
  expect(controller).toContain("if (!context.connected)")
  expect(controller).toContain("setError(null)")
  expect(controller).not.toContain('setError("Connect your YouTube channel to load comments.")')
 })

 it("offers connection as an action while preserving the normal tool", () => {
  expect(view).toContain("Connect YouTube Channel")
  expect(view).toContain("comments.reconnect")
  expect(view).toContain('SubToolbox title="Comment Responder"')
  expect(view).not.toContain('SubToolbox title="Comment Queue"')
  expect(view).not.toContain('SubToolbox title="Conversation Thread"')
  expect(view).toContain('data-comment-queue-controls')
  expect(view).toContain('aria-label="Comment queue filter"')
  expect(view).toContain('aria-label="Previous and next comments"')
  expect(view).toContain('data-comment-reply-composer')
  expect(view).toContain('aria-label="Reply writing actions"')
  expect(view).toContain('Load previous reply into composer')
  expect(view).toContain('Select to edit as a new reply draft')
  expect(view).toContain('event.key === "Enter" && !event.shiftKey')
 })
 it("renders inspectable Audience Pulse signals without implying a handoff was executed", () => {
  expect(view).toContain('SubToolbox title="Audience Pulse"')
  expect(view).toContain("comments.audienceSignals")
  expect(view).toContain("signal.sourceReferences.length")
  expect(view).toContain("Suggested destinations (advisory)")
  expect(view).toContain("not verified intent")
  expect(view).toContain("comments.proposeAudienceSignal(signal.id)")
  expect(view).toContain("Queue a pending evidence proposal for review")
  const handoff = read("src/features/creator-engagement/audiencePulseHandoff.ts")
  expect(handoff).toContain('approvalState: "pending"')
  expect(controller).toContain("loadViewTubeActionPacket(packet.id)")
  expect(view).not.toContain("persistViewTubeActionPacket")
 })


 it("uses compact Studio control sizes throughout the unified comment responder", () => {
  expect(view).toContain('sizeVariant="compact"')
  expect(view).toContain('heightVariant="28"')
  expect(view).toContain('sizeVariant="compact" className="min-h-[54px] flex-1"')
 })

 it("renders a conversation-first thread with participant avatars and message bubbles", () => {
  expect(view).toContain('SubToolbox title="Conversation Thread"')
  expect(view).toContain("authorProfileImageUrl")
  expect(view).toContain("comment-responder-message-bubble")
  expect(view).toContain("comment-responder-avatar")
  expect(view).toContain("publishedAt")
  expect(view).toContain("data-comment-video-context")
  expect(view).toContain('role="region" tabIndex={0} aria-label="Comment conversation thread"')
  expect(view).toContain("context.channelThumbnail : undefined")
  expect(view).not.toContain('SubToolbox title="Current Comment"')
  expect(view).not.toContain('SubToolbox title={`Reply History · ${replies.length}`}')
 })

 it("makes generation, refinement, and video suggestions explicit contextual actions", () => {
  expect(view).toContain('>Generate</StudioSplitLeftButton>')
  expect(view).toContain('comments.draftReply("generate")')
  expect(view).toContain('comments.draftReply("refine")')
  expect(controller).toContain('mode === "refine" ? replyText[currentId]?.trim() || "" : ""')
  expect(view).toContain('>Refine</StudioSplitLeftButton>')
  expect(view).toContain('>Suggest Videos</StudioSplitLeftButton>')
  expect(view).toContain('aria-label="Post reply"')
  expect(view).toContain("comments.draftReply")
  expect(view).toContain("comments.suggestVideo")
 })

})
