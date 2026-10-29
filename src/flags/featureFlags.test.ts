import { beforeEach, describe, expect, it } from "vitest"

import { CAPABILITY_FLAGS, isCapabilityFlagEnabled } from "./featureFlags"

describe("capability feature flag defaults", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") window.localStorage.clear()
  })

  it("keeps all roadmap capabilities disabled until explicitly opted in", () => {
    for (const slug of Object.keys(CAPABILITY_FLAGS)) {
      expect(isCapabilityFlagEnabled(slug), slug).toBe(false)
    }
  })

  it("fails closed for unknown capability slugs", () => {
    expect(isCapabilityFlagEnabled("not-a-real-capability")).toBe(false)
  })
})
