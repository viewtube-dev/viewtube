# ViewTube Master System Rebuild Resource Plan

**Status:** PROPOSED / EXECUTION PLAN  
**Repository:** `viewtube-dev/viewtube`  
**Base:** `main`  
**Purpose:** Establish one controlled resource program for reconstructing and implementing the ViewTube Conversation OS, documentation governance, Vault/Asset Workbench, Quick Wins 100, and Account System without creating competing sources of truth.

## 1. Operating rule

This document is an orchestration plan, not a replacement for subsystem authorities.

Before creating any resource:

**SEARCH → UPDATE → EXTEND → COMBINE → CONSOLIDATE → MERGE → ADAPT → CREATE**

Use `main` as the first source of truth. Preserve provenance when recovering material from historical branches, conversations, recovery artifacts, or external repositories.

Never treat a plan, branch, PR, conversation response, or recovery note as proof of implementation.

Required status vocabulary:

- VERIFIED
- REPORTED
- INFERRED
- PROPOSED
- IMPLEMENTED
- VERIFIED IMPLEMENTATION
- FAILED
- BLOCKED
- SUPERSEDED
- UNKNOWN

## 2. Master resource set

| System | Canonical master resource | Primary purpose |
|---|---|---|
| Conversation OS | `docs/governance/CONVERSATION_OS.md` when/if present; otherwise a single canonical governance resource | Execution model, routing, context, handoffs, verification |
| Documentation Governance | one consolidated governance authority under `docs/governance/` | document lifecycle, ownership, routing, consolidation |
| Vault / Asset Workbench | `docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md` | complete asset/media workbench architecture and toolset |
| Quick Wins 100 | existing registry/plan if present; otherwise `docs/governance/QUICK_WINS_100_MASTER.md` | bounded implementation backlog and verification state |
| Account System | `docs/account/VIEWTUBE_ACCOUNT_SYSTEM_MASTER.md` | identity, auth, account/workspace/channel boundaries, recovery |
| Shared rebuild index | `docs/governance/MASTER_SYSTEM_REBUILD_RESOURCE_INDEX.md` | locate all master resources and their status |
| Shared dependency map | `docs/governance/MASTER_SYSTEM_REBUILD_DEPENDENCY_MAP.md` | show cross-system dependencies and implementation order |

If an existing canonical document is found, update it instead of creating the proposed path.

## 3. Conversation OS reconstruction

Reconcile current repository content and recovery artifacts before writing.

Recover and normalize:

- task routing and Lane 0/1/2 behavior;
- blast-radius escalation;
- context proportionality;
- main-first discovery;
- source-of-truth hierarchy;
- reuse-before-create;
- skill/plugin/tool discovery;
- GitHub prior-art discovery;
- token/research stop rules;
- verification/evidence requirements;
- handoff/resumption;
- completion gates;
- user-facing receipts;
- proactive improvement and opportunity/risk records.

Required supporting resources, only where not already canonical:

- lane/routing matrix;
- context-selection matrix;
- authority hierarchy;
- skill/tool selection matrix;
- handoff/receipt template;
- verification matrix.

**Do not create a second competing Conversation OS.**

## 4. Documentation governance reconstruction

First inventory `docs/`, root governance files, recovery artifacts, and any existing documentation rules.

Consolidate overlapping documentation authorities.

The master must define:

1. what belongs in `docs/`;
2. what belongs beside runtime code;
3. document ownership;
4. canonical-vs-derived-vs-historical classification;
5. update/extend/combine/consolidate/merge rules;
6. naming and shallow-folder rules;
7. lifecycle/status fields;
8. migration and deprecation rules;
9. duplicate/conflict handling;
10. evidence and verification expectations.

Runtime resources must not become accidental documentation dependencies.

## 5. Vault / Asset Workbench master

Build the master from verified current code plus recovery/history.

Required architecture:

