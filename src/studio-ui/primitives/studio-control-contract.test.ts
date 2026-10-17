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
  it("keeps catalog styles additive around production Studio controls", () => {
    const catalog = read("src/components/studio-hub/studio-hub-primitive-catalogs.css");
    expect(catalog).toContain('.vt-catalog-split-primitive:not(:has([data-vt-studio-control="true"]))');
    expect(catalog).not.toContain('.vt-catalog-field.is-simple-text[data-vt-studio-control="true"] {\n  width:');
  });
  it("documents content-width exceptions instead of silently overriding row fill", () => {
    const tokens = read("src/studio-ui/tokens.ts");
    expect(tokens).toContain("STUDIO_CONTROL_EXCEPTIONS");
    expect(tokens).toContain("STUDIO_WIDTH_POLICY");
    const controls = read("src/studio-ui/primitives/StudioControls.tsx");
    expect(controls).toContain('data-vt-studio-split-face="true"');
    expect(controls).toContain('data-rail="start"');
    expect(controls).toContain('data-rail="end"');
    expect(controls).toContain('data-vt-studio-width="content"');
  });
});
