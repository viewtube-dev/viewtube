import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const tokens = read("src/studio-ui/tokens.ts");
const controls = read("src/studio-ui/primitives/StudioControls.tsx");
const generated = read("src/styles/studio-control-vars.generated.css");
const system = read("src/styles/studio-control-system.css");
const fields = read("src/styles/studio-control-fields.css");
const standaloneInputCss = read("src/styles/studio-text-input.css");
const splitInput = read("src/studio-ui/primitives/StudioSplitTextInput.tsx");
const splitInputCss = read("src/styles/studio-split-text-input.css");
const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx");
const catalogCss = read("src/components/studio-hub/studio-hub-primitive-catalogs.css");

const tiers = {
  supreme: { height: 60, stroke: 3, radius: 6, fontSize: 52, iconSize: 52 },
  standard: { height: 44, stroke: 3, radius: 6, fontSize: 38, iconSize: 38 },
  compact: { height: 28, stroke: 2, radius: 4, fontSize: 24, iconSize: 24 },
  mini: { height: 20, stroke: 1.5, radius: 3, fontSize: 17.5, iconSize: 17.5 },
  micro: { height: 12, stroke: 1.5, radius: 3, fontSize: 10, iconSize: 10 },
};

test("all five size tiers are canonical, generated, and consumed by the system", () => {
  for (const [tier, values] of Object.entries(tiers)) {
    const tokenBlock = tokens.match(new RegExp("\\b" + tier + ":\\s*\\{([^}]*)\\}"))?.[1];
    assert.ok(tokenBlock, "missing " + tier + " token object");
    for (const [key, value] of Object.entries(values)) {
      const numeric = String(value).replace(".", "\\.");
      assert.match(tokenBlock, new RegExp("\\b" + key + ":\\s*" + numeric + "(?:,|\\s)"), tier + "." + key + " token");
      const cssKey = key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
      assert.ok(generated.includes("--vt-studio-" + tier + "-" + cssKey + ": " + value + "px;"), tier + "." + key + " generated variable");
    }
    assert.ok(system.includes('data-size="' + tier + '"'), tier + " is consumed by the system stylesheet");
  }
});

test("component-level size documentation agrees with canonical Supreme and Mini typography", () => {
  assert.ok(controls.includes("supreme 60px / 3px border / 6px radius / 52px type and icon"));
  assert.ok(controls.includes("mini 20px / 1.5px border / 3px radius / 17.5px type and icon"));
});

test("editable inputs and textareas switch text fill and glyph stroke together on focus", () => {
  const start = fields.indexOf("Focused entered text is black");
  const end = fields.indexOf("\n}\n", start);
  assert.ok(start >= 0 && end > start, "shared editable-field focus rule must exist");
  const focusRule = fields.slice(start, end);
  assert.ok(focusRule.includes("color: #000;"));
  assert.ok(focusRule.includes("-webkit-text-fill-color: #000;"));
  assert.ok(focusRule.includes("-webkit-text-stroke-color: #000;"));
  assert.ok(fields.includes("-webkit-text-stroke-color var(--vt-studio-focus-outline-fade-ms, 500ms) ease-out"));
  assert.ok(fields.includes("color var(--vt-studio-focus-outline-fade-ms, 500ms) ease-out"));
  assert.ok(fields.includes('[data-size="mini"]'));
  assert.ok(fields.includes("--vt-studio-textarea-mini-font-size, 17.5px"));
  assert.ok(system.includes("--vt-field-text-stroke-focus: #000;"));
  assert.ok(standaloneInputCss.includes("-webkit-text-stroke-color: #000;"));
  assert.ok(!standaloneInputCss.includes("-webkit-text-stroke-color: var(--vt-studio-control-accent, var(--pair-a, #36e0f6));"));
});

test("split text input accepts every canonical size supported by its production badge foundation", () => {
  assert.ok(splitInput.includes('import type { StudioControlSize } from "../tokens"'));
  assert.ok(splitInput.includes("sizeVariant?: StudioControlSize"));
  assert.ok(!splitInput.includes('sizeVariant?: "standard" | "compact"'));
  assert.ok(splitInputCss.includes("height: var(--vt-studio-control-height, 44px)"));
  assert.ok(splitInputCss.includes("grid-template-columns: var(--vt-studio-control-height, 44px)"));
});

test("Confirmed Library keeps the split text input in the canonical Text Fields family", () => {
  assert.ok(catalog.includes("StudioSplitTextInput"));
  assert.ok(catalog.includes("Text Fields"));
  assert.ok(catalogCss.includes('[data-vt-primitive-title*="Representatives"]'));
  assert.ok(catalogCss.includes("grid-template-columns: minmax(0, 1fr)"));
  assert.ok(catalog.includes("<ConfirmedStudioCounterFamily />"));
  assert.ok(catalog.includes("<ConfirmedStudioSideCounterFamily />"));
});
