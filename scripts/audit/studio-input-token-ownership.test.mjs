import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const inputCss = readFileSync("src/styles/studio-text-input.css", "utf8");
const generatedVars = readFileSync("src/styles/studio-control-vars.generated.css", "utf8");

test("plain Studio input geometry consumes the generated size tokens", () => {
  const expectedTokens = [
    "--vt-studio-standard-height: 44px",
    "--vt-studio-standard-stroke: 3px",
    "--vt-studio-standard-radius: 6px",
    "--vt-studio-standard-font-size: 38px",
    "--vt-studio-compact-height: 28px",
    "--vt-studio-compact-stroke: 2px",
    "--vt-studio-compact-radius: 4px",
    "--vt-studio-compact-font-size: 24px",
    "--vt-studio-micro-height: 14px",
    "--vt-studio-micro-stroke: 1px",
    "--vt-studio-micro-radius: 2px",
    "--vt-studio-micro-font-size: 10px",
  ];

  for (const token of expectedTokens) assert.ok(generatedVars.includes(token), `missing generated token: ${token}`);
  for (const token of [
    "--vt-studio-standard-height",
    "--vt-studio-standard-stroke",
    "--vt-studio-standard-radius",
    "--vt-studio-standard-font-size",
    "--vt-studio-compact-height",
    "--vt-studio-compact-stroke",
    "--vt-studio-compact-radius",
    "--vt-studio-compact-font-size",
    "--vt-studio-micro-height",
    "--vt-studio-micro-stroke",
    "--vt-studio-micro-radius",
    "--vt-studio-micro-font-size",
  ]) assert.ok(inputCss.includes(`var(${token},`), `plain input does not consume ${token}`);

  assert.match(inputCss, /-webkit-text-stroke:\s*var\(--vt-studio-control-text-stroke, 1px\)\s*var\(--vt-studio-control-accent, var\(--pair-a, #36e0f6\)\)/);
});

test("plain Studio input retains the explicit standard, compact, and micro size hooks", () => {
  assert.match(inputCss, /input\.vt-studio-text-input\[data-size="standard"\]/);
  assert.match(inputCss, /input\.vt-studio-text-input\[data-size="compact"\]/);
  assert.match(inputCss, /input\.vt-studio-text-input\[data-size="micro"\]/);
});
