import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StudioArrowToggle, StudioSideToggle, StudioDoubleSideToggle, StudioBarToggle, StudioDoubleSplitWordCounter } from "./StudioValueToggles";

describe("Studio value toggle primitives", () => {
  it("renders the arrow toggle with the shared split-shell rails and current value", () => {
    const html = renderToStaticMarkup(<StudioArrowToggle value="TWO" options={["ONE", "TWO", "THREE"]} onValueChange={() => {}} ariaLabel="Word count" />);
    expect(html).toContain('data-vt-studio-value-toggle="arrow"');
    expect(html).toContain('data-vt-studio-split="double"');
    expect(html).toContain("TWO");
    expect(html).toContain('aria-label="Previous option"');
    expect(html).toContain('aria-label="Next option"');
  });

  it("renders the side toggle with its arrow rail on the requested side", () => {
    const html = renderToStaticMarkup(<StudioSideToggle value="MID" options={["LOW", "MID", "HIGH"]} onValueChange={() => {}} arrowSide="left" />);
    expect(html).toContain('data-arrow-side="left"');
    expect(html).toContain('data-vt-studio-split="left"');
    expect(html).toContain("MID");
  });

  it("keeps both halves of the double-side toggle inside one group", () => {
    const html = renderToStaticMarkup(<StudioDoubleSideToggle left={{ value: "LOW", options: ["LOW", "HIGH"], onValueChange: () => {} }} right={{ value: "HIGH", options: ["LOW", "HIGH"], onValueChange: () => {} }} />);
    expect(html).toContain('data-vt-studio-value-toggle="double"');
    expect(html).toContain('data-right-appearance="primary"');
    expect(html).toContain("LOW");
    expect(html).toContain("HIGH");
  });

  it("renders the bar toggle as a labelled meter with a bounded value", () => {
    const html = renderToStaticMarkup(<StudioBarToggle value={55} onValueChange={() => {}} barCount={10} ariaLabel="Intensity" />);
    expect(html).toContain('role="meter"');
    expect(html).toContain('aria-valuenow="55"');
    expect(html).toContain('aria-label="Intensity"');
  });

  it("renders the double-split word counter with both chevron rails", () => {
    const html = renderToStaticMarkup(<StudioDoubleSplitWordCounter value={2} onValueChange={() => {}} />);
    expect(html).toContain('data-vt-studio-control-kind="studio-double-split-word-counter"');
    expect(html).toContain('aria-label="Previous Word"');
    expect(html).toContain('aria-label="Next Word"');
    expect(html).toContain("TWO");
  });
});
