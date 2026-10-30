import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { buildGenerationCallerInventory } from "./ai-generation-callers.mjs";

test("buildGenerationCallerInventory distinguishes production callers, test-only references, and unreferenced exports", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "vt-generation-callers-"));
  fs.mkdirSync(path.join(rootDir, "src/services"), { recursive: true });
  fs.mkdirSync(path.join(rootDir, "src/views"), { recursive: true });
  fs.mkdirSync(path.join(rootDir, "src/services/__tests__"), { recursive: true });

  fs.writeFileSync(
    path.join(rootDir, "src/services/gemini.ts"),
    "export const generateScript = async () => {};\nexport const generateUnused = () => {};\n",
  );
  fs.writeFileSync(
    path.join(rootDir, "src/views/ScriptStudio.tsx"),
    'import { generateScript as runScript } from "../services/gemini";\nexport const run = () => runScript();\n',
  );
  fs.writeFileSync(
    path.join(rootDir, "src/services/__tests__/generation.test.ts"),
    'import { generateUnused } from "../gemini";\nvoid generateUnused;\n',
  );

  const inventory = buildGenerationCallerInventory(rootDir);
  const script = inventory.exports.find((entry) => entry.name === "generateScript");
  const unused = inventory.exports.find((entry) => entry.name === "generateUnused");

  assert.equal(script.status, "production_import_and_reference");
  assert.deepEqual(script.productionCallers.map((caller) => caller.path), ["src/views/ScriptStudio.tsx"]);
  assert.equal(unused.status, "test_only_reference");
  assert.deepEqual(unused.testReferences.map((reference) => reference.path), ["src/services/__tests__/generation.test.ts"]);
});

test("buildGenerationCallerInventory does not treat documentation mentions as runtime callers", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "vt-generation-docs-"));
  fs.mkdirSync(path.join(rootDir, "src/services"), { recursive: true });
  fs.mkdirSync(path.join(rootDir, "docs"), { recursive: true });
  fs.writeFileSync(path.join(rootDir, "src/services/gemini.ts"), "export const generateOnlyInDocs = () => {};\n");
  fs.writeFileSync(path.join(rootDir, "docs/notes.md"), "Call generateOnlyInDocs from the future runtime.\n");

  const inventory = buildGenerationCallerInventory(rootDir);
  assert.equal(inventory.exports[0].status, "no_static_import_reference");
});


test("inventory includes direct SDK calls, dynamic provider imports, model IDs, credential aliases, and provider allowlist", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "vt-generation-surface-"));
  fs.mkdirSync(path.join(rootDir, "src/services/brain/__tests__"), { recursive: true });
  fs.mkdirSync(path.join(rootDir, "src/context"), { recursive: true });
  fs.writeFileSync(path.join(rootDir, "src/services/gemini.ts"), 'export const generateScript = () => {};\nconst model = "gemini-3.1-flash-lite";\n');
  fs.writeFileSync(path.join(rootDir, "src/services/provider.ts"), [
    "const client = new GoogleGenAI({ apiKey: secret });",
    "await client.models.generateContent({ model: \"gemini-3.1-pro-preview\" });",
    "await client.models.generateContentStream({ model: \"gemini-3-flash-preview\" });",
  ].join("\n"));
  fs.writeFileSync(path.join(rootDir, "src/services/lazyProvider.ts"), 'const provider = await import("../gemini");\n');
  fs.writeFileSync(path.join(rootDir, "src/context/keyVault.ts"), 'const aliases = ["yt_api_key", "vt_gemini_api_key", "gemini_api_key", "google_api_key"];\n');
  fs.writeFileSync(path.join(rootDir, "src/services/brain/__tests__/brainProviderArchitectureGuard.test.ts"), [
    "const ALLOWED_DIRECT_PROVIDER_CALLS = new Set([",
    '  "src/services/gemini.ts",',
    '  "src/context/GeminiKeyContext.tsx",',
    "]);",
  ].join("\n"));

  const inventory = buildGenerationCallerInventory(rootDir);
  assert.deepEqual(
    inventory.surface.directProviderInvocations.map((entry) => entry.path),
    ["src/services/provider.ts"],
  );
  assert.deepEqual(
    inventory.surface.dynamicGeminiImports.map((entry) => entry.path),
    ["src/services/lazyProvider.ts"],
  );
  assert.ok(inventory.surface.modelIdLiterals.some((entry) => entry.id === "gemini-3.1-flash-lite"));
  assert.ok(inventory.surface.modelIdLiterals.some((entry) => entry.id === "gemini-3.1-pro-preview"));
  assert.ok(inventory.surface.credentialAliasReferences.some((entry) => entry.alias === "yt_api_key"));
  assert.deepEqual(inventory.surface.providerAllowlist, [
    "src/services/gemini.ts",
    "src/context/GeminiKeyContext.tsx",
  ]);
});
