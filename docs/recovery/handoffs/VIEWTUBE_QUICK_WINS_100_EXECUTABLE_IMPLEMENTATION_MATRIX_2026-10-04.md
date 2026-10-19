# ViewTube — 100-Task Executable Implementation Matrix

**Date:** 2026-10-04  
**Repository:** `viewtube-dev/viewtube`  
**Matrix provenance:** recovered from the 2026-10-02 ViewTube implementation matrix and converted into an executable task registry on 2026-10-04.  
**Authority status:** **RECOVERED / RECONCILIATION REQUIRED** — this is the executable recovery matrix, not yet the canonical implementation authority.

## Completion gate

A Quick Win is **COMPLETE** only when all five gates are satisfied:

**IMPLEMENTED → VERIFIED → PR → MERGED TO `main` → VERIFIED ON `main`**

Branch-only work, open PRs, audits, plans, proposals, investigations, or discussion do **not** count.

## Status rules

- **UNRECONCILED** — task is recovered, but its historical source/architecture has not yet been reconciled to canonical `main`.
- **READY** — task has a verified canonical implementation target and can be executed.
- **IN PROGRESS** — implementation work has started.
- **IMPLEMENTED** — code exists, but the full merge/verification gate is not complete.
- **VERIFIED IMPLEMENTATION** — merged to `main` and verified on `main`.
- **BLOCKED** — a concrete dependency or source/architecture blocker prevents execution.
- **SUPERSEDED** — task was replaced by an approved canonical implementation.

> Acceptance criteria and verification language below are execution-ready interpretations of the recovered task titles where the original row-level wording was not recoverable. They must be reconciled against the authoritative source artifact before implementation is counted.

## Matrix

