# ViewTube Finish Backlog Registry — 2026-10-29

**Status:** ACTIVE planning registry for unfinished cross-system work.  
**Last reconciled:** 2026-10-29  
**Target branch:** `master/consolidated-feature-integration`  
**Inspected target base:** `aeadc6e42f881b3bc5c2bc96f158892213502e1a`  
**Authority:** `docs/programs/INTEGRATED_APPLICATION.md` owns cross-system program structure; `docs/governance/TASK_AUTHORITY.md` owns exact task identity and lifecycle. This registry is a scoped planning projection, not a second task ledger.

This registry complements the active Settings redesign under `tasks/plan.md` and `tasks/todo.md`. Cross-system completion work lives in `tasks/viewtube-finish-program/`.

## Status semantics

- **DONE** — complete acceptance evidence exists; merged code alone is insufficient.
- **PARTIAL** — some foundations/callers/tests have landed, but at least one mandatory acceptance gate remains.
- **INCOMPLETE** — implementation or verification coverage is missing.
- **PLAN-ONLY / CONCEPTUAL / DEFERRED** — not a production implementation commitment.
- Where status is partial, the evidence note identifies what landed and what remains.

## Program A — Unified Project / Asset / Publish Workflow

| ID | Capability | Current status | Primary dependency | Definition of done / remaining acceptance |
|---|---|---|---|---|
| A01 | Full Asset Engine Studio workspace | INCOMPLETE | ContentBuild + Asset Engine + Studio primitives | Overview / Assets / Generation / Variants / Lineage / Publishing Package / Launch Package / Experiments / Evaluation / History assembled as one production workspace with runtime evidence. |
| A02 | Launch Package | PLAN-ONLY | Publishing Package + community/promo actions | First-class derived launch/promote package exists for posts, Shorts/promos, pinned comment, launch assets, routing and promotion configuration. |
| A03 | Canonical Asset Slot Registry | INCOMPLETE | Asset Engine contracts | Registry defines slot cardinality, asset types, finalization/readiness rules and preferred tools across idea→research→script→media→package→publish→launch. |
| A04 | Complete Project Workspace facade | PARTIAL | Project Builder + ContentBuild | Project/ContentBuild identity foundation exists; complete Overview → Plan → Create → Package → Publish → Performance facade, readiness and Continue routing still need proof. |
| A05 | Destination-specific Context Resolver recipes | PARTIAL | GenerationRequest + ContextManifest + ToolReceipt | Some bounded context recipes exist; complete Script, Storyboard, Thumbnail, Video Director, Editor, Publisher and Community/Launch destination coverage is not proven. |
| A06 | Immutable ApprovedPublishSnapshot | PARTIAL | Publishing Package + PublishTransaction | `ApprovedPublishSnapshot.test.ts` passed 10/10 in GitHub Actions run 40966054493 (`8e713dad`): stable schema/hash, tamper detection and browser-storage integrity are verified. VT-014 server-authoritative persistence/cross-device durability remains open; do not recreate the snapshot contract. |
| A07 | Publish retry/recovery certification | PARTIAL | PublishTransaction + snapshot | Merged PR #1175 added the pre-dispatch marker; merged PR #1206 closes the retry hole by preserving provider-write failures as `ambiguous`, requiring evidence-backed manual applied/not-applied reconciliation, restoring upload + YouTube binding on recovery, and exposing recovery controls in Video Publisher. In run 41010352700, `PublishTransaction.test.ts` passed 20/20, `PublishTransactionYouTubeBridge.test.ts` passed 4/4, production build and local smoke passed. Full certification remains blocked by repository-wide typecheck errors, Studio split-text-input source-governance/static-quality failures, and the chained production-stack fallback test failure. Durable server receipts, cross-device recovery and live provider/runtime certification remain open. |
| A08 | Post-publish ContentBuild loop | PARTIAL | publish binding + analytics-canon + outcome loop | PRs #220/#223/#231 landed identity/receipt, metadata/comparability and Brain-evidence/history foundations. In run 41010352700, the 49-file focused Vitest slice passed 317/317, including `PostPublishAnalyticsBridge.test.ts`, `PostPublicationMetadataGoldenPath.test.ts`, `postPublicationOutcomePipeline.test.ts` and the publishing transaction/bridge tests. These verify exact ContentBuild/snapshot/video/variant lineage, checkpoint/evaluation projection and idempotent receipts at service level. Live YouTube provider/runtime golden path, full release gates and server-authoritative state remain open; A08 is not DONE. |
| A15 | Editor → Asset Engine → outcome closure | INCOMPLETE | editor render + Vault/Asset Engine | Canonical derived render/version is created, selected by Publishing Package and outcome-attributed end-to-end. |
| A27 | Server-authoritative durable persistence | DEFERRED / BLOCKING DEPENDENCY | stabilized contracts | Critical publication/execution state migrates from browser/local foundations to durable server authority without parallel ownership. |

