import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const styles = read("src/components/studio-hub/studio-hub-primitive-catalogs.css");
const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx");
const controls = read("src/studio-ui/primitives/StudioControls.tsx");
const publicApi = read("src/studio-ui/index.ts");
const marker = "/* Confirmed Primitive Library 4px grid contract */";
const grid = styles.slice(styles.lastIndexOf(marker));

describe("Confirmed Primitive Library grid contract", () => {
  it("uses a shared 4px unit for the catalog, family, variant, and specimen grids", () => {
    expect(grid).toContain("--vt-confirmed-grid-unit: 4px");
    expect(grid).toMatch(/\.vt-confirmed-catalog\s*\{[^}]*gap:\s*calc\(var\(--vt-confirmed-grid-unit\) \* 3\)/s);
    expect(grid).toMatch(/\.vt-confirmed-family\s*\{[^}]*gap:\s*calc\(var\(--vt-confirmed-grid-unit\) \* 2\)/s);
    expect(grid).toMatch(/\.vt-confirmed-variants\s*\{[^}]*gap:\s*calc\(var\(--vt-confirmed-grid-unit\) \* 2\)/s);
    expect(grid).toMatch(/\.vt-confirmed-variant\s*\{[^}]*gap:\s*var\(--vt-confirmed-grid-unit\)/s);
    expect(grid).toMatch(/\.vt-confirmed-choice-example-row[^{}]*\{[^}]*gap:\s*var\(--vt-confirmed-grid-unit\)/s);
    expect(grid).toMatch(/\.vt-confirmed-stepper-row-grid[^{}]*\{[^}]*gap:\s*calc\(var\(--vt-confirmed-grid-unit\) \* 2\)/s);
  });

  it("keeps responsive grid cells shrinkable and leaves control geometry to production primitives", () => {
    expect(grid).toMatch(/@media\s*\(max-width:\s*560px\)[\s\S]*?\.vt-confirmed-variants\s*\{[^}]*min-width:\s*0/);
    expect(grid).toMatch(/\.vt-confirmed-variant\s*\{[^}]*min-width:\s*0/s);
    expect(grid).not.toMatch(/\.vt-confirmed-(?:catalog|family|variants|variant)[^{]*\{[^}]*\b(?:height|border-radius|box-shadow|font-size|font-weight):/s);
  });

  it("registers the real inline and split stepper exports rather than mock controls", () => {
    expect(catalog).toContain('primitive="StudioInlineStepper"');
    expect(catalog).toContain('data-vt-library-component="StudioInlineStepper"');
    expect(catalog).toContain('primitive="StudioSplitStepper"');
    expect(catalog).toContain('data-vt-library-component="StudioSplitStepper"');
    expect(controls).toContain("export const StudioInlineStepper");
    expect(controls).toContain("export const StudioSplitStepper");
    expect(publicApi).toContain("StudioInlineStepper");
    expect(publicApi).toContain("StudioSplitStepper");
  });
});