| ID | Category | Executable task | Historical source | Size | Dependencies | Acceptance criteria | Verification | Status |
|---|---|---|---|---|---|---|---|---|
| QW-001 | Publish / recovery | Create `ApprovedPublishSnapshot` model | A06 | M | — | Snapshot type/model exists with required publish-approval fields and tests. | Unit/type tests pass; canonical main verification required. | UNRECONCILED |
| QW-002 | Publish / recovery | Implement snapshot creation | A06 | S | QW-001 | Approved state produces a deterministic snapshot. | Focused snapshot tests pass. | UNRECONCILED |
| QW-003 | Publish / recovery | Persist snapshot hash | A06 | S | QW-002 | Persisted snapshot has stable verifiable hash. | Hash persistence/round-trip test passes. | UNRECONCILED |
| QW-004 | Publish / recovery | Bind approved asset revisions | A06 | S | QW-002 | Snapshot records exact approved asset revisions. | Fixture verifies revision identity. | UNRECONCILED |
| QW-005 | Publish / recovery | Bind approved metadata | A06 | S | QW-002 | Snapshot records approved metadata used for publication. | Metadata snapshot test passes. | UNRECONCILED |
| QW-006 | Publish / recovery | Bind routing/schedule state | A06 | S | QW-002 | Snapshot records routing and scheduling decisions. | Routing/schedule fixture passes. | UNRECONCILED |
| QW-007 | Publish / recovery | Add publish receipt identity | A06 / publish flow | S | QW-003 | Successful publication produces a stable receipt identity. | Receipt identity regression test passes. | UNRECONCILED |
| QW-008 | Publish / recovery | Restore publish state after reload | Publish state | M | QW-007 | Reload reconstructs the persisted publish state. | Persistence/reload test passes. | UNRECONCILED |
| QW-009 | Publish / recovery | Implement independent step retry | Publish workflow | M | QW-008 | A failed publish step can retry without replaying completed steps. | Retry/isolation test passes. | UNRECONCILED |
| QW-010 | Publish / recovery | Add duplicate-upload guard | Publish workflow | S | QW-007 | Repeated publish attempt does not create duplicate upload. | Duplicate-attempt regression test passes. | UNRECONCILED |
| QW-011 | Publish / recovery | Add manual publish recovery | Publish workflow | M | QW-009,QW-010 | Operator can resume a recoverable publish. | Recovery-path integration test passes. | UNRECONCILED |
| QW-012 | Publish / recovery | Persist successful publish → ContentBuild | ContentBuild bridge | M | QW-011 | Successful publish records its ContentBuild linkage. | ContentBuild persistence test passes. | UNRECONCILED |
| QW-013 | Publish / recovery | Persist exact used asset/version | Publish evidence | S | QW-012 | Outcome records exact asset/version identities. | Outcome evidence test passes. | UNRECONCILED |
| QW-014 | Publish / recovery | Complete first publish outcome chain | Publish outcome chain | M | QW-012,QW-013 | First successful publish produces complete trace from approval through outcome. | End-to-end outcome fixture passes. | UNRECONCILED |
| QW-015 | Publish / recovery | Add publish recovery regression fixture | Publish regression | S | QW-014 | Regression fixture covers recovery and prevents recurrence. | Regression suite passes. | UNRECONCILED |
| QW-016 | Widget shell | WidgetShell interior radius | WidgetShell | S | — | Shell uses the canonical interior radius token/style. | Component test or runtime inspection passes. | UNRECONCILED |
| QW-017 | Widget shell | Widget header/body spacing | WidgetShell | S | QW-016 | Header/body spacing matches widget system. | Visual/runtime verification passes. | UNRECONCILED |
| QW-018 | Widget shell | Widget title baseline | WidgetShell | S | QW-017 | Title baseline aligns with canonical widget typography. | Visual/runtime verification passes. | UNRECONCILED |
| QW-019 | Widget shell | Widget action alignment | WidgetShell | S | QW-018 | Actions align consistently across widget headers. | Visual/runtime verification passes. | UNRECONCILED |
| QW-020 | Widget shell | Widget collapse affordance | WidgetShell | S | QW-019 | Collapse control is visible, usable, and stateful. | Interaction/accessibility verification passes. | UNRECONCILED |
| QW-021 | Context / editor publishing | Normalize Thumbnail Context Resolver | A05 | S | QW-018 | Resolver returns canonical thumbnail context shape. | Resolver unit tests pass. | UNRECONCILED |
| QW-022 | Context / editor publishing | Implement Video Director Context Resolver | A05 | S | QW-021 | Video Director context resolves to canonical shape. | Resolver unit tests pass. | UNRECONCILED |
| QW-023 | Context / editor publishing | Implement Editor Context Resolver | A05 | S | QW-022 | Editor context resolves required project/content state. | Resolver unit tests pass. | UNRECONCILED |
| QW-024 | Context / editor publishing | Implement Publisher Context Resolver | A05 | S | QW-023 | Publisher context resolves publication inputs. | Resolver unit tests pass. | UNRECONCILED |
| QW-025 | Context / editor publishing | Implement Community Context Resolver | A05 | S | QW-024 | Community context resolves required destination state. | Resolver unit tests pass. | UNRECONCILED |
| QW-026 | Context / editor publishing | Implement Editor canonical render creation | A15 | M | QW-023 | Editor creates canonical render artifact from resolved context. | Render creation tests pass. | UNRECONCILED |
| QW-027 | Context / editor publishing | Bind editor render to Publishing Package | A15 | S | QW-026 | Canonical render is represented in the publishing package. | Integration test passes. | UNRECONCILED |
| QW-028 | Widget / workflow contracts | Add widget→Toolbox promotion contract | C1 | M | QW-020 | Widget can promote an actionable state into Toolbox contract form. | Contract test passes. | UNRECONCILED |
| QW-029 | Widget / workflow contracts | Carry Project context | C1 | S | QW-028 | Promotion payload carries Project context. | Payload contract test passes. | UNRECONCILED |
| QW-030 | Widget / workflow contracts | Carry asset/package context | C1 | S | QW-029 | Promotion payload carries asset/package context. | Payload contract test passes. | UNRECONCILED |
| QW-031 | Widget / workflow contracts | Preserve widget loading/empty/error state | C1 | S | QW-028 | Promoted widget state preserves loading, empty, and error semantics. | State contract/runtime test passes. | UNRECONCILED |
| QW-032 | Capability / workflow / ranking | Add `requiredContext` capability metadata | C2 | S | — | Capability definitions expose required context. | Registry tests pass. | UNRECONCILED |
| QW-033 | Capability / workflow / ranking | Add mutation-class metadata | C2 | S | QW-032 | Capabilities declare mutation class consistently. | Registry validation tests pass. | UNRECONCILED |
| QW-034 | Capability / workflow / ranking | Add resumable destination metadata | C2 | S | QW-033 | Capabilities declare resumable destinations where applicable. | Registry validation tests pass. | UNRECONCILED |
| QW-035 | Capability / workflow / ranking | Bridge WidgetRegistry → capability registry | C2-C3 | M | QW-032,QW-033,QW-034 | Widget actions resolve to canonical capability definitions. | Registry integration test passes. | UNRECONCILED |
| QW-036 | Capability / workflow / ranking | Add stable pilot operation identity | C4 | S | QW-035 | Operations receive stable identities across lifecycle events. | Identity regression test passes. | UNRECONCILED |
| QW-037 | Capability / workflow / ranking | Validate workflow recipe tool IDs | C4 | S | QW-036 | Unknown tool IDs are rejected before execution. | Validation tests pass. | UNRECONCILED |
| QW-038 | Capability / workflow / ranking | Validate workflow payload transitions | C4 | M | QW-037 | Invalid workflow payload transitions are rejected. | Transition validation tests pass. | UNRECONCILED |
| QW-039 | Capability / workflow / ranking | Validate external-write approval declarations | C4 | S | QW-038 | External writes require declared approval semantics. | Approval validation tests pass. | UNRECONCILED |
| QW-040 | Capability / workflow / ranking | Connect WorkflowChainBuilder to ActionPackets | C5 | M | QW-039 | Workflow chain emits executable ActionPackets with required identity/context. | Integration tests pass. | UNRECONCILED |
| QW-041 | Capability / workflow / ranking | Display operation identity | C6 | S | QW-040 | UI exposes operation identity where workflow evidence is shown. | Runtime/UI verification passes. | UNRECONCILED |
| QW-042 | Capability / workflow / ranking | Display artifact identity | C6 | S | QW-041 | UI exposes artifact identity. | Runtime/UI verification passes. | UNRECONCILED |
| QW-043 | Capability / workflow / ranking | Display evidence identity | C6 | S | QW-042 | UI exposes evidence identity. | Runtime/UI verification passes. | UNRECONCILED |
| QW-044 | Capability / workflow / ranking | Display approval state | C6 | S | QW-043 | UI exposes current approval state accurately. | Runtime/UI verification passes. | UNRECONCILED |
| QW-045 | Capability / workflow / ranking | Add Project context to target ranking | C7 | M | QW-035 | Project context affects target ranking deterministically. | Ranking tests pass. | UNRECONCILED |
| QW-046 | Capability / workflow / ranking | Add payload compatibility ranking | C7 | M | QW-045 | Payload compatibility influences ranking correctly. | Ranking tests pass. | UNRECONCILED |
| QW-047 | Capability / workflow / ranking | Add required-context ranking | C7 | M | QW-046 | Required context influences ranking correctly. | Ranking tests pass. | UNRECONCILED |
| QW-048 | Capability / workflow / ranking | Connect preference signal to evaluation | B09 | M | QW-047 | Preference signals reach evaluation without changing unrelated inputs. | Evaluation tests pass. | UNRECONCILED |
| QW-049 | Capability / workflow / ranking | Implement preference retention/decay | B09 | M | QW-048 | Preference signal has bounded retention/decay behavior. | Time/decay tests pass. | UNRECONCILED |
| QW-050 | Capability / workflow / ranking | Add Publisher outcome writer | B09 | M | QW-049 | Publisher outcomes are written in the canonical outcome format. | Writer integration test passes. | UNRECONCILED |
| QW-051 | Vault / Projects / Analytics | Vault search focus | Vault | S | — | Vault search receives keyboard focus predictably. | Keyboard/runtime verification passes. | UNRECONCILED |
| QW-052 | Vault / Projects / Analytics | Quick Look keyboard access | Vault | S | QW-051 | Quick Look opens via keyboard interaction. | Keyboard interaction test passes. | UNRECONCILED |
| QW-053 | Vault / Projects / Analytics | Asset-card selection | Vault | S | QW-052 | Asset-card selection has clear selected state. | Runtime verification passes. | UNRECONCILED |
| QW-054 | Vault / Projects / Analytics | Asset-card hover | Vault | S | QW-053 | Hover affordance is consistent and nonessential to keyboard use. | Visual/accessibility verification passes. | UNRECONCILED |
| QW-055 | Vault / Projects / Analytics | Multi-selection feedback | Vault | S | QW-053 | Multiple selected assets have unambiguous feedback. | Interaction verification passes. | UNRECONCILED |
| QW-056 | Vault / Projects / Analytics | Metadata truncation | Vault | S | QW-053 | Long metadata truncates without breaking card layout. | Responsive/runtime verification passes. | UNRECONCILED |
| QW-057 | Vault / Projects / Analytics | Asset-type icons | Vault | S | QW-053 | Asset types have consistent visual identifiers. | Visual verification passes. | UNRECONCILED |
| QW-058 | Vault / Projects / Analytics | Missing-thumbnail fallback | Vault | S | QW-053 | Missing thumbnails render a stable fallback. | Component/runtime test passes. | UNRECONCILED |
| QW-059 | Vault / Projects / Analytics | Preview loading | Vault | S | QW-058 | Preview loading has a defined non-jarring state. | Runtime verification passes. | UNRECONCILED |
| QW-060 | Vault / Projects / Analytics | Responsive density | Vault | M | QW-059 | Vault density remains usable across supported widths. | Responsive runtime verification passes. | UNRECONCILED |
| QW-061 | Vault / Projects / Analytics | Channel/Project toggle | A04/A05 | S | QW-060 | Toggle switches between Channel and Project scopes correctly. | Interaction/state tests pass. | UNRECONCILED |
| QW-062 | Vault / Projects / Analytics | Projects tab active state | A04/A05 | S | QW-061 | Active Projects tab is visually and semantically exposed. | Runtime/accessibility verification passes. | UNRECONCILED |
| QW-063 | Vault / Projects / Analytics | Selector keyboard behavior | A04/A05 | S | QW-062 | Project/channel selector is fully keyboard operable. | Keyboard verification passes. | UNRECONCILED |
| QW-064 | Vault / Projects / Analytics | Project empty state | A04/A05 | S | QW-063 | No-project state renders useful empty-state content. | Runtime verification passes. | UNRECONCILED |
| QW-065 | Vault / Projects / Analytics | Channel empty state | A04/A05 | S | QW-064 | No-channel state renders useful empty-state content. | Runtime verification passes. | UNRECONCILED |
| QW-066 | Vault / Projects / Analytics | Project-card spacing | A04/A05 | S | QW-065 | Project cards use canonical spacing. | Visual verification passes. | UNRECONCILED |
| QW-067 | Vault / Projects / Analytics | Project-card action alignment | A04/A05 | S | QW-066 | Project card actions align consistently. | Visual/runtime verification passes. | UNRECONCILED |
| QW-068 | Vault / Projects / Analytics | Channel-card action alignment | A04/A05 | S | QW-067 | Channel card actions align consistently. | Visual/runtime verification passes. | UNRECONCILED |
| QW-069 | Vault / Projects / Analytics | Projects loading state | A04/A05 | S | QW-068 | Projects loading state is explicit and stable. | Runtime verification passes. | UNRECONCILED |
| QW-070 | Vault / Projects / Analytics | Projects mobile layout | A15 / ToolboxHeaderToggle | M | QW-069 | Projects layout remains usable at mobile widths. | Mobile runtime verification passes. | UNRECONCILED |
| QW-071 | Brain / Project intelligence | Propagate `projectId` into Brain context | C12 | S | — | Brain requests retain project identity. | Context propagation tests pass. | UNRECONCILED |
| QW-072 | Brain / Project intelligence | Propagate `contentBuildId` into Brain context | C12 | S | QW-071 | Brain requests retain ContentBuild identity. | Context propagation tests pass. | UNRECONCILED |
| QW-073 | Brain / Project intelligence | Enforce bounded Project context | C12 | M | QW-072 | Brain context is scoped to bounded project data. | Context boundary tests pass. | UNRECONCILED |
| QW-074 | Brain / Project intelligence | Implement Opportunity provenance | C20 | S | QW-073 | Opportunity records its provenance. | Opportunity tests pass. | UNRECONCILED |
| QW-075 | Brain / Project intelligence | Implement Opportunity freshness | C20 | S | QW-074 | Opportunity exposes freshness metadata. | Freshness tests pass. | UNRECONCILED |
| QW-076 | Brain / Project intelligence | Implement Opportunity confidence | C20 | S | QW-075 | Opportunity exposes confidence with defined semantics. | Confidence tests pass. | UNRECONCILED |
| QW-077 | Brain / Project intelligence | Implement Opportunity scope | C20 | S | QW-076 | Opportunity records scope and respects it. | Scope tests pass. | UNRECONCILED |
| QW-078 | Brain / Project intelligence | Connect Opportunity → Brain | C20 | M | QW-077 | Brain can consume Opportunity records with provenance. | Integration test passes. | UNRECONCILED |
| QW-079 | Brain / Project intelligence | Connect Opportunity → Algorithm | C20 | M | QW-078 | Algorithm can consume Opportunity records without losing provenance. | Integration test passes. | UNRECONCILED |
| QW-080 | Brain / Project intelligence | Implement Daily Oracle Project handoff | C20 | M | QW-079 | Daily Oracle hands project-scoped opportunities to downstream systems. | Handoff integration test passes. | UNRECONCILED |
| QW-081 | Prompt / Brain | Complete prompt-family registry | C21/C31 | M | — | All supported prompt families have registry identities. | Registry tests pass. | UNRECONCILED |
| QW-082 | Prompt / Brain | Add prompt version identity | C21/C31 | S | QW-081 | Prompt executions retain explicit version identity. | Version identity tests pass. | UNRECONCILED |
| QW-083 | Prompt / Brain | Replace unsafe legacy prompt default | C21/C31 | S | QW-082 | Legacy unsafe default is no longer selected by normal execution. | Configuration/regression tests pass. | UNRECONCILED |
| QW-084 | Prompt / Brain | Add prompt regression fixtures | C31 | S | QW-083 | Fixtures cover known prompt behavior and prevent regression. | Prompt regression suite passes. | UNRECONCILED |
| QW-085 | Prompt / Brain | Add prompt provenance to generation | C21/C31 | M | QW-082,QW-084 | Generation records the prompt identity/version used. | Generation provenance test passes. | UNRECONCILED |
| QW-086 | Prompt / Brain | Add model/provider provenance | C21/C31 | S | QW-085 | Generation records actual served model/provider identity. | Generation trace regression test passes. | UNRECONCILED |
| QW-087 | Prompt / Brain | Add prompt evaluation result | C31 | M | QW-086 | Generation can associate an evaluation result with prompt/version identity. | Evaluation integration test passes. | UNRECONCILED |
| QW-088 | Editor | Remotion preview/final parity fixture | D16/D17 | M | — | Fixture detects preview/final composition mismatches. | Parity fixture passes. | UNRECONCILED |
| QW-089 | Editor | Deterministic render parity test | D16/D17 | M | QW-088 | Equivalent render inputs produce deterministic expected output metadata. | Render parity tests pass. | UNRECONCILED |
| QW-090 | Editor | Portrait editor state | D16/D17 | S | QW-089 | Portrait editor layout/state is implemented and stable. | Runtime/screenshot verification passes. | UNRECONCILED |
| QW-091 | Editor | Landscape editor state | D16/D17 | S | QW-090 | Landscape editor layout/state is implemented and stable. | Runtime/screenshot verification passes. | UNRECONCILED |
| QW-092 | Editor | Narrow/tablet editor state | D16/D17 | M | QW-091 | Narrow/tablet state remains usable and complete. | Runtime/screenshot verification passes. | UNRECONCILED |
| QW-093 | Editor | Desktop editor state | D16/D17 | S | QW-092 | Desktop state is complete and stable. | Runtime/screenshot verification passes. | UNRECONCILED |
| QW-094 | Production widgets | Daily Command widget integration | D19 | M | QW-080,QW-093 | Daily Command widget consumes the canonical project/intelligence/editor context. | Integration + runtime verification passes. | UNRECONCILED |
| QW-095 | Production widgets | Packaging widget integration | D19 | M | QW-094 | Packaging widget uses canonical packaging context and workflow contracts. | Integration + runtime verification passes. | UNRECONCILED |
| QW-096 | Production widgets | Analytics Diagnosis widget integration | D19 | M | QW-095 | Analytics Diagnosis widget consumes canonical analytics context and produces actionable state. | Integration + runtime verification passes. | UNRECONCILED |
| QW-097 | Production widgets | Retention widget integration | D19 | M | QW-096 | Retention widget consumes retention signals and preserves context. | Integration + runtime verification passes. | UNRECONCILED |
| QW-098 | Production widgets | Audience Inbox widget integration | D19 | M | QW-097 | Audience Inbox widget integrates audience signals and actionable state. | Integration + runtime verification passes. | UNRECONCILED |
| QW-099 | Production widgets | Publishing Gate widget integration | D19 | M | QW-098 | Publishing Gate widget integrates approval/publish state and workflow contracts. | Integration + runtime verification passes. | UNRECONCILED |
| QW-100 | Production widgets | Script/Traffic/Opportunity/Production widget cohort integration | D19 | M | QW-099 | Cohort widgets share canonical context, contracts, and production state without duplicated orchestration. | Cohort integration + runtime verification passes. | UNRECONCILED |

