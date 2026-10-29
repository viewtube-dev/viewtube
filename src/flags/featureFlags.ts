/**
 * Feature flags for roadmap "Priority 25" capabilities.
 * Default OFF — flip a flag to true (or set a localStorage override) once that
 * capability's audit classification (A/B/C/D) is verified on the target branch.
 *
 * Canonical wiring target: this module is the single flag source; pages read it
 * through `isCapabilityFlagEnabled`. Keep names 1:1 with
 * `src/features/capabilities/registry.ts`.
 */
export const CAPABILITY_FLAG_PREFIX = "capability."

export interface CapabilityFlagDef {
  flag: string
  title: string
  number: number
}

export const CAPABILITY_FLAGS: Record<string, CapabilityFlagDef> = {
  "channel-intelligence-engine": { flag: CAPABILITY_FLAG_PREFIX + "channel-intelligence-engine", title: "Channel Intelligence Engine", number: 1 },
  "evidence-connected-brain": { flag: CAPABILITY_FLAG_PREFIX + "evidence-connected-brain", title: "Evidence-Connected AI Brain", number: 2 },
  "channel-context-intake": { flag: CAPABILITY_FLAG_PREFIX + "channel-context-intake", title: "Channel Context Intake", number: 3 },
  "prompt-library-handoff": { flag: CAPABILITY_FLAG_PREFIX + "prompt-library-handoff", title: "AI Prompt Library and Chat Handoff", number: 4 },
  "ai-video-editor": { flag: CAPABILITY_FLAG_PREFIX + "ai-video-editor", title: "AI Video Editor", number: 5 },
  "shorts-vertical-modes": { flag: CAPABILITY_FLAG_PREFIX + "shorts-vertical-modes", title: "Shorts / Vertical Video Modes", number: 6 },
  "veo-video-generation": { flag: CAPABILITY_FLAG_PREFIX + "veo-video-generation", title: "Veo Video Generation Integration", number: 7 },
  "metadata-refinement": { flag: CAPABILITY_FLAG_PREFIX + "metadata-refinement", title: "Metadata Generation and Refinement", number: 8 },
  "thumbnail-upload-reuse": { flag: CAPABILITY_FLAG_PREFIX + "thumbnail-upload-reuse", title: "Thumbnail Upload and Reuse", number: 9 },
  "ranked-tag-analysis": { flag: CAPABILITY_FLAG_PREFIX + "ranked-tag-analysis", title: "Ranked Tag Generation and Analysis", number: 10 },
  "transcript-language-tools": { flag: CAPABILITY_FLAG_PREFIX + "transcript-language-tools", title: "Transcript and Language Tools", number: 11 },
  "caption-subtitle-management": { flag: CAPABILITY_FLAG_PREFIX + "caption-subtitle-management", title: "Caption and Subtitle Management", number: 12 },
  "kpi-time-window-controls": { flag: CAPABILITY_FLAG_PREFIX + "kpi-time-window-controls", title: "KPI and Time-Window Controls", number: 13 },
  "csv-document-analytics": { flag: CAPABILITY_FLAG_PREFIX + "csv-document-analytics", title: "CSV / Document Analytics", number: 14 },
  "cross-video-comparison": { flag: CAPABILITY_FLAG_PREFIX + "cross-video-comparison", title: "Cross-Video Performance Comparison", number: 15 },
  "evidence-quality-validation": { flag: CAPABILITY_FLAG_PREFIX + "evidence-quality-validation", title: "Evidence Quality and Source Validation", number: 16 },
  "opportunity-discovery": { flag: CAPABILITY_FLAG_PREFIX + "opportunity-discovery", title: "Content Opportunity Discovery", number: 17 },
  "channel-information-management": { flag: CAPABILITY_FLAG_PREFIX + "channel-information-management", title: "Manage Channel Information", number: 18 },
  "public-channel-resolution": { flag: CAPABILITY_FLAG_PREFIX + "public-channel-resolution", title: "Public Channel Resolution Without Login", number: 19 },
  "project-state-resume": { flag: CAPABILITY_FLAG_PREFIX + "project-state-resume", title: "Project / Package State Persistence and Resume", number: 20 },
  "cross-tool-handoffs": { flag: CAPABILITY_FLAG_PREFIX + "cross-tool-handoffs", title: "Cross-Tool Workflow Handoffs", number: 21 },
  "subscriber-api-dispatch": { flag: CAPABILITY_FLAG_PREFIX + "subscriber-api-dispatch", title: "Subscriber / API Dispatch Functions", number: 22 },
  "hidden-tools-pages": { flag: CAPABILITY_FLAG_PREFIX + "hidden-tools-pages", title: "Hidden Tools, Widgets, and Pages", number: 23 },
  "advanced-studio-controls": { flag: CAPABILITY_FLAG_PREFIX + "advanced-studio-controls", title: "Advanced Studio Control Modes", number: 24 },
  "feature-discovery-registry": { flag: CAPABILITY_FLAG_PREFIX + "feature-discovery-registry", title: "Unified Feature Discovery and Action Registry", number: 25 },
}

/** Capabilities with complete implementations (view-model core + adapter contract + UI + tests). */
// Keep every capability disabled by default until canonical adapters, routes, and runtime tests are verified.
const IMPLEMENTED_PREVIEW = new Set<string>()

const STORAGE_KEY = "viewtube.capabilityFlagOverrides"

function readOverrides(): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, boolean>
  } catch {
    return {}
  }
}

/** Enable a single capability without a code change (dev / demo use). */
export function setCapabilityFlagOverride(slug: string, enabled: boolean): void {
  const overrides = readOverrides()
  overrides[slug] = enabled
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export function isCapabilityFlagEnabled(slug: string): boolean {
  const def = CAPABILITY_FLAGS[slug]
  if (!def) return false
  const overrides = readOverrides()
  if (slug in overrides) return overrides[slug]
  // No capability is enabled by default. Explicit opt-in remains available through
  // the existing development/demo override while release gates are incomplete.
  return IMPLEMENTED_PREVIEW.has(slug)
}

export function readCapabilityFlagEnabled(slug: string): boolean {
  return isCapabilityFlagEnabled(slug)
}
