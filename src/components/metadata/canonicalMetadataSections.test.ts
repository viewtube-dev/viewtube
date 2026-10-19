import { describe, expect, it } from "vitest"
import { CANONICAL_METADATA_SECTIONS, PRIMARY_METADATA_SECTIONS, SECONDARY_METADATA_SECTIONS } from "./CanonicalMetadataSections"

describe("canonical metadata section hierarchy", () => {
  it("keeps the required 13 sections in the canonical order", () => {
    expect(CANONICAL_METADATA_SECTIONS).toEqual([
      "video-upload",
      "title",
      "thumbnail",
      "visibility",
      "audience",
      "timestamps",
      "description",
      "location",
      "playlists",
      "community",
      "ai-use",
      "tags",
      "category",
    ])
  })

  it("keeps secondary sections lower-weight while preserving their positions", () => {
    expect(PRIMARY_METADATA_SECTIONS).toEqual([
      "video-upload",
      "title",
      "thumbnail",
      "description",
      "playlists",
      "tags",
      "category",
    ])
    expect(SECONDARY_METADATA_SECTIONS).toEqual([
      "visibility",
      "audience",
      "timestamps",
      "location",
      "community",
      "ai-use",
    ])
  })
})
