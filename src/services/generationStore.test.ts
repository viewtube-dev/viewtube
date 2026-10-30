import { beforeEach, describe, expect, it } from "vitest"
import { createGenerationRecord } from "./generationStore"

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
})
