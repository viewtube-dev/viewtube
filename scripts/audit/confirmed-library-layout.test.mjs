import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

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

test("standard button specimens span a row and compact default/neutral variants share two columns", () => {
  assert.match(styles, /\.vt-confirmed-button-family > \.vt-confirmed-variants\s*\{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\) !important/);
  assert.match(styles, /\.vt-confirmed-button-family > \.vt-confirmed-variants > \.vt-confirmed-variant\.is-full-row\s*\{\s*grid-column: 1 \/ -1 !important/);
  assert.ok(catalog.includes('28px compact · default'));
  assert.ok(catalog.includes('28px compact · neutral tone'));
});

test("standalone text inputs provide standard, compact, and disabled specimens", () => {
  assert.ok(catalog.includes('aria-label="Studio text input 44px"'));
  assert.ok(catalog.includes('aria-label="Studio text input 28px A"'));
  assert.ok(catalog.includes('aria-label="Studio text input 28px disabled"'));
  assert.match(catalog, /28px compact · disabled[\s\S]*?sizeVariant="compact"[^>]*disabled/);
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
  assert.match(fieldCss, /\.vt-studio-floating-field\[data-vt-floating-variant="b"\]\s*>\s*:is\(input, textarea\)\[data-size="compact"\]:is\(:focus, :focus-visible\)\s*\{\s*outline:\s*var\(--vt-studio-control-focus-outline-width,\s*2px\)\s+solid\s+var\(--vt-studio-control-secondary/s);
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
  assert.ok(catalog.includes("Floating label A is the default pair-A treatment; compact floating label B reverses the paired colors and adds a zero-offset 2px secondary-color focus stroke."));
  assert.ok(catalog.includes("Floating labels lift when the field is focused or non-empty; the label remains associated with the native input for accessible naming."));
  assert.ok(catalog.includes("Floating label A is the default pair-A treatment; compact floating label B reverses the paired colors and adds a zero-offset 2px secondary-color focus stroke."));
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
  assert.match(css, /--vt-studio-text-input-standard-font-size:\s*var\(--vt-studio-44-font-size,\s*38px\);\s*--vt-studio-text-input-compact-font-size:\s*var\(--vt-studio-28-font-size,\s*24px\)/);
  assert.match(tokens, /multiline:\s*\{\s*minHeight:\s*92,\s*standardFontSize:\s*18,\s*compactFontSize:\s*14/);
  assert.match(css, /input\[data-vt-studio-control="true"\]\[data-size="standard"\]:not\(\[type="checkbox"\]\):not\(\[type="radio"\]\):not\(\[type="range"\]\)\s*\{\s*font-size:\s*var\(--vt-studio-text-input-standard-font-size,\s*38px\) !important/);
  assert.match(css, /input\[data-vt-studio-control="true"\]\[data-size="compact"\]:not\(\[type="checkbox"\]\):not\(\[type="radio"\]\):not\(\[type="range"\]\)\s*\{\s*font-size:\s*var\(--vt-studio-text-input-compact-font-size,\s*24px\) !important/);
  assert.match(css, /textarea\[data-vt-studio-control="true"\]\[data-vt-studio-field-kind="textarea"\]\s*\{[\s\S]*?font-size:\s*var\(--vt-studio-textarea-standard-font-size,\s*18px\) !important/);
  assert.match(css, /textarea\[data-vt-studio-control="true"\]\[data-vt-studio-field-kind="textarea"\]\[data-size="compact"\]\s*\{[\s\S]*?font-size:\s*var\(--vt-studio-textarea-compact-font-size,\s*14px\) !important/);
  assert.ok(controls.includes('standardInputFontSize: "38px"'));
  assert.ok(controls.includes('compactInputFontSize: "24px"'));
  assert.ok(inputModule.includes("StudioTextInput"));
  assert.ok(areaModule.includes("StudioTextArea"));
  assert.ok(catalog.includes("Studio Text Input · Simple + Floating + Fixed Label"));
  assert.ok(catalog.includes("Single-line input typography is 38px standard / 24px compact"));
  assert.match(catalog, /Studio Text Area · Simple \+ Floating \+ Fixed Label[\s\S]*?Text areas keep a 92px minimum writing surface[\s\S]*?Standard text uses 18px and compact text uses 14px/);
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


test("removed standalone labeled components have no remaining source references", () => {
  const legacyNames = ["StudioLabeledInput", "StudioLabeledTextArea"];
  const sourceFiles = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory)) {
      const path = join(directory, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(tsx?|jsx?)$/.test(path) && !/\.(test|spec)\.[cm]?[jt]sx?$/.test(path)) sourceFiles.push(path);
    }
  };
  walk("src");
  for (const path of sourceFiles) {
    const source = readFileSync(path, "utf8");
    for (const legacyName of legacyNames) {
      assert.ok(!source.includes(legacyName), `${legacyName} remains in ${path}`);
    }
  }
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

test("compact Studio button shadow and typography tokens match the effective control CSS", () => {
  const css = readFileSync("src/styles/studio-control-system.css", "utf8");
  const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");
  assert.match(css, /button\[data-vt-studio-button="true"\]::before\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0[^}]*transform:\s*translate\(var\(--vt-studio-control-shadow-x/);
  assert.match(css, /button\[data-vt-studio-button="true"\]\[data-size="compact"\]\s*\{[^}]*--vt-studio-control-shadow-x:\s*1\.5px;[^}]*--vt-studio-control-shadow-y:\s*1\.5px/);
  assert.doesNotMatch(css, /button\[data-vt-studio-button="true"\]\[data-size="compact"\]\s*\{[^}]*--vt-studio-control-shadow-x:\s*1px;[^}]*--vt-studio-control-shadow-y:\s*1px/);
  assert.match(css, /button\[data-vt-studio-button="true"\] > \[data-vt-studio-button-face\][^}]*position:\s*relative/);
  assert.match(tokens, /compact: \{[^}]*letterSpacing:\s*-0\.02, lineHeight:\s*0\.86[^}]*buttonShadowX:\s*1\.5, buttonShadowY:\s*1\.5/);
  assert.match(tokens, /standard: \{[^}]*letterSpacing:\s*-0\.02/);
  assert.match(tokens, /textInput: \{[^}]*letterSpacing:\s*-0\.02/);
  assert.match(css, /--vt-studio-motion-button:\s*180ms;\s*--vt-studio-motion-press:\s*80ms/);
  assert.match(tokens, /standard: \{[^}]*hoverTransitionMs: 180[^}]*clickTransitionMs: 80/);
  assert.match(tokens, /compact: \{[^}]*hoverTransitionMs: 180[^}]*clickTransitionMs: 80/);
  assert.doesNotMatch(css, /var\(--vt-studio-motion-button,\s*150ms\)|var\(--vt-studio-motion-press,\s*300ms\)/);
});

test("confirmed library describes the actual default icon preset and component-specific geometry", () => {
  const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
  const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");
  const css = readFileSync("src/styles/studio-control-system.css", "utf8");
  assert.match(controls, /iconSizeVariant = "large"/);
  assert.match(controls, /default large icon preset is 38px \/ 1\.9 stroke standard and 24px \/ 2\.0 stroke compact/);
  assert.match(css, /Icon buttons default to the large production preset: 38px\/1\.9 standard and 24px\/2 compact/);
  assert.match(catalog, /1\.5px compact button shadow/);
  assert.match(catalog, /Icon metrics:<\/b> button-family icons default to the large production preset/);
  assert.match(catalog, /44px switch\/choice rectangular corners and the standard word-toggle use reference-specific 7\.333px radii/);
  assert.match(tokens, /standard: \{[^}]*letterSpacing:\s*-0\.02/);
  assert.match(tokens, /compact: \{[^}]*letterSpacing:\s*-0\.02/);
});

test("catalog labels dropdown and action specimens according to their actual initial state and CSS", () => {
  assert.ok(catalog.includes("44px standard · selected values · multiselect trigger"));
  assert.ok(catalog.includes("28px compact A · closed trigger and count"));
  assert.ok(catalog.includes("28px compact B · closed trigger and count"));
  assert.ok(!catalog.includes("open menu · multiselect"));
  assert.match(catalog, /56px with a 3px border, 6px radius, and 3px offset shadow[\s\S]*?hover translates the outer action by 1\.5px[\s\S]*?active translates it by 3px while suppressing the shadow/);
});

test("word-toggle settings distinguish displayed words from the boolean value", () => {
  assert.ok(catalog.includes("The first word is selected when the value is false; selecting the second word changes the value to true."));
  assert.ok(catalog.includes("Custom words change the displayed labels, not the boolean state contract."));
});

test("icon-effect examples are clearly static previews, not live outcome claims", () => {
  const squareStart = catalog.indexOf('<Family title="Square Icon Button · 44px + 28px"');
  const splitStart = catalog.indexOf('<Family title="Split-left"', squareStart);
  const squareFamily = catalog.slice(squareStart, splitStart);
  assert.ok(squareFamily.includes("NOTIFICATION BADGE · STATIC PREVIEW"));
  assert.ok(squareFamily.includes("SUCCESS STATE · STATIC PREVIEW"));
  assert.ok(squareFamily.includes("notification accepts a real count/status; success must only be set after the operation succeeds."));
  assert.ok(!squareFamily.includes("SUCCESS · CONFIRMED OUTCOME"));
});

test("global defaults use a compact collapsed panel with an explicit expand affordance", () => {
  assert.ok(catalog.includes('className="vt-confirmed-defaults-details"'));
  assert.ok(catalog.includes("Show full defaults and exceptions"));
  assert.match(styles, /\.vt-confirmed-defaults-details\s*\{/);
});


test("confirmed Square Icon Button family catalogs every interaction effect at standard and compact sizes", () => {
  const squareStart = catalog.indexOf('<Family title="Square Icon Button · 44px + 28px"');
  const splitStart = catalog.indexOf('<Family title="Split-left"', squareStart);
  assert.ok(squareStart >= 0, "confirmed Square Icon Button family exists");
  assert.ok(splitStart > squareStart, "Square Icon Button family has a bounded catalog section");
  const squareFamily = catalog.slice(squareStart, splitStart);
  for (const effect of ['animate sizeVariant="standard"', 'animate sizeVariant="compact"', 'effect="notification"', 'effect="rotated-toggle"', 'effect="flip"', 'effect="tooltip"', 'effect="morph"', 'effect="success"']) {
    assert.ok(squareFamily.includes(effect), `confirmed Square Icon Button family includes ${effect}`);
  }
  assert.match(squareFamily, /44px standard · V1 primary fill/);
  assert.match(squareFamily, /28px compact · V4/);
  assert.match(squareFamily, /StudioSquareIconButton · v1\/v2\/v3\/v4 \+ seven effects/);
  assert.match(styles, /\.vt-confirmed-square-effect-grid\s*\{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 520px\)\s*\{[\s\S]*?\.vt-confirmed-square-effect-grid\s*\{\s*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(controls, /squareIconButtonDefaults:[\s\S]*?rotatedToggle:[\s\S]*?flip:[\s\S]*?tooltip:[\s\S]*?morph:[\s\S]*?success:/);
});


test("confirmed square icon button variants 1–4 are grouped into one standard row and one compact row", () => {
  assert.match(catalog, /vt-confirmed-square-variant-row[^]*?44px standard · variants 1–4[^]*?variant="v1" sizeVariant="standard"[^]*?variant="v4" sizeVariant="standard"/);
  assert.match(catalog, /vt-confirmed-square-variant-row[^]*?28px compact · variants 1–4[^]*?variant="v1" sizeVariant="compact"[^]*?variant="v4" sizeVariant="compact"/);
  assert.match(styles, /\.vt-confirmed-square-variant-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, max-content\)\)/);
});

test("square icon interaction effect specimens preserve two effect cards per row", () => {
  assert.match(styles, /\.vt-confirmed-square-effect-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media\s*\(max-width:\s*520px\)[\s\S]*?\.vt-confirmed-square-effect-grid\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
});

test("confirmed stepper standard and compact specimens share one comparison row", () => {
  assert.match(catalog, /vt-confirmed-stepper-row[^]*?44px standard · interactive[^]*?size="standard"[^]*?28px compact · interactive[^]*?size="compact"/);
  assert.match(styles, /\.vt-confirmed-stepper-row-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
});

test("confirmed spectrum tag gallery shows 20 production tag specimens across the alphabetic spectrum", () => {
  assert.match(catalog, /vt-confirmed-spectrum-tag-grid[^]*?StudioSpectrumTag label="APPLE"[^]*?StudioSpectrumTag label="YUZU"/);
  const tagGrid = catalog.match(/className="vt-confirmed-spectrum-tag-grid"[^]*?<\/div>/)?.[0] ?? "";
  assert.equal((tagGrid.match(/<StudioSpectrumTag\s/g) ?? []).length, 20, "expected 20 canonical StudioSpectrumTag specimens");
  assert.match(styles, /\.vt-confirmed-spectrum-tag-grid\s*\{[^}]*grid-template-columns:\s*repeat\(5, minmax\(0, max-content\)\)/);
});


test("confirmed library includes circle, play-pause, and username composites", () => {
  assert.match(catalog, /StudioCircleIconButton/);
  assert.match(catalog, /StudioPlayPauseButton/);
  assert.match(catalog, /StudioUsernameInput/);
  assert.match(catalog, /Circle icon · standard V1–V4/);
  assert.match(catalog, /Circle icon · compact V1–V4/);
  assert.match(catalog, /Play \/ pause · both sizes/);
  assert.match(catalog, /Username · both sizes/);
  assert.match(catalog, /from "lucide-react"/);
});

test("settings and TSX/CSS/import provenance are collapsed by default", () => {
  assert.match(catalog, /<details className="vt-confirmed-source-details">\s*<summary>Settings \+ source<\/summary>/);
  assert.match(catalog, /NON-DEFAULT SETTINGS/);
  assert.match(catalog, /TSX: <code>/);
  assert.match(catalog, /CSS: <code>/);
  assert.match(catalog, /Imports:/);
  assert.match(styles, /\.vt-confirmed-source-details\s*\{/);
});

test("confirmed component labels remain one line and visually capped at 40 characters", () => {
  assert.match(styles, /\.vt-confirmed-variant > span\s*\{[^}]*max-width:\s*40ch[^}]*white-space:\s*nowrap[^}]*text-overflow:\s*ellipsis/s);
  assert.match(styles, /\.vt-confirmed-family > h3\s*\{[^}]*max-width:\s*40ch[^}]*white-space:\s*nowrap/s);
});

test("all confirmed-library textareas use full-width rows", () => {
  assert.match(styles, /\.vt-confirmed-variant:has\(textarea\)[\s\S]*?grid-column:\s*1 \/ -1/);
  assert.match(styles, /\.vt-confirmed-catalog textarea,[\s\S]*?width:\s*100% !important/);
});

test("circle and username specimens use canonical production exports", () => {
  const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
  assert.match(controls, /export const StudioCircleIconButton/);
  assert.match(controls, /export const StudioPlayPauseButton/);
  assert.match(controls, /export const StudioUsernameInput/);
  assert.match(catalog, /data-vt-library-component="StudioCircleIconButton"/);
  assert.match(catalog, /data-vt-library-component="StudioPlayPauseButton"/);
  assert.match(catalog, /data-vt-library-component="StudioUsernameInput"/);
});


test("composite primitives are exported from the canonical public entry point", () => {
  const publicIndex = readFileSync("src/studio-ui/index.ts", "utf8");
  for (const name of ["StudioCircleIconButton", "StudioPlayPauseButton", "StudioUsernameInput", "StudioCircleIconButtonProps", "StudioPlayPauseButtonProps", "StudioUsernameInputProps"]) {
    assert.ok(publicIndex.includes(name), `public Studio entry point exports ${name}`);
  }
});


test("20 spectrum samples cover every canonical palette stop", () => {
  const tagGrid = catalog.match(/className="vt-confirmed-spectrum-tag-grid"[^]*?<\/div>/)?.[0] ?? "";
  const labels = [...tagGrid.matchAll(/<StudioSpectrumTag label="([A-Z]+)"/g)].map(match => match[1]);
  assert.equal(labels.length, 20);
  const initials = new Set(labels.map(label => label[0]));
  for (const initial of ["A", "C", "E", "G", "I", "L", "N", "P", "S", "U", "W", "Y"]) {
    assert.ok(initials.has(initial), `spectrum gallery includes color-stop sample ${initial}`);
  }
});
