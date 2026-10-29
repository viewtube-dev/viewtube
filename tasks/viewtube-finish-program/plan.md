# ViewTube Finish Program — Execution Plan

This task workspace is the detailed execution companion to the architectural Finish Program. It does not replace `tasks/plan.md` / `tasks/todo.md` for Settings-specific work, the Integrated Application Program for cross-system architecture, or Task Authority for canonical task identity/lifecycle.

**Last reconciled:** 2026-10-29  
**Target:** `master/consolidated-feature-integration`  
**Inspected target base:** `aeadc6e42f881b3bc5c2bc96f158892213502e1a`  
**Planning status:** ACTIVE — partial implementation is present across multiple fronts; no overall completion claim.

## Authority and execution rules

- `docs/programs/INTEGRATED_APPLICATION.md` owns cross-system seams, dependency chains and program-level completion conditions.
- `docs/governance/TASK_AUTHORITY.md` owns canonical task identity and lifecycle. A/B/C/D/P/S labels here are compatibility aliases, not new task IDs.
- Domain Authorities and specifications own bounded contracts.
- Current code, focused tests, runtime evidence and verification receipts determine implementation status.
- A merged PR proves integration into the target branch, not end-to-end completion.
- Preserve landed work; do not recreate existing foundations or add a second owner/store/ledger.
- No deletion or quarantine before production reachability, donor harvest, parity and rollback checks.

## Four-program model

### A. Finish the unified Project / Asset workflow

Build the creator-facing facade and the contracts that make ContentBuild, Asset Engine, Publishing Package, Launch Package, Editor and Publisher one continuous project.

Critical path:
`ApprovedPublishSnapshot → PublishTransaction binding/recovery → post-publish ContentBuild identity → Asset Slot Registry → Asset Engine Studio / Project facade → outcome closure`.

### B. Close publishing → analytics → evaluation → learning

Fill outcome writers, measurement targets and comparability consumers so recommendations and published assets can be evaluated without false comparisons or broken identity.

Critical path:
`Outcome writer contract → evaluation target/checkpoint coverage → analytics checkpoint → comparable measured evaluation → governed learning`.

The canonical metric-comparability guard is recorded as implemented (VT-001; evaluation integration VT-023). Do not duplicate it; finish consumer adoption and certification (including VT-024 visual/experiment consumers).

### C. Finish Brain / context / intelligence / prompt convergence

Complete active Project context, Opportunity evidence, prompt modernization, Project-grounded retrieval, AI observability and remaining creator-generation migrations through existing canonical owners.

Critical path:
`Creator Context / Project context → Opportunity evidence → Prompt System Authority → family migrations/evals → traceable assistant continuity / bounded RAG`.

### D. Certify and clean UI / editor / analytics

Finish editor/render parity, responsive/state certification, the 10-widget cohort, data-visual safety, duplicate-owner cleanup and public agent readiness.

Critical path:
`canonical component owners → representative catalog → real route interaction → responsive/state matrix → parity/reachability cleanup`.

## Current reconciliation and delivered foundations

