import { SUBTOOLBOX_TOKENS, TOOLBOX_LEVEL_DNA } from "../components/subtoolbox/tokens"

/** Studio control geometry is independent from Toolbox/SubToolbox structural levels. */
const STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS = {
  buttonShadowX: 0,
  buttonShadowY: 0,
  hoverTransitionMs: 0,
  hoverOffsetPx: 0,
  clickTransitionMs: 0,
  clickOffsetPx: 0,
} as const

/** Canonical Studio size values are defined before derived contracts to avoid self-reference during initialization. */
const STUDIO_CONTROL_SIZE_BASE = {
  standard: { height: 44, stroke: 3, radius: 6, fontSize: 38, fontWeight: 1000, textStroke: 1, width: "row", gap: 4, textTransform: "uppercase", letterSpacing: -0.02, lineHeight: 0.86, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 3, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 1.95, iconSize: 38, iconStroke: 1.9, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
  compact: { height: 28, stroke: 2, radius: 4, fontSize: 24, fontWeight: 1000, textStroke: 0.5, width: "row", gap: 4, textTransform: "uppercase", letterSpacing: -0.02, lineHeight: 0.86, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 2, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 1.3, iconSize: 24, iconStroke: 2.0, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
  /** Dense micro tier: 14px face with proportionally reduced stroke, radius, typography and icon. */
  micro: { height: 14, stroke: 1, radius: 2, fontSize: 10, fontWeight: 1000, textStroke: 0.25, width: "row", gap: 4, textTransform: "uppercase", letterSpacing: -0.01, lineHeight: 1, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 1, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 0.65, iconSize: 10, iconStroke: 1.5, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
} as const

/** One canonical size ladder for Studio controls; documented exceptions live below. */
export const STUDIO_CONTROL_SIZE_CONTRACT = {
  ...STUDIO_CONTROL_SIZE_BASE,
  /** Single-line text inputs inherit the canonical global standard/compact control typography. */
  textInput: { standardFontSize: STUDIO_CONTROL_SIZE_BASE.standard.fontSize, compactFontSize: STUDIO_CONTROL_SIZE_BASE.compact.fontSize, fontWeight: STUDIO_CONTROL_SIZE_BASE.standard.fontWeight, standardTextStroke: STUDIO_CONTROL_SIZE_BASE.standard.textStroke, compactTextStroke: STUDIO_CONTROL_SIZE_BASE.compact.textStroke, lineHeight: 0.86, width: "row", textTransform: "uppercase", letterSpacing: -0.02, textAlign: "left", defaultFillOpacity: 50, defaultTextColor: "primary", inlineStrokeColor: "primary", inlineStrokeWidth: "same as border width", focusTextColor: "#000000", focusFillOpacity: 15, focusOutlineColor: "secondary at 100% opacity", focusOutlineWidth: "65% of border width", followsSizeFamily: true },
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
    height: { standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.height, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.height },
    stroke: { standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.stroke, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.stroke, micro: STUDIO_CONTROL_SIZE_CONTRACT.micro.stroke },
    radius: { standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.radius, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.radius, micro: STUDIO_CONTROL_SIZE_CONTRACT.micro.radius },
    shadowOffset: { standard: 0, compact: 0, micro: 0 },
  },
  typography: {
    label: 24,
    fixedLabel: { standardFontSize: 14, compactFontSize: 9, fontWeight: 1000, textStroke: 0 },
    floatingLabel: { standardRestingFontSize: 38, compactRestingFontSize: 24, standardRaisedFontSize: 14.4, compactRaisedFontSize: 11.2, fontWeight: 1000, textStroke: 0.5 },
    control: STUDIO_CONTROL_SIZE_CONTRACT.standard.fontSize,
    compactControl: STUDIO_CONTROL_SIZE_CONTRACT.compact.fontSize,
    subtoolboxTitle: TOOLBOX_LEVEL_DNA.l0.titleSize,
    toolboxTitle: TOOLBOX_LEVEL_DNA.toolbox.titleSize,
    weight: SUBTOOLBOX_TOKENS.typography.weight,
  },
  /** Studio primitive spacing contract: each side defaults to one 4px unit; components may compose multiples explicitly. */
  spacing: { unit: 4, top: 4, right: 4, bottom: 4, left: 4, dense: SUBTOOLBOX_TOKENS.spacing.dense, standard: SUBTOOLBOX_TOKENS.spacing.standard, section: SUBTOOLBOX_TOKENS.spacing.section, large: SUBTOOLBOX_TOKENS.spacing.large },
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

export type StudioControlSize = "standard" | "compact"
export type StudioHierarchyLevel = "toolbox" | "subtoolbox" | "compactSubtoolbox" | "component"
