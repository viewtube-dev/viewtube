import type { EvidenceRecord } from "../EvidenceRecord"
import type { PublicChannelSnapshot } from "../../publicHandleMode"

const evidenceId = (channelId: string, subject: string, metric: string) =>
  `public:${channelId}:${subject}:${metric}`

const observedRecord = (input: {
  id: string
  channelId: string
  videoId?: string | null
  metric: string
  value: number | string | null
  observedAt: string
  sourceRef: string
  limitations?: string[]
}): EvidenceRecord => ({
  id: input.id,
  owner: "research",
  sourceRef: input.sourceRef,
  channelId: input.channelId,
  videoId: input.videoId || null,
  entityType: input.videoId ? "video" : "channel",
  entityId: input.videoId || input.channelId,
  metric: input.metric,
  value: input.value,
  unit: input.metric.endsWith("_count") ? "count" : null,
  observedAt: input.observedAt,
  freshness: input.observedAt ? "fresh" : "unknown",
  epistemicState: input.value === null ? "MISSING" : "OBSERVED",
  confidence: input.value === null ? null : 1,
  missingness: input.value === null ? ["not_returned_by_public_source"] : [],
  limitations: [
    "Public YouTube channel/video data only; not private YouTube Analytics.",
    ...(input.limitations || []),
  ],
  provenance: {
    evidenceIds: [input.id],
    sourceRoute: "/api/public-channel/resolve",
    sourceVersion: "public-handle-v1",
  },
})

/**
 * Adapts the public resolver's snapshot to the existing canonical evidence
 * contract. This creates no parallel evidence store and deliberately does not
 * infer private metrics from public counts.
 */
export const buildPublicChannelEvidenceRecords = (
  snapshot: PublicChannelSnapshot,
): EvidenceRecord[] => {
  const channelId = snapshot.channelId
  const observedAt = snapshot.fetchedAt || ""
  const channelRef = `https://www.youtube.com/channel/${encodeURIComponent(channelId)}`
  const records: EvidenceRecord[] = [
    observedRecord({
      id: evidenceId(channelId, "channel", "channel_title"),
      channelId,
      metric: "channel_title",
      value: snapshot.title,
      observedAt,
      sourceRef: channelRef,
    }),
    observedRecord({
      id: evidenceId(channelId, "channel", "subscriber_count"),
      channelId,
      metric: "subscriber_count",
      value: snapshot.subscriberCount,
      observedAt,
      sourceRef: channelRef,
      limitations: ["Subscriber counts may be hidden or rounded by YouTube."],
    }),
    observedRecord({
      id: evidenceId(channelId, "channel", "video_count"),
      channelId,
      metric: "video_count",
      value: snapshot.videoCount,
      observedAt,
      sourceRef: channelRef,
    }),
    observedRecord({
      id: evidenceId(channelId, "channel", "view_count"),
      channelId,
      metric: "view_count",
      value: snapshot.viewCount,
      observedAt,
      sourceRef: channelRef,
    }),
  ]

  for (const video of snapshot.topVideos) {
    const videoRef = `https://www.youtube.com/watch?v=${encodeURIComponent(video.videoId)}`
    records.push(
      observedRecord({
        id: evidenceId(channelId, video.videoId, "video_title"),
        channelId,
        videoId: video.videoId,
        metric: "video_title",
        value: video.title,
        observedAt,
        sourceRef: videoRef,
      }),
      observedRecord({
        id: evidenceId(channelId, video.videoId, "video_published_at"),
        channelId,
        videoId: video.videoId,
        metric: "video_published_at",
        value: video.publishedAt,
        observedAt,
        sourceRef: videoRef,
      }),
      observedRecord({
        id: evidenceId(channelId, video.videoId, "video_view_count"),
        channelId,
        videoId: video.videoId,
        metric: "video_view_count",
        value: video.viewCount,
        observedAt,
        sourceRef: videoRef,
      }),
      observedRecord({
        id: evidenceId(channelId, video.videoId, "video_like_count"),
        channelId,
        videoId: video.videoId,
        metric: "video_like_count",
        value: video.likeCount,
        observedAt,
        sourceRef: videoRef,
      }),
      observedRecord({
        id: evidenceId(channelId, video.videoId, "video_comment_count"),
        channelId,
        videoId: video.videoId,
        metric: "video_comment_count",
        value: video.commentCount,
        observedAt,
        sourceRef: videoRef,
      }),
    )
  }
  return records
}
