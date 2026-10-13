import recommendationsMarkdown from "./resources/how-youtube-recommendations-and-discovery-work.md?raw"
import metricsGlossaryMarkdown from "./resources/youtube-metrics-and-dimensions-master-glossary.md?raw"
import shortsVsLongFormMarkdown from "./resources/shorts-vs-long-form-different-systems-signals.md?raw"
import resource_publishing_best_practices_preflightMarkdown from "./resources/publishing-best-practices-and-preflight-checklist.md?raw"
import resource_thumbnail_title_packaging_handbookMarkdown from "./resources/thumbnail-and-title-packaging-handbook.md?raw"
import resource_audience_retention_watch_behaviorMarkdown from "./resources/audience-retention-and-watch-behavior-guide.md?raw"
import resource_traffic_sources_discovery_pathwaysMarkdown from "./resources/traffic-sources-and-discovery-pathways.md?raw"
import resource_audience_subscribers_returning_viewersMarkdown from "./resources/audience-subscribers-and-returning-viewers.md?raw"
import resource_youtube_revenue_monetization_fundamentalsMarkdown from "./resources/youtube-revenue-and-monetization-fundamentals.md?raw"
import resource_live_streaming_operations_handbookMarkdown from "./resources/live-streaming-operations-handbook.md?raw"
import resource_playlist_series_channel_architectureMarkdown from "./resources/playlist-series-and-channel-architecture-guide.md?raw"
import resource_comments_community_audience_feedbackMarkdown from "./resources/comments-community-and-audience-feedback-playbook.md?raw"
import resource_content_planning_experiments_learning_loopsMarkdown from "./resources/content-planning-experiments-and-learning-loops.md?raw"
import resource_copyright_rights_reuse_ai_generated_mediaMarkdown from "./resources/copyright-rights-reuse-and-ai-generated-media-reference.md?raw"
import resource_reading_analytics_correctly_scope_windows_missingnessMarkdown from "./resources/reading-analytics-correctly-scope-windows-missingness-and-statistical-traps.md?raw"

export type ResourceStatus = "draft" | "published" | "archived"
export type ResourceFormat = "markdown"

export interface ResourceLibraryEntry {
  id: string
  title: string
  shortTitle: string
  description: string
  category: string
  secondaryCategories: readonly string[]
  format: ResourceFormat
  status: ResourceStatus
  tags: readonly string[]
  difficulty: string
  readTime: string
  updatedAt: string
  sourcePath: string
  accentPaletteIndex: number
  markdown: string
}

export interface ParsedResourceSection {
  id: string
  title: string
  body: string
}

export interface ParsedResourceDocument {
  frontmatter: Record<string, string>
  title: string
  intro: string
  sections: ParsedResourceSection[]
}

const slugify = (value: string): string =>
  value
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const parseFrontmatter = (
  markdown: string,
): { frontmatter: Record<string, string>; body: string } => {
  const normalized = markdown.replace(/\r\n/g, "\n")
  if (!normalized.startsWith("---\n")) {
    return { frontmatter: {}, body: normalized }
  }

  const end = normalized.indexOf("\n---\n", 4)
  if (end < 0) {
    return { frontmatter: {}, body: normalized }
  }

  const rawFrontmatter = normalized.slice(4, end)
  const frontmatter: Record<string, string> = {}

  for (const line of rawFrontmatter.split("\n")) {
    const colon = line.indexOf(":")
    if (colon <= 0) continue
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1).trim()
    if (key) frontmatter[key] = value
  }

  return {
    frontmatter,
    body: normalized.slice(end + 5).trim(),
  }
}

