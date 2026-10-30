import { beforeEach, describe, expect, it } from "vitest"
import { clearGenerationRecords, createGenerationRecord } from "./generationStore"

describe("generation store runtime invalidation", () => {
 beforeEach(() => {
  localStorage.clear()
 })

 it("publishes a runtime invalidation event when a generation record is created", () => {
  let received: Event | null = null
  const listener = (event: Event) => { received = event }
  window.addEventListener("vt_generation_records_changed", listener)
  try {
   createGenerationRecord({ toolId: "script-architect", status: "complete" } as any)
   expect(received).not.toBeNull()
   expect((received as CustomEvent).detail).toMatchObject({ operation: "create" })
  } finally {
   window.removeEventListener("vt_generation_records_changed", listener)
  }
 })

 it("publishes a runtime invalidation event when generation history is cleared", () => {
  let received: Event | null = null
  const listener = (event: Event) => { received = event }
  window.addEventListener("vt_generation_records_changed", listener)
  try {
   localStorage.setItem("vt_supertool_generations_v1", JSON.stringify([{ id: "generation-1" }]))
   clearGenerationRecords()
   expect(received).not.toBeNull()
   expect((received as CustomEvent).detail).toMatchObject({ operation: "clear", count: 0 })
  } finally {
   window.removeEventListener("vt_generation_records_changed", listener)
  }
 })
})
