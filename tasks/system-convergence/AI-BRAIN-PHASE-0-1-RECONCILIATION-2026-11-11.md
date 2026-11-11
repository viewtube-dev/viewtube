# AI Brain Evidence & Context — Phase 0/1 Reconciliation

**Class:** AUDIT  
**Status:** ACTIVE — PHASE 0 BASELINE REFRESHED; PHASE 1 STATIC SOURCE MAP COMPLETE / RUNTIME PARITY OPEN  
**Audit date:** 2026-11-11  
**Repository:** `viewtube-dev/viewtube`  
**Target:** `master/consolidated-feature-integration`  
**Exact target HEAD:** `a279e52e63e816c0409a02e2feb4807f20c56e4b`  
**Audit branch:** `docs/ai-brain-knowledge-evidence-consolidation-2026-11-11`  
**Primary authority:** `docs/domains/BRAIN.md`  
**Program authority:** `tasks/p1-canonical-system-integration/plan.md`  
**Workstream:** `tasks/p1-canonical-system-integration/workstreams/brain-continuity/plan.md`

## 1. Executive result

This refresh pins the live target branch and updates the source-to-Brain map against the current target, rather than relying on the October SHA. The current implementation has a real, typed analytics evidence path and a separate creator-context resolution path. The Orchestrator joins them into one bounded model input. It does **not** yet establish that every registered evidence owner or every information source is connected to the same evidence contract.

The central finding is:

> Brain has a connected analytics-canon → EvidenceIntelligenceResolver → EvidenceRecord → BrainContextBroker → rendered model-input path. Creator Context is connected through a separate governed envelope. Public research, public-handle metadata, comments/transcripts, Vault asset facts, publication facts and outcomes/experiments are only partially integrated or not yet proven as turn-bound EvidenceRecords.

This is a source audit. It is not a live production journey, a database audit, a full caller census, or a CI certification.

## 2. Phase 0 — exact baseline and donor reconciliation

### 2.1 Target baseline

| Check | Result | Evidence |
|---|---|---|
| Repository and target ref | VERIFIED | GitHub branch search returned `master/consolidated-feature-integration` |
| Exact target HEAD | VERIFIED | Self-compare returned identical refs and SHA `a279e52e63e816c0409a02e2feb4807f20c56e4b` |
| Latest target commit | VERIFIED | Commit is merge of PR #1242, “Restore full-row Studio counter layout and glyph-only toggle focus” |
| Existing Phase 0 package | VERIFIED | PR #1205 and PR #1216 are merged into the target |
| Brain quality plan | VERIFIED | PR #1190 merged |
| Public/provider boundary audit | VERIFIED | PR #1193 merged; its boundary concern still requires regression verification against current code |
| Runtime snapshot optimization/invalidation | VERIFIED | PRs #1212 and #1219 merged |
| Registry freshness | STALE | `docs/registry.json` and several capability/authority entries still carry October/September audited SHAs |
| Focused test baseline | NOT RUN | GitHub source/contents access only; no repository checkout or CI execution in this pass |
| Build/typecheck/browser baseline | NOT RUN | No local or remote workflow execution performed |
| Task Authority claim/receipt | NOT CREATED | No canonical task-claim mutation was available in this pass; this audit does not invent a task ID |

The exact target SHA is a commit SHA, not a file/blob SHA. The self-compare returned `status=identical`, `ahead_by=0`, and `behind_by=0`.

### 2.2 Donor and prior-work reconciliation

| Work | Current result | Phase 0 disposition |
|---|---|---|
| PR #1205 — P1 phase-0 reconciliation | Merged | Reuse; do not repeat donor reconciliation from scratch |
| PR #1216 — canonical integration migration | Merged | Reuse migrated workstream packets and maps |
| PR #1190 — Brain quality / AI systems plan | Merged | Extend its existing Phases 0–8 plan |
| PR #1193 — public/provider boundaries | Merged | Preserve as a regression requirement; merged status is not proof the current boundary is safe |
| PR #1212 — runtime snapshot performance | Merged | Reuse snapshot; no second snapshot cache/owner |
| PR #1219 — runtime snapshot invalidation | Merged | Reuse invalidation subscriptions; evidence refresh semantics remain separate |
| PR #649 — evidence/prompt provenance | Previously reported merged; not re-fetched in this refresh | Treat as donor history only; current Orchestrator source shows rendered EvidenceRecord capture and must be tested at the exact SHA |
| PR #1184 — public context runtime integration | Previously reported merged; not re-fetched in this refresh | Public metadata prompt context is not by itself canonical EvidenceRecord integration |
| PR #644 — Brain master resource/skill | Previously reported open draft; not re-fetched in this refresh | Documentation donor only; never supersedes `docs/domains/BRAIN.md` |