`Asset source → ingestion → metadata → inspection → transformations → derivatives → collections → discovery → lineage/provenance → rights/usage → workflow/operations → Projects/ContentBuild`

Toolset coverage should include, where supported by evidence:

- image preview;
- video preview;
- audio preview;
- technical metadata / EXIF;
- rights and usage;
- image editing;
- crop;
- resize;
- format conversion;
- derivative generation;
- asset collections;
- search/discovery;
- asset inspection;
- lineage/provenance;
- workflow/operations;
- Projects integration;
- ContentBuild integration;
- lifecycle/state;
- import/export.

Every tool record should capture:

- canonical name;
- purpose;
- inputs/outputs;
- owning subsystem;
- dependencies;
- state model;
- permissions;
- destructive/consequential behavior;
- UI entry point;
- runtime implementation;
- tests/evidence;
- status;
- source/provenance.

The master must distinguish implemented tools from planned tools.

## 6. Quick Wins 100 master

Recover the existing 100-task program from repository/recovery sources before recreating it.

Each task record:

- ID;
- title;
- problem;
- evidence/source;
- affected files/system;
- owner;
- lane;
- dependency;
- proposed change;
- verification;
- status;
- branch;
- PR;
- commit;
- merge state;
- post-merge verification;
- superseded/replaced-by;
- notes.

Allowed status:

`planned → ready → in progress → blocked → implemented → verified → merged`

Also support:

`superseded | deferred | rejected`

Critical rule:

**audit ≠ implementation; plan ≠ completion; branch ≠ completion; PR ≠ merge; merge ≠ verification.**

Quick Wins must not become a duplicate project-management system if an existing tracker is canonical.

## 7. Account System master

Treat this as consequential/Lane 2 architecture work.

Reconcile:

- current account/auth code;
- recovery artifacts;
- existing ViewTube account-system documents;
- historical branches/PRs;
- the referenced `@Thinking` material when its contents can be retrieved or supplied.

Do not invent `@Thinking` content. Record it as an external/conversation source requiring reconciliation when unavailable.

Required architecture:

- identity;
- authentication;
- authorization;
- sessions;
- providers;
- creator/profile/channel;
- workspace boundaries;
- multi-channel relationships;
- account switching;
- recovery;
- secure persistence;
- deletion/disconnect;
- YouTube linkage;
- Brain identity/context boundaries;
- Vault identity/permissions;
- Projects identity/ownership;
- Analytics identity/evidence boundaries.

The master must clearly separate:

**identity → account → workspace → channel → project → asset → analytics/evidence → Brain context**

## 8. Shared reconstruction artifacts

Create/update only where an equivalent does not already exist:

### System inventory
One row per major system/tool family with canonical owner and status.

### Source map
For every important claim/resource:

- current main source;
- historical source;
- recovery source;
- conversation source;
- external source;
- authority classification.

### Dependency map
System-to-system dependencies, including runtime and documentation dependencies.

### Ownership map
Canonical owner for code, docs, resources, data contracts, UI contracts, and generated artifacts.

### Migration/consolidation matrix
Old path/resource → target canonical resource → action → verification → status.

### Verification matrix
Requirement → evidence → test/build/runtime/screenshot → result → date.

### Handoff/receipt record
What changed, what was verified, what remains open, and exact next step.

## 9. Reconstruction workflow

### Phase A — Discovery
Search `main` first. Inventory existing authorities and avoid duplicate creation.

### Phase B — Reconciliation
Compare current implementation against recovery artifacts, historical branches, PRs, and approved decisions.

### Phase C — Canonicalization
Select one authority per system and mark historical/derived resources.

### Phase D — Master resources
Write/update the master resource for each system.

### Phase E — Rebuild artifacts
Produce implementation matrices, dependency maps, migration plans, verification matrices, and tool inventories.

### Phase F — Implementation
Implement in small verified batches. Escalate to governed work when architecture, ownership, destructive migration, or consequential behavior changes.

