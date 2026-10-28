# Priority 25 Frontend Scaffold Integration — Audit and Execution Record

Date: 2026-10-28
Repository: `viewtube-dev/viewtube`
Working branch: `feature/priority-25-frontend-scaffolds`
Reference branch: `master/consolidated-feature-integration`

## Status

- Phase 0 — scaffold and source-of-truth audit: completed for the archive and key Brain integration points.
- Phase 1 — integration contracts: recorded below.
- Phase 2 — AI Brain vertical-slice reconciliation: existing implementation and focused tests were found. Do not bulk-import duplicate scaffold pages, stores, API stubs, or registries. Runtime tests still need to be executed in a checkout.
- No production-code changes or test runs are claimed by this audit.

## Phase 0 — Findings

The archive has 145 ZIP entries (112 files). Its README marks all 25 capabilities `unverified` and requires a target-branch audit before route wiring or flag enablement. Capability API modules contain placeholder paths such as `scaffold://evidence-connected-brain`; these are not production endpoints.

Existing owners found on the reference branch:
- `src/services/brain/BrainContextBroker.ts`: prompt/context assembly.
- `src/services/brain/BrainOrchestrator.ts`: selects evidence, builds prompt context, validates model claims, and persists evidence metadata on completed turns.
- `src/services/brain/EvidenceIntelligenceResolver.ts`: one canonical analytics snapshot projected into evidence records, claims, and quality; analytics projection fails closed without exact channel scope.
- `src/services/brain/EvidenceRecord.ts` and `BrainEvidenceQuality.ts`: typed evidence provenance, freshness, scope, epistemic state, and limitations.
- `src/services/brain/CreatorContextResolver.ts`: read-only facade over existing channel, project, style, surface, and selection owners; adds no parallel persistence.
- `src/services/aiBrainConversationStore.ts` and `src/services/brain/Persistence.ts`: existing conversation turn/thread persistence.
- `src/context/channelContextQuestions.ts`, `ChannelContextProfile.ts`, and `channelContextScope.ts`: existing questionnaire, profile shape, and active-channel scope guard.
- `src/services/publicHandleMode.ts` and Settings account UI: existing public channel resolution and degraded-data behavior.

Focused tests already present include `BrainContextBrokerCreatorContext.test.ts`, `EvidenceIntelligenceResolver.test.ts`, `CreatorContextResolver.test.ts`, `aiBrainCommandInterface.test.ts`, and `publicHandleMode.test.ts`.

## Phase 1 — Integration contracts

1. Analytics remains owned by `analytics-canon`; Brain consumes a read-only projection.
2. Creator/channel/project/style/surface context stays behind current owners and `CreatorContextResolver`.
3. Do not create a second evidence, context, conversation, analytics, route, feature, or Studio-control registry.
4. Evidence-bearing consumers use `EvidenceRecord` and preserve source refs, channel scope, freshness, epistemic state, and limitations.
5. User-provided answers remain distinguishable from observed analytics and inferred hypotheses.
6. Completed turns continue through the existing Brain persistence path; do not duplicate saved turns in scaffold localStorage.
7. Public mode must distinguish live, fixture, partial, unavailable, and missing-key states; never imply private analytics from public metadata.
8. Flags remain hidden/off until routes, real service contracts, permissions, tests, and canonical UI integration are verified.
9. UI controls use existing `src/studio-ui` exports and tokens.
10. Never replace `scaffold://` with guessed endpoints. Confirm real backend routes and schemas first; external writes require authorization and safe retry semantics.

## Phase 2 — AI Brain vertical-slice reconciliation

Static inspection confirmed this existing path:
1. `BrainOrchestrator` calls `resolveEvidenceIntelligence` for analytics-backed tasks.
2. The resolver obtains one canonical snapshot and derives evidence records/claims/quality.
3. The resolver blocks analytics projections when channel scope is not exact.
4. The orchestrator passes selected evidence records and quality/claim context to `buildBrainContextPack`.
5. Response claim validation checks evidence IDs and numeric values.
6. Completed turns persist evidence IDs, records, and quality/fingerprint metadata through `completeAIBrainTurn`.

**Disposition:** reuse and verify; do not import scaffold Brain/context API stubs or parallel pages. The scaffold's truthful async-state and evidence-panel patterns may inform later UI improvements, but production code should change only when a concrete gap is reproduced.

## Required runtime verification

In a real checkout, run and record actual results:
- `npm run test:brain-runtime-snapshot`
- Focused tests for `BrainContextBrokerCreatorContext`, `EvidenceIntelligenceResolver`, `CreatorContextResolver`, `aiBrainCommandInterface`, and `publicHandleMode`
- `npm run typecheck`
- `npm run check:routes`
- `npm run build`

Also inspect the saved channel-context answer path end-to-end, including reload recovery and active-channel mismatch. This connector audit did not execute tests, typecheck, route checks, or a build.

## Initial capability disposition

- Reuse/adapt first: evidence-connected Brain, channel context intake, public channel resolution, channel intelligence, evidence quality validation, prompt handoff, opportunity discovery, project resume, KPI/time-window controls, cross-video comparison, metadata refinement, ranked tags, channel information management, advanced Studio controls, feature discovery.
- Provider/contract gated: AI video editor, Shorts operations, Veo generation, thumbnail upload/reuse, transcript/language tools, caption/subtitle writes, CSV/document analytics, subscriber/API dispatch, cross-tool side effects.
- Registry/governance after audit: hidden tools/pages and feature discovery; extend current registries instead of adding competing ones.

This is a first-pass disposition, not a claim that every capability is implemented or ready to expose.

## Rollback boundary

Keep work isolated on `feature/priority-25-frontend-scaffolds`. Do not enable flags or expose routes as part of this audit. Revert only the relevant feature commit if a later slice fails.
