# ViewTube AI Systems Management — To Do

## Authority / documentation
- [x] Finish AI historical archive link audit.
- [x] Register living master and supporting references everywhere agents orient.
- [x] Add stable document authority/freshness rules to AI Governor references.
- [x] Confirm no old AI audit/phase doc is still presented as current.

## Skill structure
- [x] Create `references/ai-systems-management.md`.
- [x] Create `references/work-claims-and-receipts.md`.
- [x] Create `references/authority-and-freshness.md`.
- [x] Create `references/prompt-and-model-governance.md`.
- [x] Create `references/donor-migration.md`.
- [ ] Keep SKILL.md under 500 lines and make it the MOC.

## Registries / schemas
- [x] Authority record schema.
- [x] Agent report schema.
- [x] Evidence reference schema.
- [x] Prompt reference schema.
- [x] Managed action schema.
- [x] Seed system registry.
- [x] Seed capability registry.
- [x] Seed integration registry.
- [x] Seed donor registry.
- [x] Seed plans registry.
- [ ] Seed agents registry. Prefer Herald-derived projection; add only if an agent-class registry proves necessary.

## Reporting / coordination
- [ ] Claim event.
- [ ] Progress checkpoint.
- [ ] Blocked event.
- [ ] Claim release.
- [x] Completion receipt projection and validation.
- [ ] Handoff receipt.
- [x] Stale claim detection from live Herald writer locks.
- [x] Collision detection from explicit Herald writer-lock paths.
- [x] Herald adapter/normalization for current + legacy thread shapes.

## Runtime projection
- [~] BrainTrace projection. `src/services/brain/BrainRuntimeSnapshot.ts` already projects trace summaries and provenance chains; management-surface integration and completeness remain open.
- [~] GenerationRequest/ContextManifest/ToolReceipt projection. Existing `BrainRuntimeSnapshot.ts` joins these records; verify missing joins and expose them through the read-only management projection.
- [~] ContentBuild/Project projection. Existing `BrainRuntimeSnapshot.ts` summarizes active Project and ContentBuild; full workspace/UI coverage remains open.
- [~] Vault/Asset refs. Existing snapshot exposes asset, version, variant and relationship IDs from receipts/builds; verify Vault resolution and durable asset details.
- [~] Outcome/evaluation/learning refs. Snapshot links outcomes and algorithm evaluation/candidate/review/promotion event IDs; verify canonical record resolution and full evaluation payload references.
- [~] Prompt/model provenance joins. Snapshot exposes prompt versions and requested/served model where trace reports it; complete registry caller coverage and prompt-to-output joins remain open.

## Health / CI
- [x] Multi-registry audit coverage.
- [x] Live Herald claim ingestion for stale-lock detection.
- [~] JSON schema validation. Record-level validation is enforced; full JSON Schema engine validation remains open.
- [ ] Broken docs refs.
- [x] Duplicate owner detection by bounded current concern.
- [ ] stale audited-main detection.
- [ ] reachability audit.
- [ ] writer-less ledger/store detection.
- [ ] direct provider bypass detection.
- [ ] analytics-canon bypass detection.
- [x] Unclosed/stale writer-lock detection.
- [x] Explicit terminal-thread completion without PROVEN receipt.
- [ ] prompt provenance coverage.

## Brain Hub UI
- [ ] Overview.
- [ ] Systems.
- [ ] Agents & Runs.
- [ ] Prompts.
- [ ] Plans.
- [ ] Evidence & Traces.
- [ ] Knowledge & Learning.
- [ ] Audit.
- [ ] Health.
- [ ] Responsive/state certification.

## Public agent-readiness track
- [ ] Root llms.txt.
- [ ] Decide public-safe llms-full.txt.
- [ ] Improve AGENTS.md structure.
- [ ] sitemap.xml.
- [ ] improve sitemap.md.
- [ ] canonical/meta/OG/JSON-LD.
- [ ] static/SSR public text.
- [ ] Markdown alternates/frontmatter/content negotiation where appropriate.
- [ ] Re-run Agent Ready scan and preserve score delta.

## Final certification
- [ ] blind-agent test passes.
- [ ] trigger boundary tests pass.
- [ ] no competing AI governor/Brain introduced.
- [ ] all current AI work has a claim/receipt path.
- [ ] all canonical records expose freshness/main SHA.
- [ ] all historical docs have explicit successors.
- [ ] read-only AI Systems management workspace verified before any managed action is enabled.


## Historical branch evidence — not current-target certification

The following figures belong to the September 2026 governance branch and must not be treated as current target evidence until rerun on the exact current target SHA.

- audited main: `fbc7d25c71fa89c312da32280d9f77182065b42a`
- branch: `feat/ai-systems-governance-mainline-2026-09-26`
- authority records: 41
- broken source refs: 0
- governance commands present: 3
- Herald work projection: read-only
- governance tests: 12/12
- Herald projection tests: 8/8
- live governance audit: 5 registries / 41 records / 9 claims / 5 receipts / 0 blockers
- current-main merge: pending


## Current-target reconciliation — 2026-10-29

- Target ref inspected: `master/consolidated-feature-integration`.
- Current exact branch HEAD SHA was not independently returned by the available branch lookup; refresh and record it in Phase 0 before certifying registry freshness.
- Confirmed reusable runtime projection: `src/services/brain/BrainRuntimeSnapshot.ts` and `src/services/brain/BrainRuntimeSnapshot.test.ts`. It already joins Project/ContentBuild, GenerationRequest, ContextManifest, ToolReceipt, BrainTrace, BrainOutcome and explicit AlgorithmIntelligenceEvent ancestry, including evaluation and learning lifecycle event IDs.
- Confirmed current canonical prompt authority: `docs/specifications/PROMPTS.md` and `docs/specifications/prompt-registry.json`.
- Do not build a second projector until Phase 6 inventories the precise gaps (Vault resolution, durable evaluation/learning record resolution, registry joins, freshness/main SHA and management UI adoption).
- September branch counts, tests and audit figures above are historical evidence only. No tests, build, typecheck, lint, browser, or live governance audit were executed in this documentation pass.

Execution plan: `tasks/p1-canonical-system-integration/workstreams/ai-brain-quality-and-systems-management/plan.md`.
