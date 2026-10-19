import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const workflow = readFileSync(".github/workflows/release-gates.yml", "utf8")

test("production build installs lockfile dependencies before invoking Vite", () => {
  const start = workflow.indexOf("  production_build:\n")
  const end = workflow.indexOf("\n  local_smoke:", start)
  assert.ok(start >= 0 && end > start, "production_build job must exist")
  const job = workflow.slice(start, end)
  assert.match(job, /- run: npm ci[\s\S]*?- run: npm run build/)
})
