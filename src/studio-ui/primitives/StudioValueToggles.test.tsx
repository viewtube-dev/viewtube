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
});
