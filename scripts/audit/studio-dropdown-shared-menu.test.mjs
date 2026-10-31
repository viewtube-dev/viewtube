import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");
const emitter = readFileSync("scripts/emit-studio-control-vars.mjs", "utf8");
const generated = readFileSync("src/styles/studio-control-vars.generated.css", "utf8");
const css = readFileSync("src/styles/studio-control-system.css", "utf8");

test("dropdown menu opening motion is defined once in the canonical token contract", () => {
  const block = tokens.match(/export const STUDIO_DROPDOWN_MENU_TOKENS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
  assert.match(block, /menuOpenDurationMs:\s*160/);
  assert.match(block, /menuOpenEasing:\s*"cubic-bezier\(\.2,\.75,\.2,1\)"/);
  assert.match(block, /menuOpenTranslateY:\s*5/);
  assert.match(block, /menuOpenScaleY:\s*0\.98/);
});

test("the canonical token emitter publishes the shared menu motion variables", () => {
  for (const token of ["menuOpenDurationMs", "menuOpenEasing", "menuOpenTranslateY", "menuOpenScaleY"]) {
    assert.ok(emitter.includes(token), "emitter reads " + token);
  }
  assert.match(generated, /--vt-studio-dropdown-menu-open-duration:\s*160ms/);
  assert.match(generated, /--vt-studio-dropdown-menu-open-easing:\s*cubic-bezier\(\.2,\.75,\.2,1\)/);
  assert.match(generated, /--vt-studio-dropdown-menu-open-translate-y:\s*5px/);
  assert.match(generated, /--vt-studio-dropdown-menu-open-scale-y:\s*0\.98/);
});

test("regular and multi-select dropdown menus use the same opening animation", () => {
  assert.match(css, /\.vt-studio-dropdown-menu,\s*\.vt-studio-legend-menu\s*\{[^}]*animation:\s*vt-studio-dropdown-menu-open var\(--vt-studio-dropdown-menu-open-duration,/s);
  assert.match(css, /@keyframes vt-studio-dropdown-menu-open/);
  assert.doesNotMatch(css, /@keyframes vt-legend-menu-open/);
});

test("all dropdown menu variants honor reduced motion", () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.vt-studio-dropdown-menu,\s*\.vt-studio-legend-menu\s*\{\s*animation-duration:\s*\.01ms/s);
});


const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");

test("multi-select closed trigger keeps selected label and count centered as one group", () => {
  assert.match(css, /\.vt-studio-legend-trigger-text\s*\{[^}]*justify-content:\s*center/s);
  assert.match(css, /\.vt-studio-legend-trigger-text\s*\{[^}]*text-align:\s*center/s);
  assert.match(css, /\.vt-studio-legend-trigger-label\s*\{[^}]*flex:\s*0 1 auto/s);
  assert.match(css, /\.vt-studio-legend-count-badge\s*\{[^}]*flex:\s*none/s);
});

test("split-left dropdown closed label is centered on the complete trigger box", () => {
  assert.match(css, /\.vt-studio-dropdown\.is-split-left[^}]*[\s\S]{0,1800}\[data-vt-studio-split-label\][^}]*position:\s*absolute/s);
  assert.match(css, /\.vt-studio-dropdown\.is-split-left[^}]*[\s\S]{0,1800}\[data-vt-studio-split-label\][^}]*inset:\s*0/s);
});

test("split-left dropdown options retain one leading icon rail and a centered label", () => {
  assert.match(controls, /variant === "split-left"\s*\?\s*\(/);
  assert.match(controls, /className="vt-studio-dropdown-option-rail vt-studio-dropdown-option-rail--start"/);
  assert.match(controls, /className="vt-studio-dropdown-option-label"/);
  assert.doesNotMatch(controls, /vt-studio-dropdown-option-rail--end/);
  assert.match(css, /\.vt-studio-dropdown-option-rail[^}]*width:\s*var\(--vt-studio-dropdown-option-rail-size/s);
  assert.match(css, /\.vt-studio-dropdown-option-label[^}]*text-align:\s*center/s);
});


test("split dropdown menu rows contain only the leading icon rail and no chevron section", () => {
  const dropdownMenuControls = controls.slice(controls.indexOf('className="vt-studio-dropdown-menu"'));
  const optionMarkup = dropdownMenuControls.match(/variant === "split-left" \? \(([\s\S]*?)\) : option\.label/)?.[1] ?? "";
  assert.match(optionMarkup, /vt-studio-dropdown-option-rail--start/);
  assert.match(optionMarkup, /vt-studio-dropdown-option-label/);
  assert.doesNotMatch(optionMarkup, /vt-studio-dropdown-option-rail--end|ChevronDown/);
});

test("regular dropdown option buttons use the full height and radius for their size bracket", () => {
  assert.match(css, /\.vt-studio-dropdown-option\s*\{[^}]*height:\s*var\(--vt-studio-control-height/s);
  assert.match(css, /\.vt-studio-dropdown-option\s*\{[^}]*border-radius:\s*var\(--vt-studio-control-radius/s);
  assert.doesNotMatch(css, /\.vt-studio-dropdown-option\s*\+\s*\.vt-studio-dropdown-option[^}]*border-radius:\s*0/);
});

test("multi-select option and clear buttons use their bracket height and radius", () => {
  assert.match(css, /\.vt-studio-legend-option\s*\{[^}]*height:\s*var\(--vt-legend-height/s);
  assert.match(css, /\.vt-studio-legend-option\s*\{[^}]*border-radius:\s*var\(--vt-legend-radius/s);
  assert.match(css, /\.vt-studio-legend-clear\s*\{[^}]*height:\s*var\(--vt-legend-height/s);
  assert.match(css, /\.vt-studio-legend-clear\s*\{[^}]*border-radius:\s*var\(--vt-legend-radius/s);
});
