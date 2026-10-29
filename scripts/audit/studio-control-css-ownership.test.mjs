import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (path) => readFileSync(resolve(root, path), "utf8");

test("active Studio stylesheet imports resolve and retired duplicate system sheet stays absent", () => {
  const entry = read("src/styles/studio-control-entry.css");
  const imports = [...entry.matchAll(/@import\s+["']([^"']+)["']\s*;/g)].map((match) => match[1]);
  assert.ok(imports.length > 0, "stylesheet entry should declare its owned layers");

  for (const imported of imports) {
    assert.ok(existsSync(resolve(root, "src/styles", imported.replace(/^\.\//, ""))), `missing imported stylesheet: ${imported}`);
  }

  assert.equal(existsSync(resolve(root, "src/styles/studio-control-system-2.css")), false,
    "unreferenced duplicate system stylesheet must not return");
  assert.equal(entry.includes("studio-control-system-2.css"), false,
    "entry must import only the canonical system stylesheet");
  assert.equal(imports.filter((path) => path === "./studio-control-system.css").length, 1,
    "canonical system stylesheet should be imported exactly once");
});

test("stylesheet order preserves token-first and family-final ownership", () => {
  const entry = read("src/styles/studio-control-entry.css");
  const order = [
    "studio-control-vars.generated.css",
    "studio-control-system.css",
    "studio-control-core.css",
    "studio-control-fields.css",
    "studio-control-distill-overrides.css",
    "studio-control-recovery-overrides.css",
    "studio-side-rail-unify.css",
    "studio-component-grid.css",
    "studio-control-word-counter.css",
    "studio-split-text-input.css",
  ].map((name) => entry.indexOf(name));

  assert.ok(order.every((index) => index >= 0), "each active cascade layer should remain registered");
  assert.deepEqual(order, [...order].sort((a, b) => a - b),
    "token source, shared defaults, corrections and final family sheets must retain declared order");
});

test("canonical system owns one scoped spacing-unit declaration", () => {
  const system = read("src/styles/studio-control-system.css");
  assert.match(system, /\[data-vt-studio-control\] \{[^}]*--vt-studio-space-unit:\s*4px;/s,
    "the shared control root owns the spacing-unit token");
  assert.doesNotMatch(system, /:where\(\[data-vt-studio-control="true"\]\) \{[^}]*--vt-studio-space-unit:/s,
    "a second scoped declaration must not duplicate the shared control root");
});

test("recovery layer does not redeclare the global spacing-unit token", () => {
  const recovery = read("src/styles/studio-control-recovery-overrides.css");
  assert.doesNotMatch(recovery, /--vt-studio-space-unit\s*:/,
    "global spacing-unit ownership belongs to the canonical system stylesheet");
  assert.match(recovery, /--vt-field-inline-stroke:\s*var\(--vt-field-primary\)/,
    "the recovery layer keeps its distinct field-inset bridge until migrated");
});
