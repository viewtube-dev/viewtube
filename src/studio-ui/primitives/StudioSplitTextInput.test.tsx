// @vitest-environment jsdom
import React, { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { StudioSplitTextInput } from "./StudioSplitTextInput"

const cleanups: Array<() => void> = []
function mount(element: React.ReactElement) {
  const container = document.createElement("div")
  document.body.appendChild(container)
  const root: Root = createRoot(container)
  act(() => root.render(element))
  const cleanup = () => {
    act(() => root.unmount())
    container.remove()
  }
  cleanups.push(cleanup)
  return { container, cleanup }
}
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup())
})

describe("StudioSplitTextInput", () => {
  for (const split of ["left", "right", "double"] as const) {
    it(`composes ${split} badge rails with one real editable input`, () => {
      const html = renderToStaticMarkup(<StudioSplitTextInput split={split} sizeVariant="standard" leftIcon={<span>L</span>} rightIcon={<span>R</span>} aria-label="Title" name="title" defaultValue="Example" />)
      expect((html.match(/<input\b/g) ?? []).length).toBe(1)
      expect((html.match(/data-vt-studio-split-rail=/g) ?? []).length).toBe(split === "double" ? 2 : 1)
      expect(html).toContain('name="title"')
      expect(html).toContain('aria-label="Title"')
      expect(html).toContain('value="Example"')
      expect(html).toContain('data-size="standard"')
    })
  }
  for (const split of ["left", "right", "double"] as const) {
    for (const sizeVariant of ["standard", "compact"] as const) {
      it(`keeps the ${split} ${sizeVariant} input focusable and editable`, () => {
        let changedValue = ""
        const onChange = vi.fn((event: React.ChangeEvent<HTMLInputElement>) => {
          changedValue = event.target.value
        })
        const { container } = mount(
          <StudioSplitTextInput
            split={split}
            sizeVariant={sizeVariant}
            defaultValue="Initial"
            onChange={onChange}
            aria-label="Editable split field"
          />,
        )
        expect(container.querySelector('[data-vt-studio-split-input="true"] [data-vt-studio-split-label]')).not.toBeNull()
        const input = container.querySelector("input") as HTMLInputElement | null
        expect(input).not.toBeNull()
        if (!input) return
        act(() => input.focus())
        expect(document.activeElement).toBe(input)
        const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set
        act(() => {
          nativeSetter?.call(input, "Typed")
          input.dispatchEvent(new Event("input", { bubbles: true }))
        })
        expect(onChange).toHaveBeenCalled()
        expect(changedValue).toBe("Typed")
      })
    }
  }

  it("forwards disabled and required to the native field", () => {
    const html = renderToStaticMarkup(<StudioSplitTextInput disabled required aria-label="Required title" />)
    expect(html).toMatch(/<input[^>]*disabled/)
    expect(html).toMatch(/<input[^>]*required/)
  })
})
