import { describe, expect, it } from "vitest"
import { normalizePublicChannelInput } from "./normalizeHandle"

describe("normalizePublicChannelInput", () => {
  it("normalizes handles and channel URLs without network access", () => {
    expect(normalizePublicChannelInput("@Example.Creator")).toEqual({
      kind: "handle",
      value: "Example.Creator",
      canonicalUrl: null,
    })
    expect(normalizePublicChannelInput("https://www.youtube.com/@Example.Creator/videos")).toEqual({
      kind: "handle",
      value: "Example.Creator",
      canonicalUrl: "https://www.youtube.com/@Example.Creator",
    })
  })

  it("preserves the semantic kind of channel IDs, custom URLs, and legacy usernames", () => {
    const channelId = "UC1234567890123456789012"
    expect(normalizePublicChannelInput(`https://youtube.com/channel/${channelId}`)?.kind).toBe("channel_id")
    expect(normalizePublicChannelInput("https://youtube.com/c/ExampleCreator")?.kind).toBe("custom_url")
    expect(normalizePublicChannelInput("https://youtube.com/user/ExampleCreator")?.kind).toBe("username")
  })

  it("rejects unsupported hosts and malformed inputs instead of treating them as handles", () => {
    expect(normalizePublicChannelInput("https://example.com/@creator")).toBeNull()
    expect(normalizePublicChannelInput("https://youtu.be/abc123")).toBeNull()
    expect(normalizePublicChannelInput("")).toBeNull()
    expect(normalizePublicChannelInput("https://youtube.com/channel/not-a-channel-id")).toBeNull()
  })

  it("accepts a bare channel ID", () => {
    expect(normalizePublicChannelInput("UC1234567890123456789012")?.kind).toBe("channel_id")
  })
})
