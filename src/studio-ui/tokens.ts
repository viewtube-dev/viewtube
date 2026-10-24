// ═══════════════════════════════════════════════════════════════════════════════
// STUDIO CONTROLS PRIMITIVE SYSTEM — SINGLE TOKEN SOURCE
// Read order = authority order:
//   1. STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS — shared interaction defaults (all components)
//   2. STUDIO_CONTROL_SIZE_BASE                 — the five global size tiers
//   3. STUDIO_CONTROL_SIZE_CONTRACT             — per-family settings layered on the tiers
//   4. STUDIO_*_TOKENS                          — dropdown / focus / counter / bar-toggle families
//   5. STUDIO_GLOBAL_DEFAULTS / STUDIO_COLOR_ROLES / width policy
// Components never hard-code geometry; they read these tokens (CSS vars are
// emitted from here by scripts/emit-studio-control-vars.mjs).
// ═══════════════════════════════════════════════════════════════════════════════

import { SUBTOOLBOX_TOKENS, TOOLBOX_LEVEL_DNA } from "../components/subtoolbox/tokens"

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
// Supreme / Standard / Compact / Mini / Micro are first-class. Nothing is derived at runtime.
// Mini is the 20px tier between Compact (28px) and Micro (12px).

export const STUDIO_CONTROL_SIZE_BASE = {
  supreme: {
    height: 60,
    stroke: 4.09,
    radius: 8.18,
    fontSize: 51.82,
    fontWeight: 1000,
    textStroke: 1.36,
    width: "row" as const,
    textTransform: "uppercase" as const,
    letterSpacing: -0.02,
    lineHeight: 1,
    defaultFillOpacity: 50,
    focusFillOpacity: 15,
    focusOutlineWidth: 2.66,
    focusOutlineOffset: 0,
    secondaryFocusOutlineWidth: 2.66,
    iconSize: 51.82,
    iconStroke: 2.59,
    floatingLabelHeight: 51.82,
    floatingLabelOffsetRatio: 1.2,
    ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS,
  },
  standard: {
    height: 44,
    stroke: 3,
    radius: 6,
    fontSize: 38,
    fontWeight: 1000,
    textStroke: 1,
    width: "row" as const,
    textTransform: "uppercase" as const,
    letterSpacing: -0.02,
    lineHeight: 1,
    defaultFillOpacity: 50,
    focusFillOpacity: 15,
    focusOutlineWidth: 1.95,
    focusOutlineOffset: 0,
    secondaryFocusOutlineWidth: 1.95,
    iconSize: 38,
    iconStroke: 1.9,
    floatingLabelHeight: 38,
    floatingLabelOffsetRatio: 1.2,
    ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS,
  },
  compact: {
    height: 28,
    stroke: 2,
    radius: 4,
    fontSize: 24,
    fontWeight: 1000,
    textStroke: 0.5,
    width: "row" as const,
    textTransform: "uppercase" as const,
    letterSpacing: -0.02,
    lineHeight: 1,
    defaultFillOpacity: 50,
    focusFillOpacity: 15,
    focusOutlineWidth: 1.3,
    focusOutlineOffset: 0,
    secondaryFocusOutlineWidth: 1.3,
    iconSize: 24,
    iconStroke: 2.0,
    floatingLabelHeight: 24,
    floatingLabelOffsetRatio: 1.2,
    ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS,
  },
  mini: {
    height: 20,
    stroke: 1.5,
    radius: 3,
    fontSize: 17,
    fontWeight: 1000,
    textStroke: 0.38,
    width: "row" as const,
    textTransform: "uppercase" as const,
    letterSpacing: -0.02,
    lineHeight: 1,
    defaultFillOpacity: 50,
    focusFillOpacity: 15,
    focusOutlineWidth: 0.98,
    focusOutlineOffset: 0,
    secondaryFocusOutlineWidth: 0.98,
    iconSize: 17,
    iconStroke: 1.6,
    floatingLabelHeight: 17,
    floatingLabelOffsetRatio: 1.2,
    ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS,
  },
  micro: {
    height: 12,
    stroke: 1,
    radius: 2,
    fontSize: 10,
    fontWeight: 1000,
    textStroke: 0.25,
    width: "row" as const,
    textTransform: "uppercase" as const,
    letterSpacing: -0.01,
    lineHeight: 1,
    defaultFillOpacity: 50,
    focusFillOpacity: 15,
    focusOutlineWidth: 0.65,
    focusOutlineOffset: 0,
    secondaryFocusOutlineWidth: 0.65,
    iconSize: 10,
    iconStroke: 1.5,
    floatingLabelHeight: 10,
    floatingLabelOffsetRatio: 1.2,
    ...STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS,
  },
} as const

