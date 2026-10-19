// @vitest-environment jsdom
import React, { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { StudioCounter } from "./StudioControls"

let container: HTMLDivElement
let root: Root
const onValueChange = vi.fn<(next: number) => void>()

const CounterHarness: React.FC<{ initialValue?: number; min?: number; max?: number; step?: number }> = ({
  initialValue = 0, min = 0, max = 5, step = 1,
}) => {
  const [value, setValue] = React.useState(initialValue)
  return <StudioCounter value={value} onValueChange={next => { onValueChange(next); setValue(next) }} min={min} max={max} step={step} ariaLabel="Test value" />
}

const renderCounter = (props: React.ComponentProps<typeof CounterHarness> = {}) => {
  act(() => { root.render(<CounterHarness {...props} />) })
}
const button = (label: string) => {
  const node = container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)
  if (!node) throw new Error(`Missing counter button: ${label}`)
  return node
}
const dispatch = (node: HTMLButtonElement, type: string) => {
  act(() => { node.dispatchEvent(new Event(type, { bubbles: true, cancelable: true })) })
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date("2026-10-19T12:00:00.000Z"))
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  onValueChange.mockClear()
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe("Studio counter hold-repeat interaction", () => {
  it("preserves immediate click behavior and fractional step handling", () => {
    renderCounter({ initialValue: 2, max: 3, step: 0.5 })
    const increase = button("Increase Test value")
    dispatch(increase, "pointerdown")
    dispatch(increase, "pointerup")
    act(() => { increase.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 })) })
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenLastCalledWith(2.5)
    expect(vi.getTimerCount()).toBe(0)
  })

  it("repeats on hold, honors latest values, and clamps at the maximum", () => {
    renderCounter({ max: 3 })
    const increase = button("Increase Test value")
    dispatch(increase, "pointerdown")
    act(() => { vi.advanceTimersByTime(380) })
    expect(onValueChange).toHaveBeenLastCalledWith(1)
    act(() => { vi.advanceTimersByTime(1500) })
    expect(onValueChange.mock.calls.map(([next]) => next)).toEqual([1, 2, 3])
    expect(vi.getTimerCount()).toBe(0)
    dispatch(increase, "pointerup")
    act(() => { increase.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 })) })
    expect(onValueChange).toHaveBeenCalledTimes(3)
  })

  it("uses the latest bound after a hold starts instead of the captured bound", () => {
    renderCounter({ max: 5 })
    const increase = button("Increase Test value")
    dispatch(increase, "pointerdown")
    act(() => { vi.advanceTimersByTime(380) })
    expect(onValueChange).toHaveBeenLastCalledWith(1)
    renderCounter({ max: 1 })
    act(() => { vi.advanceTimersByTime(1000) })
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it("cancels pending holds on release, pointer cancel, lost capture, and blur", () => {
    for (const eventName of ["pointerup", "pointercancel", "lostpointercapture", "blur"]) {
      renderCounter()
      const increase = button("Increase Test value")
      dispatch(increase, "pointerdown")
      dispatch(increase, eventName)
      act(() => { vi.advanceTimersByTime(1500) })
      expect(onValueChange).not.toHaveBeenCalled()
      expect(vi.getTimerCount()).toBe(0)
    }
  })

  it("cleans up a pending hold when the component unmounts", () => {
    renderCounter()
    const increase = button("Increase Test value")
    dispatch(increase, "pointerdown")
    act(() => { root.unmount() })
    act(() => { vi.advanceTimersByTime(1500) })
    expect(onValueChange).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
    root = createRoot(container)
  })
})
