import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { collectExchangeRecords, renderGeneratedModule } from "./generate-crown-control-room.mjs"

test("collects only JSON records recursively from the supplied Exchange root", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "crown-exchange-"))
  try {
    fs.mkdirSync(path.join(root, "missions"))
    fs.mkdirSync(path.join(root, "receipts"))
    fs.writeFileSync(path.join(root, "missions", "mission.json"), JSON.stringify({ missionId: "VT-MISSION-1" }))
    fs.writeFileSync(path.join(root, "receipts", "receipt.json"), JSON.stringify({ missionId: "VT-MISSION-1" }))
    fs.writeFileSync(path.join(root, "README.md"), "not runtime data")
    const records = collectExchangeRecords(root)
    assert.equal(records.length, 2)
    assert.ok(records.every((item) => item.path.endsWith(".json")))
    assert.deepEqual(records.map((item) => item.record.missionId), ["VT-MISSION-1", "VT-MISSION-1"])
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test("rejects malformed JSON and an Exchange without mission records", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "crown-exchange-invalid-"))
  try {
    fs.mkdirSync(path.join(root, "missions"))
    fs.writeFileSync(path.join(root, "missions", "bad.json"), "{")
    assert.throws(() => collectExchangeRecords(root), /Invalid Crown Exchange JSON/)
    fs.writeFileSync(path.join(root, "missions", "bad.json"), JSON.stringify({ receiptId: "orphan" }))
    assert.throws(() => collectExchangeRecords(root), /no mission records/)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test("emits a deterministic read-only module with the Exchange source boundary", () => {
  const records = [{ path: ".viewtube/exchange/missions/a.json", record: { missionId: "a" } }]
  const output = renderGeneratedModule(records)
  assert.match(output, /CROWN_EXCHANGE_SOURCE = ".viewtube\/exchange\/\*\*"/)
  assert.match(output, /CROWN_EXCHANGE_READ_ONLY = true/)
  assert.match(output, /missionId/)
  assert.equal(output, renderGeneratedModule(records))
})