export const parseResourceDocument = (markdown: string): ParsedResourceDocument => {
  const { frontmatter, body } = parseFrontmatter(markdown)
  const lines = body.split("\n")

  let title = frontmatter.title || ""
  let cursor = 0

  while (cursor < lines.length && !lines[cursor]?.startsWith("# ")) cursor += 1
  if (cursor < lines.length) {
    title = lines[cursor]?.slice(2).trim() || title
    cursor += 1
  }

  const introLines: string[] = []
  while (cursor < lines.length && !lines[cursor]?.startsWith("## ")) {
    introLines.push(lines[cursor] || "")
    cursor += 1
  }

  const sections: ParsedResourceSection[] = []
  while (cursor < lines.length) {
    const heading = lines[cursor]
    if (!heading?.startsWith("## ")) {
      cursor += 1
      continue
    }

    const sectionTitle = heading.slice(3).trim()
    cursor += 1
    const sectionLines: string[] = []

    while (cursor < lines.length && !lines[cursor]?.startsWith("## ")) {
      sectionLines.push(lines[cursor] || "")
      cursor += 1
    }

    sections.push({
      id: slugify(sectionTitle),
      title: sectionTitle,
      body: sectionLines.join("\n").trim(),
    })
  }

  return {
    frontmatter,
    title,
    intro: introLines.join("\n").trim(),
    sections,
  }
}

export const RESOURCE_LIBRARY_ENTRIES: readonly ResourceLibraryEntry[] = [
  {
    id: "youtube-recommendations-discovery",
    title: "How YouTube Finds Viewers for Your Videos",
    shortTitle: "Algorithm & Recommendations",
    description:
      "A creator-first guide to how YouTube finds viewers, how Home, Suggested, Search and Shorts differ, and how to diagnose performance in ViewTube.",
    category: "YouTube Strategy",
    secondaryCategories: ["Discovery", "Analytics", "Packaging", "Audience"],
    format: "markdown",
    status: "published",
    tags: [
      "recommendations",
      "discovery",
      "browse",
      "suggested",
      "search",
      "shorts",
      "audience",
      "packaging",
      "retention",
      "satisfaction",
    ],
    difficulty: "Beginner–Intermediate",
    readTime: "18–24 min",
    updatedAt: "2026-09-26",
    sourcePath:
      "docs/resources/library/how-youtube-recommendations-and-discovery-work.md",
    accentPaletteIndex: 8,
    markdown: recommendationsMarkdown,
  },
  {
    id: "youtube-metrics-dimensions-glossary",
    title: "How to Read YouTube Analytics",
    shortTitle: "Analytics Guide",
    description:
      "A creator-first guide to metrics, dimensions, filters, traffic sources, audience, retention, revenue and using analytics to answer real channel questions.",
    category: "Analytics",
    secondaryCategories: ["Metrics", "Dimensions", "Filters", "Audience"],
    format: "markdown",
    status: "published",
    tags: [
      "metrics",
      "dimensions",
      "filters",
      "comparisons",
      "audience",
      "studio",
      "shorts",
      "revenue",
      "traffic-sources",
      "retention",
    ],
    difficulty: "Beginner–Intermediate",
    readTime: "25–35 min",
    updatedAt: "2026-09-26",
    sourcePath:
      "docs/resources/library/youtube-metrics-and-dimensions-master-glossary.md",
    accentPaletteIndex: 6,
    markdown: metricsGlossaryMarkdown,
  },
  {
    id: "shorts-vs-long-form-signals",
    title: "Shorts vs Long-Form: Different Systems, Different Signals",
    shortTitle: "Shorts vs Long-Form",
    description:
      "A creator-first guide to how Shorts and long-form differ in discovery, choice, retention, analytics, audience behavior and channel strategy.",
    category: "YouTube Strategy",
    secondaryCategories: ["Shorts", "Long-Form", "Analytics", "Audience"],
    format: "markdown",
    status: "published",
    tags: [
      "shorts",
      "long-form",
      "format-strategy",
      "discovery",
      "recommendations",
      "retention",
      "views",
      "engaged-views",
      "audience",
      "packaging",
    ],
    difficulty: "Beginner–Intermediate",
    readTime: "24–32 min",
    updatedAt: "2026-09-27",
    sourcePath:
      "docs/resources/library/shorts-vs-long-form-different-systems-signals.md",
    accentPaletteIndex: 3,
    markdown: shortsVsLongFormMarkdown,
  }
] as const

export const getResourceById = (
  resourceId: string | null | undefined,
): ResourceLibraryEntry | null =>
  RESOURCE_LIBRARY_ENTRIES.find((resource) => resource.id === resourceId) ?? null
