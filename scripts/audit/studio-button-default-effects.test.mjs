import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import testCase from "node:test";

const css = readFileSync("src/styles/studio-control-system.css", "utf8");
const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");
const policyStart = css.indexOf("Canonical button-only default effects — consolidated from the CSS/layout skills");
assert.notEqual(policyStart, -1, "canonical button-only effects contract must exist");
const policy = css.slice(policyStart);

testCase("button primitives own default shadows and paint-only transitions", () => {
  assert.match(policy, /button\[data-vt-studio-button="true"\][\s\S]*?box-shadow:[\s\S]*?transition:\s*box-shadow 150ms ease-out/);
  assert.match(policy, /button\[data-vt-studio-control="true"\]\[data-vt-studio-action-button="true"\]/);
  assert.doesNotMatch(policy, /transition:[^;]*\btransform\b/);
  assert.match(policy, /:hover:not\(:disabled\)[\s\S]*?transform:\s*none !important/);
  assert.match(policy, /:active:not\(:disabled\)[\s\S]*?transform:\s*none !important/);
});

testCase("badges, fields, dropdown surfaces, and stepper action cells stay flat and stationary", () => {
  assert.match(policy, /\.vt-studio-split-left-badge[\s\S]*?box-shadow:\s*none !important/);
  assert.match(policy, /\.vt-studio-inline-stepper > button[\s\S]*?transition:\s*none !important/);
  assert.match(policy, /\.vt-studio-dropdown-menu\s*\{\s*box-shadow:\s*none !important/);
  assert.match(policy, /:focus-visible[\s\S]*?outline:[\s\S]*?box-shadow:\s*none !important/);
});

testCase("canonical standard/compact size contract does not encode press displacement", () => {
  assert.match(tokens, /standard: \{ height: 44, stroke: 3/);
  assert.match(tokens, /compact: \{ height: 28, stroke: 2/);
  assert.match(tokens, /hoverOffsetPx: 0, clickTransitionMs: 80, clickOffsetPx: 0/);
});
