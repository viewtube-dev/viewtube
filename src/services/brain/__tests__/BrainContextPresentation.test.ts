import { describe, expect, it } from "vitest"
import { buildBrainContextDisplayItems } from "../BrainContextPresentation"

describe("Brain context presentation", () => {
 it("labels active scope and source provenance without inventing epistemic certainty", () => {
  const items = buildBrainContextDisplayItems({
   channelId: "channel-7",
   project: {
    projectId: "project-2",
    contentBuildId: "build-9",
    title: "Launch series",
    source: "canonical_project_content_build",
   },
   selection: { label: "Top video", sourceId: "video-42" },
  })

  expect(items).toEqual([
   { id: "channel", label: "Channel", value: "channel-7", provenance: "Active scope" },
   { id: "project", label: "Project", value: "Launch series · project-2", provenance: "Canonical project + ContentBuild" },
   { id: "content-build", label: "ContentBuild", value: "build-9", provenance: "Linked ID" },
   { id: "selection", label: "Selected video / asset", value: "Top video · video-42", provenance: "Surface selection" },
  ])
  expect(items.map((item) => item.provenance).join(" ")).not.toMatch(/confirmed|inferred|temporary/i)
 })

 it("makes missing scope and selection explicit without guessing", () => {
  const items = buildBrainContextDisplayItems({
   channelId: null,
   project: null,
   selection: null,
  })

  expect(items[0]).toMatchObject({ value: "No channel ID", provenance: "No channel scope" })
  expect(items[1]).toMatchObject({ value: "No project in this answer's context", provenance: "Not supplied" })
  expect(items[2]).toMatchObject({ value: "No linked ContentBuild", provenance: "Not supplied" })
  expect(items[3]).toMatchObject({ value: "No selected video or asset was supplied", provenance: "Not supplied" })
 })
})