No stale branch was merged or rebased. No runtime behavior was changed in Phase 0/1.

### 2.3 Phase 0 exit status

**Completed in this refresh:** exact target SHA, current target commit identity, existing plan authority, key donor PR status, code foothold discovery and known verification limits.

**Still open before Phase 0 can be certified:** run focused baseline tests at the pinned SHA; record pre-existing failures; inspect Task Authority and allocate/confirm the canonical work claim; run typecheck/build/source-governance gates; verify the target SHA has not moved before execution.

Phase 0 is therefore **baseline-refreshed, not fully certified**. Historical green checks from merged PRs are not a substitute for current-SHA execution.

## 3. Phase 1 — ownership and contract map

### 3.1 Canonical owners and integration seams

| Concern | Canonical owner | Brain seam at target | Current status |
|---|---|---|---|
| Analytics truth | `analytics-canon` / VT-SYNC | `EvidenceIntelligenceResolver` | CONNECTED for analytics-backed Brain tasks |
| Evidence projection/quality | EvidenceRecord + BrainEvidenceQuality | `EvidenceIntelligenceResolver` → Orchestrator | CONNECTED for analytics records; not universal across all evidence owners |
| Creator context | Creator Context / Channel Profile / user controls | `CreatorContextResolver` | CONNECTED as a separate context envelope |
| Prompt context selection | BrainRuntime / BrainContextBroker / capability registry | `BrainContextBroker` + `BrainContextResolution` | CONNECTED; full caller parity still unverified |
| Creator answers | existing AI Brain context/profile store | `loadAiBrainContext` + `CreatorAnswerEvidence` | CONNECTED as a separate, channel-scoped evidence-like projection |
| Channel Knowledge | Channel Profile + ChannelKnowledgeProjection + learning governance | `CreatorContextResolver` | PARTIAL; projection and retrieval exist, but persistence/hydration/governed lifecycle needs current-SHA runtime proof |
| Niche knowledge/research | NicheKnowledge + current research provider | Orchestrator + BrainContextBroker | PARTIAL; research is prompt context/citations, not fully normalized into EvidenceRecord |
| Public handle/channel context | public resolver/cache + public-only policy | public context runtime | PARTIAL; verify public/private isolation and canonical evidence/provenance parity |
| Projects / ContentBuild | Projects + ContentBuild Repository | CreatorContextResolver; BrainRuntimeSnapshot | PARTIAL-to-CONNECTED for exact project/build references; not a universal EvidenceRecord producer |
| Vault / Asset Engine | Vault / Asset Engine | artifact refs, ContentBuild and runtime snapshot asset IDs | PARTIAL; lineage IDs exist, full asset/version/relationship facts are not proven as turn-bound evidence |
| Publishing | Publisher / PublishTransaction | ContentBuild lineage and publication identity | PARTIAL; downstream lifecycle owner, not shown as a general Brain evidence producer |
| Outcomes / evaluation | BrainOutcomeLedger + canonical evaluation owners | BrainRuntimeSnapshot, traces and learning path | PARTIAL; downstream IDs are projected, not universal EvidenceRecord inputs |
| Experiment / algorithm events | Algorithm Intelligence event ledger and specialists | Algorithm access + BrainRuntimeSnapshot | PARTIAL; specialist/event lineage exists, shared EvidenceRecord/DerivedSignal ingestion is not universal |
| Comments / transcripts / YouTube-read | respective acquisition/storage owners | EvidenceOwner values are defined; collector footholds exist | UNVERIFIED as end-to-end turn-bound EvidenceRecord producers |
| Resource Library | Resource Library canonical owner | No complete retrieval-to-turn evidence path verified here | UNVERIFIED |
| Conversation history | Conversation store / Conversation OS | recent turns and model history in Broker | PARTIAL; conversation continuity is present, but it is not interchangeable with observed evidence or durable knowledge |

