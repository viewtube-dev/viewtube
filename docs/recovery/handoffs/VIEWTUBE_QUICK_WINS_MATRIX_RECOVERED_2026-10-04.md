# ViewTube Quick Wins 100 — Recovered Conversation Matrix Snapshot

**Date:** 2026-10-04  
**Canonical repository:** `viewtube-dev/viewtube`  
**Artifact status:** REPORTED — conversation-derived recovery evidence; NOT canonical task authority  
**Source:** Prior ViewTube conversation material recovered through conversation context.  
**Purpose:** Preserve the exact task sequence recovered from the 2026-10-02 executable matrix without inventing missing fields or promoting it to canonical status.

## Governing completion rule

A task counts only after **IMPLEMENTED → VERIFIED → PR → MERGED TO main → VERIFIED ON main**. Audits, plans, proposals, investigations, branch-only work, open PRs, or discussion do not count.

## Recovered task titles

### QW-001–015 — Publish / recovery
- QW-001 Create `ApprovedPublishSnapshot` model
- QW-002 Implement snapshot creation
- QW-003 Persist snapshot hash
- QW-004 Bind approved asset revisions
- QW-005 Bind approved metadata
- QW-006 Bind routing/schedule state
- QW-007 Add publish receipt identity
- QW-008 Restore publish state after reload
- QW-009 Implement independent step retry
- QW-010 Add duplicate-upload guard
- QW-011 Add manual publish recovery
- QW-012 Persist successful publish → ContentBuild
- QW-013 Persist exact used asset/version
- QW-014 Complete first publish outcome chain
- QW-015 Add publish recovery regression fixture

**Recovered source mapping:** A06 for QW-001–006; remaining source/field details are preserved in the prior matrix but are not re-invented here.

### QW-016–020 — Widget shell
- QW-016 WidgetShell interior radius
- QW-017 Widget header/body spacing
- QW-018 Widget title baseline
- QW-019 Widget action alignment
- QW-020 Widget collapse affordance

### QW-021–027 — Context / editor publishing
- QW-021 Normalize Thumbnail Context Resolver
- QW-022 Implement Video Director Context Resolver
- QW-023 Implement Editor Context Resolver
- QW-024 Implement Publisher Context Resolver
- QW-025 Implement Community Context Resolver
- QW-026 Implement Editor canonical render creation
- QW-027 Bind editor render to Publishing Package

**Recovered details:** QW-021–025 were mapped to A05/context mapping with focused unit tests, dependency QW-018, size S. QW-026 was mapped to A15 and depends on QW-023, size M. QW-027 depends on QW-026, size S.

### QW-028–031 — Widget / workflow contracts
- QW-028 Add widget→Toolbox promotion contract
- QW-029 Carry Project context
- QW-030 Carry asset/package context
- QW-031 Preserve widget loading/empty/error state

**Recovered source mapping:** C1. Contract/integration implementation with focused verification.

### QW-032–050 — Capability / workflow / ranking
- QW-032 Add `requiredContext` capability metadata
- QW-033 Add mutation-class metadata
- QW-034 Add resumable destination metadata
- QW-035 Bridge WidgetRegistry → capability registry
- QW-036 Add stable pilot operation identity
- QW-037 Validate workflow recipe tool IDs
- QW-038 Validate workflow payload transitions
- QW-039 Validate external-write approval declarations
- QW-040 Connect WorkflowChainBuilder to ActionPackets
- QW-041 Display operation identity
- QW-042 Display artifact identity
- QW-043 Display evidence identity
- QW-044 Display approval state
- QW-045 Add Project context to target ranking
- QW-046 Add payload compatibility ranking
- QW-047 Add required-context ranking
- QW-048 Connect preference signal to evaluation
- QW-049 Implement preference retention/decay
- QW-050 Add Publisher outcome writer

**Recovered source mapping:** C2–C7 and B09. This is the implementation matrix, not the separate audit-only numbering encountered elsewhere in recovery.

