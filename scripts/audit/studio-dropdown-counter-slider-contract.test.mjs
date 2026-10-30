import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8")
const component = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8")
const css = readFileSync("src/styles/studio-control-system.css", "utf8")
const generator = readFileSync("scripts/emit-studio-control-vars.mjs", "utf8")
const generated = readFileSync("src/styles/studio-control-vars.generated.css", "utf8")
const fieldCss = readFileSync("src/styles/studio-text-input.css", "utf8")
const splitInputCss = readFileSync("src/styles/studio-split-text-input.css", "utf8")
const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8")
const dropdown = component.slice(component.indexOf("export const StudioDropdown"), component.indexOf("export interface StudioSimpleDropdownOption"))

test("dropdown chevron geometry has one token-owned source shared by single and multi-select", () => {
  assert.match(tokens, /STUDIO_DROPDOWN_TOKENS/)
  assert.match(css, /--vt-studio-dropdown-standard-chevron-size/)
  assert.match(css, /--vt-studio-dropdown-compact-chevron-size/)
  assert.match(css, /--vt-legend-chevron-size:\s*var\(--vt-studio-dropdown-chevron-size\)/)
  assert.match(css, /\.vt-studio-legend-chevron\s*\{\s*stroke-width:\s*var\(--vt-studio-dropdown-chevron-stroke/)
})

test("simple dropdown has no split rail; split-left dropdown uses split-shell anatomy and trailing chevron", () => {
  assert.match(dropdown, /variant === "simple"/)
  assert.match(dropdown, /data-vt-studio-split=\{variant === "split-left" \? "left" : undefined\}/)
  assert.match(dropdown, /StudioSplitShell[\s\S]*?layout="double"[\s\S]*?faceOnly/)
  assert.match(component, /interface StudioSplitShellProps[\s\S]*?rightRailClassName/)
  assert.match(dropdown, /data-vt-studio-dropdown-chevron/)
  assert.match(dropdown, /splitIcon/)
  assert.match(dropdown, /rightRailProps=\{\{ "data-vt-studio-dropdown-chevron": "true"/)
  assert.doesNotMatch(dropdown, /variant === "split-left" \? <span className="vt-studio-dropdown-chevron is-leading"/)
})

test("split dropdown rail uses secondary fill and reserves the trailing rail for the chevron", () => {
  assert.match(css, /\.vt-studio-dropdown-split-rail\s*\{[\s\S]*?background:\s*var\(--vt-studio-control-secondary/)
  assert.match(css, /\.vt-studio-dropdown\.is-split-left button\[data-dropdown-trigger="true"\]\s*\{\s*grid-template-columns:\s*var\(--vt-studio-dropdown-rail-size\) minmax\(0, 1fr\) var\(--vt-studio-dropdown-rail-size\)/)
  assert.match(dropdown, /className="vt-studio-dropdown-chevron is-trailing"/)
  assert.match(css, /\.vt-studio-dropdown \.vt-studio-dropdown-chevron\[data-rail="end"\] svg \{ width: var\(--vt-studio-dropdown-chevron-size\); height: var\(--vt-studio-dropdown-chevron-size\); \}/)
})

test("side counter and slider counter dividers are centered against their full two-row rails", () => {
  assert.match(css, /\.vt-studio-side-counter__actions\s*\{[^}]*position:\s*relative/s)
  assert.match(css, /\.vt-studio-side-counter__actions::after\s*\{[^}]*top:\s*50%[^}]*transform:\s*translateY\(-50%\)[^}]*height:\s*var\(--vt-studio-control-stroke/s)
  assert.doesNotMatch(css, /\.vt-studio-side-counter__actions button:first-child::after/)
  assert.match(css, /\.vt-studio-double-split-slider\.is-counter-controls \.vt-studio-double-split-slider__counter\s*\{[^}]*position:\s*relative/s)
  assert.match(css, /\.vt-studio-double-split-slider\.is-counter-controls \.vt-studio-double-split-slider__counter::after\s*\{[^}]*top:\s*50%[^}]*transform:\s*translateY\(-50%\)/s)
  assert.doesNotMatch(css, /\.vt-studio-double-split-slider\.is-counter-controls \.vt-studio-double-split-slider__counter > button:first-child::after/)
})

test("counter and slider readouts share default mix and black active numeral tokens", () => {
  assert.match(tokens, /STUDIO_COUNTER_NUMBER_TOKENS/)
  assert.match(css, /--vt-studio-number-default-white-mix:\s*50%/)
  assert.match(css, /\.vt-studio-counter \{[^}]*--vt-studio-number-background:\s*var\(--pair-a\)/)
  assert.match(css, /\.vt-studio-left-counter\.is-reversed \{[^}]*--vt-studio-number-background:\s*var\(--pair-b\)/)
  assert.match(css, /\.vt-studio-double-split-slider \.vt-studio-double-split-slider__value\s*\{[^}]*color-mix\(in srgb, #fff var\(--vt-studio-number-default-white-mix, 50%\), var\(--vt-studio-number-background\)\)/s)
  assert.match(css, /\.vt-studio-double-split-slider:has\(input\[type="range"\]:is\(:active, :focus\)\) \.vt-studio-double-split-slider__value\s*\{[^}]*-webkit-text-stroke-color:\s*var\(--vt-studio-number-active-stroke, #000\)/s)
  assert.match(css, /\.vt-studio-left-counter:has\([\s\S]*?\.vt-studio-side-counter__value[\s\S]*?-webkit-text-stroke-color:\s*var\(--vt-studio-number-active-stroke, #000\)/)
  assert.match(css, /\.vt-studio-side-counter:has\([\s\S]*?\.vt-studio-side-counter__value[\s\S]*?-webkit-text-stroke:\s*var\(--vt-studio-control-text-stroke, 1px\) var\(--vt-studio-number-active-stroke, #000\)/s)
})

test("generated CSS variables stay synchronized with the canonical token module", () => {
  assert.ok(generator.includes('readFile(resolve(root, "src/studio-ui/tokens.ts")'))
  assert.match(generator, /STUDIO_DROPDOWN_TOKENS/)
  assert.match(generator, /STUDIO_COUNTER_NUMBER_TOKENS/)
  assert.match(generated, /--vt-studio-dropdown-standard-chevron-size: 28px/)
  assert.match(generated, /--vt-studio-dropdown-compact-chevron-size: 18px/)
  assert.match(generated, /--vt-studio-number-default-white-mix: 50%/)
  assert.match(generated, /--vt-studio-number-active-color: #000/)
  assert.match(generated, /--vt-studio-number-active-stroke: #000/)
})


test("half-primary idle fill is reserved for radio and checkbox controls", () => {
  assert.doesNotMatch(css, /html body button\[data-vt-studio-button="true"\] > \[data-vt-studio-button-face\]\s*\{[^}]*background:\s*color-mix\(in srgb, var\(--vt-studio-control-accent[^;]*50%/s);
  assert.doesNotMatch(css, /button\.vt-studio-44-switch\s*\{[^}]*background:\s*color-mix\(in srgb, var\(--vt-studio-control-accent[^;]*50%/s);
  assert.match(css, /button\.vt-studio-44-choice\s*\{[^}]*background:\s*color-mix\(in srgb, var\(--vt-studio-control-accent[^;]*50%/s);
  assert.match(css, /html body button\[data-vt-studio-button="true"\]\[data-selected="true"\] > \[data-vt-studio-button-face\][^}]*background:\s*var\(--vt-studio-control-accent/s);
  assert.match(css, /html body button\[data-vt-studio-button="true"\]\[aria-pressed="true"\] > \[data-vt-studio-button-face\][^}]*background:\s*var\(--vt-studio-control-accent/s);
});


test("double-split slider keeps the reduced readout inset", () => {
  assert.match(css, /\.vt-studio-double-split-slider \[data-vt-studio-split-field\]\s*\{[^}]*padding-inline:\s*calc\(var\(--vt-studio-control-height, 44px\) \* \.09\)/s);
  assert.match(css, /\.vt-studio-double-split-slider \.vt-studio-double-split-slider__value\s*\{[^}]*padding-inline:\s*0[^}]*min-width:\s*0/s);
});

test("dropdown rails and menus share canonical geometry", () => {
  assert.match(css, /\.vt-studio-dropdown\.is-split-left \.vt-studio-dropdown-split-rail\[data-rail="start"\]\s*\{[^}]*height:\s*100%[^}]*aspect-ratio:\s*1\s*\/\s*1[^}]*border-radius:\s*0/s);
  assert.match(css, /\.vt-studio-dropdown:not\(\.is-split-left\) \.vt-studio-dropdown-chevron\.is-trailing\s*\{[^}]*border:\s*0/s);
  assert.match(css, /\.vt-studio-dropdown-menu\s*\{[^}]*border-style:\s*solid[^}]*border-top-left-radius:/s);
});

test("split-left button label cell paints its full width instead of exposing a background gap", () => {
  assert.match(css, /button\[data-vt-studio-button="true"\]:is\(\[data-split-left="true"\], \[data-vt-studio-split="left"\]\) > \[data-vt-studio-button-face\] \[data-vt-studio-split-label\]\s*\{[^}]*background:\s*color-mix\(in srgb, var\(--vt-studio-control-accent[^;]*50%, #fff\)/s)
})

test("compact dropdown trigger synchronizes split grid tracks and visible rail dimensions to 28px", () => {
  assert.match(css, /\.vt-studio-dropdown\[data-size="compact"\] button\[data-dropdown-trigger="true"\]\s*\{[^}]*--vt-studio-dropdown-rail-size:\s*var\(--vt-studio-compact-height, 28px\)[^}]*--vt-studio-control-height:\s*var\(--vt-studio-compact-height, 28px\)/s)
  assert.match(css, /\.vt-studio-dropdown\[data-size="compact"\] button\[data-dropdown-trigger="true"\] \.vt-studio-dropdown-split-rail,[\s\S]*?\.vt-studio-dropdown-chevron\s*\{[^}]*width:\s*var\(--vt-studio-compact-height, 28px\)[^}]*min-width:\s*var\(--vt-studio-compact-height, 28px\)/s)
})


test("Studio text fields use a rounded inset primary stroke instead of square gradient strips", () => {
  assert.match(fieldCss, /box-shadow:\s*inset 0 0 0 var\(--vt-field-inline-width\) var\(--vt-field-inline-primary\)/)
  assert.doesNotMatch(fieldCss, /background-image:\s*[\s\S]*?linear-gradient\(var\(--vt-field-inline-primary/)
})


test("shared interaction focus is token-generated and applies to text-field blur transitions", () => {
  assert.match(tokens, /STUDIO_FOCUS_INTERACTION_TOKENS/);
  assert.match(generator, /STUDIO_FOCUS_INTERACTION_TOKENS/);
  assert.match(generated, /--vt-studio-focus-hold-ms: 1500ms/);
  assert.match(generated, /--vt-studio-focus-outline-fade-ms: 500ms/);
  assert.match(fieldCss, /outline:\s*0 solid transparent/);
  assert.match(fieldCss, /outline-color var\(--vt-studio-focus-outline-fade-ms/);
  assert.match(fieldCss, /outline-width var\(--vt-studio-focus-outline-fade-ms/);
});

test("counter and slider shell capture shares focus without replacing hold-repeat handlers", () => {
  assert.ok(component.includes("onPointerDownCapture: interactionFocus.start"));
  assert.ok(component.includes("onPointerUpCapture: interactionFocus.end"));
  assert.ok(component.includes("onPointerCancelCapture: interactionFocus.end"));
  assert.ok(fieldCss.includes("var(--vt-studio-focus-outline-width-ratio"));
  const stepButtons = component.split("\n").filter(line => line.includes("increment.events") || line.includes("decrement.events"));
  assert.ok(stepButtons.length >= 6, "expected counter and slider step buttons to be covered");
  for (const line of stepButtons) {
    assert.ok(!line.includes("onPointerDown={interactionFocus.start}"), "hold handlers must not be overridden");
    assert.ok(line.includes("onClick={interactionFocus.pulse}"), "keyboard/click activation must pulse focus");
  }
});


test("square icon button badges, tooltips, and ripples escape the shared button shell", () => {
  assert.match(css, /button\[data-vt-studio-icon-button="true"\]\.vt-studio-square-icon-button\s*\{[^}]*overflow:\s*visible/s);
  assert.match(css, /button\[data-vt-studio-button="true"\]:not\(\.vt-studio-square-icon-button\),\s*button\[data-vt-studio-action-button="true"\]\s*\{[^}]*overflow:\s*hidden/s);
});

test("double-split slider uses the reference interaction-focus lifecycle", () => {
  assert.match(component, /useStudioCounterHold\(-1,[\s\S]*?interactionFocus\)/);
  assert.match(component, /useStudioCounterHold\(1,[\s\S]*?interactionFocus\)/);
  assert.match(component, /interactionFocus\?\.start\(\)/);
  assert.match(component, /interactionFocus\?\.end\(\)/);
});


test("dropdown chevrons read size and stroke directly from all five size-tier tokens", () => {
  assert.match(dropdown, /size=\{STUDIO_DROPDOWN_TOKENS\.chevronSize\[sizeVariant\]\}/);
  assert.match(dropdown, /strokeWidth=\{STUDIO_DROPDOWN_TOKENS\.chevronStroke\[sizeVariant\]\}/);
  assert.doesNotMatch(dropdown, /chevronSize\.standard/);
});


test("split text input follows the reference primary inline-stroke and token-owned rail geometry", () => {
  assert.match(splitInputCss, /border:\s*var\(--vt-studio-control-stroke,[^)]*\) solid var\(--vt-split-field-primary\)/);
  assert.match(splitInputCss, /--vt-studio-split-rail-size/);
  assert.match(splitInputCss, /background:\s*color-mix\(in srgb, var\(--vt-split-field-primary\) 50%, transparent\)/);
  assert.doesNotMatch(splitInputCss, /!important/);
});

test("upload frame uses the reference canvas anatomy without dropping current file APIs", () => {
  assert.match(component, /data-size=\{sizeVariant\}/);
  assert.match(component, /vt-studio-upload-frame__label/);
  assert.match(component, /multiple=\{multiple\}/);
  assert.match(component, /onFilesChange\?\.\(files\)/);
  assert.match(css, /\.vt-studio-upload-frame\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9[^}]*overflow:\s*visible/s);
});

test("confirmed square icon library groups every requested effect by size", () => {
  assert.match(catalog, /44px STANDARD · ALL SKINS \+ EFFECTS/);
  assert.match(catalog, /28px COMPACT · ALL SKINS \+ EFFECTS/);
  assert.match(catalog, /effect="bell-ring" variant="v3"/);
  assert.match(catalog, /effect="download" variant="v3"/);
  assert.match(catalog, /effect="refresh" tooltip="REFRESH"/);
  assert.match(catalog, /effect="like" badge=\{0\}/);
  assert.doesNotMatch(catalog, /vt-confirmed-square-effect-pair/);
});


test("switch and choice tracks retain their intrinsic component widths", () => {
  const contentWidthRules = [...css.matchAll(/(?:\\[data-vt-studio-control="true"\\]|button)\\.vt-studio-44-(?:switch|choice)[\\s\\S]{0,180}width:\\s*max-content\\s*!important/g)];
  assert.equal(contentWidthRules.length, 0, "switch and choice controls must not inherit content-width exceptions");
  assert.match(css, /button\\.vt-studio-44-switch\\s*\\{[^}]*width:\\s*75\\.68px/s);
  assert.match(css, /button\\.vt-studio-44-choice\\s*\\{[^}]*width:\\s*44px/s);
});


test("choice and switch primitives do not opt into content-width sizing", () => {
  const switches = component.slice(component.indexOf("export const Studioswitch:"), component.indexOf("export type StudioChoiceKind"));
  const choices = component.slice(component.indexOf("export const StudioChoice:"), component.indexOf("export interface StudioWordToggleProps"));
  assert.doesNotMatch(switches, /data-vt-studio-width="content"/);
  assert.doesNotMatch(choices, /data-vt-studio-width="content"/);
});
