import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { resolveVaultMediaCapabilities } from "./capabilities"
import { VaultAdaptiveWorkbenchHost } from "./VaultAdaptiveWorkbenchHost"

describe("VaultAdaptiveWorkbenchHost", () => {
  it("renders a shared mode host with selection context and contextual actions", () => {
    const html = renderToStaticMarkup(
      <VaultAdaptiveWorkbenchHost capabilities={resolveVaultMediaCapabilities({ kinds: ["image"] })} selectionCount={1} />,
    )
    expect(html).toContain('aria-label="Adaptive Vault Workbench"')
    expect(html).toContain("1 selected")
    expect(html).toContain('role="tablist"')
    expect(html).toContain("Lineage")
    expect(html).toContain("Inspect")
  })

  it("exposes all seven adaptive modes through the canonical registry", () => {
    const html = renderToStaticMarkup(
      <VaultAdaptiveWorkbenchHost capabilities={resolveVaultMediaCapabilities({ kinds: ["image"] })} selectionCount={1} />,
    )
    for (const mode of ["Browse", "Inspect", "Compare", "Edit", "Process", "Organize", "Workflow"]) {
      expect(html).toContain(mode)
    }
  })

  it("renders processing as unavailable until a processor is explicitly connected", () => {
    const html = renderToStaticMarkup(
      <VaultAdaptiveWorkbenchHost capabilities={resolveVaultMediaCapabilities({ kinds: ["video"] })} selectionCount={1} />,
    )
    expect(html).toContain('data-capability="video-process"')
    expect(html).toContain('data-available="false"')
    expect(html).toContain("verified durable video processor")
  })
})
