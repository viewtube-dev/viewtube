import { describe, expect, it } from "vitest"

import { isInitialInventoryFresh } from "./initialChannelBootstrap"

describe("initial channel bootstrap freshness", () => {
 it("treats a missing restored snapshot as stale instead of dereferencing it", () => {
  expect(isInitialInventoryFresh(null, false)).toBe(false)
 })

 it("forces inventory stale even when the restored inventory is fresh", () => {
  const restored = {
   channelId: "channel-1",
   channel: { publicVideoCount: 10, channelId: "channel-1" },
   videos: [{ syncedAt: new Date().toISOString() }],
  } as any

  expect(isInitialInventoryFresh(restored, false)).toBe(true)
  expect(isInitialInventoryFresh(restored, true)).toBe(false)
 })
})
