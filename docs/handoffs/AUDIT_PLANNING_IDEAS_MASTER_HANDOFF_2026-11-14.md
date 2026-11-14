# Audit Planning Ideas — Master Handoff

**Prepared:** 2026-11-14 | **Status:** ACTIVE handoff; audit and research remain in progress  
**Repository:** `viewtube-dev/viewtube` | **Target:** `master/consolidated-feature-integration`  
**Working branch:** `docs/audit-planning-ideas-conversation-handoff-2026-11-14`

> This document records work performed and decisions established in the “Audit Planning Ideas” conversation and its continuation. It does not claim that all planned audits, tests, runtime checks, external-source verification, partner outreach or five-volume research work are complete.

## 1. Mission

Build a comprehensive, evidence-backed understanding of ViewTube's application, capabilities, architecture, competitive position, partnership opportunities and commercial readiness. Continue the existing five-volume research collection and turn verified findings into credible partner-ready materials.

Classify every capability as: (1) implemented and operational, (2) implemented but incomplete/unverified, (3) under development, (4) experimental/hidden, (5) planned/proposed, or (6) dependent on external providers, permissions or partnerships. Never present proposed functionality as shipped, code presence as runtime behavior, a prospect as a partner, or a pitch draft as a submitted application.

## 2. Governing decisions

### Independent branch baselines

The two original baselines must be audited independently and left unchanged:

- Original master baseline: `767a223bb383addcaf6492d67a3b29ac53934b43`
- Original October 31 recovery baseline: `35cbf0ff35ad28997a1b3b7d3e271829b28116f5`

At the 2026-11-14 inspection, current refs resolved to:

- Master: `b43c5b689c894bca5d3301ee313234a112f12c10`
- Recovery: `ee53eb629f03a2832a87ad01f383f65c09db298a`

GitHub's direct current-ref comparison returned **diverged**, recovery **457 ahead**, master **39 ahead**, merge base `9fda11d2bf49f25158fa9bdb6652f7690d7dca51`, and **81 changed files**. This is a dated comparison snapshot, not semantic review of all changes. Earlier arithmetic in the chat (250/30, 102 extra, 352/30) was provisional/inconsistent and is superseded by this direct comparison. Re-fetch before future merge decisions.

Required sequence: audit original master; audit original recovery; audit current tips; classify file/feature differences and unique functionality; identify regressions, missing consumers, duplicate systems and incomplete integrations; reconcile after consolidation; audit the consolidated result. Do not merge or force-push either branch as part of this research task.

### Repository governance

- `docs/registry.json` is the machine-routed documentation authority.
- `docs/governance/DOCUMENTATION.md` governs document ownership, lineage, supersession and consolidation.
- `docs/governance/TASK_AUTHORITY.md` owns canonical task identity and lifecycle.
- `docs/governance/VERIFICATION.md` requires implement → verify → inspect → correct → reverify → receipt.
- Reuse `docs/architecture/capabilities.json`; do not create a second capability registry.
- A commit proves code/history; a build proves buildability; a screenshot proves only what is visible. None alone proves a complete workflow.

## 3. Existing research sources recovered

The repository already contains a substantial research system. Preserve and extend these sources rather than recreating them:

- `docs/VIEWTUBE_MASTER_KNOWLEDGE_BASE.md`
- `docs/audits/VIEWTUBE_SOURCE_RECONCILIATION_LEDGER_2026-11-13.md`
- `docs/research/VIEWTUBE_PRODUCT_STRATEGY_COMPETITIVE_PARTNERSHIP_AND_TECHNICAL_DOSSIER.md`
- `docs/partnerships/VIEWTUBE_MASTER_PARTNER_INTELLIGENCE_AND_PITCH_PLANNING.md`
- `docs/partnerships/VIEWTUBE_PRIORITY_PARTNER_PITCH_PACK_2026-11.md`
- `docs/architecture/PRODUCT_ARCHITECTURE.md`
- `docs/architecture/capabilities.json`
- `docs/domains/BRAIN.md`
- `docs/brain/AI_BRAIN_QUICK_WINS_MASTER_IMPLEMENTATION_PLAN.md`
- `docs/brain/AI_BRAIN_FEATURE_MASTER_AND_IMPLEMENTATION_READINESS.md`
- `docs/brain/VIEWTUBE_AI_SYSTEMS_MASTER_RESOURCE.md` (donor/historical status notice applies; do not elevate above current Brain authority)
- `docs/references/DEEP_RESEARCH_CONSTRUCTION_SOURCE.md`
- `docs/vault/VAULT_PHASE_0_1_2_TARGET_BRANCH_AUDIT_2026-11-11.md`
- `docs/plans/VIEWTUBE_COMPONENT_STANDARDIZATION_PHASES_0_3_2026-11-11.md`

