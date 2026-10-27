import { describe, expect, it } from "vitest"
import type { ChannelContextProfile } from "./ChannelContextProfile"
import { resolveChannelContextForActiveChannel } from "./channelContextScope"

const profile: ChannelContextProfile = {
  identity: { name: "Example Channel", niche: "education" },
  goals: {},
  audience: {},
  content: {},
  brand: {},
  intelligence: {},
}

describe("resolveChannelContextForActiveChannel", () => {
  it("allows a profile when its channel name matches the active channel", () => {
    expect(resolveChannelContextForActiveChannel(profile, "Example Channel")).toBe(profile)
  })

  it("matches case and repeated whitespace without changing the saved profile", () => {
    expect(resolveChannelContextForActiveChannel(profile, "  EXAMPLE   CHANNEL ")).toBe(profile)
  })

  it("does not reuse one channel's profile for a different active channel", () => {
    expect(resolveChannelContextForActiveChannel(profile, "Different Channel")).toBeNull()
  })

  it("fails closed when either channel identity is missing", () => {
    expect(resolveChannelContextForActiveChannel(profile, null)).toBeNull()
    expect(resolveChannelContextForActiveChannel({ ...profile, identity: {} }, "Example Channel")).toBeNull()
    expect(resolveChannelContextForActiveChannel(null, "Example Channel")).toBeNull()
  })
})
