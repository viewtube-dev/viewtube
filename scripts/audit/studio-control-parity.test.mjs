import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/studio-control-system.css", "utf8");
const toggles = readFileSync("src/studio-ui/primitives/StudioValueToggles.tsx", "utf8");
const area = readFileSync("src/studio-ui/primitives/StudioTextArea.tsx", "utf8");
const fields = readFileSync("src/styles/studio-control-fields.css", "utf8");
const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");

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


test("input and textarea focus retain the primary inline glyph stroke", () => {
  assert.match(fields, /input\[data-vt-studio-control="true"\][\s\S]*?:focus[\s\S]*?-webkit-text-stroke-color:\s*var\(--vt-field-primary/);
  assert.match(fields, /textarea\[data-vt-studio-control="true"\][\s\S]*?:focus[\s\S]*?-webkit-text-stroke-color:\s*var\(--vt-field-primary/);
  // A read-only StudioTextBox has its own display-copy focus rule; do not
  // confuse that rule with the editable input/textarea focus contract.
  const editableFocusRules = fields
    .split("}")
    .filter((rule) => /(?:input|textarea)\[data-vt-studio-control="true"\]/.test(rule) && /:focus/.test(rule))
    .join("}");
  assert.ok(editableFocusRules.length > 0, "editable field focus rules must be present");
  assert.doesNotMatch(editableFocusRules, /-webkit-text-stroke-color:\s*#000\s*!important/);
});

test("floating-label risen typography uses one shared token pair while rest labels retain field-size tokens", () => {
  assert.match(css, /--vt-studio-floating-label-risen-font-size:\s*12px/);
  assert.match(css, /--vt-studio-floating-label-risen-text-stroke:\s*0\.5px/);
  assert.match(css, /font-size:\s*var\(--vt-studio-floating-label-risen-font-size, 12px\) !important/);
  assert.match(css, /-webkit-text-stroke-width:\s*var\(--vt-studio-floating-label-risen-text-stroke, 0\.5px\) !important/);
  assert.match(css, /textarea\[data-size="compact"\] \+ \.vt-studio-floating-field-label[\s\S]*?vt-studio-textarea-compact-font-size/);
  assert.match(css, /input\[data-size="compact"\] \+ \.vt-studio-floating-field-label[\s\S]*?vt-studio-28-font-size/);
  assert.doesNotMatch(css, /\.vt-studio-floating-field[^{}]*:focus[^{}]*\{[^}]*font-size:\s*18px/);
});

test("double-side divider is centered and the confirmed catalog mixes compact and standard variants", () => {
  assert.match(css, /\.vt-studio-value-toggle--double \.vt-studio-value-toggle__divider\s*\{[^}]*left:\s*50%;[^}]*translateX\(-50%\)/s);
  assert.match(catalog, /size=\{index === 1 \|\| index === 3 \? "compact" : "standard"\}/);
});

test("bar toggle has pointer capture and visible inactive segments", () => {
  assert.match(toggles, /setPointerCapture\?\.\(event\.pointerId\)/);
  assert.match(toggles, /onPointerUp=\{stopRepeat\}[\s\S]*?onPointerCancel=\{stopRepeat\}[\s\S]*?onLostPointerCapture=\{stopRepeat\}/);
  assert.match(css, /\.vt-studio-value-toggle__bar[\s\S]*?40%, #fff/);
  assert.match(css, /\.vt-studio-value-toggle__bar\[data-active="true"\][\s\S]*?background:\s*#000/);
});

test("multi-select closed trigger combines selection count into the label only", () => {
  assert.match(controls, /\$\{selectedLabels\[0\]\} \+\$\{selectedLabels\.length - 1\}/);
  assert.match(controls, /className="vt-studio-legend-trigger-text"\>\{triggerLabel\}/);
  assert.doesNotMatch(controls, /vt-studio-legend-count/);
});
