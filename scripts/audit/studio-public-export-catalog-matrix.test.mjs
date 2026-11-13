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

test("every public Studio value export has a direct representative, including compatibility aliases and grid helpers", () => {
  const valueExports = exportedNames(barrel).filter(item => !item.typeOnly && /^Studio/.test(item.name));
  const missing = valueExports.filter(item => !hasJsxRepresentative(catalog, item.name)).map(item => item.name);
  assert.deepEqual(missing, [], "public Studio exports must be rendered or deliberately removed from the public barrel");
});

test("critical public primitives have direct representatives in the confirmed catalog", () => {
  const parsed = exportedNames(barrel);
  const valueExports = parsed.filter(item => !item.typeOnly);
  const critical = [
    "StudioButton", "StudioTextInput", "StudioTextArea", "StudioTextBox",
    "StudioSplitTextInput", "StudioArrowToggle", "StudioSideToggle",
    "StudioDoubleSideToggle", "StudioBarToggle", "StudioSplitAccordion", "StudioPanelAccordion", "StudioInlineStepper", "StudioSplitStepper",
    "StudioDropdown", "StudioPublishingCard", "StudioLedBadgeTab",
    "StudioChatComposerDock", "StudioChatResponseShell",
    "StudioInput", "Studioarea", "Studiotoggle", "Studioswitch", "Studioradio", "Studiocheck", "Studioxbox",
    "StudioComponentGrid", "StudioComponentGridCell", "StudioComponentGridRow",
  ];
  const missingFromBarrel = critical.filter(name => !valueExports.some(item => item.name === name));
  const missingRepresentative = critical.filter(name => !hasJsxRepresentative(catalog, name));
  assert.deepEqual(missingFromBarrel, [], "critical names should remain public exports");
  assert.deepEqual(missingRepresentative, [], "critical exports need a rendered catalog representative");
});

test("direct primitive representatives are grouped by related component family", () => {
  const sectionStart = catalog.indexOf('data-vt-confirmed-representatives="true"');
  const sectionEnd = catalog.indexOf("\n      </div>\n    </Family>", sectionStart);
  assert.notEqual(sectionStart, -1, "direct representative section should exist");
  assert.notEqual(sectionEnd, -1, "direct representative section should close");
  const section = catalog.slice(sectionStart, sectionEnd);
  const headings = [...section.matchAll(/<h4[^>]*>(.*?)<\/h4>/g)].map(match => match[1]);
  assert.deepEqual(headings, [
    "BUTTONS & ICON BUTTONS",
    "TEXT ENTRY & INPUTS",
    "DROPDOWNS",
    "SELECTION CONTROLS",
    "TOGGLES",
    "COUNTERS, STEPPERS & SLIDERS",
    "BADGES & STATUS INDICATORS",
    "LAYOUT PRIMITIVES",
    "MODULES & COMPOSITIONS",
  ]);
  const groupBounds = headings.map((heading, index) => ({
    heading,
    start: section.indexOf(">" + heading + "</h4>"),
    end: index + 1 < headings.length
      ? section.indexOf(">" + headings[index + 1] + "</h4>")
      : section.length,
  }));
  const has = (group, component) => {
    const bounds = groupBounds.find(item => item.heading === group);
    return new RegExp('data-vt-library-component="' + component + '"').test(section.slice(bounds.start, bounds.end));
  };
  assert.equal(has("TEXT ENTRY & INPUTS", "StudioSplitLeftIconRailTextInput"), true);
  assert.equal(has("TEXT ENTRY & INPUTS", "StudioSplitLeftIconButtonTextInput"), true);
  assert.equal(has("SELECTION CONTROLS", "StudioCheckbox"), true);
  assert.equal(has("TOGGLES", "StudioDoubleSideToggle"), true);
  assert.equal(has("COUNTERS, STEPPERS & SLIDERS", "StudioSplitStepper"), true);
  assert.equal(has("COUNTERS, STEPPERS & SLIDERS", "StudioSideTextCounter"), true);
  assert.equal(has("BADGES & STATUS INDICATORS", "StudioBrainStatusBadge"), true);
  assert.equal(has("MODULES & COMPOSITIONS", "StudioPanelAccordion"), true);
});

test("value-toggle gallery covers all five sizes and every supported rail variant", () => {
  const start = catalog.indexOf("const ConfirmedStudioValueToggleFamily");
  const end = catalog.indexOf("export default StudioHubConfirmedPrimitiveCatalog", start);
  assert.notEqual(start, -1, "dedicated value-toggle family should exist");
  assert.notEqual(end, -1, "catalog export should close the value-toggle family");
  const family = catalog.slice(start, end);
  assert.match(family, /const sizes = \["supreme", "standard", "compact", "mini", "micro"\] as const/);
  for (const component of ["StudioArrowToggle", "StudioSideToggle", "StudioDoubleSideToggle", "StudioBarToggle"]) {
    assert.ok(family.includes("<" + component), component + " should have dedicated specimens");
    assert.ok(family.includes("<" + component + " size={size}"), component + " should be represented at every size");
  }
  for (const side of ['"left"', '"right"', '"double"']) assert.ok(family.includes(side), "arrow icon-side variant " + side);
  for (const side of ['"left"', '"right"']) assert.ok(family.includes(side), "side-toggle arrow orientation " + side);
  for (const variant of ['"v1"', '"v2"']) assert.ok(family.includes(variant), "double-side divider variant " + variant);
  for (const appearance of ['"primary"', '"secondary"', '"black-primary-text"']) assert.ok(family.includes(appearance), "double-side right appearance " + appearance);
});

test("vertical word toggle shows every canonical skin at all five size tiers", () => {
  const start = catalog.indexOf("const CanonicalWordToggleFamily");
  const end = catalog.indexOf("\nconst Provenance", start);
  assert.notEqual(start, -1, "canonical word-toggle family should exist");
  assert.notEqual(end, -1, "canonical word-toggle family should close");
  const family = catalog.slice(start, end);
  assert.match(family, /Array\(20\)\.fill\(false\)/, "five sizes × four skins need independent state");
  assert.match(family, /const verticalSizes = \["supreme", "standard", "compact", "mini", "micro"\] as const/);
  assert.match(family, /verticalSizes\.map\(\(size, sizeIndex\)/);
  assert.ok(family.includes("sizeVariant={size}"), "each vertical size row should render its current tier");
  assert.match(family, /VERTICAL_WORD_TOGGLE_VARIANTS\.map\(\(item, variantIndex\)/,
    "each size row should render the four canonical vertical skins");
});
