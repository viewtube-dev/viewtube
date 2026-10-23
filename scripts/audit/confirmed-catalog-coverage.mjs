import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const root = process.cwd()
const read = (path) => {
  const fullPath = resolve(root, path)
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

const checks = [
  ["distill overrides imported after field/parity styles", entry.indexOf('./studio-control-distill-overrides.css') > entry.indexOf('./studio-field-parity.css')],
  ["field focus uses black glyph stroke", /:focus[^{]*\{[\s\S]*?-webkit-text-stroke-color:\s*#000\s*!important/.test(overrides)],
  ["single-line labels clip instead of ellipsis", /text-overflow:\s*clip/.test(overrides) && !/text-overflow:\s*ellipsis/.test(overrides)],
  ["square icon group uses content width", /\.vt-studio-square-icon-button-group[\s\S]*?width:\s*max-content/.test(overrides)],
  ["catalog uses canonical StudioTopSplitModule", catalog.includes("StudioTopSplitModule") && controls.includes("StudioTopSplitModule")],
  ["catalog uses canonical StudioSquareIconButtonGroup", catalog.includes("StudioSquareIconButtonGroup") && controls.includes("StudioSquareIconButtonGroup")],
  ["collapsible family/primitive modules exist", moduleFile.includes("ConfirmedFamilyModule") && moduleFile.includes("ConfirmedPrimitiveModule")],
  ["catalog modules exported from Studio UI", index.includes("ConfirmedFamilyModule") && index.includes("ConfirmedDefaultsModule")],
]

let failed = false
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`)
  if (!ok) failed = true
}
if (failed) process.exit(1)
console.log("confirmed-catalog-coverage: baseline wiring OK; family migration and P0 inventory require component-level review")
