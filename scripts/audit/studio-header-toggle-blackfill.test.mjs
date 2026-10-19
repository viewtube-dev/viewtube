import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../../src/components/subtoolbox/SubToolboxPrimitives.tsx", import.meta.url),
  "utf8",
);

const start = source.indexOf("export const ToolboxHeaderToggle:");
const end = source.indexOf("\nexport interface SubToolboxToggleSwitchProps", start);
assert.notEqual(start, -1, "ToolboxHeaderToggle implementation exists");
assert.notEqual(end, -1, "ToolboxHeaderToggle implementation has a stable end boundary");
const implementation = source.slice(start, end);

test("portrait header toggle delegates to Studio Controls vertical Blackfill compact variant", () => {
  assert.match(implementation, /verticalOnMobilePortrait/);
  assert.match(implementation, /skin="black-indicator"/);
  assert.doesNotMatch(implementation, /style=\{\{\s*\.\.\.style,\s*background:\s*["']#ffffff["']\s*\}\}/);
});
