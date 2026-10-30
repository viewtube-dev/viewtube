import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const controls = read("src/studio-ui/primitives/StudioControls.tsx");
const toggles = read("src/studio-ui/primitives/StudioValueToggles.tsx");
const accordion = read("src/studio-ui/primitives/StudioSplitAccordion.tsx");
const publicIndex = read("src/studio-ui/index.ts");
const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx");
const catalogCss = read("src/components/studio-hub/studio-hub-primitive-catalogs.css");
const restoredCss = read("src/styles/studio-control-restored-primitives.css");
const toggleCss = read("src/styles/studio-control-value-toggles.css");

test("restored production primitives are publicly exported and catalogued", () => {
  for (const name of [
    "StudioVerticalWordToggle", "StudioSquareIconButtonGroup", "StudioTextBox",
    "StudioLeftWordCounter", "StudioSplitAccordion", "StudioArrowToggle",
    "StudioSideToggle", "StudioDoubleSideToggle", "StudioBarToggle",
    "StudioDoubleSplitWordCounter",
  ]) {
    assert.match(controls + toggles + accordion, new RegExp(`(?:export const|export function|export \\{)[^\\n]*\\b${name}\\b|export const ${name}\\b`), `${name} has a production implementation`);
    assert.ok(publicIndex.includes(name), `${name} is exported from the public Studio entry`);
    assert.ok(catalog.includes(name), `${name} is represented in the confirmed library`);
  }
});

test("the confirmed library has a distinct Representatives section and actual production specimens", () => {
  assert.match(catalog, /StudioPrimitiveRepresentatives/);
  assert.match(catalog, /aria-labelledby="vt-confirmed-representatives-title"/);
  assert.match(catalog, /StudioSquareIconButtonGroup sizeVariant="standard"/);
  assert.match(catalog, /StudioSplitLeftBadge icon=/);
});

test("size matrices use one standard, two compact, and four micro specimens without intervening labels", () => {
  assert.match(catalog, /vt-confirmed-size-matrix__standard/);
  assert.match(catalog, /vt-confirmed-size-matrix__compact/);
  assert.match(catalog, /vt-confirmed-size-matrix__micro/);
  assert.match(catalogCss, /\.vt-confirmed-size-matrix__compact\s*\{[^}]*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(catalogCss, /\.vt-confirmed-size-matrix__micro\s*\{[^}]*repeat\(4, minmax\(0, 1fr\)\)/s);
});

test("primitive modules are full-row or natural-width; catalog specimen families are not arranged in columns", () => {
  assert.match(catalogCss, /\.vt-confirmed-family > \.vt-confirmed-variants\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/s);
  assert.match(catalogCss, /\.vt-confirmed-square-variant-grid\s*\{[^}]*display:\s*flex/s);
});

test("counter and slider catalogs expose only the canonical primary-fill design", () => {
  const counterStart = catalog.indexOf('title="StudioCounter · Standard / Compact / Micro"');
  const sliderStart = catalog.indexOf('title="StudioDoubleSplitSlider · Standard / Compact / Micro"');
  const sideStart = catalog.indexOf('title="StudioSideCounter · Standard / Compact / Micro"');
  assert.ok(counterStart >= 0 && sliderStart > counterStart && sideStart > sliderStart);
  const families = catalog.slice(counterStart, catalog.indexOf("const ConfirmedStudioSideCounterFamily", counterStart)) +
    catalog.slice(sideStart);
  assert.match(families, /inverse-color variants are intentionally excluded/);
  assert.doesNotMatch(families, /is-reversed|is-inverse|inverse-fill|reverse-colors/);
});

test("all counter, slider, and value-toggle chevrons share one button owner and focus token contract", () => {
  assert.match(controls, /vt-studio-stepper-button/);
  assert.match(toggles, /vt-studio-stepper-button/);
  assert.match(toggleCss, /\.vt-studio-stepper-button:focus-visible/);
  assert.match(toggleCss, /var\(--vt-studio-focus-outline-width/);
  assert.match(toggleCss, /var\(--vt-studio-focus-outline-color/);
  assert.match(toggleCss, /:focus-within/);
  assert.match(toggleCss, /prefers-reduced-motion/);
});

test("value toggles reuse StudioSplitShell and derive bar count from canonical size tokens", () => {
  assert.match(toggles, /import \{ STUDIO_CONTROL_SIZE_CONTRACT, type StudioControlSize \} from "\.\.\/tokens"/);
  assert.match(toggles, /StudioSplitShell/);
  assert.doesNotMatch(toggles, /BAR_METRICS|bar:\s*15\.2|bar:\s*9\.6/);
});

test("restored primitive styles contain no malformed escaped newline and honor reduced motion", () => {
  assert.doesNotMatch(restoredCss, /\\\\n\s+--vt-studio-control-font-size/);
  assert.match(restoredCss, /\.vt-studio-vertical-word-toggle:focus-visible/);
  assert.match(restoredCss, /\.vt-studio-square-icon-button-group > \[aria-pressed="true"\]/);
  assert.match(restoredCss, /prefers-reduced-motion/);
});
