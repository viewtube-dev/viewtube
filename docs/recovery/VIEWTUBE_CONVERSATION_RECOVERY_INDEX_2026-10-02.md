# ViewTube Recovery Repository Index

**Canonical recovery document:** `Recovery`
**Repository:** `viewtube-dev/viewtube`
**Branch:** `main`

## Purpose

This index is the durable repository-side registry for multi-conversation recovery. The canonical `Recovery` file is the live coordination document. Every conversation agent must add material recovered from its conversation to this repository and register the artifact here.

## Canonical documents

| Artifact | Repository path | Role |
|---|---|---|
| Canonical Recovery Document | `Recovery` | Live unified protocol + ledger + work log + governance |
| Recovery Protocol | `docs/recovery/VIEWTUBE_MULTI_CONVERSATION_RECOVERY_PROTOCOL_2026-10-02.md` | Source protocol preserved verbatim |
| Recovery Ledger | `docs/recovery/VIEWTUBE_MULTI_CONVERSATION_RECOVERY_LEDGER_2026-10-02.md` | Source ledger preserved verbatim |
| Conversation Recovery Index | `docs/recovery/VIEWTUBE_CONVERSATION_RECOVERY_INDEX_2026-10-02.md` | Repository-side artifact registry |

## Agent artifact rule

Every material artifact recovered or created by a conversation agent must be committed to this repository.

### Placement

- Existing project/document path known → use that canonical path.
- Recovery-only artifact with no established project path → `docs/recovery/<category>/`.
- Conversation-specific handoff → `docs/recovery/handoffs/`.
- Architecture → `docs/recovery/architecture/`.
- Plans → `docs/recovery/plans/`.
- Audits → `docs/recovery/audits/`.
- Implementation evidence → `docs/recovery/implementation/`.
- Governance → `docs/recovery/governance/`.
- Design/UI → `docs/recovery/design/`.
- Deployment → `docs/recovery/deployment/`.
- Data → `docs/recovery/data/`.
- YouTube/creator → `docs/recovery/youtube/`.
- Technical → `docs/recovery/technical/`.

Do not create meaningless placeholders. Preserve original filenames where known.

## Required registry fields

Each agent contribution should identify:

- Agent / conversation identifier
- Round
- Date/time
- Artifact title
- Repository path
- Source
- Status
- Provenance
- Dependencies
- Verification
- Related LOG-ID
- Follow-up / unresolved issues

## Concurrency rule

Before modifying `Recovery`, fetch the latest file and SHA. Update from that latest version. If the SHA has changed since the agent read it, re-fetch and merge the new contribution before writing. Never overwrite newer work with an older copy.

## Current source corpus

The initial repository recovery corpus consists of the unified recovery document plus its two source documents. Additional conversation artifacts are expected to be added continuously under this repository contract.

## Round 1 / Round 2

**Round 1:** preserve unique conversation evidence.

**Round 2:** reconcile the complete repository corpus, resolve duplicates/conflicts using evidence, and identify authoritative/current versions.

## Final principle

The repository is the durable shared coordination surface. Chat history is not the canonical storage location for recovered project knowledge.


## Registered Round 1 contribution — 2026-10-04

| Field | Value |
|---|---|
| Agent / conversation | Vault + Projects adaptive Asset Workbench conversation |
| Round | 1 |
| Artifact | `docs/recovery/handoffs/VIEWTUBE_VAULT_PROJECTS_CONVERSATION_RECOVERY_2026-10-04.md` |
| Source | Current ChatGPT conversation |
| Status | IMPLEMENTED |
| Provenance | Conversation source → repository discovery → recovery artifact |
| Verification | Canonical Recovery system and Vault master inspected; external implementation claims remain unverified |
| LOG-ID | `REC-20261004-vault-recovery-001` |
| Follow-up | Round 2 reconciliation against current `main` and any accessible historical source branch |

### Contribution summary

Recovered material includes the adaptive Asset Workbench architecture, full Vault capability inventory, Projects/Mini Library grouping model, Toolbox/SubToolbox consolidation rules, shared operation/ActionPacket flow, implementation claims from the external `cbrewsterthegreat/ViewTube` repository, and Render deployment evidence.

