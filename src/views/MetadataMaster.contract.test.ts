import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")

describe("Metadata Master Studio Hub contract", () => {
  it("mounts the canonical toolbox and uses SubToolbox primitives", () => {
    const source = read("src/views/MetadataMaster.tsx")
    expect(source).toContain('title="METADATA MASTER"')
    expect(source).toContain('title="03 PUBLICATION PACKAGE CANVAS"')
    expect(source).toContain("SubToolboxGrid")
    expect(source).toContain("SubToolboxOutputCard")
    expect(source).toContain("createViewTubeActionPacket")
    expect(source).not.toContain("vt-subtoolbox-stroke")
  })

  it("registers the tool in Studio Hub and universal handoffs", () => {
    expect(read("src/views/StudioHub.tsx")).toContain('<MetadataMaster collapsible isOpenInitial={false} paletteIndex={12} />')
    const chains = read("src/services/viewTubeToolChains.ts")
    expect(chains).toContain('id:"metadata-master"')
    expect(chains).toContain('id:"metadata-to-publish"')
  })

  it("keeps publication ownership separated", () => {
    const publisher = read("src/views/VideoPublisher.tsx")
    const manager = read("src/views/VideoManager.tsx")
    expect(publisher).toContain('targetToolId="video-publisher"')
    expect(manager).toContain('targetToolId="video-manager"')
    expect(manager).toContain('packet.sourceToolId !== "metadata-master"')
  })
})
