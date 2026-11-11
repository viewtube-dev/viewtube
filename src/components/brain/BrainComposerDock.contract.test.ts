import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const styles = readFileSync(new URL("./BrainComposerDock.css", import.meta.url), "utf8")

describe("Brain composer Studio field contract", () => {
  it("leaves field geometry and interaction skin to canonical Studio primitives", () => {
    expect(styles).toContain(".vt-studio-chat-composer-dock__field-row")
    expect(styles).toContain(".vt-studio-chat-composer-dock__field")
    expect(styles).not.toContain(".vt-brain-composer-input")
    expect(styles).not.toMatch(/(?:^|\\s)(?:border|background|color|box-shadow)\\s*:[^;]+!important/i)
  })

  it("uses the dock as a layout separator rather than a second field shell", () => {
    const dock = styles.slice(
      styles.indexOf('.vt-brain-composer-dock[data-vt-composer-layout="inline-actions"]'),
      styles.indexOf(".vt-brain-composer-dock .vt-brain-composer-attachment"),
    )
    expect(dock).toContain("border: 0")
    expect(dock).toContain("border-top: 2px solid #000")
    expect(dock).toContain("border-radius: 0")
    expect(dock).toContain("overflow: visible")
  })

  it("keeps the field row responsive and the action rail vertically stacked", () => {
    expect(styles).toContain("grid-template-columns: minmax(0, 4.4fr) minmax(0, 1fr)")
    expect(styles).toContain("grid-template-rows: repeat(3, minmax(0, 1fr))")
    expect(styles).toContain("gap: 4px")
    expect(styles).not.toMatch(/transform\\s*:/i)
  })
})
