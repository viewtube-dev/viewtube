import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const input = readFileSync("src/studio-ui/primitives/StudioTextInput.tsx", "utf8");
const css = readFileSync("src/styles/studio-text-input.css", "utf8");
const main = readFileSync("src/main.tsx", "utf8");
const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");

// The foundation is exactly one native input primitive with no label branches.
assert.ok(input.includes("export const StudioTextInput = React.forwardRef"));
assert.ok(input.includes('"vt-studio-text-input"'));
assert.ok(input.includes("data-size={sizeVariant}"));
assert.ok(input.includes('data-vt-studio-control="true"'));
for (const forbidden of ["floating-label", "fixed-label", "vt-studio-floating-field", "vt-studio-fixed-label-field", "<label", "studio-control-entry.css"]) {
  assert.ok(!input.includes(forbidden), "plain input must not include " + forbidden);
}

// Size selectors set literal font sizes and matching geometry on the native input.
assert.ok(css.includes('input.vt-studio-text-input[data-size="standard"]') || css.includes('input.vt-studio-text-input:not([data-size])'));
assert.ok(css.includes('data-size="standard"]:not([type="checkbox"]):not([type="radio"]):not([type="range"])'));
assert.ok(css.includes('data-size="compact"]:not([type="checkbox"]):not([type="radio"]):not([type="range"])'));
assert.ok(css.includes('data-size="micro"]:not([type="checkbox"]):not([type="radio"]):not([type="range"])'));
assert.ok(css.includes("--vt-studio-input-height: var(--vt-studio-standard-height, 44px)"));
assert.ok(css.includes("--vt-studio-input-height: var(--vt-studio-compact-height, 28px)"));
assert.ok(css.includes("--vt-studio-input-height: var(--vt-studio-micro-height, 14px)"));
assert.ok(css.includes("--vt-studio-input-font-size: 38px;") && css.includes("font-size: 38px;"));
assert.ok(css.includes("--vt-studio-input-font-size: 24px;") && css.includes("font-size: 24px;"));
assert.ok(css.includes("--vt-studio-input-font-size: 10px;") && css.includes("font-size: 10px;"));
assert.ok(!css.includes("html body textarea") && !css.includes(".vt-studio-floating-field-label") && !css.includes(".vt-studio-fixed-field-label"));

// Root loads the old shared controls first and the plain input foundation after it.
assert.ok(main.indexOf("import './index.css'") < main.indexOf("import './styles/studio-text-input.css'"));
assert.ok(main.indexOf("import './styles/studio-control-fields.css'") < main.indexOf("import './styles/studio-text-input.css'"));
assert.ok(!controls.slice(0, 900).includes("studio-control-entry.css"));
assert.ok(!controls.slice(0, 900).includes("studio-control-fields.css"));

// Catalog shows only plain standard and compact specimens; no label specimens.
const inputFamilyStart = catalog.indexOf('<Family title="Studio Text Input');
const textareaFamilyStart = catalog.indexOf('<Family title="Studio Text Area', inputFamilyStart);
assert.ok(inputFamilyStart >= 0 && textareaFamilyStart > inputFamilyStart);
const inputFamily = catalog.slice(inputFamilyStart, textareaFamilyStart);
assert.ok(inputFamily.includes('StudioTextInput sizeVariant="standard"'));
assert.ok(inputFamily.includes('StudioTextInput sizeVariant="compact"'));
assert.ok(!inputFamily.includes("floating-label") && !inputFamily.includes("fixed-label") && !inputFamily.includes('label="TITLE"'));

console.log("Studio plain text input foundation contract: PASS");
