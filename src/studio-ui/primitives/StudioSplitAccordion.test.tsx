import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StudioSplitAccordion, easeTrain, easeTrainInverse, openPanelWidth } from "./StudioSplitAccordion";

const items = [
  { id: "left", accessibleLabel: "Left", icon: <span>L</span>, content: "LEFT PANEL" },
  { id: "middle", accessibleLabel: "Middle", icon: <span>M</span>, content: "MIDDLE PANEL" },
  { id: "right", accessibleLabel: "Right", icon: <span>R</span>, content: "RIGHT PANEL" },
] as const;

describe("StudioSplitAccordion", () => {
  it("defaults to the rightmost enabled item and keeps panel semantics", () => {
    const html = renderToStaticMarkup(<StudioSplitAccordion items={items} />);
    expect(html).toContain('data-vt-studio-split-accordion="true"');
    expect(html).toContain('data-active-index="2"');
    expect(html).toContain("RIGHT PANEL");
    expect(html).toContain("MIDDLE PANEL");
    expect(html).toContain("LEFT PANEL");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-vt-library-component="StudioSplitAccordion"');
  });

  it("supports compact and micro geometry and an explicit initial item", () => {
    const compact = renderToStaticMarkup(<StudioSplitAccordion items={items} defaultActiveIndex={0} sizeVariant="compact" />);
    const micro = renderToStaticMarkup(<StudioSplitAccordion items={items} defaultActiveIndex={1} sizeVariant="micro" />);
    expect(compact).toContain('data-size="compact"');
    expect(compact).toContain('data-active-index="0"');
    expect(micro).toContain('data-size="micro"');
    expect(micro).toContain('data-active-index="1"');
  });

  it("chooses the rightmost enabled item when the requested default is disabled", () => {
    const html = renderToStaticMarkup(<StudioSplitAccordion items={[{ ...items[0], disabled: true }, items[1], { ...items[2], disabled: true }]} />);
    expect(html).toContain('data-active-index="1"');
    expect(html).toContain("MIDDLE PANEL");
  });

  it("supports any section count and marks the selected tab", () => {
    const tenItems = Array.from({ length: 10 }, (_, index) => ({
      id: `item-${index}`, accessibleLabel: `Item ${index}`, icon: <span>{index}</span>, content: `Panel ${index}`,
    }));
    const html = renderToStaticMarkup(<StudioSplitAccordion items={tenItems} activeIndex={7} />);
    expect(html).toContain('data-section-count="10"');
    expect(html).toContain('data-active-index="7"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-controls="vt-studio-split-accordion-');
  });

  it("retains the layout compatibility attribute for left, right, and double values", () => {
    for (const layout of ["left", "right", "double"] as const) {
      const html = renderToStaticMarkup(<StudioSplitAccordion items={items} layout={layout} />);
      expect(html).toContain(`data-layout="${layout}"`);
    }
  });

  it("implements buildTri easing and a bounded inverse", () => {
    expect(easeTrain(0)).toBe(0);
    expect(easeTrain(1)).toBe(1);
    expect(easeTrain(-1)).toBe(0);
    expect(easeTrain(2)).toBe(1);
    for (const value of [0.1, 0.25, 0.5, 0.75, 0.9]) {
      expect(easeTrain(easeTrainInverse(value))).toBeCloseTo(value, 5);
    }
  });

  it("keeps a minimum open panel and uses CSS-measured Studio sizing", () => {
    expect(openPanelWidth(600, 3, 44)).toBe(468);
    expect(openPanelWidth(240, 10, 44)).toBe(44);
    expect(openPanelWidth(600, 3, 44, 3)).toBe(462);
    expect(openPanelWidth(120, 10, 10, 1)).toBe(11);
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-split-accordion.css"), "utf8");
    expect(css).toContain("--vt-sa-height: 44px");
    expect(css).toContain("--vt-sa-height: 28px");
    expect(css).toContain("--vt-sa-height: 12px");
    expect(css).toContain("--vt-sa-face: 38px");
    expect(css).toContain("--vt-sa-face: 24px");
    expect(css).toContain("--vt-sa-face: 10px");
    expect(css).toContain("text-overflow: clip");
    expect(css).not.toContain("text-overflow: ellipsis");
    expect(css).not.toContain("transition: flex-grow");
    expect(css).toContain("var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b))");
    expect(css).toContain("var(--vt-studio-control-accent, var(--pair-a, #36e0f6))");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain('.vt-studio-split-accordion__content:not([data-label-visible="true"]) .vt-studio-split-accordion__content-inner { visibility: hidden; }');
    expect(css).toContain("width: max-content; min-width: max-content; max-width: none;");
    expect(css).toContain("justify-content: center;");
    expect(css).toContain("overflow: hidden; white-space: nowrap; text-overflow: clip;");
    expect(css).not.toContain("@media (max-width: 420px)");
    expect(css).not.toContain("font-size: min(var(--vt-sa-font), 5vw)");
    expect(css).toContain("display: flex; flex: none; align-items: center; justify-content: center;");
    expect(css).toContain("visibility: hidden;");
    expect(css).toContain("gap: var(--vt-sa-stroke); background: #000;");
    expect(css).toContain("border-left: var(--vt-sa-stroke) solid #000;");
    expect(css).toContain("flex: 0 0 var(--vt-sa-face)");
    expect(css).toContain("overflow-x: auto; overflow-y: hidden;");
    expect(css).not.toContain("border-left: var(--vt-sa-stroke) solid #000;\n}");
    expect(css).toContain(".vt-studio-split-accordion__content-inner { transition: none; }");
    expect(css).not.toContain("box-shadow:");
    const source = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioSplitAccordion.tsx"), "utf8");
    expect(source).toContain("currentWidthsRef.current");
    expect(source).toContain("const fromScrollLeft = viewportRef.current?.scrollLeft ?? 0;");
    expect(source).toContain("fromScrollLeft + (targetScrollLeft - fromScrollLeft) * progress");
    expect(source).toContain("content.dataset.panelVisible");
    expect(source).toContain('data-panel-visible={selected ? "true" : "false"}');
    expect(source).not.toContain("const focusIndex = progress < .5 ? previous : next");
  });
});
