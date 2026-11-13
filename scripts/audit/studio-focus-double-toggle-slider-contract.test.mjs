import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const toggles = readFileSync("src/styles/studio-control-value-toggles.css", "utf8");
const splitInput = readFileSync("src/studio-ui/primitives/studio-split-text-input.css", "utf8");
const controls = readFileSync("src/styles/studio-control-system.css", "utf8");
const fields = readFileSync("src/styles/studio-control-fields.css", "utf8");
const splitStyles = readFileSync("src/styles/studio-control-split.css", "utf8");
const distill = readFileSync("src/styles/studio-control-distill-overrides.css", "utf8");
const valueToggles = readFileSync("src/studio-ui/primitives/StudioValueToggles.tsx", "utf8");
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");

test("focus outline and character fades share one duration and easing in both directions", () => {
  const duration = "var(--vt-studio-focus-outline-fade-ms, 500ms) ease-out";
  assert.ok(toggles.includes("outline-color " + duration));
  assert.ok(toggles.includes("outline-width " + duration));
  assert.ok(toggles.includes("color " + duration));
  assert.ok(toggles.includes("-webkit-text-fill-color " + duration));
  assert.ok(toggles.includes("-webkit-text-stroke-color " + duration));
  assert.match(toggles, /outline:\s*0 solid transparent/);
});

