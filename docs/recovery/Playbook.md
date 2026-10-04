# ViewTube Conversation Agent Recovery Playbook

## Purpose

This is the short, operational guide for any ChatGPT/conversation agent working on ViewTube recovery.

**Canonical state lives in GitHub, not in chat history.**

## Start here

Read, in this order:

1. `Recovery.md`
2. `Recovery.yaml`
3. `docs/recovery/Index.md`
4. The specific project/artifact files relevant to the conversation.

## Before you change anything

- Fetch the latest version of every file you intend to update.
- Capture its current blob SHA.
- Determine whether another agent has already contributed the same material.
- Preserve source wording when recovering a document.
- Do not silently resolve conflicts.

## Recover the conversation

Search the conversation for:

- finished documents;
- document-equivalent answers;
- specifications;
- UI/UX decisions;
- architecture;
- implementation details;
- code or patches;
- tests and verification;
- deployments;
- failures and debugging discoveries;
- approvals;
- rejected approaches;
- open questions;
- links to external systems;
- artifacts that exist only in the conversation.

Treat material findings as evidence with provenance.

## Create durable artifacts

If the conversation contains a material document or artifact, put it in GitHub.

Use the established project path when known.

Otherwise, keep the artifact flat under `docs/recovery/`. Use a short descriptive filename; use `Plan-`, `Audit-`, `Handoff-`, or `Source-` only when useful.

## Record the contribution

Add a work-log entry to `Recovery.md` and register important structured state in `Recovery.yaml`.

Use:

`REC-YYYYMMDD-<agent>-<sequence>`

Minimum narrative:

**WHAT WAS FOUND → WHERE IT CAME FROM → WHAT IT MEANS → WHAT IS VERIFIED → WHAT IS NOT → WHAT MUST HAPPEN NEXT**

## Status discipline

Never upgrade evidence without verification.

- VERIFIED — directly verified.
- REPORTED — someone stated it, but it is not independently verified.
- INFERRED — derived from evidence.
- PROPOSED — suggested, not implemented.
- IMPLEMENTED — implementation exists, but verification is incomplete.
- VERIFIED IMPLEMENTATION — implementation exists and has been verified.
- FAILED — attempted and failed.
- BLOCKED — cannot proceed because a dependency or permission is missing.
- SUPERSEDED — replaced by a newer authoritative version.
- UNKNOWN — insufficient evidence.

## Round 1

Work independently.

Preserve unique evidence, create durable artifacts, log findings, and leave conflicts intact.

Do **not** decide that another conversation's version is wrong merely because your conversation contains a different version.

## Round 2

Re-read the repository recovery corpus.

Then:

1. compare duplicates;
2. inspect actual implementation;
3. verify tests/builds/deployments where possible;
4. identify authoritative versions;
5. record conflicts and their evidence;
6. supersede stale artifacts explicitly;
7. update the consolidated state.

Conflict priority:

**current verified implementation > verified tests/deployments > current canonical docs > explicit approved decisions > recovery artifacts > plans > general discussion**

## Concurrency rule

Never write an old copy over a newer copy.

If the SHA you read no longer matches the repository:

1. stop;
2. fetch the current file;
3. reapply your contribution to the current version;
4. write the merged result;
5. verify the resulting file.

## Completion rule

A plan, audit, proposal, or discussion is not implementation completion.

For a tracked task to be marked complete:

**implemented → merged to `main` → verified**

## Handoff

If the work is too large for the current conversation, create a handoff using:

`docs/recovery/Handoff.md`

A future agent should be able to continue without reopening the original conversation.

## Final check

Before finishing:

- [ ] durable artifacts are in GitHub;
- [ ] filenames and paths are recorded;
- [ ] provenance is preserved;
- [ ] status is accurate;
- [ ] work-log entry exists;
- [ ] structured state is updated when needed;
- [ ] no stale write occurred;
- [ ] unresolved questions are recorded;
- [ ] links/commit IDs are recorded where available.
