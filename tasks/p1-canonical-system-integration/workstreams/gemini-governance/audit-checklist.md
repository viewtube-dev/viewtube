# Audit Checklist — Gemini provider registry, key validation and generation-operation governance

**Audit status:** NOT RUN in this work packet. Source leads below are inventory, not certification.

## Ownership and source audit
- [ ] Refresh target branch SHA and compare active branches/PRs.
- [ ] Confirm canonical owner and domain authority.
- [ ] Inventory current source files, exports, imports, routes, runtime callers and tests.
- [ ] Identify existing task/capability IDs; do not allocate replacements here.
- [ ] Classify every candidate as current-main, branch-only, PR-only, planned, stale or unknown.
- [ ] Identify duplicate stores, adapters, registries, routes and dead scaffolds without deleting them.

## Workstream-specific audit
Inventory every generation caller; classify reasoning vs generation; verify auth and metering parity including streaming; validate key formats/provider/model support; trace operation and receipt identity; inspect BYOK threat model; compare prompts to canonical registry; enumerate retry and outage behavior.

## Evidence and disposition
- [ ] Record exact paths, line ranges, SHAs, test commands and observed results.
- [ ] Record open questions, risks, missing caller proof and negative cases.
- [ ] For cleanup, prove zero callers, no-loss migration, parity and rollback before deletion.
- [ ] Obtain independent review before implementation or completion claims.

## Source-backed Phase 1 findings — 2026-10-30
- `BrainModelGateway.ts` provides a provider-neutral interface and injectable factory, but the only production provider implementation in this path is the dynamic Gemini adapter. `geminiModelGovernance.ts` is a Gemini model/capability policy registry, not a multi-provider registry. Do not claim multiple production providers.
- `GeminiKeyContext.tsx` validates by consuming `ai.models.list()`; explicit invalid-key responses are rejected, while permission/rate-limit/transient verification failures are intentionally saved locally with degraded status. The BYOK key store remains browser localStorage and is not encrypted server storage.
- `GeminiKeyContext` previously exposed a raw `setApiKey` context mutator in addition to `validateAndSaveKey`. The only current consumer is GeminiKeySettings and it uses the validated flow. PR #1217 removes the unused public mutator and checks that browser storage can read back the key before reporting a successful save; storage-blocked success/degraded paths have regression tests pending CI execution.
- `createOperationEnvelope` has no production call sites in the current source search. `BrainOrchestrator` invokes the model gateway with only history, userText and systemInstruction; `BrainModelGateway` input types do not yet carry operationId/correlationId/causationId/idempotency or prompt/provider provenance. This is the material generation-operation governance gap. The next slice should trace the originating user action and existing operation identity, then propagate optional metadata through the existing gateway/receipt owners with failing tests; do not mint a parallel operation ledger or create IDs unrelated to the initiating action.
- Static caller inventory detects named/namespace imports, direct SDK invocations, dynamic Gemini imports, model IDs and credential aliases, but its own limitations state static scan is not runtime reachability proof. Dynamic import, re-export, DI and route edges still require manual caller tracing and deployed runtime proof.

### Phase 1 disposition
The credential-validation boundary hardening is in PR #1217 (draft; tests not executed here). Provider operation identity remains open and is not represented as complete by that PR. BYOK storage architecture remains an ADR decision gate under the existing credential security plan.
