import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const css = await fs.readFile("src/styles/studio-control-system.css", "utf8");
const tsx = await fs.readFile("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const marker = "/* Studio text field rendering correction";
const correctionIndex = css.lastIndexOf(marker);
const correction = correctionIndex >= 0 ? css.slice(correctionIndex) : "";

test("final Studio text-field rules preserve translucent primary fills in both states", () => {
  assert.ok(correctionIndex >= 0, "final correction block exists after legacy conflicting rules");
  assert.match(correction, /background-color:\s*color-mix\(in srgb, var\(--pair-a, #36e0f6\) 50%, transparent\)\s*!important/);
  assert.match(correction, /:focus[^\{]*\{[\s\S]*?background-color:\s*color-mix\(in srgb, var\(--pair-a, #36e0f6\) 15%, transparent\)\s*!important/);
});

test("focus text and stroke switch to black with a secondary half-border outline", () => {
  assert.match(correction, /:focus[^\{]*\{[\s\S]*?color:\s*#000\s*!important/);
  assert.match(correction, /-webkit-text-fill-color:\s*#000\s*!important/);
  assert.match(correction, /-webkit-text-stroke:\s*\.5px #000\s*!important/);
  assert.match(correction, /outline:\s*var\(--vt-field-outline-stroke\) solid var\(--pair-b, #ff7f6b\)\s*!important/);
  assert.match(correction, /0 0 0 var\(--vt-field-outline-shadow-width\) color-mix\(in srgb, var\(--pair-b, #ff7f6b\) 30%, transparent\)/);
});

test("caret uses the browser-native single insertion caret, not experimental block shaping", () => {
  assert.doesNotMatch(correction, /caret-shape\s*:\s*block/i);
  assert.match(correction, /caret-color:\s*var\(--pair-a, #36e0f6\)\s*!important/);
  assert.match(tsx, /style:\s*"native insertion caret"/);
});

test("standard and compact text fields keep 3px/2px borders and 1.5px/1px focus outlines", () => {
  assert.match(correction, /data-size="standard"[^\{]*\{[\s\S]*?--vt-field-stroke:\s*3px[\s\S]*?--vt-field-outline-stroke:\s*1\.5px/);
  assert.match(correction, /data-size="compact"[^\{]*\{[\s\S]*?--vt-field-stroke:\s*2px[\s\S]*?--vt-field-outline-stroke:\s*1px/);
});

test("canonical field typography matches standard and compact size contracts", () => {
  assert.match(correction, /font-size:\s*38px\s*!important/);
  assert.match(correction, /font-size:\s*24px\s*!important/);
  assert.match(correction, /font-weight:\s*1000\s*!important/);
  assert.match(correction, /text-transform:\s*uppercase\s*!important/);
});

test("dropdown menus attach to triggers and inherit the 44px/28px typography", async () => {
  const dropdownCss = await fs.readFile("src/styles/studio-control-system.css", "utf8");
  const dropdownTsx = await fs.readFile("src/studio-ui/primitives/StudioDropdown.tsx", "utf8");
  assert.match(dropdownCss, /\.vt-studio-dropdown-menu\s*\{[\s\S]*?top:\s*100%\s*!important/);
  assert.match(dropdownCss, /\.vt-studio-dropdown-option\s*\{[\s\S]*?font-size:\s*var\(--vt-dropdown-font-size, 38px\)\s*!important/);
  assert.match(dropdownTsx, /sizeVariant\?:\s*"standard"\s*\|\s*"compact"/);
  assert.match(dropdownTsx, /data-open=\{open \? "true" : "false"\}/);
});

test("confirmed library lays four control skins out in a single row", async () => {
  const catalogCss = await fs.readFile("src/components/studio-hub/studio-hub-confirmed-primitive-catalog.css", "utf8");
  assert.match(catalogCss, /\.vt-confirmed-control-variants,[\s\S]*?grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)\s*!important/);
});
