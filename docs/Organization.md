# ViewTube Repository Organization & Consolidation Plan

**Status:** PROPOSED — ROUND 2 CONSOLIDATION PLAN
**Repository:** viewtube-dev/viewtube
**Branch inspected:** main
**Goal:** reduce navigation complexity, merge overlapping documentation, preserve every material piece of information, and establish one clear authority per subject.

## 1. Core rule

**Consolidate knowledge, not evidence.**

A merge may remove duplicate presentation, but it must not remove unique facts, decisions, implementation details, failures, provenance, or historical evidence.

Migration order:

INVENTORY → CLASSIFY → MAP → MERGE → LINK → VERIFY → REMOVE/RETAIN

No source file is deleted until its information has a verified destination and its references have been handled.

## 2. Current structure finding

The current repository has several documentation layers that overlap:

- short canonical subject documents directly under docs/;
- long governance resources under docs/governance/;
- long product resources under docs/product/;
- a separate Vault master under docs/vault/;
- a growing flat recovery corpus under docs/recovery/;
- a nested docs/recovery/handoffs/ collection;
- the root-level 'Toolbox Component Library Plan';
- runtime resources under src/features/resource-library/resources/.

The runtime resource-library hierarchy is a code/feature concern and should **not** be flattened merely for documentation aesthetics.

The primary organizational problem is therefore documentation duplication and competing authority, not the runtime feature hierarchy.

## 3. Target structure

The target is intentionally shallow:

```
Recovery.md
Recovery.yaml
README.md

docs/
  Index.md
  Organization.md
  Architecture.md
  Account.md
  AI.md
  Analytics.md
  Context.md
  Conversation-OS.md
  Deployment.md
  Editor.md
  Projects.md
  Quick-Wins.md
  Resource-Library.md
  Security.md
  Settings.md
  Studio-Hub.md
  Testing.md
  Toolbox.md
  Tools.md
  UI.md
  Vault.md
  Widgets.md
  YouTube.md
  recovery/
    Index.md
    Agent.md
    Playbook.md
    Knowledge.md
    Findings.md
    Handoff.md
    Sources.md
    History.md
    [short topical recovery records]

src/
  features/
    resource-library/
      resources/
```

### Folder policy

Keep only these documentation levels:

- docs/ — current canonical project knowledge.
- docs/recovery/ — recovery evidence, historical records, agent operations, and reconciliation material.
- Runtime folders remain organized by actual feature/code ownership.

Do **not** create routine governance/, product/, vault/, plans/, audits/, or handoffs/ subfolders inside documentation unless a future evidence-backed volume genuinely requires one.

## 4. Canonical authority model

Each subject gets one primary current document.

| Subject | Canonical target | Consolidate from |
|---|---|---|
| Architecture | docs/Architecture.md | architecture portions of rebuild plans, Brain/workspace/tool docs |
| Account | docs/Account.md | account recovery + future account master |
| AI / Brain | docs/AI.md | Brain/AI report + Brain-related recovery |
| Context | docs/Context.md | context sections across workspace, Brain, quick wins |
| Conversation OS | docs/Conversation-OS.md | docs/governance/CONVERSATION_OS_REBUILD_MASTER.md + governance material |
| Documentation organization | docs/Organization.md | rebuild resource plan/index/dependency map + documentation governance material |
| Toolbox | docs/Toolbox.md | root Toolbox Component Library Plan + Toolbox recovery/source material |
| UI system | docs/UI.md | UI/design/token/reference-library material |
| Widgets | docs/Widgets.md | widget-specific material from Toolbox/UI/workspace sources |
| Tools catalog | docs/Tools.md | Creator Workspaces Master Tool Context + tool inventories |
| Studio Hub | docs/Studio-Hub.md | all three Studio Hub product/architecture documents |
| Vault | docs/Vault.md | docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md + Vault recovery |
| Analytics | docs/Analytics.md | Analytics recovery + workspace tool context |
| Projects | docs/Projects.md | Projects recovery + workspace tool context |
| Editor | docs/Editor.md | Editor/workspace/recovery material |
| Resource Library | docs/Resource-Library.md | runtime/resource-library documentation + source maps |
| YouTube | docs/YouTube.md | YouTube/account/analytics recovery |
| Deployment | docs/Deployment.md | deployment and Render recovery |
| Testing / verification | docs/Testing.md | Recovery verification rules + test evidence |
| Security / reliability | docs/Security.md | Account/deployment/Brain/Vault security findings |
| Settings | docs/Settings.md | Settings recovery and any verified durable specification |
| Quick Wins | docs/Quick-Wins.md | Quick Wins recovery matrix and execution records |