The contribution explicitly preserves the repository-identity conflict: `viewtube-dev/viewtube` is canonical for this recovery pass; external repository claims are not treated as current implementation until independently verified.


## Registered Round 1 contribution — Creator Workspace Documentation + Resource Verification — 2026-10-04

| Field | Value |
|---|---|
| Agent / conversation | ViewTube Recovery + Research + Documentation + Implementation Agent; exact conversation title unavailable |
| Round | 1 |
| Artifact | `docs/recovery/handoffs/VIEWTUBE_CREATOR_WORKSPACE_RECOVERY_2026-10-04.md` |
| Source | Current ChatGPT conversation |
| Status | VERIFIED |
| Provenance | Conversation source → repository inspection → public resource inspection → recovery artifact |
| Verification | Recovery governance, creator-workspace master, Studio Hub source relationships, and the public Resource Library URL were directly inspected |
| Commit | `7bf178ba7f6715ce09a9761b9232063474dbd3b9` |
| LOG-ID | `REC-20261004-creator-workspace-001` |
| Follow-up | Round 2 reconciliation of Dashboard inventory, Studio Hub registry/documentation drift, Brain/Account/Context authorities, and historical Toolbox claims |

### Contribution summary

Recovered the canonical tool-context hierarchy, 12 core creator-workspace tools, 66-widget Dashboard evidence, 13 Studio Hub tools, UI sizing/reference-library decisions, Toolbox/SubToolbox recovery concerns, Brain/Account/Context architecture observations, and the public Resource Library verification. The inspected public resource is an analytics guide, not the general master documentation itself.


## Registered Round 1 contribution — Account / YouTube / Beta conversation — 2026-10-04

| Field | Value |
|---|---|
| Agent / conversation | Account / YouTube / Beta continuation conversation |
| Round | 1 |
| Artifact | `docs/recovery/handoffs/VIEWTUBE_ACCOUNT_YOUTUBE_BETA_CONVERSATION_RECOVERY_2026-10-04.md` |
| Source | Current ChatGPT conversation |
| Status | VERIFIED recovery artifact; historical implementation claims retain individual status |
| Provenance | Conversation source → repository discovery → recovery artifact |
| Verification | Canonical Recovery files/playbook directly read; historical cbrewsterthegreat/ViewTube work preserved with explicit non-canonical status |
| LOG-ID | `REC-20261004-account-system-conversation-001` |
| Follow-up | Round 2 reconciliation against canonical `viewtube-dev/viewtube/main` |

### Contribution summary

Recovered the beta-critical account/login/Google/YouTube requirements; the account/channel canonical-state architecture; YouTube read/write transport migration findings; VT Sync credential-boundary issue; typed analytics transport; historical working-branch commits; branch-divergence/merge constraints; production Google Cloud blockers; and the complete unfinished-work inventory. The artifact explicitly distinguishes verified repository findings, historical branch implementation, proposed work, and production-blocked work.


## Registered Round 1 contribution — Deployment + Branch Recovery — 2026-10-04

| Field | Value |
|---|---|
| Agent / conversation | ViewTube Recovery + Research + Documentation + Implementation Agent; exact title preserved in handoff |
| Round | 1 |
| Artifact | docs/recovery/handoffs/VIEWTUBE_DEPLOYMENT_BRANCH_RECOVERY_2026-10-04.md |
| Source | Current ChatGPT conversation |
| Status | VERIFIED for canonical source/recovery facts; historical deployment claims retain evidence-specific status |
| Provenance | Conversation source → canonical GitHub inspection → recovery artifact |
| Commit | 1cbb7ec3817fdb9142f8a0b1730388b82d3b0f10 |
| LOG-ID | REC-20261004-deployment-branch-recovery-001 |
| Follow-up | Build and deploy exact current main SHA; reconcile remaining branches/PRs |

### Contribution summary

Recovered the Render npm start failure and its current-source fix, the historical Vercel Resource Library unresolved-import failure, the current source-local Resource Library architecture, the user's hard src-only runtime import constraint, Toolbox compatibility-export findings, current main checkpoint evidence, merge-all-work rules, deployment provenance requirements, and the distinction between historical external-repository evidence and canonical viewtube-dev/viewtube state.


## Registered Round 1 contribution — Vault Workbench Tools, Capabilities, Plans & Systems Reference — 2026-10-13

