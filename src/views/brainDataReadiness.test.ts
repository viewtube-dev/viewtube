import { describe, expect, it } from "vitest"
import { resolveBrainDataReadinessPresentation } from "./brainDataReadiness"

describe("resolveBrainDataReadinessPresentation", () => {
 it("does not show a green synced state when any dataset is stale", () => {
  expect(resolveBrainDataReadinessPresentation({
   dataStatus: "ready",
   staleDatasets: 1,
   missingDatasets: 0,
  })).toEqual({ label: "Stale channel data", tone: "warning" })
 })

 it("shows partial when inputs are missing even if the pack status says ready", () => {
  expect(resolveBrainDataReadinessPresentation({
   dataStatus: "ready",
   staleDatasets: 0,
   missingDatasets: 2,
  })).toEqual({ label: "Partial channel data", tone: "warning" })
 })

 it("keeps green only when data is ready and no datasets are stale or missing", () => {
  expect(resolveBrainDataReadinessPresentation({
   dataStatus: "ready",
   staleDatasets: 0,
   missingDatasets: 0,
  })).toEqual({ label: "Channel data synced", tone: "ready" })
 })

 it("preserves missing and partial pack states", () => {
  expect(resolveBrainDataReadinessPresentation({ dataStatus: "missing", staleDatasets: 0, missingDatasets: 0 }))
   .toEqual({ label: "Channel data unavailable", tone: "unavailable" })
  expect(resolveBrainDataReadinessPresentation({ dataStatus: "partial", staleDatasets: 0, missingDatasets: 0 }))
   .toEqual({ label: "Partial channel data", tone: "warning" })
 })
})
