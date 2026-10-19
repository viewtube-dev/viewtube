# ViewTube Document Health

**Status:** ACTIVE — DOCUMENT MIGRATION HEALTH STANDARD  
**Authority:** Canonical documentation operations standard  
**Applies to:** `docs/`, `docs/recovery/`, and documentation-facing repository references

## Purpose

Document Health is the verification layer for the ViewTube documentation migration. It identifies duplication, competing authority, stale or incomplete metadata, broken references, orphaned recovery evidence, and knowledge that has not yet been assigned a canonical destination.

This document defines the checks. It does **not** claim that a full repository scan has already been completed.

## Health states

- **HEALTHY** — checked and no known issue.
- **ATTENTION** — improvement needed but not blocking.
- **WARNING** — material documentation risk.
- **CONFLICT** — competing claims or authorities require reconciliation.
- **BLOCKED** — verification or migration cannot safely continue.
- **UNKNOWN** — not yet checked.
- **VERIFIED** — evidence confirms the stated condition.

## Required checks

### Structure

- Canonical current knowledge is directly under `docs/`.
- Recovery/history/agent operations are under `docs/recovery/`.
- No unnecessary routine nested documentation folders are introduced.
- Runtime feature folders remain under their actual code ownership.

### Authority

- Each major subject has one obvious canonical owner.
- Older documents do not silently compete with canonical documents.
- Plans and recovery artifacts do not masquerade as implementation authority.
- Verified implementation and test/deployment evidence outrank documentation claims.

### Preservation

- Every consolidation source has been read completely.
- Unique facts, decisions, requirements, identifiers, failures, tests, open questions, and provenance are mapped to a destination.
- Conflicts remain visible until resolved.
- Historical evidence is retained when it provides unique provenance.

### Metadata

Important documents should have:

- title
- status
- authority
- owner
- created timestamp
- last-updated timestamp
- source/provenance
- canonical location
- related documents
- supersedes/superseded-by where applicable

### Change tracking

Substantive document operations require:

- unique `DOC-YYYYMMDD-NNN` operation ID;
- exact `America/New_York` timestamp with EST/EDT;
- conversation and agent;
- application/tool;
- action;
- source and destination;
- complete file inventory;
- commit SHA;
- summary;
- important information preserved;
- discoveries/conflicts;
- verification;
- blockers and follow-up.

The operation must be recorded in `docs/recovery/History.md`.

### Links

Check for:

- broken relative Markdown links;
- references to superseded paths;
- references to old nested recovery locations;
- canonical documents missing from `docs/Index.md`;
- recovery documents missing from `docs/recovery/Index.md`.

### Reconciliation

For each duplicate or competing source:

| Source | Candidate authority | Relationship | Conflict | Destination | Action | Evidence | Verification | Status |
|---|---|---|---|---|---|---|---|---|

No destructive action should occur solely because two files look similar.

## Health workflow

```
SCAN
  ↓
CLASSIFY
  ↓
COLLECT EVIDENCE
  ↓
RECOMMEND
  ↓
REVIEW
  ↓
CHANGE
  ↓
VERIFY
  ↓
LOG
```

Automation may identify candidates. It must not silently delete, overwrite, or declare a document superseded without the preservation and verification steps.

## Migration gates

### Gate 1 — Snapshot

The pre-migration `main` state is preserved by a dedicated Git branch before migration changes.

### Gate 2 — Inventory

Every existing documentation/recovery path is classified before destructive cleanup.

### Gate 3 — Canonicalization

Every major subject has one authority or an explicit unresolved conflict.

### Gate 4 — Preservation

Every merged source has verified destination coverage and provenance.

### Gate 5 — Link integrity

Old paths and inbound references have been checked before source retirement.

### Gate 6 — History

Every substantive operation has a History receipt.

### Gate 7 — Cleanup

Deletion or archival happens only after the preceding gates pass.

## Current migration baseline

The pre-migration `main` state has been preserved on:

`recovery/pre-document-system-migration-2026-10-04`

The migration is being applied to `main` incrementally. This branch is a safety snapshot, not a second source of truth.

## Findings register

Actual health findings belong in `docs/recovery/Findings.md` or in a focused recovery audit when the finding is historical/evidence-specific.

Do not invent findings. An unchecked category remains **UNKNOWN** until scanned.

## Relationship to other standards

- `docs/Document-System.md` — document lifecycle and change protocol.
- `docs/Organization.md` — repository structure and consolidation plan.
- `docs/recovery/History.md` — operation receipts.
- `docs/recovery/Agent.md` — agent execution requirements.
- `docs/Index.md` — current documentation navigation.
- `docs/recovery/Index.md` — recovery navigation.

**Principle:** make the repository easier to understand without making its knowledge less complete.
