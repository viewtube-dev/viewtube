import test from "node:test"
import assert from "node:assert/strict"
import { getProductionStackConfig } from "./production-stack.mjs"

test("production stack uses Render's public port and an isolated internal API port", () => {
  const config = getProductionStackConfig({
    PORT: "10000",
    BILLING_PORT: "3000",
    RENDER_EXTERNAL_URL: "https://publisher-3n7h.onrender.com",
  })

  assert.equal(config.publicPort, 10000)
  assert.equal(config.apiPort, 3000)
  assert.equal(config.host, "0.0.0.0")
  assert.equal(config.billingOrigin, "https://publisher-3n7h.onrender.com")
})

test("production stack rejects invalid or conflicting ports", () => {
  assert.throws(() => getProductionStackConfig({ PORT: "not-a-port" }), /PORT/)
  assert.throws(() => getProductionStackConfig({ PORT: "3000", BILLING_PORT: "3000" }), /must differ/)
})

test("production stack uses a local origin only when no public URL is supplied", () => {
  const config = getProductionStackConfig({ PORT: "10000", BILLING_PORT: "3000" })
  assert.equal(config.billingOrigin, "http://localhost:10000")
})