### Phase G — Verification
Use the smallest sufficient evidence:
- tests/builds for non-visual behavior;
- screenshots/runtime evidence for UI changes;
- migration checks for moves;
- security/permission checks for account work.

### Phase H — Main reconciliation
Rebase/reconcile against current `main`, resolve conflicts, verify again, then merge through normal repository workflow.

### Phase I — Closure
Update master status, verification evidence, open work, and handoff.

## 10. Implementation order

1. Shared rebuild index
2. Shared dependency map
3. Conversation OS reconciliation
4. Documentation governance consolidation
5. Vault / Asset Workbench master
6. Quick Wins 100 master
7. Account System master
8. Shared source/ownership/migration/verification artifacts
9. Cross-master dependency reconciliation
10. Implementation batches
11. Final verification and closure

## 11. Current repository note

The current `viewtube-dev/viewtube` repository contains recovery-oriented material and Brain/AI system documentation. Some recovered documents reference an earlier repository identity. Those references are historical evidence, not proof of the current repository's canonical implementation.

The recovery corpus explicitly requires preservation of uncertainty and prohibits fabricated commits, branches, implementation status, tests, deployments, or architecture decisions. This plan follows that rule.

## 12. Completion gate

This program is complete only when:

- each master resource has one canonical owner;
- duplicates are consolidated or explicitly classified;
- dependencies are mapped;
- implementation status is evidence-backed;
- open work is represented in a canonical tracker;
- runtime/documentation boundaries are clear;
- account/security boundaries are documented;
- Vault tool coverage is explicit;
- Conversation OS governance is executable;
- Quick Wins have traceable verification;
- final changes are reconciled with `main`;
- handoff state can be resumed without relying on conversation memory alone.


## 13. Reconciliation checkpoint — 2026-10-04

This checkpoint records repository evidence found after the initial plan was created.

### Verified discovery results

- No authoritative **Quick Wins 100** registry or task matrix was surfaced by current `main` code search.
- No current branch was surfaced by branch-name searches for **quick**, **account**, or **thinking**.
- No current PR or commit search surfaced a separate Quick Wins implementation program; the only matching PR is this rebuild plan PR.
- No current **Account System** implementation was established by the repository search performed so far.
- No repository source containing **@Thinking** material was found. The existing master plan therefore correctly treats it as an external/conversation source requiring supplied or retrievable content rather than inventing it.
- No literal **Asset Workbench** implementation source was surfaced. Current evidence does establish Vault/Asset concepts in the Toolbox Component Library Plan and creator-workspace documentation, while the dedicated Vault master on this branch remains a reconstruction artifact rather than proof of runtime implementation.
- No literal **DOCUMENT_OUTPUT_ROUTING** file was surfaced by current repository search.
- Conversation OS references are present in Recovery, the Brain/AI report, and the Toolbox Component Library Plan, but a definitive current canonical `docs/governance/CONVERSATION_OS.md` was not surfaced.

### Consequence

The following remain **reconstruction/discovery states**, not implementation claims:

| System | Current evidence state | Next action |
|---|---|---|
| Conversation OS | REPORTED/RECONSTRUCTION | reconcile Recovery + current governance material into one canonical authority |
| Documentation Governance | RECONSTRUCTION | inventory current docs governance and consolidate overlaps |
| Vault / Asset Workbench | RECONSTRUCTION | inspect current runtime/UI code before claiming tools are implemented |
| Quick Wins 100 | UNKNOWN | recover exact 100-task source from history/approved conversation material |
| Account System | UNKNOWN | inspect runtime/auth boundaries and recover approved account architecture |
| @Thinking | EXTERNAL/UNAVAILABLE IN REPO | obtain or retrieve source before incorporating claims |

**Rule:** absence from search is not proof of absence from the repository. These findings mean only that the current search pass did not surface authoritative implementation/source material.

