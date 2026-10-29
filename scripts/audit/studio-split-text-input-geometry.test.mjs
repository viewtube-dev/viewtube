import test from "node:test";
import postcss from "postcss";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const splitCss = readFileSync("src/styles/studio-split-text-input.css", "utf8");
const splitComponent = readFileSync("src/studio-ui/primitives/StudioSplitTextInput.tsx", "utf8");
const interCss = readFileSync("src/styles/studio-inter-module.css", "utf8");

test("split text input styles target the actual rendered shell, rails, and editable field", () => {
  assert.match(splitCss, /html body \.vt-studio-split-text-input\s*\{/);
  assert.match(splitCss, /\.vt-studio-split-text-input \[data-vt-studio-split-rail\]/);
  assert.match(splitCss, /\.vt-studio-split-text-input input\.vt-studio-text-input\[data-vt-studio-control="true"\]/);
  assert.match(splitComponent, /className="vt-studio-split-text-input__field"/);
  assert.match(splitComponent, /data-vt-studio-split=\{split\}/);
  assert.doesNotMatch(splitCss, /data-vt-studio-split-label/);
});

test("split input has one stable geometry rule and the canonical resting/focus field contract", () => {
  assert.equal((splitCss.match(/html body \.vt-studio-split-text-input input\.vt-studio-text-input\[data-vt-studio-control="true"\],/g) || []).length, 1);
  assert.doesNotMatch(splitCss, /data-geometry-variant|padding-reference|half-vertical-padding|username-height/);
  assert.match(splitCss, /box-shadow:\s*inset 0 0 0 var\(--vt-studio-control-stroke, 3px\) var\(--vt-split-field-primary\)/);
  assert.match(splitCss, /background:\s*color-mix\(in srgb, var\(--vt-split-field-primary\) 50%, transparent\)/);
  assert.match(splitCss, /:focus-visible[\s\S]*?15%, transparent[\s\S]*?-webkit-text-stroke-color:\s*#000/);
  assert.match(splitCss, /:focus-within\s*\{[\s\S]*?focus-outline-width-ratio, \.65[\s\S]*?var\(--vt-split-field-secondary\)/);
  assert.match(splitCss, /caret-color:\s*var\(--vt-split-field-primary\)/);
  assert.doesNotMatch(splitComponent, /geometryVariant|data-geometry-variant/);
});

test("intermodule sizing uses canonical supreme tokens and focus outline follows stroke ratio", () => {
  assert.match(interCss, /--vt-im-stroke:\s*var\(--vt-studio-supreme-stroke, 3px\)/);
  assert.match(interCss, /--vt-im-face:\s*var\(--vt-studio-supreme-height, 60px\)/);
  assert.match(interCss, /outline:\s*calc\(var\(--vt-im-stroke\) \* \.65\) solid/);
  assert.match(interCss, /\.vt-studio-inter-module__line-1/);
  assert.match(interCss, /\.vt-studio-inter-module__line-2/);
});


test("split text input stylesheet is complete and closes the nested field rule", () => {
  assert.doesNotMatch(splitCss, /\.\.\.\s*$/, "stylesheet must not be truncated");
  assert.doesNotThrow(() => postcss.parse(splitCss), "split text input stylesheet must parse as valid CSS");
  assert.match(
    splitCss,
    /--vt-split-field-pad:\s*max\(10px, calc\(var\(--vt-studio-control-stroke, 3px\) \+ 8px\)\);[\s\S]*?caret-color:\s*var\(--vt-split-field-primary\);[\s\S]*?\n}\s*$/,
    "nested field declarations must be complete and the rule must close",
  );
});
