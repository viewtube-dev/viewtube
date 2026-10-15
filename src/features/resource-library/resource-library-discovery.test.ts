import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import {
  RESOURCE_LIBRARY_ENTRIES,
  RESOURCE_LEARNING_PATHS,
  normalizeResourceProgress,
  searchResourceLibrary,
} from "./resourceLibraryRegistry"

const libraryComponent = readFileSync(new URL("./ResourceLibrary.tsx", import.meta.url), "utf8")
const appRoutes = readFileSync(new URL("../../app/AppRoutes.tsx", import.meta.url), "utf8")

describe("Resource Library discovery and learning paths", () => {
  it("finds resources through creator-language synonyms, not only literal titles", () => {
    const results = searchResourceLibrary("why is my video not getting views")
    expect(results.some((resource) => resource.id === "youtube-recommendations-discovery")).toBe(true)
    expect(searchResourceLibrary("thumbnail click rate").some((resource) => resource.id === "thumbnail-title-packaging-handbook")).toBe(true)
    expect(searchResourceLibrary("missing analytics data").some((resource) => resource.id === "reading-analytics-correctly-scope-windows-missingness")).toBe(true)
  })

  it("supports task intent and category filtering while keeping deterministic order", () => {
    const first = searchResourceLibrary("improve my next upload", { category: "Publishing" })
    expect(first.length).toBeGreaterThan(0)
    expect(first.every((resource) => resource.category === "Publishing")).toBe(true)
    expect(searchResourceLibrary("copyright license", { category: "Analytics" })).toHaveLength(0)
    expect(searchResourceLibrary("retention")).toEqual(searchResourceLibrary("retention"))
  })

  it("defines learning paths whose resource references all resolve", () => {
    expect(RESOURCE_LEARNING_PATHS.length).toBeGreaterThanOrEqual(5)
    for (const path of RESOURCE_LEARNING_PATHS) {
      expect(path.resourceIds.length).toBeGreaterThanOrEqual(2)
      for (const resourceId of path.resourceIds) {
        expect(RESOURCE_LIBRARY_ENTRIES.some((resource) => resource.id === resourceId), `${path.id}: ${resourceId}`).toBe(true)
      }
    }
  })

  it("normalizes persisted completion data to valid resource IDs only", () => {
    expect(normalizeResourceProgress(["youtube-recommendations-discovery", "not-a-resource", "youtube-recommendations-discovery"])).toEqual(["youtube-recommendations-discovery"])
    expect(normalizeResourceProgress(null)).toEqual([])
    expect(normalizeResourceProgress("bad-data")).toEqual([])
  })
  it("keeps workspace continuation links on routes that exist in AppRoutes", () => {
    for (const route of ["/studio", "/projects", "/analytics", "/ai-brain", "/vault", "/video-publisher"]) {
      expect(appRoutes, route).toContain(`path="${route}"`)
      expect(libraryComponent).toContain(route)
    }
    expect(libraryComponent).toContain("Help me apply the Resource Library guide")
    expect(libraryComponent).toContain("they do not automatically copy guide content or change project data")
  })

  it("persists completion locally and degrades gracefully if browser storage is unavailable", () => {
    expect(libraryComponent).toContain('viewtube:resource-library:completed:v1')
    expect(libraryComponent).toContain("normalizeResourceProgress")
    expect(libraryComponent).toContain("window.localStorage.setItem")
    expect(libraryComponent).toContain("Private browsing or storage policy may block persistence")
  })

  it("exposes path progress and completion state accessibly", () => {
    expect(libraryComponent).toContain('aria-pressed={active}')
    expect(libraryComponent).toContain('aria-pressed={completedResources.includes(selectedResource.id)}')
    expect(libraryComponent).toContain("completedCount")
    expect(libraryComponent).toContain("searchResourceLibrary(query")
  })

})
