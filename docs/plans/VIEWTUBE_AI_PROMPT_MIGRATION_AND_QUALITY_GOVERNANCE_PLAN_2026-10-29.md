# ViewTube AI Prompt Migration and Quality Governance Plan

**Date:** 2026-10-29  
**Status:** Proposed implementation plan — not implemented  
**Repository:** `viewtube-dev/viewtube`  
**Planning baseline:** `master/consolidated-feature-integration` at `e2e09fd5767cb5782f3bf1d133a0b01462c74bfc`  
**Related audit:** `docs/audits/VIEWTUBE_SOURCE_CODE_AI_GENERATION_AUDIT_2026-10-29.md` (currently proposed on PR #1168; verify it is landed before treating it as branch authority)  
**Related authority:** `docs/specifications/PROMPTS.md`, `docs/specifications/prompt-registry.json`, `docs/domains/BRAIN.md`, `governance/ai-systems/`

## 1. Objective

Turn the existing prompt inventory into a trustworthy, versioned, testable runtime system. Every production prompt must have an identified owner, stable identity/version, known callers, task/capability mapping, typed output contract where applicable, relevant context/evidence requirements, and a measurable quality baseline.

Migrate legacy prompt families incrementally through the existing Brain and generation architecture. Preserve useful prompt behavior, schemas, validation, fallbacks, and caller contracts. Do not bulk-rewrite or delete prompts based only on a static text search.

**Success means:** every production prompt is traceable from caller to runtime invocation and output; important behavior has regression fixtures and quality gates; new and migrated calls use governed prompt references; and legacy prompt exports are retained only where a documented compatibility caller still requires them.

## 2. Current source-backed position

The October 29 audit identified an existing runtime, not a greenfield system:

- Prompt registry: `docs/specifications/prompt-registry.json`, version `viewtube-prompt-registry-v3`.
- Registry snapshot: 49 legacy prompt constants, 48 marked `legacy_migration_required` and one retained version marker; these counts must be revalidated against the exact implementation baseline before execution.
- Legacy provider exports and direct call sites remain in `src/services/gemini.ts`.
- Brain context and evidence foundations already exist in `src/services/brain/BrainContextBroker.ts`, `BrainEvidenceQuality.ts`, `EvidenceRecord.ts`, and the task-profile/context-resolution modules.
- The registry itself says reachability must be audited before migration/removal.
- A static caller scanner was added in the proposed work for PR #1168. It is not yet assumed to be merged or runnable; first verify its PR state and reuse it if landed. Do not create a competing scanner.

This plan does not create another prompt registry, context store, evidence store, or Brain runtime.

## 3. Scope and boundaries

### In scope

- Reconcile the prompt registry against current source and tests.
- Trace static and dynamic callers, aliases, re-exports, dependency injection, and runtime route reachability.
- Define canonical prompt identity, version, family, task/capability, schema, evidence/context requirements, and migration status.
- Establish prompt-family regression fixtures and quality evaluations.
- Migrate production callers in small, reversible slices.
- Retire legacy exports only after donor harvest, zero-reachability proof, and parity evidence.

### Out of scope

- Replacing BrainRuntime or BrainModelGateway.
- Rewriting all prompt copy in one pass.
- Changing model-provider credentials or selecting a BYO-key security model; see the separate provider credential plan.
- Treating model confidence as evidence confidence.
- Changing analytics truth, creator profile ownership, or persistent artifact ownership.

## 4. Architecture and governance decisions

1. **One prompt authority.** Extend the existing prompt registry and prompt authority documents; do not add a second registry.
2. **Identity before copy changes.** Every migrated prompt gets a stable ID and explicit version. Text changes are reviewable changes to that version, not silent edits.
3. **Call graph before removal.** Static scan is a discovery aid. Confirm imports, re-exports, dynamic imports, injected functions, route reachability, and production/test-only use.
4. **Task-aware context.** Prompt context comes from existing Brain context resolution and evidence contracts. Do not paste broad profile dumps into prompts or bypass channel/project/video scope.
5. **Typed outputs.** Structured prompts declare schema, validation, repair policy, and safe failure behavior. A parseable JSON response alone is not proof of semantic validity.
6. **Evaluation before migration.** Capture representative inputs and expected behavioral properties before changing a production prompt.
7. **Incremental strangler.** Keep compatibility exports during migration; route one caller/family at a time and remove only after zero callers are demonstrated.
8. **Evidence honesty.** Missing, stale, unscoped, conflicting, and insufficient evidence remain explicit. A prompt may not instruct the model to invent unavailable metrics.

## 5. Dependency graph

```Current prompt registry + source inventory
                 |
                 v
       Caller/reachability map
                 |
                 v
     Prompt identity + contract map
                 |
                 v
   Golden fixtures + quality baselines
                 |
                 v
      Governed prompt invocation
                 |
                 v
    Family-by-family caller migration
                 |
                 v
    Zero-caller proof + quarantine
                 |
                 v
       Legacy retirement decision
```

The gateway convergence plan provides the canonical model-call boundary. Prompt migration can inventory and baseline in parallel with gateway preparation, but production migration of a family must use the agreed gateway contract.

## 6. Ordered task plan

### Phase 1 — Freeze and reconcile the inventory

- [ ] **Task 1 — Pin the live registry and source baseline.** Record exact target SHA, registry SHA, prompt/export counts, and governance test status. Reconcile the October 29 audit and PR #1168 before using their findings as landed facts.
  - Acceptance: registry snapshot is reproducible from current target; historical counts are labeled with their source SHA.
  - Verify: inspect current tree and run `npm run test:prompt-registry-governance`.
  - Likely files: `docs/specifications/prompt-registry.json`, `docs/specifications/PROMPTS.md`, audit report.
  - Dependencies: none.

- [ ] **Task 2 — Reuse or complete the production caller scanner.** Verify whether PR #1168's `scripts/audit/ai-generation-callers.mjs` has landed. If not, carry it forward once; do not create a parallel tool.
  - Acceptance: scanner output distinguishes production, test-only, imported-but-unreferenced, and no-static-reference; limitations are documented.
  - Verify: `npm run test:ai-generation-callers` and `npm run audit:ai-generation-callers` when the scripts are present.
  - Likely files: existing scanner and its fixture tests, `package.json`.
  - Dependencies: Task 1.

- [ ] **Task 3 — Manually trace high-risk and ambiguous call paths.** Follow dynamic imports, aliases, re-exports, dependency injection, route entry points, and provider wrapper calls.
  - Acceptance: each registry entry is classified as production-reachable, test-only, documentation-only, unreachable, or unresolved, with evidence links and owner.
  - Verify: reviewer can reproduce representative paths from entry point to invocation.
  - Likely files: registry, generated inventory artifact, focused route/caller tests.
  - Dependencies: Task 2.

### Checkpoint A — Inventory is trusted

- [ ] All prompt IDs and exports reconcile with source.
- [ ] No prompt is marked safe to delete solely because static scan found no direct import.
- [ ] Every unresolved dynamic path has an owner and follow-up task.

### Phase 2 — Contracts and quality baselines

- [ ] **Task 4 — Define the canonical prompt record contract.**
  - Acceptance: prompt record captures stable ID/version, family, purpose, task/capability, caller, input contract, output schema, context/evidence requirements, safety constraints, validators, and status.
  - Verify: registry schema validation rejects missing required metadata and invalid lifecycle transitions.
  - Likely files: existing registry schema, registry JSON, governance tests.
  - Dependencies: Task 3.

- [ ] **Task 5 — Build golden fixtures for the first priority families.**
  - Acceptance: representative sanitized inputs and expected behavioral assertions exist for packaging/SEO and hooks/titles; fixtures cover missing evidence, scope mismatch, stale evidence, and malformed output.
  - Verify: deterministic fixture tests run without live provider calls; model-backed evaluations are separately labeled and repeatable.
  - Likely files: prompt evaluation fixtures, evaluator tests, family-specific tests.
  - Dependencies: Task 4.

- [ ] **Task 6 — Establish quality dimensions and release thresholds.**
  - Acceptance: each family has measurable criteria for schema validity, factual/evidence grounding, task completion, creator constraints, safety, and regression; no single aggregate score hides a critical failure.
  - Verify: evaluator reports dimension-level outcomes and fails on hard blockers.
  - Likely files: evaluation contracts, prompt governance tests, report output.
  - Dependencies: Task 5.

### Checkpoint B — Migration can be measured

- [ ] Baselines are captured before changing production prompt behavior.
- [ ] Critical failure cases are hard gates, not averaged away.
- [ ] Prompt text, schema, and evaluator versions are recorded together.

### Phase 3 — Incremental migration

Migrate in small slices, prioritizing production-reachable and high-impact families. Proposed order (confirm with caller inventory): packaging/SEO → hooks/titles/thumbnails → scripts/storyboards → community/comments → analytics/report reasoning → remaining legacy callers.

- [ ] **Task 7 — Migrate one packaging/SEO vertical slice.**
  - Acceptance: one caller uses a governed prompt reference through the canonical generation boundary; output validation and existing fallback behavior are preserved.
  - Verify: caller tests, prompt fixture evaluation, focused provider/gateway tests.
  - Likely files: one caller, prompt registry/definition, schema/validator, focused tests (max five files per slice).
  - Dependencies: Checkpoint B and gateway contract approval.

- [ ] **Task 8 — Migrate hooks/titles/thumbnails as separate vertical slices.**
  - Acceptance: each caller preserves its input/output contract and records prompt version and validation outcome.
  - Verify: family fixtures plus caller integration tests.
  - Likely files: one family slice at a time.
  - Dependencies: Task 7.

- [ ] **Task 9 — Migrate scripts/storyboards, community/comments, and analytics/report reasoning.**
  - Acceptance: specialist logic remains in its bounded modules; analytics claims remain grounded in canonical evidence and explicit scope.
  - Verify: focused tests per family, evidence provenance tests, output validation tests.
  - Likely files: no task exceeds five files; split further where needed.
  - Dependencies: Task 8.

- [ ] **Task 10 — Add migration guards.**
  - Acceptance: newly introduced production calls cannot add unregistered prompt literals or bypass required schema/evaluation metadata without an explicit documented exception.
  - Verify: architecture/governance tests reject an intentionally unregistered fixture.
  - Likely files: governance tests, scanner/registry validation.
  - Dependencies: Tasks 7–9.

### Phase 4 — Quarantine and retirement

- [ ] **Task 11 — Produce donor-harvest and zero-caller receipts.**
  - Acceptance: each legacy prompt's useful behavior, schema, validation, fallback, and tests are mapped to its successor; zero production reachability is demonstrated.
  - Verify: fresh scanner output plus manual trace and tests.
  - Likely files: registry, migration receipts, caller tests.
  - Dependencies: Task 10.

- [ ] **Task 12 — Quarantine before deletion.**
  - Acceptance: legacy export remains available through a bounded compatibility period only where needed; deletion requires explicit successor, parity, zero-caller, and rollback evidence.
  - Verify: production build, focused tests, architecture guards, and reviewer sign-off.
  - Likely files: source export modules, registry, migration docs/tests.
  - Dependencies: Task 11.

### Final checkpoint

- [ ] Every production prompt has a stable identity/version and known caller.
- [ ] Every migrated structured prompt has schema validation and regression fixtures.
- [ ] Every migrated call records prompt version and evaluation/validation outcome.
- [ ] No unresolved production call is silently classified as dead.
- [ ] Legacy deletion has donor-harvest, parity, zero-caller, and rollback proof.
- [ ] `npm run test:prompt-registry-governance`, `npm run test:ai-systems-governance`, focused Vitest, `npm run typecheck`, and `npm run build` pass against the same pinned target baseline.

## 7. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Static scanner misses dynamic reachability | High | Manual tracing and runtime/route tests before deletion |
| Prompt rewrite changes creator behavior | High | Golden fixtures and family-specific evaluation before migration |
| Registry becomes a second source of truth | High | Extend existing registry/schema and name one authority |
| Evaluation scores hide a critical regression | High | Hard gates for grounding, scope, schema, and safety |
| Large-batch migration creates hard-to-debug failures | High | One caller/family vertical slice per PR |
| Historical counts drift from current branch | Medium | Pin every inventory to exact commit and regenerate before work |

## 8. Boundaries

- **Always:** preserve current caller contracts; use existing context/evidence owners; retain compatibility until proof supports removal; distinguish model-backed eval from deterministic tests.
- **Ask first:** changing canonical prompt authority, broad prompt behavior, user-visible response policy, or provider/billing behavior.
- **Never:** bulk-delete prompts; treat static absence as zero reachability; fabricate evidence; create another prompt registry or Brain runtime; mark an unexecuted evaluation as passed.

## 9. Open questions

- Which prompt families are the highest business-priority after the current production caller inventory is generated?
- Which evaluation cases may use sanitized production examples, and what redaction/retention rules apply?
- What minimum regression threshold is acceptable for each family, and who approves intentional behavior changes?
