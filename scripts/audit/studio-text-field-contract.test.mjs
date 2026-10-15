import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/studio-control-system.css", "utf8");
const tsx = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");
const dropdownTsx = readFileSync("src/studio-ui/primitives/StudioDropdown.tsx", "utf8");
const catalogCss = readFileSync("src/components/studio-hub/studio-hub-primitive-catalogs.css", "utf8");

const fieldStart = css.indexOf("/* 1. Canonical field family.");
const fieldEnd = css.indexOf("/* 2. Canonical 44px selection-control geometry.", fieldStart);
const fields = fieldStart >= 0 && fieldEnd > fieldStart ? css.slice(fieldStart, fieldEnd) : "";

test("Studio control sizes have one machine-readable standard/compact contract", () => {
  assert.match(tokens, /STUDIO_CONTROL_SIZE_CONTRACT/);
  assert.match(tokens, /standard: \{ height: 44, stroke: 3, radius: 8/);
  assert.match(tokens, /compact: \{ height: 28, stroke: 2, radius: 5/);
  assert.doesNotMatch(tokens, /height: \{[^}]*action:/);
  assert.match(tsx, /STUDIO_COMPONENT_SIZE_DEFAULTS = STUDIO_CONTROL_SIZE_CONTRACT/);
  assert.doesNotMatch(tsx, /sizeVariant\?: Exclude<StudioControlSize, "action">/);
});

test("Studio fields share a primary-colored block caret and canonical state rules", () => {
  assert.ok(fields.length > 0, "canonical field section exists");
  assert.equal((css.match(/caret-shape:\s*block/g) || []).length, 1);
  assert.match(fields, /caret-color:\s*var\(--vt-field-primary\)/);
  assert.match(fields, /data-size="standard"[^]*?font-size: 38px/);
  assert.match(fields, /data-size="compact"[^]*?font-size: 24px/);
  assert.match(fields, /:focus-visible[^]*?color: #000/);
  assert.match(fields, /:disabled[^]*?opacity: \.55/);
  assert.match(fields, /\[readonly\]/);
  assert.match(fields, /::placeholder/);
  assert.match(fields, /textarea[^]*?min-height: 92px/);
});

test("Studio button and split-left geometry use only standard and compact tokens", () => {
  assert.doesNotMatch(css, /data-size="action"|data-size="small"/);
  assert.match(css, /data-size="standard"[^]*?--vt-studio-control-height:44px/);
  assert.match(css, /data-size="compact"[^]*?--vt-studio-control-height:28px/);
  assert.match(css, /border-right:\s*var\(--vt-studio-control-stroke\) solid #000/);
  assert.match(css, /--vt-studio-control-icon-size:28px/);
  assert.match(css, /--vt-studio-control-icon-size:18px/);
});

test("dropdown menus attach to triggers and inherit the 44px/28px typography", () => {
  assert.match(css, /\.vt-studio-dropdown-menu\s*\{[\s\S]*?top:\s*100%\s*!important/);
  assert.match(css, /\.vt-studio-dropdown-option\s*\{[\s\S]*?font-size:\s*var\(--vt-dropdown-font-size, 38px\)\s*!important/);
  assert.match(dropdownTsx, /sizeVariant\?:\s*"standard"\s*\|\s*"compact"/);
  assert.match(dropdownTsx, /data-open=\{open \? "true" : "false"\}/);
});

test("Confirmed Library control skins stay in a four-column variant grid", () => {
  assert.match(catalogCss, /\.vt-confirmed-control-variants,[\s\S]*?grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)\s*!important/);
});
