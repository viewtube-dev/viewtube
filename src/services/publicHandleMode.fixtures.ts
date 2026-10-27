import type { PublicChannelSnapshot } from "./publicHandleMode"

type FixtureDefinition = PublicChannelSnapshot & { aliases: string[] }

const fixtures: FixtureDefinition[] = [
  {
    aliases: ["themotionvis"],
    mode: "public_handle",
    source: "fixture",
    fetchedAt: "2026-01-15T12:00:00.000Z",
    channelId: "UC_FIXTURE_THEMOTIONVIS",
    handle: "@themotionvis",
    title: "The Motion Vis (fixture)",
    subscriberCount: 12500,
    videoCount: 84,
    viewCount: 1450000,
    topVideos: [
      { videoId: "fixture-motion-001", title: "Motion Design Breakdown (fixture)", publishedAt: "2026-01-10T12:00:00.000Z", viewCount: 8200, likeCount: 410, commentCount: 32 },
      { videoId: "fixture-motion-002", title: "Visual Storytelling in Motion (fixture)", publishedAt: "2026-01-03T12:00:00.000Z", viewCount: 6100, likeCount: 285, commentCount: 19 },
      { videoId: "fixture-motion-003", title: "A Short Animation Study (fixture)", publishedAt: "2025-12-27T12:00:00.000Z", viewCount: 4700, likeCount: 201, commentCount: 12 },
    ],
  },
  {
    aliases: ["viewtube_demo", "demo"],
    mode: "public_handle",
    source: "fixture",
    fetchedAt: "2026-01-15T12:00:00.000Z",
    channelId: "UC_FIXTURE_VIEWTUBE_DEMO",
    handle: "@viewtube_demo",
    title: "ViewTube Demo (fixture)",
    subscriberCount: 2500,
    videoCount: 36,
    viewCount: 215000,
    topVideos: [
      { videoId: "fixture-viewtube-001", title: "Meet ViewTube (fixture)", publishedAt: "2026-01-08T12:00:00.000Z", viewCount: 3200, likeCount: 150, commentCount: 18 },
      { videoId: "fixture-viewtube-002", title: "Creator Workflow Demo (fixture)", publishedAt: "2026-01-01T12:00:00.000Z", viewCount: 2800, likeCount: 124, commentCount: 11 },
    ],
  },
]

export const fixturesEnabled = (): boolean => {
  if (import.meta.env.DEV === true || import.meta.env.VITE_PUBLIC_HANDLE_FIXTURES === "1") return true
  try {
    return typeof localStorage !== "undefined" && localStorage.getItem("vt_public_handle_fixtures") === "1"
  } catch {
    return false
  }
}

const candidateFor = (input: string): string => {
  const trimmed = String(input || "").trim()
  let candidate = trimmed
  try {
    const url = new URL(trimmed)
    const path = url.pathname
    if (path.startsWith("/@")) candidate = path.slice(2)
    else if (path.startsWith("/c/")) candidate = path.slice(3)
    else if (path.startsWith("/user/")) candidate = path.slice(6)
  } catch {
    // Accept a bare handle below.
  }
  return candidate.replace(/^@+/, "").split(/[/?#]/)[0].toLowerCase()
}

export const resolveFromFixture = (input: string): PublicChannelSnapshot | null => {
  if (!fixturesEnabled()) return null
  const candidate = candidateFor(input)
  const fixture = fixtures.find((item) => item.aliases.includes(candidate))
  return fixture ? snapshotFromFixture(candidate) : null
}

export const snapshotFromFixture = (input: string): PublicChannelSnapshot | null => {
  if (!fixturesEnabled()) return null
  const candidate = candidateFor(input)
  const fixture = fixtures.find((item) => item.aliases.includes(candidate))
  if (!fixture) return null
  const { aliases: _aliases, ...snapshot } = fixture
  return { ...snapshot, source: "fixture" }
}