## Program B — Publishing → Analytics → Evaluation → Learning

| ID | Capability | Current status | Primary dependency | Definition of done / remaining acceptance |
|---|---|---|---|---|
| B09 | Unified outcome coverage | INCOMPLETE | BrainOutcomeLedger / domain outcome owners | Publisher, Projects, Editor, Community, experiments, packaging and Brain actions have production outcome writers with shared identity/idempotency evidence. |
| B10 | Evaluation targets for consequential actions | INCOMPLETE | Algorithm/evaluation contracts | Metrics, checkpoint, scope, expected direction and insufficient/not-measurable states are systematic across consequential actions. |
| B11 | Canonical metric-comparability guard | DONE (guard scope) | analytics-canon | Existing todo records VT-001 DONE and VT-023 evaluation integration DONE. Keep VT-024 visual/experiment consumer adoption under B18; do not duplicate the guard. |
| B14 | Comment / Audience learning loop | INCOMPLETE | comment actions + Audience/Channel Intelligence | Draft/refine/post/suggested-video outcomes aggregate before governed promotion; no silent memory mutation. |
| B18 | Analytics/Data Visual final certification | INCOMPLETE | comparability guard + visual controllers | Comparability-aware consumers, visual state coverage and responsive/state regression certification complete. |
| B22 | AI generation observability/evals | PARTIAL | BrainTrace + ToolReceipt + Generation Store | Gemini/provider governance, fallback and Brain evidence continuity have landed in PRs #1104/#1116/#1120/#1131/#1134; complete caller reachability, prompt/context/evidence/model/cost/latency traces and eval baselines remain. PR #1168 is OPEN/DRAFT and excluded from landed evidence. |

## Program C — Brain / Context / Intelligence / Prompt Convergence

| ID | Capability | Current status | Primary dependency | Definition of done / remaining acceptance |
|---|---|---|---|---|
| C12 | Brain active-Project context | PARTIAL | Project/ContentBuild identity | Channel-scoped evidence and retry continuity improved in #1086/#1094/#1104/#1117/#1118; active Project/ContentBuild context consistency across every Brain surface remains unverified. |
| C13 | Opportunity Intelligence production evidence feed | INCOMPLETE | canonical analytics evidence | Deterministic provenance/freshness/confidence/scope feed powers Opportunity → Algorithm/Brain with production caller evidence. |
| C20 | Daily Creator Command Center / Daily Oracle | PARTIAL | Brain + Projects + calendar + evidence | Daily focus, prioritized work, progress/streak, project/calendar handoff and grounded recommendations operate as one verified tool. |
| C21 | AI system source-of-truth/registry program | PARTIAL | current registries + reachability audit | Gemini provider/model governance and version policy landed in #1120/#1131; full tools/prompts/models/settings/surfaces/capabilities/owners registry and reachability governance remain. |
| C23 | Project-grounded RAG | CONCEPTUAL / RESEARCH | Context Resolver + Project/Vault corpus | Retrieval uses project scripts/research/style/assets/versions/Channel Profile with scope/provenance and bounded context. |
| C24 | NVIDIA experiments | RESEARCH / OPTIONAL | provider experiment lane | VSS archive/footage search and Nemotron speech evaluated behind optional adapters; not canonical without evidence. |
| C25 | Google/Veo media-provider integration | INCOMPLETE | media-provider gateway + Asset Engine | text→video/image→video/reference/first-last-frame outputs enter Vault/Asset Engine and canonical timeline via accepted candidate identity. |
| C26 | AI editor sidecar / typed edit patches | CONCEPTUAL | editor contracts + BrainRuntime | AI proposes typed previewable edits with Explain, recipes and prompt/model/seed/reference provenance. |
| C31 | Prompt System Authority + modernization | PARTIAL | Prompt Constitution + Context Resolver + eval harness | Provider governance and caller-inventory tooling are progressing; prompt family ownership/version/context recipes, reachable caller migration, quality baselines and trace provenance remain. |

## Program D — UI / Editor / Analytics / Cleanup / Certification

