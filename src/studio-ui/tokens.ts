

import { SUBTOOLBOX_TOKENS, TOOLBOX_LEVEL_DNA } from "../components/subtoolbox/tokens"

// ─── Global defaults applied to every Studio control ─────────────────────────

export const STUDIO_GLOBAL_DEFAULTS = {
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  fontWeight: 1000,
  textTransform: "uppercase" as const,
  letterSpacing: -0.02,
  lineHeight: 1,
  textareaLineHeight: 0.85,
  fieldDefaultTextColor: "primary" as const,
  fieldDefaultGlyphStrokeColor: "primary" as const,
  textFieldDefaults: {
    defaultMode: { textColor: "primary" as const, textStrokeColor: "primary" as const, fill: "primary 50%" as const, borderStrokeColor: "#000000" as const, inlineStrokeColor: "primary" as const, inlineStrokeWidth: "same as border width" as const },
    focusMode: { textColor: "#000000" as const, textStrokeColor: "#000000" as const, fill: "primary 15%" as const, borderStrokeColor: "#000000" as const, inlineStrokeColor: "primary" as const, inlineStrokeWidth: "same as border width" as const, outlineStrokeColor: "secondary" as const, focusOutlineWidth: "65% of border width" as const, focusOutlineOffset: "0px" as const },
    caret: { color: "primary" as const },
    textBox: { textColor: "#000000" as const, textStrokeColor: "#000000" as const, inlineStrokeColor: "primary" as const, outlineStrokeColor: "secondary" as const },
  },

  focusTextColor: "#000000",
  focusGlyphStrokeColor: "#000000" as const,
  focusCaretColor: "primary" as const,
  focusOutlineColor: "secondary" as const,
  focusOutlineWidthRatio: 0.65,
  focusOutlineOffset: 0,
  focusTransitionMs: 500,
  borderColor: "#000000",
  defaultFillOpacity: 50,
  focusFillOpacity: 15,
  widthDefault: "row" as const, // 100%
  shellMovement: "none" as const,
  internalGap: 0,
  spacingUnit: 4, // external gaps only
  textOverflow: "clip" as const, // never ellipsis on single-line controls
} as const

// ─── Color roles ─────────────────────────────────────────────────────────────

export const STUDIO_COLOR_ROLES = {
  primary: "var(--pair-a)",
  secondary: "var(--pair-b)",
  border: "#000000",
  activeText: "#000000",
  fieldText: "primary" as const,
  fieldGlyphStroke: "primary" as const,
  focusGlyphStroke: "#000000" as const,
  focusCaret: "primary" as const,
  doubleSplitStartRail: "secondary" as const,
  doubleSplitEndRail: "secondary" as const,
  focusOutline: {
    color: "secondary" as const,
    opacity: 1,
    widthRatio: 0.65,
    offset: 0,
  },
} as const

// ─── Shared interaction defaults (flat, no lift) ─────────────────────────────

const STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS = {
  buttonShadowX: 0,
  buttonShadowY: 0,
  hoverTransitionMs: 0,
  hoverOffsetPx: 0,
  clickTransitionMs: 0,
  clickOffsetPx: 0,
} as const

// ─── Five explicit size tiers (global defaults) ──────────────────────────────
// Supreme and Standard share structural stroke geometry; Micro retains its compact 1px / 2px footprint. All values stay explicit in this canonical token object.

