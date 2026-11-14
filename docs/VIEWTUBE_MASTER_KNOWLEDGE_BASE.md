# ViewTube Master Knowledge Base

**Production Date:** 2026-11-13  
**Last Edited:** 2026-11-13  
**Class:** REFERENCE  
**Status:** ACTIVE  
**Concern:** cross-domain navigation to ViewTube's canonical product, engineering, design, research and delivery knowledge  
**Owner:** Documentation Governance + Integrated Application Program  
**Registry ID:** DOC-REF-MASTER-KNOWLEDGE-BASE  
**Last Audited Main SHA:** UNRESOLVED — this initial index is a navigation artifact; exact base-head certification remains in the linked reconciliation ledger  
**Supersedes:** none  
**Related Authorities:** docs/registry.json; docs/governance/DOCUMENTATION.md; docs/architecture/PRODUCT_ARCHITECTURE.md; docs/programs/INTEGRATED_APPLICATION.md; docs/governance/CONVERSATION_HANDOFFS.md

> This is a navigation and synthesis index, not a replacement authority. The machine-readable `docs/registry.json` determines document roles. Domain authorities, current code, tests, runtime evidence and Task Authority remain authoritative within their scopes.

## How to use this knowledge base

1. Start with [Documentation Governance](./governance/DOCUMENTATION.md) and [the machine documentation registry](./registry.json).
2. Use the eight subject areas below to find the existing canonical sources.
3. Check each source's status and scope in `docs/registry.json` before relying on it.
4. Treat conversation notes, Library artifacts, branch names, PR descriptions and historical plans as provenance until reconciled against the target branch.
5. Update the existing owning authority. Do not create a parallel master, feature registry, task ledger, idea registry, Brain runtime or evidence store.
6. Record implementation state only when supported by current code, tests, runtime or an explicit verification receipt.

## Eight consolidated knowledge areas

### 1. Master project, continuity and knowledge handoff

**Purpose:** provide the project-wide orientation and route a contributor from the current product state to the correct owner, decision, task, evidence and next action.

**Canonical sources:**
- [Product Architecture](./architecture/PRODUCT_ARCHITECTURE.md) — product and capability topology.
- [Integrated Application Program](./programs/INTEGRATED_APPLICATION.md) — cross-system convergence, dependencies and critical paths.
- [Conversation Handoffs](./governance/CONVERSATION_HANDOFFS.md) — global conversation intake, worklog and reconciliation procedure.
- [Conversation OS](./governance/CONVERSATION_OS.md) — conversation-derived improvement and continuity rules.
- [Task Authority](./governance/TASK_AUTHORITY.md) — canonical task identity and lifecycle.

**Boundary:** this index does not become a second project status store or task ledger. Exact task state belongs to the governed Task Index and Task Authority.

### 2. Product strategy, competitive research and partnership dossier

**Purpose:** assemble product positioning, creator problems, capability differentiation, competitive evidence, opportunity sizing, integration/partner fit, commercial value propositions and pitch-ready claims.

**Current source set:**
- [Product Architecture](./architecture/PRODUCT_ARCHITECTURE.md).
- [Capability Registry](./architecture/capabilities.json).
- [Deep Research Construction Source](./references/DEEP_RESEARCH_CONSTRUCTION_SOURCE.md).
- [Integrated Application Program](./programs/INTEGRATED_APPLICATION.md).
- Existing product/domain authorities linked from [the documentation entrypoint](./README.md).

**Known gap:** no single current, evidence-verified ViewTube competitive and partnership dossier was established by this initial repository audit. A separate dossier should be created only after source reconciliation and fresh research. The Library artifact `ViewTube_Master_Research_and_Implementation_Resource.md` is a candidate donor, not yet a repository-verified authority. Its prior research limitations must travel with any reused claims.

**Evidence rule:** competitor features, pricing, APIs, partner programs, permissions, terms and market claims require source URLs, access dates, excerpts, confidence and re-verification dates. Distinguish researched facts from proposals and hypotheses.

### 3. Product capability, feature coverage and implementation status

**Purpose:** understand what ViewTube can do, which system owns each capability, what is implemented or incomplete, and what evidence supports that assessment.

**Canonical sources:**
- [Product Architecture](./architecture/PRODUCT_ARCHITECTURE.md).
- [Capability Registry](./architecture/capabilities.json) — canonical capability identities and ownership map.
- [Task Authority](./governance/TASK_AUTHORITY.md) and the governed Task Index — exact work state.
- [Integrated Application Program](./programs/INTEGRATED_APPLICATION.md) — cross-system gaps and dependencies.
- Domain registries and code-owned registries, such as `src/views/dashboard/WidgetRegistry.ts`, remain authoritative for their bounded inventories.

**Boundary:** do not create a competing global feature registry. Any broader coverage view must be a generated or explicitly subordinate projection of existing capability, task, domain and code registries.

### 4. Studio design system and Confirmed Primitive Library

**Purpose:** define Studio tokens, defaults, control geometry, primitive ownership, catalog representation, variants, exceptions and acceptance contracts.

