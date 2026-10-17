import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import test from "node:test"

const root = process.cwd()
const contract = JSON.parse(readFileSync(resolve(root, "src/studio-ui/studio-control-size-tiers.json"), "utf8"))
const generatedCss = readFileSync(resolve(root, "src/styles/studio-control-vars.generated.css"), "utf8")
const controlCss = readFileSync(resolve(root, "src/styles/studio-control-system.css"), "utf8")

test("standard, compact, and micro size tiers retain distinct canonical geometry", () => {
  assert.deepEqual(
    ["standard", "compact", "micro"].map((tier) => ({
      tier,
      height: contract[tier].height,
      stroke: contract[tier].stroke,
      radius: contract[tier].radius,
      fontSize: contract[tier].fontSize,
      iconSize: contract[tier].iconSize,
    })),
    [
      { tier: "standard", height: 44, stroke: 3, radius: 6, fontSize: 38, iconSize: 38 },
      { tier: "compact", height: 28, stroke: 2, radius: 4, fontSize: 24, iconSize: 24 },
      { tier: "micro", height: 14, stroke: 1, radius: 2, fontSize: 10, iconSize: 10 },
    ],
  )
})

test("generated CSS defines every size tier with valid dimensional units", () => {
  for (const [prefix, tier] of [["44", "standard"], ["28", "compact"], ["14", "micro"]]) {
    const tokens = contract[tier]
    assert.ok(generatedCss.includes(`--vt-studio-${prefix}-height: ${tokens.height}px;`))
    assert.ok(generatedCss.includes(`--vt-studio-${prefix}-stroke: ${tokens.stroke}px;`))
    assert.ok(generatedCss.includes(`--vt-studio-${prefix}-radius: ${tokens.radius}px;`))
    assert.ok(generatedCss.includes(`--vt-studio-${prefix}-font-size: ${tokens.fontSize}px;`))
    assert.ok(generatedCss.includes(`--vt-studio-${prefix}-icon-size: ${tokens.iconSize}px;`))
  }
})

test("Studio control system imports the generated token sheet and maps micro to its own tier", () => {
  assert.ok(controlCss.startsWith("/* Studio Hub control ownership boundary."))
  assert.ok(controlCss.includes('@import "./studio-control-vars.generated.css";'))
  assert.ok(controlCss.includes('--vt-studio-badge-height: var(--vt-studio-14-height, 14px)'))
  assert.ok(!controlCss.includes('.vt-studio-split-left-badge:is([data-size="compact"], [data-size="micro"])'))
})

test("generated stylesheet is reproducible from the canonical JSON source", () => {
  execFileSync(process.execPath, ["scripts/emit-studio-control-vars.mjs", "--check"], { cwd: root, stdio: "pipe" })
})
