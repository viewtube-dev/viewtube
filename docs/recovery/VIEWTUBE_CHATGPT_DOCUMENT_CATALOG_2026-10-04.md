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

## Canonical repository synchronization added 2026-10-04

| Artifact | Repository path | Classification |
|---|---|---|
| Canonical unified multi-conversation Recovery document | `Recovery` | CANONICAL / LIVE COORDINATION DOCUMENT |
| Recovery Protocol source | `docs/recovery/VIEWTUBE_MULTI_CONVERSATION_RECOVERY_PROTOCOL_2026-10-02.md` | SOURCE / PRESERVED |
| Recovery Ledger source | `docs/recovery/VIEWTUBE_MULTI_CONVERSATION_RECOVERY_LEDGER_2026-10-02.md` | SOURCE / PRESERVED |
| Repository Recovery Index | `docs/recovery/VIEWTUBE_CONVERSATION_RECOVERY_INDEX_2026-10-02.md` | REPOSITORY REGISTRY |

### Agent synchronization rule

Conversation agents must read the current `Recovery` file before contributing, preserve prior evidence, add every material recovered document/artifact to the repository, register the artifact path and provenance, and avoid stale overwrites. Round 1 is append-oriented independent recovery; Round 2 performs evidence-based reconciliation.
