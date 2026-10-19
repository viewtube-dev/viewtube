# ViewTube Document System

**Status:** PROPOSED — CANONICAL DOCUMENT OPERATIONS STANDARD

## Purpose

One controlled system for creating, editing, merging, moving, renaming, restructuring, superseding, archiving, and restoring ViewTube documents.

**Core rule: no important knowledge should disappear because a document was edited, merged, moved, renamed, or retired.**

## Document lifecycle

`IDEA → DRAFT → ACTIVE → UPDATED → CONSOLIDATED → SUPERSEDED → ARCHIVED`

## Required metadata

Canonical and agent-maintained documents should record:

| Field | Requirement |
|---|---|
| Title | Clear human-readable title |
| Status | Current lifecycle/status |
| Authority | Canonical, source, recovery, historical, etc. |
| Owner | Responsible system/team/agent |
| Created | Exact timestamp, America/New_York, with EST/EDT |
| Last Updated | Exact timestamp, America/New_York, with EST/EDT |
| Source | Conversation, file, code, decision, or other provenance |
| Canonical Location | Current repository path |
| Related Documents | Important authorities |
| Supersedes | Previous document/path if applicable |
| Superseded By | Replacement if applicable |

Never fabricate timestamps or provenance.

## Mandatory change log

Every substantive document should contain a Change Log.

| Update ID | Conversation / Agent | Application | Action | Created | Edited | Time | Summary | Important Information | Verification | Commit |
|---|---|---|---|---|---|---|---|---|---|---|

Action vocabulary:

`CREATE, EDIT, MERGE, MOVE, RENAME, SPLIT, RESTRUCTURE, SUPERSEDE, ARCHIVE, RESTORE, VERIFY`

For very large documents, detailed history may live in `docs/recovery/History.md`.

## Update IDs

Use:

`DOC-YYYYMMDD-NNN`

Never reuse an Update ID.

## Agent operation receipt

Every substantive documentation operation must record:

- Update ID
- conversation title/name
- agent identity/model when available
- application/tool used
- exact start and completion time
- timezone and EST/EDT designation
- requested operation
- files created
- files edited
- files moved
- files merged
- files superseded
- files archived
- commits/PRs
- discoveries
- important information preserved
- conflicts
- verification
- blockers
- recommended follow-up

## Create protocol

Before creating a document:

1. Search for an existing authority.
2. Search related documents.
3. Determine whether the information belongs in an existing document.
4. Check `docs/Index.md` and `docs/Organization.md`.
5. Assign intended authority/status.
6. Record provenance.
7. Create only when no suitable owner exists or a separate role is justified.

## Edit protocol

Before editing:

1. Read the current document when feasible.
2. Check status and authority.
3. Capture current commit/version.
4. Identify affected sections.
5. Preserve unique information.
6. Make the smallest coherent change.
7. Update metadata and change log.
8. Verify links and consistency.
9. Record the resulting commit.

## Merge protocol

A merge is an information-preservation operation.

Before merging:
- inventory both documents;
- compare sections;
- identify unique information;
- identify contradictions;
- identify source authority;
- map every unique item to the destination.

During merging:
- preserve facts, decisions, failures, implementation evidence, open questions, and provenance;
- explicitly record unresolved conflicts.

After merging:
- verify the destination against every source;
- update references;
- mark sources `SUPERSEDED` rather than immediately deleting when traceability matters;
- remove a source only after verification and link migration.

## Move / rename protocol

Record old path, new path, affected references, verification, and migration commit. Retain a pointer/redirect when practical.

## Split protocol

When splitting a document, record why it was split, destination documents, sections moved, what remains, and whether the original is historical or superseded.

## Restructure protocol

Distinguish:

- **content change** — knowledge changed;
- **structural change** — organization changed;
- **authority change** — source of truth changed;
- **status change** — evidence state changed.

Formatting improvements must never silently become implementation or authority claims.

## Information-preservation ledger

For major merges/restructures:

| Source | Unique Content | Destination | Preserved? | Verification |
|---|---|---|---|---|

No source is retired while material rows remain unresolved.

## Conflict register

When sources disagree, do not silently reconcile them.

Record:
- Conflict ID
- sources
- competing claims
- evidence
- current authority
- temporary resolution, if any
- decision needed
- verification needed

Authority hierarchy:

**current verified implementation → verified tests/deployments → current canonical docs → approved decisions → recovery artifacts → plans → general discussion**

## Document health checks

Periodically detect:

- duplicate authorities;
- stale or broken links;
- orphan documents;
- missing metadata;
- missing change logs;
- contradictory claims;
- outdated status;
- references to retired paths;
- duplicate content;
- undocumented moves/renames;
- canonical documents missing from `docs/Index.md`;
- recovery sources with no destination;
- destinations lacking provenance.

## Version and recovery safeguards

For consequential changes:

- capture the current commit SHA;
- prefer normal commits over destructive history rewrites;
- preserve the previous source when consolidation is uncertain;
- use Git history as an additional recovery layer;
- never treat a branch, PR, or conversation response as proof of merged/verified implementation.

## Reason tags

Use when useful:

`NEW_KNOWLEDGE, CORRECTION, CONSOLIDATION, REORGANIZATION, RECOVERY, GOVERNANCE, IMPLEMENTATION_SYNC, VERIFICATION, DEPRECATION`

## Agent handoff

Every substantive operation ends with:

**WHAT CHANGED → WHY → EVIDENCE → CURRENT STATE → UNRESOLVED ITEMS → NEXT ACTION**

The next agent must be able to continue without reconstructing the previous conversation.

## Periodic consolidation triggers

Review documentation after:

- major feature phases;
- multiple conversations on one subject;
- duplicate documents appearing;
- authority conflicts;
- accumulation of recovery artifacts;
- major releases;
- major architecture changes.

## Document quality score

Important canonical documents can be evaluated for:

- authority clarity;
- provenance completeness;
- freshness;
- information completeness;
- link integrity;
- conflict visibility;
- verification coverage;
- navigation quality.

Low scores trigger maintenance rather than creation of another competing document.

## Recommended automation

Future automation should detect duplicate/near-duplicate documents, broken links, moved-file references, missing metadata/change logs, stale documents, consolidation candidates, orphan documents, and canonical documents missing from `docs/Index.md`.

Automation should report findings before destructive changes.

## Master operation ledger

Maintain the repository-wide ledger at:

`docs/recovery/History.md`

Minimum fields:

`Update ID | Timestamp | Conversation | Agent | Application | Action | Source | Destination | Commit | Summary | Important Information | Verification | Follow-up`

## Completion gate

An operation is complete only when:

- the requested change exists;
- affected documents are identified;
- metadata is current;
- the change log is recorded;
- provenance is preserved;
- conflicts are visible;
- references are updated;
- verification is recorded;
- the commit is known when repository work occurred;
- unresolved items are recorded;
- the next agent can resume from the resulting state.

## Principle

**Every document operation should leave the repository more understandable than it found it, without making the knowledge less complete.**


## Agent integration

This standard is mandatory for recovery/documentation agents.

Agents must use `docs/recovery/Agent.md` for operating behavior and `docs/recovery/History.md` for the repository-wide operation receipt. The agent must not treat a final chat response, branch, PR, or commit as a substitute for the durable document update.

For every substantive operation, the sequence is:

**DISCOVER → PRESERVE → CHANGE → VERIFY → LOG → REGISTER → HAND OFF**

The History ledger is append-only-style. Historical corrections receive a new operation ID rather than silently rewriting prior entries.
