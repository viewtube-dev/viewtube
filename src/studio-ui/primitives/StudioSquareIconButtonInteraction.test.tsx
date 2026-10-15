// @vitest-environment jsdom

import React, { act } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { StudioSquareIconButton } from "./StudioControls"

describe("StudioSquareIconButton interactions", () => {
  let host: HTMLDivElement
  let root: Root

  beforeEach(() => {
    ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
    host = document.createElement("div")
    document.body.appendChild(host)
    root = createRoot(host)
  })

  afterEach(() => {
    act(() => root.unmount())
    host.remove()
  })

  it("does not pop on mount, then replays opt-in pop feedback on activation", async () => {
    await act(async () => {
      root.render(<StudioSquareIconButton label="Refresh" icon={<span>↻</span>} animate />)
    })

    const button = host.querySelector("button")
    expect(button).not.toBeNull()
    expect(button?.hasAttribute("data-pop")).toBe(false)

    await act(async () => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    expect(button?.getAttribute("data-pop")).toBe("true")
  })

  it("keeps notification feedback quiet on mount and replays it after count changes", async () => {
    await act(async () => {
      root.render(
        <StudioSquareIconButton
          label="Pending notifications"
          icon={<span>●</span>}
          effect="notification"
          badge={2}
        />,
      )
    })

    const button = host.querySelector("button")
    expect(button?.getAttribute("data-has-badge")).toBe("true")
    expect(button?.hasAttribute("data-notification-pulse")).toBe(false)

    await act(async () => {
      root.render(
        <StudioSquareIconButton
          label="Pending notifications"
          icon={<span>●</span>}
          effect="notification"
          badge={3}
        />,
      )
    })

    expect(button?.getAttribute("data-notification-pulse")).toBe("true")
    expect(host.querySelector("[data-vt-square-badge]")?.textContent).toBe("3")

    await act(async () => {
      root.render(
        <StudioSquareIconButton
          label="Pending notifications"
          icon={<span>●</span>}
          effect="notification"
        />,
      )
    })

    expect(button?.hasAttribute("data-notification-pulse")).toBe(false)
    expect(host.querySelector("[data-vt-square-badge]")).toBeNull()
  })

  it("toggles the V3 selectable skin and emits the next selection state", async () => {
    const onSelectedChange = vi.fn()
    await act(async () => {
      root.render(
        <StudioSquareIconButton
          label="Select mode"
          icon={<span>✓</span>}
          variant="v3"
          onSelectedChange={onSelectedChange}
        />,
      )
    })

    const button = host.querySelector("button")
    expect(button?.getAttribute("aria-pressed")).toBe("false")

    await act(async () => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    expect(button?.getAttribute("aria-pressed")).toBe("true")
    expect(button?.getAttribute("data-selected")).toBe("true")
    expect(onSelectedChange).toHaveBeenCalledWith(true)
  })

  it("does not change selection when the activation event is cancelled", async () => {
    await act(async () => {
      root.render(
        <StudioSquareIconButton
          label="Cancelled mode"
          icon={<span>✓</span>}
          variant="v3"
          onClick={(event) => event.preventDefault()}
        />,
      )
    })

    const button = host.querySelector("button")
    await act(async () => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }))
    })

    expect(button?.getAttribute("aria-pressed")).toBe("false")
  })
})
