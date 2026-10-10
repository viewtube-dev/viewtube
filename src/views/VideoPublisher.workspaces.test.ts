import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8")

describe("Video Publisher workspaces", () => {
  it("defaults to Write and exposes Write/Create header toggles", () => {
    const source = read("src/views/VideoPublisher.tsx")
    expect(source).toContain('useState<"write" | "create">("write")')
    expect(source).toContain('{ value: "write", label: "Write" }')
    expect(source).toContain('{ value: "create", label: "Create / Generate" }')
  })

  it("keeps publishing in Write and generation in Create", () => {
    const source = read("src/views/VideoPublisher.tsx")
    expect(source).toContain('{workspaceMode === "write" ? (')
    expect(source).toContain('{workspaceMode === "create" ? (')
    expect(source).toContain('title="Publishing Control"')
    expect(source).toContain('label={loading ? "Generating..." : "Generate All Assets"}')
  })

  it("does not automatically copy generated results into Write inputs", () => {
    const source = read("src/views/VideoPublisher.tsx")
    expect(source).not.toContain('setPublishTitle(result.titleSets[0]?.title || publishTitle)')
    expect(source).not.toContain('setPublishDescription(result.description || "")')
    expect(source).not.toContain('setPublishTags(result.tags || "")')
  })
})
