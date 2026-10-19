import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const source = fs.readFileSync(path.resolve(process.cwd(), "src/views/CreatorVaultOS.tsx"), "utf8")

describe("CreatorVaultOS task history", () => {
 it("lets users expand beyond the compact five-item completed-task preview", () => {
  expect(source).toContain("showVaultTaskHistory")
  expect(source).toContain("View Task History")
  expect(source).toContain("Hide Task History")
  expect(source).toContain("data-vault-task-history")
  expect(source).toContain("tasks.filter((task) => task.status === \"completed\")")
 })
})
