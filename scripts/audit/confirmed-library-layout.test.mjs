import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");
const styles = readFileSync("src/components/studio-hub/studio-hub-primitive-catalogs.css", "utf8");
const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const completeCatalog = readFileSync("src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx", "utf8");

test("confirmed library uses the requested four skin names without changing skin values", () => {
  for (const label of ['label: "SOLID"', 'label: "COLOR SWAP"', 'label: "BLACK"', 'label: "WHITE"']) assert.ok(catalog.includes(label), label);
  assert.ok(catalog.includes('skin: "black-indicator"'));
  assert.ok(catalog.includes('skin: "white-indicator"'));
  assert.ok(!catalog.includes('label: "4 · BLACK INDICATOR"'));
  assert.ok(!catalog.includes('label: "5 · WHITE INDICATOR"'));
});

test("switch and choice skin families retain four-column rows at every viewport", () => {
  assert.match(styles, /\.vt-confirmed-control-variants\s*\{[\s\S]*?grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(styles, /\.vt-confirmed-control-family \.vt-confirmed-control-variants\s*\{\s*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\) !important/);
  assert.match(styles, /\.vt-confirmed-control-family \.vt-confirmed-control-variants,[\s\S]*?grid-template-columns: repeat\(4, minmax\(64px, 1fr\)\) !important;[\s\S]*?overflow-x: auto/);
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
  const inputModule = readFileSync("src/studio-ui/primitives/StudioTextInput.tsx", "utf8");
  assert.match(inputModule, /floatingLabelVariant\?:\s*"a"\s*\|\s*"b"/);
  assert.match(catalog, /variant="floating-label"[^>]*floatingLabelVariant="b"[^>]*label="TITLE"[^>]*sizeVariant="compact"/);
  const fieldCss = readFileSync("src/styles/studio-control-system.css", "utf8");
  assert.match(fieldCss, /\.vt-studio-floating-field\[data-vt-floating-variant="b"\][\s\S]*?data-size="compact"[^\n]*:is\(:focus, :focus-visible\)/);
});

test("non-default settings explain the real public props in plain language", () => {
  assert.ok(catalog.includes('variant="floating-label"'));
  assert.ok(catalog.includes("Floating-label variants accept label and optional l0/l1/l2 level"));
  assert.ok(catalog.includes("A focused or non-empty field lifts the label above the border."));
  assert.ok(catalog.includes("Only Compact B adds the solid secondary-color focus stroke."));
  assert.ok(!catalog.includes("overlayLabel accepts custom field context"));
});


test("button shadows stay on the stationary outer control while the face moves", () => {
  const fieldCss = readFileSync("src/styles/studio-control-system.css", "utf8");
  assert.match(fieldCss, /button\[data-vt-studio-button="true"\]::before\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0[^}]*transform:\s*translate\(var\(--vt-studio-control-shadow-x/);
  assert.match(fieldCss, /button\[data-vt-studio-button="true"\] > \[data-vt-studio-button-face\][^}]*box-shadow:\s*none/);
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


test("single-line inputs use global 38px/24px typography while textareas alone use 18px/14px", () => {
  const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");
  const css = readFileSync("src/styles/studio-control-system.css", "utf8");
  const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
  const inputModule = readFileSync("src/studio-ui/primitives/StudioTextInput.tsx", "utf8");
  const areaModule = readFileSync("src/studio-ui/primitives/StudioTextArea.tsx", "utf8");
  const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");
  assert.match(tokens, /standard:\s*\{[^}]*fontSize:\s*38/);
  assert.match(tokens, /compact:\s*\{[^}]*fontSize:\s*24/);
  assert.match(tokens, /textInput:\s*\{\s*standardFontSize:\s*38,\s*compactFontSize:\s*24/);
  assert.match(tokens, /multiline:\s*\{\s*minHeight:\s*92,\s*standardFontSize:\s*18,\s*compactFontSize:\s*14/);
  assert.match(css, /input\[data-vt-studio-control="true"\]\[data-size="standard"\][\s\S]*?font-size:\s*var\(--vt-studio-44-font-size,\s*38px\) !important/);
  assert.match(css, /input\[data-vt-studio-control="true"\]\[data-size="compact"\][\s\S]*?font-size:\s*var\(--vt-studio-28-font-size,\s*24px\) !important/);
  assert.match(css, /textarea\[data-vt-studio-control="true"\]\[data-vt-studio-field-kind="textarea"\]\s*\{[\s\S]*?font-size:\s*var\(--vt-studio-textarea-standard-font-size,\s*18px\) !important/);
  assert.match(css, /textarea\[data-vt-studio-control="true"\]\[data-vt-studio-field-kind="textarea"\]\[data-size="compact"\]\s*\{[\s\S]*?font-size:\s*var\(--vt-studio-textarea-compact-font-size,\s*14px\) !important/);
  assert.ok(controls.includes('standardInputFontSize: "38px"'));
  assert.ok(controls.includes('compactInputFontSize: "24px"'));
  assert.ok(inputModule.includes("StudioTextInput"));
  assert.ok(areaModule.includes("StudioTextArea"));
  assert.match(catalog, /Studio Text Input · Standalone" nonDefaultSettings=\{\["[^"]*44px standard size[^"]*"[^"]*"[^"]*38px standard and 24px compact/);
  assert.match(catalog, /Text areas are the documented exception: 92px minimum surface, 18px standard or 14px compact text/);
  assert.doesNotMatch(catalog, /Text is 18px standard and 14px compact, matching the labeled-input and textarea families/);
});

test("floating-label presentations are variants inside the canonical input and textarea families", () => {
  const inputModule = readFileSync("src/studio-ui/primitives/StudioTextInput.tsx", "utf8");
  const areaModule = readFileSync("src/studio-ui/primitives/StudioTextArea.tsx", "utf8");
  const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
  assert.ok(inputModule.includes("export const StudioTextInput"));
  assert.ok(inputModule.includes('variant: "floating-label"'));
  assert.ok(!inputModule.includes("export const StudioLabeledInput"));
  assert.ok(areaModule.includes("export const StudioTextArea"));
  assert.ok(areaModule.includes('variant: "floating-label"'));
  assert.ok(!areaModule.includes("export const StudioLabeledTextArea"));
  assert.ok(controls.includes('from "./StudioTextInput"'));
  assert.ok(controls.includes('from "./StudioTextArea"'));
  assert.ok(!controls.includes("StudioLabeledInput"));
  assert.ok(!controls.includes("StudioLabeledTextArea"));
  const publicIndex = readFileSync("src/studio-ui/index.ts", "utf8");
  assert.ok(!publicIndex.includes("StudioLabeledInput"));
  assert.ok(!publicIndex.includes("StudioLabeledTextArea"));
  assert.ok(catalog.includes('<StudioTextInput variant="floating-label"'));
  assert.ok(catalog.includes('<StudioTextArea variant="floating-label"'));
  assert.ok(completeCatalog.includes('<StudioTextInput variant="floating-label"'));
  assert.ok(completeCatalog.includes('<StudioTextArea variant="floating-label"'));
});

test("word toggle library has three skins, one standard toggle per row, and centered compact toggles", () => {
  const fieldCss = readFileSync("src/styles/studio-control-system.css", "utf8");
  assert.match(catalog, /const WORD_TOGGLE_SKINS = CANONICAL_SKINS\.slice\(0, 3\)/);
  assert.match(catalog, /Array\(6\)\.fill\(false\)/);
  assert.match(styles, /\.vt-confirmed-word-toggle-family \.vt-confirmed-control-variants\[data-control-size="44"\][\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) !important/);
  assert.match(styles, /\.vt-confirmed-word-toggle-family \.vt-confirmed-control-variants\[data-control-size="28"\][\s\S]*?justify-items:\s*center/);
  assert.match(styles, /\.vt-confirmed-word-toggle-family \.vt-confirmed-control-variants\[data-control-size="28"\][\s\S]*?justify-self:\s*center !important/);
  assert.match(completeCatalog, /CONTROL_SKINS\.slice\(0, 3\)/);
  assert.match(completeCatalog, /Array\(6\)\.fill\(false\)/);
  assert.match(fieldCss, /\.vt-complete-catalog \.vt-catalog-word-toggle-families \.vt-catalog-control-variants\.is-word-toggle-44\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) !important/);
  assert.match(fieldCss, /\.vt-complete-catalog \.vt-catalog-word-toggle-families \.vt-catalog-control-variants\.is-word-toggle-28\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\) !important/);
  assert.match(fieldCss, /\.vt-complete-catalog \.vt-catalog-word-toggle-families \.vt-catalog-control-variant > small\s*\{[\s\S]*?text-align:\s*center/);
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
  assert.match(styles, /\.vt-confirmed-defaults-details\s*\{/);
});
