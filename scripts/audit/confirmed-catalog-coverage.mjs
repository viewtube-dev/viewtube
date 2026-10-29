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
const splitInput = read("src/styles/studio-split-text-input.css")
const overrides = read("src/styles/studio-control-distill-overrides.css")
const recovery = read("src/styles/studio-control-recovery-overrides.css")
const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
const specimenGrid = read("src/components/studio-hub/ConfirmedSpecimenGrid.tsx")
const libraryAuthority = read("docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md")
const controls = read("src/studio-ui/primitives/StudioControls.tsx")
const index = read("src/studio-ui/index.ts")
const moduleFile = read("src/components/studio-hub/ConfirmedCatalogModules.tsx")
const catalogStyles = read("src/styles/studio-confirmed-catalog-modules.css")
const brain = read("src/views/AIBrainCommandInterface.tsx")
const fields = read("src/styles/studio-control-fields.css")
const system = read("src/styles/studio-control-system.css")

const checks = [
  ["distill overrides imported after field/parity styles", entry.indexOf('./studio-control-distill-overrides.css') > entry.indexOf('./studio-field-parity.css')],
  ["focused field text is black", fields.includes("color: var(--vt-field-text-focus)") && fields.includes("-webkit-text-fill-color: var(--vt-field-text-focus)") && system.includes("--vt-field-text-focus: #000;")],
  ["focused field keeps black glyph stroke with black text fill", fields.includes("-webkit-text-stroke-color: var(--vt-field-text-stroke-focus)") && system.includes("--vt-field-text-stroke-focus: #000;") && system.includes("--vt-field-text-focus: #000;")],
  ["focus fill uses primary at 15 percent", system.includes("--vt-field-fill-focus: color-mix(in srgb, var(--vt-field-primary) 15%, transparent);") && fields.includes("background-color: var(--vt-field-fill-focus);")],
  ["single-line labels clip instead of ellipsis", overrides.includes("text-overflow: clip") && !overrides.includes("text-overflow: ellipsis")],
  ["square icon group uses content width", overrides.includes(".vt-studio-square-icon-button-group") && overrides.includes("width: max-content")],
  ["bar toggle uses 50% primary fill, black active bars, and a 2.5:1 height/width ratio", overrides.includes(".vt-studio-value-toggle__bar") && overrides.includes("--vt-bar-height: var(--vt-studio-control-font-size") && overrides.includes("aspect-ratio: 2 / 5") && overrides.includes("50%, transparent") && overrides.includes('data-active="true"') && overrides.includes("background: #000 !important")],
  ["stacked toggle divider is centered", overrides.includes(".vt-studio-value-toggle__arrow-stack::after") && overrides.includes("top: 50%") && overrides.includes("translateY(-50%)")],
  ["side-toggle rails reuse Side Counter arrow metrics", system.includes(".vt-studio-value-toggle--side .vt-studio-value-toggle__arrow-stack .vt-studio-value-toggle__arrow svg") && system.includes("width: 14px;") && system.includes("width: 42px;") && system.includes("width: 30px;") && system.includes("width: 15px;")],
  ["side-toggle arrow stack has one horizontal divider owner", !system.includes(".vt-studio-value-toggle--side .vt-studio-value-toggle__arrow-stack .vt-studio-value-toggle__arrow + .vt-studio-value-toggle__arrow") && system.includes(".vt-studio-value-toggle__arrow-stack::after")],
  ["split text input keeps one shell border and one field inset border", splitInput.includes(".vt-studio-split-shell.vt-studio-split-text-input {") && splitInput.includes("box-shadow: none;") && splitInput.includes(".vt-studio-split-text-input__field {") && splitInput.includes("border: var(--vt-studio-control-stroke, 3px) solid var(--vt-field-primary") && splitInput.includes("box-shadow: none !important;") && splitInput.includes(".vt-studio-split-text-input__field:focus") && splitInput.includes("outline: none !important;")],
  ["catalog uses canonical StudioTopSplitModule", catalog.includes("StudioTopSplitModule") && controls.includes("StudioTopSplitModule")],
  ["catalog uses canonical StudioSquareIconButtonGroup", catalog.includes("StudioSquareIconButtonGroup") && controls.includes("StudioSquareIconButtonGroup")],
  ["Brain Status Badge has its own production representative row", catalog.includes('data-vt-library-component="StudioBrainStatusBadge"') && catalog.includes('<StudioBrainStatusBadge label="READY" tone="green" appearance="tinted" />')],
  ["Brain feedback uses canonical icon-button group", brain.includes("BrainFeedbackControls") && brain.includes("<StudioSquareIconButtonGroup")],
  ["primitive specimen sections are collapsed-by-default disclosures", catalog.includes('data-vt-confirmed-primitive="true"') && catalog.includes('className="vt-confirmed-primitive-summary"') && !/const Family:[\s\S]*?<details[^>]*\bopen=/.test(catalog)],
  ["global defaults is collapsed by default", catalog.includes('data-vt-confirmed-family="defaults"') && !/data-vt-confirmed-family="defaults"[^>]*\bopen=/.test(catalog)],
  ["catalog imports disclosure styles", catalog.includes('import "../../styles/studio-confirmed-catalog-modules.css"') && catalogStyles.includes(".vt-confirmed-primitive-summary")],
  ["module components are exported", moduleFile.includes("ConfirmedFamilyModule") && moduleFile.includes("ConfirmedPrimitiveModule") && index.includes("ConfirmedDefaultsModule")],
  ["all seven requested family groups are declared", [
    "Text Fields", "Buttons & Badges", "Dropdowns", "Controls",
    "Counters & Sliders", "Modules & Frames", "Compositions",
  ].every((family) => catalog.includes(`"${family}"`)) && catalog.includes("CONFIRMED_CATALOG_FAMILIES")],
  ["global defaults render before the seven family groups", catalog.indexOf("{defaults}") >= 0 && catalog.indexOf("{defaults}") < catalog.indexOf("vt-confirmed-family-grid")],

  ["retired CLEAN COMPOSITION specimen is absent from confirmed catalog", !/CLEAN COMPOSITION|Confirmed Specimen Grid\s*[·-]\s*Layout Contract/i.test(catalog)],
  ["specimen grid supports the complete five-tier global size vocabulary", specimenGrid.includes('export type SpecimenTier = "supreme" | "standard" | "compact" | "mini" | "micro"') && specimenGrid.includes('const SPECIMEN_TIERS = ["supreme", "standard", "compact", "mini", "micro"] as const')],
  ["confirmed library owns canonical production representatives while legacy tracks remain comparison-only", libraryAuthority.includes("The **Confirmed Primitive Library**") && libraryAuthority.includes("not evidence that a control is part of the public API") && libraryAuthority.includes("must not silently override the Confirmed catalog's ownership")],
]

const requiredP0 = [
  "StudioTextInput", "StudioTextArea", "StudioTextBox", "StudioUsernameInput", "StudioSplitLeftInput", "StudioButton",
  "StudioActionButton", "StudioSquareIconButtonGroup", "StudioTopSplitModule", "StudioCollapsingTwoLineModule",
  "StudioUploadFrame", "StudioDropdown", "StudioLegendMultiDropdown", "StudioSplitLeftDropdown", "StudioSplitTextInput",
  "StudioSwitch", "StudioChoice", "StudioRadio", "StudioCheckbox", "StudioXCheckbox", "StudioIconButton", "StudioSplitRightButton",
  "StudioWordToggle", "StudioArrowToggle", "StudioSideToggle", "StudioDoubleSideToggle",
  "StudioBarToggle", "StudioSplitAccordion", "StudioPublishingCard", "StudioBrainStatusBadge",
  "StudioCounter", "StudioSideCounter", "StudioLeftCounter", "StudioDoubleSplitSlider", "StudioSpectrumTag", "StudioCloseableBadge", "StudioTagEditor",
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
console.log("Static wiring checks passed. Seven-family grouping and browser verification remain release gates.")
