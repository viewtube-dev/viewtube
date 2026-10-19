import { describe, expect, it } from "vitest"
import { buildBrainSparklineSegments } from "./BrainAnswerModules"

describe("buildBrainSparklineSegments", () => {
 it("keeps a measured zero as a real data point", () => {
  expect(buildBrainSparklineSegments([
   { label: "A", value: 0 },
   { label: "B", value: 4 },
   { label: "C", value: 8 },
  ])).toEqual([
   [{ label: "A", value: 0 }, { label: "B", value: 4 }, { label: "C", value: 8 }],
  ])
 })

 it("breaks a trend at missing values instead of plotting missing as zero", () => {
  expect(buildBrainSparklineSegments([
   { label: "A", value: 2 },
   { label: "B", value: null },
   { label: "C", value: 7 },
   { label: "D", value: 9 },
  ])).toEqual([
   [{ label: "A", value: 2 }],
   [{ label: "C", value: 7 }, { label: "D", value: 9 }],
  ])
 })
})
