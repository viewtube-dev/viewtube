import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const input = readFileSync("src/studio-ui/primitives/StudioTextInput.tsx", "utf8");
const css = readFileSync("src/styles/studio-text-input.css", "utf8");
const main = readFileSync("src/main.tsx", "utf8");
const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8");
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");
const fieldStyles = readFileSync("src/styles/studio-control-fields.css", "utf8");
const systemStyles = readFileSync("src/styles/studio-control-system.css", "utf8");

// The foundation is exactly one native input primitive with no label branches.
assert.ok(input.includes("export const StudioTextInput = React.forwardRef"));
assert.ok(input.includes('"vt-studio-text-input"'));
assert.ok(input.includes("data-size={sizeVariant}"));
assert.ok(input.includes('data-vt-studio-control="true"'));
// The simple input remains the default, and the same primitive owns both label wrappers.
assert.ok(input.includes('variant?: "simple"'));
assert.ok(input.includes('variant: "floating-label"'));
assert.ok(input.includes('variant: "fixed-label"'));
assert.ok(input.includes('className?: string'));
assert.ok(input.includes('fieldClassName?: string'));
assert.ok(input.includes('vt-studio-floating-field'));
assert.ok(input.includes('vt-studio-fixed-label-field'));
assert.ok(input.includes('vt-studio-floating-field-label'));
assert.ok(input.includes('vt-studio-fixed-field-label'));
assert.ok(input.includes('import "../../styles/studio-control-entry.css"'));
assert.ok(input.includes('import "../../styles/studio-text-input.css"'));

// The plain input stylesheet is the only native input font-size authority.
assert.ok(css.includes('input.vt-studio-text-input[data-size="standard"]'));
assert.ok(css.includes("font-size: var(--vt-studio-standard-font-size, 38px);"));
assert.ok(css.includes('input.vt-studio-text-input[data-size="compact"]'));
assert.ok(css.includes("font-size: var(--vt-studio-compact-font-size, 24px);"));
assert.ok(css.includes('input.vt-studio-text-input[data-size="micro"]'));
assert.ok(css.includes("font-size: var(--vt-studio-micro-font-size, 10px);"));
assert.ok(css.includes("-webkit-text-stroke: var(--vt-studio-control-text-stroke, 1px) var(--vt-studio-control-accent, var(--pair-a, #36e0f6));"));
assert.ok(!/textarea[^{}]*\{/.test(css));
assert.ok(!css.includes(".vt-studio-floating-field-label") && !css.includes(".vt-studio-fixed-field-label"));

function nativeInputFontSizeRules(stylesheet) {
  return [...stylesheet.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selector, declarations]) =>
      /font-size\s*:/.test(declarations) &&
      /input\s*\[data-vt-studio-control\s*=\s*["']true["']\]/.test(selector) &&
      !/textarea/.test(selector)
    );
}
assert.deepEqual(nativeInputFontSizeRules(systemStyles), []);
assert.deepEqual(nativeInputFontSizeRules(fieldStyles), []);

// Root loads the old shared controls first and the plain input foundation after it.
assert.ok(main.indexOf("import './index.css'") < main.indexOf("import './styles/studio-text-input.css'"));
assert.ok(main.indexOf("import './styles/studio-control-fields.css'") < main.indexOf("import './styles/studio-text-input.css'"));
assert.ok(!controls.slice(0, 900).includes("studio-control-entry.css"));
assert.ok(!controls.slice(0, 900).includes("studio-control-fields.css"));

// Catalog shows the plain standard and compact specimens plus the label variants.
const inputFamilyStart = catalog.indexOf('<Family title="Studio Text Input');
const textareaFamilyStart = catalog.indexOf('<Family title="Studio Text Area', inputFamilyStart);
assert.ok(inputFamilyStart >= 0 && textareaFamilyStart > inputFamilyStart);
const inputFamily = catalog.slice(inputFamilyStart, textareaFamilyStart);
assert.ok(inputFamily.includes('StudioTextInput sizeVariant="standard"'));
assert.ok(inputFamily.includes('StudioTextInput sizeVariant="compact"'));
assert.ok(inputFamily.includes('StudioTextInput variant="floating-label"'));
assert.ok(inputFamily.includes('StudioTextInput variant="fixed-label"'));
assert.ok(inputFamily.includes('floatingLabelVariant="b"'));
assert.ok(inputFamily.includes('label="TITLE"'));

// Regression guard: focused text fields retain the canonical focus stroke contract;
// risen labels share one token pair; the double-side divider stays centered.
assert.match(fieldStyles, /:focus[\s\S]*?-webkit-text-stroke-color:\s*(?:var\(--vt-field-text-stroke-focus\)|#000)/);
assert.ok(systemStyles.includes("--vt-studio-floating-label-risen-font-size: 12px;"));
assert.ok(systemStyles.includes("--vt-studio-floating-label-risen-text-stroke: 0.5px;"));
assert.ok(systemStyles.includes("font-size: var(--vt-studio-floating-label-risen-font-size, 12px) !important;"));
assert.ok(systemStyles.includes("-webkit-text-stroke-width: var(--vt-studio-floating-label-risen-text-stroke, 0.5px) !important;"));
assert.ok(systemStyles.includes("left: 50%;") && systemStyles.includes("transform: translateX(-50%);"));
assert.ok(!controls.includes('className={["vt-studio-legend-count"'));

console.log("Studio text input simple/floating/fixed variant contract: PASS");
