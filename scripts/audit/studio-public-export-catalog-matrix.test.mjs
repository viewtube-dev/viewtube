import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const barrel = readFileSync("src/studio-ui/index.ts", "utf8");
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8");

function exportedNames(source) {
  const names = [];
  for (const match of source.matchAll(/export\s+(type\s+)?\{([\s\S]*?)\}\s+from\s+["'][^"']+["']/g)) {
    const typeOnly = Boolean(match[1]);
    for (const part of match[2].split(",")) {
      const clean = part.trim().replace(/^type\s+/, "");
      if (!clean) continue;
      const [origin, alias] = clean.split(/\s+as\s+/);
      names.push({ name: (alias || origin).trim(), origin: origin.trim(), typeOnly });
    }
  }
  return names;
}

function hasJsxRepresentative(source, name) {
  return new RegExp("<" + name + "(?=[\\s/>])").test(source)
    || new RegExp("(?:Component\\s*:\\s*|Component\\s*=\\s*\\{)" + name + "\\b").test(source);
}

test("public barrel export parser preserves aliases and type-only exports", () => {
  const parsed = exportedNames('export { Thing, Other as PublicOther } from "./x";\nexport type { ThingProps } from "./x";');
  assert.deepEqual(parsed, [
    { name: "Thing", origin: "Thing", typeOnly: false },
    { name: "PublicOther", origin: "Other", typeOnly: false },
    { name: "ThingProps", origin: "ThingProps", typeOnly: true },
  ]);
});

test("confirmed catalog matrix distinguishes rendered representatives from incidental mentions", () => {
  assert.equal(hasJsxRepresentative("<StudioButton />", "StudioButton"), true);
  assert.equal(hasJsxRepresentative('import { StudioButton } from "./x"', "StudioButton"), false);
  assert.equal(hasJsxRepresentative("<ChoiceComponent />", "StudioChoice"), false);
});

test("critical public primitives have direct representatives in the confirmed catalog", () => {
  const parsed = exportedNames(barrel);
  const valueExports = parsed.filter(item => !item.typeOnly);
  const critical = [
    "StudioButton", "StudioTextInput", "StudioTextArea", "StudioTextBox",
    "StudioSplitTextInput", "StudioArrowToggle", "StudioSideToggle",
    "StudioDoubleSideToggle", "StudioBarToggle", "StudioSplitAccordion",
    "StudioDropdown", "StudioPublishingCard", "StudioLedBadgeTab",
    "StudioChatComposerDock", "StudioChatResponseShell",
  ];
  const missingFromBarrel = critical.filter(name => !valueExports.some(item => item.name === name));
  const missingRepresentative = critical.filter(name => !hasJsxRepresentative(catalog, name));
  assert.deepEqual(missingFromBarrel, [], "critical names should remain public exports");
  assert.deepEqual(missingRepresentative, [], "critical exports need a rendered catalog representative");
});
