import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("Studio size tokens keep the five canonical tiers and shared focus ratio", async () => {
  const tokens = await read("../../src/studio-ui/tokens.ts");
  assert.match(tokens, /focusOutlineWidthRatio:\s*0\.65/);
  assert.match(tokens, /supreme: \{ height: 60, stroke: 3, radius: 6, fontSize: 52/);
  assert.match(tokens, /standard: \{ height: 44, stroke: 3, radius: 6, fontSize: 38/);
  assert.match(tokens, /compact: \{ height: 28, stroke: 2, radius: 4, fontSize: 24/);
  assert.match(tokens, /mini: \{ height: 20, stroke: 1\.5, radius: 3, fontSize: 17\.5/);
  assert.match(tokens, /micro: \{ height: 12, stroke: 1\.5, radius: 3, fontSize: 10/);
  assert.doesNotMatch(tokens, /fontSize: 51\.82/);
  assert.match(tokens, /focusOutlineWidth: 3 \* STUDIO_GLOBAL_DEFAULTS\.focusOutlineWidthRatio/);
  assert.match(tokens, /focusOutlineWidth: 2 \* STUDIO_GLOBAL_DEFAULTS\.focusOutlineWidthRatio/);
  assert.match(tokens, /focusOutlineWidth: 1\.5 \* STUDIO_GLOBAL_DEFAULTS\.focusOutlineWidthRatio/);
});

test("Studio CSS emitter derives focus widths instead of parsing per-tier duplicates", async () => {
  const emitter = await read("../../scripts/emit-studio-control-vars.mjs");
  assert.match(emitter, /const focusWidthRatio = Number\(tokenSource\.match/);
  assert.match(emitter, /values\.stroke \* focusWidthRatio/);
  assert.doesNotMatch(emitter, /"focusOutlineWidth", "secondaryFocusOutlineWidth"/);
});

test("generated Studio variables reflect supreme and micro geometry", async () => {
  const css = await read("../../src/styles/studio-control-vars.generated.css");
  assert.match(css, /--vt-studio-supreme-font-size: 52px/);
  assert.match(css, /--vt-studio-supreme-icon-size: 52px/);
  assert.match(css, /--vt-studio-micro-stroke: 1\.5px/);
  assert.match(css, /--vt-studio-micro-radius: 3px/);
  assert.match(css, /--vt-studio-micro-focus-outline-width: 0\.975px/);
});
