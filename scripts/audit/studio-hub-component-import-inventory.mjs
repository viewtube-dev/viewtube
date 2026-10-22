#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export function analyzeSource(source, fileName = "unknown.tsx") {
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const imports = [];
  const jsxComponents = new Set();
  for (const statement of file.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const bindings = [];
      const clause = statement.importClause;
      if (clause?.name) bindings.push({ imported: "default", local: clause.name.text });
      if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) bindings.push({ imported: "*", local: clause.namedBindings.name.text });
      if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) bindings.push({ imported: element.propertyName?.text ?? element.name.text, local: element.name.text });
      }
      imports.push({ source: statement.moduleSpecifier.text, kind: "static", bindings });
    }
  }
  const visit = (node) => {
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      imports.push({ source: node.arguments[0].text, kind: "dynamic", bindings: [] });
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName;
      if (ts.isIdentifier(tag) && /^[A-Z]/.test(tag.text)) jsxComponents.add(tag.text);
      else if (ts.isPropertyAccessExpression(tag) && ts.isIdentifier(tag.expression)) jsxComponents.add(tag.expression.text + "." + tag.name.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return { imports, jsxComponents: [...jsxComponents], parseDiagnostics: file.parseDiagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")) };
}

function resolveLocal(specifier, importer, options) {
  const resolved = ts.resolveModuleName(specifier, importer, options, ts.sys).resolvedModule;
  return resolved?.resolvedFileName ?? null;
}

function optionsFromConfig(root) {
  const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.app.json") ?? ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");
  if (!configPath) return {};
  const read = ts.readConfigFile(configPath, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(read.config, ts.sys, path.dirname(configPath)).options;
}

export function buildInventory(root = process.cwd(), entry = path.join(root, "src/views/StudioHub.tsx")) {
  const options = optionsFromConfig(root);
  const seen = new Set();
  const files = [];
  const unresolved = [];
  const queue = [{ file: entry, parent: null, via: null }];
  while (queue.length) {
    const next = queue.shift();
    const filePath = path.resolve(next.file);
    if (seen.has(filePath)) continue;
    seen.add(filePath);
    let source;
    try { source = fs.readFileSync(filePath, "utf8"); }
    catch { unresolved.push({ importer: next.parent, specifier: next.via, resolvedPath: filePath }); continue; }
    const parsed = analyzeSource(source, filePath);
    const record = { file: path.relative(root, filePath).replaceAll(path.sep, "/"), importedBy: next.parent ? path.relative(root, next.parent).replaceAll(path.sep, "/") : null, via: next.via, jsxComponents: parsed.jsxComponents, imports: [], parseDiagnostics: parsed.parseDiagnostics };
    files.push(record);
    for (const item of parsed.imports) {
      const resolved = resolveLocal(item.source, filePath, options);
      const local = item.source.startsWith(".") || item.source.startsWith("/");
      record.imports.push({ ...item, resolvedPath: resolved && path.relative(root, resolved).replaceAll(path.sep, "/"), external: !local });
      if (resolved && resolved.startsWith(root + path.sep) && !seen.has(resolved)) queue.push({ file: resolved, parent: filePath, via: item.source });
      else if (!resolved && local) unresolved.push({ importer: record.file, specifier: item.source, kind: item.kind });
    }
  }
  files.sort((a, b) => a.file.localeCompare(b.file));
  const edges = files.flatMap((f) => f.imports.filter((i) => i.resolvedPath));
  const tags = new Set(files.flatMap((f) => f.jsxComponents));
  return { generatedAt: new Date().toISOString(), entry: path.relative(root, entry).replaceAll(path.sep, "/"), summary: { reachableFiles: seen.size, resolvedImportEdges: edges.length, jsxTagNames: tags.size, unresolvedLocalImports: unresolved.length }, files, unresolved };
}

function renderMarkdown(report) {
  const rows = report.files.map((f) => "| `" + f.file + "` | " + (f.importedBy ? "`" + f.importedBy + "`" : "Studio Hub entry") + " | " + (f.jsxComponents.map((x) => "`" + x + "`").join(", ") || "—") + " | " + f.imports.filter((i) => i.resolvedPath).length + " |").join("\n");
  const missing = report.unresolved.map((x) => "- `" + (x.importer ?? "unknown") + "` → `" + x.specifier + "`").join("\n") || "- None.";
  return "# Studio Hub Component Import Inventory\n\nGenerated from the recursive static import graph rooted at `src/views/StudioHub.tsx`. Conditional rendering, registry-driven components and runtime-only paths require review.\n\n- Reachable files: " + report.summary.reachableFiles + "\n- Resolved import edges: " + report.summary.resolvedImportEdges + "\n- JSX tag names: " + report.summary.jsxTagNames + "\n- Unresolved local imports: " + report.summary.unresolvedLocalImports + "\n\n| File | Imported by | JSX component tags | Resolved imports |\n|---|---|---|---:|\n" + rows + "\n\n## Unresolved local imports\n\n" + missing + "\n";
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const root = process.cwd();
  const entry = path.resolve(root, process.argv[2] ?? "src/views/StudioHub.tsx");
  if (!fs.existsSync(entry)) throw new Error("Studio Hub entry not found: " + entry);
  const report = buildInventory(root, entry);
  const output = path.join(root, "reports/studio-hub-component-import-inventory");
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "studio-hub-component-import-inventory.json"), JSON.stringify(report, null, 2) + "\n");
  fs.writeFileSync(path.join(output, "studio-hub-component-import-inventory.md"), renderMarkdown(report));
  console.log(JSON.stringify(report.summary, null, 2));
  if (report.unresolved.length) process.exitCode = 1;
}
