import { readFileSync } from "node:fs";

const barrel = readFileSync("src/studio-ui/index.ts", "utf8");
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");

function exportedNames(source) {
  const entries = [];
  for (const match of source.matchAll(/export\s+(type\s+)?\{([\s\S]*?)\}\s+from\s+["'][^"']+["']/g)) {
    const typeOnly = Boolean(match[1]);
    for (const part of match[2].split(",")) {
      const clean = part.trim().replace(/^type\s+/, "");
      if (!clean) continue;
      const [origin, alias] = clean.split(/\s+as\s+/);
      entries.push({ name: (alias || origin).trim(), origin: origin.trim(), typeOnly });
    }
  }
  return entries;
}

function hasJsxRepresentative(source, name) {
  return new RegExp("<" + name + "(?=[\\s/>])").test(source)
    || new RegExp("(?:Component\\s*:\\s*|Component\\s*=\\s*\\{)" + name + "\\b").test(source);
}

const dispositions = {}

const entries = exportedNames(barrel).filter(entry => !entry.typeOnly && /^Studio/.test(entry.name));
const rows = entries.map(entry => {
  const represented = hasJsxRepresentative(catalog, entry.name);
  return {
    ...entry,
    status: represented ? "rendered-representative" : dispositions[entry.name] ? "documented-exception" : "unresolved-gap",
    disposition: represented ? "Direct JSX representative found in Confirmed Primitive Library." : dispositions[entry.name] || "No direct JSX representative found; classify as public primitive, composition, layout, recipe, utility, or deprecated alias.",
  };
});

const counts = rows.reduce((acc, row) => ({ ...acc, [row.status]: (acc[row.status] || 0) + 1 }), {});
console.log("Studio public export → Confirmed catalog matrix");
console.log(JSON.stringify({ counts, entries: rows }, null, 2));
if (rows.some(row => row.status === "unresolved-gap")) {
  console.error("Unresolved public exports remain; see entries with status unresolved-gap.");
  process.exitCode = 1;
}