## 5. Major merge operations

### A. Studio Hub

Merge, in full:

- docs/product/STUDIO_HUB_TOOL_IDEAS.md
- docs/product/VIEWTUBE_STUDIO_HUB_TEN_TOOL_ARCHITECTURE.md
- docs/product/VIEWTUBE_STUDIO_HUB_MASTER_TOOL_ARCHITECTURE.md

Destination:

docs/Studio-Hub.md

Important: preserve conflicting tool naming as explicit reconciliation history until a decision resolves it. Do not silently choose one naming set.

### B. Creator Workspaces / tools

Merge unique material from:

- docs/product/VIEWTUBE_CREATOR_WORKSPACES_MASTER_TOOL_CONTEXT.md
- Analytics/Projects/Vault/Editor/Resource Library tool recovery records
- Toolbox and widget inventories

Destination:

docs/Tools.md

The individual subject documents remain the authorities for their systems. Tools.md becomes the navigation/catalog layer, not a second implementation authority.

### C. Governance / Conversation OS

Merge:

- docs/governance/CONVERSATION_OS_REBUILD_MASTER.md
- governance sections of the master rebuild plan
- applicable Recovery operating rules
- documentation-routing decisions

Destination:

docs/Conversation-OS.md

Keep the rebuild master as historical/source material until all unique information is transferred and references are updated.

### D. Rebuild orchestration

Merge:

- docs/governance/MASTER_SYSTEM_REBUILD_RESOURCE_PLAN.md
- docs/governance/MASTER_SYSTEM_REBUILD_RESOURCE_INDEX.md
- docs/governance/MASTER_SYSTEM_REBUILD_DEPENDENCY_MAP.md

Destination:

docs/Organization.md

This document becomes the orchestration and repository-organization authority rather than allowing three overlapping planning documents to define the same program.

### E. Vault

Merge:

- docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md
- Vault recovery records
- Vault-related tool/workspace material

Destination:

docs/Vault.md

Preserve the distinction between implemented, recovered, planned, and unknown capabilities.

### F. Toolbox / UI / widgets

Merge unique content from:

- root Toolbox Component Library Plan
- Toolbox companion/recovery source
- UI recovery and design-system material
- widget-system portions of Creator Workspaces

Destinations:

- docs/Toolbox.md
- docs/UI.md
- docs/Widgets.md

Do not duplicate the same widget rules in all three. Cross-reference instead.

### G. Recovery handoffs

Flatten:

docs/recovery/handoffs/*

into:

docs/recovery/*

using short topical names such as:

- Account-Recovery.md
- Workspace-Recovery.md
- Vault-Recovery.md
- Deployment-Recovery.md
- Quick-Wins-Recovery.md
- Toolbox-Recovery.md

The existing detailed handoffs remain evidence until their content has been merged and verified.

### H. Recovery meta-documents

Consolidate overlapping indexes/catalogs into:

- docs/recovery/Index.md — navigation;
- docs/recovery/Sources.md — source/catalog/provenance map;
- docs/recovery/History.md — historical recovery chronology and superseded records.

Keep Agent.md, Playbook.md, Knowledge.md, Findings.md, and Handoff.md as separate operational documents because they have different jobs.

## 6. What should NOT be merged

Do not merge documents merely because they mention the same subject.

Keep separate when the role is materially different:

- canonical current knowledge vs historical evidence;
- human-readable state vs machine-readable state;
- agent instructions vs project architecture;
- verification evidence vs architecture claims;
- runtime code vs documentation;
- source artifacts vs derived summaries.

For example, Recovery.yaml must remain separate from Recovery.md, and runtime resource files must remain in the runtime feature boundary.

## 7. Information-preservation protocol

Before every merge:

1. Capture the source SHA.
2. Read the complete source.
3. Extract every unique fact, decision, requirement, example, identifier, failure, test result, open question, and provenance marker.
4. Map each unique item to the destination section.
5. Copy the information before simplifying the wording.
6. Preserve conflicts explicitly.
7. Add the old path as provenance where useful.
8. Update inbound/outbound links.
9. Verify the destination contains all unique information.
10. Only then mark the source as superseded or remove it.

A merge is not successful merely because the destination document is shorter or easier to read.

## 8. Status and authority rules

Use the existing ViewTube status vocabulary:

VERIFIED, REPORTED, INFERRED, PROPOSED, IMPLEMENTED, VERIFIED IMPLEMENTATION, FAILED, BLOCKED, SUPERSEDED, UNKNOWN.

Use this authority hierarchy:

**current verified implementation → verified tests/deployments → current canonical docs → approved decisions → recovery artifacts → plans → general discussion**

A consolidation must never promote a lower-authority statement over higher-authority evidence.

## 9. Migration phases

### Phase 1 — Freeze and inventory

Create a complete path inventory with:

SOURCE PATH | TYPE | TOPIC | AUTHORITY | STATUS | DESTINATION | ACTION | UNIQUE CONTENT | REFERENCES

No deletions.

### Phase 2 — Build canonical destinations

Finish the short documents and create only the genuinely missing ones, especially:

docs/Index.md, docs/Organization.md, docs/Tools.md, docs/Widgets.md, and docs/Settings.md where evidence supports them.

### Phase 3 — Merge content

Perform topic-by-topic full-content consolidation. Preserve all unique information and provenance.

### Phase 4 — Link normalization

Replace references to obsolete paths with canonical paths. Search the entire repository for old names before removal.

### Phase 5 — Verification

Check:

- no broken Markdown links;
- no duplicate canonical authorities;
- no lost sections/facts;
- no status inflation;
- no missing source provenance;
- no orphaned documents;
- no runtime imports affected by documentation moves;
- no recovery evidence silently removed.

### Phase 6 — Safe cleanup

Only after verification:

- delete or convert superseded duplicates to minimal pointers;
- flatten docs/recovery/handoffs/;
- remove docs/governance/, docs/product/, and docs/vault/ when empty;
- move the root Toolbox plan into its canonical home;
- retain the root Recovery compatibility pointer unless a deliberate compatibility change is approved.

### Phase 7 — Final navigation pass

Make docs/Index.md the single human navigation map and link every canonical subject exactly once.

## 10. Naming standard

Prefer:

- Architecture.md
- Account.md
- Conversation-OS.md
- Studio-Hub.md
- Quick-Wins.md
- Toolbox.md
- Tools.md
- Widgets.md
- Resource-Library.md

Avoid:

- repeated VIEWTUBE_ prefixes;
- dates in canonical filenames unless the date is the actual identity of the artifact;
- long all-caps names;
- redundant words such as MASTER / SYSTEM / DOCUMENT / REPORT when the subject name already explains the file;
- duplicate files that define the same authority.

Dates, old filenames, source identifiers, and historical status belong inside the document metadata.

## 11. Definition of done

The organization migration is complete only when:

- one obvious canonical document exists for every major subject;
- navigation from README.md → docs/Index.md → subject document is clear;
- Recovery.md → docs/recovery/Index.md is the clear recovery path;
- similar documents have been consolidated;
- unique information from every retired source is preserved;
- historical provenance remains traceable;
- old links are resolved;
- nested documentation folders are reduced to the single recovery boundary;
- runtime code structure is unchanged unless separately audited and intentionally migrated;
- no implementation status was accidentally upgraded during documentation consolidation;
- the repository can be understood without relying on conversation memory.

## 12. Safe operating principle

**Merge aggressively at the knowledge level; migrate conservatively at the filesystem level.**

The desired end state is fewer documents, fewer folders, fewer competing authorities, better cross-linking, and more preserved information — not simply fewer files.