The earlier ChatGPT Library search surfaced a five-volume set:
- 00 — Master Research Reference Index
- 01 — Product, Market & Competitive Research
- 02 — Partner Ecosystem & Business Development
- 03 — Technical, API, Integration & Risk Reference
- 04 — Source Register, Claim Ledger & Research Gaps

It also surfaced `ViewTube_Research_Reference_Library_v0.1.zip` and source names including `ViewTube_Master_Research_and_Implementation_Resource.md/.docx`, `ViewTube Partner & Growth Strategy Report (Nov 12, 2026)`, `ViewTube Competitive Audit & Opportunity Research`, `ViewTube Partnership Research Report (Nov 11, 2026)`, and `VIEWTUBE_CREATOR_WORKSPACES_MASTER_TOOL_CONTEXT.md`.

**Recovery limitation:** search results and file references were surfaced, but this conversation did not complete byte-level inspection of every Library item or prove that the archive was copied into the repository. Do not claim full archive validation or migration.

## 4. Application audit evidence

### Route/page registry

Inspected on the recovery branch:
- `src/app/AppRoutes.tsx`
- `src/app/pageRegistry.ts`

The previous extraction reported **71 registered route entries**, excluding wildcard fallback:

| Lifecycle | Count |
|---|---:|
| Production | 35 |
| Legacy | 12 |
| Lab / experimental | 24 |
| **Total** | **71** |

This is source-code inventory, not route reachability, runtime certification, authenticated access, or complete feature coverage. Route-to-capability mapping remains open. Major areas include Dashboard/Studio Hub, AI Brain/Brain Controls, Analytics/Intelligence, Projects/Calendar, Vault/Resource Library, Editor, publishing/content tools, Reference Studio and internal/experimental interfaces.

### Existing Vault audit

The November 11 audit reports canonical asset identity/search adapter; browser-local metadata that does not prove cloud durability; read-only permission-gated Brain retrieval; video/audio processing unavailable in the audited page; capability status not always connected to executable operations; and runtime/mobile/desktop certification outstanding. Revalidate on current refs before treating as current.

### Existing component standardization audit

The November 11 Phases 0–3 document reports 62 registered Studio component families and work involving Calendar primitives, Resource Library, Analytics, primitive ownership and migration. Registry foundations existed; full consumer/API coverage and rendered certification remained incomplete. PR #1245–#1247 statuses are historical and must be rechecked.

## 5. Product and competitive research

The current working positioning in the repository is a connected creator-workflow platform. The proposed commercial wedge is AI-assisted media asset management and video intelligence for professional creators/teams. This is a hypothesis requiring customer validation, not a proven market conclusion.

Earlier research surfaced 75 opportunity candidates: 10 new capability candidates, 20 existing-feature improvements, 30 integration candidates and 15 YouTube API opportunities. These are not accepted tasks, shipped features or validated demand. Reconcile each against Product Architecture, `capabilities.json`, the existing Task Index and code before creating tasks.

Competitors previously surfaced include vidIQ, TubeBuddy, OutlierKit, Subscribr, OpusClip, Descript, Riverside, Canva, Adobe, Katalist, Pictory, Runway, SocialPilot, Buffer, Hootsuite and Sprout Social. Current features, prices, plans, API access and limits require first-party verification.

## 6. Partnership status

Existing partner authorities:
- `docs/partnerships/VIEWTUBE_MASTER_PARTNER_INTELLIGENCE_AND_PITCH_PLANNING.md`
- `docs/partnerships/VIEWTUBE_PRIORITY_PARTNER_PITCH_PACK_2026-11.md`
- `docs/research/VIEWTUBE_PRODUCT_STRATEGY_COMPETITIVE_PARTNERSHIP_AND_TECHNICAL_DOSSIER.md`

The priority pitch pack contains tailored briefs for ERA, Forum Ventures, Google Cloud and Betaworks, with pitch angles, questions, asks, demo narratives, evidence checklists and outreach drafts. These are hypotheses/drafts; current program fit and founder evidence must be verified before sending.

The official-source research attempt for Google for Startups/Cloud, AWS Activate, Microsoft for Startups, NVIDIA Inception, Vercel for Startups, Pinecone, Hugging Face, ERA, Forum Ventures, Betaworks and YouTube API/policy documentation was blocked by Browser Use `insufficient_credits`. No verification was completed by that attempt. Keep program terms, eligibility, contact routes and API/policy claims UNVERIFIED until checked against current first-party sources.

