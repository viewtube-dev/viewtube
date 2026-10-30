import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tokenSource = await readFile(resolve(root, "src/studio-ui/tokens.ts"), "utf8");
const dropdownContract = tokenSource.match(/export const STUDIO_DROPDOWN_TOKENS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
const dropdownMenuContract = tokenSource.match(/export const STUDIO_DROPDOWN_MENU_TOKENS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
const numberContract = tokenSource.match(/export const STUDIO_COUNTER_NUMBER_TOKENS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
const focusContract = tokenSource.match(/export const STUDIO_FOCUS_INTERACTION_TOKENS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
const sizeBaseBlock = tokenSource.match(/export const STUDIO_CONTROL_SIZE_BASE = \{([\s\S]*?)\n\} as const/)?.[1] ?? "";
const sizeContractBlock = tokenSource.match(/export const STUDIO_CONTROL_SIZE_CONTRACT = \{([\s\S]*?)\n\} as const/)?.[1] ?? "";
// Read each tier from the canonical object, including its multiline property block.
const readTierBlock = (tier) => sizeBaseBlock.match(new RegExp(`${tier}:\\s*\\{([^}]*)\\}`))?.[1] ?? "";
const supremeSizeLine = readTierBlock("supreme");
const standardSizeLine = readTierBlock("standard");
const compactSizeLine = readTierBlock("compact");
const miniSizeLine = readTierBlock("mini");
const microSizeLine = readTierBlock("micro");
function readSizeValue(source, property) {
  const match = source.match(new RegExp(`(?:^|,)\\s*${property}:\\s*([\\d.]+)`));
  if (!match) throw new Error(`Missing Studio size token: ${property}`);
  return Number(match[1]);
}
function readTier(source) {
  return Object.fromEntries(["height", "stroke", "radius", "fontSize", "iconSize", "fontWeight", "textStroke", "iconStroke", "focusOutlineWidth", "secondaryFocusOutlineWidth"].map((property) => [property, readSizeValue(source, property)]));
}
const sizeTiers = {
  supreme: readTier(supremeSizeLine),
  standard: readTier(standardSizeLine),
  compact: readTier(compactSizeLine),
  mini: readTier(miniSizeLine),
  micro: readTier(microSizeLine),
};

const multilineContract = sizeContractBlock.match(/multiline:\s*\{([^}]*)\}/)?.[1] ?? "";
const multilineTokens = {
  supremeFontSize: readSizeValue(multilineContract, "standardFontSize") * 60 / 44,
  standardFontSize: readSizeValue(multilineContract, "standardFontSize"),
  compactFontSize: readSizeValue(multilineContract, "compactFontSize"),
  miniFontSize: readSizeValue(multilineContract, "miniFontSize"),
  microFontSize: readSizeValue(multilineContract, "microFontSize"),
  supremeTextStroke: readSizeValue(multilineContract, "standardTextStroke") * 60 / 44,
  standardTextStroke: readSizeValue(multilineContract, "standardTextStroke"),
  compactTextStroke: readSizeValue(multilineContract, "compactTextStroke"),
  miniTextStroke: readSizeValue(multilineContract, "miniTextStroke"),
  microTextStroke: readSizeValue(multilineContract, "microTextStroke"),
  fontWeight: sizeTiers.standard.fontWeight,
  minHeight: readSizeValue(multilineContract, "minHeight"),
  lineHeight: readSizeValue(multilineContract, "lineHeight"),
};
const cssNumber = (value) => Number(value.toFixed(2));

function readPair(contract, property) {
  const block = contract.match(new RegExp(`${property}:\\s*\\{([^}]*)\\}`))?.[1] ?? "";
  const values = Object.fromEntries(["supreme", "standard", "compact", "mini", "micro"].map((tier) => {
    const value = block.match(new RegExp(`${tier}:\\s*([\\d.]+)`))?.[1];
    if (!value) throw new Error(`Missing Studio token ${property}.${tier}`);
    return [tier, Number(value)];
  }));
  return values;
}

const dropdownRail = readPair(dropdownContract, "railSize");
const dropdownChevron = readPair(dropdownContract, "chevronSize");
const dropdownChevronStroke = readPair(dropdownContract, "chevronStroke");
const readDropdownMenuNumber = (property) => {
  const line = dropdownMenuContract.split("\n").find((entry) => entry.trim().startsWith(`${property}:`));
  const value = Number(line?.match(/:\s*([\d.]+)/)?.[1]);
  if (!Number.isFinite(value)) throw new Error(`Missing Studio dropdown menu token: ${property}`);
  return value;
};
const readDropdownMenuName = (property) => {
  const line = dropdownMenuContract.split("\n").find((entry) => entry.trim().startsWith(`${property}:`));
  const value = line?.match(/:\s*"([a-z-]+)"/)?.[1];
  if (!value) throw new Error(`Missing Studio dropdown menu token: ${property}`);
  return value;
};
const dropdownMenuGap = readDropdownMenuNumber("menuGap");
const dropdownMenuPadding = readDropdownMenuNumber("menuPadding");
const dropdownMenuRowGap = readDropdownMenuNumber("rowGap");
const dropdownMenuFill = readDropdownMenuName("menuFill");
const dropdownUnselectedFill = readDropdownMenuName("unselectedRowFill");
const dropdownSelectedFill = readDropdownMenuName("selectedRowFill");


/** Shared floating-label metrics come from the canonical size ladder (standard/compact tiers). */
function readFloatingLabelMetric(source, property, { required = true } = {}) {
  const match = source.match(new RegExp(`${property}:\\s*([\\d.]+)`));
  if (!match) {
    if (required) throw new Error(`Missing Studio floating-label token: ${property}`);
    return null;
  }
  return Number(match[1]);
}
const floatingLabelStandardHeight = readFloatingLabelMetric(standardSizeLine, "floatingLabelHeight");
const floatingLabelCompactHeight = readFloatingLabelMetric(compactSizeLine, "floatingLabelHeight");
const floatingLabelMiniHeight = readFloatingLabelMetric(miniSizeLine, "floatingLabelHeight");
const floatingLabelMicroHeight = readFloatingLabelMetric(microSizeLine, "floatingLabelHeight");
const floatingLabelOffsetRatio = readFloatingLabelMetric(sizeBaseBlock, "floatingLabelOffsetRatio");
const numberMix = Number(focusContract.match(/restTextMixPercent:\s*(\d+)/)?.[1]);
const activeTextColor = focusContract.match(/activeTextColor:\s*"([^"]+)"/)?.[1];
const activeStrokeColor = numberContract.match(/activeStrokeColor:\s*"([^"]+)"/)?.[1] ?? activeTextColor;
const focusHoldMs = Number(focusContract.match(/holdMs:\s*(\d+)/)?.[1]);
const focusOutlineFadeMs = Number(focusContract.match(/outlineFadeMs:\s*(\d+)/)?.[1]);
const focusWidthRatio = Number(focusContract.match(/outlineWidthRatio:\s*([\d.]+)/)?.[1]);
const focusOffsetPx = Number(focusContract.match(/outlineOffsetPx:\s*(\d+)/)?.[1]);
if (!Number.isFinite(numberMix) || !activeTextColor || !activeStrokeColor || !Number.isFinite(focusHoldMs) || !Number.isFinite(focusOutlineFadeMs) || !Number.isFinite(focusWidthRatio) || !Number.isFinite(focusOffsetPx)) {
  throw new Error("Incomplete Studio counter number-state tokens");
}

const css = `/* Generated by scripts/emit-studio-control-vars.mjs. Do not edit by hand. */
:root {
  --vt-studio-supreme-height: ${sizeTiers.supreme.height}px;
  --vt-studio-supreme-stroke: ${sizeTiers.supreme.stroke}px;
  --vt-studio-supreme-radius: ${sizeTiers.supreme.radius}px;
  --vt-studio-supreme-font-size: ${sizeTiers.supreme.fontSize}px;
  --vt-studio-supreme-icon-size: ${sizeTiers.supreme.iconSize}px;
  --vt-studio-supreme-font-weight: ${sizeTiers.supreme.fontWeight};
  --vt-studio-supreme-text-stroke: ${sizeTiers.supreme.textStroke}px;
  --vt-studio-supreme-icon-stroke: ${sizeTiers.supreme.iconStroke};
  --vt-studio-supreme-focus-outline-width: ${sizeTiers.supreme.focusOutlineWidth}px;
  --vt-studio-supreme-secondary-outline-width: ${sizeTiers.supreme.secondaryFocusOutlineWidth}px;
  --vt-studio-standard-height: ${sizeTiers.standard.height}px;
  --vt-studio-standard-stroke: ${sizeTiers.standard.stroke}px;
  --vt-studio-standard-radius: ${sizeTiers.standard.radius}px;
  --vt-studio-standard-font-size: ${sizeTiers.standard.fontSize}px;
  --vt-studio-standard-icon-size: ${sizeTiers.standard.iconSize}px;
  --vt-studio-standard-font-weight: ${sizeTiers.standard.fontWeight};
  --vt-studio-standard-text-stroke: ${sizeTiers.standard.textStroke}px;
  --vt-studio-standard-icon-stroke: ${sizeTiers.standard.iconStroke};
  --vt-studio-standard-focus-outline-width: ${sizeTiers.standard.focusOutlineWidth}px;
  --vt-studio-standard-secondary-outline-width: ${sizeTiers.standard.secondaryFocusOutlineWidth}px;
  --vt-studio-compact-height: ${sizeTiers.compact.height}px;
  --vt-studio-compact-stroke: ${sizeTiers.compact.stroke}px;
  --vt-studio-compact-radius: ${sizeTiers.compact.radius}px;
  --vt-studio-compact-font-size: ${sizeTiers.compact.fontSize}px;
  --vt-studio-compact-icon-size: ${sizeTiers.compact.iconSize}px;
  --vt-studio-compact-font-weight: ${sizeTiers.compact.fontWeight};
  --vt-studio-compact-text-stroke: ${sizeTiers.compact.textStroke}px;
  --vt-studio-compact-icon-stroke: ${sizeTiers.compact.iconStroke};
  --vt-studio-compact-focus-outline-width: ${sizeTiers.compact.focusOutlineWidth}px;
  --vt-studio-compact-secondary-outline-width: ${sizeTiers.compact.secondaryFocusOutlineWidth}px;
  --vt-studio-mini-height: ${sizeTiers.mini.height}px;
  --vt-studio-mini-stroke: ${sizeTiers.mini.stroke}px;
  --vt-studio-mini-radius: ${sizeTiers.mini.radius}px;
  --vt-studio-mini-font-size: ${sizeTiers.mini.fontSize}px;
  --vt-studio-mini-icon-size: ${sizeTiers.mini.iconSize}px;
  --vt-studio-mini-font-weight: ${sizeTiers.mini.fontWeight};
  --vt-studio-mini-text-stroke: ${sizeTiers.mini.textStroke}px;
  --vt-studio-mini-icon-stroke: ${sizeTiers.mini.iconStroke};
  --vt-studio-mini-focus-outline-width: ${sizeTiers.mini.focusOutlineWidth}px;
  --vt-studio-mini-secondary-outline-width: ${sizeTiers.mini.secondaryFocusOutlineWidth}px;
  --vt-studio-micro-height: ${sizeTiers.micro.height}px;
  --vt-studio-micro-stroke: ${sizeTiers.micro.stroke}px;
  --vt-studio-micro-radius: ${sizeTiers.micro.radius}px;
  --vt-studio-micro-font-size: ${sizeTiers.micro.fontSize}px;
  --vt-studio-micro-icon-size: ${sizeTiers.micro.iconSize}px;
  --vt-studio-micro-font-weight: ${sizeTiers.micro.fontWeight};
  --vt-studio-micro-text-stroke: ${sizeTiers.micro.textStroke}px;
  --vt-studio-micro-icon-stroke: ${sizeTiers.micro.iconStroke};
  --vt-studio-micro-focus-outline-width: ${sizeTiers.micro.focusOutlineWidth}px;
  --vt-studio-micro-secondary-outline-width: ${sizeTiers.micro.secondaryFocusOutlineWidth}px;
  /* Textarea-specific typography is a named family exception, sourced from tokens.ts multiline. */
  --vt-studio-textarea-supreme-font-size: ${cssNumber(multilineTokens.supremeFontSize)}px;
  --vt-studio-textarea-standard-font-size: ${multilineTokens.standardFontSize}px;
  --vt-studio-textarea-compact-font-size: ${multilineTokens.compactFontSize}px;
  --vt-studio-textarea-mini-font-size: ${multilineTokens.miniFontSize}px;
  --vt-studio-textarea-micro-font-size: ${multilineTokens.microFontSize}px;
  --vt-studio-textarea-supreme-text-stroke: ${cssNumber(multilineTokens.supremeTextStroke)}px;
  --vt-studio-textarea-standard-text-stroke: ${multilineTokens.standardTextStroke}px;
  --vt-studio-textarea-compact-text-stroke: ${multilineTokens.compactTextStroke}px;
  --vt-studio-textarea-mini-text-stroke: ${multilineTokens.miniTextStroke}px;
  --vt-studio-textarea-micro-text-stroke: ${multilineTokens.microTextStroke}px;
  --vt-studio-textarea-font-weight: ${multilineTokens.fontWeight};
  --vt-studio-textarea-min-height: ${multilineTokens.minHeight}px;
  --vt-studio-textarea-line-height: ${multilineTokens.lineHeight};
  /* Compatibility aliases: old numbered names resolve to the canonical tier tokens. */
  --vt-studio-60-height: var(--vt-studio-supreme-height);
  --vt-studio-60-stroke: var(--vt-studio-supreme-stroke);
  --vt-studio-60-radius: var(--vt-studio-supreme-radius);
  --vt-studio-60-font-size: var(--vt-studio-supreme-font-size);
  --vt-studio-60-icon-size: var(--vt-studio-supreme-icon-size);
  --vt-studio-44-height: var(--vt-studio-standard-height);
  --vt-studio-44-stroke: var(--vt-studio-standard-stroke);
  --vt-studio-44-radius: var(--vt-studio-standard-radius);
  --vt-studio-44-font-size: var(--vt-studio-standard-font-size);
  --vt-studio-44-icon-size: var(--vt-studio-standard-icon-size);
  --vt-studio-28-height: var(--vt-studio-compact-height);
  --vt-studio-28-stroke: var(--vt-studio-compact-stroke);
  --vt-studio-28-radius: var(--vt-studio-compact-radius);
  --vt-studio-28-font-size: var(--vt-studio-compact-font-size);
  --vt-studio-28-icon-size: var(--vt-studio-compact-icon-size);
  --vt-studio-secondary-focus-width-ratio: ${focusWidthRatio};
  --vt-studio-focus-hold-ms: ${focusHoldMs}ms;
  --vt-studio-focus-outline-fade-ms: ${focusOutlineFadeMs}ms;
  --vt-studio-focus-outline-width-ratio: ${focusWidthRatio};
  --vt-studio-focus-outline-offset: ${focusOffsetPx}px;
  --vt-studio-dropdown-menu-gap: ${dropdownMenuGap}px;
  --vt-studio-dropdown-menu-padding: ${dropdownMenuPadding}px;
  --vt-studio-dropdown-menu-row-gap: ${dropdownMenuRowGap}px;
  --vt-studio-dropdown-menu-radius: var(--vt-studio-control-radius, 6px);
  --vt-studio-dropdown-row-radius: var(--vt-studio-control-radius, 6px);
  --vt-studio-dropdown-menu-fill: ${dropdownMenuFill === "primary" ? "var(--vt-studio-control-accent, var(--pair-a, #36e0f6))" : "var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b))"};
  --vt-studio-dropdown-row-fill: ${dropdownUnselectedFill};
  --vt-studio-dropdown-selected-fill: ${dropdownSelectedFill === "secondary" ? "var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b))" : "var(--vt-studio-control-accent, var(--pair-a, #36e0f6))"};
  --vt-studio-dropdown-row-stroke: var(--vt-studio-control-stroke, 3px);
  --vt-studio-dropdown-supreme-rail-size: ${dropdownRail.standard / 44 * 60}px;
  --vt-studio-dropdown-supreme-chevron-size: ${dropdownChevron.standard / 44 * 60}px;
  --vt-studio-dropdown-supreme-chevron-stroke: ${dropdownChevronStroke.standard / 44 * 60};
  --vt-studio-dropdown-standard-rail-size: ${dropdownRail.standard}px;
  --vt-studio-dropdown-compact-rail-size: ${dropdownRail.compact}px;
  --vt-studio-dropdown-mini-rail-size: ${dropdownRail.mini}px;
  --vt-studio-dropdown-micro-rail-size: ${dropdownRail.micro}px;
  --vt-studio-dropdown-standard-chevron-size: ${dropdownChevron.standard}px;
  --vt-studio-dropdown-compact-chevron-size: ${dropdownChevron.compact}px;
  --vt-studio-dropdown-mini-chevron-size: ${dropdownChevron.mini}px;
  --vt-studio-dropdown-micro-chevron-size: ${dropdownChevron.micro}px;
  --vt-studio-dropdown-standard-chevron-stroke: ${dropdownChevronStroke.standard};
  --vt-studio-dropdown-compact-chevron-stroke: ${dropdownChevronStroke.compact};
  --vt-studio-dropdown-mini-chevron-stroke: ${dropdownChevronStroke.mini};
  --vt-studio-dropdown-micro-chevron-stroke: ${dropdownChevronStroke.micro};
  --vt-studio-number-default-white-mix: ${numberMix}%;
  --vt-studio-number-rest-mix: ${numberMix}%;
  --vt-studio-number-active-color: ${activeTextColor};
  --vt-studio-number-active-stroke: ${activeStrokeColor};
  --vt-studio-floating-label-standard-height: ${floatingLabelStandardHeight}px;
  --vt-studio-floating-label-compact-height: ${floatingLabelCompactHeight}px;
  --vt-studio-floating-label-mini-height: ${floatingLabelMiniHeight}px;
  --vt-studio-floating-label-micro-height: ${floatingLabelMicroHeight}px;
  --vt-studio-floating-label-offset-ratio: ${floatingLabelOffsetRatio};
}
`;
await writeFile(resolve(root, "src/styles/studio-control-vars.generated.css"), css);
