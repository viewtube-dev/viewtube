import { SUBTOOLBOX_TOKENS, TOOLBOX_LEVEL_DNA } from "../components/subtoolbox/tokens"

/** Shared dropdown chevron contract: the multi-select side chevron defines every dropdown's rail and glyph geometry. */
export const STUDIO_DROPDOWN_TOKENS = {
  railSize: { supreme: 60, standard: 44, compact: 28, mini: 20, micro: 12 },
  chevronSize: { supreme: 38, standard: 28, compact: 18, mini: 14, micro: 8 },
  chevronStroke: { supreme: 3.41, standard: 2.5, compact: 1.65, mini: 1.2, micro: 1 },
  railFill: "secondary",
  splitIconFill: "black",
  chevronPlacement: "trailing",
} as const

/** Shared interaction-focus dwell and visual contract for counters, sliders, and text fields. */
export const STUDIO_FOCUS_INTERACTION_TOKENS = {
  holdMs: 1500,
  outlineFadeMs: 500,
  restTextMixPercent: 50,
  activeTextColor: "#000000",
  outlineColorRole: "secondary",
  outlineWidthRatio: 0.65,
  outlineOffsetPx: 0,
} as const;

/** Shared counter/slider number-state contract; kept aligned with focus tokens. */
export const STUDIO_COUNTER_NUMBER_TOKENS = {
  defaultWhiteMixPercent: STUDIO_FOCUS_INTERACTION_TOKENS.restTextMixPercent,
  defaultStrokeColor: "same as default fill",
  activeTextColor: STUDIO_FOCUS_INTERACTION_TOKENS.activeTextColor,
  activeStrokeColor: STUDIO_FOCUS_INTERACTION_TOKENS.activeTextColor,
  holdMs: STUDIO_FOCUS_INTERACTION_TOKENS.holdMs,
  outlineFadeMs: STUDIO_FOCUS_INTERACTION_TOKENS.outlineFadeMs,
} as const

/** Studio control geometry is independent from Toolbox/SubToolbox structural levels. */
const STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS = {
  buttonShadowX: 0,
  buttonShadowY: 0,
  hoverTransitionMs: 0,
  hoverOffsetPx: 0,
  clickTransitionMs: 0,
  clickOffsetPx: 0,
} as const

/** Compact geometry source; micro is mechanically derived from this object. */
const STUDIO_CONTROL_SIZE_BASE_COMPACT = { height: 28, stroke: 2, radius: 4, fontSize: 24, fontWeight: 1000, textStroke: 0.5, width: "row", textTransform: "uppercase", letterSpacing: -0.02, lineHeight: 0.86, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 1.3, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 1.3, iconSize: 24, iconStroke: 2.0, /* Shared floating-label metrics (label height 19px + 2px; raised offset × 1.2). */ floatingLabelHeight: 21, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS } as const

function halfCompact<T extends Record<string, number | string>>(compact: T): T {
  const result = { ...compact } as Record<string, number | string>
  for (const key of ["height", "stroke", "radius", "textStroke", "focusOutlineWidth", "secondaryFocusOutlineWidth", "iconSize"] as const) {
    const value = compact[key]
    if (typeof value === "number") result[key] = Math.max(0.25, Math.round(value * 50) / 100)
  }
  result.fontSize = 10
  result.iconSize = 10
  result.iconStroke = 1.5
  result.letterSpacing = -0.01
  result.lineHeight = 1
  return result as T
}

