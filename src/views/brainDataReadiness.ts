export type BrainDataReadinessTone = "ready" | "warning" | "unavailable"

export const resolveBrainDataReadinessPresentation = (input: {
 dataStatus: "ready" | "partial" | "missing"
 staleDatasets: number
 missingDatasets: number
}): { label: string; tone: BrainDataReadinessTone } => {
 if (input.dataStatus === "missing") {
  return { label: "Channel data unavailable", tone: "unavailable" }
 }
 if (input.staleDatasets > 0 && input.missingDatasets > 0) {
  return { label: "Stale and partial channel data", tone: "warning" }
 }
 if (input.staleDatasets > 0) {
  return { label: "Stale channel data", tone: "warning" }
 }
 if (input.dataStatus === "partial" || input.missingDatasets > 0) {
  return { label: "Partial channel data", tone: "warning" }
 }
 return { label: "Channel data synced", tone: "ready" }
}
