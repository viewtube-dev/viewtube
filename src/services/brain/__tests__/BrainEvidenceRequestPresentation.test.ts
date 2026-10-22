import { describe, expect, it } from "vitest"
import { formatEvidenceRequestSpec } from "../BrainEvidenceRequestPresentation"
import type { EvidenceRequestSpec } from "../../../types"

const request = (overrides: Partial<EvidenceRequestSpec> = {}): EvidenceRequestSpec => ({
 count: null,
 formats: [],
 since: null,
 until: null,
 rankBy: "performance",
 filters: [],
 selectionMode: "both",
 ...overrides,
})

describe("formatEvidenceRequestSpec", () => {
 it("preserves the count, format, date, ranking, text filters, and cohort selection constraints", () => {
  expect(formatEvidenceRequestSpec(request({
   count: 10,
   formats: ["long", "live"],
   since: "2025-10-22",
   until: "2026-10-22",
   rankBy: "views",
   filters: ["tutorial", "beginner"],
   selectionMode: "top",
  }))).toEqual([
   { id: "count", label: "Requested count", value: "10 items" },
   { id: "formats", label: "Formats", value: "Long-form, Live" },
   { id: "date", label: "Date window", value: "2025-10-22 – 2026-10-22" },
   { id: "ranking", label: "Ranked by", value: "Views" },
   { id: "filters", label: "Text filters", value: "tutorial, beginner" },
   { id: "selection", label: "Cohort selection", value: "Top-ranked videos" },
  ])
 })

 it("labels defaults as defaults instead of implying that the creator requested filters", () => {
  expect(formatEvidenceRequestSpec(request())).toEqual([
   { id: "count", label: "Requested count", value: "Default cohort size" },
   { id: "formats", label: "Formats", value: "Any available format" },
   { id: "date", label: "Date window", value: "All available dates" },
   { id: "ranking", label: "Ranked by", value: "Performance score" },
   { id: "filters", label: "Text filters", value: "None recorded" },
   { id: "selection", label: "Cohort selection", value: "Top-ranked and recent videos" },
  ])
 })

 it("keeps open-ended date bounds explicit", () => {
  expect(formatEvidenceRequestSpec(request({ since: "2026-01-01" })).find((item) => item.id === "date"))
   .toEqual({ id: "date", label: "Date window", value: "From 2026-01-01; end date open" })
 })
})
