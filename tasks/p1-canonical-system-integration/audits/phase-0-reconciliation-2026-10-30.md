# P1 Canonical Integration — Phase 0 Reconciliation Audit
**Production Date:** 2026-10-30 | **Last Edited:** 2026-10-30 | **Class:** AUDIT | **Status:** ACTIVE — DISCOVERY PARTIAL
**Concern:** live target, donor PR, task identity and current-owner reconciliation | **Owner:** Integrated Application Program
**Registry ID:** DOC-AUDIT-P1-PHASE0-20261030
**Target:** master/consolidated-feature-integration
**Audited target SHA:** 0135fa33bf5cd59503c9feecce4977072ef60fec
**Previous program PR:** #1178 — merged
**Audit branch:** docs/p1-phase0-reconciliation-20261030

## Executive result
Phase 0 has confirmed important implementation and governance already landed. This audit corrects the initial donor inventory and narrows implementation to gaps rather than rebuilding existing foundations. This is a source/PR reconciliation, not runtime certification. No code behavior tests were executed during this audit.

## 1. Live PR reconciliation

| PR | Current result | Verified detail | Program disposition |
|---|---|---|---|
| #1109 | MERGED | Gemini key validation model updated to gemini-3.1-flash; provider errors mapped to creator-safe messages; focused source contract test added | Treat as landed baseline; inspect current test/runtime behavior before extending |
| #1168 | MERGED | Streaming authorization/metering parity remediation, static generation caller scanner, fixture tests, source audit | Reuse scanner; manual dynamic-import/route reachability remains |
| #1169 | MERGED | Three plans: Brain gateway convergence, prompt migration/quality governance, provider credential security/BYOK | Link and execute these plans; do not create parallel replacements |
| #1174 | MERGED | BrainModelProvider injection contract, createBrainModelGateway factory, dynamic Gemini compatibility adapter and substitution test | Gateway seam exists; only Gemini default provider is evidenced |
| #935 | OPEN / NON-MERGEABLE | Shared stroke/split input, catalog, primitive export, generated vars, field and UI changes | Donor only; inspect against current source, harvest selective unique work |
| #988 | OPEN / NON-MERGEABLE | Studio docs, parity/field ownership tests, split text input, core/fields/recovery CSS | Donor only; overlaps #935/#992 and current Studio source |
| #992 | OPEN / NON-MERGEABLE | Token simplification, emitter, generated vars, CSS and authoring docs | Donor only; its derived-focus proposal is not current executable behavior |
| #1178 | MERGED | P1 program package, registry/plan-family and integrated program link | Planning package is on target |
| #1203 | MERGED | Fix Studio dropdown token emitter; target merge commit is audited SHA | Newer Studio emitter fix is part of current baseline |

The three Studio PRs are not merge candidates as-is. Their head/base commits are old relative to audited target. No wholesale branch merge is authorized. Harvest by file/behavior only after comparing against current code and preserving unique behavior.

## 2. Current target and governing identities
- Audited target SHA: `0135fa33bf5cd59503c9feecce4977072ef60fec` (latest commit returned for target at audit time).
- Capability registry: `docs/architecture/capabilities.json` has 13 canonical capabilities; the capability-home registry has 13 homes. No Priority-25 entry exists by ID/name/path.
- Task Authority distinguishes durable capabilities from exact governed tasks. `tasks/viewtube-one-goal-status.md` explicitly calls itself a temporary human-readable projection, not canonical Task Index VNext storage.
- That projection contains `VT-025`: Analytics — Retire legacy selectors/cache consumers — P1 — IN_PROGRESS. This is not the requested runtime-verification capability. Do not equate the string “Priority-25” with VT-025.
- Priority-25 remains an unresolved source identity. Find the originating work packet, capability reference, conversation handoff or PR before assigning task/capability IDs or implementing a substitute.

## 3. Workstream findings

