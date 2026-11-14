# ViewTube Source Reconciliation Ledger

**Production Date:** 2026-11-13  
**Last Edited:** 2026-11-13  
**Class:** AUDIT  
**Status:** ACTIVE  
**Concern:** source inventory, authority mapping, donor reconciliation and phased documentation consolidation  
**Owner:** Documentation Governance + Integrated Application Program  
**Registry ID:** DOC-AUDIT-SOURCE-RECONCILIATION-20261113  
**Last Audited Main SHA:** `767a223bb383addcaf6492d67a3b29ac53934b43` — exact target-branch base SHA returned by GitHub compare for PR #1259  
**Supersedes:** none  
**Related Authorities:** docs/registry.json; docs/governance/DOCUMENTATION.md; docs/VIEWTUBE_MASTER_KNOWLEDGE_BASE.md; docs/programs/INTEGRATED_APPLICATION.md

## 1. Purpose and audit boundary

This ledger records the first repository-backed pass to consolidate ViewTube's project, product, Studio, Brain, research and engineering documentation into eight navigable knowledge areas.

Repository inspected: `viewtube-dev/viewtube`  
Requested target branch: `master/consolidated-feature-integration`  
Working branch created: `docs/master-knowledge-consolidation-2026-11-13`

This was a targeted audit of known authority paths, documentation registry entries, selected source files, code-search results and open PR search results. It was not a complete recursive filesystem inventory, a full text comparison of every document, a full PR review, a code/test execution, or an account-wide conversation export.

### Status vocabulary

- **VERIFIED_PRESENT:** exact repository path fetched successfully on the working branch based on the requested target.
- **VERIFIED_AUTHORITY:** source explicitly declared current by repository governance or registry.
- **DONOR_OR_HISTORICAL:** retained source material that must not override current authority.
- **CANDIDATE_DONOR:** source found outside the repository or not yet fully reconciled.
- **NOT_FOUND_AT_EXPECTED_PATH:** exact requested path returned 404 or exact-name search did not locate it.
- **NEEDS_FULL_RECONCILIATION:** existence is confirmed, but its unique content, inbound references, implementation claims or status have not been fully audited.
- **NOT_AUDITED:** not inspected in this pass.

## 2. Repository governance findings

| Source | Finding | Disposition |
| --- | --- | --- |
| `docs/registry.json` | Verified present; 71 entries at audit time; machine-readable current documentation authority | Update this registry for every new governed document |
| `docs/governance/DOCUMENTATION.md` | Verified present; mandates one authority per concern, no-loss consolidation, registry metadata, explicit supersession and archive lineage | Governing consolidation contract |
| `docs/DOCUMENTATION_REGISTRY.md` | Verified present; explicitly retained as the Wave 1 baseline/audit inventory, not the current authority | Preserve; do not use it instead of `docs/registry.json` |
| `docs/README.md` | Verified present; current documentation entrypoint and authority map | Updated in this branch to expose the master index and ledger |
| `docs/governance/TASK_AUTHORITY.md` | Verified present; canonical task identity/lifecycle authority | Keep task state here and in the governed Task Index; do not create another task ledger |
| `ideas/registry.json` | Repository search confirms references and its role as the deduplication point for idea sources | Preserve as the canonical idea registry; exact current file content not fetched in this pass |
| `docs/architecture/capabilities.json` | Verified present; capability identities and ownership map | Reuse; do not create a second capability registry |
| `docs/governance/VERIFICATION.md` | Verified present; requires implement → verify → inspect → correct → reverify → receipt | Use for every completion claim |

The repository's documentation governance requires preserving unique material, updating the surviving authority, routing unfinished work to Task Index, and creating a consolidation manifest before removing source documents. No source document was deleted or archived in this initial pass.

## 3. Eight-area source mapping

### Area 1 — Master project, continuity and handoff

