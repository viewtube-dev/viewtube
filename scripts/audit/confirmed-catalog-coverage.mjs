import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const read = (path) => {
  const fullPath = resolve(process.cwd(), path)
  if (!existsSync(fullPath)) {
    console.error("Missing file:", path)
    process.exitCode = 1
    return ""
  }
  return readFileSync(fullPath, "utf8")
}

const entry = read("src/styles/studio-control-entry.css")
const overrides = read("src/styles/studio-control-distill-overrides.css")
const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
const controls = read("src/studio-ui/primitives/StudioControls.tsx")
const index = read("src/studio-ui/index.ts")
const moduleFile = read("src/components/studio-hub/ConfirmedCatalogModules.tsx")
const catalogStyles = read("src/styles/studio-confirmed-catalog-modules.css")
const brain = read("src/views/AIBrainCommandInterface.tsx")

const focusSelectorStart = overrides.indexOf(":is(:focus, :focus-visible)")
const focusRules = focusSelectorStart >= 0 ? overrides.slice(focusSelectorStart) : ""
const checks = [
  ["distill overrides imported after field/parity styles", entry.indexOf('./studio-control-distill-overrides.css') > entry.indexOf('./studio-field-parity.css')],
  ["focused field text is black", focusRules.includes("color: #000 !important") && focusRules.includes("-webkit-text-fill-color: #000 !important")],
  ["focused field preserves primary inline text stroke", focusRules.includes("-webkit-text-stroke-color: var(--vt-field-primary")],
  ["focus fill uses primary at 15 percent", focusRules.includes(") 15%, transparent) !important")],
  ["single-line labels clip instead of ellipsis", overrides.includes("text-overflow: clip") && !overrides.includes("text-overflow: ellipsis")],
  ["square icon group uses content width", overrides.includes(".vt-studio-square-icon-button-group") && overrides.includes("width: max-content")],
  ["bar toggle retains visible individual bars", overrides.includes(".vt-studio-value-toggle__bar") && overrides.includes("border: 1px solid #000")],
  ["stacked toggle divider is centered", overrides.includes(".vt-studio-value-toggle__arrow-stack::after") && overrides.includes("top: 50%") && overrides.includes("translateY(-50%)")],
  ["catalog uses canonical StudioTopSplitModule", catalog.includes("StudioTopSplitModule") && controls.includes("StudioTopSplitModule")],
  ["catalog uses canonical StudioSquareIconButtonGroup", catalog.includes("StudioSquareIconButtonGroup") && controls.includes("StudioSquareIconButtonGroup")],
  ["Brain feedback uses canonical icon-button group", brain.includes("BrainFeedbackControls") && brain.includes("<StudioSquareIconButtonGroup")],
  ["primitive specimen sections are collapsed-by-default disclosures", catalog.includes('data-vt-confirmed-primitive="true"') && catalog.includes('className="vt-confirmed-primitive-summary"') && !/const Family:[\s\S]*?<details[^>]*\bopen=/.test(catalog)],
  ["global defaults is collapsed by default", catalog.includes('data-vt-confirmed-family="defaults"') && !/data-vt-confirmed-family="defaults"[^>]*\bopen=/.test(catalog)],
  ["catalog imports disclosure styles", catalog.includes('import "../../styles/studio-confirmed-catalog-modules.css"') && catalogStyles.includes(".vt-confirmed-primitive-summary")],
  ["module components are exported", moduleFile.includes("ConfirmedFamilyModule") && moduleFile.includes("ConfirmedPrimitiveModule") && index.includes("ConfirmedDefaultsModule")],
  ["all eight requested family groups are declared", [
    "Text Fields", "Buttons", "Modules & Frames", "Dropdowns",
    "Controls", "Text Controls", "Compounds", "Compositions",
  ].every((family) => catalog.includes(`"${family}"`)) && catalog.includes("CONFIRMED_CATALOG_FAMILIES")],
  ["global defaults render before the eight family groups", catalog.indexOf("{defaults}") >= 0 && catalog.indexOf("{defaults}") < catalog.indexOf("vt-confirmed-family-grid")],

  ["retired CLEAN COMPOSITION specimen is absent from confirmed catalog", !/CLEAN COMPOSITION|Confirmed Specimen Grid\s*[·-]\s*Layout Contract/i.test(catalog)],
]

const requiredP0 = [
  "StudioTextInput", "StudioTextArea", "StudioTextBox", "StudioButton",
  "StudioActionButton", "StudioSquareIconButtonGroup", "StudioTopSplitModule",
  "StudioUploadFrame", "StudioSimpleDropdown", "StudioSplitLeftDropdown",
  "StudioSwitch", "StudioRadio", "StudioCheckbox", "StudioXCheckbox",
  "StudioWordToggle", "StudioArrowToggle", "StudioSideToggle", "StudioDoubleSideToggle",
  "StudioBarToggle", "StudioSplitAccordion", "StudioPublishingCard", "StudioBrainStatusBadge",
  "StudioCounter", "StudioSideCounter", "StudioDoubleSplitSlider",
]
const missingP0 = requiredP0.filter((name) => !catalog.includes(name))
checks.push(["P0 canonical specimen coverage", missingP0.length === 0])

let failed = false
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`)
  if (!ok) failed = true
}
if (missingP0.length) console.error("Missing P0 specimens:", missingP0.join(", "))
if (failed) process.exit(1)
console.log("Static wiring checks passed. Eight-family grouping and browser verification remain release gates.")
