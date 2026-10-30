import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const component = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8")
const valueToggles = readFileSync("src/studio-ui/primitives/StudioValueToggles.tsx", "utf8")
const styles = readFileSync("src/styles/studio-control-system.css", "utf8")
const distill = readFileSync("src/styles/studio-control-distill-overrides.css", "utf8")
const recovery = readFileSync("src/styles/studio-control-recovery-overrides.css", "utf8")
const wordCounter = readFileSync("src/styles/studio-control-word-counter.css", "utf8")
const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8")
const tokenEmitter = readFileSync("scripts/emit-studio-control-vars.mjs", "utf8")
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

test("StudioSideCounter is a new button-only split-right primitive with a divided action rail", () => {
  const start = component.indexOf("export const StudioSideCounter:")
  const end = component.indexOf("StudioSideCounter.displayName", start)
  const source = component.slice(start, end)
  assert.ok(start >= 0 && end > start)
  assert.match(source, /layout="right"/)
  assert.match(source, /data-vt-library-component": "StudioSideCounter"/)
  assert.match(source, /<span className="vt-studio-side-counter__value"/)
  assert.match(source, /<ChevronUp/)
  assert.match(source, /<ChevronDown/)
  assert.doesNotMatch(source, /<input|StudioInlineStepper|StudioSplitStepper|normalizeStudioInlineStepperValue/)
  assert.match(styles, /\.vt-studio-side-counter\s*\{\s*--vt-studio-counter-width:\s*132px;/)
  assert.match(styles, /\.vt-studio-side-counter\[data-size="compact"\]\s*\{\s*--vt-studio-counter-width:\s*84px;/)
  assert.match(styles, /\.vt-studio-side-counter\[data-size="micro"\]\s*\{\s*--vt-studio-counter-width:\s*42px;/)
  assert.match(styles, /\.vt-studio-side-counter__actions button svg\s*\{[^}]*width:\s*14px;[^}]*height:\s*14px;/s)
  assert.match(styles, /\.vt-studio-side-counter\[data-vt-studio-split="right"\]\s*\{[^}]*minmax\(0, 2fr\)/s)
  assert.match(styles, /\.vt-studio-side-counter__actions::after\s*\{[^}]*top:\s*50%[^}]*transform:\s*translateY\(-50%\)/s);
  for (const size of ["standard", "compact", "micro"]) assert.match(catalog, new RegExp('StudioSideCounter value={[^}]+} onValueChange={[^}]+} size="' + size + '"'))
})

test("counter affordances have hold-repeat, enlarged icons, activation motion, and aligned right divider", () => {
  assert.match(component, /useStudioCounterHold/);
  assert.match(component, /onPointerDown/);
  assert.match(component, /data-press-holding/);
  assert.match(styles, /width:\s*36px;\s*height:\s*36px;\s*stroke-width:\s*3\.75;/);
  assert.match(styles, /vt-studio-counter-pop/);
  assert.match(styles, /vt-studio-counter-hold-pulse/);
  assert.match(styles, /\.vt-studio-side-counter__actions::after\s*\{[^}]*top:\s*50%[^}]*transform:\s*translateY\(-50%\)/s);
  assert.match(styles, /\.vt-studio-double-split-slider\.is-counter-controls \.vt-studio-double-split-slider__counter > button\.is-holding svg/);
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

test("counter catalog groups primary and secondary palettes in centered per-size rows and uses 0–100", () => {
  assert.match(catalog, /vt-confirmed-counter-size-rows/);
  assert.match(catalog, /vt-confirmed-counter-size-row/);
  assert.doesNotMatch(catalog, /vt-confirmed-counter-row-grid--paired/);
  assert.equal((catalog.match(/max={100}/g) || []).length >= 12, true);
  assert.match(styles, /justify-content:\s*center;[\s\S]*align-items:\s*center/);
  assert.match(styles, /color-mix\(in srgb, #fff 50%, var\(--pair-a\) 50%\)/);
  assert.match(styles, /-webkit-text-stroke:\s*1px var\(--vt-studio-control-accent, var\(--pair-a\)\)/);
});

test("Studio counter hold behavior is wired to pointer events for touch and mouse", () => {
  assert.equal((component.match(/useStudioCounterHold\(/g) || []).length, 8);
  assert.match(component, /setPointerCapture\(event\.pointerId\)/);
  assert.match(component, /onPointerCancel: stop/);
  assert.match(component, /const base = currentRef\.current/);
  assert.match(component, /max = 100/);
  assert.match(component, /accelerationEase/);
  assert.match(component, /accelerationProgress = Math\.min\(1, elapsed \/ 720\)/);
  assert.match(component, /boundaryEase/);
  assert.match(component, /remainingSteps/);
  assert.match(styles, /touch-action:\s*none/);
  assert.match(styles, /color-mix\(in srgb, white 50%, var\(--pair-a\)\)/);
  assert.match(styles, /-webkit-text-stroke:\s*1px #000/);
});

test("slider counter click handlers preserve the shared hold hook's click behavior and interaction focus", () => {
  const sliderStart = component.indexOf("export const StudioDoubleSplitSlider:");
  const sliderEnd = component.indexOf("StudioDoubleSplitSlider.displayName", sliderStart);
  const slider = component.slice(sliderStart, sliderEnd);
  assert.match(slider, /increment\.events\.onClick\(event\); interactionFocus\.pulse\(\)/);
  assert.match(slider, /decrement\.events\.onClick\(event\); interactionFocus\.pulse\(\)/);
  assert.doesNotMatch(slider, /\.\.\.increment\.events\} onClick=\{interactionFocus\.pulse\}/);
  assert.doesNotMatch(slider, /\.\.\.decrement\.events\} onClick=\{interactionFocus\.pulse\}/);
});

test("Studio counter and counter-slider press-and-hold are wired for touch and mouse", () => {
  assert.equal((component.match(/useStudioCounterHold\(/g) || []).length, 8);
  const sliderStart = component.indexOf("export const StudioDoubleSplitSlider:");
  const sliderEnd = component.indexOf("StudioDoubleSplitSlider.displayName", sliderStart);
  const slider = component.slice(sliderStart, sliderEnd);
  assert.match(slider, /useStudioCounterHold\(-1,[\s\S]*?adjustCounter/);
  assert.match(slider, /useStudioCounterHold\(1,[\s\S]*?adjustCounter/);
  assert.match(slider, /data-press-holding/);
  assert.match(component, /setPointerCapture\(event\.pointerId\)/);
  assert.match(component, /onPointerCancel: stop/);
  assert.match(component, /const base = currentRef\.current/);
  assert.match(component, /max = 100/);
  assert.match(styles, /touch-action:\s*none/);
  assert.match(styles, /color-mix\(in srgb, white 50%, var\(--pair-a\)\)/);
  assert.match(styles, /-webkit-text-stroke:\s*1px #000/);
});
test("both counter styles tint resting numeral fill and stroke against each palette, then use black text while pressed or held", () => {
  assert.match(styles, /\.vt-studio-counter__value,[\s\S]*?-webkit-text-stroke:\s*var\(--vt-studio-control-text-stroke, 1px\)\s*color-mix\(in srgb, #fff 50%, var\(--pair-a\) 50%\)/);
  assert.match(styles, /\.vt-studio-counter\.is-reversed[\s\S]*?-webkit-text-stroke-color:\s*color-mix\(in srgb, #fff 50%, var\(--pair-b\) 50%\)/);
  assert.match(styles, /\.vt-studio-counter:has\([\s\S]*?color:\s*#000;\s*-webkit-text-fill-color:\s*#000;\s*-webkit-text-stroke:\s*1px var\(--vt-studio-control-accent, var\(--pair-a\)\)/);
  assert.match(styles, /\.vt-studio-counter\.is-reversed:has\([\s\S]*?background:\s*color-mix\(in srgb, var\(--pair-b\) 50%, transparent\);\s*color:\s*#000;\s*-webkit-text-fill-color:\s*#000;\s*-webkit-text-stroke-color:\s*var\(--pair-b\)/);
  assert.match(styles, /\.vt-studio-side-counter__value/);
  assert.match(styles, /\.vt-studio-side-counter\.is-reversed[\s\S]*?-webkit-text-stroke-color:\s*color-mix\(in srgb, #fff 50%, var\(--pair-b\) 50%\)/);
});

test("StudioLeftCounter places the two-button action rail on the left and is available for opposite-palette catalog specimens", () => {
  const start = component.indexOf("export const StudioLeftCounter:");
  const end = component.indexOf("StudioLeftCounter.displayName", start);
  const source = component.slice(start, end);
  assert.ok(start >= 0 && end > start);
  assert.match(source, /layout="left"/);
  assert.match(source, /leftRailContent=/);
  assert.match(source, /data-vt-library-component": "StudioLeftCounter"/);
  assert.match(source, /"data-vt-studio-control-kind": "studio-left-counter"/);
  assert.match(source, /<span className="vt-studio-side-counter__value"/);
  assert.match(styles, /\.vt-studio-left-counter\s*\{\s*--vt-studio-counter-width:\s*132px;/);
  assert.match(styles, /\.vt-studio-left-counter\[data-size="compact"\]\s*\{\s*--vt-studio-counter-width:\s*84px;/);
  assert.match(styles, /\.vt-studio-left-counter\[data-size="micro"\]\s*\{\s*--vt-studio-counter-width:\s*42px;/);
  assert.match(styles, /\.vt-studio-left-counter__rail\[data-rail="start"\]\s*\{[^}]*border-right:/s);
  assert.match(catalog, /StudioLeftCounter className="is-reversed"/);
  assert.doesNotMatch(catalog, /StudioSideCounter className="is-reversed"/);
});


test("StudioCounter uses the same directional chevrons as StudioBarToggle instead of plus/minus glyphs", () => {
  const start = component.indexOf("export const StudioCounter:");
  const end = component.indexOf("StudioCounter.displayName", start);
  const source = component.slice(start, end);
  assert.match(source, /<ChevronLeft/);
  assert.match(source, /<ChevronRight/);
  assert.doesNotMatch(source, /<Minus|<Plus/);
});

test("StudioLeftWordCounter inherits the shared 50-percent primary numeral and black interaction-focus treatment", () => {
  assert.match(wordCounter, /\.vt-studio-left-word-counter \.vt-studio-side-counter__value\s*\{[^}]*background:\s*var\(--pair-a\)[^}]*color:\s*var\(--vt-studio-number-rest-color\)[^}]*-webkit-text-stroke-color:\s*var\(--vt-studio-number-rest-color\)/s);
  assert.match(wordCounter, /data-vt-interaction-focus="true"[\s\S]*?color:\s*#000/);
  assert.match(wordCounter, /:focus-within[\s\S]*?color:\s*#000/);
  assert.match(styles, /--vt-studio-number-rest-color:\s*color-mix\(in srgb,[^;]*var\(--vt-studio-number-rest-mix\)/);
});

test("selected split buttons swap both the label face and rail between primary and secondary", () => {
  assert.match(styles, /data-vt-studio-split="left"\] \[data-vt-studio-split-label\] \{ background:var\(--vt-studio-control-accent/);
  assert.match(styles, /data-vt-studio-split="left"\]\[data-selected="true"\] \[data-vt-studio-split-label\][\s\S]*?background:var\(--vt-studio-control-secondary/);
  assert.match(styles, /data-vt-studio-split="left"\]\[data-selected="true"\] \[data-vt-studio-split-rail\][\s\S]*?background:var\(--vt-studio-control-accent/);
  assert.match(styles, /data-vt-studio-split="right"\]\[data-selected="true"\] \[data-vt-studio-split-label\][\s\S]*?background: var\(--vt-studio-control-secondary/);
  assert.match(styles, /data-vt-studio-split="double"\]\[data-selected="true"\] \[data-vt-studio-split-label\][\s\S]*?background: var\(--vt-studio-control-secondary/);
});

test("bar toggle exposes a rounded percentage tooltip and preserves visible bars between square rails", () => {
  assert.match(valueToggles, /vt-studio-value-toggle__bar-tooltip/);
  assert.match(valueToggles, /Math\.round\(Math\.max\(0, Math\.min\(100, value\)\)\)\}%/);
  assert.match(distill, /\.vt-studio-value-toggle__bar-tooltip\s*\{[^}]*background:\s*var\(--vt-studio-control-secondary[^}]*color:\s*#000/s);
  assert.match(distill, /\.vt-studio-value-toggle:focus-within/);
  assert.match(recovery, /\.vt-studio-split-shell\.vt-studio-value-toggle--bar > \[data-vt-studio-split-label\]\s*\{[^}]*flex:\s*1 1 0[^}]*width:\s*auto/s);
  assert.match(recovery, /\.vt-studio-split-shell\.vt-studio-value-toggle--bar\s*\{\s*overflow:\s*visible/s);
});


test("bar percentage tooltip escapes the component border and has a downward secondary-color pointer", () => {
  assert.match(styles, /\.vt-studio-value-toggle--bar\s*\{[^}]*overflow:\s*visible/s);
  assert.match(styles, /\.vt-studio-split-shell\.vt-studio-value-toggle--bar\s*\{[^}]*overflow:\s*visible/s);
  assert.match(styles, /\.vt-studio-value-toggle__bar-tooltip::after\s*\{[^}]*border-top:\s*6px solid var\(--vt-studio-control-secondary/s);
});

test("all counter chevrons use one token-backed button class and shared click/hold animation", () => {
  assert.match(tokens, /export const STUDIO_STEPPER_BUTTON_TOKENS\s*=\s*\{/);
  assert.match(tokenEmitter, /STUDIO_STEPPER_BUTTON_TOKENS/);
  assert.match(component, /className=\{\`vt-studio-stepper-button vt-studio-counter__button/);
  assert.match(valueToggles, /className="vt-studio-stepper-button vt-studio-value-toggle__arrow"/);
  assert.match(valueToggles, /className="vt-studio-stepper-button vt-studio-word-counter__button"/);
  assert.match(styles, /\.vt-studio-stepper-button:active:not\(:disabled\) svg[\s\S]*?vt-studio-counter-pop/);
  assert.match(styles, /\.vt-studio-stepper-button\.is-holding svg[\s\S]*?vt-studio-counter-hold-pulse/);
  assert.match(styles, /\.vt-studio-stepper-button:focus-visible[\s\S]*?--vt-studio-focus-outline-width-ratio[\s\S]*?--vt-studio-control-secondary/);
});

test("StudioDoubleSplitWordCounter is exported as a double-rail word primitive with the shared chevron buttons", () => {
  assert.match(valueToggles, /export type StudioDoubleSplitWordCounterProps/);
  assert.match(valueToggles, /export function StudioDoubleSplitWordCounter/);
  assert.match(valueToggles, /layout="double"/);
  assert.match(valueToggles, /data-vt-studio-control-kind": "studio-double-split-word-counter"/);
  assert.match(valueToggles, /STUDIO_LEFT_WORD_OPTIONS/);
  assert.match(valueToggles, /vt-studio-word-counter__value/);
  assert.match(styles, /\.vt-studio-word-counter:focus-within[\s\S]*?--vt-studio-control-secondary/);
});


test("dropdown menus share separated primary-filled menu defaults across standard, simple, and split-left variants", () => {
  assert.match(tokens, /export const STUDIO_DROPDOWN_MENU_TOKENS\s*=\s*\{/);
  assert.match(tokens, /menuGap:\s*8/);
  assert.match(tokens, /menuPadding:\s*4/);
  assert.match(tokens, /rowGap:\s*3/);
  assert.match(tokens, /menuFill:\s*"primary"/);
  assert.match(tokens, /unselectedRowFill:\s*"white"/);
  assert.match(tokens, /selectedRowFill:\s*"secondary"/);
  assert.match(tokenEmitter, /STUDIO_DROPDOWN_MENU_TOKENS/);
  assert.match(styles, /\.vt-studio-dropdown-menu\s*\{[^}]*top:\s*calc\(100% \+ var\(--vt-studio-dropdown-menu-gap/s);
  assert.match(styles, /\.vt-studio-dropdown-menu\s*\{[^}]*border-radius:\s*var\(--vt-studio-dropdown-menu-radius/s);
  assert.match(styles, /\.vt-studio-dropdown-menu\s*\{[^}]*background:\s*var\(--vt-studio-dropdown-menu-fill/s);
  assert.match(styles, /\.vt-studio-dropdown-option\s*\{[^}]*background:\s*var\(--vt-studio-dropdown-row-fill/s);
  assert.match(styles, /\.vt-studio-dropdown-option\[data-selected="true"\]\s*\{[^}]*background:\s*var\(--vt-studio-dropdown-selected-fill/s);
  assert.match(styles, /\.vt-studio-dropdown\.is-simple \.vt-studio-dropdown-menu/);
  assert.match(styles, /\.vt-studio-dropdown\.is-split-left \.vt-studio-dropdown-menu/);
  const menuContract = styles.slice(styles.lastIndexOf("/* Global dropdown menu contract"));
  assert.match(menuContract, /border:\s*var\(--vt-studio-dropdown-row-stroke[^;]*solid #000/);
  assert.match(menuContract, /border-radius:\s*var\(--vt-studio-dropdown-menu-radius[^;]*!important/);
});
