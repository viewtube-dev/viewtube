import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

const controls = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8")
const styles = readFileSync("src/styles/studio-control-system.css", "utf8")
const catalog = readFileSync("src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx", "utf8")
const confirmedCatalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8")

test("side counter divider is centered on a true half-height boundary", () => {
  assert.match(styles, /\.vt-studio-side-counter__actions\s*\{[^}]*grid-template-rows:\s*minmax\(0, 1fr\) minmax\(0, 1fr\)/s)
  assert.match(styles, /\.vt-studio-side-counter__actions > button:first-child::after\s*\{[^}]*top:\s*50%[^}]*transform:\s*translateY\(-50%\)/s)
})

test("double split slider readout has reduced horizontal padding and supports counter controls", () => {
  assert.match(styles, /\.vt-studio-double-split-slider \[data-vt-studio-split-field\]\s*\{[^}]*padding-inline:\s*calc\(var\(--vt-studio-control-height, 44px\) \* \.09\)/s)
  assert.match(controls, /leftControls\?:\s*"reset" \| "counter"/)
  assert.match(controls, /data-vt-studio-slider-left-controls/)
  assert.match(catalog, /name === "Slider Counter"[\s\S]*?leftControls="counter"/)
})

test("dropdown split rail stays square and simple trailing chevrons have no divider", () => {
  assert.match(styles, /\.vt-studio-dropdown\.is-split-left \.vt-studio-dropdown-split-rail\[data-rail="start"\]\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/s)
  assert.match(styles, /\.vt-studio-dropdown:not\(\.is-split-left\) \.vt-studio-dropdown-chevron\.is-trailing\s*\{[^}]*border-left:\s*0/s)
  assert.match(styles, /\.vt-studio-dropdown-menu\s*\{[^}]*border-top-left-radius:/s)
})

test("action buttons keep their own idle fill and selected faces use solid primary", () => {
  const buttonFaceStart = styles.indexOf('button[data-vt-studio-button="true"] > [data-vt-studio-button-face]')
  const buttonFace = styles.slice(buttonFaceStart, styles.indexOf("/* Compact text buttons", buttonFaceStart))
  assert.ok(buttonFaceStart >= 0)
  assert.match(buttonFace, /background:\s*var\(--vt-studio-control-accent/)
  const actionFaceStart = styles.indexOf('button[data-vt-studio-control="true"][data-vt-studio-action-button="true"] > [data-vt-studio-action-face]')
  const actionFace = styles.slice(actionFaceStart, styles.indexOf(':focus', actionFaceStart))
  assert.ok(actionFaceStart >= 0)
  assert.match(actionFace, /background:\s*var\(--vt-studio-control-accent/)
  assert.doesNotMatch(actionFace, /color-mix\([^}]*50%, transparent/)
  assert.doesNotMatch(buttonFace, /color-mix\([^}]*50%, transparent/)
  assert.match(styles, /button\[data-vt-studio-button="true"\]\[data-selected="true"\] > \[data-vt-studio-button-face\][^{]*\{[^}]*background:\s*var\(--vt-studio-control-accent/s)
})

test("switches, word toggles, radios, checkmarks and X boxes expose all four shared skins", () => {
  assert.match(styles, /\.vt-studio-44-switch,\.vt-studio-44-choice\{[^}]*50%, transparent\)/s)
  assert.match(styles, /\.vt-studio-44-switch\.is-color-swap:not\(\.is-on\)[^{]*\{[^}]*background:var\(--vt-studio-control-accent/s)
  assert.match(styles, /\.vt-studio-44-switch\.is-color-swap\.is-on[^{]*\{[^}]*background:var\(--vt-studio-control-secondary/s)
  assert.match(styles, /\.vt-studio-44-choice\.is-white-indicator:is\([^}]*background:var\(--vt-studio-control-accent/s)
  assert.match(styles, /\.vt-studio-44-choice\.is-black-indicator:is\([^}]*background:var\(--vt-studio-control-accent/s)
  assert.match(styles, /\.vt-studio-44-choice\.is-white-indicator\.is-checkbox svg\{[^}]*stroke:#fff/s)
  assert.match(styles, /\.vt-studio-44-choice\.is-black-indicator\.is-checkbox svg\{[^}]*stroke:#000/s)
  assert.match(styles, /\.vt-studio-44-word-toggle\{[^}]*50%, transparent/s)
  assert.match(styles, /\.vt-studio-44-word-handle\{[^}]*background:var\(--vt-studio-control-secondary/s)
  assert.match(styles, /\.vt-studio-44-word-toggle\.is-color-swap:has\(\.vt-studio-44-word-handle\[data-active="true"\]\)\{[^}]*background:var\(--vt-studio-control-secondary/s)
  assert.match(styles, /\.vt-studio-44-word-toggle\.is-black-indicator \.vt-studio-44-word-handle\{[^}]*background:#000/s)
  assert.match(styles, /\.vt-studio-44-word-toggle\.is-white-indicator \.vt-studio-44-word-handle\{[^}]*background:#fff/s)
  assert.match(controls, /export type StudioControlSkin = "solid" \| "color-swap" \| "black-indicator" \| "white-indicator"/)
  assert.match(confirmedCatalog, /Four state-fill\/indicator variants: V1 half-primary to primary with secondary indicator; V2 primary to secondary with primary\/secondary indicator swap; V3 half-primary to primary with white indicator; V4 half-primary to primary with black indicator/)
})
test("word toggles use Late Silk and Velvet Release motion with reduced-motion and resize settling", () => {
  assert.match(controls, /const animateWordToggle = React\.useCallback/)
  assert.match(controls, /Late Silk/)
  assert.match(controls, /Velvet Release/)
  assert.match(controls, /prefers-reduced-motion: reduce/)
  assert.match(controls, /cancelAnimationFrame/)
  assert.match(controls, /data-motion/)
  assert.match(styles, /\.vt-studio-44-word-handle\{[^}]*left:var\(--vt-word-toggle-handle-left/)
  assert.match(styles, /\.vt-studio-44-word-handle\{[^}]*width:var\(--vt-word-toggle-handle-width/)
  assert.match(styles, /\.vt-studio-44-word-handle-color\{[^}]*clip-path/)
})

test("retired certification, chat-action, select, search, and specimen-pair demos are removed from the library", () => {
  const publicApi = readFileSync("src/studio-ui/index.ts", "utf8")
  assert.doesNotMatch(confirmedCatalog, /StudioHubCertification|StudioChatActionGroup|StudioSelect|StudioSearchInput|StudioComponentGridSpecimen/)
  assert.doesNotMatch(publicApi, /StudioHubCertification|StudioChatActionGroup|StudioComponentGridSpecimen/)
  assert.doesNotMatch(controls, /export const StudioSelect|export const StudioSearchInput/)
  for (const path of [
    "src/studio-ui/StudioHubCertification.tsx",
    "src/studio-ui/primitives/StudioComponentGridSpecimen.tsx",
    "src/studio-ui/primitives/StudioChatActionGroup.tsx",
    "src/studio-ui/primitives/StudioChatActionGroup.test.tsx",
    "src/styles/studio-chat-action-group.css",
  ]) assert.equal(existsSync(path), false, `${path} must be deleted`)
  assert.match(confirmedCatalog, /data-vt-library-component="StudioComponentGrid"/)
  assert.match(confirmedCatalog, /data-vt-library-component="StudioComponentGridCell"/)
})
