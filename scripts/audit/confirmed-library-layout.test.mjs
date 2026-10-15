import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");
const styles = readFileSync("src/components/studio-hub/studio-hub-primitive-catalogs.css", "utf8");
const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");

test("confirmed library uses the requested four skin names without changing skin values", () => {
  for (const label of ['label: "SOLID"', 'label: "COLOR SWAP"', 'label: "BLACK"', 'label: "WHITE"']) assert.ok(catalog.includes(label), label);
  assert.ok(catalog.includes('skin: "black-indicator"'));
  assert.ok(catalog.includes('skin: "white-indicator"'));
  assert.ok(!catalog.includes('label: "4 · BLACK INDICATOR"'));
  assert.ok(!catalog.includes('label: "5 · WHITE INDICATOR"'));
});

test("all four-skin control families retain a four-column row at every viewport", () => {
  assert.match(styles, /\.vt-confirmed-word-toggle-family[\s\S]*?grid-template-columns: repeat\(4, minmax\(0, 1fr\)\) !important/);
  assert.match(styles, /\.vt-confirmed-control-variants\s*\{[\s\S]*?grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(styles, /\.vt-confirmed-control-family \.vt-confirmed-control-variants\s*\{\s*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\) !important/);
  assert.match(styles, /\.vt-confirmed-control-family \.vt-confirmed-control-variants,[\s\S]*?grid-template-columns: repeat\(4, minmax\(64px, 1fr\)\) !important;[\s\S]*?overflow-x: auto/);
  assert.match(styles, /@media \(max-width: 560px\)[\s\S]*?\.vt-confirmed-word-toggle-family[\s\S]*?grid-template-columns: repeat\(4, minmax\(64px, 1fr\)\) !important/);
});

test("standard button specimens span a row and compact A/B share two columns", () => {
  assert.match(styles, /\.vt-confirmed-button-family > \.vt-confirmed-variants\s*\{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\) !important/);
  assert.match(styles, /\.vt-confirmed-button-family > \.vt-confirmed-variants > \.vt-confirmed-variant\.is-full-row\s*\{\s*grid-column: 1 \/ -1 !important/);
  assert.ok(catalog.includes('28px compact · default A'));
  assert.ok(catalog.includes('28px compact · default B'));
});

test("standalone text inputs provide standard and compact A/B specimens", () => {
  assert.ok(catalog.includes('aria-label="Studio text input 44px"'));
  assert.ok(catalog.includes('aria-label="Studio text input 28px A"'));
  assert.ok(catalog.includes('aria-label="Studio text input 28px B"'));
});

test("global defaults distinguish the measured focus shadow from the CSS outline", () => {
  assert.match(controls, /visible focus accent at 0px offset[\s\S]*?computed CSS outline itself measured 1px/);
  assert.match(catalog, /Focus measurement note:[\s\S]*?These are separate layers/);
});

test("floating labels use the reduced overlapping-label geometry and strong text stroke", () => {
  const fieldCss = readFileSync("src/styles/studio-control-system.css", "utf8");
  assert.match(fieldCss, /--vt-studio-floating-label-size:\s*24px/);
  assert.match(fieldCss, /padding:\s*2\.25px 4\.5px/);
  assert.match(fieldCss, /translateY\(-75%\) scale\(\.75\)/);
  assert.match(fieldCss, /-webkit-text-stroke:\s*\.5px currentColor/);
  assert.match(fieldCss, /data-vt-floating-variant="b"[\s\S]*?data-size="compact"/);
  assert.match(fieldCss, /data-vt-floating-variant="b".*outline:var\(--vt-field-focus-outline-width\) solid var\(--vt-field-secondary\)/s);
});

test("floating-label Compact B variant is explicit and only adds the scoped secondary focus stroke", () => {
  assert.match(controls, /variant\?:\s*"a"\s*\|\s*"b"/);
  assert.match(catalog, /label="TITLE"[^>]*variant="b"[^>]*sizeVariant="compact"/);
  const fieldCss = readFileSync("src/styles/studio-control-system.css", "utf8");
  assert.match(fieldCss, /\.vt-studio-floating-field\[data-vt-floating-variant="b"\][\s\S]*?data-size="compact"[^\n]*:is\(:focus, :focus-visible\)/);
});

test("non-default settings explain the real public props in plain language", () => {
  assert.ok(catalog.includes("The visible label is supplied through label; there is no overlayLabel prop."));
  assert.ok(catalog.includes("A focused or non-empty field lifts the label above the border."));
  assert.ok(catalog.includes("Only Compact B adds the solid secondary-color focus stroke."));
  assert.ok(!catalog.includes("overlayLabel accepts custom field context"));
});


test("button shadows stay on the stationary outer control while the face moves", () => {
  const fieldCss = readFileSync("src/styles/studio-control-system.css", "utf8");
  assert.match(fieldCss, /button\[data-vt-studio-button="true"\][^\n]*box-shadow:\s*var\(--vt-studio-control-shadow/);
  assert.match(fieldCss, /button\[data-vt-studio-button="true"\] > \[data-vt-studio-button-face\][^\n]*box-shadow:\s*none/);
  assert.match(fieldCss, /button\[data-vt-studio-button="true"\]:active:not\(:disabled\) > \[data-vt-studio-button-face\][^\n]*transform:\s*translate/);
  assert.match(fieldCss, /button\[data-vt-studio-control="true"\]\[data-vt-studio-action-button="true"\][\s\S]*?box-shadow:\s*3px 3px 0/);
  assert.match(fieldCss, /button\[data-vt-studio-control="true"\]\[data-vt-studio-action-button="true"\] > \[data-vt-studio-action-face\][\s\S]*?box-shadow:\s*none/);
});

test("split-left buttons do not clip the stationary shadow or expose a wrapper border", () => {
  const fieldCss = readFileSync("src/styles/studio-control-system.css", "utf8");
  assert.match(fieldCss, /button\[data-vt-studio-button="true"\]\[data-split-left="true"\][^\n]*overflow:\s*visible/);
  assert.match(fieldCss, /button\[data-vt-studio-button="true"\]\[data-split-left="true"\] > \[data-vt-studio-button-face\][^\n]*border:\s*var\(--vt-studio-control-stroke\) solid #000/);
  assert.match(fieldCss, /button\[data-vt-studio-button="true"\]\[data-split-left="true"\] > \[data-vt-studio-button-face\][^\n]*overflow:\s*hidden/);
  assert.match(fieldCss, /button\[data-vt-studio-button="true"\]\[data-split-left="true"\][^\n]*background:\s*transparent/);
  assert.match(fieldCss, /button\[data-vt-studio-button="true"\]\[data-split-left="true"\][^\n]*appearance:\s*none/);
});


test("single-line input typography follows the same standard/compact size split as textareas", () => {
  const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");
  const css = readFileSync("src/styles/studio-control-system.css", "utf8");
  const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
  assert.match(tokens, /textInput:\s*\{\s*standardFontSize:\s*18,\s*compactFontSize:\s*14/);
  assert.match(css, /input\[data-vt-studio-control="true"\]\[data-size="standard"\][^\n]*font-size:\s*var\(--vt-studio-text-input-standard-font-size,\s*18px\) !important/);
  assert.match(css, /input\[data-vt-studio-control="true"\]\[data-size="compact"\][^\n]*font-size:\s*var\(--vt-studio-text-input-compact-font-size,\s*14px\) !important/);
  assert.ok(controls.includes('standardInputFontSize: "18px"'));
  assert.ok(controls.includes('compactInputFontSize: "14px"'));
});

test("text field families are split into input-plus-label and textarea-plus-label modules", () => {
  const inputModule = readFileSync("src/studio-ui/primitives/StudioTextInput.tsx", "utf8");
  const areaModule = readFileSync("src/studio-ui/primitives/StudioTextArea.tsx", "utf8");
  const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
  assert.ok(inputModule.includes("export const StudioTextInput"));
  assert.ok(inputModule.includes("export const StudioLabeledInput"));
  assert.ok(areaModule.includes("export const StudioTextArea"));
  assert.ok(areaModule.includes("export const StudioLabeledTextArea"));
  assert.ok(controls.includes('from "./StudioTextInput"'));
  assert.ok(controls.includes('from "./StudioTextArea"'));
});

test("word toggle library has three skins, one standard toggle per row, and centered compact toggles", () => {
  assert.match(catalog, /const WORD_TOGGLE_SKINS = CANONICAL_SKINS\.slice\(0, 3\)/);
  assert.match(catalog, /Array\(6\)\.fill\(false\)/);
  assert.match(styles, /\.vt-confirmed-word-toggle-family \.vt-confirmed-control-row\[data-control-size="44"\][\s\S]*?grid-template-columns:\s*minmax\(0,1fr\)/);
  assert.match(styles, /\.vt-confirmed-word-toggle-family \.vt-confirmed-control-row\[data-control-size="28"\][\s\S]*?justify-items:\s*center/);
  assert.match(styles, /\.vt-confirmed-word-toggle-family \.vt-confirmed-control-row\[data-control-size="28"\][\s\S]*?justify-self:\s*center/);
  assert.ok(!catalog.includes('label: "WHITE" },]\nconst WORD_TOGGLE_SKINS = CANONICAL_SKINS'));
});

test("compact Studio button shadow is a symmetric face-sized stationary offset", () => {
  const css = readFileSync("src/styles/studio-control-system.css", "utf8");
  const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");
  assert.match(css, /button\[data-vt-studio-button="true"\]::before\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0[^}]*transform:\s*translate\(var\(--vt-studio-control-shadow-x/);
  assert.match(css, /button\[data-vt-studio-button="true"\]\[data-size="compact"\][^\n]*--vt-studio-control-shadow-x:\s*1px;[^\n]*--vt-studio-control-shadow-y:\s*1px/);
  assert.match(css, /button\[data-vt-studio-button="true"\] > \[data-vt-studio-button-face\][^}]*position:\s*relative/);
  assert.match(tokens, /compact: \{[^}]*buttonShadowX: 1, buttonShadowY: 1/);
});

test("global defaults use a compact collapsed panel with an explicit expand affordance", () => {
  assert.ok(catalog.includes('className="vt-confirmed-defaults-details"'));
  assert.ok(catalog.includes("Show full defaults and exceptions"));
  assert.match(styles, /\.vt-confirmed-defaults-details\s*\{[^}]*max-height|\.vt-confirmed-defaults-details\s*\{/);
});
