export interface PublicChannelResolution {
 input: string
 resolvedChannelId: string | null
 resolvedHandle: string | null
 channelTitle: string | null
 reason: string | null
}

export interface PublicChannelSnapshot {
 mode: "public_handle"
 fetchedAt: string
 channelId: string
 handle: string | null
 title: string | null
 subscriberCount: number | null
 videoCount: number | null
 viewCount: number | null
 topVideos: Array<{
  videoId: string
  title: string
  publishedAt: string | null
  viewCount: number | null
  likeCount: number | null
  commentCount: number | null
 }>
 provenance?: {
  source: "youtube_data_api_public"
  evidenceMode: "public_handle"
  privateMetricsIncluded: false
 }
}

type PublicLookupResponse = {
 ok: boolean
 code?: string
 message?: string
 mode?: "public_handle"
 fetchedAt?: string
 channelId?: string
 handle?: string | null
 title?: string | null
 subscriberCount?: number | null
 videoCount?: number | null
 viewCount?: number | null
 topVideos?: PublicChannelSnapshot["topVideos"]
 provenance?: PublicChannelSnapshot["provenance"]
}

const resolveFromServer = async (handleInput: string): Promise<PublicLookupResponse> => {
 const response = await fetch("/api/public-channel/resolve", {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  credentials: "same-origin",
  body: JSON.stringify({ input: handleInput }),
 })
 const payload = await response.json().catch(() => null) as PublicLookupResponse | null
 if (!response.ok || !payload?.ok) {
  throw new Error(payload?.message || "Public channel lookup failed.")
 }
 return payload
}

export const resolvePublicChannel = async (
 handleInput: string,
): Promise<PublicChannelResolution> => {
 try {
  const result = await resolveFromServer(handleInput)
  return {
   input: handleInput,
   resolvedChannelId: result.channelId || null,
   resolvedHandle: result.handle || null,
   channelTitle: result.title || null,
   reason: null,
  }
 } catch (error) {
  return {
   input: handleInput,
   resolvedChannelId: null,
   resolvedHandle: null,
   channelTitle: null,
   reason: error instanceof Error ? error.message : "Public channel lookup failed.",
  }
 }
}

export const fetchPublicChannelSnapshot = async (
 handleInput: string,
): Promise<PublicChannelSnapshot | null> => {
 try {
  const result = await resolveFromServer(handleInput)
  if (!result.channelId || !result.fetchedAt) return null
  return {
   mode: "public_handle",
   fetchedAt: result.fetchedAt,
   channelId: result.channelId,
   handle: result.handle || null,
   title: result.title || null,
   subscriberCount: result.subscriberCount ?? null,
   videoCount: result.videoCount ?? null,
   viewCount: result.viewCount ?? null,
   topVideos: result.topVideos || [],
   provenance: result.provenance,
  }
 } catch {
  return null
 }
}
