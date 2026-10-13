import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const source = fs.readFileSync(path.resolve(process.cwd(), "src/views/CreatorVaultOS.tsx"), "utf8")

describe("CreatorVaultOS selection toolbar and Inspector layout", () => {
 it("keeps selection actions in the Asset Library flow instead of a fixed bottom overlay", () => {
  expect(source).not.toMatch(/aria-label="Vault selection actions"[\s\S]{0,240}className="fixed inset-x-2 bottom-2/)
  expect(source).toMatch(/title="Asset Library"[\s\S]{0,1600}aria-label="Vault selection actions"/)
  expect(source).toContain('{selectedAssetIds.length} Selected')
  expect(source).toContain('label="Send to ViewTube"')
 })

 it("keeps the Inspector toolbox available when nothing is selected", () => {
  expect(source).toContain('title="Inspector"')
  expect(source).toContain('message="Select an asset to inspect its metadata and provenance."')
  expect(source).toContain('ref={inspectorRef}')
  expect(source).toMatch(/persistenceId="vault-inspector"[\s\S]{0,300}\{selectedAsset \? \(\s*<div className="flex flex-col gap-3">/)
  expect(source).toContain('xl:grid-cols-[minmax(220px,0.72fr)_minmax(0,2.1fr)_minmax(260px,0.9fr)]')
 })

 it("preserves the contextual action set and keeps Compare gated to exactly two assets", () => {
  expect(source).toContain('label="Tag"')
  expect(source).toContain('label="Batch"')
  expect(source).toContain('label="Group"')
  expect(source).toContain('label="Compare"')
  expect(source).toContain('disabled={selectedAssetIds.length !== 2}')
  expect(source).toMatch(/label="Metadata"[^\n]*onClick={openSelectedInspector}/)
  expect(source).toContain('label="Export"')
  expect(source).toContain('label="Clear"')
 })
})