### 3.2 Current runtime path — verified from target source

```text
BrainOrchestrator
  ├─ resolveEvidenceIntelligence(channelId, window, task sections)
  │    └─ analytics-canon snapshot
  │         ├─ BrainEvidenceQuality
  │         ├─ EvidenceRecord[] / evidence claims / health
  │         ├─ StatisticsIntelligence
  │         ├─ optional AudienceIntelligence
  │         ├─ canonical OpportunityEvidence
  │         └─ deterministic analytics finding context
  │
  ├─ loadAiBrainContext + buildCreatorAnswerEvidenceRecords
  ├─ resolveCreatorContext
  │    ├─ Brain user controls
  │    ├─ Channel Profile + Channel Knowledge
  │    ├─ Style Profile
  │    ├─ exact Project ID / linked ContentBuild
  │    └─ surface + selection references
  │
  ├─ NicheKnowledge + optional current research/citations
  ├─ buildBrainContextPack
  │    ├─ scope/privacy checks
  │    ├─ capability/task required sections
  │    ├─ token/character budget and omission reasons
  │    ├─ EvidenceRecord formatting and selection
  │    └─ model system instruction
  │
  ├─ capture only EvidenceRecords actually rendered to the model
  ├─ BrainModelGateway
  └─ BrainTrace / conversation turn metadata / model-input snapshot

Separate read-side lineage:
BrainRuntimeSnapshot
  ├─ Project + ContentBuild
  ├─ GenerationRequest + ContextManifest + ToolReceipt
  ├─ BrainTrace + GenerationRecord
  ├─ BrainOutcomeLedger
  └─ Algorithm Intelligence events and ancestry
```

Important boundary: `BrainRuntimeSnapshot` is a read-side lineage projection, not a replacement for the current turn's evidence pack. Its presence does not prove every historical source was supplied to the model for a particular turn.

### 3.3 Stable identity and provenance map

| Identity / contract | Existing carriers | Current assessment |
|---|---|---|
| `channelId` | CreatorContextEnvelope, EvidenceIntelligenceEnvelope, BrainTrace, Project/ContentBuild, outcome/event records | Strong primary scope key; exact cross-surface isolation requires runtime tests |
| `sourceRef` / `sourceSnapshotId` | EvidenceRecord, analytics-canon snapshot, canonical dataset refs | Present for analytics; non-analytics producer parity unverified |
| `evidenceIds` | EvidenceRecord, prompt input snapshot, BrainTrace, generation/request/receipt/outcome/event ancestry | Strong for rendered analytics evidence; cross-domain propagation remains partial |
| `projectId` | CreatorContextEnvelope, BrainTrace, generation and outcome lineage | Exact ID lookup is present in CreatorContextResolver |
| `contentBuildId` | Project, CreatorContextResolver, BrainRuntimeSnapshot, generation lineage | Linked ContentBuild lookup exists; freshness/revision parity across every consumer needs tests |
| `assetId` / version / variant IDs | artifact refs, manifests, receipts, BrainRuntimeSnapshot | IDs exist in parts of lifecycle; asset facts not yet proven in prompt evidence |
| `operationId` / `workflowId` | GenerationRequest, ToolReceipt, GenerationRecord, traces and outcomes | Present on generation paths; not universal across reasoning and every action path |
| `eventId` / parent IDs | ContentBuild event stream, Algorithm Intelligence ledger | Explicit ancestry in those owners; no evidence of a universal cross-domain event ledger |
| `outcomeId` / evaluation ID | BrainOutcomeLedger and evaluation owners, runtime snapshot | Downstream lineage exists; turn-level EvidenceRecord mapping and persistence need certification |
| `promptVersion` / model identity | prompt registry, BrainTrace, turn model-input snapshot | Provenance fields exist; registry reachability and actual served-model availability must remain truthful |
| profile/knowledge record IDs | Channel Knowledge projection, creator-answer evidence | Knowledge record IDs are projected; stable profile-record identity across all downstream receipts is not proven |

