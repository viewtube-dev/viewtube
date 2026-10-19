import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const component = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const styles = readFileSync("src/styles/studio-control-system.css", "utf8");
const splitStyles = readFileSync("src/styles/studio-control-split.css", "utf8");
const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");
const generated = readFileSync("src/styles/studio-control-vars.generated.css", "utf8");

test("simple dropdowns have no split rail and split-left dropdowns keep the chevron on the opposite edge", () => {
  const start = component.indexOf("export const StudioDropdown:");
  const end = component.indexOf("export interface StudioSimpleDropdownOption", start);
  const source = component.slice(start, end);
  assert.ok(start >= 0 && end > start);
  assert.match(source, /variant === "split-left"[^\n]*data-vt-studio-split-rail/);
  assert.match(source, /data-vt-studio-dropdown-chevron[^>]*is-trailing/);
  assert.doesNotMatch(source, /vt-studio-dropdown-chevron is-leading/);
  assert.match(source, /splitIcon\??:/);
  assert.match(styles, /\.vt-studio-dropdown\.is-simple[^\{]*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
  assert.match(splitStyles, /\.vt-studio-dropdown\.is-split-left[^\{]*\{[^}]*grid-template-columns:\s*var\(--vt-studio-control-height[^,]*\),?\s*minmax\(0,\s*1fr\)/s);
});

test("all dropdown chevrons use the shared generated size contract", () => {
  assert.match(tokens, /dropdownChevronSize/);
  assert.match(generated, /--vt-studio-dropdown-chevron-standard-size:\s*38px/);
  assert.match(generated, /--vt-studio-dropdown-chevron-compact-size:\s*24px/);
  assert.match(styles, /--vt-studio-dropdown-chevron-size:\s*var\(--vt-studio-dropdown-chevron-(?:standard|compact)-size/);
  assert.match(styles, /\.vt-studio-legend-chevron[\s\S]*width:\s*var\(--vt-studio-dropdown-chevron-size/);
});

test("side-counter divider uses a centered stroke without changing either action cell's geometry", () => {
  assert.match(styles, /\.vt-studio-side-counter__actions button:first-child::after\s*\{[^}]*bottom:\s*calc\(var\(--vt-studio-control-stroke,\s*3px\)\s*\/\s*-2\)[^}]*height:\s*var\(--vt-studio-control-stroke,\s*3px\)/s);
  assert.doesNotMatch(styles, /\.vt-studio-side-counter__actions button:first-child\s*\{\s*border-bottom:\s*var\(--vt-studio-control-stroke/);
});

test("counter active numeral strokes stay black for both palette variants", () => {
  assert.match(styles, /\.vt-studio-left-counter:has\([\s\S]*?-webkit-text-stroke:\s*var\(--vt-studio-control-text-stroke,\s*1px\)\s*#000/);
  assert.match(styles, /\.vt-studio-left-counter\.is-reversed:has\([\s\S]*?-webkit-text-stroke-color:\s*#000/);
  assert.match(tokens, /activeNumberColor:\s*"#000000"/);
});

test("double-split slider numerals share counter resting and active number-state tokens", () => {
  assert.match(tokens, /restingNumberWhiteMix:\s*50/);
  assert.match(generated, /--vt-studio-number-resting-white-mix:\s*50%/);
  assert.match(styles, /\.vt-studio-double-split-slider \.vt-studio-double-split-slider__value\s*\{[^}]*color:\s*color-mix\(in srgb,\s*#fff\s*var\(--vt-studio-number-resting-white-mix,\s*50%\),\s*var\(--vt-studio-slider-number-surface,[^)]*\)\s*50%\)/s);
  assert.match(styles, /\.vt-studio-double-split-slider:has\(input\[type="range"\]:(?:active|focus-visible)\)[\s\S]*?\.vt-studio-double-split-slider__value[\s\S]*?color:\s*var\(--vt-studio-number-active-color,\s*#000\)/);
});
