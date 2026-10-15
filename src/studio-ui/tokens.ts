import { SUBTOOLBOX_TOKENS, TOOLBOX_LEVEL_DNA } from "../components/subtoolbox/tokens"

/** Studio shell tokens may reference SubToolbox hierarchy geometry; standalone controls use the independent contract below. */
export const STUDIO_CONTROL_SIZE_CONTRACT = {
  standard: { height: 44, stroke: 3, radius: 6, fontSize: 38, fontWeight: 1000, textTransform: "uppercase", letterSpacing: -0.035, lineHeight: 0.86, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 3, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 1.5, buttonShadowX: 3, buttonShadowY: 3, hoverTransitionMs: 150, hoverOffsetPx: 1.5, clickTransitionMs: 300, clickOffsetPx: 3, iconSize: 28, iconStroke: 2.5 },
  compact: { height: 28, stroke: 2, radius: 4, fontSize: 24, fontWeight: 1000, textTransform: "uppercase", letterSpacing: -0.035, lineHeight: 0.86, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 2, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 1, buttonShadowX: 1, buttonShadowY: 1, hoverTransitionMs: 150, hoverOffsetPx: 0.75, clickTransitionMs: 300, clickOffsetPx: 1.5, iconSize: 18, iconStroke: 1.65 },
  /** Single-line text inputs inherit the canonical global standard/compact control typography. */
  textInput: { standardFontSize: 18, compactFontSize: 14, fontWeight: 1000, standardLineHeight: 1.25, compactLineHeight: 1.3, textTransform: "uppercase", letterSpacing: -0.035, followsSizeFamily: true },
  /** Multiline exception: taller writing surface while preserving the chosen standard/compact geometry. */
  multiline: { minHeight: 92, standardFontSize: 18, compactFontSize: 14, fontWeight: 1000, standardLineHeight: 1.25, compactLineHeight: 1.3, resize: "vertical", preservesSizeFamily: true, rationale: "Text inputs and textareas both use 18px standard and 14px compact; textareas additionally use multiline line-height, padding, and a 92px minimum surface." },
} as const

/** Studio Hub shell tokens; only shell-level values inherit the SubToolbox hierarchy. */
export const STUDIO_TOKENS = {
  toolbox: { headerHeight: TOOLBOX_LEVEL_DNA.toolbox.height, stroke: TOOLBOX_LEVEL_DNA.toolbox.stroke, radius: TOOLBOX_LEVEL_DNA.toolbox.radius, shadowOffset: TOOLBOX_LEVEL_DNA.toolbox.shadowOffset, titleSize: TOOLBOX_LEVEL_DNA.toolbox.titleSize },
  subtoolbox: { headerHeight: TOOLBOX_LEVEL_DNA.l0.height, stroke: TOOLBOX_LEVEL_DNA.l0.stroke, radius: TOOLBOX_LEVEL_DNA.l0.radius, shadowOffset: TOOLBOX_LEVEL_DNA.l0.shadowOffset, titleSize: TOOLBOX_LEVEL_DNA.l0.titleSize },
  // Deprecated compatibility alias only; compact is retired as a V35 level.
  compactSubtoolbox: { headerHeight: TOOLBOX_LEVEL_DNA.l1.height, stroke: TOOLBOX_LEVEL_DNA.l1.stroke, radius: TOOLBOX_LEVEL_DNA.l1.radius, shadowOffset: TOOLBOX_LEVEL_DNA.l1.shadowOffset, titleSize: TOOLBOX_LEVEL_DNA.l1.titleSize },
  component: {
    height: { standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.height, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.height },
    stroke: { standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.stroke, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.stroke },
    radius: { standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.radius, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.radius },
    shadowOffset: { standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.buttonShadowX, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.buttonShadowX },
  },
  typography: {
    label: 24,
    control: STUDIO_CONTROL_SIZE_CONTRACT.standard.fontSize,
    compactControl: STUDIO_CONTROL_SIZE_CONTRACT.compact.fontSize,
    subtoolboxTitle: TOOLBOX_LEVEL_DNA.l0.titleSize,
    toolboxTitle: TOOLBOX_LEVEL_DNA.toolbox.titleSize,
    weight: SUBTOOLBOX_TOKENS.typography.weight,
  },
  spacing: { dense: SUBTOOLBOX_TOKENS.spacing.dense, standard: SUBTOOLBOX_TOKENS.spacing.standard, section: SUBTOOLBOX_TOKENS.spacing.section, large: SUBTOOLBOX_TOKENS.spacing.large },
  radius: { toolbox: TOOLBOX_LEVEL_DNA.toolbox.radius, subtoolbox: TOOLBOX_LEVEL_DNA.l0.radius, compactSubtoolbox: TOOLBOX_LEVEL_DNA.l1.radius, component: { standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.radius, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.radius }, tag: 4 },
  stroke: { toolbox: TOOLBOX_LEVEL_DNA.toolbox.stroke, subtoolbox: TOOLBOX_LEVEL_DNA.l0.stroke, compactSubtoolbox: TOOLBOX_LEVEL_DNA.l1.stroke, component: { standard: STUDIO_CONTROL_SIZE_CONTRACT.standard.stroke, compact: STUDIO_CONTROL_SIZE_CONTRACT.compact.stroke }, tag: 2 },
  shadow: { toolbox: TOOLBOX_LEVEL_DNA.toolbox.shadowOffset, subtoolbox: TOOLBOX_LEVEL_DNA.l0.shadowOffset, compactSubtoolbox: TOOLBOX_LEVEL_DNA.l1.shadowOffset, component: { standard: 3, compact: 1 } },
  motion: { controlMs: SUBTOOLBOX_TOKENS.motion.controlMs, collapseMs: SUBTOOLBOX_TOKENS.motion.collapseMs, easing: SUBTOOLBOX_TOKENS.motion.easing },
  breakpoints: { phoneMax: 767, compactShellMax: 900 },
} as const

export type StudioControlSize = "standard" | "compact"
export type StudioHierarchyLevel = "toolbox" | "subtoolbox" | "compactSubtoolbox" | "component"
