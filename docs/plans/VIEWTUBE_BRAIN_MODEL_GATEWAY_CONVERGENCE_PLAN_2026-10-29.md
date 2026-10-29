# ViewTube Brain Model Gateway Convergence Plan

**Date:** 2026-10-29  
**Status:** Proposed implementation plan — not implemented  
**Repository:** `viewtube-dev/viewtube`  
**Planning baseline:** `master/consolidated-feature-integration` at `e2e09fd5767cb5782f3bf1d133a0b01462c74bfc`  
**Canonical architecture authority:** `docs/domains/BRAIN.md`  
**Related work authority:** `tasks/system-convergence/todo.md` and `docs/brain/UNIFIED_AI_SYSTEM_CANONICAL_CONSOLIDATION_CONTRACT_2026-09-17.md` (historical donor/provenance; superseded where noted)  
**Related audit:** `docs/audits/VIEWTUBE_SOURCE_CODE_AI_GENERATION_AUDIT_2026-10-29.md` (PR #1168; verify landed status)

## 1. Objective

Complete the provider/model boundary for creator-facing AI without creating a second Brain, second runtime, or parallel provider abstraction.

The existing architecture already defines `BrainRuntime` as the creator-facing orchestration entry point and `BrainModelGateway` as the model boundary. This plan closes the remaining implementation gap: the default gateway is currently a thin adapter over legacy `src/services/gemini.ts`, and the gateway interface exposes structured generation plus an optional JSON method while legacy provider exports and direct calls remain reachable.

**Success means:** all creator-facing reasoning/model invocations are routed through the canonical runtime and gateway (or an explicitly governed specialist/media gateway); provider-specific SDK use is isolated behind the provider adapter; request, usage, failure, cancellation, and provenance contracts are consistent; and no UI or specialist surface owns a parallel provider stack.

## 2. Current source-backed position

At the planning baseline:

- `src/services/brain/runtime/BrainRuntime.ts` delegates to the existing `BrainOrchestrator` and injects `defaultBrainModelGateway.generateStructuredResponse`.
- `src/services/brain/runtime/BrainModelGateway.ts` currently imports `generateStructuredBrainResponse` from `../../gemini`; its default implementation dynamically imports `generateBrainJsonObject` for JSON calls.
- `BrainModelGateway` is therefore a useful seam, but not yet provider-neutral in implementation.
- `src/services/brain/BrainContextBroker.ts` and `BrainEvidenceQuality.ts` already own bounded, evidence-aware context and quality projection. They remain canonical.
- The historical consolidation contract identifies direct legacy callers such as HookGenerator and Script Architect as known seams; revalidate these against the exact current tree before migrating.
- Existing `tasks/system-convergence/todo.md` already tracks broad caller inventory and surface convergence. This plan is a focused execution slice under that authority, not a replacement task system.

## 3. Scope and boundaries

### In scope

- Inventory every creator-facing reasoning/model call and classify its owner.
- Define a stable gateway request/result/error/usage contract.
- Keep BrainRuntime as the only general creator reasoning entry point.
- Keep BrainModelGateway as the canonical creator text/reasoning model boundary.
- Isolate Gemini SDK/provider implementation behind a provider adapter.
- Route direct legacy text/reasoning callers through the canonical seam in vertical slices.
- Preserve media generation behind a documented, governed media gateway where it is not the same contract.
- Add architecture guards, traceability, and parity tests.

### Out of scope

- Creating a new BrainRuntime, chat orchestrator, context store, evidence store, or generation registry.
- Moving credentials to server-side storage or selecting BYO-key policy; see the separate credential security plan.
- Rewriting prompt content or prompt-family quality criteria; see the separate prompt migration plan.
- Forcing image/audio/video/media generation into an unsuitable text gateway. Those paths require a documented specialist/media contract with shared governance, not a fake universal interface.

## 4. Architecture decisions

1. **Preserve canonical owners.** BrainRuntime orchestrates creator reasoning; BrainModelGateway owns creator text/reasoning model invocation.
2. **Provider adapter, not provider leakage.** Gemini-specific SDK types, model IDs, error shapes, and retry details stay behind the provider implementation.
3. **Explicit operation contract.** Requests carry task/capability, surface, channel/project/video scope, prompt ID/version, schema, context/evidence references, and cancellation/limits where applicable.
4. **One usage authority.** Usage/credit preflight and metering must follow existing unified account/billing policy. No gateway-local parallel credit ledger.
5. **Evidence remains external to the model.** The gateway records evidence references and trace metadata; BrainContextBroker and evidence owners decide what is valid.
6. **Typed failure semantics.** Distinguish authentication, entitlement, rate limit, timeout, cancellation, provider failure, malformed output, and validation failure.
7. **Compatibility strangler.** Legacy Gemini exports remain temporarily callable only where inventoried; every remaining caller has an owner and removal gate.
8. **Provider neutrality is demonstrated.** An interface named “gateway” is not enough; tests must prove provider substitution without caller changes.

## 5. Dependency graph

```Creator-facing surface inventory
              |
              v
       Canonical task envelope
              |
              v
 Gateway request/result/error/usage contract
              |
              v
 Provider adapter + gateway contract tests
              |
              v
 BrainRuntime and specialist call-path migration
              |
              v
 Architecture guards + provenance coverage
              |
              v
 Legacy direct-call quarantine
```

The prompt migration plan supplies prompt identity/version and family evaluation requirements. The credential security plan supplies the provider credential-resolution contract. These are coordinated boundaries, not duplicate implementations.

## 6. Ordered task plan

### Phase 1 — Reconcile the caller graph

- [ ] **Task 1 — Pin current runtime/gateway baseline.**
  - Acceptance: exact SHA, current gateway interface, provider implementation, tests, and known direct-call inventory are recorded.
  - Verify: inspect current target tree; compare existing scanner/PR #1168 status before reuse.
  - Likely files: `src/services/brain/runtime/BrainModelGateway.ts`, `BrainRuntime.ts`, existing caller inventory.
  - Dependencies: none.

- [ ] **Task 2 — Complete creator-facing call-site classification.**
  - Acceptance: every call is classified as Brain reasoning/text, structured generation, media generation, deterministic computation, provider helper, or non-production/test-only; each production call has a surface owner and migration status.
  - Verify: static scan plus manual tracing of dynamic imports, DI, re-exports, and route reachability.
  - Likely files: inventory artifact, existing scanner/tests, system-convergence tracker.
  - Dependencies: Task 1.

- [ ] **Task 3 — Identify contract gaps without changing behavior.**
  - Acceptance: document which current call paths lack scope, task identity, prompt version, evidence refs, usage, cancellation, validation, or trace metadata.
  - Verify: contract matrix links each gap to a real caller/test.
  - Likely files: gateway contract docs, inventory.
  - Dependencies: Task 2.

### Checkpoint A — No blind migration

- [ ] All known direct provider calls have an owner and category.
- [ ] Media paths are not incorrectly forced through text reasoning.
- [ ] Existing behavior and current tests are baselined.

### Phase 2 — Define and test the gateway contract

- [ ] **Task 4 — Define typed request and response envelopes.**
  - Acceptance: request includes stable task/capability, surface, scoped identities, prompt reference/version, input, schema/constraints, evidence refs, provider policy, and bounded generation options; result includes output, provider/model metadata, usage, validation status, and trace ID.
  - Verify: compile-time contract tests and serialization tests.
  - Likely files: gateway contracts, type tests, documentation.
  - Dependencies: Task 3.

- [ ] **Task 5 — Define error, cancellation, and usage semantics.**
  - Acceptance: normalized errors distinguish auth, entitlement, quota/rate, timeout, cancellation, provider failure, invalid output, and validation failure; streaming and non-streaming usage have consistent terminal accounting.
  - Verify: unit tests for success, partial stream, consumer cancellation, provider error, missing usage metadata, and BYO policy delegation.
  - Likely files: gateway contracts, adapter, focused tests.
  - Dependencies: Task 4 and credential contract decision for secret resolution.

- [ ] **Task 6 — Implement provider adapter behind the existing gateway.**
  - Acceptance: default gateway no longer exposes Gemini SDK types to callers; provider selection/configuration is injected behind one adapter; existing Gemini behavior is preserved.
  - Verify: gateway contract suite runs against current Gemini adapter; substitution test uses a fake provider with no caller changes.
  - Likely files: existing gateway, provider adapter, tests (split into slices of five files or fewer).
  - Dependencies: Task 5.

### Checkpoint B — Provider boundary is real

- [ ] A fake provider can satisfy the gateway contract.
- [ ] No caller imports Gemini SDK/provider internals through the gateway contract.
- [ ] Billing/usage has one owner and no double charge.

### Phase 3 — Migrate production paths

- [ ] **Task 7 — Migrate direct creator reasoning callers.**
  - Acceptance: direct UI/specialist reasoning paths enter through BrainRuntime; existing orchestration, context, evidence, validation, and learning behavior remain intact.
  - Verify: caller integration tests and architecture guard against new direct calls.
  - Likely files: one surface/caller plus tests per vertical slice.
  - Dependencies: Checkpoint B.

- [ ] **Task 8 — Migrate structured/JSON generation callers.**
  - Acceptance: schema, parse, validation, repair, and safe fallback semantics are explicit; no caller silently parses arbitrary text as trusted structured output.
  - Verify: malformed JSON, schema violation, repair limit, and successful output tests.
  - Likely files: gateway, caller, schema/validator, tests.
  - Dependencies: Task 7.

- [ ] **Task 9 — Normalize streaming and usage accounting.**
  - Acceptance: stream authorization, entitlement preflight, cancellation behavior, usage aggregation, and terminal metering are consistent with non-streaming policy.
  - Verify: streaming tests for complete, cancelled, empty, errored, and missing-provider-usage streams.
  - Likely files: provider adapter, billing integration, tests.
  - Dependencies: Task 6; coordinate with PR #1168 streaming remediation if it is not yet landed.

- [ ] **Task 10 — Define specialist/media gateway boundaries.**
  - Acceptance: image/audio/video/media calls either use a documented governed specialist gateway or are explicitly excluded with an owner and reason; no second generic text gateway is introduced.
  - Verify: architecture tests enforce the approved provider boundary per capability.
  - Likely files: media adapter contract, system classification, tests.
  - Dependencies: Task 2.

### Phase 4 — Provenance, guards, and legacy retirement

- [ ] **Task 11 — Complete generation trace/provenance coverage.**
  - Acceptance: production outputs can be traced to task, surface, prompt ID/version, model/provider, relevant context/evidence references, validation result, usage, and artifact/run identity where applicable.
  - Verify: end-to-end trace test follows a representative request to persisted generation record.
  - Likely files: existing trace/generation record owners and tests.
  - Dependencies: Tasks 7–10.

- [ ] **Task 12 — Add architecture guards and quarantine legacy entry points.**
  - Acceptance: new direct Gemini calls in creator-facing code fail governance tests unless explicitly allowlisted; old exports are quarantined only after zero-reachability and donor-harvest proof.
  - Verify: negative fixture test, scanner, focused tests, typecheck/build.
  - Likely files: architecture guard tests, existing legacy modules, registry.
  - Dependencies: Task 11.

### Final checkpoint

- [ ] BrainRuntime is the only general creator reasoning/orchestration entry point.
- [ ] BrainModelGateway is the only creator text/reasoning model boundary.
- [ ] Provider SDK implementation can be substituted without changing callers.
- [ ] Media exceptions are explicit and governed.
- [ ] Usage, authorization, cancellation, and metering are consistent.
- [ ] Provenance is complete for migrated production paths.
- [ ] No new direct provider bypasses.
- [ ] Focused Brain/gateway tests, `npm run test:ai-systems-governance`, `npm run typecheck`, and `npm run build` pass against a pinned baseline.

## 7. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Gateway grows into a second orchestrator | High | Keep intent, context, evidence, and workflow policy in BrainRuntime and existing owners |
| Generic interface hides incompatible media semantics | High | Explicit specialist/media gateways with shared governance |
| Billing is charged twice or not at all | High | Single metering owner and terminal-stream accounting tests |
| Prompt migration and gateway migration drift | Medium | Coordinate prompt ID/version in request envelope; separate plan ownership |
| Direct calls remain hidden behind dynamic imports | High | Static scan plus manual and runtime reachability proof |
| Provider adapter still leaks Gemini types | Medium | Fake-provider contract tests and import-boundary guards |

## 8. Boundaries

- **Always:** preserve BrainRuntime, BrainContextBroker, evidence owners, and unified billing policy; make provider neutrality testable; migrate one caller at a time.
- **Ask first:** changing public task contracts, provider policy, account entitlements, media architecture, or durable provenance schema.
- **Never:** create a second Brain/runtime/gateway; bypass evidence/context; move secrets as an incidental part of gateway refactoring; delete legacy code without proof.

## 9. Open questions

- Which current creator-facing paths should be treated as media-generation exceptions rather than text gateway calls?
- Should streaming be a first-class gateway method or a typed operation adapter exposed only to capabilities that require it?
- Which generation provenance fields are mandatory for every output versus capability-specific?
