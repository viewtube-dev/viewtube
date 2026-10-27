import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const pageSource = readFileSync(new URL("./AIBrainCommandInterface.tsx", import.meta.url), "utf8")
const workspaceStyles = readFileSync(new URL("./AIBrainStudioWorkspace.css", import.meta.url), "utf8")

describe("AI Brain Studio Workspace composition", () => {
  it("marks the canonical Brain page and main workspace regions", () => {
    expect(pageSource).toContain('data-vt-brain-workspace="studio"')
    expect(pageSource).toContain('data-vt-brain-workspace-part="runtime-context"')
    expect(pageSource).toContain('data-vt-brain-workspace-part="conversation"')
    expect(pageSource).toContain('data-vt-brain-workspace-part="navigation"')
    expect(pageSource).toContain('data-vt-brain-workspace-part="right-context"')
  })

  it("keeps the conversation as the bounded scroll owner with a persistent composer", () => {
    expect(workspaceStyles).toContain(".vt-brain-studio-workspace__conversation")
    expect(workspaceStyles).toContain(".vt-brain-studio-workspace__composer")
    expect(workspaceStyles).toContain("minmax(0, 1fr)")
    expect(workspaceStyles).toContain("env(safe-area-inset-bottom)")
  })

  it("switches from a multi-rail desktop workspace to a single-column mobile workspace", () => {
    expect(workspaceStyles).toContain("minmax(0, 1.45fr)")
    expect(workspaceStyles).toContain("@media (min-width: 1280px) and (max-width: 1535px)")
    expect(workspaceStyles).toContain("grid-template-columns: minmax(56px, 64px) minmax(0, 1fr)")
    expect(workspaceStyles).toContain("@media (max-width: 1279px)")
    expect(workspaceStyles).toContain("@media (prefers-reduced-motion: reduce)")
  })

  it("uses the approved Studio palette and avoids decorative motion or shadow treatment", () => {
    expect(workspaceStyles).toContain("var(--vt-studio")
    expect(workspaceStyles).not.toMatch(/box-shadow\s*:/i)
    expect(workspaceStyles).not.toMatch(/transform\s*:/i)
  })
})
