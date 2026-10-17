import React from "react"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft, ChevronRight, ExternalLink, Link2, Loader2, MessagesSquare, RefreshCw, Send, Sparkles } from "lucide-react"
import { buildYouTubeCommentUrl } from "../services/youtube/commentHandoff"
import { SubToolbox, SubToolboxGridActionButton } from "./Toolbox"
import { StudioButton, StudioSquareIconButton, StudioSplitLeftButton, StudioTextArea } from "../studio-ui"
import { useCommentResponderController, useCreatorEngagementContext } from "../features/creator-engagement"

const plainText = (value: string) => {
 if (typeof document === "undefined") return value
 return new DOMParser().parseFromString(value, "text/html").documentElement.textContent || value
}

const CommentAvatar: React.FC<{ name: string; src?: string; creator?: boolean }> = ({ name, src, creator = false }) => {
 const [failedSrc, setFailedSrc] = React.useState<string | null>(null)
 const initial = plainText(name || "Viewer").trim().replace(/^@+/, "").charAt(0).toUpperCase() || "?"
 const showImage = Boolean(src && failedSrc !== src)
 return <div role="img" aria-label={name + " profile picture"} className={"comment-responder-avatar relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-black text-xs font-black " + (creator ? "bg-[#BFE9FF]" : "bg-[#FFE4F2]")}>
  {!showImage && <span aria-hidden="true">{initial}</span>}
  {showImage && <img src={src} alt="" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" onError={() => setFailedSrc(src || null)} />}
 </div>
}

const formatCommentDate = (value?: string) => {
 if (!value) return ""
 const date = new Date(value)
 return Number.isNaN(date.getTime()) ? "" : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
}

export const CommentResponder: React.FC = () => {
 const context = useCreatorEngagementContext()
 const comments = useCommentResponderController(context)
 const thread = comments.currentThread
 const snippet = thread?.snippet?.topLevelComment?.snippet
 const videoId = String(thread?.snippet?.videoId || "")
 const canonicalVideo = context.videoAssets.find((video) => video.videoId === videoId)
 const fetchedVideo = comments.fetchedVideoData[videoId]
 const videoTitle = fetchedVideo?.title || canonicalVideo?.title || videoId || "Unknown video"
 const thumbnail = fetchedVideo?.thumbnails?.maxres?.url || canonicalVideo?.thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "")
 const replies = thread?.replies?.comments || []
 const commentUrl = thread ? buildYouTubeCommentUrl(videoId, thread.snippet?.topLevelComment?.id || thread.id) : null
 const dataState = !context.connected ? "disconnected" : comments.loading ? "loading" : comments.error ? "error" : comments.displayThreads.length ? "ready" : "empty"
 const queueStatus = dataState === "disconnected"
  ? "Connect your YouTube channel to load comments."
  : dataState === "loading"
   ? "Syncing comments…"
   : dataState === "error"
    ? "Comments could not be loaded."
    : dataState === "empty"
     ? comments.tab === "history" ? "No replied comments found." : "No new comments found."
     : `${comments.currentIndex + 1} of ${comments.displayThreads.length}`

 return <div data-vt-comment-responder data-state={dataState} className="flex w-full flex-col items-stretch gap-3 bg-white p-1 sm:p-3 lg:p-5">
  <SubToolbox title="Comment Responder" icon={<MessagesSquare />} collapsible isOpenInitial>
   <div data-comment-queue-controls className="mb-3 flex min-w-0 flex-wrap items-center gap-2">
    <div role="group" aria-label="Comment queue filter" className="grid min-w-0 flex-1 grid-cols-2 gap-1">
     <StudioButton type="button" aria-pressed={comments.tab === "unreplied"} tone={comments.tab === "unreplied" ? "accent" : "neutral"} onClick={() => comments.setTab("unreplied")}>New · {comments.tab === "unreplied" ? comments.displayThreads.length : ""}</StudioButton>
     <StudioButton type="button" aria-pressed={comments.tab === "history"} tone={comments.tab === "history" ? "accent" : "neutral"} onClick={() => comments.setTab("history")}>Old / Replied · {comments.tab === "history" ? comments.displayThreads.length : ""}</StudioButton>
    </div>
    <div role="group" aria-label="Previous and next comments" className="grid min-w-0 flex-1 grid-cols-2 gap-1">
     <StudioSplitLeftButton type="button" icon={<ChevronLeft size={16} />} aria-label="Previous comment" disabled={!context.connected || comments.currentIndex === 0} onClick={() => comments.setCurrentIndex(Math.max(0, comments.currentIndex - 1))}>Previous</StudioSplitLeftButton>
     <StudioSplitLeftButton type="button" icon={<ChevronRight size={16} />} aria-label="Next comment" disabled={!context.connected || comments.currentIndex >= comments.displayThreads.length - 1} onClick={() => comments.setCurrentIndex(Math.min(comments.displayThreads.length - 1, comments.currentIndex + 1))}>Next</StudioSplitLeftButton>
    </div>
    <StudioSquareIconButton type="button" label={context.connected ? "Refresh comments" : "Connect YouTube channel"} icon={context.connected ? <RefreshCw size={17} className={comments.loading ? "animate-spin" : ""} /> : <Link2 size={17} />} onClick={context.connected ? comments.refresh : comments.reconnect} disabled={context.connected && comments.loading} tone="accent" animate />
   </div>
   <div role="status" aria-live="polite" className="mb-3 min-h-5 text-[10px] font-black uppercase">{queueStatus}</div>
   {!context.connected && <div className="mb-3"><SubToolboxGridActionButton label="Connect YouTube Channel" iconName="link" tone="green" onClick={comments.reconnect} /></div>}
   {thread && <div data-comment-video-context className="mb-3 grid min-w-0 grid-cols-[96px_minmax(0,1fr)] items-center gap-3 rounded-lg border-2 border-black bg-white p-2 sm:grid-cols-[140px_minmax(0,1fr)]">
    <div className="aspect-video overflow-hidden rounded-md border-2 border-black bg-gray-100">{thumbnail ? <img src={thumbnail} width={320} height={180} alt={"Thumbnail for " + videoTitle} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center"><Loader2 className="animate-spin" /></div>}</div>
    <div className="min-w-0"><p className="text-[9px] font-black uppercase tracking-wide opacity-50">Commented on this video</p><h3 className="mt-1 break-words text-sm font-black leading-tight">{videoTitle}</h3>{commentUrl && <a href={commentUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase underline"><ExternalLink size={12} aria-hidden="true" />Open on YouTube</a>}</div>
   </div>}
   {thread && snippet ? <div role="region" tabIndex={0} aria-label="Comment conversation thread" className="max-h-[min(48vh,560px)] space-y-3 overflow-y-auto p-1">
    <article className="flex min-w-0 items-start gap-2 sm:gap-3" data-comment-message="original">
     <CommentAvatar name={plainText(snippet.authorDisplayName || "Viewer")} src={snippet.authorProfileImageUrl} />
     <div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[10px] font-black uppercase"><span className="break-words">{plainText(snippet.authorDisplayName || "Viewer")}</span><span className="font-bold normal-case opacity-50">{formatCommentDate(snippet.publishedAt || snippet.updatedAt)}</span><span className="ml-auto shrink-0 opacity-50">{Number(snippet.likeCount || 0).toLocaleString()} likes</span></div><div className="comment-responder-message-bubble w-fit max-w-full rounded-2xl rounded-tl-sm border-2 border-black bg-[#FFF9E8] px-3 py-3 text-sm font-bold leading-relaxed whitespace-pre-wrap break-words">{plainText(snippet.textDisplay || snippet.textOriginal || "")}</div><div className="mt-1 text-[9px] font-black uppercase tracking-wide opacity-45">Original comment</div></div>
    </article>
    {replies.map((reply: any, index: number) => {
     const replySnippet = reply.snippet || {}
     const authorName = plainText(replySnippet.authorDisplayName || "Reply")
     const isCreatorReply = String(replySnippet.authorChannelId?.value || "") === String(context.channelId || "")
     const replyText = plainText(replySnippet.textDisplay || replySnippet.textOriginal || "")
     return <article key={reply.id || index} data-comment-message="reply" className={"flex min-w-0 items-start gap-2 sm:gap-3 " + (isCreatorReply ? "flex-row-reverse" : "")}>
      <CommentAvatar name={authorName} src={replySnippet.authorProfileImageUrl || (isCreatorReply ? context.channelThumbnail : undefined)} creator={isCreatorReply} />
      <div className={"min-w-0 flex-1 " + (isCreatorReply ? "text-right" : "")}><div className={"mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[10px] font-black uppercase " + (isCreatorReply ? "justify-end" : "")}><span className="break-words">{authorName}{isCreatorReply ? " · You" : ""}</span><span className="font-bold normal-case opacity-50">{formatCommentDate(replySnippet.publishedAt || replySnippet.updatedAt)}</span></div>
       {isCreatorReply ? <button type="button" aria-label="Load previous reply into composer" onClick={() => comments.setReplyText(replyText)} className="comment-responder-message-bubble inline-block max-w-full rounded-2xl rounded-tr-sm border-2 border-black bg-[#DDF4FF] px-3 py-3 text-left text-sm font-bold leading-relaxed whitespace-pre-wrap break-words hover:bg-[#c8ebff]">{replyText}<span className="mt-1 block text-[9px] font-black uppercase opacity-50">Select to edit as a new reply draft</span></button> : <div className="comment-responder-message-bubble inline-block max-w-full rounded-2xl rounded-tl-sm border-2 border-black bg-white px-3 py-3 text-left text-sm font-bold leading-relaxed whitespace-pre-wrap break-words">{replyText}</div>}
      </div>
     </article>
    })}
    {replies.length === 0 && <p className="ml-11 text-[10px] font-bold uppercase tracking-wide opacity-45">No replies yet — start the conversation below.</p>}
   </div> : <div className="grid min-h-24 place-items-center rounded-lg border-2 border-dashed border-black/30 bg-white/60 p-4 text-center text-xs font-black uppercase opacity-60">{dataState === "disconnected" ? "Connect your channel to load comments." : dataState === "loading" ? "Loading conversation…" : dataState === "error" ? "Conversation unavailable. Refresh and try again." : "No comment selected."}</div>}
   <div data-comment-reply-composer className="mt-3 border-t-2 border-black pt-3">
    <label htmlFor="comment-reply-copy" className="mb-1 block text-[10px] font-black uppercase">Reply · Enter to post</label>
    <div className="flex items-end gap-2">
     <StudioTextArea id="comment-reply-copy" name="commentReply" value={comments.replyText} onChange={(event) => comments.setReplyText(event.target.value)} onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); if (comments.canPostReply && comments.replyText.trim() && !comments.loading) void comments.postReply(); } }} placeholder={!context.connected ? "Connect your YouTube channel to reply…" : comments.tab === "history" ? "Write a follow-up reply…" : "Write or generate a reply…"} className="min-h-[54px] flex-1" disabled={!context.connected || !thread} />
     <StudioSquareIconButton type="button" label={comments.canPostReply ? "Post reply" : context.connected ? "Reconnect channel" : "Connect channel"} icon={comments.canPostReply ? <Send size={17} /> : <Link2 size={17} />} onClick={comments.canPostReply ? comments.postReply : comments.reconnect} disabled={comments.canPostReply ? (!thread || !comments.replyText.trim() || comments.loading) : false} tone="accent" />
    </div>
    <div role="group" aria-label="Reply writing actions" className="mt-3 grid grid-cols-3 gap-1 sm:gap-2">
     <StudioSplitLeftButton type="button" icon={<Sparkles size={16} />} tone="warning" disabled={!context.connected || !thread || comments.generating} onClick={comments.draftReply}>Generate</StudioSplitLeftButton>
     <StudioSplitLeftButton type="button" icon={<RefreshCw size={16} />} tone="neutral" disabled={!context.connected || !thread || comments.generating || !comments.replyText.trim()} onClick={comments.draftReply}>Refine</StudioSplitLeftButton>
     <StudioSplitLeftButton type="button" icon={<Link2 size={16} />} tone="accent" disabled={!context.connected || !thread || comments.generating} onClick={comments.suggestVideo}>Suggest Videos</StudioSplitLeftButton>
    </div>
   </div>
   {comments.error && context.connected && <div role="alert" className="mt-3 rounded-lg border-[3px] border-black bg-[#FFB158] p-3 text-xs font-black">{comments.error}</div>}
  </SubToolbox>
   <SubToolbox title="Audience Pulse" icon={<Sparkles />} collapsible isOpenInitial={false}>
    <p className="mb-3 text-[10px] font-bold uppercase opacity-60">Read-only patterns from the loaded comment records. Intent is inferred, not verified.</p>
    {comments.audienceSignals.length ? <div className="space-y-2">
     {comments.audienceSignals.map((signal) => <article key={signal.id} data-audience-pulse-signal={signal.id} className="min-w-0 rounded-xl border-2 border-black bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
       <strong className="text-xs font-black uppercase">{signal.intent}</strong>
       <span className="text-[10px] font-bold uppercase">{signal.sourceReferences.length} source record{signal.sourceReferences.length === 1 ? "" : "s"}</span>
      </div>
      <p className="mt-2 text-xs font-bold">{signal.interpretation}</p>
      {signal.confidence !== null && <p className="mt-1 text-[10px] font-bold">Pattern confidence (not verified intent): {Math.round(signal.confidence * 100)}%</p>}
      <p className="mt-2 break-words text-[10px] font-bold">Evidence IDs: {signal.evidenceIds.join(", ")}</p>
      {(signal.sourceWindow.start || signal.sourceWindow.end) && <p className="mt-1 text-[10px]">Source window: {signal.sourceWindow.start || "unknown"} — {signal.sourceWindow.end || "unknown"}</p>}
      {signal.suggestedTargets.length > 0 && <p className="mt-2 break-words text-[10px]"><strong>Suggested destinations (advisory):</strong> {signal.suggestedTargets.join(" · ")}</p>}
      {signal.intent !== "unknown" && <div className="mt-3 space-y-2">
       <p className="text-[10px] opacity-70">Queue a pending evidence proposal for review. This does not run a reply, community post, experiment, or publication.</p>
       <StudioButton type="button" tone="accent" disabled={comments.isAudienceSignalProposed(signal.id)} onClick={() => comments.proposeAudienceSignal(signal.id)}>
        {comments.isAudienceSignalProposed(signal.id) ? "Proposal queued for review" : "Queue review proposal"}
       </StudioButton>
      </div>}
      {signal.limitations.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-4 text-[10px] opacity-70">{signal.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>}
     </article>)}
    </div> : <p className="rounded-xl border-2 border-dashed border-black/30 p-4 text-xs font-bold">No classifiable audience patterns in the loaded comments. Ambiguous feedback remains visible in the source queue and is not assigned an intent.</p>}
   </SubToolbox>
   {comments.inboundImageUrl && <SubToolbox title="Received Image" icon={<Link2 />} collapsible isOpenInitial={false}><div className="flex items-center gap-3"><StudioTextArea readOnly value={comments.inboundImageUrl} aria-label="Received image URL" className="min-h-[72px]" /><StudioButton type="button" onClick={() => navigator.clipboard.writeText(comments.inboundImageUrl || "")}>Copy URL</StudioButton></div></SubToolbox>}
 </div>
}
