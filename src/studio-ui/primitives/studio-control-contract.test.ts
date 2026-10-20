import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Studio control global contract", () => {
  it("defines canonical Supreme/standard/compact/Micro geometry without an internal gap token", () => {
    const css = read("src/styles/studio-control-vars.generated.css");
    for (const token of ["--vt-studio-supreme-height: 60px", "--vt-studio-standard-height: 44px", "--vt-studio-compact-height: 28px", "--vt-studio-micro-height: 12px", "--vt-studio-micro-stroke: 1px", "--vt-studio-micro-radius: 2px", "--vt-studio-micro-font-size: 10px"]) expect(css).toContain(token);
    expect(css).not.toContain("--vt-studio-control-gap");
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

    expect(fields).toContain("* .65");
    expect(fields).toContain("outline-offset: 0");
    expect(system).toContain("--vt-studio-control-focus-outline-width: 1.95px");
    expect(system).toContain("--vt-studio-control-focus-outline-width: 1.3px");
    expect(system).toContain("--vt-studio-control-focus-outline-width: .65px");
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
    expect(css).toContain("--vt-studio-textarea-standard-text-stroke, .5px");
    expect(css).toContain("--vt-studio-textarea-compact-text-stroke, .35px");
    expect(css).toContain('textarea[data-vt-studio-control="true"][data-vt-studio-field-kind="textarea"]:is(:focus, :focus-visible)');
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
    expect(css).not.toContain("!important");
    expect(css).toContain("--vt-studio-control-text-stroke, 1px");
    expect(css).toContain("--vt-studio-control-text-stroke, 0.5px");
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
});
