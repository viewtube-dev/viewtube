import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);
const TEST_PATH = /(?:^|\/)(?:__tests__\/|[^/]+\.(?:test|spec)\.[^.]+$)/i;

const walkSourceFiles = (directory, rootDir, output = []) => {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isDirectory()) {
      if (["node_modules", "dist", "build", ".git", "coverage", ".next", "vendor"].includes(entry.name)) continue;
      walkSourceFiles(path.join(directory, entry.name), rootDir, output);
      continue;
    }
    if (!entry.isFile() || !SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;
    const absolutePath = path.join(directory, entry.name);
    output.push({
      path: path.relative(rootDir, absolutePath).split(path.sep).join("/"),
      content: fs.readFileSync(absolutePath, "utf8"),
    });
  }
  return output;
};

const parseExportedGenerationFunctions = (source) => {
  const names = new Set();
  const expression = /export\s+(?:async\s+)?(?:const|function)\s+([A-Za-z_$][\w$]*)/g;
  for (const match of source.matchAll(expression)) names.add(match[1]);
  return [...names].sort();
};

const isGeminiModule = (specifier) => /(?:^|\/)gemini(?:\.[a-z0-9]+)?$/i.test(specifier);

const importsForGemini = (content) => {
  const bindings = [];
  const staticImport = /import\s+(?:type\s+)?\{([\s\S]*?)\}\s+from\s+["']([^"']+)["'];?/g;
  for (const match of content.matchAll(staticImport)) {
    if (!isGeminiModule(match[2])) continue;
    for (const item of match[1].split(",")) {
      const binding = item.trim().replace(/^type\s+/, "");
      if (!binding) continue;
      const [imported, local] = binding.split(/\s+as\s+/).map((part) => part.trim());
      bindings.push({ imported, local: local || imported, kind: "named" });
    }
  }

  const namespaceImport = /import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+["']([^"']+)["'];?/g;
  for (const match of content.matchAll(namespaceImport)) {
    if (isGeminiModule(match[2])) bindings.push({ imported: "*", local: match[1], kind: "namespace" });
  }
  return bindings;
};

const isTestFile = (relativePath) => TEST_PATH.test(relativePath);

const collectLineMatches = (files, pattern, mapMatch) => files
  .filter((file) => file.path.startsWith("src/") && !isTestFile(file.path))
  .flatMap((file) => file.content.split(/\r?\n/).flatMap((line, index) => {
    const match = line.match(pattern);
    return match ? [mapMatch(file, line, index + 1, match)] : [];
  }));

const collectModelIds = (files) => {
  const byId = new Map();
  for (const file of files.filter((entry) => entry.path.startsWith("src/") && !isTestFile(entry.path))) {
    for (const [index, line] of file.content.split(/\r?\n/).entries()) {
      for (const match of line.matchAll(/\b(gemini-[a-z0-9][a-z0-9.-]*)\b/gi)) {
        const id = match[1];
        const current = byId.get(id) || { id, references: [] };
        current.references.push({ path: file.path, line: index + 1 });
        byId.set(id, current);
      }
    }
  }
  return [...byId.values()].sort((left, right) => left.id.localeCompare(right.id));
};

const collectProviderAllowlist = (files) => {
  const guard = files.find((file) => file.path === "src/services/brain/__tests__/brainProviderArchitectureGuard.test.ts");
  if (!guard) return [];
  const block = guard.content.match(/ALLOWED_DIRECT_PROVIDER_CALLS\s*=\s*new Set\(\[([\s\S]*?)\]\)/);
  return block ? [...block[1].matchAll(/["']([^"']+)["']/g)].map((match) => match[1]) : [];
};

