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

// The plain input stylesheet is the only native input font-size authority.
assert.ok(css.includes('input.vt-studio-text-input[data-size="standard"]'));
assert.ok(css.includes('font-size: 38px;'));
assert.ok(css.includes('input.vt-studio-text-input[data-size="compact"]'));
assert.ok(css.includes('font-size: 24px;'));
assert.ok(css.includes('input.vt-studio-text-input[data-size="micro"]'));
assert.ok(css.includes('font-size: 10px;'));
assert.ok(!css.includes("textarea") && !css.includes(".vt-studio-floating-field-label") && !css.includes(".vt-studio-fixed-field-label"));

function nativeInputFontSizeRules(stylesheet) {
  return [...stylesheet.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selector, declarations]) =>
      /font-size\s*:/.test(declarations) &&
      /input\s*\[data-vt-studio-control\s*=\s*["']true["']\]/.test(selector) &&
      !/textarea/.test(selector)
    );
}
assert.deepEqual(nativeInputFontSizeRules(readFileSync("src/styles/studio-control-system.css", "utf8")), []);
assert.deepEqual(nativeInputFontSizeRules(readFileSync("src/styles/studio-control-fields.css", "utf8")), []);

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
