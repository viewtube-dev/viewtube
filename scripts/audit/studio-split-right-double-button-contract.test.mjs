import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/studio-control-system.css", "utf8");
const start = css.indexOf("/* Right and double split buttons deliberately mirror the split-left foundation:");
const end = css.indexOf("/* Also ensure split-left face uses display:contents", start);
assert.ok(start >= 0 && end > start, "canonical right/double split button contract must exist");
const block = css.slice(start, end);

for (const selector of [
  'button[data-vt-studio-button="true"][data-vt-studio-split="right"] > [data-vt-studio-button-face]',
  'button[data-vt-studio-button="true"][data-vt-studio-split="double"] > [data-vt-studio-button-face]',
]) assert.ok(block.includes(selector), `missing outer face geometry: ${selector}`);

assert.match(block, /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+var\(--vt-studio-control-height\)/,
  "right split must reserve one fixed-height trailing rail");
assert.match(block, /grid-template-columns:\s*var\(--vt-studio-control-height\)\s+minmax\(0,\s*1fr\)\s+var\(--vt-studio-control-height\)/,
  "double split must reserve fixed-height rails on both sides");
assert.match(block, /gap:\s*0;/, "split sections must remain flush");
assert.match(block, /border-left:\s*var\(--vt-studio-control-stroke\)\s+solid\s+#000;/,
  "right/end rail must have exactly one leading divider");
assert.match(block, /border-right:\s*var\(--vt-studio-control-stroke\)\s+solid\s+#000;/,
  "double split start rail must have exactly one trailing divider");
assert.match(block, /text-overflow:\s*clip;/, "split labels must clip rather than ellipsize");
console.log("Studio split-right/double-split geometry contract passed");
