import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");
const emitter = readFileSync("scripts/emit-studio-control-vars.mjs", "utf8");
const generated = readFileSync("src/styles/studio-control-vars.generated.css", "utf8");
const css = readFileSync("src/styles/studio-control-system.css", "utf8");

test("dropdown menu opening motion is defined once in the canonical token contract", () => {
  const block = tokens.match(/export const STUDIO_DROPDOWN_MENU_TOKENS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
  assert.match(block, /menuOpenDurationMs:\s*160/);
  assert.match(block, /menuOpenEasing:\s*"cubic-bezier\(\.2,\.75,\.2,1\)"/);
  assert.match(block, /menuOpenTranslateY:\s*5/);
  assert.match(block, /menuOpenScaleY:\s*0\.98/);
});

test("the canonical token emitter publishes the shared menu motion variables", () => {
  assert.match(emitter, /menuOpenDurationMs/);
  assert.match(emitter, /menuOpenEasing/);
  assert.match(emitter, /menuOpenTranslateY/);
  assert.match(emitter, /menuOpenScaleY/);
  assert.match(generated, /--vt-studio-dropdown-menu-open-duration:\s*160ms/);
  assert.match(generated, /--vt-studio-dropdown-menu-open-easing:\s*cubic-bezier\(\.2,\.75,\.2,1\)/);
  assert.match(generated, /--vt-studio-dropdown-menu-open-translate-y:\s*5px/);
  assert.match(generated, /--vt-studio-dropdown-menu-open-scale-y:\s*0\.98/);
});

test("regular and multi-select dropdown menus use the same opening animation", () => {
  assert.match(css, /\.vt-studio-dropdown-menu\s*\{[^}]*animation:\s*vt-studio-dropdown-menu-open var\(--vt-studio-dropdown-menu-open-duration,\s*160ms\) var\(--vt-studio-dropdown-menu-open-easing,[^)]*\) both/s);
  assert.match(css, /\.vt-studio-legend-menu\s*\{[^}]*animation:\s*vt-studio-dropdown-menu-open var\(--vt-studio-dropdown-menu-open-duration,\s*160ms\) var\(--vt-studio-dropdown-menu-open-easing,[^)]*\) both/s);
  assert.match(css, /\\.vt-studio-dropdown-menu\\s*\\{[^}]*animation:\\s*vt-studio-dropdown-menu-open var\\(--vt-studio-dropdown-menu-open-duration,/s);
  assert.match(css, /\\.vt-studio-legend-menu\\s*\\{[^}]*animation:\\s*vt-studio-dropdown-menu-open var\\(--vt-studio-dropdown-menu-open-duration,/s);
  assert.match(css, /@keyframes vt-studio-dropdown-menu-open/);
});

test("all dropdown menu variants honor reduced motion", () => {
  const reducedMotion = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?(?=\n\/\*|\n\s*[^\s@][^\n]*\{|$)/g)?.join("\n") ?? "";
  assert.match(reducedMotion, /vt-studio-dropdown-menu-open/);
  assert.match(reducedMotion, /animation-duration:\s*\.01ms/);
});
