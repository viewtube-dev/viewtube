import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/studio-control-system.css", "utf8");
const toggles = readFileSync("src/studio-ui/primitives/StudioValueToggles.tsx", "utf8");
const area = readFileSync("src/studio-ui/primitives/StudioTextArea.tsx", "utf8");
const fields = readFileSync("src/styles/studio-control-fields.css", "utf8");
const overrides = readFileSync("src/styles/studio-control-distill-overrides.css", "utf8");
const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");
const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");
const generated = readFileSync("src/styles/studio-control-vars.generated.css", "utf8");
const core = readFileSync("src/styles/studio-control-core.css", "utf8");

test("side-toggle stack uses a centered overlay divider, not a half-cell border", () => {
  assert.match(css, /\.vt-studio-value-toggle__arrow-stack::after[\s\S]*?top:\s*50%[\s\S]*?translateY\(-50%\)/);
  assert.match(css, /\.vt-studio-value-toggle__arrow-stack\s*>\s*\.vt-studio-value-toggle__arrow[\s\S]*?border-bottom:\s*0\s*!important/);
  assert.match(toggles, /export function StudioSideToggle/);
});

test("toggle chevrons use the standard, compact, and micro icon dimensions", () => {
  assert.match(css, /data-size="standard"[\s\S]*?width:\s*min\(38px, 100%\)/);
  assert.match(css, /data-size="compact"[\s\S]*?width:\s*min\(30px, 100%\)/);
  assert.match(css, /data-size="micro"[\s\S]*?width:\s*min\(15px, 100%\)/);
});

test("textarea focus uses primary 15-percent fill and secondary proportional outline", () => {
  assert.match(css, /data-vt-studio-field-kind="textarea"\]:is\(:focus, :focus-visible\)[\s\S]*?15%[\s\S]*?color:\s*#000[\s\S]*?calc\(var\(--vt-studio-control-stroke, 3px\) \* \.65\)[\s\S]*?var\(--vt-studio-control-secondary/);
  assert.match(area, /data-vt-studio-field-kind="textarea"/);
});

test("single-line panels clip overflow without ellipses and exclude textareas", () => {
  assert.match(css, /\[data-vt-studio-control\]:not\(input\):not\(textarea\):not\(select\)/);
  assert.match(css, /text-overflow:\s*clip/);
  assert.doesNotMatch(css, /textarea\s*\{[^}]*text-overflow:\s*clip/s);
});

test("click growth animation targets the SVG glyph only", () => {
  assert.match(css, /\.vt-studio-value-toggle__arrow:active svg\s*\{[^}]*animation:\s*vt-studio-value-toggle-grow/);
});