**Canonical sources:**
- [Toolbox / Studio UI Master Resource](./architecture/VIEWTUBE_TOOLBOX_UI_MASTER_RESOURCE.md) — global production Toolbox/SubToolbox system.
- [Studio Hub Component Library Source of Truth](./ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md) — Confirmed Primitive Library/catalog presentation and primitive corrections.
- [Studio Controls Global Defaults and Exception Index](./ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md) — normative Studio control defaults and exceptions.
- Executable sources and tests identified by those documents, including `src/studio-ui/tokens.ts`, primitive components, stylesheets, catalog source and contract tests.

**Authority boundary:** production code/tests verify behavior; the Studio Hub source governs catalog presentation; the global defaults index governs Studio control requirements; the Toolbox master governs the broader shell. Historical visual artifacts are evidence, not automatic authority.

### 5. Studio regression, testing and recovery

**Purpose:** preserve defect history, reproduction conditions, source/PR provenance, confirmed causes versus hypotheses, recovery decisions, test matrices and exact verification outcomes.

**Current source set:**
- [Studio Controls workstream](../tasks/p1-canonical-system-integration/workstreams/studio-controls/README.md) and its audit checklist, test plan and agent brief.
- [Integrated Application Program](./programs/INTEGRATED_APPLICATION.md).
- [Studio Hub Component Library Source of Truth](./ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md).
- [Studio Controls Global Defaults and Exception Index](./ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md).
- [PR #1229 — Studio Controls regression conversation handoff](https://github.com/viewtube-dev/viewtube/pull/1229).

**Known gap:** this audit did not establish one fully reconciled, current regression master report. The existing workstream and handoff remain source material. A consolidated report should preserve defect-by-defect provenance and should not mark a fix verified from a commit or PR description alone.

### 6. AI Brain product and technical specification

**Purpose:** describe the creator-facing Brain experience, runtime ownership, context/evidence, model gateway, prompt system, actions, learning, diagnostics, privacy and performance boundaries.

**Current authority:**
- [Brain Domain Authority](./domains/BRAIN.md) — current creator-facing Brain architecture.
- [Prompt Specification](./specifications/PROMPTS.md) and [Prompt Registry](./specifications/prompt-registry.json).
- [Analytics / VT-SYNC Master Resource](./analytics/VIEWTUBE_ANALYTICS_VT_SYNC_MASTER_RESOURCE.md).
- [Projects / ContentBuild Workflow Master Resource](./architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md).
- Current Brain runtime code and tests.

**Donor/history:** `docs/brain/AI_BRAIN_MASTER_RESOURCE.md`, `docs/brain/VIEWTUBE_AI_SYSTEMS_MASTER_RESOURCE.md` and `docs/brain/UNIFIED_AI_SYSTEM_CANONICAL_CONSOLIDATION_CONTRACT_2026-09-17.md` contain useful prior art, but the latter two explicitly carry Phase D supersession notices. Do not promote donor wording over `docs/domains/BRAIN.md`.

### 7. Engineering, branch, verification and release operations

**Purpose:** guide safe source inspection, task intake, selective porting, PR review, testing, deployment verification, rollback and handoff.

**Canonical sources:**
- [Task Authority](./governance/TASK_AUTHORITY.md).
- [Verification](./governance/VERIFICATION.md).
- [Integrated Application Program](./programs/INTEGRATED_APPLICATION.md).
- [Deployment & Release Master Resource](./deployment/VIEWTUBE_DEPLOYMENT_RELEASE_MASTER_RESOURCE.md).
- [Documentation Governance](./governance/DOCUMENTATION.md).
- Repository-specific contribution instructions and the relevant domain workstream plans.

**Boundary:** branch/PR state is not product completion. Record branch, commit, PR, merge, target presence, tests, build, runtime and deployment as separate evidence states.

### 8. Research, design and delivery resource library

**Purpose:** make prompts, research sources, citations, design references, schemas, skills, workflows, decision records, test templates and delivery evidence discoverable without copying their contents into a second knowledge store.

**Current source set:**
- [Documentation Registry](./registry.json) and [Documentation Governance](./governance/DOCUMENTATION.md).
- [Deep Research Construction Source](./references/DEEP_RESEARCH_CONSTRUCTION_SOURCE.md).
- [Prompt Specification](./specifications/PROMPTS.md) and [Prompt Registry](./specifications/prompt-registry.json).
- Domain authorities, skill references, task workspaces, verification receipts and linked Library/source artifacts.

**Boundary:** keep each artifact in its owning system. This index links to resources; it does not duplicate prompt registries, skills, code registries, evidence ledgers or task stores.

## Consolidation rules

- One primary authority per bounded concern.
- One existing canonical home is preferred over a new document.
- Preserve useful historical sources and record explicit supersession; never silently delete or overwrite unique material.
- Keep confirmed facts, supported claims, proposals, hypotheses and unknowns distinct.
- Cite the exact source, branch/commit/PR and verification evidence for implementation claims.
- Use existing `docs/registry.json`, `docs/architecture/capabilities.json`, Task Authority, Task Index and `ideas/registry.json`; do not create substitutes.
- Keep this index concise and navigational. Detailed requirements remain in the owning authorities.

## Execution status

The initial repository source inventory and mapping are recorded in [the Source Reconciliation Ledger](./audits/VIEWTUBE_SOURCE_RECONCILIATION_LEDGER_2026-11-13.md).

The ledger is an audit snapshot, not a claim that all eight areas are fully consolidated. Outstanding source verification, donor reconciliation, research validation and document updates must be completed as separately evidenced work.
