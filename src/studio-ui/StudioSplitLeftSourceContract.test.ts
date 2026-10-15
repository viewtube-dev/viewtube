import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const source = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8")

describe("Studio split-left source contract", () => {
  it("does not add a second text stroke or shadow filter to split-left labels", () => {
    const styles = source("src/styles/studio-control-system.css")
    const labelRule = styles.match(/button\[data-vt-studio-button="true"\]\[data-split-left="true"\] > \[data-vt-studio-split-label\]\s*\{([^}]*)\}/s)?.[1] ?? ""
    const buttonRule = styles.match(/button\[data-vt-studio-button="true"\]\[data-split-left="true"\]\s*\{([^}]*)\}/s)?.[1] ?? ""
    expect(labelRule).not.toContain("-webkit-text-stroke: .5px")
    expect(labelRule).not.toContain("text-shadow:")
    expect(buttonRule).not.toContain("filter: drop-shadow")
    expect(styles).toContain('button[data-vt-studio-button="true"][data-split-left="true"]')
  })

  it("routes project load, swap and refresh through StudioSplitLeftButton", () => {
    const projects = source("src/components/projects/ProjectManifestation.tsx")
    expect(projects).toContain('import { StudioSplitLeftButton } from "../../studio-ui"')
    expect(projects).not.toContain("<SplitLeftButton")
    for (const label of ["LOAD", "SWAP IN", "REFRESH", "LOAD INTO TOOL"]) expect(projects).toContain(label)
  })

  it("routes named Studio Hub actions through the canonical split-left source", () => {
    const script = source("src/views/ScriptArchitect.tsx")
    const director = source("src/views/VideoDirector.tsx")
    const comments = source("src/components/CommentResponder.tsx")
    const community = source("src/components/CommunityPostGenerator.tsx")
    const recipe = source("src/studio-ui/recipes/index.tsx")
    expect(script).toContain("StudioSplitLeftButton")
    expect(director).not.toContain("<SplitLeftButton")
    expect(director).toContain("StudioSplitLeftButton")
    expect(comments).toContain("StudioSplitLeftButton")
    expect(community).toContain("StudioSplitLeftButton")
    expect(recipe).toContain("StudioSplitLeftButton")
  })
})
