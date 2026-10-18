import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fields = readFileSync("src/styles/studio-control-fields.css", "utf8");
const system = readFileSync("src/styles/studio-control-system.css", "utf8");
const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8");

// Floating labels remain input labels: the raised size is 80% of the
// canonical input size, not 80% of the separate textarea typography scale.
assert.match(fields, /\.vt-studio-floating-field:not\(\.is-textarea\)[\s\S]*?font-size:\s*calc\(var\(--vt-studio-floating-label-size\)\s*\*\s*\.8\)/);
assert.match(tokens, /floatingLabel:\s*\{[^}]*standardRestingFontSize:\s*38,[^}]*compactRestingFontSize:\s*24,[^}]*standardRaisedFontSize:\s*30\.4,[^}]*compactRaisedFontSize:\s*19\.2/s);

// Canonical single-line inputs must explicitly retain the 38px / 24px scale.
assert.match(fields, /input[^{}]*\[data-size="compact"\][^{}]*\{[^}]*font-size:\s*(?:var\(--vt-studio-28-font-size,\s*24px\)|24px)/s);
assert.match(fields, /font-size:\s*(?:var\(--vt-studio-control-font-size\)|38px)/);

console.log("Studio floating-label/input typography contract: PASS");
