import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")

describe("canonical split-left export contract", () => {
  it("does not import removed legacy split-left exports", () => {
    const compound = source("src/components/subtoolbox/SubToolboxCompoundPrimitives.tsx")
    const certification = source("src/studio-ui/StudioHubCertification.tsx")
    const splitPrimitives = source("src/components/subtoolbox/SubToolboxSplitPrimitives.tsx")

    expect(compound).toContain('from "../../studio-ui/primitives/StudioControls"')
    expect(compound).toContain("StudioSplitLeftButton")
    expect(compound).not.toContain('from "./SubToolboxSplitPrimitives"')
    expect(certification).toContain("StudioSplitLeftButton")
    expect(certification).not.toContain("import { SplitLeftButton } from")
    expect(splitPrimitives).toContain("export const SubToolboxSplitButton = CanonicalSplitLeftAdapter")
    expect(splitPrimitives).toContain("export const SplitLeftButton = CanonicalSplitLeftAdapter")
    expect(splitPrimitives).toContain("StudioSplitLeftButton")
    expect(splitPrimitives).toContain("export interface SubToolboxShellActionProps")
    expect(splitPrimitives.match(/export const SplitLeftButton\b/g)).toHaveLength(1)
    expect(splitPrimitives.match(/export const SubToolboxSplitButton\b/g)).toHaveLength(1)
  })
})