Recent merged work on the target includes:
- Studio Controls family consolidation, CSS/token/cascade corrections and primitive representative restoration (#1073–#1085, #1088–#1090, #1103, #1110, #1114, #1119, #1122, #1129, #1133, #1135–#1143, #1146–#1148, #1152, #1154, #1158–#1162, #1165).
- Brain evidence continuity, local creator context and channel-scoped evidence work (#1086, #1093–#1104, #1117/#1118), plus composer contract repairs (#1137, #1147/#1148, #1161).
- Gemini provider/model governance, fallback and diagnostics foundations (#1109, #1116, #1120, #1131, #1134, #1145).
- Unified diagnostics adapters and integrations across analytics, billing, account lifecycle and crash reporting (#1149–#1157, #1164).
- Public page resolver implementation and endpoint tests (#1105, #1121).
- Calendar controls integration and confirmed Studio Hub calendar primitive representatives (#1160, #1166).
- Crown Control Room Exchange-only, read-only runtime (#1167).

These changes reduce unfinished work but do not satisfy broad capability acceptance by themselves. PR #1168 is still OPEN/DRAFT and is not counted as delivered.

## Immediate implementation sequence

### Wave 0 — Evidence and target freeze

- Confirm exact target head before each write/PR; rebase against current `master/consolidated-feature-integration`.
- Convert PR descriptions and merged commits into evidence references, not inferred DONE statuses.
- Resolve canonical VT task IDs through Task Authority / Task Index VNext; do not allocate IDs from A/B/C/D labels.
- Attach a verification profile and owner to each next vertical slice.

### Wave 1 — Publish identity freeze (A06)

- Verify the canonical ApprovedPublishSnapshot owner and production caller.
- Freeze exact approved revisions/assets/metadata/routing/schedule/approver before transaction start.
- Establish stable hash/idempotency key and immutable transaction binding.
- Add tests proving later edits cannot alter an in-flight transaction.
- Exit only with focused tests plus transaction/runtime evidence.

### Wave 2 — Recovery + post-publish identity (A07/A08)

- Persist durable step receipts and recover state after reload/restart.
- Reconcile remote YouTube state before retry; prevent duplicate uploads.
- Retry optional steps independently and support explicit manual recovery.
- Link published YouTube binding, exact used variants, checkpoints and outcomes to one identity.
- Keep A27 server-authoritative migration as an explicit dependency/decision; do not disguise browser persistence as durable server authority.

### Wave 3 — Measurement correctness (B09/B10/B14/B18)

- Build a producer matrix for Publisher, Projects, Editor, Community, experiments, packaging and Brain.
- Define shared outcome identity/idempotency without replacing existing canonical event ledgers.
- Add evaluation targets/checkpoints and explicit insufficient/not-measurable states.
- Finish comparability-guard consumer adoption; guard itself is not a reason to create a duplicate implementation.
- Certify analytics/data visual empty/loading/error/stale/partial/ready/disabled and responsive states.

### Wave 4 — Brain context, evidence and Prompt System (C12/C13/C21/C31/B22)

- Complete active Project/ContentBuild context through Creator Context and existing Brain portfolio owners.
- Build Opportunity evidence from canonical analytics sources with provenance, freshness, confidence and scope.
- Finish prompt caller inventory and map each reachable caller to owner/family/version/context recipe.
- Migrate one high-value prompt family at a time through the existing Brain gateway; preserve quality baselines and compatibility until zero reachability is proven.
- Trace requested/served model, prompt/context version, evidence refs, latency, cost, decision and generated assets.
- Treat PR #1168 as pending until its focused tests, governance tests, typecheck and build run successfully and an independent review confirms the branch.

### Wave 5 — Project / Asset UX completion (A01–A05/A15)

- Define canonical Asset Slot Registry and Launch Package contracts before broad UI composition.
- Assemble Asset Engine Studio using existing Project, ContentBuild, Asset Engine and Publishing Package owners.
- Complete Overview → Plan → Create → Package → Publish → Performance readiness/Continue routing.
- Close Editor derived-asset identity and outcome attribution.

### Wave 6 — Editor / widgets / certification (D16/D17/D19/D29)

- Prove Remotion preview/final parity with deterministic fixtures and actual render inspection.
- Certify portrait, landscape, narrow/tablet and desktop layouts.
- Finish the 10-widget cohort only after each widget has a canonical backend owner and handoff contract.
- Use the newly landed calendar and Studio Hub representatives as test specimens, not as substitutes for responsive runtime tests.
- Exercise all required states, keyboard/touch interactions, persistence/reload and error/disconnected behavior.

### Wave 7 — Convergence / durability / release (A27/C21/D28/D30/S00–S07)

- Complete one-write-owner and production-reachability matrices.
- Move critical execution/publication state to server authority only after contracts stabilize.
- Finish AI/tool/model/prompt/surface registries as machine-readable projections of existing owners.
- Remove duplicate paths only after donor harvest, parity and rollback receipts.
- Ship public agent discovery files and perform an external readiness rescan.
- Complete end-to-end creator-loop certification and leave a receipt.

## Verification profile

For each implementation slice, use the applicable gates from `docs/governance/VERIFICATION.md`:
- scope/diff and canonical ownership review;
- focused tests, integration/contract tests, typecheck and production build;
- route/tool runtime interaction, including empty/loading/error/disconnected/permission states;
- desktop, narrow, mobile portrait and mobile landscape screenshots with visual analysis for UI work;
- authenticated API/provider behavior where relevant;
- persistence/reload, idempotency, retry and rollback where relevant;
- deployment evidence distinguished from branch-preview evidence.

A green build is not user-visible proof. A screenshot is not server-authorization proof. A merged PR is not DONE proof. On 2026-10-29 GitHub Actions run 40966054493 passed the 10 snapshot tests, 16 transaction tests, production build and local smoke, while broad Vitest/typecheck/source-governance gates failed elsewhere. These scoped passes do not certify server-authoritative persistence or live YouTube recovery.

## Merge policy

- One canonical owner per concern.
- Small reversible PRs; current target branch wins over stale branch architecture.
- Backend/contract PRs before broad UI consumers.
- Every UI wave includes mobile/narrow certification.
- Every AI wave includes prompt/context/model/evidence provenance and focused evals.
- No parallel implementation or deletion without reachability/parity evidence.
- Do not claim a task complete until Task Authority-compatible acceptance evidence exists.

## Handoff

The next executable slice is **A06 → A07 → A08 publishing identity and recovery**, while independent verification of the open #1168 Gemini streaming remediation proceeds. In parallel, prepare the B09/B10/B14/B22 producer-and-evaluation matrix and complete D29 visual/state certification using the existing Studio/calendar representatives. Exact VT task IDs and lifecycle changes must be resolved through Task Authority, not inferred from this plan.