### QW-051–070 — Vault / Projects / Analytics
- QW-051 Vault search focus
- QW-052 Quick Look keyboard access
- QW-053 Asset-card selection
- QW-054 Asset-card hover
- QW-055 Multi-selection feedback
- QW-056 Metadata truncation
- QW-057 Asset-type icons
- QW-058 Missing-thumbnail fallback
- QW-059 Preview loading
- QW-060 Responsive density
- QW-061 Channel/Project toggle
- QW-062 Projects tab active state
- QW-063 Selector keyboard behavior
- QW-064 Project empty state
- QW-065 Channel empty state
- QW-066 Project-card spacing
- QW-067 Project-card action alignment
- QW-068 Channel-card action alignment
- QW-069 Projects loading state
- QW-070 Projects mobile layout

**Recovered source mapping:** existing Vault capability map; A04/A05/A15; ToolboxHeaderToggle. These are implementation tasks, not the separate audit-only list.

### QW-071–080 — Brain / Project intelligence
- QW-071 Propagate `projectId` into Brain context
- QW-072 Propagate `contentBuildId` into Brain context
- QW-073 Enforce bounded Project context
- QW-074 Implement Opportunity provenance
- QW-075 Implement Opportunity freshness
- QW-076 Implement Opportunity confidence
- QW-077 Implement Opportunity scope
- QW-078 Connect Opportunity → Brain
- QW-079 Connect Opportunity → Algorithm
- QW-080 Implement Daily Oracle Project handoff

**Recovered source mapping:** C12/C20.

### QW-081–087 — Prompt / Brain
- QW-081 Complete prompt-family registry
- QW-082 Add prompt version identity
- QW-083 Replace unsafe legacy prompt default
- QW-084 Add prompt regression fixtures
- QW-085 Add prompt provenance to generation
- QW-086 Add model/provider provenance
- QW-087 Add prompt evaluation result

**Recovered source mapping:** QW-081–083 and QW-085–086 C21/C31; QW-084 C31; QW-087 C31.

### QW-088–093 — Editor
- QW-088 Remotion preview/final parity fixture
- QW-089 Deterministic render parity test
- QW-090 Portrait editor state
- QW-091 Landscape editor state
- QW-092 Narrow/tablet editor state
- QW-093 Desktop editor state

**Recovered source mapping:** D16/D17. QW-091–093 were described as runtime/screenshot-verified editor-state completions; recovered sizes: QW-091 S, QW-092 M, QW-093 S.

### QW-094–100 — Production widgets
- QW-094 Daily Command widget integration
- QW-095 Packaging widget integration
- QW-096 Analytics Diagnosis widget integration
- QW-097 Retention widget integration
- QW-098 Audience Inbox widget integration
- QW-099 Publishing Gate widget integration
- QW-100 Script/Traffic/Opportunity/Production widget cohort integration

**Recovered source mapping:** D19. Recovered sizes: QW-094–100 M.

## Canonical reconciliation result

The recovered matrix is **not yet executable against canonical `viewtube-dev/viewtube/main` as-is**.

Canonical repository inspection found:
- no canonical Quick Wins 100 registry;
- no current files matching the historical A/B/C/D source families by those identifiers;
- no current `ApprovedPublishSnapshot`, `PublishTransaction`, D16/D17 editor implementation, or D19 production-widget implementation surfaced in canonical source search;
- the canonical repository currently contains recovery/governance resources plus a limited `src/features/resource-library` implementation surface.

Therefore these tasks remain **REPORTED / UNKNOWN against canonical implementation state**. The historical implementation code visible in the ChatGPT library (including `ApprovedPublishSnapshot.ts` and `PublishTransaction.test.ts`) is evidence of prior conversation work, not proof of canonical main.

## Next required step

Recover the authoritative source files or an approved historical repository snapshot for the A/B/C/D source families, then reconcile each task against canonical main before creating implementation branches. Do not create a competing `QUICK_WINS_100_MASTER.md` until that reconciliation is complete.

## Provenance

- Original matrix: prior 2026-10-02 ViewTube conversation response.
- Recovery mechanism: conversation-context retrieval on 2026-10-04.
- Canonical repository inspection: `viewtube-dev/viewtube/main`.
- Historical repository referenced by earlier execution: `cbrewsterthegreat/ViewTube`.
- Status rule: preserve historical claims as reported until independently verified on canonical main.
