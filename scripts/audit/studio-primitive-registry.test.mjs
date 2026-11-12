import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { analyzeSource, buildRegistry } from "./studio-primitive-registry.mjs";

test("parses aliased named imports, type-only imports, re-exports, and JSX local names", () => {
  const parsed = analyzeSource(`
    import { StudioButton as Button, type StudioButtonProps } from "../studio-ui";
    export { StudioTextInput as PublicTextInput } from "./fields";
    export type { StudioTextInputProps } from "./fields";
    export function Example() { return <><Button /><StudioTextInput /></>; }
  `, "/repo/src/views/example.tsx");
  assert.deepEqual(parsed.imports[0].bindings, [
    { imported: "StudioButton", local: "Button", typeOnly: false },
    { imported: "StudioButtonProps", local: "StudioButtonProps", typeOnly: true },
  ]);
  assert.deepEqual(parsed.exports, [
    { exported: "PublicTextInput", origin: "StudioTextInput", typeOnly: false, source: "./fields" },
    { exported: "StudioTextInputProps", origin: "StudioTextInputProps", typeOnly: true, source: "./fields" },
  ]);
  assert.deepEqual(parsed.jsxTags.sort(), ["Button", "StudioTextInput"]);
});

test("builds a derived public-export and consumer graph from the existing catalog and barrel", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "studio-primitive-registry-"));
  const write = (relativePath, content) => {
    const fullPath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  };
  try {
    write("tsconfig.json", JSON.stringify({ compilerOptions: { moduleResolution: "bundler", module: "esnext", jsx: "react-jsx" } }));
    write("src/studio-ui/index.ts", 'export { StudioButton } from "./primitives/StudioButton";');
    write("src/studio-ui/primitives/StudioButton.tsx", "export const StudioButton = () => null;");
    write("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx",
      'import { StudioButton } from "../../studio-ui"; export const Catalog = () => <><div data-vt-library-component="StudioButton"><StudioButton /></div><div data-vt-library-component="StudioGhost"><StudioButton /></div></>;');
    write("src/views/Consumer.tsx",
      'import { StudioButton as Button } from "../studio-ui"; export const Consumer = () => <Button />;');

    const report = buildRegistry(root);
    assert.equal(report.summary.publicStudioValueExports, 1);
    assert.equal(report.publicExports[0].status, "public-represented");
    assert.equal(report.publicExports[0].representativeMarker, true);
    assert.equal(report.publicExports[0].rendered, true);
    const button = report.consumers.find((row) => row.name === "StudioButton");
    assert.ok(button);
    assert.ok(button.productionConsumers.includes("src/views/Consumer.tsx"));
    assert.ok(button.productionConsumers.includes("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("target branch controls already in the barrel are classified as public exports", () => {
  const root = process.cwd();
  const report = buildRegistry(root);
  const names = report.publicExports.map((row) => row.name);
  for (const name of ["StudioNumberInput", "StudioVerticalWordToggle", "StudioBrainStatusIndicator", "StudioSplitLeftDropdown", "StudioDoubleSplitSlider"]) {
    assert.ok(names.includes(name), `${name} should be recognized as a public barrel export`);
  }
  assert.equal(report.catalogOnlyUnexportedSymbols.every((row) => row.status === "not-exported-from-public-barrel-owner-disposition-required"), true);
});

test("a library marker must wrap the matching primitive, not merely coexist elsewhere in the catalog", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "studio-primitive-marker-"));
  const write = (relativePath, source) => {
    const fullPath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, source);
  };
  try {
    write("tsconfig.json", JSON.stringify({ compilerOptions: { moduleResolution: "bundler", module: "esnext", jsx: "react-jsx" } }));
    write("src/studio-ui/index.ts", 'export { StudioButton } from "./primitives/StudioButton";');
    write("src/studio-ui/primitives/StudioButton.tsx", "export const StudioButton = () => null;");
    write("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx",
      'import { StudioButton } from "../../studio-ui"; export const Catalog = () => <><div data-vt-library-component="StudioButton"><span>Missing primitive</span></div><div><StudioButton /></div></>;');
    const report = buildRegistry(root);
    assert.equal(report.publicExports[0].representativeMarker, false);
    assert.equal(report.publicExports[0].rendered, true);
    assert.equal(report.publicExports[0].status, "public-imported-without-representative");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
