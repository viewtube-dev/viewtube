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