export const STUDIO_CONTROL_SIZE_BASE = {
  supreme: { height: 60, stroke: 3, radius: 6, fontSize: 52, fontWeight: 1000, textStroke: 1, width: "row" as const, textTransform: "uppercase" as const, letterSpacing: -0.02, lineHeight: 1, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 1.95, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 1.95, iconSize: 52, iconStroke: 1.9, floatingLabelHeight: 52, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
  standard: { height: 44, stroke: 3, radius: 6, fontSize: 38, fontWeight: 1000, textStroke: 1, width: "row" as const, textTransform: "uppercase" as const, letterSpacing: -0.02, lineHeight: 1, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 1.95, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 1.95, iconSize: 38, iconStroke: 1.9, floatingLabelHeight: 38, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
  compact: { height: 28, stroke: 2, radius: 4, fontSize: 24, fontWeight: 1000, textStroke: 0.5, width: "row" as const, textTransform: "uppercase" as const, letterSpacing: -0.02, lineHeight: 1, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 1.3, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 1.3, iconSize: 24, iconStroke: 2, floatingLabelHeight: 24, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
  mini: { height: 20, stroke: 1.5, radius: 3, fontSize: 17.5, fontWeight: 1000, textStroke: 0.4, width: "row" as const, textTransform: "uppercase" as const, letterSpacing: -0.02, lineHeight: 1, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 0.975, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 0.975, iconSize: 17.5, iconStroke: 1.6, floatingLabelHeight: 17.5, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
  micro: { height: 12, stroke: 1, radius: 2, fontSize: 10, fontWeight: 1000, textStroke: 0.4, width: "row" as const, textTransform: "uppercase" as const, letterSpacing: -0.02, lineHeight: 1, defaultFillOpacity: 50, focusFillOpacity: 15, focusOutlineWidth: 0.65, focusOutlineOffset: 0, secondaryFocusOutlineWidth: 0.65, iconSize: 10, iconStroke: 1.5, floatingLabelHeight: 10, floatingLabelOffsetRatio: 1.2, ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS },
} as const

export type StudioControlSize = keyof typeof STUDIO_CONTROL_SIZE_BASE
/** All five size tiers; individual families may narrow this when inner geometry requires it. */
export type StudioControlInteractiveSize = StudioControlSize

// ─── Size contract (extends base with text-input / multiline specialisations) ─

export const STUDIO_CONTROL_SIZE_CONTRACT = {
  ...STUDIO_CONTROL_SIZE_BASE,
  textInput: {
    supremeFontSize: STUDIO_CONTROL_SIZE_BASE.supreme.fontSize,
    standardFontSize: STUDIO_CONTROL_SIZE_BASE.standard.fontSize,
    compactFontSize: STUDIO_CONTROL_SIZE_BASE.compact.fontSize,
    miniFontSize: STUDIO_CONTROL_SIZE_BASE.mini.fontSize,
    microFontSize: STUDIO_CONTROL_SIZE_BASE.micro.fontSize,
    fontWeight: STUDIO_CONTROL_SIZE_BASE.standard.fontWeight,
    lineHeight: 1,
    width: "row" as const,
    textTransform: "uppercase" as const,
    letterSpacing: -0.02,
    textAlign: "left" as const,
    defaultFillOpacity: 50,
    defaultTextColor: "primary" as const,
    inlineStrokeColor: "primary" as const,
    inlineStrokeWidth: "same as border width" as const,
    focusTextColor: "#000000",
    focusFillOpacity: 15,
    focusOutlineColor: "secondary at 100% opacity" as const,
    focusOutlineWidth: "65% of border width" as const,
    followsSizeFamily: true,
  },
  verticalWordToggle: {
    standardFontSize: STUDIO_CONTROL_SIZE_BASE.standard.fontSize,
    compactFontSize: STUDIO_CONTROL_SIZE_BASE.compact.fontSize,
    miniFontSize: STUDIO_CONTROL_SIZE_BASE.mini.fontSize,
    microFontSize: STUDIO_CONTROL_SIZE_BASE.micro.fontSize,
    fontWeight: STUDIO_CONTROL_SIZE_BASE.standard.fontWeight,
    textTransform: "uppercase" as const,
    letterSpacing: -0.02,
    lineHeight: 1,
    height: "content-driven two-word stack; intentionally not fixed tier height",
    width: "row" as const,
    followsTypographySizeFamily: true,
    globalRuleException: true,
  },
  multiline: {
    supremeFontSize: Math.round((18 * 60) / 44),
    standardFontSize: 18,
    compactFontSize: 14,
    miniFontSize: 17.5,
    microFontSize: 10,
    supremeTextStroke: 0.68,
    standardTextStroke: 0.5,
    compactTextStroke: 0.35,
    miniTextStroke: 0.4,
    microTextStroke: 0.4,
    fontWeight: STUDIO_CONTROL_SIZE_BASE.standard.fontWeight,
    minHeight: 92,
    lineHeight: 0.85,
    textAlign: "left" as const,
    resize: "vertical" as const,
    preservesSizeFamily: true,
    rationale:
      "Textareas inherit size-tier font, stroke, color, fill, caret and focus outline; description rows use the shared default line-height.",
  },
} as const

// ─── Dropdown / focus / counter contracts ────────────────────────────────────

export const STUDIO_DROPDOWN_TOKENS = {
  railSize: { supreme: 60, standard: 44, compact: 28, mini: 20, micro: 12 },
  chevronSize: { supreme: 38, standard: 28, compact: 18, mini: 14, micro: 8 },
  chevronStroke: { supreme: 3.41, standard: 2.5, compact: 1.65, mini: 1.2, micro: 1 },
  railFill: "secondary" as const,
  splitIconFill: "black" as const,
  chevronPlacement: "trailing" as const,
} as const


/** Global open-menu defaults shared by standard, simple, and split-left dropdowns. */
export const STUDIO_DROPDOWN_MENU_TOKENS = {
  menuGap: 8,
  menuPadding: 4,
  rowGap: 3,
  menuRadius: "control" as const,
  rowRadius: "control" as const,
  menuFill: "primary" as const,
  unselectedRowFill: "white" as const,
  selectedRowFill: "secondary" as const,
  rowStroke: "control" as const,
  chevronInset: 6,
} as const

export const STUDIO_FOCUS_INTERACTION_TOKENS = {
  holdMs: 1500,
  outlineFadeMs: 500,
  restTextMixPercent: 50,
  activeTextColor: "#000000",
  outlineColorRole: "secondary" as const,
  outlineWidthRatio: 0.65,
  outlineOffsetPx: 0,
} as const

// ─── Bar toggle family geometry and value colors ──────────────────────────────

export const STUDIO_BAR_TOGGLE_TOKENS = {
  heightToTextRatio: 1,
  heightToWidthRatio: 2.5,
  radius: 2,
  emptyWhiteMixPercent: 50,
  fullFillColor: "#000000",
} as const

export const STUDIO_STEPPER_BUTTON_TOKENS = {
  chevronSize: { supreme: 42, standard: 36, compact: 24, mini: 16, micro: 12 },
  chevronStroke: { supreme: 3.75, standard: 2.5, compact: 3, mini: 2.5, micro: 2.25 },
  clickAnimation: "vt-studio-counter-pop" as const,
  clickDurationMs: 180,
  holdAnimation: "vt-studio-counter-hold-pulse" as const,
  focusOutlineColor: "secondary" as const,
  focusOutlineWidthRatio: STUDIO_FOCUS_INTERACTION_TOKENS.outlineWidthRatio,
  focusOutlineOffsetPx: STUDIO_FOCUS_INTERACTION_TOKENS.outlineOffsetPx,
} as const

export const STUDIO_COUNTER_NUMBER_TOKENS = {
  valueAreaAspectRatio: 2,
  doubleSplitRailCount: 2,
  sideRailCount: 1,
  defaultWhiteMixPercent: STUDIO_FOCUS_INTERACTION_TOKENS.restTextMixPercent,
  defaultStrokeColor: "same as default fill" as const,
  activeTextColor: STUDIO_FOCUS_INTERACTION_TOKENS.activeTextColor,
  activeStrokeColor: STUDIO_FOCUS_INTERACTION_TOKENS.activeTextColor,
  holdMs: STUDIO_FOCUS_INTERACTION_TOKENS.holdMs,
  outlineFadeMs: STUDIO_FOCUS_INTERACTION_TOKENS.outlineFadeMs,
} as const

// ─── Width policy + exceptions layer ─────────────────────────────────────────

export const STUDIO_CONTROL_EXCEPTIONS = {
  spectrumTag: {
    id: "spectrumTag",
    owner: "VaultAssetModule / StudioSpectrumTag",
    width: "content" as const,
    rationale: "Dense spectrum metadata tag; catalog-approved exception.",
  },
  closeableBadge: {
    id: "closeableBadge",
    owner: "StudioCloseableBadge",
    width: "content" as const,
    rationale: "Badge label plus close affordance sizes to its content.",
  },
  wordToggle: {
    id: "wordToggle",
    owner: "StudioWordToggle",
    width: "content" as const,
    rationale: "Content-sized segmented word toggle.",
  },
  tagEditorTag: {
    id: "tagEditorTag",
    owner: "StudioTagEditor",
    width: "content" as const,
    rationale: "Individual removable tag in the tag editor.",
  },
} as const

export const STUDIO_WIDTH_POLICY = {
  default: "row" as const,
  contentWidthAllowList: Object.keys(STUDIO_CONTROL_EXCEPTIONS) as (keyof typeof STUDIO_CONTROL_EXCEPTIONS)[],
  attribute: 'data-vt-studio-width="content"',
} as const

// ─── Hierarchy / shell tokens (Toolbox levels remain separate) ───────────────

export type StudioHierarchyLevel = "toolbox" | "subtoolbox" | "compactSubtoolbox" | "component"

export const STUDIO_TOKENS = {
  toolbox: {
    headerHeight: TOOLBOX_LEVEL_DNA.toolbox.height,
    stroke: TOOLBOX_LEVEL_DNA.toolbox.stroke,
    radius: TOOLBOX_LEVEL_DNA.toolbox.radius,
    shadowOffset: TOOLBOX_LEVEL_DNA.toolbox.shadowOffset,
    titleSize: TOOLBOX_LEVEL_DNA.toolbox.titleSize,
  },
  subtoolbox: {
    headerHeight: TOOLBOX_LEVEL_DNA.l0.height,
    stroke: TOOLBOX_LEVEL_DNA.l0.stroke,
    radius: TOOLBOX_LEVEL_DNA.l0.radius,
    shadowOffset: TOOLBOX_LEVEL_DNA.l0.shadowOffset,
    titleSize: TOOLBOX_LEVEL_DNA.l0.titleSize,
  },
  compactSubtoolbox: {
    headerHeight: TOOLBOX_LEVEL_DNA.l1.height,
    stroke: TOOLBOX_LEVEL_DNA.l1.stroke,
    radius: TOOLBOX_LEVEL_DNA.l1.radius,
    shadowOffset: TOOLBOX_LEVEL_DNA.l1.shadowOffset,
    titleSize: TOOLBOX_LEVEL_DNA.l1.titleSize,
  },
  component: {
    height: {
      supreme: STUDIO_CONTROL_SIZE_BASE.supreme.height,
      standard: STUDIO_CONTROL_SIZE_BASE.standard.height,
      compact: STUDIO_CONTROL_SIZE_BASE.compact.height,
      mini: STUDIO_CONTROL_SIZE_BASE.mini.height,
      micro: STUDIO_CONTROL_SIZE_BASE.micro.height,
    },
    stroke: {
      supreme: STUDIO_CONTROL_SIZE_BASE.supreme.stroke,
      standard: STUDIO_CONTROL_SIZE_BASE.standard.stroke,
      compact: STUDIO_CONTROL_SIZE_BASE.compact.stroke,
      mini: STUDIO_CONTROL_SIZE_BASE.mini.stroke,
      micro: STUDIO_CONTROL_SIZE_BASE.micro.stroke,
    },
    radius: {
      supreme: STUDIO_CONTROL_SIZE_BASE.supreme.radius,
      standard: STUDIO_CONTROL_SIZE_BASE.standard.radius,
      compact: STUDIO_CONTROL_SIZE_BASE.compact.radius,
      mini: STUDIO_CONTROL_SIZE_BASE.mini.radius,
      micro: STUDIO_CONTROL_SIZE_BASE.micro.radius,
    },
    shadowOffset: { supreme: 0, standard: 0, compact: 0, mini: 0, micro: 0 },
  },
  typography: {
    weight: STUDIO_GLOBAL_DEFAULTS.fontWeight,
    family: STUDIO_GLOBAL_DEFAULTS.fontFamily,
  },
  spacing: {
    unit: STUDIO_GLOBAL_DEFAULTS.spacingUnit,
    dense: SUBTOOLBOX_TOKENS.spacing.dense,
    standard: SUBTOOLBOX_TOKENS.spacing.standard,
    section: SUBTOOLBOX_TOKENS.spacing.section,
    large: SUBTOOLBOX_TOKENS.spacing.large,
  },
  motion: {
    controlMs: SUBTOOLBOX_TOKENS.motion.controlMs,
    collapseMs: SUBTOOLBOX_TOKENS.motion.collapseMs,
    easing: SUBTOOLBOX_TOKENS.motion.easing,
  },
  breakpoints: { phoneMax: 767, compactShellMax: 900 },
} as const

// ─── Helper: emit CSS custom-property map for a single tier ───────────────────

export function studioSizeTierToCssVars(size: StudioControlSize) {
  const tier = STUDIO_CONTROL_SIZE_BASE[size]
  return {
    "--vt-studio-control-height": `${tier.height}px`,
    "--vt-studio-control-stroke": `${tier.stroke}px`,
    "--vt-studio-control-radius": `${tier.radius}px`,
    "--vt-studio-control-font-size": `${tier.fontSize}px`,
    "--vt-studio-control-icon-size": `${tier.iconSize}px`,
    "--vt-studio-control-text-stroke": `${tier.textStroke}px`,
    "--vt-studio-control-font-weight": tier.fontWeight,
    "--vt-studio-control-icon-stroke": String(tier.iconStroke),
    "--vt-studio-control-focus-outline-width": `${tier.focusOutlineWidth}px`,
    "--vt-studio-control-secondary-outline-width": `${tier.secondaryFocusOutlineWidth}px`,
  }
}
