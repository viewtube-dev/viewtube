// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { createVaultOperation, listVaultOperations, transitionVaultOperation } from "../vaultOperationLedger"

describe("Vault operation ledger", () => {
  beforeEach(() => localStorage.clear())

  it("records a completed derivative operation with input/output lineage and parameters", () => {
    const operation = createVaultOperation({ type: "image-transform", label: "Resize image", inputAssetIds: ["source-1"], parameters: { width: 640 } })
    expect(transitionVaultOperation(operation.id, "queued")).not.toBeNull()
    expect(transitionVaultOperation(operation.id, "processing")).not.toBeNull()
    const completed = transitionVaultOperation(operation.id, "completed", { outputAssetIds: ["derived-1"], receipt: "Derivative registered" })
    expect(completed?.outputAssetIds).toEqual(["derived-1"])
    expect(completed?.inputAssetIds).toEqual(["source-1"])
    expect(listVaultOperations()).toHaveLength(1)
  })

  it("rejects invalid state transitions and preserves terminal receipts", () => {
    const operation = createVaultOperation({ type: "video-trim", label: "Trim", inputAssetIds: ["source-1"] })
    expect(transitionVaultOperation(operation.id, "completed")).toBeNull()
    transitionVaultOperation(operation.id, "queued")
    transitionVaultOperation(operation.id, "processing")
    transitionVaultOperation(operation.id, "failed", { error: "processor unavailable" })
    expect(transitionVaultOperation(operation.id, "completed")).toBeNull()
    expect(transitionVaultOperation(operation.id, "queued")).not.toBeNull()
  })
})
