import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/studio-control-system.css", "utf8");
const toggles = readFileSync("src/studio-ui/primitives/StudioValueToggles.tsx", "utf8");
const area = readFileSync("src/studio-ui/primitives/StudioTextArea.tsx", "utf8");

test("side-toggle stack uses a centered overlay divider, not a half-cell border", () => {
  assert.match(css, /\.vt-studio-value-toggle__arrow-stack::after[\s\S]*?top:\s*50%[\s\S]*?translateY\(-50%\)/);
  assert.match(css, /\.vt-studio-value-toggle__arrow-stack\s*>\s*\.vt-studio-value-toggle__arrow[\s\S]*?border-bottom:\s*0\s*!important/);
  assert.match(toggles, /export function StudioSideToggle/);
});

test("toggle chevrons use the standard, compact, and micro icon dimensions", () => {
  assert.match(css, /data-size="standard"[\s\S]*?width:\s*min\(38px, 100%\)/);
  assert.match(css, /data-size="compact"[\s\S]*?width:\s*min\(30px, 100%\)/);
  assert.match(css, /data-size="micro"[\s\S]*?width:\s*min\(15px, 100%\)/);
});

test("textarea focus uses primary 15-percent fill and secondary proportional outline", () => {
  assert.match(css, /data-vt-studio-field-kind="textarea"\]:is\(:focus, :focus-visible\)[\s\S]*?15%[\s\S]*?color:\s*#000[\s\S]*?calc\(var\(--vt-studio-control-stroke, 3px\) \* \.65\)[\s\S]*?var\(--vt-studio-control-secondary/);
  assert.match(area, /data-vt-studio-field-kind="textarea"/);
});

test("single-line panels clip overflow without ellipses and exclude textareas", () => {
  assert.match(css, /\[data-vt-studio-control\]:not\(input\):not\(textarea\):not\(select\)/);
  assert.match(css, /text-overflow:\s*clip/);
  assert.doesNotMatch(css, /textarea\s*\{[^}]*text-overflow:\s*clip/s);
});

test("click growth animation targets the SVG glyph only", () => {
  assert.match(css, /\.vt-studio-value-toggle__arrow:active svg\s*\{[^}]*animation:\s*vt-studio-value-toggle-grow/);
});

test("value-toggle text panels use solid primary split-family fill at rest and focus", () => {
  const family = css.slice(css.indexOf(".vt-studio-value-toggle {"));
  const fill = family.match(/--vt-toggle-fill:\s*([^;]+);/);
  assert.ok(fill, "value-toggle family declares its panel fill");
  assert.match(fill[1], /var\(--vt-studio-control-accent,\s*var\(--pair-a,\s*#36e0f6\)\)\s*$/);
  assert.doesNotMatch(fill[1], /color-mix|50%|15%/);
  assert.match(css, /\.vt-studio-value-toggle[^{}]*\{[^}]*--vt-toggle-fill:\s*var\(--vt-studio-control-accent/);
});

test("nested split labels keep solid primary toggle fill at rest and focus", () => {
  const start = css.lastIndexOf("Value toggles are split-family controls");
  const rules = css.slice(start);
  assert.match(rules, /\.vt-studio-value-toggle > \[data-vt-studio-split-label\][\s\S]*?background:\s*var\(--vt-toggle-fill\)\s*!important/);
  assert.match(rules, /\.vt-studio-value-toggle:focus-within\s*\{[^}]*background:\s*var\(--vt-toggle-fill\)/);
  assert.doesNotMatch(rules, /\.vt-studio-value-toggle:focus-within\s*\{[^}]*color-mix/);
});
