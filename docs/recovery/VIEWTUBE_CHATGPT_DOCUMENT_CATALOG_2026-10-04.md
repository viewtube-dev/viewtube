# ViewTube ChatGPT Document Catalog — 2026-10-04

**Repository:** `viewtube-dev/viewtube`  
**Purpose:** Catalog the major document-equivalent artifacts produced or materially developed in the associated ChatGPT work.

This catalog is intentionally provenance-aware. A catalog entry does not imply runtime implementation.

## Recovery and governance

| Artifact | Classification | Status |
|---|---|---|
| Multi-Conversation Recovery Protocol | Recovery authority | VERIFIED IN REPOSITORY |
| Unified Recovery Protocol / Ledger | Recovery coordination | VERIFIED / REPOSITORY EVIDENCE |
| Conversation Recovery Index | Conversation recovery artifact | RECOVERED |
| Recovery Contribution — Documentation / Folder Work | Conversation handoff | RECOVERED |
| Documentation system consolidation work records | Migration evidence | RECOVERED / PARTIAL |
| Conversation intake structure | Governance convention | IMPLEMENTED IN PRIOR WORK; CURRENT STATE SHOULD BE RECHECKED |

## Product / architecture documents materially developed in the work

| Area | Artifact / subject | Evidence classification |
|---|---|---|
| Brain / AI | ViewTube Brain & AI System Report | VERIFIED IN REPOSITORY |
| Creator workspaces | Creator Workspaces Master Tool Context | VERIFIED IN REPOSITORY |
| Master rebuild | Master System Rebuild Resource Plan | VERIFIED IN REPOSITORY |
| Master rebuild | Master System Rebuild Resource Index | VERIFIED IN REPOSITORY |
| Master rebuild | Master System Rebuild Dependency Map | VERIFIED / REPOSITORY EVIDENCE |
| Toolbox | Toolbox Component Library Plan and related state/audit material | REPOSITORY / RECOVERED EVIDENCE |
| Resource Library | YouTube research/resource documents | VERIFIED IN REPOSITORY |
| Settings | Settings Frontend Redesign durable specification | RECOVERED FROM PRIOR WORK; verify current path |
| Account System | Account-system architecture material | RECOVERED / REQUIRES RECONCILIATION |
| Vault | Vault / Asset Workbench planning and recovery material | RECOVERED / REQUIRES RUNTIME RECONCILIATION |

## Implementation / deployment recovery

The associated work also produced document-equivalent technical recovery findings covering:

- Toolbox regression diagnosis.
- Known-good and bad commit comparison.
- Render build failure diagnosis.
- Compatibility-export investigation.
- Safe recovery via normal commit rather than destructive reset.
- Production verification requirements.

These findings are preserved in the recovery index and should not be interpreted as proof of a currently LIVE deployment.

## Status discipline

Use the repository as the source of truth for current file existence and implementation state. Use these conversation artifacts as provenance and recovery evidence.

When a conflict exists:

**current verified implementation > verified tests/deployments > current canonical docs > explicit approved decisions > recovery artifacts > conversation plans > general discussion.**

## Next reconciliation target

After Round 1 contributions from all conversations are available, perform Round 2:

- deduplicate;
- reconcile conflicting versions;
- establish canonical authorities;
- identify missing artifacts;
- map provenance;
- verify implementation;
- update the master recovery state.

Do not discard a conflicting artifact until its useful information and provenance have been preserved.

## Recovery format modernization — 2026-10-04

The recovery system now uses a two-layer format for easier maintenance:

| File | Role |
|---|---|
| `Recovery.md` | Human-readable canonical operating document, work log, handoffs, and reconciliation notes |
| `Recovery.yaml` | Structured machine-readable state, schema, status vocabulary, event classes, and current recovery state |
| `Recovery` | Legacy compatibility pointer; do not use as the primary editing surface |

Agents should read **both `Recovery.md` and `Recovery.yaml`** before recovery work and update the appropriate layer after contributing.

## Round 1 recovery addition — Documentation / Brain / Account artifact inventory

| Area | Recovered artifact / subject | Classification |
|---|---|---|
| Documentation | Conversation-derived master documentation/artifact inventory | VERIFIED RECOVERY ARTIFACT |
| AI Brain | Proposed Brain runtime/context/memory/knowledge/agent/tool/workflow/evidence/governance artifact family | PROPOSED; reconcile with existing Brain report |
| Account / Identity | Proposed account/authentication/session/authorization/Google/YouTube/security artifact family | PROPOSED; reconcile with existing Account System resources |
| Context | Proposed user/workspace/project/content/asset/conversation context family | PROPOSED; reconcile across Brain/Conversation OS/Projects/Vault/Account |
| Projects | Page-level tool grouping: AI Brain, Analytics, Vault, Editor | REPORTED; repository context exists |
| Analytics | Sync Controller, Intelligence Hub, Master Data Tables, Data Visuals | REPORTED; reconcile with current implementation |
| UI | Size-system, component-level, reference-vs-production, Toolbox, Studio Hub, modernization artifacts | RECOVERED / PROPOSED; existing authorities must be checked |
| Recovery | Full conversation document-equivalent inventory | VERIFIED RECOVERY ARTIFACT |

The detailed inventory is preserved at:
`docs/recovery/handoffs/VIEWTUBE_DOCUMENT_ARTIFACT_INVENTORY_2026-10-04.md`

Important: this catalog records provenance and recovery targets. It does not imply runtime implementation.