### P1-01 Brain continuity
**Current owners:** BrainRuntime/BrainOrchestrator; BrainContextBroker/CreatorContextResolver; canonical Analytics/VT-SYNC; Projects/ContentBuild; Asset Engine; operation/receipt and outcome/evaluation owners.
**Code evidence:** `src/services/brain/runtime/BrainRuntime.ts`, `BrainModelGateway.ts`, `BrainContextBroker.ts`, `CreatorContextResolver.ts`, `BrainEvidenceQuality.ts`, Brain project/evidence/learning services. Brain Domain Authority explicitly separates six product-system owners and says Brain coordinates rather than absorbing persistence.
**Task/plan leads:** VT-003/004/019/020/021/022 and VT-035; existing `tasks/system-convergence/todo.md`; existing capability homes under PLAN-FAMILY-BRAIN-AI.
**Gap:** continuity must be traced across a real profile/context→evidence→task→operation/receipt→outcome/evaluation path. Existing components and isolated tests do not prove end-to-end identity continuity.

### P1-02 Gemini provider/key/generation governance
**Current owners:** BrainRuntime orchestrates; BrainModelGateway/provider adapter executes; GeminiKeyContext/keyVault owns current BYOK entry/validation; Creator Operations/GenerationRecord owns operation lifecycle; prompt registry owns prompt identity/version.
**Landed code:** `src/services/brain/runtime/BrainModelGateway.ts` now defines BrainModelProvider and `createBrainModelGateway`; default adapter dynamically imports Gemini. PR #1168 scanner and tests are present. `src/services/geminiModelGovernance.ts` is the existing Gemini model metadata/routing registry.
**Important existing plans:** `docs/plans/VIEWTUBE_BRAIN_MODEL_GATEWAY_CONVERGENCE_PLAN_2026-10-29.md`; `VIEWTUBE_AI_PROMPT_MIGRATION_AND_QUALITY_GOVERNANCE_PLAN_2026-10-29.md`; `VIEWTUBE_PROVIDER_CREDENTIAL_SECURITY_AND_BYOK_PLAN_2026-10-29.md`.
**Security finding:** `src/services/keyVault.ts` stores Gemini key aliases in browser localStorage; `GeminiKeyContext` validates through browser SDK. Do not call this encrypted/server-side vault. Existing security plan requires an explicit threat-model/product decision before migration.
**Gap:** no evidence in this audit of another production provider implementation; gateway interface/substitution fixture alone is not multi-provider production proof. Static scanner does not establish dynamic runtime reachability. Reconcile every caller, key policy, operation receipt and prompt provenance.

### P1-03 Unified diagnostics
**Current owners:** existing `src/services/diagnostics.ts`, `src/services/diagnostics/unified.ts`, `src/app/onScreenDiagnostics.ts`, EvidenceLineageDiagnostics, AnalyticsErrorReporter, Brain traces/receipts, ContentBuild event stream, Algorithm Intelligence event ledger and generation operation receipts.
**Task leads:** VT-005 defines OperationEnvelope/idempotency contract; VT-035 adds correlation IDs across creator loop; VT-036 defines structured failure taxonomy. These are existing task identities and must be extended, not duplicated.
**Gap:** verify adoption by all six systems and preserve existing domain event stores. No universal diagnostic DB/event ledger.

### P1-04 Priority-25 runtime
**Identity:** unresolved. It is not in the 13-entry capability registry or capability-home registry. VT-025 is a different Analytics task.
**Next gate:** search source-origin packet/Task Authority history/PR and originating conversation; identify canonical capability, task, owner, production caller, permissions and expected user action. No implementation branch until identity is proven.

### P1-05 Public resolver
**Current owner/code:** `src/services/publicHandleMode.ts`; API candidates `/public-channel/resolve` and `/api/public-channel`; Brain public evidence module and its tests.
**Current behavior verified in source:** normalizes YouTube handle/channel input; uses localStorage cache schema v1, max 20 entries, 3-hour TTL; positive resolved entries only; verifies handle/channel ID match; attaches fetchedAt/expiresAt/sourceRefs/limitations; public page + YouTube RSS provenance; sets subscriber/video/view/like/comment counts to null rather than inventing or retaining unverified counts; supports explicit fixtures with fixture labeling.
**Gap:** no negative-cache implementation is visible in current client cache contract; deployment route availability must be verified; actual Brain production caller and public-only policy need runtime proof. Previous 6h/3h/30m TTL proposal is not current code: current cache TTL is 3h.

