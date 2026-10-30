import { describe, expect, it } from "vitest"
import { videoPublisherSeoStrategy } from "./videoPublisherSeo"

describe("Video Publisher SEO strategy", () => {
 it("preserves the complete legacy SEO package output contract", () => {
  expect(videoPublisherSeoStrategy.assetType).toBe("title")
  expect(videoPublisherSeoStrategy.outputSchemaVersion).toBe("video-publisher-seo-package-v1")
  expect(videoPublisherSeoStrategy.schema).toMatchObject({
   type: "OBJECT",
   required: ["analysis", "filenames", "titleSets", "description", "tags", "category", "pinnedComment", "communityPost", "shortsScript", "educationMoments", "social"],
  })
 })
 it("carries the publishing context and explicit evidence limits into the task", () => {
  const task = videoPublisherSeoStrategy.buildTaskInstruction({
   channelId: "channel-1",
   assetType: "title",
   instruction: "Build metadata",
   inputs: {
    concept: "Restore a vintage radio",
    niche: "restoration",
    script: "A repair walkthrough",
    videoLength: "12:00",
    channelHandle: "@example",
    videoFormat: "Longform",
   },
  }, {
   requested: ["channel_profile"],
   refs: [],
   missing: ["channel_profile"],
   payload: {},
   summary: "No channel evidence was resolved.",
  })
  expect(task).toContain("Restore a vintage radio")
  expect(task).toContain("A repair walkthrough")
  expect(task).toContain("Missing evidence: channel_profile")
  expect(task).toContain("Never invent statistics")
 })
 it("blocks duplicate title candidates and missing publishing fields", () => {
  const findings = videoPublisherSeoStrategy.rubric?.({
   titleSets: [
    { title: "Same title" },
    { title: "Same title" },
   ],
   description: "",
   tags: "",
  } as any, {
   channelId: "channel-1",
   assetType: "title",
   instruction: "Build metadata",
  })
  expect(findings?.map(item => item.rule)).toEqual([
   "title_candidate_count",
   "title_candidate_uniqueness",
   "description_required",
   "tags_required",
  ])
 })
})
