# ViewTube Source-Code AI / Generation Audit — 2026-10-29

**Audit date:** 2026-10-29  
**Repository:** `viewtube-dev/viewtube`  
**Branch audited:** `master/consolidated-feature-integration`  
**Audited commit:** `a338f0f8a31e10ccf85a4592cbd00b84f7a4192e`  
**Recursive tree:** `8805a892959d0bb8b2851f6e8176cca967182979`  
**Historical baseline:** [2026-10-05 source-code AI generation audit](./VIEWTUBE_SOURCE_CODE_AI_GENERATION_AUDIT_2026-10-05.md)

## Executive finding

The October 5 conclusion that the repository has no executable AI generation runtime is **historical and does not describe this branch**.

The October 29 integration branch contains executable Gemini generation, a substantial AI Brain service layer, evidence/context resolution, prompt source code, persistence APIs, model governance, and automated tests. It is not accurate to classify these systems as documentation-only.

The remaining problem is **incomplete convergence and governance**: much of the production prompt/generation surface still uses legacy Gemini exports; the prompt registry explicitly reports caller/reachability population as incomplete; the Brain gateway is an adapter over Gemini rather than a provider-independent implementation; and generation provenance is not uniformly established for every legacy call path.

## 1. Scope and repository inventory

The audit resolved the requested branch head and inspected its recursive Git tree.

| Measure | Result |
|---|---:|
| Recursive tree entries | 3,966 |
| Files | 3,521 |
| Directories | 445 |
| Files under `src/` | 2,189 |
| Files under `src/services/brain/` | 227 |
| Brain service test files | 101 |
| Code files across the repository | 2,261 |

This inventory materially differs from the October 5 audited `main` tree. The two audits refer to different commits and branches and must not be conflated.

## 2. Provider and generation runtime

**Classification: CODE-VERIFIED**

Primary implementation: `src/services/gemini.ts`.

Verified implementation indicators include:

- `@google/genai` SDK and `GoogleGenAI` client construction.
- `models.generateContent` and `models.generateContentStream`.
- Canonical model IDs, capability-aware fallback sequencing, and failure classification.
- Structured JSON output using provider response schemas.
- Image, video, speech, and other generation functions.
- Google Search grounding and source citation extraction.
- Model identity metadata on structured Brain responses.

The inspected source includes named generation functions for SEO, keyword analysis, thumbnails, scripts, strategy, community content, structured Brain responses, image/video, and other creator workflows.

**Provider boundary:** Google Gemini is the verified executable provider. The inspected evidence does not establish equivalent production runtime integrations for OpenAI or Anthropic. A gateway interface must not be described as proof that multiple providers are implemented.

## 3. Brain runtime and architecture

**Classification: CODE-VERIFIED, with convergence work remaining**

Relevant source:

- `src/services/brain/BrainOrchestrator.ts`
- `src/services/brain/runtime/BrainRuntime.ts`
- `src/services/brain/runtime/BrainModelGateway.ts`
- `src/services/brain/runtime/BrainJsonTask.ts`
- `src/services/brain/CreatorContextResolver.ts`
- `src/services/brain/BrainContextBroker.ts`
- `src/services/brain/BrainEvidenceQuality.ts`
- `src/services/brain/BrainTaskProfileRegistry.ts`
- `src/services/geminiModelGovernance.ts`

The Brain orchestrator calls the model through `defaultBrainModelGateway`; the gateway currently adapts to existing Gemini functions. The JSON task seam resolves bounded creator/project context and records a limited runtime lineage envelope.

This is a valid incremental migration seam. It is not yet a provider-neutral runtime implementation, and it does not establish that every specialist generation surface has migrated through the seam.

Existing tests include the Brain model gateway boundary and JSON-task runtime contract.

## 4. Prompt registry and migration state

**Classification: CODE-VERIFIED inventory; migration status explicitly incomplete**

Source of authority: `docs/specifications/PROMPTS.md`  
Inventory: `docs/specifications/prompt-registry.json`

Registry version: `viewtube-prompt-registry-v3`.

| Inventory category | Count |
|---|---:|
| Legacy prompt constants | 49 |
| Legacy Gemini exports | 49 |
| Oracle templates | 7 |
| Brain task profiles | 14 |
| Governed asset strategies | 2 |
| Required future provenance fields | 14 |

Recorded statuses:

- 48/49 legacy prompt constants: `legacy_migration_required`.
- 1/49 legacy prompt constants: `retain_as_version_marker`.
- 45/49 legacy Gemini exports: `legacy_reachability_and_migration_required`.
- 3/49 legacy Gemini exports: provider or canonical helpers.
- 1/49 legacy Gemini exports: versioned, validated, and routed through the Brain JSON gateway.

The registry's own status is:

`governance_contract_defined_migration_and_reachability_population_incomplete`.

The registry requires stable IDs, canonical ownership, production callers, prompt family/version, constitution/context-resolver/schema versions, requested/served model, evidence and project/style lineage where applicable, evaluation baseline, and reachability status.

**Important:** the counts above are inventory statuses, not proof that every entry is currently production reachable. Caller-level reachability and quality-baseline mapping remain incomplete. Do not delete or bulk-migrate legacy prompts until the registry's migration gates are satisfied.

## 5. Persistence and evidence

**Classification: CODE-VERIFIED**

Inspected source includes:

- `api/brain-intelligence.mjs`
- `server/brain-intelligence-store.mjs`
- `src/services/brain/BrainContextBroker.ts`
- `src/services/brain/BrainEvidenceQuality.ts`

The API/store implement Brain intelligence persistence and PostgreSQL-backed storage. This is distinct from the Gemini model invocation path, which is in the client-side service module.

