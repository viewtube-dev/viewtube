import React from "react"
import { getVtVisualMetricColor } from "../styles/toolboxPalette"
import { StudioSplitLeftButton } from "../studio-ui"
import { AnalyticsVisualIcon } from "./AnalyticsVisualIcon"

export const ANALYTICS_VISUAL_CONTEXT_BAR_HEIGHTS = {
  standard: 32,
  expanded: 48,
} as const

export type AnalyticsVisualContextBarHeight = "standard" | "expanded" | "none"

type Tone = "pink" | "cyan" | "lime" | "yellow" | "purple" | "orange" | "white"

export interface AnalyticsVisualStat {
  label: string
  value: string
  iconKey?: string
  tone?: Tone | string
  bg?: string
  color?: string
  valueTone?: string
  backgroundTone?: string
  labelText?: string
  labelClassName?: string
  onClick?: () => void
  isActive?: boolean
  lockTone?: boolean
  compact?: boolean
  minWidth?: number
  /**
   * Every label this card can show as the reader changes a setting.
   *
   * A stat card is `w-auto`, so it grows to fit its contents: switch the
   * treemap's metric from VIEWS to WATCH TIME and the card widens, the stat row
   * widens, and the title beside it is squeezed. Declaring the candidates sizes
   * the card for the longest one up front and holds it for every setting.
   */
  labelWidthValues?: readonly string[]
  /** Every value this card can show, when the value is what moves. */
  valueWidthValues?: readonly string[]
}

export interface AnalyticsVisualContextBarConfig {
  height?: AnalyticsVisualContextBarHeight
  minHeight?: number
  /**
   * When true, every stat in this bar renders with the "dark canvas" treatment:
   * a near-black (#080816) value-zone fill and the metric's resolved brand color
   * as the number's foreground. Use on any visual whose preview canvas is dark
   * so the subtitle stat row matches the canvas instead of a light gray card.
   *
   * The Heat Matrix look. Applied uniformly wherever the flag is set — a stat
   * can still override `backgroundTone`/`valueTone` per-item to opt out.
   */
  darkStats?: boolean
}

/**
 * Near-black fill used by every dark-canvas visual's stat cards. Matches the
 * Heat Matrix canvas so the subtitle row reads as part of the same surface.
 */
export const ANALYTICS_DARK_STATS_BACKGROUND = "#080816"

/**
 * Foreground used when the stat's label doesn't resolve to a known metric
 * color (e.g. "SLOT", "TOP SLOT"): keeps the number legible without borrowing
 * an unrelated brand hue.
 */
export const ANALYTICS_DARK_STATS_NEUTRAL_VALUE = "#F3F4F6"

const TONE_HEX: Record<Tone, string> = {
  pink: "#FF7497",
  cyan: "#00CCFF",
  lime: "#CCFF00",
  yellow: "#FFEA00",
  purple: "#B14AED",
  orange: "#FFB158",
  white: "#FFFFFF",
}

const EXTRA_METRIC_ALIASES: Record<string, string> = {
  "WATCH HRS": "watchTime",
  "WATCH HR": "watchTime",
  "WATCH": "watchTime",
  "SUB": "subscribers",
  "SUBS": "subscribers",
  "SUBSCRIPTIONS": "subscribers",
  "ENG": "engagedViews",
  "ENGAGED": "engagedViews",
  "ENG VIEWS": "engagedViews",
  "REV": "revenue",
  "EST REV": "revenue",
  "CMTS": "comments",
  "CMNTS": "comments",
  "SAVES": "playlistSaves",
  "PLAYLIST SAVE": "playlistSaves",
  "AVG VIEWED": "avp",
  "AVG % VIEWED": "avp",
  "AVG VIEW DUR": "avd",
  "AVG VIEW DURATION": "avd",
}

export const normalizeAnalyticsStatLabel = (label: string): string => {
  const normalized = label.trim().toUpperCase()
  if (normalized.includes("IMPRESSION")) return "IMPRSNS"
  if (normalized === "SUBS" || normalized === "SUBSCRIPTIONS") return "SUBSCRIBERS"
  return label
}

const normalizeMetricLookup = (label: string): string =>
  label
    .trim()
    .toUpperCase()
    .replace(/[._/]+/g, " ")
    .replace(/\s+/g, " ")

const fallbackToneToHex = (fallback?: string): string | undefined => {
  if (!fallback) return undefined
  if (fallback.startsWith("#")) return fallback
  return TONE_HEX[fallback as Tone]
}

export const resolveAnalyticsMetricTone = (label: string, fallback?: string): string | undefined => {
  const direct = getVtVisualMetricColor(label)
  if (direct) return direct

  const alias = EXTRA_METRIC_ALIASES[normalizeMetricLookup(label)]
  if (alias) return getVtVisualMetricColor(alias) ?? fallbackToneToHex(fallback)

  return fallbackToneToHex(fallback)
}

