import { beforeEach, describe, expect, it, vi } from "vitest"

const getPublishTransaction = vi.hoisted(() => vi.fn())
const completePublishStep = vi.hoisted(() => vi.fn())
const failPublishTransaction = vi.hoisted(() => vi.fn())
const getContentBuild = vi.hoisted(() => vi.fn())
const uploadUnifiedVideo = vi.hoisted(() => vi.fn())
const updateUnifiedVideo = vi.hoisted(() => vi.fn())
const getUnifiedVideo = vi.hoisted(() => vi.fn())

vi.mock("../asset-engine/PublishTransaction", () => ({
 beginPublishTransaction: vi.fn(),
 completePublishStep,
 failPublishTransaction,
 getPublishTransaction,
}))

vi.mock("../asset-engine/ContentBuildRepository", () => ({
 getContentBuild,
}))

vi.mock("./youtubeWriteTransport", () => ({
 addUnifiedPlaylistItem: vi.fn(),
 getUnifiedVideo,
 updateUnifiedThumbnail: vi.fn(),
 updateUnifiedVideo,
 uploadUnifiedCaptions: vi.fn(),
 uploadUnifiedVideo,
}))

import {
 runPublishTransactionStep,
 uploadPublishTransactionVideo,
 verifyPublishTransactionRemoteState,
} from "./PublishTransactionYouTubeBridge"

const transaction = (overrides: Record<string, unknown> = {}) => ({
 id: "publish-transaction-1",
 contentBuildId: "content-build-1",
 youtubeVideoId: null,
 steps: {},
 ...overrides,
})

describe("PublishTransactionYouTubeBridge capability boundary", () => {
 beforeEach(() => {
  vi.clearAllMocks()
  getPublishTransaction.mockReturnValue(transaction())
  getContentBuild.mockReturnValue({
   id: "content-build-1",
   stage: "published",
   workflow: { blockerIds: [] },
  })
 })

 it("blocks video upload before the provider is invoked for a published build", async () => {
  await expect(uploadPublishTransactionVideo({
   transactionId: "publish-transaction-1",
   file: new Blob(["video"]),
   metadata: {} as never,
  })).rejects.toThrow(/does not allow capability publish/i)

  expect(uploadUnifiedVideo).not.toHaveBeenCalled()
 })

 it("blocks metadata provider dispatch before execution for a published build", async () => {
  const execute = vi.fn().mockResolvedValue({ applied: true })

  await expect(runPublishTransactionStep({
   transactionId: "publish-transaction-1",
   step: "apply-metadata",
   execute,
  })).rejects.toThrow(/does not allow capability publish/i)

  expect(execute).not.toHaveBeenCalled()
  expect(updateUnifiedVideo).not.toHaveBeenCalled()
 })

 it("blocks remote verification when the canonical build has unresolved blockers", async () => {
  getPublishTransaction.mockReturnValue(transaction({ youtubeVideoId: "youtube-1" }))
  getContentBuild.mockReturnValue({
   id: "content-build-1",
   stage: "launch",
   workflow: { blockerIds: ["approval-missing"] },
  })

  await expect(verifyPublishTransactionRemoteState("publish-transaction-1"))
   .rejects.toThrow(/blockers preventing provider dispatch: approval-missing/i)

  expect(getUnifiedVideo).not.toHaveBeenCalled()
 })
})
