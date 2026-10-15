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

  it("does not invoke actions or animation when disabled", async () => {
    const onClick = vi.fn()
    const onSelectedChange = vi.fn()
    await act(async () => {
      root.render(
        <StudioSquareIconButton
          label="Disabled mode"
          icon={<span>↻</span>}
          variant="v3"
          animate
          disabled
          onClick={onClick}
          onSelectedChange={onSelectedChange}
        />,
      )
    })

    const button = host.querySelector("button")
    await act(async () => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }))
    })

    expect(onClick).not.toHaveBeenCalled()
    expect(onSelectedChange).not.toHaveBeenCalled()
    expect(button?.getAttribute("aria-pressed")).toBe("false")
    expect(button?.hasAttribute("data-pop")).toBe(false)
  })

  it("connects contextual tooltip text to the control for assistive technology", async () => {
    await act(async () => {
      root.render(
        <StudioSquareIconButton
          label="Edit item"
          icon={<span>✎</span>}
          effect="tooltip"
          tooltip="Edit this item"
        />,
      )
    })

    const button = host.querySelector("button")
    const tooltip = host.querySelector('[role="tooltip"]')
    expect(button?.getAttribute("aria-label")).toBe("Edit item")
    expect(button?.getAttribute("aria-describedby")).toBe(tooltip?.getAttribute("id"))
    expect(tooltip?.textContent).toBe("Edit this item")
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
  it("replays temporary heart activation without retaining selected state", async () => {
    await act(async () => {
      root.render(<StudioSquareIconButton label="Favorite" icon={<svg viewBox="0 0 24 24"><path d="M12 21 3 12a5 5 0 0 1 7-7l2 2 2-2a5 5 0 0 1 7 7z" /></svg>} effect="pop-on-activation" />)
    })
    const button = host.querySelector("button")
    expect(button?.getAttribute("aria-pressed")).toBeNull()
    await act(async () => { button?.dispatchEvent(new MouseEvent("click", { bubbles: true })) })
    expect(button?.getAttribute("data-pop")).toBe("true")
    expect(button?.getAttribute("aria-pressed")).toBeNull()
    expect(button?.getAttribute("data-icon-effect")).toBe("pop-on-activation")
  })

  it("increments the like counter on every activation", async () => {
    await act(async () => {
      root.render(<StudioSquareIconButton label="Like" icon={<span>👍</span>} effect="like" />)
    })
    const button = host.querySelector("button")
    expect(host.querySelector("[data-vt-square-badge]")?.textContent).toBe("0")
    await act(async () => { button?.dispatchEvent(new MouseEvent("click", { bubbles: true })) })
    expect(host.querySelector("[data-vt-square-badge]")?.textContent).toBe("1")
    await act(async () => { button?.dispatchEvent(new MouseEvent("click", { bubbles: true })) })
    expect(host.querySelector("[data-vt-square-badge]")?.textContent).toBe("2")
  })

  it("uses the alternate face for unlock and download completion states", async () => {
    await act(async () => {
      root.render(<>
        <StudioSquareIconButton label="Unlock" icon={<span>🔒</span>} activeIcon={<span>🔓</span>} effect="unlock" />
        <StudioSquareIconButton label="Download" icon={<span>↓</span>} activeIcon={<span>✓</span>} effect="download" />
      </>)
    })
    expect(host.querySelectorAll("[data-vt-square-morph-inner]")).toHaveLength(2)
    const buttons = host.querySelectorAll("button")
    await act(async () => { buttons[0]?.dispatchEvent(new MouseEvent("click", { bubbles: true })) })
    await act(async () => { buttons[1]?.dispatchEvent(new MouseEvent("click", { bubbles: true })) })
    expect(buttons[0]?.getAttribute("aria-pressed")).toBe("true")
    expect(buttons[1]?.getAttribute("aria-pressed")).toBe("true")
  })

})
