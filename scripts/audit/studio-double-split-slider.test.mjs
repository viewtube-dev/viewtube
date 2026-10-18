import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const styles = readFileSync("src/styles/studio-control-system.css", "utf8");
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");

test("StudioDoubleSplitSlider is built on the canonical double-split shell", () => {
  assert.match(controls, /export const StudioDoubleSplitSlider[\s\S]*?layout="double"/);
  assert.match(controls, /"data-vt-studio-slider": "double-split"/);
  assert.match(controls, /leftRailContent=\{[\s\S]*?rightRailContent=\{/);
});

test("StudioDoubleSplitSlider exposes an accessible range with live value and reset action", () => {
  assert.match(controls, /type="range"/);
  assert.match(controls, /aria-label=\{ariaLabel\}/);
  assert.match(controls, /onValueChange\(nextValue\)/);
  assert.match(controls, /aria-label=\{\x60Reset \$\{ariaLabel\}\x60\}/);
});

test("slider styling keeps the L1 track and rectangular v2 handle at all Studio sizes", () => {
  assert.match(styles, /\.vt-studio-double-split-slider input\[type="range"\]::-webkit-slider-thumb/);
  assert.match(styles, /--vt-studio-slider-radius:\s*var\(--vt-studio-control-radius,\s*6px\)/);
  assert.match(styles, /\.vt-studio-double-split-slider\[data-size="compact"\]/);
  assert.match(styles, /\.vt-studio-double-split-slider\[data-size="micro"\]/);
  assert.match(styles, /--vt-studio-slider-track-height:\s*max\(6px,\s*calc\(var\(--vt-studio-control-height,\s*44px\)\s*\*\s*\.428571\)\)/);
  assert.match(styles, /--vt-studio-slider-thumb-width:\s*max\(7px,\s*calc\(var\(--vt-studio-control-height,\s*44px\)\s*\*\s*\.50\)\)/);
  assert.match(styles, /--vt-studio-slider-thumb-height:\s*max\(11px,\s*calc\(var\(--vt-studio-control-height,\s*44px\)\s*\*\s*\.857143\)\)/);
  assert.match(styles, /\.vt-studio-double-split-slider__reset,\s*\n\.vt-studio-double-split-slider \.vt-studio-double-split-slider__value[\s\S]*?background:\s*var\(--vt-studio-control-primary/);
  assert.match(styles, /input\[type="range"\][\s\S]*?background:\s*linear-gradient\(to right,[\s\S]*?#fff var\(--vt-studio-slider-progress, 0%\) 100%\)/);
  assert.match(styles, /::-webkit-slider-thumb\s*\{[^}]*border:\s*var\(--vt-studio-slider-stroke\) solid #000;[^}]*border-radius:\s*var\(--vt-studio-slider-radius\);[^}]*background:\s*#000;/s);
  assert.match(styles, /::-moz-range-thumb\s*\{[^}]*border:\s*var\(--vt-studio-slider-stroke\) solid #000;[^}]*border-radius:\s*var\(--vt-studio-slider-radius\);[^}]*background:\s*#000;/s);
  assert.match(styles, /box-shadow:\s*inset 0 0 0 var\(--vt-studio-slider-stroke\) #000/);
  assert.match(styles, /\.vt-studio-double-split-slider \.vt-studio-double-split-slider__reset\s*\{[^}]*color:\s*var\(--vt-studio-control-secondary/);
  assert.match(styles, /\.vt-studio-double-split-slider\.is-reversed \.vt-studio-double-split-slider__reset\s*\{[^}]*color:\s*var\(--vt-studio-control-secondary, var\(--pair-a/s);
});

test("confirmed primitive catalog includes standard, compact, and micro slider specimens", () => {
  assert.match(catalog, /StudioDoubleSplitSlider/);
  assert.match(catalog, /StudioDoubleSplitSlider · Standard \+ Compact \+ Micro/);
});
