import type { EvidenceRequestSpec } from "../../types"

export interface EvidenceRequestConstraint {
 id: "count" | "formats" | "date" | "ranking" | "filters" | "selection"
 label: string
 value: string
}

const rankingLabels: Record<EvidenceRequestSpec["rankBy"], string> = {
 performance: "Default performance ranking",
 views: "Views",
 watchTime: "Watch time",
 subscribers: "Subscribers",
 revenue: "Revenue",
 ctr: "Click-through rate",
 retention: "Retention",
 publishedAt: "Publish date",
}

const formatLabels: Record<EvidenceRequestSpec["formats"][number], string> = {
 short: "Shorts",
 long: "Long-form",
 live: "Live",
}

const formatDateWindow = (spec: EvidenceRequestSpec): string => {
 if (spec.since && spec.until) return `${spec.since} – ${spec.until}`
 if (spec.since) return `From ${spec.since}; end date open`
 if (spec.until) return `Start date open; through ${spec.until}`
 return "All available dates"
}

/** Present the exact stored request specification without inventing constraints. */
export const formatEvidenceRequestSpec = (spec: EvidenceRequestSpec): EvidenceRequestConstraint[] => [
 {
  id: "count",
  label: "Requested count",
  value: spec.count === null ? "Default cohort size" : `${spec.count} items`,
 },
 {
  id: "formats",
  label: "Formats",
  value: spec.formats.length ? spec.formats.map((format) => formatLabels[format]).join(", ") : "Any available format",
 },
 {
  id: "date",
  label: "Date window",
  value: formatDateWindow(spec),
 },
 {
  id: "ranking",
  label: "Ranked by",
  value: rankingLabels[spec.rankBy],
 },
 {
  id: "filters",
  label: "Text filters",
  value: spec.filters.length ? spec.filters.join(", ") : "None recorded",
 },
 {
  id: "selection",
  label: "Cohort selection",
  value: spec.selectionMode === "top"
   ? "Top-ranked videos"
   : spec.selectionMode === "recent"
    ? "Recent videos"
    : "Top-ranked and recent videos",
 },
]