export const buildGenerationCallerInventory = (rootDir = process.cwd()) => {
  const sourceRoot = path.join(rootDir, "src");
  const files = walkSourceFiles(rootDir, rootDir);
  const geminiPath = path.join(sourceRoot, "services", "gemini.ts");
  const geminiSource = fs.existsSync(geminiPath) ? fs.readFileSync(geminiPath, "utf8") : "";
  const exports = parseExportedGenerationFunctions(geminiSource);

  const inventory = exports.map((name) => {
    const productionCallers = [];
    const testReferences = [];
    const importOnlyReferences = [];

    for (const file of files) {
      if (file.path === "src/services/gemini.ts") continue;
      const bindings = importsForGemini(file.content);
      const matching = bindings.filter((binding) => binding.imported === name || binding.kind === "namespace");
      if (!matching.length) continue;

      const importLines = file.content.split(/\r?\n/);
      const withoutImports = file.content.replace(/import\s+(?:type\s+)?\{[\s\S]*?\}\s+from\s+["'][^"']+["'];?/g, " ");
      const references = [];
      for (const binding of matching) {
        const usage = binding.kind === "namespace"
          ? new RegExp(`\\b${binding.local}\\s*\\.\\s*${name}\\b`, "g")
          : new RegExp(`\\b${binding.local}\\b`, "g");
        const count = [...withoutImports.matchAll(usage)].length;
        if (count > 0) {
          const lines = [];
          for (let index = 0; index < importLines.length; index += 1) {
            if (usage.test(importLines[index])) lines.push(index + 1);
            usage.lastIndex = 0;
          }
          references.push({ count, lines });
        }
      }

      if (!references.length) {
        importOnlyReferences.push({ path: file.path });
        continue;
      }

      const record = {
        path: file.path,
        referenceCount: references.reduce((sum, item) => sum + item.count, 0),
        lines: [...new Set(references.flatMap((item) => item.lines))].sort((a, b) => a - b),
      };
      if (isTestFile(file.path)) testReferences.push(record);
      else productionCallers.push(record);
    }

    let status = "no_static_import_reference";
    if (productionCallers.length) status = "production_import_and_reference";
    else if (testReferences.length) status = "test_only_reference";
    else if (importOnlyReferences.length) status = "imported_without_reference";

    return {
      name,
      status,
      productionCallers,
      testReferences,
      importOnlyReferences,
    };
  });

  const productionFiles = files.filter((file) => file.path.startsWith("src/") && !isTestFile(file.path));
  const directProviderInvocations = collectLineMatches(
    files,
    /\b(?:new\s+GoogleGenAI\s*\(|models\.(?:generateContent|generateContentStream|embedContent|generateImages|generateVideos|countTokens)\s*\()/,
    (file, line, lineNumber) => ({ path: file.path, line: lineNumber, excerpt: line.trim() }),
  );
  const dynamicGeminiImports = collectLineMatches(
    files,
    /\bimport\s*\(\s*["'][^"']*gemini(?:\.[a-z0-9]+)?["']\s*\)/i,
    (file, line, lineNumber) => ({ path: file.path, line: lineNumber, excerpt: line.trim() }),
  );
  const credentialAliasReferences = collectLineMatches(
    files,
    /\b(yt_api_key|vt_gemini_api_key|gemini_api_key|google_api_key)\b/,
    (file, line, lineNumber, match) => ({ alias: match[1], path: file.path, line: lineNumber }),
  );
  const modelIdLiterals = collectModelIds(files);
  const providerAllowlist = collectProviderAllowlist(files);
  const pricingAndMeteringSources = productionFiles
    .filter((file) => /src\/services\/(?:billingEntitlement|geminiModelGovernance|gemini)\.ts$/.test(file.path))
    .map((file) => file.path);
  const fallbackPolicySources = productionFiles
    .filter((file) => /src\/services\/(?:gemini|geminiModelGovernance)\.ts$/.test(file.path) && /fallback|candidate/i.test(file.content))
    .map((file) => file.path);

  return {
    schemaVersion: "vt-ai-generation-caller-inventory-v2",
    source: "src/services/gemini.ts",
    method: "static named/namespace import references plus direct SDK, dynamic import, model ID, credential alias and allowlist scans",
    limitations: [
      "Static source scan is a reachability lead, not proof of runtime execution.",
      "Dynamic imports are reported only when their literal path names a Gemini module; variable paths require manual tracing.",
      "Re-exports, dependency injection, reflection, generated code, and provider wrappers may require manual tracing.",
      "A referenced export may still be unreachable from a user-facing route.",
      "Model ID literals may be comments, tests, examples or compatibility candidates; classify before changing the registry.",
      "Do not delete or migrate an export from this report alone.",
    ],
    summary: {
      sourceFileCount: productionFiles.length,
      exportCount: inventory.length,
      productionReferenced: inventory.filter((entry) => entry.status === "production_import_and_reference").length,
      testOnlyReferenced: inventory.filter((entry) => entry.status === "test_only_reference").length,
      importedWithoutReference: inventory.filter((entry) => entry.status === "imported_without_reference").length,
      noStaticImportReference: inventory.filter((entry) => entry.status === "no_static_import_reference").length,
      directProviderInvocationCount: directProviderInvocations.length,
      dynamicGeminiImportCount: dynamicGeminiImports.length,
      modelIdCount: modelIdLiterals.length,
      credentialAliasReferenceCount: credentialAliasReferences.length,
    },
    surface: {
      directProviderInvocations,
      dynamicGeminiImports,
      modelIdLiterals,
      credentialAliasReferences,
      providerAllowlist,
      pricingAndMeteringSources,
      fallbackPolicySources,
    },
    exports: inventory,
  };
};

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  const inventory = buildGenerationCallerInventory(process.cwd());
  process.stdout.write(`${JSON.stringify(inventory, null, 2)}\n`);
}
