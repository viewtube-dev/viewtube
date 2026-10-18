import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const input = readFileSync("src/studio-ui/primitives/StudioTextInput.tsx", "utf8");
const css = readFileSync("src/styles/studio-text-input.css", "utf8");
const main = readFileSync("src/main.tsx", "utf8");
const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");

// The foundation is exactly one native input primitive with no label branches.
assert.match(input, /export const StudioTextInput = React\.forwardRef/);
assert.match(input, /className=\{\["vt-studio-text-input", className\]/);
assert.match(input, /data-size=\{sizeVariant\}/);
assert.match(input, /data-vt-studio-control="true"/);
assert.doesNotMatch(input, /floating-label|fixed-label|vt-studio-floating-field|vt-studio-fixed-label-field|<label\b|studio-control-entry\.css/);

// Each size maps to the required literal input font-size and expected geometry.
// High-specificity selectors beat legacy data-vt-studio-control input rules.
assert.match(css, /html body input\\.vt-studio-text-input\\[data-size="standard"\\]:not\\(\\[type="checkbox"\\]\\):not\\(\\[type="radio"\\]\\):not\\(\\[type="range"\\]\\)[\\s\\S]*?--vt-studio-input-height:[^;]*44px[^;]*;[\\s\\S]*?--vt-studio-input-font-size:\\s*38px;[\\s\\S]*?font-size:\\s*38px;/);
assert.match(css, /html body input\\.vt-studio-text-input\\[data-size="compact"\\]:not\\(\\[type="checkbox"\\]\\):not\\(\\[type="radio"\\]\\):not\\(\\[type="range"\\]\\)[\\s\\S]*?--vt-studio-input-height:[^;]*28px[^;]*;[\\s\\S]*?--vt-studio-input-font-size:\\s*24px;[\\s\\S]*?font-size:\\s*24px;/);
assert.match(css, /html body input\\.vt-studio-text-input\\[data-size="micro"\\]:not\\(\\[type="checkbox"\\]\\):not\\(\\[type="radio"\\]\\):not\\(\\[type="range"\\]\\)[\\s\\S]*?--vt-studio-input-height:[^;]*14px[^;]*;[\\s\\S]*?--vt-studio-input-font-size:\\s*10px;[\\s\\S]*?font-size:\\s*10px;/);
assert.match(css, /html body input\\.vt-studio-text-input\\s*\\{[\\s\\S]*?font-size:\\s*var\\(--vt-studio-input-font-size,\\s*38px\\)/);
assert.doesNotMatch(css, /textarea|floating-field-label|fixed-field-label/);

// Root loads the old shared controls first and the plain input foundation after it.
assert.ok(main.indexOf("import './index.css'") < main.indexOf("import './styles/studio-text-input.css'"));
assert.ok(main.indexOf("import './styles/studio-control-fields.css'") < main.indexOf("import './styles/studio-text-input.css'"));
assert.doesNotMatch(controls.slice(0, 900), /studio-control-entry\.css|studio-control-fields\.css/);

// Catalog shows only plain standard and compact specimens; no label specimens.
const inputFamilyStart = catalog.indexOf('<Family title="Studio Text Input');
const textareaFamilyStart = catalog.indexOf('<Family title="Studio Text Area', inputFamilyStart);
assert.ok(inputFamilyStart >= 0 && textareaFamilyStart > inputFamilyStart);
const inputFamily = catalog.slice(inputFamilyStart, textareaFamilyStart);
assert.match(inputFamily, /StudioTextInput sizeVariant="standard"/);
assert.match(inputFamily, /StudioTextInput sizeVariant="compact"/);
assert.doesNotMatch(inputFamily, /floating-label|fixed-label|label="TITLE"/);

console.log("Studio plain text input foundation contract: PASS");
