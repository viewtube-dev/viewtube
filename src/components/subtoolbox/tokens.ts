/**
 * ViewTube Toolbox UI V35 token authority.
 *
 * Structural level owns geometry. Component families own anatomy/behavior.
 * Feature consumers must not recreate these values locally.
 * Compact is retired as a structural/component level: canonical controls use
 * L0 / L1 / L2. Toolbox remains a separate top-level shell.
 */

export const VT_SPECTRUM_PALETTE = [
  "#FA618A",
  "#FF7F6B",
  "#FFA85C",
  "#FFDA47",
  "#C0F240",
  "#3FEE56",
  "#4EE4BE",
  "#36E0F6",
  "#528FFA",
  "#A467F4",
  "#F55EFC",
  "#FF7AC8",
] as const

export const VIEWTUBE_TYPOGRAPHY = {
  family: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  controlWeight: 1000,
  bodyWeight: 900,
  controlLetterSpacingEm: -0.055,
  controlLineHeight: 0.9,
  uppercaseControls: true,
} as const

/** Four canonical default component sizes used wherever a family supports a size ladder. */
export const COMPONENT_SIZE_DNA = {
  xs: { height: 20, stroke: 2, radius: 4, shadowOffset: 2, fontSize: 10 },
  s: { height: 32, stroke: 2, radius: 6, shadowOffset: 4, fontSize: 12 },
  m: { height: 44, stroke: 3, radius: 8, shadowOffset: 5, fontSize: 16 },
  l: { height: 56, stroke: 3.5, radius: 9.333333, shadowOffset: 5.833333, fontSize: 24 },
} as const

export type ComponentSize = keyof typeof COMPONENT_SIZE_DNA

export const getComponentSizeCssVars = (size: ComponentSize) => {
  const dna = COMPONENT_SIZE_DNA[size]
  return {
    "--vt-component-height": dna.height + "px",
    "--vt-component-stroke": dna.stroke + "px",
    "--vt-component-radius": dna.radius + "px",
    "--vt-component-shadow-offset": dna.shadowOffset + "px",
    "--vt-component-font-size": dna.fontSize + "px",
  } as const
}

export type ToolboxUiLevel = "toolbox" | "l0" | "l1" | "l2"
export type ToolboxControlLevel = Exclude<ToolboxUiLevel, "toolbox">

export const COMPONENT_LEVEL_DNA = {
  l0: { height: 56, stroke: 3.5, radius: 9.333333, shadowOffset: 5.833333, fontSize: 24 },
  l1: { height: 48, stroke: 3, radius: 8, shadowOffset: 5, fontSize: 18 },
  l2: { height: 32, stroke: 2, radius: 6, shadowOffset: 4, fontSize: 12 },
} as const satisfies Record<ToolboxControlLevel, {
  height: number
  stroke: number
  radius: number
  shadowOffset: number
  fontSize: number
}>

export const getComponentLevelCssVars = (level: ToolboxControlLevel) => {
  const dna = COMPONENT_LEVEL_DNA[level]
  return {
    "--vt-component-height": `${dna.height}px`,
    "--vt-component-stroke": `${dna.stroke}px`,
    "--vt-component-radius": `${dna.radius}px`,
    "--vt-component-shadow-offset": `${dna.shadowOffset}px`,
    "--vt-component-font-size": `${dna.fontSize}px`,
  } as const
}

export const TOOLBOX_LEVEL_DNA = {
  toolbox: {
    height: 80,
    stroke: 5,
    radius: 16,
    shadowOffset: 10,
    titleSize: 26,
  },
  l0: {
    height: 56,
    stroke: 4,
    radius: 12,
    shadowOffset: 6,
    titleSize: 20,
  },
  l1: {
    height: 48,
    stroke: 3,
    radius: 8,
    shadowOffset: 4,
    titleSize: 18,
  },
  l2: {
    height: 32,
    stroke: 2,
    radius: 6,
    shadowOffset: 2,
    titleSize: 12,
  },
} as const

/**
 * Fixed-height responsive header contract. Titles may consume at most two
 * tight lines; action rails never shrink. Toolbox and SubToolbox header icons
 * share one visual box/stroke contract even when the glyph source differs.
 */
export const TOOLBOX_SHELL_GUTTER = {
  desktop: 6,
  mobile: 5,
} as const

/**
 * Vault asset-module compound geometry.
 *
 * This intentionally does not scale with L0/L1/L2. The donor design is a
 * fixed compound system and is certified against the standalone reference.
 * Toolbox tokens still own palette, typography context, focus safety and
 * surrounding layout.
 */
