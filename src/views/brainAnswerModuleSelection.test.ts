import { describe, expect, it } from "vitest"
import type { AIBrainAnswerModule } from "../types"
import { selectBrainAnswerModules } from "./brainAnswerModuleSelection"

const module = (
 id: string,
 body: string,
 extra: Partial<AIBrainAnswerModule> = {},
): AIBrainAnswerModule => ({
 id,
 title: id,
 body,
 tone: "green",
 source: "growth",
 ...extra,
})

describe("selectBrainAnswerModules", () => {
 it("removes exact duplicate prose but keeps a meaningful prefix-related detail", () => {
  const insight = "Improve the opening hook to retain viewers."
  const result = selectBrainAnswerModules([
   module("duplicate", "  IMPROVE   THE OPENING HOOK to retain viewers. "),
   module("detail", "Improve the opening hook to retain viewers by showing the outcome in the first two seconds."),
  ], insight)

  expect(result.map((item) => item.id)).toEqual(["detail"])
 })

 it("preserves structured modules even when their prose repeats the key insight", () => {
  const result = selectBrainAnswerModules([
   module("metric", "Improve the opening hook.", {
    data: { metrics: [{ label: "Retention", value: 42 }] },
   }),
  ], "Improve the opening hook.")

  expect(result.map((item) => item.id)).toEqual(["metric"])
 })

 it("preserves missing-data modules and filters modules with no meaningful content", () => {
  const result = selectBrainAnswerModules([
   module("missing", "", { data: { missingReason: "Not enough measurements" } }),
   module("empty", ""),
  ], "A useful insight")

  expect(result.map((item) => item.id)).toEqual(["missing"])
 })

 it("treats trend points as structured content", () => {
  const result = selectBrainAnswerModules([
   module("trend", "A useful insight", {
    data: { points: [{ label: "Week 1", value: 3 }, { label: "Week 2", value: 4 }] },
   }),
  ], "A useful insight")

  expect(result.map((item) => item.id)).toEqual(["trend"])
 })
})
