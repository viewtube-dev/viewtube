import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  StudioTextBox, StudioVerticalWordToggle, StudioSquareIconButton, StudioSquareIconButtonGroup,
  StudioSplitAccordion, StudioArrowToggle, StudioSideToggle, StudioDoubleSideToggle,
  StudioBarToggle, StudioDoubleSplitWordCounter, StudioLeftWordCounter, openPanelWidth, iconPositions, easeTrain,
} from "./StudioControls";

describe("restored Studio production primitives", () => {
  it("renders read-only text with the shared field contract", () => {
    const html = renderToStaticMarkup(<StudioTextBox>DISPLAY VALUE</StudioTextBox>);
    expect(html).toContain('data-vt-studio-text-box="true"');
    expect(html).toContain('aria-readonly="true"');
    expect(html).toContain("DISPLAY VALUE");
  });

  it("renders the original vertical two-word switch as a real switch", () => {
    const html = renderToStaticMarkup(<StudioVerticalWordToggle value={false} onValueChange={() => {}} words={["WRITE","CREATE"]}/>);
    expect(html).toContain('role="switch"');
    expect(html).toContain('data-vt-studio-vertical-word-toggle="true"');
    expect(html).toContain("WRITE");
    expect(html).toContain("CREATE");
  });

  it("groups five square icon actions in one accessible toolbar", () => {
    const html = renderToStaticMarkup(<StudioSquareIconButtonGroup sizeVariant="standard" aria-label="Five actions">
      {[0,1,2,3,4].map(i => <StudioSquareIconButton key={i} icon={<span/>} label={`Action ${i+1}`} sizeVariant="standard" />)}
    </StudioSquareIconButtonGroup>);
    expect(html).toContain('role="toolbar"');
    expect(html).toContain('aria-label="Five actions"');
    expect((html.match(/data-vt-studio-icon-button=/g) ?? []).length).toBe(5);
  });

  it("renders the restored split accordion with its accessible label", () => {
    const html = renderToStaticMarkup(<StudioSplitAccordion accessibleLabel="Sections" items={[{accessibleLabel:"One",icon:<span>1</span>,content:<span>Content one</span>},{accessibleLabel:"Two",icon:<span>2</span>,content:<span>Content two</span>}]} />);
    expect(html).toContain("Sections");
    expect(html).toContain("Content one");
  });

  it("keeps the complete value-toggle family backed by the shared split shell", () => {
    const arrow = renderToStaticMarkup(<StudioArrowToggle value="TWO" options={["ONE","TWO"]} onValueChange={() => {}} />);
    const side = renderToStaticMarkup(<StudioSideToggle value="MID" options={["LOW","MID"]} onValueChange={() => {}} arrowSide="left" />);
    const double = renderToStaticMarkup(<StudioDoubleSideToggle left={{value:"LOW",options:["LOW","HIGH"],onValueChange:()=>{}}} right={{value:"HIGH",options:["LOW","HIGH"],onValueChange:()=>{}}}/>);
    const bar = renderToStaticMarkup(<StudioBarToggle value={50} onValueChange={() => {}} barCount={8}/>);
    const counter = renderToStaticMarkup(<StudioDoubleSplitWordCounter value={2} onValueChange={() => {}}/>);
    expect(arrow).toContain('data-vt-studio-split="double"');
    expect(side).toContain('data-arrow-side="left"');
    expect(double).toContain('data-vt-studio-value-toggle="double"');
    expect(bar).toContain('role="meter"');
    expect(counter).toContain('studio-double-split-word-counter');
  });

  it("renders the four-state left word counter using the canonical left rail", () => {
    const html = renderToStaticMarkup(<StudioLeftWordCounter value={3} onValueChange={() => {}} />);
    expect(html).toContain("THREE");
    expect(html).toContain("studio-left-word-counter");
  });

  it("preserves accordion geometry helpers", () => {
    expect(openPanelWidth(400, 3, 44, 3)).toBe(262);
    expect(iconPositions([44,80,44], 3)).toEqual([0,47,130]);
    expect(easeTrain(0)).toBe(0);
    expect(easeTrain(1)).toBe(1);
  });
});
