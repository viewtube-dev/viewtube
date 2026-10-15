import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
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


  it("keeps fixed 2:1 field geometry, square rail, doubled chevrons and no drop shadow", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components/subtoolbox/subtoolbox-split-stepper.css"), "utf8")
    expect(css).toContain("flex: 0 0 auto;")
    expect(css).toContain("width: calc(var(--vt-stepper-inner-height) * 3 + (var(--vt-stepper-stroke) * 2));")
    expect(css).toContain("width: var(--vt-stepper-inner-height);")
    expect(css).toContain("box-shadow: none;")
    expect(css).toContain("background: color-mix(in srgb, var(--pair-a, #73deff) 50%, transparent);")
    expect(css).toContain("box-shadow: inset 0 0 0 var(--vt-stepper-stroke) var(--pair-a, #73deff);")
    expect(css).toContain("width: calc(var(--vt-stepper-height) * .68);")
    expect(css).toContain("outline: 2px solid var(--pair-b, #fff);")
  })

  it("updates the value from typed input", () => {
    const onValueChange = vi.fn()
    render(<SubToolboxSplitStepper value={5} onValueChange={onValueChange} min={0} max={10} />)
    fireEvent.change(screen.getByRole("spinbutton", { name: "Value" }), { target: { value: "7" } })
    expect(onValueChange).toHaveBeenCalledWith(7)
  })
})
