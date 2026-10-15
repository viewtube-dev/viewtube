import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/studio-control-system.css", "utf8");
const tsx = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");

test("Studio control sizes have one machine-readable standard/compact contract", () => {
  assert.match(tokens, /STUDIO_CONTROL_SIZE_CONTRACT/);
  assert.match(tokens, /standard: \{ height: 44, stroke: 3, radius: 6/);
  assert.match(tokens, /compact: \{ height: 28, stroke: 2, radius: 4/);
  assert.doesNotMatch(tokens, /height: \{[^}]*action:/);
  assert.match(tsx, /STUDIO_COMPONENT_SIZE_DEFAULTS = STUDIO_CONTROL_SIZE_CONTRACT/);
  assert.doesNotMatch(tsx, /sizeVariant\?: Exclude<StudioControlSize, "action">/);
});

test("Studio text fields have one global primary-colored block caret contract", () => {
  assert.equal((css.match(/caret-shape:\s*block/g) || []).length, 1);
  assert.match(css, /caret-color:\s*var\(--vt-field-primary\)/);
  assert.match(css, /data-size="standard"[^]*?font-size:\s*38px/);
  assert.match(css, /data-size="compact"[^]*?font-size:\s*24px/);
  assert.match(css, /:focus-visible[^]*?color:\s*#000/);
  assert.match(css, /:disabled[^]*?opacity:\s*\.55/);
  assert.doesNotMatch(css, /caret-shape:\s*auto|caret-shape:\s*bar/);
});

test("Studio button and split-left geometry use only standard and compact tokens", () => {
  assert.doesNotMatch(css, /data-size="action"|data-size="small"/);
  assert.match(css, /data-size="standard"[^]*?--vt-studio-control-height:\s*44px/);
  assert.match(css, /data-size="compact"[^]*?--vt-studio-control-height:\s*28px/);
  assert.match(css, /border-right:\s*var\(--vt-studio-control-stroke\) solid #000/);
  assert.match(css, /--vt-studio-control-icon-size:\s*28px/);
  assert.match(css, /--vt-studio-control-icon-size:\s*18px/);
});