Do not add a new global identity service or event ledger to close these gaps. Extend canonical owner references and existing trace/receipt contracts.

## 4. Evidence and knowledge contract decision

Use the existing `src/services/brain/EvidenceRecord.ts` and `tasks/system-convergence/EVIDENCE-RECORD-DERIVED-SIGNAL-CONTRACT.md` as the shared logical projection contract. Do not create a second evidence schema or physical store.

Maintain the distinctions:

1. **EvidenceRecord** — source-owned observed, confirmed, calculated or explicitly missing/stale/conflicting information with scope and provenance.
2. **DerivedSignal** — deterministic/bounded signal that references source EvidenceRecord IDs and derivation method/version.
3. **Specialist Intelligence** — typed domain interpretation (Statistics, Audience, Channel, Opportunity, Algorithm, etc.).
4. **Creator Context / Knowledge** — goals, preferences, style, confirmed facts, hypotheses and governed learning; not analytics evidence.
5. **Brain reasoning** — task-specific explanation/recommendation constrained by the selected turn inputs.

Existing contract rules remain binding: missing is not zero; model prose is not observed evidence; scope mismatch fails closed; comparisons require compatible metric/unit/population/window/geography/attribution; hypotheses and estimates must remain labeled; approvals for review do not equal durable promotion.

### Contract gaps to resolve only after producer inventory

- Required stable source IDs and source-version semantics for non-analytics producers.
- A common adapter shape for public research citations and retrieval timestamps.
- Explicit freshness/expiry semantics for comments, transcripts, public metadata and resource material.
- Exact project/build/asset relationship refs when content-specific evidence is requested.
- A consistent comparability result for signals spanning different owner domains.
- A policy for creator-confirmed corrections versus measured evidence conflicts.
- A task/capability required/optional/forbidden matrix covering every production capability, not only analytics section IDs.

These are proposed extensions to existing contracts, not authorization to add storage or a new resolver.

## 5. Confirmed gaps and risks

1. **Evidence facade coverage is narrow.** Its default dependency reads analytics-canon. Other owner names in EvidenceRecord are not proof that their producers are connected.
2. **Creator context is parallel to evidence by design.** Keep preferences/goals/style/knowledge out of numeric evidence, but preserve exact IDs and confirmation state when selected into the turn.
3. **Research is not fully evidence-normalized.** Current niche research contributes text and citations to prompt context; the audit did not verify stable EvidenceRecord projection, freshness checks or citation-to-claim parity.
4. **Public/private boundary is a release blocker.** PR #1193 documented a possible logged-out public request reaching a connected-channel analytics snapshot under certain identity conditions. This refresh did not execute a regression test proving the fix or continued isolation. Public mode must be fail-closed at every acquisition and context boundary.
5. **Runtime snapshot is not a substitute for turn evidence.** It links lifecycle ancestry but does not establish all Vault, publishing, evaluation and knowledge facts were available to the exact model turn.
6. **Context and evidence caller parity is not certified.** The source inspection found Orchestrator wiring; Sidebar, Brain Hub, workspace and retry/restore parity require tests against actual mounted callers.
7. **Persistence remains an open proof obligation.** Source projections and browser cache/local persistence do not prove durable server persistence, authenticated isolation or fresh-session hydration.
8. **No current-SHA execution baseline.** Focused tests, full suite, typecheck, build, source governance and browser flows were not run in this pass.

## 6. Phase 1 execution backlog and acceptance

