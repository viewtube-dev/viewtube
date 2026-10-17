import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Studio control global contract", () => {
  it("defines the canonical standard/compact/micro geometry and a fixed 4px gap", () => {
    const css = read("src/styles/studio-control-vars.generated.css");
    for (const token of ["--vt-studio-standard-height: 44px", "--vt-studio-compact-height: 28px", "--vt-studio-micro-height: 14px", "--vt-studio-micro-stroke: 1px", "--vt-studio-micro-radius: 2px", "--vt-studio-micro-font-size: 10px", "--vt-studio-control-gap: 4px"]) expect(css).toContain(token);
  });
  it("keeps split rails secondary and shells flat", () => {
    const css = read("src/styles/studio-control-split.css");
    expect(css).toContain('[data-vt-studio-split="double"]');
    expect(css.match(/background: var\(--vt-studio-control-secondary/g)?.length).toBeGreaterThanOrEqual(2);
    expect(css).toContain("border-radius: 0");
    expect(css).toContain("box-shadow: none");
  });
  it("uses a secondary focus outline at 65% of border width with zero offset", () => {
    const css = read("src/styles/studio-control-fields.css");
    expect(css).toContain("* .65");
    expect(css).toContain("outline-offset: 0");
  });
  it("documents content-width exceptions instead of silently overriding row fill", () => {
    const tokens = read("src/studio-ui/tokens.ts");
    expect(tokens).toContain("STUDIO_CONTROL_EXCEPTIONS");
    expect(tokens).toContain("STUDIO_WIDTH_POLICY");
  });
  it("loads the confirmed visual audit fixes after the shared control styles", () => {
    const controls = read("src/studio-ui/primitives/StudioControls.tsx");
    expect(controls.indexOf('import "../../styles/studio-control-system.css"')).toBeLessThan(controls.indexOf('import "../../styles/studio-library-audit-fixes.css"'));
    expect(controls).toContain('import "../../styles/studio-library-audit-fixes.css"');
    const catalog = read("src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx");
    expect(catalog.indexOf('import "./studio-hub-primitive-catalogs.css"')).toBeLessThan(catalog.indexOf('import "../../styles/studio-library-audit-fixes.css"'));
  });
  it("keeps split rail glyphs black and vertically centers split labels", () => {
    const css = read("src/styles/studio-library-audit-fixes.css");
    expect(css).toContain("stroke: #000");
    expect(css).toContain("fill: #000");
    expect(css).toContain("align-items: center");
    expect(css).toContain("border-color: #000 !important");
  });
  it("preserves textarea-specific 18px/14px typography and thin primary strokes", () => {
    const css = read("src/styles/studio-library-audit-fixes.css");
    expect(css).toContain("--vt-studio-textarea-standard-font-size, 18px");
    expect(css).toContain("--vt-studio-textarea-compact-font-size, 14px");
    expect(css).toContain("--vt-studio-textarea-standard-text-stroke, .5px");
    expect(css).toContain("--vt-studio-textarea-compact-text-stroke, .35px");
    expect(css).toContain("::placeholder");
  });
});
