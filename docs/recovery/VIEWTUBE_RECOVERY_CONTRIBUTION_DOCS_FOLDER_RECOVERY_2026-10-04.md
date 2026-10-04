# ViewTube Recovery Contribution — Documentation / Folder Work

**Date:** 2026-10-04  
**Repository:** `viewtube-dev/viewtube`  
**Branch:** `main`  
**Round:** 1 conversation recovery / documentation consolidation  
**Status:** RECOVERED / CONTRIBUTION

## Contribution

This document preserves the documentation-system work performed in the associated ChatGPT conversation.

The objective was to consolidate overlapping documentation and task-management structures into one understandable system while preserving legitimate historical and active work.

## Canonical namespace model

| Namespace | Purpose |
|---|---|
| `docs/` | Durable knowledge, specifications, authorities |
| `work/active/` | Accepted active execution |
| `work/intake/` | Conversation intake, provenance, resumability |
| `ideas/` | Unaccepted ideas and research |
| `archive/` | Historical, superseded, or removed material |

### Explicit anti-duplication rule

Do not create parallel permanent roots for:

- `tasks/`
- `plans/`
- `backlog/`
- `workstreams/`

Existing material in those locations should be classified and migrated only after its content and references are understood.

## Migration rules

1. Search before creating.
2. Update existing authorities when they are canonical.
3. Combine overlapping content instead of creating another master.
4. Preserve unique information.
5. Move active accepted work into `work/active/`.
6. Move conversation provenance into `work/intake/`.
7. Move unaccepted ideas into `ideas/`.
8. Move historical/superseded evidence into `archive/`.
9. Delete only proven duplicates after references and provenance are preserved.
10. Record material migrations so another agent can understand what changed.

## Conversation handoff structure

The canonical conversation intake package is:

```
work/intake/<conversation-id>/
  handoff.md
  worklog.json
  review.md
```

The handoff is for resumability and provenance. It is not itself the final authority for product architecture.

Durable truth should be promoted to `docs/`; accepted execution belongs in `work/active/`; ideas remain in `ideas/`; historical evidence remains in `archive/`.

## Recovered migration work

The prior documentation-consolidation effort used:

`work/active/documentation-system-consolidation/`

with working records including:

- `work.md`
- `MIGRATION-MAP.md`
- `DISPOSITION-LOG.md`
- `WAVE3-AUDIT.md`

The settings redesign was promoted into a durable specification under `docs/specifications/`, with legacy donor material classified rather than left as competing authorities.

## Governance integration

The repository's agent guidance was updated so conversation handoffs use the governed `work/intake/` namespace and the dedicated conversation handoff/reconciliation skills.

## Preservation rule

This artifact is a contribution record, not a claim that every historical task-directory file has already been deleted. Remaining legacy files must be inventoried, classified, and reconciled before removal.

## Recommended continuation

1. Inventory remaining `tasks/` content.
2. Identify every reference to legacy task paths.
3. Classify each file as canonical, active, idea, historical, or duplicate.
4. Migrate unique content.
5. Update references.
6. Remove only verified duplicates.
7. Record the migration receipt.
8. Re-scan for stale references.

## Provenance

This document was reconstructed from the associated ChatGPT work record and preserved as a durable handoff so future conversations can continue the documentation consolidation without depending on chat history.