| ID | Capability | Current status | Primary dependency | Definition of done / remaining acceptance |
|---|---|---|---|---|
| D16 | Remotion preview/final-render parity certification | INCOMPLETE | editor render path | One interpretation path + deterministic fixture suite proves preview/final parity using actual render inspection. |
| D17 | Four-layout editor certification | PARTIAL | editor UI | Portrait, landscape, narrow/tablet and desktop pass full interaction/state/visual matrix. |
| D19 | 10-widget production cohort | MOSTLY INCOMPLETE | widget authority + backend tools | Daily Command, Packaging, Analytics Diagnosis, Retention, Audience Inbox, Publishing Gate, Script, Traffic, Opportunity and Production built/certified as one cohort. |
| D28 | Dead-path / duplicate-authority cleanup | PARTIAL | parity receipts | Studio family/catalog/CSS consolidation landed across #1073–#1085 and #1129–#1152; full production reachability/parity audit and safe-removal receipts remain. |
| D29 | Full responsive/state certification matrix | PARTIAL | current UI systems | Studio mobile/CSS work (#1080), representative coverage (#1110/#1141/#1166), and calendar integration (#1160/#1166) landed. Full desktop/narrow/mobile portrait/mobile landscape and empty/loading/error/partial/ready/disabled/overflow certification remains. |
| D30 | Public Agent Interface / agent readiness | PARTIAL | public site | Public page resolver and endpoint tests landed (#1105/#1121); llms.txt, AGENTS.md, sitemap/meta/JSON-LD/static/Markdown discovery and external readiness rescan remain. |

## Prompt modernization sub-track

| ID | Work | Current status | Remaining acceptance |
|---|---|---|---|
| P01 | Inventory prompt constants, aliases and generator callers | PARTIAL | #1168 proposes static caller inventory tooling but is OPEN/DRAFT; merge, execute, reconcile runtime reachability. |
| P02 | Assign canonical owner/family/version/status | INCOMPLETE | Complete prompt registry coverage. |
| P03 | Mark legacy prompt assertions violating evidence rules | INCOMPLETE | Audit and classify legacy assertions. |
| P04 | Shared Prompt Constitution | INCOMPLETE | Migrate all canonical text/reasoning generation. |
| P05 | Task-specific context recipes | INCOMPLETE | Define and verify per-family recipes. |
| P06 | Deterministic calculations outside prompts | INCOMPLETE | Separate calculations from model interpretation. |
| P07 | Structured outputs | INCOMPLETE | Convert high-value outputs to schemas. |
| P08 | Deterministic validators and bounded repair | INCOMPLETE | Add validation/repair and adversarial fixtures. |
| P09 | Package-first title/thumbnail/hook strategy | INCOMPLETE | Verify integrated package-first strategy. |
| P10 | Style/channel customization policy | INCOMPLETE | Apply canonical style/channel policy. |
| P11 | Rich/sparse/empty/stale/disabled/conflicting fixtures | INCOMPLETE | Build family fixture matrix. |
| P12 | Prompt/context/model provenance traces | INCOMPLETE | Record prompt family/version, context version, requested/served model and evidence refs. |
| P13 | Packaging/SEO prompt migration | INCOMPLETE | Migrate with caller and quality evidence. |
| P14 | Hooks/title/thumbnail/package migration | INCOMPLETE | Migrate with caller and quality evidence. |
| P15 | Scripts/storyboards migration | INCOMPLETE | Migrate with caller and quality evidence. |
| P16 | Community/comments migration | INCOMPLETE | Migrate with caller and quality evidence. |
| P17 | Remaining legacy generator migration | INCOMPLETE | Migrate with caller and quality evidence. |
| P18 | Obsolete alias quarantine/deletion | INCOMPLETE | Zero production reachability + compatibility proof first. |
| P19 | Per-family quality baselines | INCOMPLETE | Establish regression thresholds. |
| P20 | Outcome feedback to prompt evaluation | INCOMPLETE | Measure creator outcomes without causal overclaim. |

## Program 0 — System convergence prerequisite

| ID | Work | Current status | Remaining acceptance |
|---|---|---|---|
| S00 | Production reachability/caller classification | PARTIAL | Diagnostics/governance foundations exist; complete owner-by-owner reachability and caller map remains. |
| S01 | CreatorContextEnvelope + read-only resolver | PARTIAL | Direction exists; complete contract and destination adoption required. |
| S02 | Shared EvidenceRecord projection | PARTIAL | Brain evidence projections exist; full projection contract/adoption without replacing analytics-canon remains. |
| S03 | One-write-owner matrix | INCOMPLETE | Resolve Project/ContentBuild/VideoPackage/PublishingPackage field ownership. |
| S04 | Asset Engine/Vault identity boundary | PARTIAL | Foundations exist; slot/lineage/variant/selection ownership remains. |
| S05 | Creator Operation identity | PARTIAL | GenerationRequest/ToolReceipt foundations exist; end-to-end generation/handoff/receipt/trace identity remains. |
| S06 | Outcome producer identity/idempotency | INCOMPLETE | Define and verify shared producer identity contract. |
| S07 | Donor-harvest/quarantine gate | PARTIAL | Governance rule exists; per-removal donor, parity and rollback receipts remain. |

## Recent evidence and non-evidence (2026-10-29)

**Merged scoped evidence:** #1073–#1085, #1088–#1090, #1093–#1106, #1109–#1110, #1114–#1122, #1129–#1157, #1158–#1167. Use each PR's exact diff/tests for the scope it changed.

**Notable scoped outcomes:**
- Studio primitive families, CSS ownership, confirmed representatives and calendar specimens: #1080, #1110, #1114, #1129, #1133, #1135–#1143, #1152, #1154, #1158–#1166.
- Brain evidence/context continuity and composer contracts: #1086, #1094, #1104, #1117/#1118, #1137, #1147/#1148, #1161.
- Gemini/provider governance: #1116, #1120, #1131, #1134, #1145.
- Diagnostics integration: #1149–#1157 and #1164.
- Public resolver: #1105/#1121.
- Crown Control Room Exchange-only read-only projection: #1167; this is not Task Index mutation or proof of mission completion.
- Calendar integration and confirmed library specimens: #1160/#1166; catalog/SSR coverage does not certify browser/mobile visual behavior.

**Open draft excluded from completion:** #1168 (Gemini streaming authorization/metering parity and static AI generation caller inventory). In run 40966054493, `geminiCustomKeyAccess.test.ts` passed 4/4, `geminiModelGovernance.test.ts` passed 6/6, Brain gateway and JSON-task tests passed, production build and local smoke passed. Full Vitest, typecheck and source governance failed on unrelated existing regressions. The exact standalone focused command and caller-inventory test/audit were not run. The PR remains draft and its merge base now needs reconciliation with the latest target.

## Cross-cutting execution order

1. A06 snapshot immutability and A07 recovery, then A08 identity chain.
2. B09/B10/B14/B22 outcome/evaluation producer and provenance coverage.
3. C12/C13 Creator Context and Opportunity evidence.
4. C31/P01 prompt inventory, governance, family migration and eval baselines.
5. A01–A05/A15 Project/Asset UX after snapshot/identity contracts.
6. D16/D17/D19/D29 responsive/render/widget certification.
7. A27/C21/D28/D30/S00–S07 durability, reachability, cleanup and release readiness.

## Already landed / do not recreate

Do not open new foundational work for:
- Video Package → ContentBuild production synchronization;
- Publishing Package;
- PublishTransaction foundation;
- Dashboard Asset Engine PUBLISH view;
- Studio Publishing Cockpit;
- Video Publisher transaction integration;
- GenerationRequest / ToolReceipt foundation;
- Brain typed evidence projection;
- anomaly scanner production reachability;
- Project → ContentBuild identity foundation;
- mobile editor orientation preservation;
- Settings UX toggles already present;
- recent Studio primitive family, compact sizing, tooltip, skeleton and catalog representative work;
- Channel Overview donut/area-chart additions;
- calendar Studio control integration and calendar representative specimens;
- unified diagnostics adapter foundation for the six critical systems.

“Do not recreate” does not mean the capability is DONE; remaining integration, test, runtime, persistence and certification work stays open above.

## Completion rule

A backlog item is not complete because a type/interface exists or a PR merged. It requires:
- canonical owner;
- reachable production caller;
- persistence/identity contract where applicable;
- focused tests;
- end-to-end or visual/runtime certification;
- documentation update;
- no parallel superseded path left active without an explicit compatibility reason;
- Task Authority-compatible evidence/receipt for DONE.

## Reconciliation limitation

This update reconciles the three Finish Program files, their referenced authorities, capability homes/plan families and recent PR metadata/descriptions through #1168. It does not execute repository tests/builds/runtime checks, inspect every changed file in all historical PRs, or complete the Task Index VNext migration. No such verification is claimed.
