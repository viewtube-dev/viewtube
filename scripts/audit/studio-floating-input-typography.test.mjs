import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const input = readFileSync("src/studio-ui/primitives/StudioTextInput.tsx", "utf8");
const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const fields = readFileSync("src/styles/studio-control-fields.css", "utf8");
const entry = readFileSync("src/styles/studio-control-entry.css", "utf8");
const main = readFileSync("src/main.tsx", "utf8");
const mobile = readFileSync("src/styles/subtoolbox-system.css", "utf8");
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");

assert.ok(input.includes('variant: "floating-label"'));
assert.ok(input.includes('variant: "fixed-label"'));
assert.ok(input.includes('variant?: "simple"'));
assert.ok(input.includes('data-vt-primitive-id="141"'));
assert.ok(input.includes('data-vt-primitive-id="143"'));
assert.ok(input.includes('import "../../styles/studio-control-entry.css"'));
assert.ok(input.includes('data-vt-studio-control": "true"'));
assert.ok(controls.includes('import { StudioTextInput, StudioInput } from "./StudioTextInput"'));

for (const [selector, declaration] of [
  ['input[data-vt-studio-control="true"]:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"])', "font-size: var(--vt-studio-44-font-size, 38px)"],
  ['input[data-vt-studio-control="true"][data-size="compact"]:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"])', "font-size: var(--vt-studio-28-font-size, 24px)"],
  ['input[data-vt-studio-control="true"][data-size="micro"]:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"])', "font-size: var(--vt-studio-14-font-size, 10px)"],
  ['textarea[data-vt-studio-control="true"]', "font-size: var(--vt-studio-textarea-standard-font-size, 18px)"],
  ['textarea[data-vt-studio-control="true"][data-size="compact"]', "font-size: var(--vt-studio-textarea-compact-font-size, 14px)"],
]) {
  assert.ok(fields.includes(selector), "missing native control selector: " + selector);
  assert.ok(fields.includes(declaration), "missing expected typography declaration: " + declaration);
}
assert.ok(fields.includes("--vt-studio-44-font-size: 38px"));
assert.ok(fields.includes("--vt-studio-28-font-size: 24px"));
assert.ok(fields.includes("--vt-studio-14-font-size: 10px"));
assert.ok(fields.includes("--vt-studio-textarea-standard-font-size: 18px"));
assert.ok(fields.includes("--vt-studio-textarea-compact-font-size: 14px"));
assert.ok(fields.includes("font-size: calc(var(--vt-studio-floating-label-size) * 0.8)"));
assert.ok(entry.includes('@import "./studio-control-fields.css"'));
assert.ok(!main.includes("studio-text-input.css"));

const mobileGuard = mobile.slice(mobile.indexOf("[data-vt-toolbox] :is("));
assert.ok(mobileGuard.includes(':not([data-vt-studio-control="true"])'));
assert.ok(mobileGuard.includes("font-size:16px!important"));

assert.ok(catalog.includes('Studio Text Input · Simple + Floating + Fixed Label'));
assert.ok(catalog.includes('variant="floating-label" label="TITLE"'));
assert.ok(catalog.includes('variant="fixed-label" label="TITLE"'));

console.log("Studio Oct 16 input/textarea typography contract: PASS");
