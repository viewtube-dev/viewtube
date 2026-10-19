# Vault Workbench — Phases 0–2 Implementation Audit

**Target branch:** `master/consolidated-feature-integration`  
**Execution branch:** `vault/phases-0-1-2-workbench`  
**Status:** source audit and implementation in progress; merge/runtime verification not claimed until CI and read-back complete.

## Phase 0 — canonical baseline and source audit

| Concern | Canonical source on target branch | Baseline finding |
|---|---|---|
| Vault route/page | `src/views/CreatorVaultOS.tsx`, route registration in `src/app/AppRoutes.tsx` | Real page and integrated workbench exist; this is not a blank-slate migration. |
| Asset identity and local storage | `src/services/vaultAdapter.ts`, `VaultAsset` in `src/types.ts` | `VaultAsset.id` is the stable local record identity; update/upsert paths preserve it. Current asset storage is browser localStorage. |
| Workspace preferences | `src/services/vaultWorkspaceState.ts` | Search/filter/view/density/module preferences are persisted separately from asset records. |
| Selection | `src/services/vaultSelection.ts` and `src/services/__tests__/vaultSelection.test.ts` | Range selection exists; stale clicked IDs were not rejected. |
| Capability resolution | `src/features/vault-workbench/capabilities.ts` and tests | Previous registry covered only a small subset of modes and allowed a caller to overstate processor availability. |
| Intake metadata and jobs | `vaultImport.ts`, `vaultFileMetadata.ts`, `vaultFileHash.ts`, `vaultVideoThumbnail.ts`, `vaultTaskCenter.ts` | Intake, local metadata extraction, hashing and task records exist; no assumption that all scanners/processors are backed by a durable worker. |
| Brain retrieval | `src/services/brain/BrainVaultAdapter.ts` | Read-only adapter searches the canonical Vault adapter; it is not a second Brain asset database. |
| Specialist media UI | `src/views/vault/VaultImageWorkbench.tsx`, `VaultVideoWorkbench.tsx` | Reuse current specialist surfaces; do not build duplicate engines inside Vault. |

### Evidence-backed gaps

1. `CreatorVaultOS.tsx` passed `videoProcessorAvailable: true` despite the capability contract requiring a verified durable processor.
2. The selection resolver could add a clicked ID not present in the visible/canonical list.
3. Capability rules were not a complete shared registry for the adaptive Workbench modes.
4. The reviewed asset contract is localStorage-backed and does not establish server-enforced account/workspace authorization.
5. GOLDEN/protected and archive/trash guards are useful lifecycle policy, but do not replace account/workspace authorization or a server-side mutation boundary.

## Phase 1 — identity, mutation policy, and selection

- Keep `VaultAsset.id` as the stable Vault record identity; project, ContentBuild, generation, source and derivative IDs are references/provenance, not replacements for it.
- Update/upsert must preserve the canonical ID and creation timestamp.
- Selection must contain canonical asset IDs; stale clicked IDs are ignored and Shift-range applies only to the visible ordered range.
- Do not create a competing asset database or identity store.
- **Authorization limitation:** the inspected browser adapter does not expose an authoritative authenticated workspace scope. This work can implement local action eligibility/lifecycle guards, but true per-user/per-workspace authorization remains **BLOCKED** pending the canonical server/account contract. Client-side flags are not authorization.

## Phase 2 — adaptive host and capability registry

- Centralize capability IDs, mode ownership, selection prerequisites, local eligibility, and processor dependencies.
- Provide Browse, Inspect, Compare, Edit, Process, Organize and Workflow modes from one host.
- Do not mark video/audio processing available unless its processor is explicitly verified and connected.
- Preserve Toolbox/SubToolbox ownership and specialist media components; the host is orchestration, not a new processing engine.

## Verification required before merge

- Focused Vitest: capability resolver, adaptive host, selection and existing workspace tests.
- Typecheck and production build.
- Separate pre-existing Vault/other CI failures from branch-introduced failures.
- No claim of browser certification without a browser run.
