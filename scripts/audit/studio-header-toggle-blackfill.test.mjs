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
const end = source.indexOf("\\nexport interface SubToolboxToggleSwitchProps", start);
assert.notEqual(start, -1, "ToolboxHeaderToggle implementation exists");
assert.notEqual(end, -1, "ToolboxHeaderToggle implementation has a stable end boundary");
const implementation = source.slice(start, end);

test("portrait header toggle initializes at compact size before effects run", () => {
  assert.match(implementation, /useState<"44" \| "28">\(\(\) => \{/);
  assert.match(implementation, /matchMedia\("\(orientation: portrait\) and \(max-width: 768px\)"\)\.matches \? "28" : "44"/);
});

test("portrait header toggle delegates to Studio Controls Blackfill variant without a white override", () => {
  assert.match(implementation, /verticalOnMobilePortrait/);
  assert.match(implementation, /skin="black-indicator"/);
  assert.doesNotMatch(implementation, /style=\{\{\s*\.\.\.style,\s*background:\s*["']#ffffff["']\s*\}\}/);
});

test("portrait vertical word toggle enforces compact sizing and black surface", () => {
  assert.match(controls, /sizeVariant=\{verticalOnMobilePortrait \? "compact" : size === "28" \? "compact" : "standard"\}/);
  assert.match(controls, /skin === "black-indicator" \? \{ background: "#000", borderColor: "#000" \} : \{\}/);
});
