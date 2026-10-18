import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fields = readFileSync("src/styles/studio-control-fields.css", "utf8");
const system = readFileSync("src/styles/studio-control-system.css", "utf8");
const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");

// Raised input labels are 80% of input typography, not textarea typography.
assert.match(system, /\.vt-studio-floating-field:not\(\.is-textarea\)[\s\S]*?font-size:\s*calc\(var\(--vt-studio-floating-label-size\)\s*\*\s*\.8\)/);
assert.doesNotMatch(system, /font-size:\s*(?:14\.4|11\.2)px/);
assert.match(tokens, /floatingLabel:\s*\{[^}]*standardRestingFontSize:\s*38,[^}]*compactRestingFontSize:\s*24,[^}]*standardRaisedFontSize:\s*30\.4,[^}]*compactRaisedFontSize:\s*19\.2/s);

// Single-line input sizes stay 38px standard / 24px compact.
assert.match(fields, /font-size:\s*var\(--vt-studio-standard-font-size,\s*38px\)/);
assert.match(fields, /font-size:\s*var\(--vt-studio-compact-font-size,\s*24px\)/);

// The textarea-only exception remains 18px / 14px.
assert.match(fields, /font-size:\s*var\(--vt-studio-textarea-standard-font-size,\s*18px\)/);
assert.match(fields, /font-size:\s*var\(--vt-studio-textarea-compact-font-size,\s*14px\)/);

console.log("Studio floating-label/input typography contract: PASS");
