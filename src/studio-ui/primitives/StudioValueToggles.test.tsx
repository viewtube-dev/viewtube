import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StudioArrowToggle, StudioBarToggle, StudioDoubleSideToggle, StudioSideToggle } from "./StudioValueToggles";

describe("Studio value toggle primitives", () => {
  it("changes arrow-toggle options and respects option boundaries", () => {
    const onValueChange = vi.fn();
    render(<StudioArrowToggle options={["A", "B"]} value="A" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Next option" }));
    expect(onValueChange).toHaveBeenCalledWith("B");
    expect(screen.getByRole("button", { name: "Previous option" })).toBeDisabled();
  });
  it("renders Side Toggle text face with a left arrow stack", () => {
    render(<StudioSideToggle options={["LOW", "HIGH"]} value="LOW" onValueChange={() => {}} arrowSide="left" />);
    expect(screen.getByText("LOW")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next option" })).toBeTruthy();
  });
  it("renders independently configured double-side values without the V2 divider", () => {
    render(<StudioDoubleSideToggle variant="v2" left={{ options: ["A", "B"], value: "A", onValueChange: () => {} }} right={{ options: ["X", "Y"], value: "X", onValueChange: () => {} }} />);
    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("X")).toBeTruthy();
    expect(document.querySelector(".vt-studio-value-toggle__divider")).toBeNull();
  });
  it("renders ten bars and exposes the selected level as a meter", () => {
    render(<StudioBarToggle value={50} onValueChange={() => {}} />);
    expect(document.querySelectorAll(".vt-studio-value-toggle__bar")).toHaveLength(10);
    expect(screen.getByRole("meter", { name: "Level" }).getAttribute("aria-valuenow")).toBe("50");
  });

  it("builds Arrow Toggle from the canonical split shell with square icon rails", () => {
    const { container } = render(<StudioArrowToggle options={["A", "B"]} value="A" onValueChange={() => {}} />);
    const shell = container.querySelector('[data-vt-studio-split="double"]');
    expect(shell).toBeTruthy();
    expect(shell?.querySelectorAll(":scope > [data-vt-studio-split-rail]")).toHaveLength(2);
    expect(shell?.querySelector(":scope > [data-vt-studio-split-label]")).toBeTruthy();
  });
  it("uses the canonical one-rail split shell for Side Toggle", () => {
    const { container } = render(<StudioSideToggle options={["LOW", "HIGH"]} value="LOW" onValueChange={() => {}} />);
    const shell = container.querySelector('[data-vt-studio-split="right"]');
    expect(shell).toBeTruthy();
    expect(shell?.querySelectorAll(":scope > [data-vt-studio-split-rail]")).toHaveLength(1);
    expect(shell?.querySelector(":scope > [data-vt-studio-split-label]")).toBeTruthy();
  });
  it("keeps both Double Side Toggle values inside one shared perimeter with a single center divider", () => {
    const { container } = render(<StudioDoubleSideToggle left={{ options: ["A", "B"], value: "A", onValueChange: () => {} }} right={{ options: ["X", "Y"], value: "X", onValueChange: () => {} }} />);
    const shell = container.querySelector('[data-vt-studio-value-toggle="double"]');
    expect(shell?.querySelectorAll(":scope > .vt-studio-value-toggle__double-side")).toHaveLength(2);
    expect(shell?.querySelectorAll(":scope > .vt-studio-value-toggle__divider")).toHaveLength(1);
    expect(shell?.querySelectorAll(".vt-studio-split-shell")).toHaveLength(2);
  });
  it("places Bar Toggle controls in split icon rails around the ten-bar face", () => {
    const { container } = render(<StudioBarToggle value={50} onValueChange={() => {}} />);
    const shell = container.querySelector('[data-vt-studio-split="double"]');
    expect(shell).toBeTruthy();
    expect(shell?.querySelectorAll(":scope > [data-vt-studio-split-rail]")).toHaveLength(2);
    expect(shell?.querySelectorAll(".vt-studio-value-toggle__bar")).toHaveLength(10);
  });

});
