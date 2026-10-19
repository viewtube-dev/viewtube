import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { StudioSplitTextInput } from "./StudioSplitTextInput"

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
  it("forwards disabled and required to the native field", () => {
    const html = renderToStaticMarkup(<StudioSplitTextInput disabled required aria-label="Required title" />)
    expect(html).toMatch(/<input[^>]*disabled/)
    expect(html).toMatch(/<input[^>]*required/)
  })
})