export const VAULT_ASSET_MODULE_DNA = {
  width: 276,
  height: 189,
  stroke: 2,
  radius: 10,
  innerWidth: 272,
  innerHeight: 185,
  headerHeight: 30,
  doubleHeaderHeight: 60,
  landscapeWidth: 184,
  landscapeHeight: 103.5,
  portraitHeight: 185,
  portraitWidth: 104.0625,
  portraitLeftWidth: 167.9375,
  tagBackground: "#c1c1c1",
  halfHeight: 94.5,
  halfBodyHeight: 60.5,
  halfPreviewWidth: 72,
} as const

export const MINI_SUBTOOLBOX_DNA = {
  desktop: {
    headerHeight: 40,
    stroke: 3,
    radius: 8,
    shadowOffset: 4,
    titleSize: 16,
  },
  mobile: {
    headerHeight: 36,
    stroke: 3,
    radius: 7,
    shadowOffset: 3,
    titleSize: 14,
  },
} as const

export const TOOLBOX_MOBILE_HEADER_DNA = {
  toolbox: {
    height: 56,
    radius: 14,
    shadowOffset: 6,
  },
  subtoolbox: {
    height: 44,
    radius: 10,
    shadowOffset: 4,
  },
} as const

export const TOOLBOX_HEADER_DNA = {
  toolbox: {
    height: TOOLBOX_LEVEL_DNA.toolbox.height,
    titleSize: TOOLBOX_LEVEL_DNA.toolbox.titleSize,
    titleLineHeight: 0.82,
    titleMaxLines: 2,
    titleInlinePadding: 4,
    actionGap: 4,
    actionEndPadding: 4,
    iconSize: 34,
    iconStroke: 3.1,
  },
  subtoolbox: {
    height: TOOLBOX_LEVEL_DNA.l0.height,
    titleSize: TOOLBOX_LEVEL_DNA.l0.titleSize,
    titleLineHeight: 0.82,
    titleMaxLines: 2,
    titleInlinePadding: 4,
    actionGap: 2,
    actionEndPadding: 2,
    iconSize: 28,
    iconStroke: 3.1,
    contentEdgeInset: 4,
  },
} as const

/**
 * Explicit opposite-palette pairing. These are real palette colors, not
 * opacity-derived variants. Index i pairs with the index returned here.
 */
export const TOOLBOX_OPPOSITE_PAIR_INDEX = [
  6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5,
] as const

export const getToolboxColorPair = (index: number) => {
  const normalized = ((index % VT_SPECTRUM_PALETTE.length) + VT_SPECTRUM_PALETTE.length) % VT_SPECTRUM_PALETTE.length
  return {
    rail: VT_SPECTRUM_PALETTE[normalized],
    body: VT_SPECTRUM_PALETTE[TOOLBOX_OPPOSITE_PAIR_INDEX[normalized]],
  }
}

export const SUBTOOLBOX_TOKENS = {
  shell: {
    headerHeight: TOOLBOX_HEADER_DNA.subtoolbox.height,
    stroke: TOOLBOX_LEVEL_DNA.l0.stroke,
    radius: TOOLBOX_LEVEL_DNA.l0.radius,
    shadowOffset: TOOLBOX_LEVEL_DNA.l0.shadowOffset,
    titleSize: TOOLBOX_LEVEL_DNA.l0.titleSize,
    iconSize: TOOLBOX_HEADER_DNA.subtoolbox.iconSize,
    iconStroke: TOOLBOX_HEADER_DNA.subtoolbox.iconStroke,
    titleLineHeight: TOOLBOX_HEADER_DNA.subtoolbox.titleLineHeight,
    titleMaxLines: TOOLBOX_HEADER_DNA.subtoolbox.titleMaxLines,
    contentEdgeInset: TOOLBOX_HEADER_DNA.subtoolbox.contentEdgeInset,
  },
  interior: {
    stroke: TOOLBOX_LEVEL_DNA.l1.stroke,
    radius: TOOLBOX_LEVEL_DNA.l1.radius,
    shadowOffset: TOOLBOX_LEVEL_DNA.l1.shadowOffset,
  },
  spacing: {
    micro: 4,
    dense: 8,
    standard: 12,
    section: 16,
    large: 24,
  },
  controlHeight: {
    xs: COMPONENT_SIZE_DNA.xs.height,
    s: COMPONENT_SIZE_DNA.s.height,
    m: COMPONENT_SIZE_DNA.m.height,
    l: COMPONENT_SIZE_DNA.l.height,
    l2: TOOLBOX_LEVEL_DNA.l2.height,
    l1: TOOLBOX_LEVEL_DNA.l1.height,
    l0: TOOLBOX_LEVEL_DNA.l0.height,
  },
  typography: {
    l2: TOOLBOX_LEVEL_DNA.l2.titleSize,
    l1: TOOLBOX_LEVEL_DNA.l1.titleSize,
    l0: TOOLBOX_LEVEL_DNA.l0.titleSize,
    toolbox: TOOLBOX_LEVEL_DNA.toolbox.titleSize,