### P1-06 Studio Controls
**Current executable token source:** `src/studio-ui/tokens.ts` (not `src/components/subtoolbox/tokens.ts`). Current emitter `scripts/emit-studio-control-vars.mjs` reads `src/studio-ui/tokens.ts`; output is `src/styles/studio-control-vars.generated.css`.
**Current CSS chain:** `studio-control-core.css`, `studio-control-fields.css`, `studio-control-system.css`, plus remaining family/legacy sheets and primitive styles. `studio-control-system.css` still owns tier selectors; do not replace it with a barrel until cascade migration is proven.
**Current values:** Supreme 60/3/6/52; Standard 44/3/6/38; Compact 28/2/4/24; Mini 20/1.5/3/17.5; Micro 12/1.5/3/10. Current token source explicitly carries per-tier focus widths; PR #992's ratio-derived emitter contract is not merged. PR #1203 emitter fix is merged.
**Donor overlap:** #935, #988 and #992 touch overlapping token/emitter/generated CSS/catalog/field files. Their current branch heads are non-mergeable and diverged. Harvest only individually verified behavior and tests.
**Gap:** prove one owner from token→emitter→generated CSS→CSS cascade→primitive export→catalog specimen→actual consumer; run token/parity/catalog gates and desktop/mobile visual checks.

## 4. Commands and tests available
- Gemini: `npm run audit:ai-generation-callers`, `npm run test:ai-generation-callers`; Brain gateway boundary tests; Gemini key context/keyVault tests; `test:unified-diagnostics`.
- Brain: existing BrainRuntime snapshot, CreatorContextResolver, EvidenceIntelligenceResolver, BrainProjectContext, BrainLearningPersistence, BrainEvaluationLoop and communication ingestion tests.
- Diagnostics: `test:unified-diagnostics`, OperationEnvelope tests, lineage/producer tests.
- Public resolver: `test:public-page-resolver`; public evidence test expects nine evidence records with `/api/public-channel/resolve` provenance and explicit non-private-Analytics limitations.
- Studio: `studio:tokens`, `test:studio-controls`, `test:studio-field-style-ownership`, `test:confirmed-library-layout`, `certify:studio-components`; verify current package scripts before running.
- Shared: `test:focused`, `typecheck`, `build`, relevant full test suite.

No tests were executed as part of this source/PR reconciliation. Passing commands must be evidenced by CI or a runtime environment and recorded separately.

## 5. Phase 0 exit
**PARTIAL.** PR donor status, major code owners, Gemini plans/scanner, Studio source-of-truth and Priority-25 ambiguity are now corrected. Still required:
- locate Priority-25 origin;
- inspect exact current Task Index VNext/Task Authority history and plan-family ownership;
- inspect current branch/PR diffs for Studio donors against target;
- complete production caller maps and cross-system identity matrix;
- run focused audits/tests and runtime verification on implementation branches.

## Existing Work Checked
docs/governance/TASK_AUTHORITY.md; docs/governance/VERIFICATION.md; docs/domains/BRAIN.md; docs/architecture/PRODUCT_ARCHITECTURE.md; docs/architecture/capabilities.json; governance/convergence/capability-homes.json; tasks/viewtube-one-goal-status.md; tasks/system-convergence/todo.md; docs/analytics/VIEWTUBE_ANALYTICS_VT_SYNC_MASTER_RESOURCE.md; docs/specifications/PROMPTS.md; docs/specifications/prompt-registry.json; three Gemini/provider plans from PR #1169; source code and tests listed above; PRs #935/#988/#992/#1109/#1168/#1169/#1174/#1178/#1203.

## 6. Studio donor branch divergence and overlap
Compared each Studio donor head to audited target SHA `0135fa33bf5cd59503c9feecce4977072ef60fec`:

| PR | Donor head | Ahead | Behind | Changed files | Compare |
|---|---|---:|---:|---:|---|
| #935 | `399c806eff225ec91d85ab03df3fc7f43c5667f2` | 53 | 1,643 | 16 | DIVERGED |
| #988 | `45afa86dacbbc4617fd2b0b58982beb30669d2bc` | 36 | 1,361 | 16 | DIVERGED |
| #992 | `a19309ab0cfd3846c43f0ba2e3103928d0c67f8` | 11 | 1,339 | 10 | DIVERGED |