| ID | Task | Acceptance evidence | State |
|---|---|---|---|
| P1-EV-01 | Inventory every evidence producer and canonical owner | Producer → storage → adapter → resolver → prompt → trace call graph with exact source refs | PARTIAL |
| P1-EV-02 | Prove exact turn evidence parity | Model input IDs/fingerprint equal trace/turn metadata and UI “Based on” IDs for each surface | PARTIAL |
| P1-EV-03 | Complete required/optional/forbidden evidence matrix | Matrix matches live capability registry and task profiles; missing inputs constrain claims | PARTIAL |
| P1-EV-04 | Add non-analytics producer projections | Focused tests for public research, comments/transcripts, YouTube-read, Vault/project/publishing/outcome where applicable | NOT STARTED / contracts first |
| P1-EV-05 | Prove public/private isolation | Logged-out public handle request cannot read/use private analytics, even when connected identity matches | NOT CERTIFIED |
| P1-EV-06 | Prove Creator Context parity | Exact channel/project/build, personalization and project permission, confirmed/inferred/temporary status across callers | PARTIAL |
| P1-EV-07 | Prove scope/freshness/missingness/conflict rules | Rich/sparse/empty/stale/disabled/cross-channel/cross-project fixtures | NOT RUN AT CURRENT SHA |
| P1-EV-08 | Reconcile prompt/model provenance | Every production caller linked to prompt version, task profile, model requested/served when provider-reported, context recipe | PARTIAL |
| P1-EV-09 | Reconcile outcome/learning lineage | Evidence → decision/action → publication/outcome → evaluation → candidate/review/promotion stable IDs | PARTIAL |
| P1-EV-10 | Certify persistence and restoration | Server persistence, auth isolation, retry/restore and fresh-session hydration | NOT CERTIFIED |

### Required focused test suites

Run at the exact target SHA before changing runtime behavior:

- `CreatorContextResolver.test.ts`
- `EvidenceIntelligenceResolver.test.ts`
- `BrainEvidenceContract.test.ts` and EvidenceRecord/quality tests that exist on target
- `ChannelKnowledgeProjection.test.ts`
- `BrainRuntimeSnapshot.test.ts`
- conversation restore/retry and model-input snapshot tests
- public handle/provider boundary tests from PR #1193's successor/current source
- production-caller parity tests for Sidebar, Brain Hub and full workspace

Then record the repository's actual typecheck, source-governance and build commands from package scripts/CI. Do not assume a generic command.

## 7. Phase 1 sequencing

1. **First:** execute current-SHA focused baseline and public/private boundary tests.
2. **Second:** complete producer and caller inventory; mark each source CONNECTED / PARTIAL / UNREACHABLE / UNVERIFIED / BROKEN / NOT APPLICABLE with proof.
3. **Third:** close evidence parity and capability matrix gaps using the existing resolver, EvidenceRecord, BrainContextBroker and BrainTrace contracts.
4. **Fourth:** integrate non-analytics sources one vertical slice at a time, preserving owner and source IDs.
5. **Fifth:** add UI visibility only after exact turn evidence and context provenance are verified.
6. **Then:** move into Phase 2 Channel Knowledge persistence/governance and Phase 3 prompt/model provenance.

## 8. Guardrails and exclusions

- No second BrainRuntime, orchestrator, context broker, evidence database, analytics engine, Channel Knowledge store, prompt authority or task ledger.
- No conversion of creator preferences, prompt instructions or model hypotheses into measured evidence.
- No numeric-zero substitution for missing values.
- No fuzzy channel/project/video/asset identity joins.
- No public-mode access to private analytics or authenticated creator context.
- No deletion/quarantine of bridge/adaptor code until donor harvest, parity, zero-caller proof and rollback exist.
- No managed AI-system actions until read-side lineage and permission boundaries are certified.

## 9. Verification record

**Source files inspected on target ref:**  
`docs/domains/BRAIN.md`; `docs/brain/AI_BRAIN_QUICK_WINS_MASTER_IMPLEMENTATION_PLAN.md`; `docs/brain/AI_BRAIN_FEATURE_MASTER_AND_IMPLEMENTATION_READINESS.md`; `docs/brain/VIEWTUBE_AI_SYSTEMS_MASTER_RESOURCE.md`; `src/services/brain/BrainOrchestrator.ts`; `BrainContextBroker.ts`; `CreatorContextResolver.ts`; `EvidenceIntelligenceResolver.ts`; `EvidenceRecord.ts`; `BrainContextResolution.ts`; `BrainEvidenceQuality.ts`; `BrainRuntimeSnapshot.ts`; `ChannelKnowledgeProjection.ts`; `OpportunityEvidenceAdapter.ts`; `AnomalySignalBridge.ts`; associated focused test files; P1 plans; evidence convergence contracts; capability homes and documentation registry.

**Code changes:** none.  
**Tests/build/typecheck/browser:** not run.  
**Certification:** not claimed.  
**Next gate:** run the focused baseline at the pinned SHA and finish the complete producer/caller census before runtime implementation.
