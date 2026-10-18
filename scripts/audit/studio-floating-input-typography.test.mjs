import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fields = readFileSync("src/styles/studio-control-fields.css", "utf8");
const system = readFileSync("src/styles/studio-control-system.css", "utf8");
const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");

// Raised input labels are 80% of input typography, not textarea typography.
assert.match(system, /\.vt-studio-floating-field:not\(\.is-textarea\)[\s\S]*?font-size:\s*calc\(var\(--vt-studio-floating-label-size\)\s*\*\s*\.8\)/);
assert.doesNotMatch(system, /font-size:\s*(?:14\.4|11\.2)px/);
assert.match(tokens, /floatingLabel:\s*\{[^}]*standardRestingFontSize:\s*38,[^}]*compactRestingFontSize:\s*24,[^}]*standardRaisedFontSize:\s*30\.4,[^}]*compactRaisedFontSize:\s*19\.2/s);

// Assert that the native editable input is explicitly sized, not just its label.
assert.match(fields, /html body \.vt-studio-floating-field\.is-input > input\[data-vt-studio-control="true"\]\[data-vt-studio-field-kind="text-input"\][\s\S]*?font-size:\s*var\(--vt-studio-standard-font-size,\s*38px\)/);
assert.match(fields, /html body \.vt-studio-floating-field\.is-input > input\[data-vt-studio-control="true"\]\[data-vt-studio-field-kind="text-input"\]\[data-size="compact"\][\s\S]*?font-size:\s*var\(--vt-studio-compact-font-size,\s*24px\)/);
assert.match(fields, /html body \.vt-studio-fixed-label-field\.is-input > input\[data-vt-studio-control="true"\]\[data-vt-studio-field-kind="text-input"\]/);
assert.match(fields, /html body input\[data-vt-studio-control="true"\]\[data-vt-studio-field-kind="text-input"\]\[data-size="micro"\][\s\S]*?font-size:\s*var\(--vt-studio-micro-font-size,\s*10px\)/);

// Label typography is independently scoped to the label element.
assert.match(system, /\.vt-studio-floating-field > \.vt-studio-floating-field-label[\s\S]*?font-size:\s*var\(--vt-studio-floating-label-size\)/);
assert.match(system, /\.vt-studio-floating-field:not\(\.is-textarea\) > :is\(input, textarea\):focus \+ \.vt-studio-floating-field-label[\s\S]*?font-size:\s*calc\(var\(--vt-studio-floating-label-size\)\s*\*\s*\.8\)/);

// The textarea-only exception remains 18px / 14px.
assert.match(fields, /font-size:\s*var\(--vt-studio-textarea-standard-font-size,\s*18px\)/);
assert.match(fields, /font-size:\s*var\(--vt-studio-textarea-compact-font-size,\s*14px\)/);

console.log("Studio floating-label/input typography contract: PASS");