No signed partner, submitted application, accepted program, customer pilot, revenue, usage metric or production provider deployment was evidenced in this audit.

## 7. Evidence vocabulary

Use:
- VERIFIED — current authoritative primary source checked with date/citation.
- CODE-CONFIRMED — exact source code at exact SHA; runtime not implied.
- OBSERVED — actual UI/runtime behavior observed in named environment.
- PARTIALLY VERIFIED — only part of claim confirmed.
- REPORTED — inherited claim not independently checked.
- INFERRED — reasoned conclusion, not direct fact.
- PROPOSED — recommendation/candidate, not accepted/implemented.
- UNVERIFIED — evidence not obtained.
- BLOCKED — dependency prevents verification.

For capability maturity, assess architecture, backend, frontend, integration, tests, runtime, responsive, documentation and release separately. Avoid one misleading completion percentage.

## 8. Invoked specialist workflows and guardrails

### ViewTube AI Brain Improvement

Extend canonical owners only. Do not create another Brain runtime, database, memory store, analytics engine or capability registry. Preserve raw creator messages exactly; evidence shown must be the evidence supplied to that turn and retain canonical IDs. Reuse CreatorContextResolver/envelope, BrainCapabilityRegistry, BrainRuntimeSnapshot/traces, ToolReceipts, ContentBuild and learning governance. Tool handoffs remain review-only unless an existing approved-action contract says otherwise. Retry generation only; never replay external side effects. Do not expose private chain-of-thought. Verify restore, routing, learning governance, tests, typecheck, lint/source governance, build and accessibility/runtime as applicable.

### ViewTube Studio Design

Repository source of truth wins. Preserve the actual 12-color palette, semantic pairings, tokens and size/state contracts. Reuse production exports; catalog specimens must import real primitives and must not become a second implementation. Do not create page-local lookalikes. Build/repair a primitive only when a real gap is demonstrated and the task is authorized. Update exports, registry, docs and tests together. Do not claim visual certification without rendered inspection.

### ViewTube UI Coverage Auditor

Map routes/pages/sections to capabilities, APIs, services, settings, permissions and runtime functions. Find implemented capabilities with no user-facing entry point and stale UI that no longer reflects code. Distinguish missing UI from missing implementation. Trace proposed controls to canonical owners and permission contracts; record evidence, user journey, state coverage, tests and access limitations.

### Convo-Station

Use resource discovery to inventory prompts, responses, attachments, existing assets, decisions and document opportunities. Use relay only with actual supported sources/adapters; the skill explicitly states there is no general account-wide ChatGPT conversation read/write/event API by default. Do not claim that all chats were discovered or monitored. This handoff covers the accessible conversation scope and surfaced Library/repository sources only.

## 9. Five-volume collection — continue, do not duplicate

| Volume | Scope | Existing canonical home / action |
|---|---|---|
| 00 — Master Index | inventory, authority, status, sources, gaps | Update Master Knowledge Base or designated index; no second master index |
| 01 — Product/Market/Competitive | capability inventory, customers, competitor comparisons, gaps | Existing product strategy dossier |
| 02 — Partner Ecosystem/BD | partner profiles, fit, asks, pitches, outreach | Existing partner playbook and priority pitch pack |
| 03 — Technical/API/Integration/Risk | architecture, APIs, data, identity, security, deployment | Existing architecture/capability/domain authorities; add bounded research only where needed |
| 04 — Source Register/Claim Ledger/Gaps | URLs, excerpts, dates, evidence, conflicts, verification gaps | Existing source reconciliation ledger and dossier claim sections |

The earlier Library index was reported to omit Volume 04 despite a fifth volume being surfaced. Verify current files and repair navigation if the inconsistency remains.

## 10. Required workflow

1. Recover/index existing repository and Library sources; deduplicate and identify authority.
2. Independently audit original master and recovery baselines; pin SHAs.
3. Audit current branch tips and classify the 81-file difference.
4. Map routes/pages to capability owners, APIs, services, permissions and tests.
5. Verify product and competitor claims; conduct creator/customer discovery and preserve negative findings.
6. Verify partners, programs, API feasibility and policy constraints from official sources.
7. Reconcile after branch consolidation and audit the consolidated app.
8. Update all five volumes and a shared source/claim ledger.
9. Prepare a partner evidence packet, demo and pitches only after founder and recipient gates pass.

## 11. Outstanding work