/** Canonical Studio size values are defined before derived contracts to avoid self-reference during initialization. */
export const STUDIO_CONTROL_SIZE_BASE = {
  supreme: { height: 60, stroke: 3, radius: 6, fontSize: 52, fontWeight: 1000, textStroke: 1, width: "row", textTransform: "uppercase", letterSpacing: -0.02, lineHeight: 1, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 1.95, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 1.95, iconSize: 52, iconStroke: 1.9, floatingLabelHeight: 52, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
  standard: { height: 44, stroke: 3, radius: 6, fontSize: 38, fontWeight: 1000, textStroke: 1, width: "row", textTransform: "uppercase", letterSpacing: -0.02, lineHeight: 1, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 1.95, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 1.95, iconSize: 38, iconStroke: 1.9, floatingLabelHeight: 38, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
  compact: STUDIO_CONTROL_SIZE_BASE_COMPACT,
  mini: { height: 20, stroke: 1.5, radius: 3, fontSize: 17.5, fontWeight: 1000, textStroke: 0.4, width: "row", textTransform: "uppercase", letterSpacing: -0.02, lineHeight: 1, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 0.975, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 0.975, iconSize: 17.5, iconStroke: 1.6, floatingLabelHeight: 17.5, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
  micro: { height: 12, stroke: 1, radius: 2, fontSize: 10, fontWeight: 1000, textStroke: 0.4, width: "row", textTransform: "uppercase", letterSpacing: -0.02, lineHeight: 1, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 0.65, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 0.65, iconSize: 10, iconStroke: 1.5, floatingLabelHeight: 10, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
} as const

/** One canonical size ladder for Studio controls; documented exceptions live below. */
export const STUDIO_CONTROL_SIZE_CONTRACT = {
  ...STUDIO_CONTROL_SIZE_BASE,
  /** Single-line text inputs inherit the canonical global standard/compact control typography. */
  textInput: { standardFontSize: STUDIO_CONTROL_SIZE_BASE.standard.fontSize, compactFontSize: STUDIO_CONTROL_SIZE_BASE.compact.fontSize, fontWeight: STUDIO_CONTROL_SIZE_BASE.standard.fontWeight, lineHeight: 0.86, width: "row", textTransform: "uppercase", letterSpacing: -0.02, textAlign: "left", defaultFillOpacity: 50, defaultTextColor: "primary", inlineStrokeColor: "primary", inlineStrokeWidth: "same as border width", focusTextColor: "#000000", focusFillOpacity: 15, focusOutlineColor: "secondary at 100% opacity", focusOutlineWidth: "65% of border width", followsSizeFamily: true },
  /** Multiline exception: taller writing surface while preserving the chosen standard/compact geometry. */
  multiline: { minHeight: 92, standardFontSize: 18, compactFontSize: 14, fontWeight: 1000, standardTextStroke: 0.5, compactTextStroke: 0.35, standardLineHeight: 1.25, compactLineHeight: 1.3, textAlign: "left", resize: "vertical", preservesSizeFamily: true, rationale: "Textareas alone use 18px standard and 14px compact; they additionally use multiline line-height, padding, and a 92px minimum surface." },
} as const

/** Studio Hub shell tokens; only shell-level values inherit the SubToolbox hierarchy. */
export const STUDIO_TOKENS = {
  toolbox: { headerHeight: TOOLBOX_LEVEL_DNA.toolbox.height, stroke: TOOLBOX_LEVEL_DNA.toolbox.stroke, radius: TOOLBOX_LEVEL_DNA.toolbox.radius, shadowOffset: TOOLBOX_LEVEL_DNA.toolbox.shadowOffset, titleSize: TOOLBOX_LEVEL_DNA.toolbox.titleSize },
  subtoolbox: { headerHeight: TOOLBOX_LEVEL_DNA.l0.height, stroke: TOOLBOX_LEVEL_DNA.l0.stroke, radius: TOOLBOX_LEVEL_DNA.l0.radius, shadowOffset: TOOLBOX_LEVEL_DNA.l0.shadowOffset, titleSize: TOOLBOX_LEVEL_DNA.l0.titleSize },
  // Deprecated compatibility alias only; compact is retired as a V35 level.
  compactSubtoolbox: { headerHeight: TOOLBOX_LEVEL_DNA.l1.height, stroke: TOOLBOX_LEVEL_DNA.l1.stroke, radius: TOOLBOX_LEVEL_DNA.l1.radius, shadowOffset: TOOLBOX_LEVEL_DNA.l1.shadowOffset, titleSize: TOOLBOX_LEVEL_DNA.l1.titleSize },
  component: {
    height: { supreme: STUDIO_CONTROL_SIZE_CONTRACT.supreme.height, standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.height, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.height, mini: STUDIO_CONTROL_SIZE_CONTRACT.mini.height, micro: STUDIO_CONTROL_SIZE_CONTRACT.micro.height },
    stroke: { supreme: STUDIO_CONTROL_SIZE_CONTRACT.supreme.stroke, standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.stroke, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.stroke, mini: STUDIO_CONTROL_SIZE_CONTRACT.mini.stroke, micro: STUDIO_CONTROL_SIZE_CONTRACT.micro.stroke },
    radius: { supreme: STUDIO_CONTROL_SIZE_CONTRACT.supreme.radius, standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.radius, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.radius, mini: STUDIO_CONTROL_SIZE_CONTRACT.mini.radius, micro: STUDIO_CONTROL_SIZE_CONTRACT.micro.radius },
    shadowOffset: { supreme: 0, standard: 0, compact: 0, mini: 0, micro: 0 },
  },
  typography: {
    label: 24,
    fixedLabel: { standardFontSize: 14, compactFontSize: 9, fontWeight: 1000, textStroke: 0 },
    floatingLabel: { standardRestingFontSize: 32, compactRestingFontSize: 21, standardRaisedFontSize: 25.6, compactRaisedFontSize: 16.8, fontWeight: 1000, textStroke: 0.5, offsetRatio: 1.2 },
    control: STUDIO_CONTROL_SIZE_CONTRACT.standard.fontSize,
    compactControl: STUDIO_CONTROL_SIZE_CONTRACT.compact.fontSize,
    subtoolboxTitle: TOOLBOX_LEVEL_DNA.l0.titleSize,
    toolboxTitle: TOOLBOX_LEVEL_DNA.toolbox.titleSize,
    weight: SUBTOOLBOX_TOKENS.typography.weight,
  },
  /** Four-pixel unit is for external gaps between sibling rows, columns, and components only; never an implicit inset. */
  spacing: { unit: 4, dense: SUBTOOLBOX_TOKENS.spacing.dense, standard: SUBTOOLBOX_TOKENS.spacing.standard, section: SUBTOOLBOX_TOKENS.spacing.section, large: SUBTOOLBOX_TOKENS.spacing.large },
  radius: { toolbox: TOOLBOX_LEVEL_DNA.toolbox.radius, subtoolbox: TOOLBOX_LEVEL_DNA.l0.radius, compactSubtoolbox: TOOLBOX_LEVEL_DNA.l1.radius, component: { standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.radius, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.radius, micro: STUDIO_CONTROL_SIZE_CONTRACT.micro.radius }, tag: 4 },
  stroke: { toolbox: TOOLBOX_LEVEL_DNA.toolbox.stroke, subtoolbox: TOOLBOX_LEVEL_DNA.l0.stroke, compactSubtoolbox: TOOLBOX_LEVEL_DNA.l1.stroke, component: { standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.stroke, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.stroke, micro: STUDIO_CONTROL_SIZE_CONTRACT.micro.stroke }, tag: 2 },
  shadow: { toolbox: TOOLBOX_LEVEL_DNA.toolbox.shadowOffset, subtoolbox: TOOLBOX_LEVEL_DNA.l0.shadowOffset, compactSubtoolbox: TOOLBOX_LEVEL_DNA.l1.shadowOffset, component: { standard: 0, compact: 0, micro: 0 } },
  motion: { controlMs: SUBTOOLBOX_TOKENS.motion.controlMs, collapseMs: SUBTOOLBOX_TOKENS.motion.collapseMs, easing: SUBTOOLBOX_TOKENS.motion.easing },
  breakpoints: { phoneMax: 767, compactShellMax: 900 },
} as const

/** Shared Studio icon-size comparison presets for the Lucide 24×24 icon family. */
export const STUDIO_ICON_SIZE_COMPARISON = {
  current: { standard: { size: 28, stroke: 2.5 }, compact: { size: 18, stroke: 1.65 } },
  moderate: { standard: { size: 34, stroke: 2.0588 }, compact: { size: 22, stroke: 1.35 } },
  large: { standard: { size: 38, stroke: 1.9 }, compact: { size: 24, stroke: 2.0 } },
} as const
export type StudioIconSizeVariant = keyof typeof STUDIO_ICON_SIZE_COMPARISON

export type StudioControlSize = keyof typeof STUDIO_CONTROL_SIZE_BASE
export type StudioHierarchyLevel = "toolbox" | "subtoolbox" | "compactSubtoolbox" | "component"


/** Machine-readable exceptions: only spectrum tags and closeable badges may shrink to content width. */
export const STUDIO_CONTROL_EXCEPTIONS = {
  spectrumTag: { id: "spectrumTag", owner: "VaultAssetModule / StudioSpectrumTag", width: "content", rationale: "Dense spectrum metadata tag; catalog-approved exception." },
  closeableBadge: { id: "closeableBadge", owner: "StudioCloseableBadge", width: "content", rationale: "Badge label plus close affordance sizes to its content." },
  wordToggle: { id: "wordToggle", owner: "StudioWordToggle", width: "content", rationale: "Content-sized segmented word toggle." },
  tagEditorTag: { id: "tagEditorTag", owner: "StudioTagEditor", width: "content", rationale: "Individual removable tag in the tag editor." },
} as const;

export const STUDIO_WIDTH_POLICY = {
  default: "row",
  contentWidthAllowList: ["spectrumTag", "closeableBadge", "wordToggle", "tagEditorTag"],
  exceptions: ["spectrumTag", "closeableBadge", "wordToggle", "tagEditorTag"],
  attribute: "data-vt-studio-width=content",
} as const;

export const STUDIO_COLOR_ROLES = {
  primary: "var(--pair-a)",
  secondary: "var(--pair-b)",
  doubleSplitStartRail: "secondary",
  doubleSplitEndRail: "secondary",
  focusOutline: { color: "secondary", opacity: 0.65, offset: 0 },
} as const;

export function studioSizeTierToCssVars(size: keyof typeof STUDIO_CONTROL_SIZE_BASE) {
  const tier = STUDIO_CONTROL_SIZE_BASE[size];
  return {
    "--vt-studio-control-height": `${tier.height}px`,
    "--vt-studio-control-stroke": `${tier.stroke}px`,
    "--vt-studio-control-radius": `${tier.radius}px`,
    "--vt-studio-control-font-size": `${tier.fontSize}px`,
    "--vt-studio-control-icon-size": `${tier.iconSize}px`,
  };
}