test("input and textarea focus retain the primary inline glyph stroke", () => {
  assert.match(css, /--vt-field-text-stroke-focus:\s*var\(--vt-field-primary\)/);
  assert.match(css, /--vt-field-caret-focus:\s*#000/);
  assert.match(fields, /input\[data-vt-studio-control="true"\][\s\S]*?:focus[\s\S]*?-webkit-text-stroke-color:\s*var\(--vt-field-primary/);
  assert.match(fields, /textarea\[data-vt-studio-control="true"\][\s\S]*?:focus[\s\S]*?-webkit-text-stroke-color:\s*var\(--vt-field-primary/);
  // A read-only StudioTextBox has its own display-copy focus rule; do not
  // confuse that rule with the editable input/textarea focus contract.
  const editableFocusRules = fields
    .split("}")
    .filter((rule) => /(?:input|textarea)\[data-vt-studio-control="true"\]/.test(rule) && /:focus/.test(rule))
    .join("}");
  assert.ok(editableFocusRules.length > 0, "editable field focus rules must be present");
  assert.doesNotMatch(editableFocusRules, /-webkit-text-stroke-color:\s*#000\s*!important/);
});

test("floating-label risen typography uses one shared token pair while rest labels retain field-size tokens", () => {
  assert.match(css, /--vt-studio-floating-label-risen-font-size:\s*12px/);
  assert.match(css, /--vt-studio-floating-label-risen-text-stroke:\s*0\.5px/);
  assert.match(css, /font-size:\s*var\(--vt-studio-floating-label-risen-font-size, 12px\) !important/);
  assert.match(css, /-webkit-text-stroke-width:\s*var\(--vt-studio-floating-label-risen-text-stroke, 0\.5px\) !important/);
  assert.match(css, /textarea\[data-size="compact"\] \+ \.vt-studio-floating-field-label[\s\S]*?vt-studio-textarea-compact-font-size/);
  assert.match(css, /input\[data-size="compact"\] \+ \.vt-studio-floating-field-label[\s\S]*?vt-studio-28-font-size/);
  assert.doesNotMatch(css, /\.vt-studio-floating-field[^{}]*:focus[^{}]*\{[^}]*font-size:\s*18px/);
});

test("double-side divider is centered and the confirmed catalog mixes compact and standard variants", () => {
  assert.match(css, /\.vt-studio-value-toggle--double \.vt-studio-value-toggle__divider\s*\{[^}]*left:\s*50%;[^}]*translateX\(-50%\)/s);
  assert.match(catalog, /size=\{index === 1 \|\| index === 3 \? "compact" : "standard"\}/);
});

test("bar toggle uses adaptive width counts, proportional fill, and size-specific borderless bars", () => {
  assert.match(toggles, /function barCountFromWidth\\(widthPx: number, size: string\\)/);
  assert.match(toggles, /barCountFromWidth\(width, size\)/);
  assert.match(toggles, /Math\.floor\(\(inner \+ metrics\.gap\) \/ \(metrics\.bar \+ metrics\.gap\)\)/);
  assert.match(toggles, /Math\.max\(4, Math\.min\(40, count \|\| 4\)\)/);
  assert.match(toggles, /Math\.round\(\(Math\.max\(0, Math\.min\(100, value\)\) \/ 100\) \* barCount\)/);
  assert.match(toggles, /setPointerCapture\?\.\(event\.pointerId\)/);
  assert.match(toggles, /onPointerUp=\{stopRepeat\}[\s\S]*?onPointerCancel=\{stopRepeat\}[\s\S]*?onLostPointerCapture=\{stopRepeat\}/);
  assert.match(overrides, /--vt-bar-width:\s*10px/);
  assert.match(overrides, /--vt-bar-gap:\s*3px/);
  assert.match(overrides, /border:\s*0\s*!important/);
  assert.match(overrides, /background:\s*color-mix\(in srgb,[\s\S]*?50%,\s*transparent\)\s*!important/);
  assert.match(overrides, /\.vt-studio-value-toggle__bar\[data-active="true"\][\s\S]*?background:\s*#000/);
});

test("multi-select closed trigger renders a separate black count badge inside trigger text", () => {
  assert.match(controls, /const extra = selectedLabels.length - 1/);
  assert.match(controls, /className="vt-studio-legend-trigger-text"[\s\S]*?vt-studio-legend-count-badge/);
  assert.doesNotMatch(controls, /\$\{selectedLabels\[0\]\} \+\$\{selectedLabels\.length - 1\}/);
});

test("the five-tier size contract is complete and generated CSS stays in parity", () => {
  for (const [tier, height, font, icon] of [
    ["supreme", 60, 51.82, 51.82],
    ["standard", 44, 38, 38],
    ["compact", 28, 24, 24],
    ["mini", 20, 17.5, 17.5],
    ["micro", 12, 10, 10],
  ]) {
    assert.match(tokens, new RegExp(`${tier}:\\s*\\{[\\s\\S]*?height:\\s*${height}\\b[\\s\\S]*?fontSize:\\s*${font}\\b[\\s\\S]*?iconSize:\\s*${icon}\\b`), `${tier} tokens must remain canonical`);
    assert.match(generated, new RegExp(`--vt-studio-${tier}-height:\\s*${height}px`), `${tier} height must be emitted`);
    assert.match(generated, new RegExp(`--vt-studio-${tier}-font-size:\\s*${font}px`), `${tier} font size must be emitted`);
    assert.match(generated, new RegExp(`--vt-studio-${tier}-icon-size:\\s*${icon}px`), `${tier} icon size must be emitted`);
    assert.match(core, new RegExp(`data-size="${tier}"[\\s\\S]*?--vt-studio-control-height:[^;]*`), `${tier} must resolve to core control geometry`);
  }
});

test("bar toggle bars follow their size's text height and a 2.5:1 height-to-width ratio", () => {
  assert.match(overrides, /--vt-bar-height:\s*var\(--vt-studio-control-font-size/);
  assert.match(overrides, /aspect-ratio:\s*2\s*\/\s*5/);
  assert.match(overrides, /border-radius:\s*var\(--vt-bar-radius/);
  assert.match(overrides, /background:\s*color-mix\(in srgb,[\s\S]*?50%,\s*transparent\)\s*!important/);
  assert.match(overrides, /data-active="true"[\s\S]*?background:\s*#000/);
});

test("top direct-representative module covers the full explicitly exported control inventory", () => {
  const start = catalog.indexOf("const ConfirmedDirectPrimitiveRows");
  const end = catalog.indexOf("const ConfirmedStudioCounterFamily");
  assert.ok(start >= 0 && end > start, "representative module boundaries must remain explicit");
  const representative = catalog.slice(start, end);
  for (const primitive of [
    "StudioButton", "StudioTwoLineButton", "StudioSplitTwoLineButton", "StudioActionButton",
    "StudioIconButton", "StudioSquareIconButton", "StudioSquareIconButtonGroup", "StudioCircleIconButton",
    "StudioSplitLeftButton", "StudioSplitRightButton", "StudioDoubleSplitButton",
    "StudioPlayPauseButton", "StudioSwitch", "StudioChoice", "StudioRadio", "StudioCheckbox", "StudioXCheckbox",
    "StudioSelect", "StudioSearchInput", "StudioNumberInput", "StudioTextInput", "StudioTextArea", "StudioTextBox",
    "StudioDropdown", "StudioSimpleDropdown", "StudioLegendMultiDropdown", "StudioSplitLeftDropdown",
    "StudioArrowToggle", "StudioBarToggle", "StudioWordToggle", "StudioVerticalWordToggle",
    "StudioSideToggle", "StudioDoubleSideToggle", "StudioCounter", "StudioSideCounter", "StudioLeftCounter",
    "StudioDoubleSplitSlider", "StudioSplitLeftBadge", "StudioSplitRightBadge", "StudioDoubleSplitBadge",
    "StudioSpectrumTag", "StudioCloseableBadge", "StudioBrainStatusBadge", "StudioTagEditor", "StudioUploadFrame",
  ]) {
    assert.match(representative, new RegExp(`data-vt-library-component="${primitive}"\\b`), `${primitive} needs a direct top-module specimen`);
  }
  assert.doesNotMatch(representative, /data-vt-library-component="(?:StudioCollapsingSplitModule|StudioInterModule|StudioSplitAccordion)"/);
});
