import { describe, expect, it } from "vitest"
import { getProjectCalendarPublicationBadge } from "./projectCalendarPublicationState"

describe("project calendar publication state", () => {
  it("does not invent a YouTube status when no binding exists", () => {
    expect(getProjectCalendarPublicationBadge({ binding: null, plannedDateKey: "2026-10-30", remoteScheduledDateKey: null })).toBeNull()
  })

  it("surfaces a mismatch between the planned project date and saved YouTube schedule", () => {
    expect(getProjectCalendarPublicationBadge({
      binding: { videoId: "video-1", canonicalUrl: "https://youtube.com/watch?v=video-1", status: "scheduled", scheduledAt: "2026-10-31T18:00:00.000Z" },
      plannedDateKey: "2026-10-30",
      remoteScheduledDateKey: "2026-10-31",
    })).toEqual({ label: "YOUTUBE DATE MISMATCH", kind: "reminder", status: "scheduled for 2026-10-31" })
  })

  it("shows the canonical saved publication state when dates agree", () => {
    expect(getProjectCalendarPublicationBadge({
      binding: { videoId: "video-2", canonicalUrl: "https://youtube.com/watch?v=video-2", status: "scheduled", scheduledAt: "2026-10-30T18:00:00.000Z" },
      plannedDateKey: "2026-10-30",
      remoteScheduledDateKey: "2026-10-30",
    })).toEqual({ label: "YOUTUBE SCHEDULED", kind: "publish", status: "scheduled for 2026-10-30" })
  })

  it("reports an unreadable binding as unavailable rather than fabricating a state", () => {
    expect(getProjectCalendarPublicationBadge({
      binding: null,
      plannedDateKey: null,
      remoteScheduledDateKey: null,
      stateUnavailable: true,
    })).toEqual({ label: "YOUTUBE STATE UNAVAILABLE", kind: "reminder", status: "saved state could not be read" })
  })
})
