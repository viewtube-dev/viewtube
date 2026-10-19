import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { SubToolboxInput20, SubToolboxTextArea21 } from "./SubToolboxPrimitives"

describe("SubToolbox text primitives 20 and 21", () => {
  it("renders primitive 20 through canonical Studio Controls at standard 44px size", () => {
    const html = renderToStaticMarkup(
      <SubToolboxInput20 level="l1" className="vt-subtoolbox-input has-component-level is-standard custom-field" />,
    )

    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain('data-vt-primitive-id="20"')
    expect(html).toContain('data-size="standard"')
    expect(html).toContain('class="custom-field"')
    expect(html).not.toContain("vt-subtoolbox-input")
    expect(html).not.toContain("has-component-level")
    expect(html).not.toContain("--vt-component-height")
  })

  it("renders primitive 20 through canonical Studio Controls at compact 28px size", () => {
    const html = renderToStaticMarkup(
      <SubToolboxInput20 controlSize="compact" className="vt-subtoolbox-input is-compact" />,
    )

    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain('data-size="compact"')
    expect(html).not.toContain("vt-subtoolbox-input")
    expect(html).not.toContain("is-compact")
  })

  it("renders primitive 21 through canonical Studio Controls at standard 44px size", () => {
    const html = renderToStaticMarkup(
      <SubToolboxTextArea21 level="l1" className="vt-subtoolbox-input vt-subtoolbox-textarea has-component-level is-standard" />,
    )

    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain('data-vt-primitive-id="21"')
    expect(html).toContain('data-size="standard"')
    expect(html).not.toContain("vt-subtoolbox-input")
    expect(html).not.toContain("vt-subtoolbox-textarea")
    expect(html).not.toContain("has-component-level")
    expect(html).not.toContain("--vt-component-height")
  })

  it("renders primitive 21 through canonical Studio Controls at compact 28px size", () => {
    const html = renderToStaticMarkup(
      <SubToolboxTextArea21 height="compact" className="vt-subtoolbox-textarea is-compact" />,
    )

    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain('data-size="compact"')
    expect(html).not.toContain("vt-subtoolbox-textarea")
    expect(html).not.toContain("is-compact")
  })
})
