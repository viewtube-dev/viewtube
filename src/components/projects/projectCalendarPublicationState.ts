import type { ContentBuildYouTubeBinding } from "../../services/asset-engine/contracts"
import type { StudioCalendarEventKind } from "../../studio-ui/primitives/StudioCalendarPrimitives"

export type ProjectCalendarPublicationBadge = {
  label: string
  kind: StudioCalendarEventKind
  status: string
}

export const getProjectCalendarPublicationBadge = (input: {
  binding: ContentBuildYouTubeBinding | null
  plannedDateKey: string | null
  remoteScheduledDateKey: string | null
  stateUnavailable?: boolean
}): ProjectCalendarPublicationBadge | null => {
  if (input.stateUnavailable) {
    return {
      label: "YOUTUBE STATE UNAVAILABLE",
      kind: "reminder",
      status: "saved state could not be read",
    }
  }

  const binding = input.binding
  if (!binding) return null

  if (
    binding.status === "scheduled" &&
    input.plannedDateKey &&
    input.remoteScheduledDateKey &&
    input.plannedDateKey !== input.remoteScheduledDateKey
  ) {
    return {
      label: "YOUTUBE DATE MISMATCH",
      kind: "reminder",
      status: `scheduled for ${input.remoteScheduledDateKey}`,
    }
  }

  const kind: StudioCalendarEventKind =
    binding.status === "scheduled" ? "publish" :
    binding.status === "published" ? "milestone" :
    "reminder"

  const statusDate = binding.status === "scheduled"
    ? input.remoteScheduledDateKey
    : binding.status === "published" && binding.publishedAt
      ? binding.publishedAt.slice(0, 10)
      : null

  return {
    label: `YOUTUBE ${binding.status.toUpperCase()}`,
    kind,
    status: statusDate
      ? `${binding.status} ${statusDate}`
      : binding.lastVerifiedAt
        ? `verified ${binding.lastVerifiedAt.slice(0, 10)}`
        : "saved state",
  }
}
