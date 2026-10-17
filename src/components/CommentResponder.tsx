import React from "react"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalLink, Link2, Loader2, MessagesSquare, RefreshCw, Sparkles, ThumbsUp } from "lucide-react"
import { buildYouTubeCommentUrl } from "../services/youtube/commentHandoff"
import { SubToolbox, SubToolboxGridActionButton, SubToolboxInnerActionButton } from "./Toolbox"
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
     ? comments.tab === "history" ? "No reply history yet." : "No unreplied comments found."
     : `${comments.currentIndex + 1} of ${comments.displayThreads.length}`

 return <div data-vt-comment-responder data-state={dataState} className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 lg:gap-8 items-start w-full p-1 sm:p-3 lg:p-8 bg-white">
  <div className="flex flex-col gap-2 sm:gap-4 lg:gap-6 min-w-0">
   <SubToolbox title="Comment Queue" icon={<MessagesSquare />} collapsible isOpenInitial>
    <div className="grid grid-cols-2 gap-2" aria-label="Comment queue view">
     <SubToolboxInnerActionButton label={`New · ${comments.tab === "unreplied" ? comments.displayThreads.length : ""}`} iconName="message" tone={comments.tab === "unreplied" ? "pink" : "cyan"} onClick={() => comments.setTab("unreplied")} />
     <SubToolboxInnerActionButton label={`History · ${comments.tab === "history" ? comments.displayThreads.length : ""}`} iconName="history" tone={comments.tab === "history" ? "pink" : "cyan"} onClick={() => comments.setTab("history")} />
    </div>
    <div className="grid grid-cols-[1fr_auto] gap-2 mt-2 sm:mt-3 lg:mt-4">
     <div className="grid grid-cols-2 gap-2">
      <StudioButton type="button" aria-label="Previous comment" disabled={!context.connected || comments.currentIndex === 0} onClick={() => comments.setCurrentIndex(Math.max(0, comments.currentIndex - 1))} tone="neutral">Previous</StudioButton>
      <StudioButton type="button" aria-label="Next comment" disabled={!context.connected || comments.currentIndex >= comments.displayThreads.length - 1} onClick={() => comments.setCurrentIndex(Math.min(comments.displayThreads.length - 1, comments.currentIndex + 1))} tone="neutral">Next</StudioButton>
     </div>
     <StudioSquareIconButton type="button" label={context.connected ? "Refresh comments" : "Connect YouTube channel"} icon={context.connected ? <RefreshCw size={17} className={comments.loading ? "animate-spin" : ""} /> : <Link2 size={17} />} onClick={context.connected ? comments.refresh : comments.reconnect} disabled={context.connected && comments.loading} tone="accent" animate />
    </div>
    <div role="status" aria-live="polite" className="mt-2 sm:mt-3 min-h-5 text-[10px] font-black uppercase">{queueStatus}</div>
    {!context.connected && <div className="mt-2 sm:mt-3"><SubToolboxGridActionButton label="Connect YouTube Channel" iconName="link" tone="green" onClick={comments.reconnect} /></div>}
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

  <div className="flex flex-col gap-2 sm:gap-4 lg:gap-6 min-w-0">
   <SubToolbox title="Conversation Thread" icon={<MessagesSquare />} collapsible isOpenInitial>
    {thread && <div data-comment-video-context className="mb-4 grid min-w-0 grid-cols-[112px_minmax(0,1fr)] items-center gap-3 rounded-xl border-2 border-black bg-white p-2 sm:grid-cols-[140px_minmax(0,1fr)]">
     <div className="aspect-video overflow-hidden rounded-lg border-2 border-black bg-gray-100">{thumbnail ? <img src={thumbnail} width={320} height={180} alt={"Thumbnail for " + videoTitle} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center"><Loader2 className="animate-spin" /></div>}</div>
     <div className="min-w-0">
      <p className="text-[9px] font-black uppercase tracking-wide opacity-50">Commented on this video</p>
      <h3 className="mt-1 break-words text-sm font-black leading-tight">{videoTitle}</h3>
      {commentUrl && <a href={commentUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase underline"><ExternalLink size={12} aria-hidden="true" />Open on YouTube</a>}
     </div>
    </div>}
    {thread && snippet ? <div role="region" tabIndex={0} aria-label="Comment conversation thread" className="max-h-[min(62vh,640px)] space-y-4 overflow-y-auto p-1">
     <article className="flex min-w-0 items-start gap-2 sm:gap-3" data-comment-message="original">
      <CommentAvatar name={plainText(snippet.authorDisplayName || "Viewer")} src={snippet.authorProfileImageUrl} />
      <div className="min-w-0 flex-1">
       <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[10px] font-black uppercase">
        <span className="break-words">{plainText(snippet.authorDisplayName || "Viewer")}</span>
        <span className="font-bold normal-case opacity-50">{formatCommentDate(snippet.publishedAt || snippet.updatedAt)}</span>
        <span className="ml-auto shrink-0 opacity-50">{Number(snippet.likeCount || 0).toLocaleString()} likes</span>
       </div>
       <div className="comment-responder-message-bubble w-fit max-w-full rounded-2xl rounded-tl-sm border-2 border-black bg-[#FFF9E8] px-3 py-3 text-sm font-bold leading-relaxed whitespace-pre-wrap break-words">{plainText(snippet.textDisplay || snippet.textOriginal || "")}</div>
       <div className="mt-1 text-[9px] font-black uppercase tracking-wide opacity-45">Original comment</div>
      </div>
     </article>
     {replies.map((reply: any, index: number) => {
      const replySnippet = reply.snippet || {}
      const authorName = plainText(replySnippet.authorDisplayName || "Reply")
      const isCreatorReply = String(replySnippet.authorChannelId?.value || "") === String(context.channelId || "")
      const replyText = plainText(replySnippet.textDisplay || replySnippet.textOriginal || "")
      return <article key={reply.id || index} data-comment-message="reply" className={"flex min-w-0 items-start gap-2 sm:gap-3 " + (isCreatorReply ? "flex-row-reverse" : "")}>
       <CommentAvatar name={authorName} src={replySnippet.authorProfileImageUrl || (isCreatorReply ? context.channelThumbnail : undefined)} creator={isCreatorReply} />
       <div className={"min-w-0 flex-1 " + (isCreatorReply ? "text-right" : "")}>
        <div className={"mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[10px] font-black uppercase " + (isCreatorReply ? "justify-end" : "")}>
         <span className="break-words">{authorName}{isCreatorReply ? " · You" : ""}</span>
         <span className="font-bold normal-case opacity-50">{formatCommentDate(replySnippet.publishedAt || replySnippet.updatedAt)}</span>
        </div>
        <div className={"comment-responder-message-bubble inline-block max-w-full rounded-2xl border-2 border-black px-3 py-3 text-left text-sm font-bold leading-relaxed whitespace-pre-wrap break-words " + (isCreatorReply ? "rounded-tr-sm bg-[#DDF4FF]" : "rounded-tl-sm bg-white")}>{replyText}</div>
       </div>
      </article>
     })}
     {replies.length === 0 && <p className="ml-11 text-[10px] font-bold uppercase tracking-wide opacity-45">No replies yet — start the conversation below.</p>}
    </div> : <div className="min-h-24 sm:min-h-32 grid place-items-center rounded-xl border-2 border-dashed border-black/30 bg-white/60 p-4 text-center text-xs font-black uppercase opacity-60">{dataState === "disconnected" ? "Connect your channel to load comments." : dataState === "loading" ? "Loading conversation…" : dataState === "error" ? "Conversation unavailable. Refresh and try again." : "No comment selected."}</div>}
    {comments.error && context.connected && <div role="alert" className="mt-3 rounded-xl border-[3px] border-black bg-[#FFB158] p-3 text-xs font-black">{comments.error}</div>}
   </SubToolbox>

   <SubToolbox title={comments.tab === "history" ? "Follow-Up Reply" : "Reply Composer"} icon={<Sparkles />} collapsible isOpenInitial>
    <label htmlFor="comment-reply-copy" className="text-[10px] font-black uppercase">Reply</label>
    <StudioTextArea id="comment-reply-copy" name="commentReply" value={comments.replyText} onChange={(event) => comments.setReplyText(event.target.value)} placeholder={!context.connected ? "Connect your YouTube channel to reply…" : comments.tab === "history" ? "Add a follow-up reply…" : "Write or generate a reply…"} className="mt-2 min-h-[110px] sm:min-h-[130px] lg:min-h-[150px]" disabled={!context.connected || !thread} />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-4">
     <SubToolboxInnerActionButton label={comments.generating ? "Working…" : comments.replyText.trim() ? "Refine" : "Generate"} iconName="sparkles" tone="yellow" disabled={!context.connected || !thread || comments.generating} onClick={comments.draftReply} />
     <SubToolboxInnerActionButton label="Suggest Videos" iconName="link" tone="cyan" disabled={!context.connected || !thread || comments.generating} onClick={comments.suggestVideo} />
    </div>
   </SubToolbox>

   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
    {commentUrl ? <a href={commentUrl} target="_blank" rel="noreferrer" className="min-h-14 border-[4px] border-black rounded-[16px] bg-[#FFC587] shadow-[5px_5px_0_0_#F59E46] font-black uppercase text-lg flex items-center justify-center gap-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"><ThumbsUp size={18} aria-hidden="true" />Open on YouTube</a> : <StudioSplitLeftButton icon={<ExternalLink size={20} aria-hidden="true" />} tone="warning" disabled onClick={() => {}}>Open Comment</StudioSplitLeftButton>}
    <SubToolboxGridActionButton label={comments.canPostReply ? "Post Reply" : context.connected ? "Reconnect Channel" : "Connect Channel"} iconName={comments.canPostReply ? "send" : "link"} tone="green" disabled={comments.canPostReply && (!thread || !comments.replyText.trim() || comments.loading)} onClick={comments.canPostReply ? comments.postReply : comments.reconnect} />
   </div>
  </div>
 </div>
}