| Field | Value |
|---|---|
| Agent / conversation | ViewTube Conversation Agent — Vault Workbench Systems Reference |
| Round | 1 |
| Date/time | 2026-10-13 17:32 EDT |
| Artifact | `docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md` |
| Source | User request; canonical Vault master; Vault overview; Vault/Projects recovery handoff; current recovery governance |
| Status | VERIFIED IMPLEMENTATION (documentation only; runtime implementation not claimed) |
| Provenance | Existing canonical master + recovered capability inventory → consolidated master reference |
| Verification | Updated master re-read from main; Recovery.md, Recovery.yaml, and docs/Vault.md registration/link re-read from main |
| Commit | `5e70c1e18aee6b00f973e02e72ed5814eee0b4f9` |
| LOG-ID | `REC-20261013-vault-reference-001` |
| UPDATE-ID | `UPDATE-20261013-vault-reference-001` |
| Follow-up | Map every capability to canonical runtime files, tests, UI entry, dependencies, and actual status; preserve historical external implementation claims as unverified until reconciled |

### Contribution summary

Expanded the existing Vault master rather than creating a competing master. The reference now covers adaptive Workbench modes; image, video, audio, document, inspection, search, organization, AI, processing, rights, lineage, compare, and handoff capability families; the Tool Record Contract; shared operation lifecycle; conceptual asset/collection model; integration boundaries; UI/security standards; test and release gates; phased implementation; provenance boundaries; risks; and unresolved questions. The catalog is a target specification, not proof that each capability is implemented.


## Registered Round 1 contribution — Vault Workbench phases 0–6 implementation audit and canonical service reconciliation — 2026-10-15

| Field | Value |
|---|---|
| Agent / conversation | ViewTube Vault Workbench implementation continuation |
| Round | 1 |
| Artifact | `docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md`; `docs/vault/VAULT_PHASES_0_1_2_IMPLEMENTATION_AUDIT.md`; canonical `docs/vault/VAULT_PHASES_3_4_5_6_IMPLEMENTATION_AUDIT.md` |
| Source | Canonical Vault page, adapter, inspection, operation ledger, media preflight, governance services, tests, and PR #336 |
| Status | IMPLEMENTATION IN BRANCH / EXACT-HEAD CI VERIFICATION PENDING |
| Branch / PR | `vault/phases-0-1-2-workbench` → PR #336 targeting `master/consolidated-feature-integration` |
| Verification | GitHub read-back confirms redundant experimental services removed and canonical services retained; exact-head CI, build, browser, merge, and post-merge read-back pending |
| LOG-ID | REC-20261015-vault-phases-0-6-001 |
| Follow-up | Review current PR checks, fix introduced failures, then merge only after required gates pass |

### Contribution summary

The continuation audit confirmed that phases 3–6 are already represented by canonical `vaultInspection`, `vaultOperationLedger` + Asset Engine lineage, `vaultMediaOperations` preflight, and `vaultReviewGovernance` services and tests. Redundant exploratory queue/operation/comparison/governance services were removed to avoid competing sources of truth. The Vault master and overview now point to the canonical phase audit. Server-side authorization/durability, deployed processor health, and actual AI-provider integration remain explicitly unverified or blocked.


## Vault Workbench phases 7–10 continuation — 2026-10-15

- **Audit:** `docs/vault/VAULT_PHASES_7_8_9_10_IMPLEMENTATION_AUDIT.md`
- **Master plan:** `docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md`
- **Branch / PR:** `vault/phases-0-1-2-workbench` / [PR #336](https://github.com/viewtube-dev/viewtube/pull/336)
- **Status:** implementation in branch; exact-head verification pending; phase 8 blocked.
- **Implemented:** bounded Vault batch planner/runner with per-item preflight, cancellation and partial-result reporting; tests authored.
- **Canonical workflow:** existing Asset Engine / ContentBuild / ActionPacket handoff path audited and retained.
- **Not claimed:** server-enforced workspace authorization, durable cross-device operation queue, real batch processor integration, actual vision AI provider, end-to-end browser certification, merge or deployment.
- **Next:** inspect exact-head CI, resolve failures, close authorization/storage and processor integration gates, verify browser flow and post-merge target.
