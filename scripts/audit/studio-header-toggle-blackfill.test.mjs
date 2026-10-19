import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../../src/components/subtoolbox/SubToolboxPrimitives.tsx", import.meta.url),
  "utf8",
);
const controls = readFileSync(
  new URL("../../src/studio-ui/primitives/StudioControls.tsx", import.meta.url),
  "utf8",
);

const start = source.indexOf("export const ToolboxHeaderToggle:");
const end = source.indexOf("\nexport interface SubToolboxToggleSwitchProps", start);
assert.notEqual(start, -1, "ToolboxHeaderToggle implementation exists");
assert.notEqual(end, -1, "ToolboxHeaderToggle implementation has a stable end boundary");
const implementation = source.slice(start, end);

test("portrait header toggle initializes at compact size before effects run", () => {
  assert.match(implementation, /useState<"44" \| "28">\(\(\) => \{/);
  assert.match(implementation, /matchMedia\("\(orientation: portrait\) and \(max-width: 768px\)"\)\.matches \? "28" : "44"/);
});

test("header toggle uses the shared Blackfill skin without a white background override", () => {
  assert.match(implementation, /verticalOnMobilePortrait/);
  assert.match(implementation, /skin="black-indicator"/);
  assert.doesNotMatch(implementation, /background:\s*["']#ffffff["']/);
});

test("portrait vertical word toggle enforces compact sizing and black surface", () => {
  assert.match(controls, /sizeVariant=\{verticalOnMobilePortrait \? "compact" : size === "28" \? "compact" : "standard"\}/);
  assert.match(controls, /skin === "black-indicator" \? \{ background: "#000", borderColor: "#000" \} : \{\}/);
});

const toolboxCss = readFileSync(
  new URL("../../src/styles/subtoolbox-system.css", import.meta.url),
  "utf8",
);

test("mobile portrait header action controls use compact Blackfill dimensions", () => {
  const start = toolboxCss.indexOf("Studio Hub mobile portrait header controls use the compact Blackfill tier");
  assert.notEqual(start, -1, "portrait header override exists after legacy resets");
  const portraitRules = toolboxCss.slice(start);
  assert.match(portraitRules, /@media \(max-width: 768px\) and \(orientation: portrait\)/);
  assert.match(portraitRules, /\.vt-toolbox-header-actions \.vt-toolbox-header-collapse,[\s\S]*?\.vt-toolbox-header-help/);
  assert.match(portraitRules, /width: 28px !important/);
  assert.match(portraitRules, /height: 28px !important/);
  assert.match(portraitRules, /background: #000 !important/);
  assert.match(portraitRules, /border: 2px solid #000 !important/);
  assert.match(portraitRules, /--vt-studio-vertical-word-font-size: 12px/);
});
