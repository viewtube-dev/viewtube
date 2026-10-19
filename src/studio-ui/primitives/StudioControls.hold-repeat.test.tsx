// @vitest-environment jsdom
import React, { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { StudioCounter } from "./StudioControls"

let container: HTMLDivElement
let root: Root
let value = 0
const onValueChange = vi.fn((next: number) => { value = next })

const renderCounter = (props: Partial<React.ComponentProps<typeof StudioCounter>> = {}) => {
  act(() => {
    root.render(<StudioCounter value={value} onValueChange={onValueChange} min={0} max={5} step={1} ariaLabel="Test value" {...props} />)
  })
}

const button = (label: string) => {
  const node = container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)
  if (!node) throw new Error(`Missing counter button: ${label}`)
  return node
}
const pointer = (node: HTMLButtonElement, type: "pointerdown" | "pointerup" | "pointercancel" | "lostpointercapture") => {
  act(() => { node.dispatchEvent(new MouseEvent(type, { bubbles: true, button: 0 })) })
}
const click = (node: HTMLButtonElement) => act(() => { node.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 })) })

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date("2026-10-19T12:00:00.000Z"))
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  value = 0
  onValueChange.mockClear()
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe("Studio counter hold-repeat interaction", () => {
  it("preserves immediate single-click and step behavior", () => {
    renderCounter({ value: 2, step: 0.5, max: 3 })
    const increase = button("Increase Test value")
    pointer(increase, "pointerdown")
    pointer(increase, "pointerup")
    click(increase)
    expect(onValueChange).toHaveBeenLastCalledWith(2.5)
    expect(vi.getTimerCount()).toBe(0)
  })

  it("repeats on hold, clamps at max, and suppresses the release click", () => {
    renderCounter({ max: 3 })
    const increase = button("Increase Test value")
    pointer(increase, "pointerdown")
    act(() => { vi.advanceTimersByTime(380) })
    expect(onValueChange).toHaveBeenLastCalledWith(1)
    renderCounter()
    act(() => { vi.advanceTimersByTime(40) })
    expect(onValueChange).toHaveBeenLastCalledWith(1)
    act(() => { vi.advanceTimersByTime(1) })
    expect(onValueChange).toHaveBeenLastCalledWith(2)
    renderCounter()
    act(() => { vi.advanceTimersByTime(53) })
    expect(onValueChange).toHaveBeenLastCalledWith(2)
    act(() => { vi.advanceTimersByTime(1) })
    expect(onValueChange).toHaveBeenLastCalledWith(3)
    renderCounter()
    act(() => { vi.advanceTimersByTime(75) })
    expect(onValueChange).toHaveBeenCalledTimes(3)
    pointer(increase, "pointerup")
    click(increase)
    expect(onValueChange).toHaveBeenCalledTimes(3)
    expect(vi.getTimerCount()).toBe(0)
  })

  it("cancels a pending hold on pointer cancel, lost capture, and blur", () => {
    for (const cancel of ["pointercancel", "lostpointercapture", "pointerup"] as const) {
      renderCounter({ value: 0 })
      const increase = button("Increase Test value")
      pointer(increase, "pointerdown")
      pointer(increase, cancel)
      act(() => { vi.advanceTimersByTime(1500) })
      expect(onValueChange).not.toHaveBeenCalled()
    }
    renderCounter({ value: 0 })
    const increase = button("Increase Test value")
    pointer(increase, "pointerdown")
    act(() => { increase.dispatchEvent(new FocusEvent("blur", { bubbles: false })) })
    act(() => { vi.advanceTimersByTime(1500) })
    expect(onValueChange).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })
})
