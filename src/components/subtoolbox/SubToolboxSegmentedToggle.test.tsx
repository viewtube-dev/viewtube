import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { SubToolboxSegmentedToggle } from "./SubToolboxPrimitives"

describe("shared segmented-toggle adapter", () => {
  it("uses the canonical Studio Word Toggle for binary text options and preserves values", () => {
    const html = renderToStaticMarkup(
      <SubToolboxSegmentedToggle
        level="l1"
        ariaLabel="Vault source"
        options={[{ value: "tags", label: "TAGS" }, { value: "import", label: "IMPORT" }]}
        value="import"
        onValueChange={() => undefined}
      />,
    )
    expect(html).toContain("vt-studio-44-word-toggle")
    expect(html).toContain('aria-label="Vault source"')
    expect(html).toContain('data-vt-word-toggle-size="28"')
    expect(html).toContain(">TAGS</button>")
    expect(html).toContain(">IMPORT</button>")
    expect(html).toContain('aria-pressed="true"')
    expect(html).not.toContain("vt-subtoolbox-segmented")
  })

  it("retains the segmented primitive for multi-option choices that the binary Studio toggle cannot represent", () => {
    const html = renderToStaticMarkup(
      <SubToolboxSegmentedToggle
        ariaLabel="Vault media type"
        options={[
          { value: "all", label: "ALL" },
          { value: "video", label: "VIDEO" },
          { value: "image", label: "IMAGE" },
        ]}
        value="video"
        onValueChange={() => undefined}
      />,
    )
    expect(html).toContain("vt-subtoolbox-segmented")
    expect(html).toContain('aria-label="Vault media type"')
    expect(html).toContain('aria-pressed="true"')
    expect(html).not.toContain("vt-studio-44-word-toggle")
  })

  it("keeps legacy segmented CSS available only for multi-option and non-text cases", () => {
    const source = readFileSync(resolve(process.cwd(), "src/components/subtoolbox/SubToolboxPrimitives.tsx"), "utf8")
    const css = readFileSync(resolve(process.cwd(), "src/styles/subtoolbox-system.css"), "utf8")
    expect(source).toContain('import { StudioWordToggle } from "../../studio-ui/primitives/StudioControls"')
    expect(source).toContain("options.length === 2")
    expect(css).toContain(".vt-subtoolbox-segmented")
  })
})
