import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const tokens = read("src/studio-ui/tokens.ts");
const controls = read("src/studio-ui/primitives/StudioControls.tsx");
const generated = read("src/styles/studio-control-vars.generated.css");
const system = read("src/styles/studio-control-system.css");
const fields = read("src/styles/studio-control-fields.css");
const splitInput = read("src/studio-ui/primitives/StudioSplitTextInput.tsx");
const splitInputCss = read("src/styles/studio-split-text-input.css");
const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx");

const tiers = {
  supreme: { height: 60, stroke: 3, radius: 6, fontSize: 52, iconSize: 52 },
  standard: { height: 44, stroke: 3, radius: 6, fontSize: 38, iconSize: 38 },
  compact: { height: 28, stroke: 2, radius: 4, fontSize: 24, iconSize: 24 },
  mini: { height: 20, stroke: 1.5, radius: 3, fontSize: 17.5, iconSize: 17.5 },
  micro: { height: 12, stroke: 1.5, radius: 3, fontSize: 10, iconSize: 10 },
};

test("all five size tiers are canonical, generated, and consumed by the system", () => {
  for (const [tier, values] of Object.entries(tiers)) {
    const tokenBlock = tokens.match(new RegExp(`\\b${tier}:\\s*\\{([^}]*)\\}`))?.[1];
    assert.ok(tokenBlock, `missing ${tier} token object`);
    for (const [key, value] of Object.entries(values)) {
      assert.match(tokenBlock, new RegExp(`\\b${key}:\\s*${String(value).replace(".", "\\.")}(?:,|\\s)`), `${tier}.${key} token`);
      assert.match(generated, new RegExp(`--vt-studio-${tier}-${key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}:\\s*${value}(?:px)?;`), `${tier}.${key} generated variable`);
    }
    assert.ok(system.includes(`data-size="${tier}"`), `${tier} is consumed by the system stylesheet`);
  }
});

test("the component-level size documentation agrees with the authoritative 52px Supreme and 17.5px Mini typography", () => {
  assert.match(controls, /supreme 60px\\s*\\/\\s*3px border\\s*\\/\\s*6px radius\\s*\\/\\s*52px type and icon/i);
  assert.match(controls, /mini 20px\\s*\\/\\s*1\\.5px border\\s*\\/\\s*3px radius\\s*\\/\\s*17\\.5px type and icon/i);
});

test("editable inputs and textareas switch text fill and glyph stroke together on focus", () => {
  const focusRule = fields.match(/Focused entered text is black[\\s\\S]*?\\n}\\n/)?.[0] ?? "";
  assert.ok(focusRule, "shared editable-field focus rule must exist");
  assert.match(focusRule, /color:\\s*#000/);
  assert.match(focusRule, /-webkit-text-fill-color:\\s*#000/);
  assert.match(focusRule, /-webkit-text-stroke-color:\\s*#000/);
  assert.match(fields, /-webkit-text-stroke-color var\\(--vt-studio-focus-outline-fade-ms, 500ms\\) ease-out/);
  assert.match(fields, /color var\\(--vt-studio-focus-outline-fade-ms, 500ms\\) ease-out/);
});

test("split text input accepts every canonical size supported by its production badge foundation", () => {
  assert.match(splitInput, /import type \\{ StudioControlSize \\} from "\\.\\.\\/tokens"/);
  assert.match(splitInput, /sizeVariant\\?: StudioControlSize/);
  assert.doesNotMatch(splitInput, /sizeVariant\\?: "standard" \\| "compact"/);
  assert.match(splitInputCss, /height: var\(--vt-studio-control-height, 44px\)/);
  assert.match(splitInputCss, /grid-template-columns:[\s\S]*?var\(--vt-studio-control-height, 44px\)/);
});

test("Confirmed Library keeps the split text input in the canonical Text Fields family", () => {
  assert.match(catalog, /StudioSplitTextInput/);
  assert.match(catalog, /Text Fields/);
});
