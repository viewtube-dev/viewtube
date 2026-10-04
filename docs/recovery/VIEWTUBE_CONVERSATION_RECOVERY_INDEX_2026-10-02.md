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