export const resolveAnalyticsVisualContextBarHeight = (
  activeContext?: AnalyticsVisualContextBarConfig | null,
): number | undefined => {
  if (activeContext?.height === "none") return undefined
  if (activeContext?.height === "expanded") return ANALYTICS_VISUAL_CONTEXT_BAR_HEIGHTS.expanded
  return ANALYTICS_VISUAL_CONTEXT_BAR_HEIGHTS.standard
}

/** Rough advance width of a string at the stat row's 13px face. */
const statTextWidth = (value: string): number => Math.ceil(value.trim().length * 13 * 0.72) + 8

const analyticsMetricIconKey = (label: string): string => {
  const normalized = label.toLowerCase()
  if (normalized.includes("view") || normalized.includes("ctr")) return "trend"
  if (normalized.includes("watch") || normalized.includes("retention") || normalized.includes("avp") || normalized.includes("avd")) return "activity"
  if (normalized.includes("subscriber") || normalized.includes("comment") || normalized.includes("audience")) return "users"
  if (normalized.includes("revenue") || normalized.includes("rpm")) return "revenue"
  if (normalized.includes("traffic") || normalized.includes("share")) return "share"
  if (normalized.includes("save") || normalized.includes("playlist")) return "collection"
  return "analytics"
}

/** Reserve the split rail plus the widest supported label/value combination. */
const statSplitReservedWidth = (item: AnalyticsVisualStat, label: string): number => {
  const labels = [label, ...(item.labelWidthValues ?? [])]
  const values = [item.value, ...(item.valueWidthValues ?? [])]
  const widestLabel = Math.max(...labels.map(statTextWidth))
  const widestValue = Math.max(...values.map(statTextWidth))
  return Math.max(item.minWidth ?? (item.compact ? 68 : 76), widestLabel + widestValue + 32)
}

const statSplitButtonStyle = (
  item: AnalyticsVisualStat,
  dark: boolean,
  resolvedTone: string | undefined,
  label: string,
): React.CSSProperties => ({
  "--pair-a": item.backgroundTone ?? (dark ? ANALYTICS_DARK_STATS_BACKGROUND : "#EDEDED"),
  "--pair-b": resolvedTone ?? "#E5E7EB",
  minWidth: statSplitReservedWidth(item, label),
} as React.CSSProperties)

export const resolveAnalyticsStatValueColor = (
  item: AnalyticsVisualStat,
  dark: boolean,
  resolvedTone: string | undefined,
): string => {
  // Per-item override always wins so opt-outs stay possible.
  if (item.valueTone) return item.valueTone
  if (!dark) return "#000000"
  // On dark rows the number takes the metric's brand color; unresolved
  // labels fall back to a light neutral so they stay readable.
  return resolvedTone ?? ANALYTICS_DARK_STATS_NEUTRAL_VALUE
}

export const AnalyticsActiveStats: React.FC<{
  stats: readonly AnalyticsVisualStat[]
  darkStats?: boolean
}> = ({ stats, darkStats = false }) => (
  <div className="flex h-full items-stretch divide-x-[4px] divide-black">
    {stats.map((item, index) => {
      const label = item.labelText ?? item.label
      const resolvedTone = resolveAnalyticsMetricTone(label, item.tone ?? item.bg)
      const valueColor = resolveAnalyticsStatValueColor(item, darkStats, resolvedTone)

      return (
        <StudioSplitLeftButton
          key={`${item.label}-${index}`}
          icon={<AnalyticsVisualIcon iconKey={item.iconKey ?? analyticsMetricIconKey(label)} size={16} strokeWidth={3} />}
          sizeVariant="compact"
          selected={Boolean(item.isActive)}
          onClick={item.onClick}
          disabled={!item.onClick}
          aria-label={`${normalizeAnalyticsStatLabel(label)} ${item.value}`}
          className="vt-analytics-active-stat h-full flex-none"
          style={statSplitButtonStyle(item, darkStats, resolvedTone, label)}
        >
          <span className="vt-analytics-active-stat-copy flex h-full min-w-0 items-center justify-between gap-1 px-0 py-0 leading-none">
            <span className={`vt-analytics-active-stat-label inline-flex min-w-0 items-center text-[10px] font-[1000] uppercase tracking-[0] ${item.labelClassName ?? "whitespace-nowrap"}`} style={{ color: item.color ?? (darkStats ? "#F3F4F6" : "#000000") }}>
              {normalizeAnalyticsStatLabel(label)}
            </span>
            <strong className="inline-flex flex-none items-center whitespace-nowrap px-0 text-[13px] font-[1000] leading-none tracking-[0]" style={{ color: valueColor }}>
              {item.value}
            </strong>
          </span>
        </StudioSplitLeftButton>
      )
    })}
  </div>
)
