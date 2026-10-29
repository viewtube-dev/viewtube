# ViewTube Finish Program — Master To-Do

> **Authority boundary:** Cross-system program authority is `docs/programs/INTEGRATED_APPLICATION.md`; exact task identity and lifecycle authority is `docs/governance/TASK_AUTHORITY.md`. This file is a detailed execution projection and preserves A/B/C/D/P/S aliases and acceptance detail. It does not create a second task ledger. The dated Finish Program document remains donor/provenance.

**Reconciliation snapshot:** 2026-10-29  
**Target branch:** `master/consolidated-feature-integration`  
**Inspected target base:** `aeadc6e42f881b3bc5c2bc96f158892213502e1a` (PR #1168 base SHA; latest target base represented in the inspected PR set)  
**Evidence window inspected:** current target branch documentation plus recent PR history #1069–#1168. PR merge is evidence of integration only, not runtime completion.

Source registry: `tasks/viewtube-finish-program/BACKLOG-REGISTRY.md`  
Execution plan: `tasks/viewtube-finish-program/plan.md`  
Program authority: `docs/programs/INTEGRATED_APPLICATION.md`  
Task lifecycle authority: `docs/governance/TASK_AUTHORITY.md`

## Status key

- `[x]` — acceptance scope is complete under the available evidence.
- `[ ]` — open, partial, planned, blocked, or not yet independently certified. The note must state which.
- A merged PR, type/interface, successful build, or catalog specimen does not independently satisfy a full capability's definition of done.

## Program A — Project / Asset / Publish

- [ ] **A01** Build full Asset Engine Studio workspace. — Open; the full Overview/Assets/Generation/Variants/Lineage/Publishing Package/Launch Package/Experiments/Evaluation/History workspace is not certified.
- [ ] **A02** Implement canonical Launch Package. — Plan-level; no production acceptance evidence reviewed.
- [ ] **A03** Implement Asset Slot Registry. — Open; cardinality, asset-type, finalization/readiness and preferred-tool rules still need a canonical production contract.
- [ ] **A04** Assemble complete Project Workspace facade + readiness/Continue routing. — Partial; Project/ContentBuild identity foundations exist, but the complete creator-facing lifecycle facade is not certified.
- [ ] **A05** Migrate destination-specific Context Resolver recipes. — Partial; explicit recipes and bounded context exist in parts of the system; complete destination coverage is not proven.
- [ ] **A06** Certify immutable ApprovedPublishSnapshot. — Partial foundation is reported in prior program notes; do not treat the snapshot-to-transaction freeze, stable hash, exact revision binding and mutation-isolation acceptance as complete until focused tests and runtime/recovery evidence are attached.
- [ ] **A07** Certify PublishTransaction retry/recovery/idempotency. — Open; durable step receipts, reload recovery, remote YouTube reconciliation, optional-step retry, manual recovery and duplicate-upload prevention remain acceptance gates.
- [ ] **A08** Complete post-publish ContentBuild identity + checkpoint chain. — Partial. PRs #220/#223/#231 are recorded as landed foundations for identity/replay-safe receipts, metadata/analytics comparisons and Brain evidence/history projections. Focused tests, typecheck/build, golden-path verification and server-authoritative persistence remain open.
- [ ] **A15** Close Editor → derived asset → Publishing Package → outcome loop. — Open; final render identity and outcome attribution need end-to-end proof.
- [ ] **A27** Plan and execute server-authoritative persistence migration after contracts stabilize. — Deferred/blocking dependency; browser/local persistence remains a durability boundary to resolve without parallel ownership.

## Program B — Outcomes / Evaluation / Learning

- [ ] **B09** Complete production outcome writers across Publisher, Project, Editor, Community, experiments, packaging and Brain. — Partial/incomplete; producer coverage and idempotent identity need a system-by-system evidence matrix.
- [ ] **B10** Add evaluation targets/checkpoints to all consequential actions. — Open; target, scope, checkpoint, expected direction and insufficient/not-measurable semantics are not certified across all action families.
- [x] **B11** Implement canonical metric-comparability guard. — Guard implementation is recorded as VT-001 DONE and evaluation integration VT-023 DONE. Keep visual/experiment consumer adoption (VT-024) separate; it remains part of B18/consumer certification rather than reopening the guard itself.
- [ ] **B14** Complete Comment/Audience outcome → theme → governed learning loop. — Open; draft/refine/post outcomes, aggregation and governed promotion are not end-to-end certified.
- [ ] **B18** Complete Analytics/Data Visual safety + responsive/state certification. — Open; comparability-aware consumers, visual state coverage and responsive regression evidence remain.
- [ ] **B22** Complete AI generation observability/eval coverage. — Partial; Gemini governance/fallback and Brain evidence continuity work landed in PRs #1104, #1116, #1120, #1131 and #1134, but complete caller reachability, prompt/context/evidence/model/cost/latency traces and eval baselines are not proven. PR #1168 is OPEN/DRAFT and is not counted as landed.

## Program C — Brain / Intelligence / Prompts

- [ ] **C12** Make active Project/ContentBuild context consistent across Brain. — Partial; channel-scoped evidence and retry continuity improved in PRs #1086, #1094, #1104, #1117/#1118. Project/ContentBuild context consistency across every Brain surface and destination remains unverified.
- [ ] **C13** Build Opportunity Intelligence canonical evidence feed. — Open; deterministic provenance/freshness/confidence/scope feed needs production caller and end-to-end evidence.
- [ ] **C20** Finish Daily Creator Command Center / Daily Oracle. — Partial/planned; full daily focus, progress, calendar/project handoff and grounded recommendation loop is not certified.
- [ ] **C21** Finish machine-readable AI system registry/source-of-truth program. — Partial; Gemini provider/model governance and version policy documentation landed in PRs #1120/#1131, but full tools/prompts/models/settings/surfaces/capabilities/owners reachability registry remains open.
- [ ] **C23** Design/implement Project-grounded RAG behind canonical Context Resolver. — Research/design stage; no accepted production implementation evidence reviewed.
- [ ] **C24** Evaluate NVIDIA VSS archive search and Nemotron speech as optional experiments. — Opportunity/research only; not a committed production dependency.
- [ ] **C25** Build Google/Veo media-provider adapter through Asset Engine/Vault. — Open; provider adapter and canonical asset/timeline acceptance not demonstrated.
- [ ] **C26** Build typed AI editor sidecar/patch proposal architecture. — Conceptual; typed previewable edit proposals and provenance are not demonstrated.
- [ ] **C31** Complete Prompt System Authority, prompt registry, migrations and eval-driven prompt optimization. — Partial; Gemini provider governance and caller-inventory work are progressing. PR #1168 remains an open draft; inventory is not proof of runtime reachability, and prompt-family baselines/migrations/provenance remain open.

## Program D — UI / Editor / Widgets / Cleanup

- [ ] **D16** Certify Remotion preview/final-render parity. — Open; deterministic fixture and rendered-output parity evidence required.
- [ ] **D17** Certify editor portrait/landscape/narrow/desktop layouts. — Partial foundations exist; full four-layout/state matrix not certified.
- [ ] **D19** Build/certify the 10-widget production cohort. — Mostly unfinished; each widget requires canonical owner, production caller, six-state behavior and responsive/runtime evidence.
- [ ] **D28** Complete dead-path / duplicate-authority convergence audit and removals. — Partial; Studio family/catalog/CSS consolidation landed across PRs #1073–#1085 and #1129–#1152, but full production reachability/parity audit and safe removal receipts remain.
- [ ] **D29** Complete full responsive/state matrix. — Partial progress: Studio mobile/CSS reconciliation (#1080), confirmed primitive representative coverage (#1110/#1141/#1166), and calendar control/catalog integration (#1160/#1166) landed. These are not full desktop/narrow/mobile portrait/mobile landscape plus empty/loading/error/partial/ready/disabled/overflow certification.
- [ ] **D30** Ship public agent-readiness/discovery program and rescan. — Partial foundation: public page resolver work landed in PR #1105 and endpoint test work in #1121. llms.txt/AGENTS/sitemap/metadata/non-JS discovery and external agent-readiness rescan still require explicit evidence.

## Prompt modernization sub-track

- [ ] **P01** Inventory every explicit prompt constant, alias and generator caller. — Partial; PR #1168 adds a static generation caller inventory tool, but its branch is open/draft and runtime reachability mapping remains.
- [ ] **P02** Assign canonical owner/family/version/status to each prompt.
- [ ] **P03** Mark legacy prompt assertions that violate current evidence rules.
- [ ] **P04** Add shared Prompt Constitution to all canonical text/reasoning generation.
- [ ] **P05** Define task-specific context recipes per prompt family.
- [ ] **P06** Separate deterministic calculations from model interpretation.
- [ ] **P07** Convert high-value outputs to structured schemas.
- [ ] **P08** Add deterministic validators and bounded repair.
- [ ] **P09** Add package-first title/thumbnail/hook strategy.
- [ ] **P10** Add style/channel customization policy.
- [ ] **P11** Add rich/sparse/empty/stale/disabled/conflicting fixtures.
- [ ] **P12** Record prompt family/version, context version and requested/served model in traces.
- [ ] **P13** Migrate packaging/SEO legacy prompts.
- [ ] **P14** Migrate hooks/title/thumbnail/package prompts.
- [ ] **P15** Migrate scripts/storyboards.
- [ ] **P16** Migrate community/comments.
- [ ] **P17** Migrate remaining legacy generators.
- [ ] **P18** Quarantine/delete obsolete prompt aliases only after zero production reachability.
- [ ] **P19** Establish per-family quality baselines and regression thresholds.
- [ ] **P20** Add creator outcome + measured-performance feedback to prompt evaluation without treating correlation as causation.

## Program 0 — System convergence prerequisite

Source: `docs/architecture/VIEWTUBE_SYSTEM_CONVERGENCE_AND_CONSOLIDATION.md`

- [ ] **S00** Complete production reachability/caller classification for overlapping AI/context/evidence/project/asset systems. — Partial governance/diagnostic foundations exist; full owner-by-owner reachability matrix remains.
- [ ] **S01** Define CreatorContextEnvelope + read-only resolver over existing owners. — Partial direction exists; complete contract and destination adoption not certified.
- [ ] **S02** Define shared EvidenceRecord projection without replacing analytics-canon. — Partial; Brain evidence projections exist, but full canonical projection contract/adoption is open.
- [ ] **S03** Produce one-write-owner matrix for Project/ContentBuild/VideoPackage/PublishingPackage fields. — Open.
- [ ] **S04** Define shared Asset Engine/Vault asset identity boundary. — Partial foundation; full slot/lineage/variant/selection ownership remains.
- [ ] **S05** Define Creator Operation identity across generation/handoff/receipt/trace. — Partial; GenerationRequest/ToolReceipt foundations exist, but end-to-end operation identity is not certified.
- [ ] **S06** Define shared outcome producer identity/idempotency contract. — Open.
- [ ] **S07** Donor-harvest and quarantine rules pass before any subsystem deletion. — Governance rules exist; per-removal parity and donor-harvest receipts remain required.

## Recent evidence ledger (2026-10-29)

Merged PRs are recorded as evidence of scoped changes, not whole-program completion:

- **Studio / primitive / responsive progress:** #1073–#1085, #1088–#1090, #1103, #1110, #1114, #1119, #1122, #1129, #1133, #1135–#1143, #1146–#1148, #1152, #1154, #1158–#1162, #1165–#1166.
- **Brain / Gemini / prompt / evidence progress:** #1086, #1089, #1093–#1104, #1109, #1116–#1118, #1120, #1131, #1134, #1142, #1145, #1161.
- **Diagnostics / account / analytics integration progress:** #1149–#1151, #1153, #1155, #1164, plus crash diagnostics #1156–#1157.
- **Public resolver / discovery foundation:** #1105 and #1121.
- **Crown Control Room Exchange-only read-only runtime:** #1167. This strengthens governance/evidence visibility but does not mutate Task Index or certify underlying missions.
- **Calendar Studio controls and true primitive representatives:** #1160 and #1166. Catalog/SSR contract coverage is not a substitute for browser/mobile visual certification.
- **Not landed:** #1168 remains OPEN/DRAFT; do not mark its Gemini streaming changes or caller inventory as merged/completed.

## Final finish-program checkpoint

- [ ] Every item has one canonical owner and a production caller.
- [ ] Approved publish inputs are immutable/idempotent.
- [ ] Publish → analytics → outcome → evaluation → learning identity is continuous.
- [ ] Brain sees correct Project/Opportunity context.
- [ ] Every consequential AI generation is prompt/version/evidence/model traceable.
- [ ] No legacy prompt or direct provider path remains reachable without documented compatibility purpose.
- [ ] Desktop/narrow/mobile portrait/mobile landscape + state matrix is certified.
- [ ] Dead/duplicate owners are removed only after parity.
- [ ] All DONE claims have Task Authority-compatible evidence receipts and canonical task identity.

## Next execution priorities

1. Finish independent verification of current-target blockers and the open #1168 remediation before treating AI streaming authorization/metering or prompt inventory as complete.
2. Close publishing snapshot freeze + transaction recovery as one tested vertical slice (A06 → A07 → A08).
3. Build the producer/target/checkpoint evidence matrix for B09/B10/B14/B22 and connect it to analytics-canon without parallel ledgers.
4. Complete C12/C13 context and opportunity evidence through existing Creator Context and Brain owners.
5. Complete D29 responsive/state certification from the existing Studio/calendar/widget representatives; do not confuse catalog presence with visual/runtime certification.
6. Continue convergence cleanup only after caller/reachability, donor harvest, parity and rollback receipts.

## Verification boundary

This is a documentation reconciliation based on repository authorities, the three current Finish Program files, the plan-family/capability-home registries, the Integrated Application Program, and recent PR metadata/descriptions. It did **not** execute repository tests, typecheck, build, browser/runtime flows, authenticated provider checks, deployment checks, or the full Task Index migration. Those remain explicit verification work, not implied successes.
