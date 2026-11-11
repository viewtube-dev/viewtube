#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const SOURCE_EXTENSIONS = /\\.(?:tsx?|jsx?)$/;
const STUDIO_MODULE = /\\/src\\/studio-ui(?:\\/|$)/;

export function analyzeSource(source, fileName = "unknown.tsx") {
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const imports = [];
  const exports = [];
  const jsxTags = new Set();

  for (const statement of file.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const clause = statement.importClause;
      const bindings = [];
      if (clause?.name) bindings.push({ imported: "default", local: clause.name.text, typeOnly: Boolean(clause.isTypeOnly) });
      if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) {
          bindings.push({
            imported: element.propertyName?.text ?? element.name.text,
            local: element.name.text,
            typeOnly: Boolean(clause.isTypeOnly || element.isTypeOnly),
          });
        }
      }
      if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
        bindings.push({ imported: "*", local: clause.namedBindings.name.text, typeOnly: Boolean(clause.isTypeOnly) });
      }
      imports.push({ source: statement.moduleSpecifier.text, bindings, typeOnly: Boolean(clause?.isTypeOnly) });
    }

    if (ts.isExportDeclaration(statement) && statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
      && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) {
        exports.push({
          exported: element.name.text,
          origin: element.propertyName?.text ?? element.name.text,
          typeOnly: Boolean(statement.isTypeOnly || element.isTypeOnly),
          source: statement.moduleSpecifier.text,
        });
      }
    }
  }

  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName;
      if (ts.isIdentifier(tag)) jsxTags.add(tag.text);
      else if (ts.isPropertyAccessExpression(tag) && ts.isIdentifier(tag.expression)) jsxTags.add(tag.expression.text + "." + tag.name.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(file);

  return { imports, exports, jsxTags: [...jsxTags], parseDiagnostics: file.parseDiagnostics.map((item) => ts.flattenDiagnosticMessageText(item.messageText, "\\n")) };
}

function walkSource(root) {
  const result = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "node_modules" && entry.name !== "__tests__fixtures__") visit(full);
      } else if (SOURCE_EXTENSIONS.test(entry.name)) result.push(full);
    }
  };
  visit(path.join(root, "src"));
  return result;
}

