import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { STUDIO_CONTROL_SIZE_BASE, STUDIO_CONTROL_SIZE_CONTRACT, studioSizeTierToCssVars } from "../tokens";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Studio control global contract", () => {
  it("projects every canonical tier metric through the production CSS-variable API", () => {
    expect(STUDIO_CONTROL_SIZE_BASE.supreme.height).toBe(60);
    expect(STUDIO_CONTROL_SIZE_BASE.standard.height).toBe(44);
    expect(STUDIO_CONTROL_SIZE_BASE.compact.height).toBe(28);
    expect(STUDIO_CONTROL_SIZE_BASE.micro.height).toBe(12);

    const supreme = studioSizeTierToCssVars("supreme");
    const micro = studioSizeTierToCssVars("micro");
    expect(supreme["--vt-studio-control-height"]).toBe("60px");
    expect(supreme["--vt-studio-control-font-weight"]).toBe(1000);
    expect(supreme["--vt-studio-control-text-stroke"]).toBe("1px");
    expect(supreme["--vt-studio-control-focus-outline-width"]).toBe("1.95px");
    expect(micro["--vt-studio-control-height"]).toBe("12px");
    expect(micro["--vt-studio-control-font-size"]).toBe("10px");
    expect(micro["--vt-studio-control-text-stroke"]).toBe("0.4px");
    expect(micro["--vt-studio-control-focus-outline-width"]).toBe("0.975px");
    const mini = studioSizeTierToCssVars("mini");
    expect(mini["--vt-studio-control-height"]).toBe("20px");
    expect(mini["--vt-studio-control-text-stroke"]).toBe("0.4px");
  });

  it("defines canonical Supreme/standard/compact/Micro geometry without an internal gap token", () => {
    const css = read("src/styles/studio-control-vars.generated.css");
    for (const token of ["--vt-studio-supreme-height: 60px", "--vt-studio-standard-height: 44px", "--vt-studio-compact-height: 28px", "--vt-studio-micro-height: 12px", "--vt-studio-mini-height: 20px", "--vt-studio-micro-stroke: 1.5px", "--vt-studio-micro-radius: 3px", "--vt-studio-micro-font-size: 10px", "--vt-studio-textarea-standard-font-size: 18px", "--vt-studio-textarea-compact-font-size: 14px", "--vt-studio-textarea-standard-text-stroke: 0.5px", "--vt-studio-textarea-compact-text-stroke: 0.35px", "--vt-studio-textarea-min-height: 92px", "--vt-studio-textarea-line-height: 0.85"]) expect(css).toContain(token);
    expect(css).toContain("--vt-studio-supreme-height: 60px");
    expect(css).not.toContain("--vt-studio-14-height");
    expect(css).not.toContain("--vt-studio-control-gap");
  });
  it("centers all split labels against the full outer shell, independent of rail placement", () => {
    const css = read("src/styles/studio-control-split.css");
    expect(css).toContain('position: relative;\n  display: grid;');
    expect(css).toContain('[data-vt-studio-control="true"][data-vt-studio-split] [data-vt-studio-split-label] {\n  position: absolute;\n  z-index: 0;\n  inset: 0;');
    expect(css).toContain('[data-vt-studio-control="true"] [data-vt-studio-split-rail][data-rail="start"] {\n  grid-column: 1;');
    expect(css).toContain('[data-vt-studio-control="true"] [data-vt-studio-split-rail][data-rail="end"] {\n  grid-column: -1;');
    expect(css).toContain('[data-vt-studio-control="true"] [data-vt-studio-split-face] [data-vt-studio-split-label] {\n  position: absolute;');
  });
  it("keeps split rails secondary and shells flat", () => {
    const css = read("src/styles/studio-control-split.css");
    expect(css).toContain('[data-vt-studio-split="double"]');
    expect(css.match(/background: var\(--vt-studio-control-secondary/g)?.length).toBeGreaterThanOrEqual(2);
    expect(css).toContain("border-radius: 0");
    expect(css).toContain("box-shadow: none");
    expect(css).toContain("border: var(--vt-studio-control-stroke, 3px) solid #000");
    expect(css).toContain("color: #000;");
    expect(css).toContain("align-items: center;");
    expect(css).toContain("justify-content: center;");
    expect(css).toContain('[data-vt-studio-split-rail][data-rail="start"]');
    expect(css).toContain('[data-vt-studio-split-rail][data-rail="end"]');
    expect(css).toContain("[data-vt-studio-split-rail] > svg *");
  });
  it("keeps split-left button rails black and vertically centers icon and label", () => {
    const css = read("src/styles/studio-control-system.css");
    expect(css).toContain('button[data-vt-studio-button="true"]:is([data-split-left="true"], [data-vt-studio-split="left"]) > [data-vt-studio-button-face]');
    expect(css).toContain('grid-template-columns: var(--vt-studio-control-height) minmax(0, 1fr)');
    expect(css).toContain('place-items: center');
    expect(css).toContain('border-right: var(--vt-studio-control-stroke) solid #000');
    expect(css).toContain('color: #000;\n  stroke: #000;');
    expect(css).toContain('align-items: center;\n  justify-content: center;');
    expect(css).toContain('text-align: center;');
    const start = css.indexOf("/* Final split-left visual invariant:");
    const end = css.indexOf("\n/*", start + 1);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    expect(css.slice(start, end)).not.toContain("!important");
  });
  it("uses a secondary focus outline at 65% of border width with zero offset across all size tiers", () => {
    const fields = read("src/styles/studio-control-fields.css");
    const system = read("src/styles/studio-control-system.css");
    const tokens = read("src/studio-ui/tokens.ts");

    expect(fields).toContain("var(--vt-studio-focus-outline-width-ratio, 0.65)");
    expect(fields).toContain("outline-offset: 0");
    expect(system).toContain("--vt-studio-control-focus-outline-width: 1.95px");
    expect(system).toContain("--vt-studio-control-focus-outline-width: 1.3px");
    expect(system).toContain("var(--vt-studio-micro-focus-outline-width, 0.975px)");
    expect(system).not.toContain("--vt-studio-control-focus-outline-width: 1px");
    expect(system).toContain(".vt-studio-floating-field[data-size=\"micro\"] {\n  --vt-studio-control-floating-label-height: var(--vt-studio-micro-font-size, 10px);\n  --vt-studio-control-focus-outline-width: var(--vt-studio-micro-focus-outline-width, 0.975px);\n}");
    expect(system).toContain("outline-offset: 0;");
    const finalGenericFocusRule = system.slice(system.lastIndexOf("/* Explicit non-button exceptions:"));
    expect(finalGenericFocusRule).not.toContain("outline-offset: 1px");
    expect(system).not.toContain("--vt-studio-control-focus-outline-width: 3px");
    expect(system).not.toContain("--vt-studio-control-focus-outline-width: 2px");
    expect(system).not.toContain("--vt-studio-control-secondary-outline-width: 1.5px");
    expect(system).not.toContain("--vt-studio-control-secondary-outline-width: 1px");
    expect(tokens).toContain("focusOutlineWidth: 1.95");
    expect(tokens).toContain("focusOutlineWidth: 1.3");
    expect(tokens).toContain("secondaryFocusOutlineWidth: 1.3");
    expect(tokens).toContain("secondaryFocusOutlineWidth: 1.95");
  });
  it("documents content-width exceptions instead of silently overriding row fill", () => {
    const tokens = read("src/studio-ui/tokens.ts");
    expect(tokens).toContain("STUDIO_CONTROL_EXCEPTIONS");
    expect(tokens).toContain("STUDIO_WIDTH_POLICY");
  });
  it("keeps field typography separate from border geometry in the canonical stylesheet", () => {
    const css = read("src/styles/studio-control-system.css");
    expect(css).toContain("--vt-studio-control-text-stroke, 1px");
    expect(css).toContain("--vt-studio-textarea-standard-font-size, 18px");
    expect(css).toContain("--vt-studio-textarea-compact-font-size, 14px");
    expect(css).toContain("--vt-studio-textarea-standard-text-stroke, 0.5px");
    expect(css).toContain("--vt-studio-textarea-compact-text-stroke, 0.35px");
    expect(css).toContain('textarea[data-vt-studio-control="true"][data-vt-studio-field-kind="textarea"]:is(:focus, :focus-visible)');
    expect(css).toContain("-webkit-text-fill-color: #000;");
    expect(css).toContain("-webkit-text-stroke-color: #000;");
    expect(css).not.toContain("-webkit-text-stroke: var(--vt-field-stroke) var(--vt-field-primary)");
    const start = css.indexOf("/* Canonical Studio Controls field contract.");
    const end = css.indexOf("/* 2. Canonical 44px selection-control geometry.", start);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    expect(css.slice(start, end)).not.toContain("!important");
    const controls = read("src/studio-ui/primitives/StudioControls.tsx");
    expect(controls).not.toContain("studio-library-audit-fixes.css");
  });


  it("preserves the original 20px animated closeable pill tag design", () => {
    const css = read("src/styles/studio-control-system.css");
    const start = css.indexOf(".vt-studio-closeable-badge {");
    const end = css.indexOf(".vt-studio-tag-editor {", start);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    const badge = css.slice(start, end);
    expect(badge).toContain("height: 20px");
    expect(badge).toContain("width: max-content");
    expect(badge).toContain("border-radius: 999px");
    expect(badge).toContain("padding: 0 2px 0 8px");
    expect(badge).toContain("font: 1000 16px/20px");
    expect(badge).toContain("color-mix(in srgb, var(--vt-badge-primary) 50%, #fff)");
    const badgeShell = badge.slice(0, badge.indexOf("\n}"))
    expect(badgeShell).not.toMatch(/\n\s*border:\s/);
    expect(badge).toContain("background: var(--vt-badge-primary)");
    expect(badge).toContain("flex: 0 0 16px");
    expect(badge).toContain("border-radius: 50%");
    expect(badge).toContain("animation: vt-studio-badge-swap 180ms linear 3");
    expect(badge).toContain("@keyframes vt-studio-badge-enter");
    expect(badge).toContain("@keyframes vt-studio-badge-swap");
    expect(badge).not.toContain("--vt-studio-control-height");
    expect(badge).not.toContain("--vt-studio-control-stroke");
  });


  it("keeps field typography in the canonical rules without a late important override layer", () => {
    const css = read("src/styles/studio-control-fields.css");
    expect(css).not.toContain("Final global field contract:");
    // Only stroke-color enforcement may use !important; geometry and typography never do.
    expect(css).not.toMatch(/(?:font-size|line-height|height|width|border-width|padding)[^;:]*:!auto[^;]*!important/);
    expect(css).not.toMatch(/(?:font-size|line-height|min-height|border)[^;]*!important/);
    expect(css).toContain("--vt-studio-control-text-stroke, 1px");
    expect(css).toContain("--vt-studio-textarea-standard-text-stroke, 0.5px");
    expect(css).toContain("--vt-studio-textarea-standard-text-stroke, 0.5px");
    expect(css).toContain("--vt-studio-textarea-compact-text-stroke, 0.35px");
    expect(css).toContain("outline-offset: 0");
  });
  it("keeps both double-split slider rails opposite the center fill and uses a smaller white handle", () => {
    const css = read("src/styles/studio-control-system.css");
    const start = css.indexOf("/* StudioDoubleSplitSlider —");
    expect(start).toBeGreaterThanOrEqual(0);
    const slider = css.slice(start);
    expect(slider).toContain(".vt-studio-double-split-slider .vt-studio-double-split-slider__rail");
    expect(slider).toContain(".vt-studio-double-split-slider .vt-studio-double-split-slider__reset,");
    expect(slider).toContain("background: var(--vt-studio-control-primary, var(--pair-a, #36e0f6));");
    expect(slider).toContain("background: var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b));");
    expect(slider).toContain("width: max(7px, calc(var(--vt-studio-control-height, 44px) * .44));");
    expect(slider).toContain("height: max(12px, calc(var(--vt-studio-control-height, 44px) * .78));");
    expect(slider).toContain("border-radius: calc(var(--vt-studio-slider-radius) * .5);");
    expect(slider.match(/background: #fff;/g)?.length).toBeGreaterThanOrEqual(2);
    expect(slider).toContain(".vt-studio-double-split-slider.is-reversed .vt-studio-double-split-slider__reset");
    expect(slider).toContain("background: var(--vt-studio-control-primary, var(--pair-b, #ff7f6b));");
  });
  it("keeps primary inline glyph strokes explicit for plain inputs and textareas", () => {
    const inputCss = read("src/styles/studio-text-input.css");
    const fieldCss = read("src/styles/studio-control-fields.css");

    expect(inputCss).toContain("-webkit-text-stroke: var(--vt-studio-control-text-stroke, 1px) var(--vt-studio-control-accent, var(--pair-a, #36e0f6));");
    expect(inputCss).not.toContain("-webkit-text-stroke: var(--vt-studio-control-text-stroke, 1px) currentColor;");
    expect(fieldCss).toContain("-webkit-text-stroke: var(--vt-studio-control-text-stroke, 1px) var(--vt-field-primary);");
    expect(fieldCss).toContain("-webkit-text-stroke: var(--vt-studio-textarea-standard-text-stroke, 0.5px) var(--vt-field-primary, var(--pair-a, #36e0f6));");
    expect(fieldCss).toContain("-webkit-text-stroke: var(--vt-studio-textarea-compact-text-stroke, 0.35px) var(--vt-field-primary, var(--pair-a, #36e0f6));");
    expect(fieldCss).toContain("-webkit-text-stroke-color: #000;");
  });
  it("keeps the Confirmed Primitive Library grid on the 4px spacing unit", () => {
    const css = read("src/components/studio-hub/studio-hub-primitive-catalogs.css");
    const start = css.lastIndexOf("/* Canonical 4px catalog grid:");
    expect(start).toBeGreaterThanOrEqual(0);
    const contract = css.slice(start);
    expect(contract).toContain(".vt-confirmed-catalog { gap: var(--vt-confirmed-space-1) !important; padding: 0 !important; }");
    expect(contract).toContain(".vt-confirmed-variants { gap: var(--vt-confirmed-space-1) !important; }");
    expect(contract).toContain(".vt-confirmed-family { padding: var(--vt-confirmed-space-1) !important; }");
    expect(contract).not.toContain("--vt-confirmed-space-2");
    expect(contract).not.toContain("--vt-confirmed-space-3");
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
    expect(css).toContain("grid-template-columns: repeat(4, minmax(0, 1fr))");
  });

});


describe("Studio textarea typography token ownership", () => {
  it("declares explicit text-stroke widths for all four generated textarea tiers", () => {
    expect(STUDIO_CONTROL_SIZE_CONTRACT.multiline.supremeTextStroke).toBeCloseTo(0.68, 2);
    expect(STUDIO_CONTROL_SIZE_CONTRACT.multiline.standardTextStroke).toBe(0.5);
    expect(STUDIO_CONTROL_SIZE_CONTRACT.multiline.compactTextStroke).toBe(0.35);
    expect(STUDIO_CONTROL_SIZE_CONTRACT.multiline.miniTextStroke).toBe(0.4);
    expect(STUDIO_CONTROL_SIZE_CONTRACT.multiline.microTextStroke).toBe(0.4);
  });

  it("pairs editable-field text and glyph stroke through state tokens without important overrides", () => {
    const fields = read("src/styles/studio-control-fields.css");
    const system = read("src/styles/studio-control-system.css");
    const distill = read("src/styles/studio-control-distill-overrides.css");

    expect(system).toContain("--vt-field-text-focus: #000");
    expect(system).toContain("--vt-field-text-stroke-focus: var(--vt-field-text-focus)");
    expect(system).toContain("--vt-field-caret-focus: var(--vt-field-primary)");
    expect(fields).toContain("-webkit-text-stroke-color: var(--vt-field-text-stroke-focus)");
    expect(fields).toContain("caret-color: var(--vt-field-caret-focus)");
    expect(fields).not.toMatch(/:focus[^{]*\{[^}]*-webkit-text-stroke-color:\s*var\(--vt-field-primary/);
    expect(fields).not.toMatch(/:focus[^{]*\{[^}]*-webkit-text-stroke-color:[^;]*!important/);
    expect(distill).toContain("-webkit-text-stroke-color: var(--vt-field-text-stroke-focus)");
    expect(distill).not.toMatch(/:focus[^{]*\{[^}]*-webkit-text-stroke-color:\s*var\(--vt-field-primary/);
  });
});


describe("StudioInterModule shared separator contract", () => {
  it("keeps one shared line between collapsed modules and restores it after an expanded body", () => {
    const css = read("src/styles/studio-inter-module.css");
    expect(css).toContain('.vt-studio-inter-module__body > .vt-studio-inter-module + .vt-studio-inter-module > .vt-studio-inter-module__head {\n  border-top: 0;');
    expect(css).toContain('.vt-studio-inter-module[data-open="true"] + .vt-studio-inter-module > .vt-studio-inter-module__head {\n  border-top-width: var(--vt-im-stroke, 2px);');
    expect(css).toContain('.vt-studio-inter-module[data-flush-body="true"] > .vt-studio-inter-module__body {\n  padding-left: 0;\n  padding-right: 0;');
  });
});

describe("Brain chat layout and prompt library contract", () => {
  it("uses nested StudioInterModule prompts and keeps composer scrolling bounded", () => {
    const page = read("src/views/AIBrainCommandInterface.tsx");
    const primitives = read("src/components/brain/BrainChatPrimitives.tsx");
    const start = page.indexOf("export const BrainPromptLibrary");
    const end = page.indexOf("\nconst FEEDBACK_OPTIONS", start);
    const library = page.slice(start, end);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    expect(library).toContain("<StudioTopSplitModule");
    expect(library).toContain('data-vt-studio-inter-host="true"');
    expect(library).toContain("<StudioInterModule");
    expect(library).toContain("data-prompt-id={card.id}");
    expect(library).toContain("SEND TO CHAT");
    expect(library).toContain("EDIT FIRST");
    expect(library).not.toContain("<StudioCollapsingTwoLineModule");
    expect(page).not.toContain("scrollIntoView");
    expect(page).toContain("requestInFlightRef.current");
    expect(page).toContain("feedbackInFlightRef.current");
    expect(primitives).toContain("pb-[max(8px,env(safe-area-inset-bottom))]");
    expect(primitives).not.toContain("bottomRef");
    const layout = read("src/components/brain/BrainChatPrimitives.css");
    expect(layout).toContain("grid-template-columns: minmax(0, 1fr) auto;");
    expect(layout).toContain("gap: 4px;");
    expect(layout).toContain("@media (min-width: 640px)");
    expect(layout.match(/gap:\s*\d+px;/g)).toEqual(["gap: 4px;", "gap: 4px;"]);
    expect(primitives).not.toMatch(/gap-\d+\.\d+/);
    expect(page).toContain("const additionalModules = filteredModules.slice(3)");
    expect(page.indexOf("response-key-insight")).toBeLessThan(page.indexOf("additional-answer-modules"));
    expect(page.indexOf("additional-answer-modules")).toBeLessThan(page.indexOf("<BrainDataReadiness readiness={message.readiness} />"));
    expect(page).toContain("if (presentation.tone === \"ready\") return null");
  });
});
