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

const checks = [
  ["distill overrides imported after field/parity styles", entry.indexOf('./studio-control-distill-overrides.css') > entry.indexOf('./studio-field-parity.css')],
  ["field focus defines black text and glyph stroke", /:focus[^{]*\{[\s\S]*?-webkit-text-stroke-color:\s*#000\s*!important/.test(overrides)],
  ["single-line labels clip instead of ellipsis", /text-overflow:\s*clip/.test(overrides) && !/text-overflow:\s*ellipsis/.test(overrides)],
  ["square icon group uses content width", /\.vt-studio-square-icon-button-group[\s\S]*?width:\s*max-content/.test(overrides)],
  ["bar toggle retains visible individual bars", /\.vt-studio-value-toggle__bar[\s\S]*?border:\s*1px solid #000/.test(overrides)],
  ["stacked toggle divider is centered", /\.vt-studio-value-toggle__arrow-stack::after[\s\S]*?top:\s*50%[\s\S]*?translateY\(-50%\)/.test(overrides)],
  ["catalog uses canonical StudioTopSplitModule", catalog.includes("StudioTopSplitModule") && controls.includes("StudioTopSplitModule")],
  ["catalog uses canonical StudioSquareIconButtonGroup", catalog.includes("StudioSquareIconButtonGroup") && controls.includes("StudioSquareIconButtonGroup")],
  ["Brain feedback uses canonical icon-button group", /BrainFeedbackControls[\s\S]*?<StudioSquareIconButtonGroup/.test(brain)],
  ["every existing Family specimen is a collapsed-by-default disclosure", /const Family:[\s\S]*?<details[\s\S]*?data-vt-confirmed-primitive="true"/.test(catalog) && !/const Family:[\s\S]*?<details[^>]*\bopen=/.test(catalog)],
  ["global defaults is collapsed by default", /data-vt-confirmed-family="defaults"/.test(catalog) && !/data-vt-confirmed-family="defaults"[^>]*\bopen=/.test(catalog)],
  ["disclosure styles are imported by the catalog", catalog.includes('import "../../styles/studio-confirmed-catalog-modules.css"') && catalogStyles.includes(".vt-confirmed-primitive-summary")],
  ["collapsible family/primitive/defaults components are exported", moduleFile.includes("ConfirmedFamilyModule") && moduleFile.includes("ConfirmedPrimitiveModule") && index.includes("ConfirmedDefaultsModule")],
  ["retired CLEAN COMPOSITION specimen is absent from confirmed catalog", !/CLEAN COMPOSITION|Confirmed Specimen Grid\s*[·-]\s*Layout Contract/i.test(catalog)],
]

const missingP0 = [
  "StudioTextInput", "StudioTextArea", "StudioTextBox", "StudioButton",
  "StudioActionButton", "StudioSquareIconButtonGroup", "StudioTopSplitModule",
  "StudioUploadFrame", "StudioSimpleDropdown", "StudioSplitLeftDropdown",
  "StudioSwitch", "StudioRadio", "StudioCheckbox", "StudioXCheckbox",
  "StudioWordToggle", "StudioArrowToggle", "StudioSideToggle", "StudioDoubleSideToggle",
  "StudioBarToggle", "StudioSplitAccordion", "StudioPublishingCard", "StudioBrainStatusBadge",
  "StudioCounter", "StudioSideCounter", "StudioDoubleSplitSlider",
].filter((name) => !catalog.includes(name))

checks.push(["P0 canonical specimen coverage", missingP0.length === 0])

let failed = false
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`)
  if (!ok) failed = true
}
if (missingP0.length) console.error("Missing P0 specimens:", missingP0.join(", "))
if (failed) process.exit(1)
console.log("confirmed-catalog-coverage: static checks passed; eight-family grouping and browser verification remain release gates")