### P0 — preserve evidence
- [ ] Pin exact historical/current refs and create reproducible audit manifest.
- [ ] Finish file-by-file review of 81-file current branch comparison.
- [ ] Keep original baselines unchanged.
- [ ] Validate Library volume contents and ZIP; copy only after verifying source bytes.
- [ ] Resolve historical branch arithmetic using direct GitHub compare results.

### P1 — technical/application audit
- [ ] Map all 71 routes to capabilities, APIs/services and owners.
- [ ] Inventory feature completeness and UI reachability.
- [ ] Map authentication, authorization, data ownership, persistence, retention and providers.
- [ ] Trace AI Brain end-to-end from UI through context/evidence/runtime/output.
- [ ] Audit Studio primitives, exports, consumers, tests and responsive behavior.
- [ ] Revalidate Vault and component-standardization audits.
- [ ] Verify runtime, deployment, mobile and desktop behavior.

### P1 — product/market
- [ ] Reconcile 75 candidates against capability registry and Task Index.
- [ ] Verify competitor features/pricing with official sources.
- [ ] Conduct structured creator/team discovery; preserve disconfirming evidence.
- [ ] Validate buyer, wedge, pricing and willingness to pay.

### P1 — partnerships
- [ ] Verify current program eligibility, benefits, terms and application routes.
- [ ] Verify YouTube Data, Analytics and Reporting APIs and current policies.
- [ ] Score partner opportunities and assemble founder evidence.
- [ ] Prepare a real demo, deck and partner-specific pitches.

### P2 — release
- [ ] Correct Volume 00/04 index inconsistency if confirmed.
- [ ] Update Master Knowledge Base and source ledger.
- [ ] Publish research release 0.2 after evidence reconciliation.
- [ ] Reconcile branches after merge.
- [ ] Prepare partner data room and outreach.

## 12. Key repository sources

- [Documentation index](../README.md) · [Registry](../registry.json) · [Master Knowledge Base](../VIEWTUBE_MASTER_KNOWLEDGE_BASE.md)
- [Source Reconciliation Ledger](../audits/VIEWTUBE_SOURCE_RECONCILIATION_LEDGER_2026-11-13.md)
- [Product Strategy / Competitive / Partnership / Technical Dossier](../research/VIEWTUBE_PRODUCT_STRATEGY_COMPETITIVE_PARTNERSHIP_AND_TECHNICAL_DOSSIER.md)
- [Master Partner Playbook](../partnerships/VIEWTUBE_MASTER_PARTNER_INTELLIGENCE_AND_PITCH_PLANNING.md) · [Priority Pitch Pack](../partnerships/VIEWTUBE_PRIORITY_PARTNER_PITCH_PACK_2026-11.md)
- [Product Architecture](../architecture/PRODUCT_ARCHITECTURE.md) · [Capability Registry](../architecture/capabilities.json) · [Brain Domain](../domains/BRAIN.md)
- [AI Brain Quick Wins](../brain/AI_BRAIN_QUICK_WINS_MASTER_IMPLEMENTATION_PLAN.md) · [AI Brain Feature Readiness](../brain/AI_BRAIN_FEATURE_MASTER_AND_IMPLEMENTATION_READINESS.md)
- [Deep Research Construction Source](../references/DEEP_RESEARCH_CONSTRUCTION_SOURCE.md)
- [Vault Audit](../vault/VAULT_PHASE_0_1_2_TARGET_BRANCH_AUDIT_2026-11-11.md) · [Component Standardization](../plans/VIEWTUBE_COMPONENT_STANDARDIZATION_PHASES_0_3_2026-11-11.md)

## 13. Verification boundaries

This conversation recovered Library search results, inspected selected repository documents, compared branch refs, extracted route-registry counts and attempted official-source research.

It did **not** execute tests, typecheck, lint, build, browser/screenshot checks, authenticated workflows, deployment checks or production runtime inspection. It did not exhaustively inventory every file/API/route, inspect every line of all five Library volumes, verify external partner programs, submit applications, contact partners, or merge development branches.

This PR is a documentation handoff and audit-record deliverable, not completion of the five-volume research project or technical audit.

## 14. Immediate next action

Continue with the pinned 81-file comparison. Classify each file by canonical capability owner, then build the route-to-capability inventory from `AppRoutes.tsx` and `pageRegistry.ts`. Trace priority creator workflows through UI → canonical service → API/provider → persistence → tests. Keep audit read-only until findings and implementation tasks are reviewed.

**Primary mission:** build the definitive evidence-backed ViewTube product, technical, competitive and partnership intelligence resource without duplicating authorities or overstating what exists.