function compilerOptions(root) {
  const config = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.app.json")
    ?? ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");
  if (!config) return { moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, allowJs: true };
  const parsed = ts.readConfigFile(config, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(parsed.config, ts.sys, path.dirname(config)).options;
}

function relative(root, file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function isStudioModule(file) {
  return STUDIO_MODULE.test(file.split(path.sep).join("/"));
}

export function buildRegistry(root = process.cwd()) {
  const options = compilerOptions(root);
  const sourceFiles = walkSource(root);
  const consumers = new Map();
  const unresolved = [];
  const parsedFiles = new Map();

  for (const filePath of sourceFiles) {
    const source = fs.readFileSync(filePath, "utf8");
    const parsed = analyzeSource(source, filePath);
    parsedFiles.set(filePath, parsed);
    for (const item of parsed.imports) {
      if (!item.source.startsWith(".") && !item.source.startsWith("/")) continue;
      const resolved = ts.resolveModuleName(item.source, filePath, options, ts.sys).resolvedModule?.resolvedFileName;
      if (!resolved) {
        unresolved.push({ importer: relative(root, filePath), specifier: item.source });
        continue;
      }
      if (!isStudioModule(resolved)) continue;
      for (const binding of item.bindings.filter((entry) => /^Studio/.test(entry.imported) && entry.imported !== "default")) {
        const list = consumers.get(binding.imported) ?? [];
        list.push({
          file: relative(root, filePath),
          module: relative(root, resolved),
          localName: binding.local,
          typeOnly: binding.typeOnly,
          rendered: parsed.jsxTags.includes(binding.local),
          testFile: /\\.(?:test|spec)\\.[jt]sx?$/.test(filePath),
        });
        consumers.set(binding.imported, list);
      }
    }
  }

  const catalogPath = path.join(root, "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx");
  const barrelPath = path.join(root, "src/studio-ui/index.ts");
  const catalog = parsedFiles.get(catalogPath) ?? analyzeSource(fs.readFileSync(catalogPath, "utf8"), catalogPath);
  const barrel = parsedFiles.get(barrelPath) ?? analyzeSource(fs.readFileSync(barrelPath, "utf8"), barrelPath);
  const catalogSource = fs.readFileSync(catalogPath, "utf8");
  const catalogBindings = catalog.imports.flatMap((item) => {
    const resolved = item.source.startsWith(".")
      ? ts.resolveModuleName(item.source, catalogPath, options, ts.sys).resolvedModule?.resolvedFileName
      : null;
    if (!resolved || !isStudioModule(resolved)) return [];
    return item.bindings.filter((binding) => /^Studio/.test(binding.imported)).map((binding) => ({ ...binding, module: relative(root, resolved) }));
  });
  const publicExports = barrel.exports.filter((entry) => /^Studio/.test(entry.exported) && !entry.typeOnly);
  const publicRows = publicExports.map((entry) => {
    const binding = catalogBindings.find((item) => item.imported === entry.exported);
    const marker = catalogSource.includes(`data-vt-library-component="${entry.exported}"`);
    const rendered = Boolean(binding && catalog.jsxTags.includes(binding.local));
    return {
      name: entry.exported,
      origin: entry.origin,
      source: entry.source,
      catalogImport: Boolean(binding),
      representativeMarker: marker,
      rendered,
      status: marker && rendered ? "public-represented" : binding ? "public-imported-without-representative" : "public-not-imported",
    };
  });
  const catalogOnlyRows = catalogBindings
    .filter((item) => !publicExports.some((entry) => entry.exported === item.imported) && !item.typeOnly)
    .map((item) => ({
      name: item.imported,
      localName: item.local,
      source: item.module,
      status: "not-exported-from-public-barrel-owner-disposition-required",
      representativeMarker: catalogSource.includes(`data-vt-library-component="${item.imported}"`),
      rendered: catalog.jsxTags.includes(item.local),
    }));

  const consumerRows = [...consumers.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([name, uses]) => ({
    name,
    consumerCount: uses.length,
    productionConsumers: uses.filter((use) => !use.testFile).map((use) => use.file).filter((value, index, all) => all.indexOf(value) === index).sort(),
    testConsumers: uses.filter((use) => use.testFile).map((use) => use.file).filter((value, index, all) => all.indexOf(value) === index).sort(),
    uses,
  }));

  return {
    target: "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx",
    summary: {
      scannedSourceFiles: sourceFiles.length,
      publicStudioValueExports: publicRows.length,
      publicExportsWithRepresentatives: publicRows.filter((row) => row.status === "public-represented").length,
      publicExportGaps: publicRows.filter((row) => row.status !== "public-represented").length,
      catalogOnlyUnexportedSymbols: catalogOnlyRows.length,
      symbolsWithConsumers: consumerRows.length,
      unresolvedLocalImports: unresolved.length,
    },
    publicExports: publicRows,
    catalogOnlyUnexportedSymbols: catalogOnlyRows,
    consumers: consumerRows,
    unresolvedLocalImports: unresolved,
  };
}

function renderMarkdown(report) {
  const publicRows = report.publicExports.map((row) => `| \`${row.name}\` | ${row.status} | ${row.source} | ${row.representativeMarker ? "yes" : "no"} | ${row.rendered ? "yes" : "no"} |`).join("\\n");
  const internalRows = report.catalogOnlyUnexportedSymbols.map((row) => `| \`${row.name}\` | ${row.status} | \`${row.source}\` | ${row.representativeMarker ? "yes" : "no"} |`).join("\\n") || "| — | None | — | — |";
  const consumerRows = report.consumers.map((row) => `| \`${row.name}\` | ${row.consumerCount} | ${row.productionConsumers.map((file) => `\`${file}\``).join(", ") || "—"} | ${row.testConsumers.length} |`).join("\\n");
  return `# Studio Primitive Registry Audit\\n\\nGenerated from the current source tree. This report is derived from production imports and the Confirmed Primitive Library; it is not a second hand-maintained registry.\\n\\n## Summary\\n\\n${Object.entries(report.summary).map(([key, value]) => `- ${key}: ${value}`).join("\\n")}\\n\\n## Public Studio exports\\n\\n| Export | Status | Export source | Catalog marker | Rendered in catalog |\\n|---|---|---|---|---|\\n${publicRows}\\n\\n## Catalog symbols not exported from the public barrel\\n\\nThese symbols are catalog imports but are not currently public-barrel exports. This is a classification queue, not an assumption that they should become public.\\n\\n| Symbol | Status | Implementation module | Catalog marker |\\n|---|---|---|---|\\n${internalRows}\\n\\n## Production consumers\\n\\n| Symbol | Import uses | Production files | Test files |\\n|---|---:|---|---:|\\n${consumerRows}\\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const root = process.cwd();
  const report = buildRegistry(root);
  const output = path.join(root, "reports/studio-primitive-registry");
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "studio-primitive-registry.json"), JSON.stringify(report, null, 2) + "\\n");
  fs.writeFileSync(path.join(output, "studio-primitive-registry.md"), renderMarkdown(report));
  console.log(JSON.stringify(report.summary, null, 2));
  if (report.summary.unresolvedLocalImports > 0) process.exitCode = 1;
}
