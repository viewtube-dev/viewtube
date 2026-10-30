# Existing Test and Runtime Gate Index
**Class:** REFERENCE | **Status:** ACTIVE | **Last Edited:** 2026-10-29

This folder maps existing tests and commands to P1 workstreams. It does not replace source tests or create a second test registry. Add a new test beside the owning source using repository conventions; link it here only when it is a meaningful P1 regression gate.

| Workstream | Existing test/command leads | Additional proof required |
|---|---|---|
| Brain continuity | test:brain-runtime-snapshot; test:focused; CreatorContextResolver; EvidenceIntelligenceResolver; BrainLearningPersistence; BrainProjectContext; BrainEvaluationLoop; BrainCommunicationIngestion; outcome/event ancestry tests | End-to-end identity continuity through actual Brain caller |
| Gemini governance | brainProviderArchitectureGuard; GeminiKeyContext; keyVault; test:unified-diagnostics; operation/receipt tests | Logged-in/out key validation and governed reasoning + generation |
| Diagnostics | test:unified-diagnostics; diagnostics.test; diagnostics/unified.test; EvidenceLineageDiagnostics | Correlation traversal and actionable failure evidence |
| Priority-25 | BrainCapabilityRegistry and BrainRuntime surface contracts; audit:reach; audit:ai-systems; test:ai-systems-governance | Actual capability production caller; resolve identity first |
| Public resolver | test:public-page-resolver; api/public-channel.node.test; publicHandleMode tests | Public-only runtime, cache freshness/isolation/provenance |
| Studio Controls | test:studio-controls; test:studio-field-style-ownership; test:confirmed-library-layout; test:studio-floating-input-typography; certify:studio-components | Production export parity and visual responsive certification |

## Shared package scripts
test:focused; test:unified-diagnostics; test:public-page-resolver; test:studio-controls; test:studio-field-style-ownership; test:confirmed-library-layout; audit:ai-systems; test:ai-systems-governance; audit:reach; typecheck; build; test.

## Rules
- Confirm test paths and commands on the implementation branch.
- RED before behavior changes, GREEN after minimal fix, then refactor.
- Never disable or weaken a regression test to claim completion.
- Distinguish unit, integration, production-caller, runtime and visual evidence.
- A test file's existence is not proof that it ran or passed.