**Verified sources**
- `docs/architecture/PRODUCT_ARCHITECTURE.md`
- `docs/programs/INTEGRATED_APPLICATION.md`
- `docs/governance/CONVERSATION_HANDOFFS.md`
- `docs/governance/CONVERSATION_OS.md`
- `docs/governance/TASK_AUTHORITY.md`

**Disposition:** use the existing architecture, program, handoff and task authorities as separate bounded owners. The new Master Knowledge Base is navigation only. Do not create a new project status or task store.

**Remaining:** inspect the current governed Task Index path and verify the project/workstream/task relationships before adding any new work items.

### Area 2 — Product strategy, competitive research and partnership dossier

**Verified sources**
- `docs/architecture/PRODUCT_ARCHITECTURE.md`
- `docs/architecture/capabilities.json`
- `docs/references/DEEP_RESEARCH_CONSTRUCTION_SOURCE.md`
- `docs/programs/INTEGRATED_APPLICATION.md`

**Candidate donor pack outside repository — ChatGPT Library (consolidated into repository dossier)**
- `00_VIEWTUBE_RESEARCH_REFERENCE_MASTER_INDEX.md` — product positioning, evidence taxonomy, source register and navigation for a four-volume research library.
- `01_VIEWTUBE_PRODUCT_MARKET_COMPETITIVE_RESEARCH.md` — customer segments, competitor cohorts, opportunity research and prioritization.
- `02_VIEWTUBE_PARTNER_ECOSYSTEM_AND_BUSINESS_DEVELOPMENT.md` — partner tiers, fit, asks, evidence needs, commercial models and 90-day work sequence.
- `03_VIEWTUBE_TECHNICAL_API_INTEGRATION_AND_RISK_REFERENCE.md` — YouTube/API opportunities, provider candidates, data rights, architecture, security, economics and validation.
- `04_VIEWTUBE_SOURCE_REGISTER_CLAIM_LEDGER_AND_RESEARCH_GAPS.md` — source hierarchy, claim conflicts, capability claim ledger and unresolved research gaps.
- `ViewTube_Master_Research_and_Implementation_Resource.md` and its DOCX companion — 10 proposed capabilities, 20 improvements, 30 provider candidates and 15 YouTube API opportunities.

The pack explicitly states that live competitor/official-source verification did not complete due to insufficient Browser Use credits. Its competitor, provider, pricing, API, partner-program and market claims must not be presented as freshly verified. The key content and claim caveats have now been consolidated into `docs/research/VIEWTUBE_PRODUCT_STRATEGY_COMPETITIVE_PARTNERSHIP_AND_TECHNICAL_DOSSIER.md`; original Library versions remain provenance sources and are not represented as byte-for-byte migrated copies.

**Disposition:** a consolidated repository dossier now exists at `docs/research/VIEWTUBE_PRODUCT_STRATEGY_COMPETITIVE_PARTNERSHIP_AND_TECHNICAL_DOSSIER.md`. It consolidates the 10 capability candidates, 20 improvements, competitor cohorts, 15 YouTube API opportunities, 30 provider candidates, partner map, program-claim ledger, source hierarchy and validation gaps. It remains a source-document reference, not a fresh verified market study. Do not present proposals or inherited claims as verified market facts.

**Remaining:** retrieve and reconcile the full Library source, check repository prior art and current capabilities, then conduct fresh primary-source competitor/provider/partner research. Record source URL, access date, exact claim, excerpt, confidence, recheck date, price basis, API/partner evidence, permissions, terms and data rights.

### Area 3 — Product capability, feature coverage and implementation status

**Verified sources**
- `docs/architecture/PRODUCT_ARCHITECTURE.md`
- `docs/architecture/capabilities.json`
- `docs/governance/TASK_AUTHORITY.md`
- `docs/programs/INTEGRATED_APPLICATION.md`
- Code-owned registries such as `src/views/dashboard/WidgetRegistry.ts` are identified in `docs/README.md`.

