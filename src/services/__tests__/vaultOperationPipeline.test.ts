import { describe, expect, it } from "vitest"
import { createVaultOperationPlan, executeVaultOperationPlan, type VaultOperationHandler } from "../vaultOperationPipeline"

describe("Vault operation pipeline", () => {
  it("previews a batch before execution and records per-item outcomes", async () => {
    const plan = createVaultOperationPlan({ operation: "tag", assetIds: ["a", "b"], parameters: { tag: "review" }, now: 10 })
    expect(plan.preview).toHaveLength(2)
    let calls = 0
    const handler: VaultOperationHandler = async ({ assetId }) => {
      calls += 1
      return assetId === "a" ? { ok: true, detail: "tagged" } : { ok: false, detail: "not found" }
    }
    const receipt = await executeVaultOperationPlan(plan, handler, { confirmed: false })
    expect(calls).toBe(0)
    expect(receipt.status).toBe("cancelled")
    const executed = await executeVaultOperationPlan(plan, handler, { confirmed: true })
    expect(calls).toBe(2)
    expect(executed.status).toBe("partial")
    expect(executed.items.filter((item) => item.status === "completed")).toHaveLength(1)
    expect(executed.items.filter((item) => item.status === "failed")).toHaveLength(1)
  })
  it("rejects empty or duplicate IDs to avoid ambiguous work", () => {
    expect(() => createVaultOperationPlan({ operation: "archive", assetIds: [], now: 1 })).toThrow()
    expect(() => createVaultOperationPlan({ operation: "archive", assetIds: ["a", "a"], now: 1 })).toThrow()
  })
})
