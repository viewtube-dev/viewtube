import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const component = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8")
const styles = readFileSync("src/styles/studio-control-system.css", "utf8")
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8")

test("StudioCounter is a new button-only double-split primitive across all three sizes", () => {
  const start = component.indexOf("export const StudioCounter:")
  const end = component.indexOf("StudioCounter.displayName", start)
  const source = component.slice(start, end)
  assert.ok(start >= 0 && end > start)
  assert.match(source, /layout="double"/)
  assert.match(source, /data-vt-library-component": "StudioCounter"/)
  assert.match(source, /<span className="vt-studio-counter__value"/)
  assert.doesNotMatch(source, /<input|StudioInlineStepper|StudioSplitStepper|normalizeStudioInlineStepperValue/)
  assert.match(styles, /\.vt-studio-counter\[data-vt-studio-split="double"\]\s*\{[^}]*minmax\(0, 2fr\)/s)
  for (const size of ["standard", "compact", "micro"]) assert.match(catalog, new RegExp('StudioCounter value={[^}]+} onValueChange={[^}]+} size="' + size + '"'))
})

test("StudioRightCounter is a new button-only split-right primitive with a divided action rail", () => {
  const start = component.indexOf("export const StudioRightCounter:")
  const end = component.indexOf("StudioRightCounter.displayName", start)
  const source = component.slice(start, end)
  assert.ok(start >= 0 && end > start)
  assert.match(source, /layout="right"/)
  assert.match(source, /data-vt-library-component": "StudioRightCounter"/)
  assert.match(source, /<span className="vt-studio-right-counter__value"/)
  assert.match(source, /<ChevronUp/)
  assert.match(source, /<ChevronDown/)
  assert.doesNotMatch(source, /<input|StudioInlineStepper|StudioSplitStepper|normalizeStudioInlineStepperValue/)
  assert.match(styles, /\.vt-studio-right-counter\[data-vt-studio-split="right"\]\s*\{[^}]*minmax\(0, 2fr\)/s)
  assert.match(styles, /\.vt-studio-right-counter__actions button:first-child\s*\{[^}]*border-bottom:[^}]+/s)
  for (const size of ["standard", "compact", "micro"]) assert.match(catalog, new RegExp('StudioRightCounter value={[^}]+} onValueChange={[^}]+} size="' + size + '"'))
})
