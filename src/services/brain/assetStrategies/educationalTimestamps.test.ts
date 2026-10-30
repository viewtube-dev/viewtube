import { describe, expect, it } from "vitest"
import { educationalTimestampStrategy } from "./educationalTimestamps"

describe("educational timestamp strategy", () => {
 it("uses the timestamps specialist type and exact five-question contract", () => {
  expect(educationalTimestampStrategy.assetType).toBe("timestamps")
  expect(educationalTimestampStrategy.outputSchemaVersion).toBe("educational-timestamp-questions-v1")
  expect(educationalTimestampStrategy.schema).toMatchObject({
   type: "ARRAY",
   items: { type: "STRING" },
  })
 })
 it("makes the suggested nature of timecodes explicit", () => {
  const task = educationalTimestampStrategy.buildTaskInstruction({
   channelId: "channel-1",
   assetType: "timestamps",
   instruction: "Prepare education timestamps",
   inputs: { title: "Radio repair", description: "A restoration guide", tags: ["radio", "repair"] },
  }, { requested: [], refs: [], missing: [], payload: {}, summary: "" })
  expect(task).toContain("exactly five")
  expect(task).toContain("suggested planning markers, not verified video timestamps")
  expect(task).toContain("Radio repair")
 })
 it("blocks malformed or incomplete timestamp prompts", () => {
  const findings = educationalTimestampStrategy.rubric?.([
   "00:00 — What tools are required?",
   "bad marker — Explain the repair.",
  ], { channelId: "channel-1", assetType: "timestamps", instruction: "Prepare questions" })
  expect(findings?.map(item => item.rule)).toEqual(expect.arrayContaining([
   "timestamp_question_count", "timestamp_marker_format",
  ]))
 })
})
