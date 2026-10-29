import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const splitInputCss = readFileSync(new URL("./studio-split-text-input.css", import.meta.url), "utf8");
const valueToggles = readFileSync(new URL("./StudioValueToggles.tsx", import.meta.url), "utf8");
const controlSystemCss = readFileSync(new URL("../../styles/studio-control-system.css", import.meta.url), "utf8");
const subtoolboxCss = readFileSync(new URL("../../styles/subtoolbox-system.css", import.meta.url), "utf8");
const catalogCss = readFileSync(new URL("../../components/studio-hub/studio-hub-primitive-catalogs.css", import.meta.url), "utf8");
const toggleOverrides = readFileSync(new URL("../../styles/studio-control-distill-overrides.css", import.meta.url), "utf8");

describe("Studio recovery control styling", () => {
  it("keeps the split input editable and follows the persistent inset/focus field contract", () => {
    expect(splitInputCss).toContain("pointer-events: auto;");
    expect(splitInputCss).toContain("50%, transparent");
    expect(splitInputCss).toContain("15%, transparent");
    expect(splitInputCss).toContain("outline-offset: 0 !important;");
  });

  it("preserves the side-toggle direction metadata required by the production CSS", () => {
    expect(valueToggles).toContain('"data-arrow-side": arrowSide');
    expect(valueToggles).toContain('"data-size": size');
    expect(valueToggles).toContain("StudioArrowToggle");
    expect(valueToggles).toContain("StudioSideToggle");
    expect(valueToggles).toContain("StudioDoubleSideToggle");
  });

  it("uses primary 50% fill and a primary inset border for split slider centers, with 15% focus fill", () => {
    expect(controlSystemCss).toContain('.vt-studio-double-split-slider [data-vt-studio-split-field]');
    expect(controlSystemCss).toContain("50%, transparent");
    expect(controlSystemCss).toContain("15%, transparent");
    expect(subtoolboxCss).toContain(".vt-subtoolbox-slider-center,.vt-subtoolbox-range-center");
    expect(subtoolboxCss).toContain("background:color-mix(in srgb,var(--slider-color) 50%,transparent)");
    expect(subtoolboxCss).toContain("background:color-mix(in srgb,var(--slider-color) 15%,transparent)");
    expect(catalogCss).toContain(".vt-complete-catalog .slider-center,.vt-complete-catalog .range-center");
    expect(catalogCss).toContain("color-mix(in srgb,var(--pair-a,#36e0f6) 50%,transparent)");
    expect(catalogCss).toContain("color-mix(in srgb,var(--pair-a,#36e0f6) 15%,transparent)");
  });

  it("keeps the bar-toggle recovery coloring while preserving token-owned geometry", () => {
    expect(toggleOverrides).toContain('.vt-studio-value-toggle__bar[data-active="false"]');
    expect(toggleOverrides).toContain("color-mix(in srgb, #fff 50%, var(--vt-studio-control-accent");
    expect(toggleOverrides).toContain('.vt-studio-value-toggle__bar[data-active="true"]');
    expect(toggleOverrides).toContain("background: #000 !important;");
    expect(toggleOverrides).toContain("--vt-bar-height: var(--vt-studio-control-font-size");
  });
});
