import React from "react"
import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, act } from "@testing-library/react"
import { SubToolboxSplitStepper } from "./SubToolboxSplitStepper"

describe("SubToolboxSplitStepper", () => {
  it("uses an editable numeric Studio input and fixed, shadowless compound geometry", () => {
    const { container } = render(<SubToolboxSplitStepper value={5} onValueChange={() => {}} />)
    const root = container.querySelector(".vt-subtoolbox-split-stepper")
    const input = screen.getByRole("spinbutton", { name: "Value" })
    expect(root).toHaveAttribute("data-stepper-size", "standard")
    expect(input).toHaveClass("vt-subtoolbox-split-stepper-value")
    expect(root).not.toHaveClass("is-interacting")
  })

  it("enters full-component focus mode while editing the value", () => {
    const { container } = render(<SubToolboxSplitStepper value={5} onValueChange={() => {}} />)
    const root = container.querySelector(".vt-subtoolbox-split-stepper")!
    const input = screen.getByRole("spinbutton", { name: "Value" })
    fireEvent.focus(input)
    expect(root).toHaveClass("is-interacting")
    fireEvent.blur(input)
    expect(root).not.toHaveClass("is-interacting")
  })

  it("does not enter focus mode for a short button click", () => {
    vi.useFakeTimers()
    try {
      const { container } = render(<SubToolboxSplitStepper value={5} onValueChange={() => {}} />)
      const root = container.querySelector(".vt-subtoolbox-split-stepper")!
      const button = screen.getByRole("button", { name: "Increase Value" })
      fireEvent.pointerDown(button, { button: 0, pointerId: 1 })
      expect(root).not.toHaveClass("is-interacting")
      fireEvent.pointerUp(button, { button: 0, pointerId: 1 })
      act(() => { vi.advanceTimersByTime(400) })
      expect(root).not.toHaveClass("is-interacting")
    } finally {
      vi.useRealTimers()
    }
  })

  it("enters full-component focus mode while a button is held", () => {
    vi.useFakeTimers()
    try {
      const { container } = render(<SubToolboxSplitStepper value={5} onValueChange={() => {}} />)
      const root = container.querySelector(".vt-subtoolbox-split-stepper")!
      const button = screen.getByRole("button", { name: "Increase Value" })
      fireEvent.pointerDown(button, { button: 0, pointerId: 1 })
      act(() => { vi.advanceTimersByTime(361) })
      expect(root).toHaveClass("is-interacting")
      fireEvent.pointerUp(button, { button: 0, pointerId: 1 })
      expect(root).not.toHaveClass("is-interacting")
    } finally {
      vi.useRealTimers()
    }
  })

  it("updates the value from typed input", () => {
    const onValueChange = vi.fn()
    render(<SubToolboxSplitStepper value={5} onValueChange={onValueChange} min={0} max={10} />)
    fireEvent.change(screen.getByRole("spinbutton", { name: "Value" }), { target: { value: "7" } })
    expect(onValueChange).toHaveBeenCalledWith(7)
  })
})