**Disposition:** capabilities are already represented by a canonical machine registry. Exact work state belongs to Task Authority/Task Index; code-owned inventories retain their local ownership.

**Remaining:** audit capability-by-capability against current code, tests, UI surfaces and runtime evidence. Build any feature coverage view as a derived report or subordinate specification, not a parallel registry.

### Area 4 — Studio design system and Confirmed Primitive Library

**Verified sources**
- `docs/ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md` — present on the target branch; normative ownership/precedence hierarchy.
- `docs/architecture/VIEWTUBE_TOOLBOX_UI_MASTER_RESOURCE.md`
- `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md`
- `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`
- The defaults index identifies executable owners including `src/studio-ui/tokens.ts`, primitive TSX files, shared stylesheets, the Confirmed Primitive catalog and contract tests.

**Additional branch-only donor sources found**
- `docs/ui/STUDIO_DESIGN_INTELLIGENCE_AND_PRIMITIVE_REGISTRY.md` exists on `fix/studio-controls-regression-recovery-2026-10-31`, but was not found on the requested target branch. It is a source-map/registry foundation, not a replacement for the Confirmed Primitive Library.
- `docs/plans/VIEWTUBE_COMPONENT_STANDARDIZATION_PHASES_0_3_2026-11-11.md` exists on the recovery branch, but was not found on the requested target branch. Its calendar/resource/analytics scope must be reconciled separately from Studio-only changes.

**Disposition:** the previously recorded exact-name gap for `STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md` is corrected: the exact file is present on the target branch and is now linked as a normative hierarchy source.

**Disposition:** the three verified authorities have distinct scopes. The Component Library document is the catalog/primitive-correction authority; the global defaults index is the normative Studio control contract; the Toolbox master owns global Toolbox/SubToolbox behavior. Code/tests remain executable evidence.

**Remaining:** compare the complete current Studio docs against tokens, CSS, primitives, catalog and tests; reconcile the October/November branch and PR donors; update only the correct surviving authority.

### Area 5 — Studio regression, testing and recovery

