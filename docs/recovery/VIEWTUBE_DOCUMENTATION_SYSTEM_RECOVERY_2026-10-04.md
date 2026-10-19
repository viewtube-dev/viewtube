# ViewTube Documentation System — Recovery Record

**Status:** RECOVERED / GOVERNANCE CONTRIBUTION  
**Repository:** `viewtube-dev/viewtube`  
**Date:** 2026-10-04

## Objective

Create one understandable documentation and work system without losing legitimate project history or creating competing sources of truth.

## Canonical namespaces

```
docs/          durable knowledge / authorities
work/active/   accepted active execution
work/intake/   conversation intake / provenance
ideas/         unaccepted ideas / research
archive/       historical / superseded material
```

## Routing rule

| Material | Destination |
|---|---|
| Unique durable truth | `docs/` |
| Accepted active work | `work/active/` |
| Conversation handoff/provenance | `work/intake/` |
| Unaccepted ideas/research | `ideas/` |
| Historical/superseded evidence | `archive/` |

## Anti-duplication rule

Do not establish parallel permanent roots for:

- `tasks/`
- `plans/`
- `backlog/`
- `workstreams/`

Existing legacy material must be inspected before removal. A folder name alone is not sufficient evidence that its contents are duplicates.

## Conversation intake

Canonical per-conversation structure:

```
work/intake/<conversation-id>/
  handoff.md
  worklog.json
  review.md
```

Handoffs provide resumability and provenance. They do not automatically become product architecture authorities.

## Migration sequence

1. Inventory.
2. Identify canonical authorities.
3. Classify each legacy artifact.
4. Preserve unique content.
5. Update references.
6. Move active work.
7. Archive historical evidence.
8. Remove only proven duplicates.
9. Re-scan for stale references.
10. Record a migration receipt.

## Important constraint

Do not create another governance document merely to plan consolidation when the repository already has an applicable authority. Update or extend the existing authority where appropriate.

## Recovery provenance

This record reconstructs the documentation-system decisions and folder model from the associated ChatGPT work. It should be reconciled against current `main` before further physical migration.
