// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createLocalVaultAsset, listVaultAssets } from "../vaultAdapter"
import { createVaultTask, listVaultTasks, updateVaultTask } from "../vaultTaskCenter"
import { resolveVaultTranscriptVideoId, runVaultTranscriptTask } from "../vaultTranscriptTask"

describe("resolveVaultTranscriptVideoId", () => {
 it("prefers canonical asset metadata and falls back to legacy metadata and ContentBuild", () => {
  const canonical = createLocalVaultAsset({
   name: "Canonical",
   kind: "video",
   tags: [],
   metadata: { youtubeVideoId: " youtube-primary ", videoId: "legacy-id" },
  })
  const legacy = createLocalVaultAsset({
   name: "Legacy",
   kind: "video",
   tags: [],
   metadata: { videoId: " legacy-video " },
  })
  const buildOnly = createLocalVaultAsset({ name: "Build", kind: "video", tags: [] })
  const youtubeAlias = createLocalVaultAsset({
   name: "YouTube alias",
   kind: "video",
   tags: [],
   metadata: { youtubeId: " youtube-alias-id " },
  })

  expect(resolveVaultTranscriptVideoId({ asset: canonical, contentBuildVideoId: "build-id" })).toBe("youtube-primary")
  expect(resolveVaultTranscriptVideoId({ asset: legacy })).toBe("legacy-video")
  expect(resolveVaultTranscriptVideoId({ asset: buildOnly, contentBuildVideoId: " build-video " })).toBe("build-video")
  expect(resolveVaultTranscriptVideoId({ asset: youtubeAlias })).toBe("youtube-alias-id")
 })

 it("returns null when every candidate is missing or invalid", () => {
  const asset = createLocalVaultAsset({
   name: "No source",
   kind: "video",
   tags: [],
   metadata: { youtubeVideoId: " ", videoId: 42 },
  })
  expect(resolveVaultTranscriptVideoId({ asset })).toBeNull()
 })
})

describe("runVaultTranscriptTask", () => {
 beforeEach(() => localStorage.clear())

 it("creates a linked transcript asset from real acquisition output", async () => {
  const source = createLocalVaultAsset({ name: "Published Video", kind: "video", tags: [] })
  const acquire = vi.fn().mockResolvedValue({
   ok: true,
   transcript: {
    status: "available",
    source: "manual_subtitles",
    languageCode: "en",
    text: "Opening line.\nSecond line.",
   },
  })

  const result = await runVaultTranscriptTask({
   asset: source,
   videoId: "yt-123",
   acquire,
  })

  expect(result.asset?.metadata?.parentAssetIds).toEqual([source.id])
  expect(result.asset?.metadata?.transcriptText).toContain("Opening line.")
  expect(listVaultAssets().map((asset) => asset.id)).toContain(result.asset?.id)
  expect(listVaultTasks()[0]).toMatchObject({
   type: "transcript",
   status: "completed",
   targetAssetId: source.id,
  })
 })

 it("reuses an existing failed task when retrying transcript acquisition", async () => {
  const source = createLocalVaultAsset({ name: "Retry Video", kind: "video", tags: [] })
  const task = createVaultTask({
   type: "transcript",
   label: "Transcript · Retry Video",
   targetAssetId: source.id,
  })
  updateVaultTask(task.id, { status: "failed", progress: 100, detail: "Offline" })
  const acquire = vi.fn().mockResolvedValue({
   ok: true,
   transcript: {
    status: "available",
    source: "auto_subtitles",
    text: "Recovered transcript.",
   },
  })

  const result = await runVaultTranscriptTask({
   asset: source,
   videoId: "yt-retry",
   taskId: task.id,
   acquire,
  })

  expect(result.task.id).toBe(task.id)
  expect(listVaultTasks()).toHaveLength(1)
  expect(result.task.status).toBe("completed")
 })

 it("records a failed durable transcript task when acquisition has no transcript", async () => {
  const source = createLocalVaultAsset({ name: "Video", kind: "video", tags: [] })
  const acquire = vi.fn().mockResolvedValue({
   ok: true,
   transcript: { status: "missing", source: "unknown" },
  })

  const result = await runVaultTranscriptTask({
   asset: source,
   videoId: "yt-404",
   acquire,
  })

  expect(result.asset).toBeNull()
  expect(result.task.status).toBe("failed")
  expect(result.task.targetAssetId).toBe(source.id)
 })
})
