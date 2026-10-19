import { SUBTOOLBOX_TOKENS, TOOLBOX_LEVEL_DNA } from "../components/subtoolbox/tokens"

/** Shared dropdown chevron contract: the multi-select side chevron defines every dropdown's rail and glyph geometry. */
export const STUDIO_DROPDOWN_TOKENS = {
  railSize: { standard: 44, compact: 28 },
  chevronSize: { standard: 28, compact: 18 },
  chevronStroke: { standard: 2.5, compact: 1.65 },
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