test("double-side focus keeps one outer perimeter and activates only the focused side", () => {
  assert.match(toggles, /\.vt-studio-value-toggle--double:focus-within\s*\{[^}]*outline:/);
  assert.match(toggles, /\.vt-studio-value-toggle--double \.vt-studio-value-toggle__double-side:focus-within \.vt-studio-value-toggle__face/);
  assert.doesNotMatch(toggles, /\.vt-studio-value-toggle--double:focus-within \.vt-studio-split-shell \.vt-studio-value-toggle__face/);
  assert.match(toggles, /\.vt-studio-value-toggle:not\(\.vt-studio-value-toggle--double\):not\(\.vt-studio-value-toggle--nested\):focus-within \.vt-studio-value-toggle__face/);
  assert.match(toggles, /\.vt-studio-value-toggle--double \.vt-studio-value-toggle--nested:focus-within\s*\{\s*outline:\s*none/);
});

test("split text input uses one continuous primary inset stroke at every size", () => {
  assert.match(splitInput, /box-shadow:\s*inset 0 0 0 var\(--vt-studio-control-stroke, 3px\) var\(--vt-split-field-primary/);
  assert.match(splitInput, /:is\(:focus, :focus-visible\)[\s\S]*?box-shadow:\s*inset 0 0 0 var\(--vt-studio-control-stroke, 3px\) var\(--vt-split-field-primary/);
  assert.match(splitInput, /data-size/);
  assert.doesNotMatch(splitInput, /border-(?:top|bottom):\s*var\(--vt-studio-control-stroke/);
});


test("standard and compact split text inputs bind their inline stroke to their own size tier", () => {
  assert.match(splitInput, /\.vt-studio-split-text-input > \[data-vt-studio-control="true"\]\[data-size="standard"\] input[\s\S]*?--vt-studio-control-stroke:\s*var\(--vt-studio-standard-stroke/);
  assert.match(splitInput, /\.vt-studio-split-text-input > \[data-vt-studio-control="true"\]\[data-size="compact"\] input[\s\S]*?--vt-studio-control-stroke:\s*var\(--vt-studio-compact-stroke/);
});

test("slider track retains tier-aware clearance from both vertical dividers", () => {
  assert.match(splitStyles, /padding-inline:\s*max\([\s\S]*?calc\(var\(--vt-studio-control-stroke, 3px\) \* 2\)[\s\S]*?calc\(var\(--vt-studio-control-height, 44px\) \* \.12\)/);
});

test("slider rails stay secondary, center stays primary, and progress uses a white-secondary blend", () => {
  assert.match(controls, /\.vt-studio-double-split-slider \.vt-studio-double-split-slider__rail\s*\{[^}]*background:\s*var\(--vt-studio-control-secondary/s);
  assert.match(controls, /\.vt-studio-double-split-slider > \[data-vt-studio-split-field\]\s*\{[^}]*background:\s*var\(--vt-studio-control-primary/s);
  assert.doesNotMatch(splitStyles, /\.vt-studio-double-split-slider \.vt-studio-double-split-slider__rail\s*\{[^}]*background:/s);
  assert.match(controls, /--vt-studio-slider-left-fill:\s*var\(--vt-studio-control-secondary/);
  assert.match(controls, /color-mix\(in srgb, white 50%, var\(--vt-studio-slider-left-fill\) 50%\)/i);
});

test("primary percentage field fills blend against white instead of transparency", () => {
  assert.match(controls, /--vt-field-fill-rest:\s*color-mix\(in srgb, white 50%, var\(--vt-field-primary\) 50%\)/i);
  assert.match(controls, /--vt-field-fill-focus:\s*color-mix\(in srgb, white 85%, var\(--vt-field-primary\) 15%\)/i);
  assert.doesNotMatch(controls, /--vt-field-fill-(?:rest|focus):[^;]*transparent/);
  assert.match(splitInput, /background:\s*color-mix\(in srgb, white 50%, var\(--vt-split-field-primary\) 50%\)/i);
  assert.match(splitInput, /background:\s*color-mix\(in srgb, white 85%, var\(--vt-split-field-primary\) 15%\)/i);
  assert.match(toggles, /background:\s*color-mix\(in srgb, white 85%, var\(--vt-toggle-fill[^;]*15%\)/i);
  assert.match(splitStyles, /color-mix\(in srgb, white 50%, var\(--vt-stepper-primary\) 50%\)/i);
  assert.doesNotMatch([controls, splitInput, fields, toggles, splitStyles].join("\n"), /color-mix\([^;]*(?:vt-field-primary|vt-split-field-primary|vt-studio-control-accent|vt-studio-control-secondary|vt-studio-slider-left-fill|vt-toggle-fill)[^;]*,\s*transparent\)/);
});

test("toggle focus changes glyph color only and preserves the resting primary face fill", () => {
  assert.match(toggles, /focus-within \.vt-studio-value-toggle__face[\s\S]*?-webkit-text-stroke-color:/);
  assert.doesNotMatch(toggles, /focus-within[^{}]*\{[^}]*background\s*:/);
  assert.doesNotMatch(toggles, /focus-within[^{}]*\{[^}]*background-color\s*:/);
  assert.doesNotMatch(toggles, /focus-within[^{}]*\{[^}]*--vt-toggle-fill\s*:/);
});

test("slider right-rail numerals blend secondary with white by default", () => {
  assert.match(controls, /\.vt-studio-double-split-slider\s*\{[^}]*--vt-studio-number-background:\s*var\(--vt-studio-control-secondary/s);
  assert.match(controls, /\.vt-studio-double-split-slider \.vt-studio-double-split-slider__value\s*\{[^}]*color:\s*color-mix\(in srgb, #fff[^;]*var\(--vt-studio-number-background\)/s);
});

test("slider track, progress surface, and browser tracks use the shared corner radius", () => {
  assert.match(controls, /\.vt-studio-double-split-slider input\[type="range"\]\s*\{[^}]*border-radius:\s*var\(--vt-studio-slider-radius/s);
  assert.match(controls, /\.vt-studio-double-split-slider input\[type="range"\]::-webkit-slider-runnable-track\s*\{[^}]*border-radius:\s*var\(--vt-studio-slider-radius/s);
  assert.match(controls, /\.vt-studio-double-split-slider input\[type="range"\]::-moz-range-track\s*\{[^}]*border-radius:\s*var\(--vt-studio-slider-radius/s);
});

test("textareas expose the primary 15% focus fill with the shared 500ms transition", () => {
  assert.ok(fields.includes("background-color: var(--vt-field-fill-focus"));
  assert.ok(fields.includes("background-color var(--vt-studio-focus-outline-fade-ms, 500ms) ease-out"));
  assert.ok(fields.includes("-webkit-text-stroke-color var(--vt-studio-focus-outline-fade-ms, 500ms) ease-out"));
});

test("text boxes retain a primary inline inset stroke without a clearing rule", () => {
  assert.ok(fields.includes('.vt-studio-text-box[data-vt-studio-control="true"]'));
  assert.ok(fields.includes("box-shadow: inset 0 0 0 var(--vt-studio-control-stroke, 3px) var(--vt-field-primary"));
  assert.doesNotMatch(fields, /\.vt-studio-text-box\[data-vt-studio-control="true"\]\s*\{\s*box-shadow:\s*none/);
});

test("bar-toggle tooltip is visible only on focus and has a secondary downspout", () => {
  assert.match(distill, /\.vt-studio-value-toggle--bar:focus-within \.vt-studio-value-toggle__bar-tooltip\s*\{[^}]*visibility:\s*visible;[^}]*opacity:\s*1/s);
  assert.doesNotMatch([toggles, distill].join("\\n"), /\.vt-studio-value-toggle__bar:hover/);
  assert.match(distill, /\.vt-studio-value-toggle__bar-tooltip::after\s*\{[^}]*border-top-color:\s*var\(--vt-studio-control-secondary/s);
  assert.match(valueToggles, /index === Math\.max\(0, filled - 1\) \?/);
  assert.doesNotMatch(valueToggles, /index === Math\.max\(0, filled - 1\) && filled > 0/);
});

test("double-split slider gallery copy matches the canonical rail, center, and progress colors", () => {
  assert.ok(catalog.includes("Both split rails use secondary; the center track stays primary, and the active progress fill is a 50% white/secondary blend."));
  assert.ok(catalog.includes("The counter-controlled specimen shares its value with the slider."));
});

test("arrow/side toggle faces and double-split word counter do not inherit the 50%-primary numeral mix", () => {
  const faceStart = toggles.indexOf(".vt-studio-split-shell.vt-studio-value-toggle .vt-studio-value-toggle__face {");
  const faceEnd = toggles.indexOf("\n}", faceStart);
  const faceRule = toggles.slice(faceStart, faceEnd);
  const wordStart = toggles.indexOf(".vt-studio-word-counter__value {");
  const wordEnd = toggles.indexOf("\n}", wordStart);
  const wordRule = toggles.slice(wordStart, wordEnd);
  assert.notEqual(faceStart, -1, "shared arrow/side face rule should exist");
  assert.notEqual(wordStart, -1, "double-split word counter value rule should exist");
  assert.match(faceRule, /color:\\s*inherit/);
  assert.doesNotMatch(faceRule, /--vt-studio-number-rest-color|color-mix/);
  assert.doesNotMatch(wordRule, /--vt-studio-number-rest-color|color-mix/);
  assert.ok(toggles.includes("--vt-toggle-text: #000"));
});
