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
  assert.match(styles, /\.vt-studio-counter\s*\{\s*--vt-studio-counter-width:\s*176px;/)
  assert.match(styles, /\.vt-studio-counter\[data-size="compact"\]\s*\{\s*--vt-studio-counter-width:\s*112px;/)
  assert.match(styles, /\.vt-studio-counter\[data-size="micro"\]\s*\{\s*--vt-studio-counter-width:\s*56px;/)
  assert.match(styles, /\.vt-studio-counter__button svg\s*\{[^}]*width:\s*24px;[^}]*height:\s*24px;/s)
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
  assert.match(styles, /\.vt-studio-right-counter\s*\{\s*--vt-studio-counter-width:\s*132px;/)
  assert.match(styles, /\.vt-studio-right-counter\[data-size="compact"\]\s*\{\s*--vt-studio-counter-width:\s*84px;/)
  assert.match(styles, /\.vt-studio-right-counter\[data-size="micro"\]\s*\{\s*--vt-studio-counter-width:\s*42px;/)
  assert.match(styles, /\.vt-studio-right-counter__actions button svg\s*\{[^}]*width:\s*14px;[^}]*height:\s*14px;/s)
  assert.match(styles, /\.vt-studio-right-counter\[data-vt-studio-split="right"\]\s*\{[^}]*minmax\(0, 2fr\)/s)
  assert.match(styles, /\.vt-studio-right-counter__actions button:first-child\s*\{[^}]*border-bottom:[^}]+/s)
  for (const size of ["standard", "compact", "micro"]) assert.match(catalog, new RegExp('StudioRightCounter value={[^}]+} onValueChange={[^}]+} size="' + size + '"'))
})

test("counter affordances have hold-repeat, enlarged icons, activation motion, and aligned right divider", () => {
  assert.match(component, /useStudioCounterHold/);
  assert.match(component, /onPointerDown/);
  assert.match(component, /data-press-holding/);
  assert.match(styles, /width:\s*36px;\s*height:\s*36px;\s*stroke-width:\s*3\.75;/);
  assert.match(styles, /vt-studio-counter-pop/);
  assert.match(styles, /vt-studio-counter-hold-pulse/);
  assert.match(styles, /vt-studio-right-counter__actions button:first-child \{ border-bottom: 1px solid #000; \}/);
});

test("counter palette variants are paired by size and centered, with max 100", () => {
  assert.match(catalog, /vt-confirmed-counter-row-grid--paired/);
  assert.match(catalog, /vt-confirmed-counter-pair/);
  assert.doesNotMatch(catalog, /Studio(?:Right)?Counter[^>]+max=\{99\}/);
  assert.match(styles, /justify-content:\s*center;[\s\S]*align-items:\s*flex-start;/);
  assert.match(styles, /color-mix\(in srgb, #fff 50%, var\(--pair-a\) 50%\)/);
  assert.match(styles, /-webkit-text-stroke:\s*1px var\(--pair-a\)/);
  assert.match(styles, /background:\s*color-mix\(in srgb, var\(--pair-a\) 50%, transparent\)/);
});
