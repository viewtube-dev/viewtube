# Spec — evidence-contract

## Objective
Give every Brain/intelligence/generation/evaluation path a common epistemic contract without replacing existing evidence stores. Consumers must know what is known, observed, calculated, inferred, stale, missing or conflicting and where each claim came from.

## Existing-state compatibility
Current main already contains canonical analytics evidence, BrainContextBroker, BrainOutcomeLedger, evaluation/learning infrastructure and channel-scoped intelligence evidence. This module is an adapter/contract layer over those owners, not a new database.

## Contract
Evidence records must support stable ID, source owner/source ID, channel scope, optional project/video/content-build scope, claim/metric/value, timeframe, freshness, confidence, provenance, limitations and epistemic state.

Epistemic states:
KNOWN, OBSERVED, CALCULATED, USER_PROVIDED, INFERRED, HYPOTHESIS, ESTIMATE, STALE, MISSING, CONFLICTING.

Unknown/missing is never normalized to numeric zero.

## Evidence health
A bounded task-level report should expose coverage, freshness, exact scope match, source failures, missing requirements and contradictions. Confidence must degrade when evidence is stale, partial, cross-scope or insufficient.

## Boundaries
Always: preserve source provenance; preserve channel scope; fail closed on scope mismatch; retain missingness.
Ask first: persistent schema migration or replacement of an existing canonical evidence type.
Never: duplicate analytics storage; infer sensitive viewer traits; fabricate unavailable metrics; convert estimates into facts.

## Success criteria
- Existing canonical evidence can be projected into the contract without data loss.
- Brain tasks can receive evidence-health metadata.
- Scope mismatch is detectable before model invocation.
- Missing/stale/conflicting evidence remains explicit.
- Tests prove missing != zero and channel/project scope is preserved.


## Target-branch implementation reconciliation — 2026-10-29

Source inspection on `master/consolidated-feature-integration` confirms the additive contract is implemented in `src/services/brain/BrainEvidenceContract.ts`, including:
- stable claim identity, source owner/source ID/snapshot, channel/project/ContentBuild/video scope, metric/value/unit, timeframe, freshness, epistemic state, confidence, provenance and limitations;
- missing values remain `null`, never numeric zero;
- explicit scope states and health summaries for coverage, missingness, staleness, conflicts and scope mismatch.

The contract is consumed as a projection over canonical EvidenceRecord/analytics sources; it is not a replacement evidence store. `src/services/brain/BrainContextResolution.ts` also uses task and capability evidence requirements and reports missing required sections.

**Verification boundary:** source presence is confirmed by fetch, but tests/typecheck/build/runtime caller coverage were not executed in this documentation pass. The success criteria remain open until Phase 1 of `tasks/p1-canonical-system-integration/workstreams/ai-brain-quality-and-systems-management/plan.md` passes on the exact target SHA.
