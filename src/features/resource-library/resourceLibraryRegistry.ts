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
    description: "Understand how YouTube discovery surfaces work and diagnose a video's reach, audience fit, packaging, and viewing behavior.",
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
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/how-youtube-recommendations-and-discovery-work.md",
    accentPaletteIndex: 8,
    markdown: recommendationsMarkdown,
  },
  {
    id: "youtube-metrics-dimensions-glossary",
    title: "How to Read YouTube Analytics",
    shortTitle: "Analytics Guide",
    description: "Learn metrics, dimensions, filters, time windows, and how to answer real creator questions with YouTube Analytics.",
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
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/youtube-metrics-and-dimensions-master-glossary.md",
    accentPaletteIndex: 6,
    markdown: metricsGlossaryMarkdown,
  },
  {
    id: "shorts-vs-long-form-signals",
    title: "Shorts vs Long-Form: Different Systems, Different Signals",
    shortTitle: "Shorts vs Long-Form",
    description: "Compare Shorts and long-form discovery, viewing behavior, analytics, audience strategy, and fair cross-format measurement.",
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
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/shorts-vs-long-form-different-systems-signals.md",
    accentPaletteIndex: 3,
    markdown: shortsVsLongFormMarkdown,
  },
  {
    id: "publishing-best-practices-preflight",
    title: "Publishing Best Practices and Preflight Checklist",
    shortTitle: "Publishing Preflight",
    description: "Prepare, publish, and verify a video with a practical checklist for exports, metadata, settings, rights, and public-page checks.",
    category: "Publishing",
    secondaryCategories: ["YouTube Strategy","Creator Education"],
    format: "markdown",
    status: "published",
    tags: ["metadata","preflight","visibility","captions","rights"],
    difficulty: "Beginner to Intermediate",
    readTime: "8–10 min",
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/publishing-best-practices-and-preflight-checklist.md",
    accentPaletteIndex: 2,
    markdown: resource_publishing_best_practices_preflightMarkdown,
  },
  {
    id: "thumbnail-title-packaging-handbook",
    title: "Thumbnail and Title Packaging Handbook",
    shortTitle: "Title & Thumbnail",
    description: "Create truthful, clear title-and-thumbnail packages and evaluate performance with audience and traffic-source context.",
    category: "YouTube Strategy",
    secondaryCategories: ["Creator Education","YouTube Strategy"],
    format: "markdown",
    status: "published",
    tags: ["thumbnail","title","packaging","click-through-rate","testing"],
    difficulty: "Beginner to Intermediate",
    readTime: "8–10 min",
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/thumbnail-and-title-packaging-handbook.md",
    accentPaletteIndex: 3,
    markdown: resource_thumbnail_title_packaging_handbookMarkdown,
  },
  {
    id: "audience-retention-watch-behavior",
    title: "Audience Retention and Watch Behavior Guide",
    shortTitle: "Retention & Watch Behavior",
    description: "Read retention patterns as diagnostic clues, inspect important timestamps, and plan targeted improvements without overclaiming causation.",
    category: "Analytics",
    secondaryCategories: ["Creator Education","YouTube Strategy"],
    format: "markdown",
    status: "published",
    tags: ["retention","watch-time","intro","viewer-behavior"],
    difficulty: "Beginner to Intermediate",
    readTime: "8–10 min",
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/audience-retention-and-watch-behavior-guide.md",
    accentPaletteIndex: 4,
    markdown: resource_audience_retention_watch_behaviorMarkdown,
  },
  {
    id: "traffic-sources-discovery-pathways",
    title: "Traffic Sources and Discovery Pathways",
    shortTitle: "Traffic Sources",
    description: "Understand YouTube traffic sources, compare viewer pathways, and diagnose changes without treating a source as a quality score.",
    category: "Analytics",
    secondaryCategories: ["Creator Education","YouTube Strategy"],
    format: "markdown",
    status: "published",
    tags: ["traffic-sources","search","browse","suggested","external"],
    difficulty: "Beginner to Intermediate",
    readTime: "8–10 min",
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/traffic-sources-and-discovery-pathways.md",
    accentPaletteIndex: 5,
    markdown: resource_traffic_sources_discovery_pathwaysMarkdown,
  },
  {
    id: "audience-subscribers-returning-viewers",
    title: "Audience, Subscribers and Returning Viewers",
    shortTitle: "Audience & Returning Viewers",
    description: "Interpret new, returning, regular, and subscriber measures while building a channel audience that has reasons to return.",
    category: "Audience",
    secondaryCategories: ["Creator Education","YouTube Strategy"],
    format: "markdown",
    status: "published",
    tags: ["audience","subscribers","returning-viewers","new-viewers"],
    difficulty: "Beginner to Intermediate",
    readTime: "7–9 min",
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/audience-subscribers-and-returning-viewers.md",
    accentPaletteIndex: 6,
    markdown: resource_audience_subscribers_returning_viewersMarkdown,
  },
  {
    id: "youtube-revenue-monetization-fundamentals",
    title: "YouTube Revenue and Monetization Fundamentals",
    shortTitle: "Revenue & Monetization",
    description: "Understand CPM, RPM, monetization options, revenue uncertainty, costs, and audience-aligned income planning.",
    category: "Monetization",
    secondaryCategories: ["Creator Education","YouTube Strategy"],
    format: "markdown",
    status: "published",
    tags: ["revenue","monetization","rpm","cpm","ads","memberships"],
    difficulty: "Beginner to Intermediate",
    readTime: "8–10 min",
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/youtube-revenue-and-monetization-fundamentals.md",
    accentPaletteIndex: 7,
    markdown: resource_youtube_revenue_monetization_fundamentalsMarkdown,
  },
  {
    id: "live-streaming-operations-handbook",
    title: "Live Streaming Operations Handbook",
    shortTitle: "Live Streaming",
    description: "Plan, test, moderate, operate, recover, and review a live stream with practical production and safety checklists.",
    category: "Publishing",
    secondaryCategories: ["Creator Education","YouTube Strategy"],
    format: "markdown",
    status: "published",
    tags: ["live-streaming","moderation","latency","stream-health","planning"],
    difficulty: "Beginner to Intermediate",
    readTime: "8–10 min",
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/live-streaming-operations-handbook.md",
    accentPaletteIndex: 8,
    markdown: resource_live_streaming_operations_handbookMarkdown,
  },
  {
    id: "playlist-series-channel-architecture",
    title: "Playlist, Series and Channel Architecture Guide",
    shortTitle: "Playlists & Channel Structure",
    description: "Organize playlists, series, channel sections, and next-watch pathways around viewer needs and content relationships.",
    category: "YouTube Strategy",
    secondaryCategories: ["Creator Education","YouTube Strategy"],
    format: "markdown",
    status: "published",
    tags: ["playlists","series","channel-home","viewer-journey"],
    difficulty: "Beginner to Intermediate",
    readTime: "8–10 min",
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/playlist-series-and-channel-architecture-guide.md",
    accentPaletteIndex: 0,
    markdown: resource_playlist_series_channel_architectureMarkdown,
  },
  {
    id: "comments-community-audience-feedback",
    title: "Comments, Community and Audience Feedback Playbook",
    shortTitle: "Community & Feedback",
    description: "Turn audience feedback into useful content ideas while checking claims, protecting privacy, and moderating consistently.",
    category: "Audience",
    secondaryCategories: ["Creator Education","YouTube Strategy"],
    format: "markdown",
    status: "published",
    tags: ["comments","community","feedback","moderation","ideas"],
    difficulty: "Beginner to Intermediate",
    readTime: "7–9 min",
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/comments-community-and-audience-feedback-playbook.md",
    accentPaletteIndex: 1,
    markdown: resource_comments_community_audience_feedbackMarkdown,
  },
  {
    id: "content-planning-experiments-learning-loops",
    title: "Content Planning, Experiments and Learning Loops",
    shortTitle: "Planning & Experiments",
    description: "Plan a balanced content portfolio, write testable hypotheses, and learn from results without mistaking correlation for cause.",
    category: "YouTube Strategy",
    secondaryCategories: ["Creator Education","YouTube Strategy"],
    format: "markdown",
    status: "published",
    tags: ["planning","experiments","hypothesis","content-calendar"],
    difficulty: "Beginner to Intermediate",
    readTime: "7–9 min",
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/content-planning-experiments-and-learning-loops.md",
    accentPaletteIndex: 2,
    markdown: resource_content_planning_experiments_learning_loopsMarkdown,
  },
  {
    id: "copyright-rights-reuse-ai-generated-media",
    title: "Copyright, Rights, Reuse and AI-Generated Media Reference",
    shortTitle: "Copyright & AI Media",
    description: "Check licenses, permissions, attribution, synthetic-media disclosures, and rights records before publishing or reusing assets.",
    category: "Publishing",
    secondaryCategories: ["Creator Education","YouTube Strategy"],
    format: "markdown",
    status: "published",
    tags: ["copyright","licensing","fair-use","disclosure","synthetic-media"],
    difficulty: "Beginner to Intermediate",
    readTime: "9–12 min",
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/copyright-rights-reuse-and-ai-generated-media-reference.md",
    accentPaletteIndex: 3,
    markdown: resource_copyright_rights_reuse_ai_generated_mediaMarkdown,
  },
  {
    id: "reading-analytics-correctly-scope-windows-missingness",
    title: "Reading Analytics Correctly: Scope, Windows, Missingness and Statistical Traps",
    shortTitle: "Analytics: Scope & Pitfalls",
    description: "Avoid misleading analytics conclusions by checking scope, time windows, missing data, denominators, samples, and uncertainty.",
    category: "Analytics",
    secondaryCategories: ["Creator Education","YouTube Strategy"],
    format: "markdown",
    status: "published",
    tags: ["analytics","data-quality","filters","time-windows","uncertainty"],
    difficulty: "Beginner to Intermediate",
    readTime: "10–12 min",
    updatedAt: "2026-10-15",
    sourcePath: "src/features/resource-library/resources/reading-analytics-correctly-scope-windows-missingness-and-statistical-traps.md",
    accentPaletteIndex: 4,
    markdown: resource_reading_analytics_correctly_scope_windows_missingnessMarkdown,
  }
] as const

export const getResourceById = (
  resourceId: string | null | undefined,
): ResourceLibraryEntry | null =>
  RESOURCE_LIBRARY_ENTRIES.find((resource) => resource.id === resourceId) ?? null