Evidence-aware structured response contracts include claim text and canonical evidence IDs. Their existence does not prove every legacy generation call uses them.

## 6. Security and metering finding: streaming parity

The pre-remediation implementation of `getAiClient().models.generateContentStream` enforced only the Beta-plan BYO-key restriction before calling the provider. Unlike `generateContent`, it did not visibly apply the same signed-in account check, preflight credit check, or post-generation metering path.

This created a potential enforcement gap for streamed generation.

**Remediation on branch `audit/ai-generation-priority-remediation-2026-10-29`:**

- Apply the same account snapshot and authentication checks as non-streaming generation.
- Apply entitlement and preflight credit checks.
- Preserve the localhost development bypass.
- Preserve authenticated custom-key policy.
- Aggregate usage metadata from streamed chunks.
- Charge through the existing unified-account credit path or existing local meter path after stream consumption.
- Use the existing estimate fallback when provider usage metadata is absent.
- Do not charge BYO-key requests through ViewTube metering.

Regression tests were added for authenticated custom-key streaming and rejection of signed-out custom-key streaming.

**Verification status:** source and test changes are committed to the remediation branch. The focused Vitest command must pass in CI before this finding is certified closed. The implementation has not been independently executed in a local checkout during this audit.

**Additional security review remains required.** On the current target head, `src/services/keyVault.ts` stores the Gemini credential in browser `localStorage` under the `yt_api_key` and legacy alias keys; `src/context/GeminiKeyContext.tsx` loads and saves that value in the browser; and `src/services/gemini.ts` constructs `GoogleGenAI` in the client and accepts `VITE_GEMINI_API_KEY` / `VITE_GOOGLE_API_KEY` build-time values. These are concrete browser-exposure surfaces, not a server-side secret boundary. Do not claim that localStorage is encrypted. A proper remediation needs an explicit product decision between (a) user-managed BYO credentials with documented browser threat boundaries and strict XSS controls, and (b) a server-side provider proxy with user-scoped authorization, secret storage, quotas, and abuse controls. This audit does not certify either design.

## 7. Tests and CI evidence

Existing relevant test assets include:

- `src/services/__tests__/geminiCustomKeyAccess.test.ts`
- `src/services/__tests__/geminiModelGovernance.test.ts`
- `src/services/brain/__tests__/BrainModelGatewayBoundary.test.ts`
- `src/services/brain/runtime/BrainJsonTask.test.ts`
- `scripts/audit/prompt-registry-governance.test.mjs`
- `scripts/audit/ai-systems-governance.test.mjs`

Relevant repository commands include:

- `npx vitest run src/services/__tests__/geminiCustomKeyAccess.test.ts src/services/__tests__/geminiModelGovernance.test.ts src/services/brain/__tests__/BrainModelGatewayBoundary.test.ts src/services/brain/runtime/BrainJsonTask.test.ts`
- `npm run test:prompt-registry-governance`
- `npm run test:ai-systems-governance`
- `npm run typecheck`
- `npm run build`

The prior target and the remediation head both report Vercel `build-rate-limit` failures for the `viewtube`, `viewtube-x`, and `viewtube-nyas` deployment checks. These are deployment-check failures, not evidence of failing unit tests. No GitHub Actions workflow runs were returned for the remediation commit, so the focused Vitest, governance, typecheck, and build commands remain unexecuted/unverified here. This audit does not claim tests passed.

## 8. Priority remediation ledger

| Priority | Work | Status |
|---|---|---|
| P0 | Streaming authentication, entitlement, and metering parity | Implemented on remediation branch; CI verification pending |
| P0 | Add regression coverage for authenticated and signed-out custom-key streams | Added on remediation branch; CI verification pending |
| P1 | Map every legacy prompt/export to real production callers | Not complete; must be generated from target-branch call-site evidence |
| P1 | Assign canonical owner/family/context recipe/schema and migration gates | Governance contract exists; population incomplete |
| P1 | Route all eligible generation surfaces through BrainRuntime/BrainModelGateway | Partial; do not create parallel providers or orchestration |
| P1 | Standardize prompt/model/evidence/output provenance across all generation paths | Partial; JSON-task lineage exists, legacy coverage incomplete |
| P1 | Review client-side key exposure and production `VITE_*` configuration | Open security review |
| P2 | Establish representative golden fixtures and quality baselines before prompt migrations | Not complete |
| P2 | Execute focused, full, typecheck, build, and production-stack suites | Must be confirmed by CI |
| P2 | Certify API persistence, authorization, and evidence lineage end-to-end | Partial; focused integration verification required |

## 9. Required completion gates

A prompt/generation entry is not certified migrated until all applicable conditions are met:

1. All production callers are inventoried.
2. Canonical owner and prompt family are assigned.
3. Context recipe and output schema are defined.
4. Representative fixtures exist.
5. A quality baseline is recorded and compared.
6. One caller/surface is migrated at a time.
7. Runtime reachability is verified.
8. Legacy code is removed only after zero production reachability is demonstrated.
9. Model/evidence/output provenance is recorded on the real caller path.
10. Focused and full regression tests pass.

## 10. Final conclusion

The October 29 branch contains a real, substantial AI generation runtime. The October 5 audit remains useful as a historical baseline for its own branch/commit, but its no-runtime conclusion must not be applied to the current integration branch.

The most urgent discovered runtime defect was the weaker streaming authorization/metering path. A focused remediation and regression tests have been committed to a dedicated branch. The remaining major work is governed migration and certification—not wholesale replacement of Gemini, Brain, prompt, or persistence systems.

**Audit classification:** runtime present; generation governance partially consolidated; prompt reachability population incomplete; provider-neutrality not established; streaming remediation awaiting CI proof; security and end-to-end certification still open.