**Verified sources**
- `tasks/p1-canonical-system-integration/workstreams/studio-controls/README.md` and its checklist/test-plan/agent-brief family are registered in `docs/registry.json`.
- `docs/programs/INTEGRATED_APPLICATION.md`
- Studio authorities in Area 4.
- [PR #1229 — Document Studio Controls regression conversation handoff](https://github.com/viewtube-dev/viewtube/pull/1229) appears in the repository PR search results.

**Disposition:** existing P1 workstream and PR #1229 are source material. This audit did not inspect every source PR, branch diff, CI run or current defect reproduction.

**Remaining:** reconcile defects and decisions against current code and the exact recovery branch head. For each issue record expected behavior, reproduction, source PR/commit, confirmed cause versus hypothesis, implementation status, focused tests, full verification and disposition. Do not close donor PRs or archive handoffs until unique contributions are mapped.

### Area 6 — AI Brain product and technical specification

**Verified current authority**
- `docs/domains/BRAIN.md` is registered as the current Brain domain authority and explicitly supersedes older broad Brain authorities after Phase D migration.
- `docs/specifications/PROMPTS.md` and `docs/specifications/prompt-registry.json`.
- `docs/analytics/VIEWTUBE_ANALYTICS_VT_SYNC_MASTER_RESOURCE.md`.
- `docs/architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md`.
- Current Brain runtime code/tests are the executable source.

**Donor/historical sources**
- `docs/brain/AI_BRAIN_MASTER_RESOURCE.md` is present and contains useful Brain principles, prompts and proposal material; its current registry role and overlap need full reconciliation.
- `docs/brain/VIEWTUBE_AI_SYSTEMS_MASTER_RESOURCE.md` explicitly states Phase D supersession and remains donor/provenance material.
- `docs/brain/UNIFIED_AI_SYSTEM_CANONICAL_CONSOLIDATION_CONTRACT_2026-09-17.md` explicitly states supersession by `docs/domains/BRAIN.md`.

**Disposition:** update `docs/domains/BRAIN.md` for current Brain architecture. Harvest unique proposals from donor sources only after checking current runtime, Prompt Authority, Task Index and existing workstreams.

### Area 7 — Engineering, branch, verification and release operations

**Verified sources**
- `docs/governance/TASK_AUTHORITY.md`
- `docs/governance/VERIFICATION.md`
- `docs/governance/DOCUMENTATION.md`
- `docs/programs/INTEGRATED_APPLICATION.md`
- `docs/deployment/VIEWTUBE_DEPLOYMENT_RELEASE_MASTER_RESOURCE.md`
- `docs/editor/VIEWTUBE_YOUTUBE_EDITOR_SYSTEM_MASTER_RESOURCE.md`

**Disposition:** these authorities already cover task lifecycle, evidence, cross-system convergence, release and editor-specific delivery. Avoid another generic engineering playbook unless a bounded, uncovered gap is demonstrated.

**Remaining:** reconcile the current branch/PR workflow rules with the existing Task Authority, Conversation Handoffs, Integrated Application and Deployment master; record exact commit/PR/CI evidence.

### Area 8 — Research, design and delivery resource library

**Verified sources**
- `docs/registry.json`
- `docs/governance/DOCUMENTATION.md`
- `docs/references/DEEP_RESEARCH_CONSTRUCTION_SOURCE.md`
- `docs/specifications/PROMPTS.md` and prompt registry.
- Existing domain authorities, skills, task workspaces and verification artifacts.

**Candidate donor artifacts in ChatGPT Library**
- `ViewTube Multi-Conversation Recovery Protocol`
- `ViewTube Brain AI System Report`
- `Toolbox HTML Component Library Reference Manifest & Plan`
- `brain-badge-tab-system-plan.md`
- Canonical Component Library HTML
- Studio Calendar Primitive Library HTML

These were surfaced by Library search in the originating conversation. Their full versions, duplicate relationships, repository equivalents and inbound references have not yet been fully reconciled.

**Disposition:** preserve these as candidate donors until content is compared. Do not blindly copy HTML snapshots or historical visual contracts into current authority paths.

## 4. Exact-name source checks

| Requested source name | Result | Next action |
| --- | --- | --- |
| `STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md` | Verified present at `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md` | Retain and update only for its bounded catalog scope |
| `STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md` | Verified present at `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md` | Retain and update with Studio contract changes |
| `docs/ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md` | Verified present on target branch | Retain as normative ownership/precedence hierarchy; reconcile with defaults, Toolbox authority and tokens |
| `docs/brain/AI_BRAIN_MASTER_RESOURCE.md` | Verified present | Check registry role and harvest unique current proposals |
| `docs/domains/BRAIN.md` | Verified present; current Brain authority | Retain as canonical |
| `docs/brain/VIEWTUBE_AI_SYSTEMS_MASTER_RESOURCE.md` | Verified present; explicit Phase D supersession notice | Treat as donor/provenance |
| `docs/brain/UNIFIED_AI_SYSTEM_CANONICAL_CONSOLIDATION_CONTRACT_2026-09-17.md` | Verified present; explicit Phase D supersession notice | Treat as donor/provenance |
| `docs/deployment/VIEWTUBE_DEPLOYMENT_RELEASE_MASTER_RESOURCE.md` | Verified present | Retain as deployment/release authority |
| `docs/architecture/capabilities.json` | Verified present | Retain as capability identity registry |

## 5. PR and branch evidence sampled

GitHub search surfaced the following relevant PRs. Search-result visibility is not a complete status/review/CI audit.

| PR | Title / relevance | Required treatment |
| --- | --- | --- |
| [#1229](https://github.com/viewtube-dev/viewtube/pull/1229) | Studio Controls regression conversation handoff | Reconcile as a source handoff; preserve provenance |
| [#1243](https://github.com/viewtube-dev/viewtube/pull/1243) | Editable StudioSideTextCounter and icon-rail text input families | Inspect exact head, base, diff and checks before status claims |
| [#631](https://github.com/viewtube-dev/viewtube/pull/631) | Studio interaction focus | Donor review required |
| [#935](https://github.com/viewtube-dev/viewtube/pull/935) | Shared stroke contract and split input | Donor review required |
| [#992](https://github.com/viewtube-dev/viewtube/pull/992) | Studio token and focus geometry | Donor review required |
| [#988](https://github.com/viewtube-dev/viewtube/pull/988) | Studio token/CSS/field contract | Donor review required |
| [#644](https://github.com/viewtube-dev/viewtube/pull/644) | AI Brain master resource and skill | Check whether its content is superseded or uniquely useful |
| [#16](https://github.com/viewtube-dev/viewtube/pull/16) | Consolidated master validation draft | Inspect only if relevant to current branch governance; do not infer merge readiness |
| [#452](https://github.com/viewtube-dev/viewtube/pull/452) | Studio controls consolidation | Historical donor review; do not merge without exact-head reconciliation |
| [#713](https://github.com/viewtube-dev/viewtube/pull/713) | Studio/Vault migration cleanup | Draft donor; its own description lists unfinished audits and unrun checks |
| [#718](https://github.com/viewtube-dev/viewtube/pull/718) | Studio field and Vault primitive migrations | Draft donor; its description explicitly blocks merge pending reconciliation and verification |

The Studio recovery branch `fix/studio-controls-regression-recovery-2026-10-31` and requested target `master/consolidated-feature-integration` were both found by branch search. This ledger does not assert their latest commit SHAs or mergeability.

## 6. Consolidated artifact plan and current disposition

The eight knowledge areas are implemented as a navigation map, not eight duplicate masters.

| Planned artifact / subject | Preferred treatment |
| --- | --- |
| Master project & knowledge handoff | Link existing Product Architecture, Integrated Application, Conversation Handoffs and Task Authority |
| Product strategy / competitive / partnership dossier | Consolidated in `docs/research/VIEWTUBE_PRODUCT_STRATEGY_COMPETITIVE_PARTNERSHIP_AND_TECHNICAL_DOSSIER.md`; primary-source verification remains open |
| Capability / feature / implementation registry | Reuse Product Architecture, `capabilities.json`, code registries and Task Authority; create only derived coverage output if needed |
| Studio design system / primitive library | Update existing Toolbox master, Component Library source and Global Defaults index |
| Studio regression / recovery report | Consolidate into existing Studio workstream and regression handoff, then promote a single living report only if a genuine authority gap remains |
| AI Brain specification | Update `docs/domains/BRAIN.md`; preserve Phase D donors |
| Engineering / branch / release operations | Reuse Task Authority, Verification, Conversation Handoffs, Integrated Application and Deployment authority |
| Research / design / delivery resource library | Use registry, references, prompt registry, skills and domain-owned resources; no second catalog database |

## 7. Execution phases

### Phase 1 — Inventory and authority verification

**Started.** Known canonical sources, governance, key Studio/Brain/release authorities and sampled PRs have been identified. Full recursive inventory and full source-family comparisons remain open.

### Phase 2 — Reconcile and consolidate

**Partially started.** Existing authorities are mapped; superseded Brain sources and candidate Library donors are distinguished. No source has been removed. Full no-loss comparison and consolidation manifests remain open.

### Phase 3 — Master knowledge navigation

**Initial implementation in this branch.** `docs/VIEWTUBE_MASTER_KNOWLEDGE_BASE.md` maps the eight subject areas to existing authorities and records known gaps.

### Phase 4 — Repository and implementation verification

**Pending.** Must inspect current branch heads, exact PR diffs, task IDs, code, tests, build/runtime evidence and relevant visual acceptance. Do not mark implementation status complete from documentation alone.

### Phase 5 — External-facing research and partnership materials

**Pending.** Requires primary-source research, validated capability claims, competitive comparisons, API/partner feasibility, data rights, costs and evidence-backed value propositions. The previous Library proposal backlog is not sufficient by itself.

## 8. No-loss and completion gates

Before any source is moved, archived, marked superseded or deleted:

1. Record original path, source branch/commit, blob hash, dates and inbound references.
2. Compare the full content, including tables, code, links, hidden/embedded data and unique instructions.
3. Map every unique contribution to its surviving authority, task, decision, reference or explicit historical donor.
4. Reconcile conflicts against registry authority and current code/tests.
5. Update `docs/registry.json` and relevant entrypoints in the same PR.
6. Preserve original material in the governed Removed Archive with lineage.
7. Run link/schema/documentation checks and inspect the final diff.

Completion requires evidence appropriate to each claim. A file existing proves only file existence; a commit proves a repository change; a merged PR proves integration; tests/build/runtime/visual checks prove only the behaviors they actually exercise.


## 9. Initial delivery receipt — PR #1259

- **PR:** [#1259 — docs: establish consolidated ViewTube master knowledge index](https://github.com/viewtube-dev/viewtube/pull/1259)
- **Working branch:** `docs/master-knowledge-consolidation-2026-11-13`
- **Target branch:** `master/consolidated-feature-integration`
- **Target base SHA:** `767a223bb383addcaf6492d67a3b29ac53934b43`
- **Observed PR head SHA at initial review:** `8006d4789fb72be264623abc4946903675a96243`
- **Comparison:** 4 commits ahead, 0 behind; merge base equals target base SHA.
- **Changed files:** exactly the four files listed in the PR.
- **Repository link checks:** all 20 direct linked paths were fetched successfully across two validation batches; the documentation registry parsed successfully with 73 entries.
- **CI status at initial review:** three Vercel contexts were pending. No passing build/test result is claimed.
- **Merge state:** PR open, draft, not merged. GitHub initially returned `mergeable: false`; recheck after status computation and any subsequent updates.

This receipt records the initial delivery state only. It does not certify the full documentation consolidation or any application behavior.


## 10. Additional Studio recovery-branch reconciliation evidence

A direct GitHub compare of `master/consolidated-feature-integration` against `fix/studio-controls-regression-recovery-2026-10-31` returned **diverged: 352 commits ahead and 30 commits behind** relative to the requested target. The changed-file set spans Studio controls, Confirmed Primitive Library, Vault, calendar, Analytics context, Resource Library, package scripts and release workflow. This is not a safe wholesale-merge candidate. Use a file-by-file donor map, preserve unrelated changes and selectively port only verified unique work.

The recovery branch contains the two branch-only documents listed in Area 4. The target branch already contains `docs/ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md`; it was fetched successfully from both refs, so it is not missing from the repository.

Relevant PR descriptions sampled:
- [PR #1258](https://github.com/viewtube-dev/viewtube/pull/1258) describes new side/double-split text-input primitives and catalog coverage. Its description says tests were added but not executed; browser verification is not claimed.
- [PR #1243](https://github.com/viewtube-dev/viewtube/pull/1243) describes side text-counter and icon-rail input families, and a source-level global input line-height root-cause finding. Its description explicitly says bottom inset-stroke clipping and full five-size browser verification remain unproven.
- [PR #1229](https://github.com/viewtube-dev/viewtube/pull/1229) describes a three-file conversation-intake package. The package paths were not found on the target branch during this pass; inspect the PR head and register/merge the package only after verifying its current state and unique content.

These PR descriptions are claims from PR metadata, not independent verification receipts.


## 11. Expanded Library source-pack inventory

A follow-up Library search found the complete companion-pack structure: master index (00), product/market/competitive volume (01), partner/business-development volume (02), technical/API/risk volume (03), and source-register/claim-ledger volume (04). The companion volumes are intentionally consolidated references; they are not separate repository authorities yet.

**Recommended repository treatment:** create one canonical combined strategy/competitive/partnership dossier that absorbs the index, product-market volume, partner volume and claim-ledger material. Fold the technical/API/risk volume into that dossier as a substantial technical-feasibility section unless a clearly independent owner and update cadence justify a separate subordinate specification. Keep the original Library artifacts as immutable source donors and record source-by-source harvested contributions in the consolidation manifest.

The Library index also identifies older partner research with obsolete “privacy-first YouTube frontend/ad-free player” positioning. That source must remain historical only and must not be reused as the current ViewTube pitch. It records no verified signed partnerships, customer pilots, submitted applications or partner meetings in the reviewed source set. Program benefits, application windows, credit amounts and contact routes require current official verification.


## 12. Consolidated dossier delivery receipt

- **New repository file:** `docs/research/VIEWTUBE_PRODUCT_STRATEGY_COMPETITIVE_PARTNERSHIP_AND_TECHNICAL_DOSSIER.md`.
- **Source families absorbed:** Library volumes 00–04; 10 proposed capabilities; 20 improvement candidates; 15 YouTube API areas; 30 provider candidates; competitor cohorts; partner tiers and inherited benefit claims; data-room and 90-day plans; technical/security/economics/test requirements; source and claim ledgers.
- **Disposition:** one combined repository reference rather than five separate active masters. Original Library artifacts remain source provenance; this file is a consolidated synthesis, not a byte-for-byte archive copy.
- **Evidence state:** fresh official-source verification is still outstanding. No competitor feature, provider access, price, partner credit, eligibility, traction, deployment or predictive-performance claim is promoted to VERIFIED by this migration.


A focused catalog check on the target base found 73 distinct `data-vt-library-component` identifiers across 174 occurrences. This is not a unique public-export count. `StudioSquareIconButtonGroup` is in the public barrel and catalog; `StudioInlineStepper` and `StudioSplitStepper` exist in the production module but are absent from the public barrel and catalog. The Component Library source now records this exact coverage gap and the recovery-branch donor's unsupported 81-export claim.


## 13. Existing Studio workstream update

The existing owner file `tasks/p1-canonical-system-integration/workstreams/studio-controls/README.md` has been updated in the documentation branch with the target/recovery branch comparison, PR #1229/#1243/#1258 donor caveats, target catalog identifier count, square icon group coverage and the stepper public-barrel/catalog gap. The three existing Studio source authorities were updated selectively rather than replaced. Their registry audit metadata now points to the target base SHA recorded above.


## 14. Final merge and target-branch verification receipt

- **PR:** [#1259 — docs: establish consolidated ViewTube master knowledge index](https://github.com/viewtube-dev/viewtube/pull/1259)
- **Final state:** merged (squash) into `master/consolidated-feature-integration`.
- **Merge commit:** `861273f4fca1aff53ec5a0301996462d8a941fe9`.
- **PR head before merge:** `6ca4074cdc62c55d0a6c8f396be69574120583e0`.
- **Changed files:** nine; documentation and source-documentation only.
- **Target-branch verification:** all nine changed paths were fetched successfully after merge; `docs/registry.json` parsed with 74 entries and all three new documents were registered.
- **Vercel statuses:** three checks failed with the provider's `build-rate-limit` response. This is an infrastructure failure; no application build/test success is claimed.
- **Scope:** no application code or runtime behavior changed. Repository path/link and JSON validation completed; rendered Studio verification remains outstanding.

This receipt supersedes the “open/draft/not merged” state in the initial PR review subsection above. The initial comparison values remain historical observations from that earlier review.
