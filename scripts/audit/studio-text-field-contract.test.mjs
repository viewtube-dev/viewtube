import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/studio-control-system.css", "utf8");
const tsx = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");
const catalogCss = readFileSync("src/components/studio-hub/studio-hub-primitive-catalogs.css", "utf8");
const fieldStart = css.indexOf("/* 1. Canonical field family.");
const fieldEnd = css.indexOf("/* 2. Canonical 44px selection-control geometry.", fieldStart);
const fields = fieldStart >= 0 && fieldEnd > fieldStart ? css.slice(fieldStart, fieldEnd) : "";

test("Studio size metadata defines standard, compact, and the multiline textarea exception", () => {
  assert.match(tokens, /standard: \{ height: 44, stroke: 3, radius: 8/);
  assert.match(tokens, /compact: \{ height: 28, stroke: 2, radius: 5/);
  assert.match(tokens, /multiline: \{ minHeight: 92, standardFontSize: 18, compactFontSize: 14, fontWeight: 1000/);
  assert.match(tokens, /export type StudioControlSize = "standard" \| "compact"/);
  assert.match(catalog, /MULTILINE TEXTAREA EXCEPTION/);
  assert.match(catalog, /fontWeight/);
});

test("Text fields use one primary-colored block caret and consistent filler typography", () => {
  assert.equal((css.match(/caret-shape:\s*block/g) || []).length, 1);
  assert.match(fields, /caret-color:\s*var\(--vt-field-primary\)/);
  assert.match(fields, /font-weight: 1000/);
  assert.match(fields, /data-size="standard"[^]*?font-size: 38px/);
  assert.match(fields, /data-size="compact"[^]*?font-size: 24px/);
  assert.match(fields, /textarea[^]*?min-height: var\(--vt-studio-textarea-min-height, 92px\)/);
  assert.match(fields, /font-size: var\(--vt-studio-textarea-standard-font-size, 18px\); font-weight: var\(--vt-studio-textarea-font-weight, 1000\)/);
  assert.match(fields, /font-size: var\(--vt-studio-textarea-compact-font-size, 14px\); font-weight: var\(--vt-studio-textarea-font-weight, 1000\)/);
  assert.match(fields, /::placeholder[^]*?font: inherit/);
  assert.match(tsx, /placeholder = "TYPE HERE"/);
  assert.doesNotMatch(fields, /!important/);
});

test("Confirmed Library imports canonical Studio names and documents actual source files", () => {
  assert.match(tsx, /export const StudioSwitch = Studioswitch/);
  assert.match(tsx, /export const StudioWordToggle = Studiotoggle/);
  assert.match(catalog, /import \{ StudioSwitch, StudioChoice, StudioWordToggle \} from "\.\.\/\.\.\/studio-ui"/);
  assert.match(catalog, /src\/studio-ui\/primitives\/StudioControls\.tsx/);
  assert.match(catalog, /src\/styles\/studio-control-system\.css/);
  assert.doesNotMatch(catalog, /SubToolboxPrimitives\.tsx/);
});

test("Confirmed control layout has one four-column contract and no split word-toggle rows", () => {
  assert.equal((catalogCss.match(/^\.vt-confirmed-control-variants\s*\{/gm) || []).length, 1);
  assert.match(catalogCss, /^\.vt-confirmed-control-variants\s*\{[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/m);
  assert.doesNotMatch(catalogCss, /is-word-toggle-solid-row|is-word-toggle-other-row/);
  assert.doesNotMatch(catalogCss, /\.vt-confirmed-control-variants\s*\{[^}]*display:\s*flex\s*!important/);
});