## Execution order

### Batch 1 — Publish / recovery
**QW-001 → QW-015**

Establish the publish snapshot, receipt, recovery, duplicate protection, ContentBuild linkage, and regression coverage before downstream publishing work.

### Batch 2 — Widget shell + context
**QW-016 → QW-031**

Establish the widget visual contract, context resolvers, editor publishing bridge, and widget→Toolbox contract.

### Batch 3 — Capability / workflow
**QW-032 → QW-050**

Establish capability metadata, workflow validation, ActionPackets, evidence/approval identity, ranking, preferences, and Publisher outcomes.

### Batch 4 — Vault / Projects
**QW-051 → QW-070**

Complete the recovered Vault and Projects interaction slices with keyboard, responsive, loading, empty, and selection behavior.

### Batch 5 — Brain / intelligence
**QW-071 → QW-080**

Propagate project/build context and establish Opportunity provenance, freshness, confidence, scope, and downstream handoff.

### Batch 6 — Prompt / generation provenance
**QW-081 → QW-087**

Establish prompt identity/versioning, safe defaults, regression fixtures, prompt provenance, model/provider provenance, and evaluation.

### Batch 7 — Editor
**QW-088 → QW-093**

Establish render parity and the recovered responsive editor states.

### Batch 8 — Production widgets
**QW-094 → QW-100**

