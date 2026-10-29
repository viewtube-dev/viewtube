import { afterEach, describe, expect, it } from "vitest"
import { readDiagnostics } from "../diagnostics"
import { reportSyncError } from "./AnalyticsErrorReporter"

describe("analytics error reporting integration", () => {
  afterEach(() => {
    // The canonical diagnostic buffer is in-memory and intentionally shared;
    // use a unique event message to isolate assertions between test runs.
  })

  it("adds analytics sync failures to the unified diagnostics contract", () => {
    reportSyncError("test analytics sync failed")
    const entry = readDiagnostics().filter((item) => item.tag === "analytics-sync:sync_error").at(-1)

    expect(entry).toMatchObject({
      level: "error",
      message: "test analytics sync failed",
      details: {
        source: "analytics-error-reporter",
        subsystem: "analytics",
        kind: "sync_error",
        status: "failed",
        expected: "Analytics sync completes and persists current data",
        actual: "An analytics sync phase reported an error",
        recommendedActions: [
          "Check account connection and required scopes",
          "Verify the requested metric bundle and date range",
          "Check snapshot freshness and persistence outcome",
        ],
      },
    })
  })
})
