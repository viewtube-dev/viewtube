# Test and Runtime Plan — Brain profile, evidence, interaction and outcome continuity

**Status:** PLANNED. Do not report tests as passing until executed on the implementation branch.

## Existing test leads
BrainRuntimeSnapshot and BrainAssistantContinuity tests; CreatorContextResolver; EvidenceIntelligenceResolver; BrainEvidenceContract; BrainContextResolution; BrainLearningPersistence; BrainProjectContext; BrainEvaluationLoop; BrainCommunicationIngestion; BrainOutcomeLedger and AlgorithmIntelligenceEventLedger tests; capability-specific golden paths.

## Required production-caller proof
Sidebar Chatbot, Brain Hub widget and full AI Brain workspace; profile→evidence→context→task→interaction→operation/receipt→outcome. Test rich, sparse, empty, stale, cross-channel and logged-out public-only cases.

## Evidence receipt
Record commit SHA, environment, caller/surface, auth state, fixture/source provenance, exact command and exit code, observed IDs, screenshots/log references, failures and limitations. Never include secrets or raw private payloads.

## Exit conditions
- [ ] Failing regression test first for each behavior change.
- [ ] Focused tests pass without weakening existing assertions.
- [ ] Integration and negative cases pass.
- [ ] Actual production caller exercised.
- [ ] Runtime evidence confirms owner, identity and provenance.
- [ ] Build/typecheck/full relevant suite results recorded separately.
- [ ] Independent review confirms no duplicate owner or unsupported claim.