Integrate the production widget cohort after the underlying context, workflow, intelligence, and editor contracts are available.

## First five execution rule

The next implementation batch is **QW-001–QW-005**, but they must not be coded against the historical A06 source blindly. Before implementation, each task must be mapped to an actual canonical `viewtube-dev/viewtube/main` path or explicitly re-scoped as a canonical equivalent.

## Reconciliation checklist

For every task before execution:

1. Locate the historical source artifact.
2. Locate the canonical `main` implementation target.
3. Confirm the task is not already implemented under a different name.
4. Confirm the dependency chain still applies.
5. Confirm acceptance criteria against current architecture.
6. Implement with focused tests.
7. Verify the appropriate runtime/UI/integration behavior.
8. Open PR.
9. Merge to `main`.
10. Verify the merged result on `main`.
11. Only then mark **VERIFIED IMPLEMENTATION** and increment the completed count.

## Current count

**Recovered tasks:** 100 / 100  
**Canonical tasks verified complete:** 0 / 100  
**Canonical tasks ready for implementation:** 0 / 100 pending source reconciliation  
**Current execution batch:** QW-001–QW-005, pending reconciliation

## Provenance

The task IDs/titles and recovered source mappings come from the recovered conversation matrix. The acceptance/verification wording is an execution normalization where exact row-level wording was unavailable. No task is being represented as implemented or verified on canonical `main` by this document alone.
