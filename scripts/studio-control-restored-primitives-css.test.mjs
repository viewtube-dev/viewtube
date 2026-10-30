import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

test("restored Studio primitive declarations use real CSS line breaks", async () => {
  const css = await fs.readFile(
    new URL("../src/styles/studio-control-restored-primitives.css", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(
    css,
    /\\n\s*--vt-studio-control-font-size/,
    "the vertical word toggle declarations must not contain a literal escaped newline",
  );
  assert.match(
    css,
    /--vt-vwt-face:[^;]+;\s*\n\s*--vt-studio-control-font-size:/,
    "the font-size custom property must be a separate declaration",
  );
});
