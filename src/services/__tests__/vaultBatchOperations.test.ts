// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { createLocalVaultAsset, listVaultAssets, updateVaultAsset } from "../vaultAdapter"

describe("Vault batch mutation foundation", () => {
 beforeEach(() => localStorage.clear())

 it("updates one canonical asset without replacing its identity", () => {
  const created = createLocalVaultAsset({ name: "Map", kind: "image", tags: ["research"] })
  const updated = updateVaultAsset(created.id, {
   tags: ["research", "approved"],
  })

  expect(updated?.id).toBe(created.id)
  expect(updated?.createdAt).toBe(created.createdAt)
  expect(updated?.tags).toEqual(["research", "approved"])
  expect(listVaultAssets()).toHaveLength(1)
 })

 it("returns null when the asset does not exist", () => {
  expect(updateVaultAsset("missing", { tags: ["x"] })).toBeNull()
 })
})

import { vi } from "vitest"
import { planVaultBatchOperation, runVaultBatchOperation } from "../vaultBatchOperations"
import type { VaultMediaOperationAsset } from "../vaultMediaOperations"

const mediaAsset = (overrides: Partial<VaultMediaOperationAsset> = {}): VaultMediaOperationAsset => ({
 id: "image-1", kind: "image", byteSize: 128, protected: false, ...overrides,
})

describe("Vault batch operation contract", () => {
 it("preflights each item and skips incompatible assets without blocking eligible items", () => {
  const plan = planVaultBatchOperation({ operation: "image-transform", assets: [mediaAsset(), mediaAsset({ id: "video-1", kind: "video" })] })
  expect(plan.allowed).toBe(true)
  expect(plan.items.map(item => item.status)).toEqual(["queued", "skipped"])
  expect(plan.items[1].reason).toContain("image")
 })

 it("rejects empty, duplicate-ID and oversized batches before execution", () => {
  expect(planVaultBatchOperation({ operation: "image-transform", assets: [] }).allowed).toBe(false)
  expect(planVaultBatchOperation({ operation: "image-transform", assets: [mediaAsset(), mediaAsset()] }).reason).toContain("duplicate")
  const many = Array.from({ length: 51 }, (_, index) => mediaAsset({ id: String(index) }))
  expect(planVaultBatchOperation({ operation: "image-transform", assets: many }).reason).toContain("50")
 })

 it("continues after a failure and reports partial success per item", async () => {
  const plan = planVaultBatchOperation({ operation: "image-transform", assets: [mediaAsset(), mediaAsset({ id: "image-2" }), mediaAsset({ id: "video-1", kind: "video" })] })
  const execute = vi.fn(async (item: VaultMediaOperationAsset) => {
   if (item.id === "image-2") throw new Error("processor unavailable")
   return { outputAssetId: `derivative-${item.id}`, receipt: "source preserved" }
  })
  const result = await runVaultBatchOperation({ plan, execute })
  expect(result.status).toBe("partial")
  expect(result.succeeded).toBe(1)
  expect(result.failed).toBe(1)
  expect(result.skipped).toBe(1)
  expect(result.results.map(item => item.status)).toEqual(["succeeded", "failed", "skipped"])
  expect(result.results[1].error).toBe("processor unavailable")
  expect(execute).toHaveBeenCalledTimes(2)
 })

 it("cancels remaining items without starting them after abort", async () => {
  const plan = planVaultBatchOperation({ operation: "image-transform", assets: [mediaAsset(), mediaAsset({ id: "image-2" }), mediaAsset({ id: "image-3" })] })
  const controller = new AbortController()
  const execute = vi.fn(async (item: VaultMediaOperationAsset) => {
   controller.abort()
   return { outputAssetId: `derivative-${item.id}` }
  })
  const result = await runVaultBatchOperation({ plan, execute, signal: controller.signal })
  expect(result.status).toBe("cancelled")
  expect(result.succeeded).toBe(1)
  expect(result.cancelled).toBe(2)
  expect(execute).toHaveBeenCalledTimes(1)
 })
})