Overlapping changed paths:
- #935 ∩ #988: `StudioHubConfirmedPrimitiveCatalog.tsx`, `src/studio-ui/tokens.ts`, `studio-control-fields.css`, `studio-control-system.css`, `studio-control-vars.generated.css`, `studio-inter-module.css`.
- #935 ∩ #992: `scripts/emit-studio-control-vars.mjs`, `src/studio-ui/tokens.ts`, `studio-control-system.css`, `studio-control-vars.generated.css`.
- #988 ∩ #992: both Studio contract docs, `src/studio-ui/tokens.ts`, `studio-control-core.css`, `studio-control-system.css`, `studio-control-vars.generated.css`.

The union of their changed-file sets is 29 paths. These numbers confirm that merging any donor wholesale would reintroduce substantial stale history and conflicting ownership. Use file-level diffs against current main and focused tests to recover only behavior not already present.

### Public resolver production-caller confirmation — follow-up source trace
A deeper current-main source trace confirms this is not merely a settings-only helper:
- `src/services/brain/runtime/BrainRuntime.ts` imports `fetchPublicChannelSnapshot`, requires an explicit `publicHandleContext`, validates selected handle/channel identity, constructs public-only evidence videos with null performance metrics, and passes provenance/limitations into Brain context and continuity.
- `src/services/brain/runtime/BrainRuntimeContracts.ts` defines `BrainRuntimePublicHandleContext` separately from `channelId`, specifically to avoid inferring public mode from an authenticated channel identity.
- `src/components/SidebarChatbot.tsx`, `src/views/AIBrainCommandInterface.tsx` (two call paths), and `src/views/dashboard/widgets/BrainHubWidget.tsx` pass `readSelectedPublicHandleContext()` only when `!authState.isAuthenticated && !channelConnection.isConnected`.
- `src/views/Settings.tsx` persists the explicit public selection and displays source/limitations.
Therefore the public resolver has production source wiring across the three main Brain surfaces. Remaining gate is runtime verification of logged-out public handle success, invalid/unknown handle, cache hit/stale state, resolver outage and strict public-only data; source wiring alone is not runtime certification.

## Public resolver backend and scaffold ownership
The recursive target tree confirms the real server endpoint `api/public-channel.mjs` plus `api/public-channel.node.test.mjs` and `api/public-channel.test.ts`. The endpoint is GET-only, validates YouTube handle/channel URL forms, fetches only allowlisted YouTube hosts, validates redirects, caps response size/time, parses public channel page metadata and RSS uploads, and does not require OAuth or YouTube Data API credentials. Service tests cover handle resolution, RSS ingestion, external URL rejection, redirect rejection, no-key operation, fixture labeling, identity mismatch and cache provenance.

A second folder, `src/features/capabilities/public-channel-resolution/`, is a scaffold: `PublicChannelResolutionApi.ts` still uses `scaffold://public-channel-resolution` and its write method throws; `usePublicChannelResolution.ts` wraps that stub. Code search found no production imports of the scaffold page/hook/API. Treat it as stale duplicate scaffolding, not the canonical resolver. Do not delete it until route/consumer/import checks and donor-harvest evidence are recorded; then quarantine/remove via a separate no-loss cleanup.

The canonical path is `Settings → publicHandleMode.ts → api/public-channel.mjs → BrainRuntime → SidebarChatbot / AIBrainCommandInterface / BrainHubWidget`. Runtime proof still needs to demonstrate the complete logged-out user journey and deployed endpoint.

## Shared identity/diagnostics code inventory
- `src/services/operations/OperationEnvelope.ts` + tests: event/operation/correlation/causation/idempotency/scope/evidence/artifact contract.
- `src/services/operations/OperationRecord.ts` + tests: operation lifecycle, approval and cross-domain lineage projection.
- `src/services/diagnostics.ts`, `src/services/diagnostics/unified.ts` + tests, `src/app/onScreenDiagnostics.ts`: sanitized bounded diagnostics and adapter normalization.
- `src/services/brain/BrainAssistantContinuity.ts`, `EvidenceRecord.ts`, `BrainOutcomeLedger.ts`, `AlgorithmIntelligenceEventLedger.ts`: existing context/evidence/outcome ancestry. See [identity map](../identity-map.md).
