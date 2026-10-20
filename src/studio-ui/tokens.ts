import { SUBTOOLBOX_TOKENS, TOOLBOX_LEVEL_DNA } from "../components/subtoolbox/tokens"

/** Shared dropdown chevron contract: the multi-select side chevron defines every dropdown's rail and glyph geometry. */
export const STUDIO_DROPDOWN_TOKENS = {
  railSize: { supreme: 60, standard: 44, compact: 28 },
  chevronSize: { supreme: 38, standard: 28, compact: 18 },
  chevronStroke: { supreme: 3.41, standard: 2.5, compact: 1.65 },
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

/** Compact geometry is explicit; micro is an independently defined 12px tier. */
const STUDIO_CONTROL_SIZE_BASE_COMPACT = { height: 28, stroke: 2, radius: 4, fontSize: 24, fontWeight: 1000, textStroke: 0.5, width: "row", textTransform: "uppercase", letterSpacing: -0.02, lineHeight: 0.86, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 1.3, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 1.3, iconSize: 24, iconStroke: 2.0, /* Resting labels inherit the matching global text-input size. */ floatingLabelHeight: 24, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS } as const

/** Canonical Studio size values are defined before derived contracts to avoid self-reference during initialization. */
export const STUDIO_CONTROL_SIZE_BASE = {
  standard: { height: 44, stroke: 3, radius: 6, fontSize: 38, fontWeight: 1000, textStroke: 1, width: "row", textTransform: "uppercase", letterSpacing: -0.02, lineHeight: 0.86, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 1.95, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 1.95, iconSize: 38, iconStroke: 1.9, /* Resting labels use the standard global text-input size. */ floatingLabelHeight: 38, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
  compact: STUDIO_CONTROL_SIZE_BASE_COMPACT,
  /** Supreme scales the standard dimensional contract by 60 / 44; ratios and behavior stay constant. */
  supreme: { height: 60, stroke: 4.09, radius: 8.18, fontSize: 51.82, fontWeight: 1000, textStroke: 1.36, width: "row", textTransform: "uppercase", letterSpacing: -0.02, lineHeight: 0.86, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 2.66, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 2.66, iconSize: 51.82, iconStroke: 2.59, floatingLabelHeight: 51.82, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
  /** Micro keeps its deliberate compact-family typography and border treatment at an explicit 12px height. */
  micro: { height: 12, stroke: 1, radius: 2, fontSize: 10, fontWeight: 1000, textStroke: 0.25, width: "row", textTransform: "uppercase", letterSpacing: -0.01, lineHeight: 1, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 0.65, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 0.65, iconSize: 10, iconStroke: 1.5, floatingLabelHeight: 10, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
} as const

/** One canonical size ladder for Studio controls; documented exceptions live below. */
export const STUDIO_CONTROL_SIZE_CONTRACT = {
  ...STUDIO_CONTROL_SIZE_BASE,
  /** Single-line text inputs inherit the canonical global standard/compact control typography. */
  textInput: { supremeFontSize: STUDIO_CONTROL_SIZE_BASE.supreme.fontSize, standardFontSize: STUDIO_CONTROL_SIZE_BASE.standard.fontSize, compactFontSize: STUDIO_CONTROL_SIZE_BASE.compact.fontSize, fontWeight: STUDIO_CONTROL_SIZE_BASE.standard.fontWeight, lineHeight: 0.86, width: "row", textTransform: "uppercase", letterSpacing: -0.02, textAlign: "left", defaultFillOpacity: 50, defaultTextColor: "primary", inlineStrokeColor: "primary", inlineStrokeWidth: "same as border width", focusTextColor: "#000000", focusFillOpacity: 15, focusOutlineColor: "secondary at 100% opacity", focusOutlineWidth: "65% of border width", followsSizeFamily: true },
  /** Vertical two-word stack keeps the global type/stroke/radius tiers; only height is content-driven. */
  verticalWordToggle: {
    standardFontSize: STUDIO_CONTROL_SIZE_BASE.standard.fontSize,
    compactFontSize: STUDIO_CONTROL_SIZE_BASE.compact.fontSize,
    microFontSize: STUDIO_CONTROL_SIZE_BASE.micro.fontSize,
    fontWeight: STUDIO_CONTROL_SIZE_BASE.standard.fontWeight,
    textTransform: "uppercase",
    letterSpacing: -0.02,
    lineHeight: 0.86,
    height: "content-driven two-word stack; intentionally not 60px / 44px / 28px / 12px",
    width: "row",
    followsTypographySizeFamily: true,
    globalRuleException: true,
  },
  /** Multiline surface shares the input typography/focus token ladder; only description line-height is specialized. */
  multiline: { supremeFontSize: 18 * 60 / 44, standardFontSize: 18, compactFontSize: 14, microFontSize: 10, fontWeight: STUDIO_CONTROL_SIZE_BASE.standard.fontWeight, minHeight: 92, lineHeight: 0.75, textAlign: "left", resize: "vertical", preservesSizeFamily: true, rationale: "Textareas inherit the same size-tier font size, text stroke, color, fill, caret, and focus outline tokens as text inputs; editable description rows alone use line-height 0.75." },
} as const

/** Studio Hub shell tokens; only shell-level values inherit the SubToolbox hierarchy. */
export const STUDIO_TOKENS = {
  toolbox: { headerHeight: TOOLBOX_LEVEL_DNA.toolbox.height, stroke: TOOLBOX_LEVEL_DNA.toolbox.stroke, radius: TOOLBOX_LEVEL_DNA.toolbox.radius, shadowOffset: TOOLBOX_LEVEL_DNA.toolbox.shadowOffset, titleSize: TOOLBOX_LEVEL_DNA.toolbox.titleSize },
  subtoolbox: { headerHeight: TOOLBOX_LEVEL_DNA.l0.height, stroke: TOOLBOX_LEVEL_DNA.l0.stroke, radius: TOOLBOX_LEVEL_DNA.l0.radius, shadowOffset: TOOLBOX_LEVEL_DNA.l0.shadowOffset, titleSize: TOOLBOX_LEVEL_DNA.l0.titleSize },
  // Deprecated compatibility alias only; compact is retired as a V35 level.
  compactSubtoolbox: { headerHeight: TOOLBOX_LEVEL_DNA.l1.height, stroke: TOOLBOX_LEVEL_DNA.l1.stroke, radius: TOOLBOX_LEVEL_DNA.l1.radius, shadowOffset: TOOLBOX_LEVEL_DNA.l1.shadowOffset, titleSize: TOOLBOX_LEVEL_DNA.l1.titleSize },
  component: {
    height: { supreme: STUDIO_CONTROL_SIZE_CONTRACT.supreme.height, standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.height, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.height, micro: STUDIO_CONTROL_SIZE_CONTRACT.micro.height },
    stroke: { supreme: STUDIO_CONTROL_SIZE_CONTRACT.supreme.stroke, standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.stroke, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.stroke, micro: STUDIO_CONTROL_SIZE_CONTRACT.micro.stroke },
    radius: { supreme: STUDIO_CONTROL_SIZE_CONTRACT.supreme.radius, standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.radius, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.radius, micro: STUDIO_CONTROL_SIZE_CONTRACT.micro.radius },
    shadowOffset: { supreme: 0, standard: 0, compact: 0, micro: 0 },
  },
  typography: {
    label: 24,
    fixedLabel: { standardFontSize: 14, compactFontSize: 9, fontWeight: 1000, textStroke: 0 },
    floatingLabel: { supremeRestingFontSize: 51.82, standardRestingFontSize: 38, compactRestingFontSize: 24, microRestingFontSize: 10, supremeRaisedFontSize: 24, standardRaisedFontSize: 18, compactRaisedFontSize: 18, microRaisedFontSize: 18, fontWeight: 1000, textStroke: 0.5, offsetRatio: 1.2 },
    control: STUDIO_CONTROL_SIZE_CONTRACT.standard.fontSize,
    compactControl: STUDIO_CONTROL_SIZE_CONTRACT.compact.fontSize,
    subtoolboxTitle: TOOLBOX_LEVEL_DNA.l0.titleSize,
    toolboxTitle: TOOLBOX_LEVEL_DNA.toolbox.titleSize,
    weight: SUBTOOLBOX_TOKENS.typography.weight,
  },
  /** Four-pixel unit is for external gaps between sibling rows, columns, and components only; never an implicit inset. */
  spacing: { unit: 4, dense: SUBTOOLBOX_TOKENS.spacing.dense, standard: SUBTOOLBOX_TOKENS.spacing.standard, section: SUBTOOLBOX_TOKENS.spacing.section, large: SUBTOOLBOX_TOKENS.spacing.large },
  radius: { toolbox: TOOLBOX_LEVEL_DNA.toolbox.radius, subtoolbox: TOOLBOX_LEVEL_DNA.l0.radius, compactSubtoolbox: TOOLBOX_LEVEL_DNA.l1.radius, component: { supreme: STUDIO_CONTROL_SIZE_CONTRACT.supreme.radius, standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.radius, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.radius, micro: STUDIO_CONTROL_SIZE_CONTRACT.micro.radius }, tag: 4 },
  stroke: { toolbox: TOOLBOX_LEVEL_DNA.toolbox.stroke, subtoolbox: TOOLBOX_LEVEL_DNA.l0.stroke, compactSubtoolbox: TOOLBOX_LEVEL_DNA.l1.stroke, component: { supreme: STUDIO_CONTROL_SIZE_CONTRACT.supreme.stroke, standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.stroke, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.stroke, micro: STUDIO_CONTROL_SIZE_CONTRACT.micro.stroke }, tag: 2 },
  shadow: { toolbox: TOOLBOX_LEVEL_DNA.toolbox.shadowOffset, subtoolbox: TOOLBOX_LEVEL_DNA.l0.shadowOffset, compactSubtoolbox: TOOLBOX_LEVEL_DNA.l1.shadowOffset, component: { supreme: 0, standard: 0, compact: 0, micro: 0 } },
  motion: { controlMs: SUBTOOLBOX_TOKENS.motion.controlMs, collapseMs: SUBTOOLBOX_TOKENS.motion.collapseMs, easing: SUBTOOLBOX_TOKENS.motion.easing },
  breakpoints: { phoneMax: 767, compactShellMax: 900 },
} as const

/** Shared Studio icon-size comparison presets for the Lucide 24×24 icon family. */
export const STUDIO_ICON_SIZE_COMPARISON = {
  current: { supreme: { size: 38, stroke: 2.5 }, standard: { size: 28, stroke: 2.5 }, compact: { size: 18, stroke: 1.65 } },
  moderate: { supreme: { size: 46, stroke: 2.81 }, standard: { size: 34, stroke: 2.0588 }, compact: { size: 22, stroke: 1.35 } },
  large: { supreme: { size: 52, stroke: 2.59 }, standard: { size: 38, stroke: 1.9 }, compact: { size: 24, stroke: 2.0 } },
} as const
export type StudioIconSizeVariant = keyof typeof STUDIO_ICON_SIZE_COMPARISON

export type StudioControlSize = "supreme" | "standard" | "compact" | "micro"
/** Interactive button/dropdown families deliberately exclude the dense Micro tier. */
export type StudioControlInteractiveSize = Exclude<StudioControlSize, "micro">
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
