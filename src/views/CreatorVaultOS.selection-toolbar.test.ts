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
  expect(source).toContain('data-vault-workbench-module="inspector"')
  expect(source).not.toContain('data-vault-mobile-sheet="inspector"')
  expect(source).not.toContain('label="Close Inspector"')
  expect(source).toContain('ref={inspectorRef}')
  expect(source).toMatch(/persistenceId="vault-inspector"[\s\S]{0,300}\{selectedAsset \? \(\s*<div className="flex flex-col gap-3">/)
  expect(source).toContain('xl:grid-cols-[minmax(220px,0.72fr)_minmax(0,2.1fr)_minmax(260px,0.9fr)]')
 })

 it("keeps Task Center compact while idle and exposes a live job summary", () => {
  expect(source).toContain('title="Task Center"')
  expect(source).toContain("subtitle={activeVaultTasks.length ?")
  expect(source).toContain("isOpenInitial={Boolean(activeVaultTasks.length || failedVaultTasks.length)}")
  expect(source).toContain("No active jobs")
  expect(source).toContain("failed · open to review")
 })

 it("provides a Vault Asset Health center with actionable issue groups", () => {
  expect(source).toContain('title="Asset Health"')
  expect(source).toContain('data-vault-health-center')
  expect(source).toContain('data-vault-health-group={group.id}')
  expect(source).toContain('id: "unassigned"')
  expect(source).toContain('id: "untagged"')
  expect(source).toContain('id: "flagged"')
  expect(source).toContain('id: "missing-preview"')
  expect(source).toContain('persistenceId="vault-asset-health"')
 })

 it("keeps recent completed jobs visible in Task Center history", () => {
  expect(source).toContain('const completedVaultTasks = tasks.filter((task) => task.status === "completed").slice(0, 5)')
  expect(source).toContain('[...failedVaultTasks, ...activeVaultTasks, ...completedVaultTasks].slice(0, 12)')
  expect(source).toContain('data-vault-task-status={task.status}')
  expect(source).toContain('label="Clear Completed"')
 })

 it("renders Compare & Versions as its own configurable SubToolbox module", () => {
  expect(source).toContain('title="Compare & Versions"')
  expect(source).toContain('persistenceId="vault-compare-versions"')
  expect(source).toContain('moduleStyle("compare-versions" as VaultWorkspaceModuleId)')
  expect(source).toContain('data-vault-compare-versions')
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
  expect(source).toContain('aria-label="Quick add selected assets to collection"')
  expect(source).toContain('onClick={addSelectionToCollection}')
  expect(source).toContain('compareVersionsRef.current?.scrollIntoView')
 })
 
 it("exposes task progress as an accessible progress bar in Task Center", () => {
  expect(source).toContain('role="progressbar"')
  expect(source).toContain('aria-valuemin={0}')
  expect(source).toContain('aria-valuemax={100}')
  expect(source).toContain('aria-valuenow={Math.round(task.progress)}')
  expect(source).toContain('data-vault-task-progress')
 })

})