export type StudioControlSize = keyof typeof STUDIO_CONTROL_SIZE_BASE
export type StudioControlInteractiveSize = StudioControlSize
export type StudioIconSizeVariant = "current" | "moderate" | "large"

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
    microFontSize: 10,
    miniFontSize: 10,
    supremeTextStroke: 0.68,
    standardTextStroke: 0.5,
    compactTextStroke: 0.35,
    microTextStroke: 0.25,
    miniTextStroke: 0.25,
    fontWeight: STUDIO_CONTROL_SIZE_BASE.standard.fontWeight,
    minHeight: 92,
    lineHeight: 1,
    textAlign: "left" as const,
    resize: "vertical" as const,
    preservesSizeFamily: true,
    rationale:
      "Textareas inherit size-tier font, stroke, color, fill, caret and focus outline; description rows use the shared default line-height.",
  },
} as const

// ─── Dropdown / focus / counter contracts ────────────────────────────────────

export const STUDIO_DROPDOWN_TOKENS = {
  railSize: { supreme: 60, standard: 44, compact: 28 },
  chevronSize: { supreme: 38, standard: 28, compact: 18 },
  chevronStroke: { supreme: 3.41, standard: 2.5, compact: 1.65 },
  railFill: "secondary" as const,
  splitIconFill: "black" as const,
  chevronPlacement: "trailing" as const,
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

export const STUDIO_COUNTER_NUMBER_TOKENS = {
  defaultWhiteMixPercent: STUDIO_FOCUS_INTERACTION_TOKENS.restTextMixPercent,
  defaultStrokeColor: "same as default fill" as const,
  activeTextColor: STUDIO_FOCUS_INTERACTION_TOKENS.activeTextColor,
  activeStrokeColor: STUDIO_FOCUS_INTERACTION_TOKENS.activeTextColor,
  holdMs: STUDIO_FOCUS_INTERACTION_TOKENS.holdMs,
  outlineFadeMs: STUDIO_FOCUS_INTERACTION_TOKENS.outlineFadeMs,
} as const

// ─── Global defaults applied to every Studio control ─────────────────────────

export const STUDIO_GLOBAL_DEFAULTS = {
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  fontWeight: 1000,
  textTransform: "uppercase" as const,
  letterSpacing: -0.02,
  lineHeight: 1,
  textareaLineHeight: 1,
  borderColor: "#000000",
  defaultFillOpacity: 50,
  focusFillOpacity: 15,
  widthDefault: "row" as const, // 100%
  shellMovement: "none" as const,
  internalGap: 0,
  spacingUnit: 4, // external gaps only
} as const

// ─── Color roles ─────────────────────────────────────────────────────────────

export const STUDIO_COLOR_ROLES = {
  primary: "var(--pair-a)",
  secondary: "var(--pair-b)",
  border: "#000000",
  activeText: "#000000",
  doubleSplitStartRail: "secondary" as const,
  doubleSplitEndRail: "secondary" as const,
  focusOutline: {
    color: "secondary" as const,
    opacity: 0.65,
    offset: 0,
  },
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
      micro: STUDIO_CONTROL_SIZE_BASE.micro.height,
    },
    stroke: {
      supreme: STUDIO_CONTROL_SIZE_BASE.supreme.stroke,
      standard: STUDIO_CONTROL_SIZE_BASE.standard.stroke,
      compact: STUDIO_CONTROL_SIZE_BASE.compact.stroke,
      micro: STUDIO_CONTROL_SIZE_BASE.micro.stroke,
    },
    radius: {
      supreme: STUDIO_CONTROL_SIZE_BASE.supreme.radius,
      standard: STUDIO_CONTROL_SIZE_BASE.standard.radius,
      compact: STUDIO_CONTROL_SIZE_BASE.compact.radius,
      micro: STUDIO_CONTROL_SIZE_BASE.micro.radius,
    },
    shadowOffset: { supreme: 0, standard: 0, compact: 0, micro: 0 },
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
    "--vt-studio-control-font-weight": String(tier.fontWeight),
    "--vt-studio-control-icon-stroke": String(tier.iconStroke),
    "--vt-studio-control-focus-outline-width": `${tier.focusOutlineWidth}px`,
    "--vt-studio-control-secondary-outline-width": `${tier.secondaryFocusOutlineWidth}px`,
  }
}
