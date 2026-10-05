# ViewTube Tool Copy / Widget Documentation Conversation Recovery Handoff

Status: RECOVERED — ROUND 1; CANONICAL RECONCILIATION PENDING
Source conversation: Current ChatGPT conversation
Date: 2026-10-04
Canonical repository: viewtube-dev/viewtube
Historical/source repository referenced: cbrewsterthegreat/ViewTube
Primary subject: tool/widget inventory, contextual ? / Learn More copy, documentation governance, and tool-knowledge workstream.

## Executive recovery

This conversation developed a proposed and partially executed system for documenting ViewTube's actual user-facing tools and widgets.

Core requirement: every actual tool/widget/module must have durable tool-specific knowledge and accurate contextual ? / Learn More copy based on current implementation.

Required record fields: exact visible title; manifestation; module/widget/tool name; page; canonical ID; implementation; status; purpose; inputs; controls; workflow; prompts; prompt inputs/outputs; integrations; concrete handoffs; outputs; persistence; downstream consumers; constraints/permissions; current copy; rewritten contextual copy; User Guide location; related tools; governance IDs; implementation evidence.

## Key user decisions

- Dashboard Widget ownership and Toolbox/SubToolbox ownership are completely separate even when primitives or concepts match.
- Integrations mean how tools/systems communicate; handoffs are the actual assets/data/context passed between them.
- The contextual ? section is effectively a one-tool User Guide and should project from canonical tool knowledge rather than become a competing knowledge base.
- Capabilities without a visible manifestation must still be cataloged and explicitly marked NOT CURRENTLY REPRESENTED AS A DASHBOARD WIDGET OR TOOLBOX/PAGE MODULE.
- Exact visible titles must match the manifested widget/module/tool title.
- Use existing governance IDs, consolidation, review/audit, and task systems rather than creating parallel trackers.
- Simple tasks should be isolated for rapid completion while complex audits/plans remain governed workstreams.
- The documentation routing model adopted in the conversation was docs = durable truth, work = active execution, ideas = intake, archive = history.

## Critical correction

A previous pass treated a 68-widget registry as the complete product inventory. The user rejected that conclusion. A single registry/count must not be treated as the complete product inventory.

The complete inventory must reconcile Dashboard runtime registries, default visual order, additional/conditional widgets, Dashboard sections, Studio Hub toolboxes/subtoolboxes, Projects tools/stages/assets, Vault, AI Brain, Resources, Analytics, Settings, User Guide, Editor, and non-UI capabilities.

## Copy standards

Copy must describe verified current behavior only. Avoid unsupported guarantees involving ranking, recommendation algorithms, reach, CTR, revenue, distribution, platform manipulation, or demand/competition. Do not claim a tool performs an action when it only generates a recommendation, plan, prompt, or asset. Keep planning, rendering, editing, and publishing distinct. Keep integrations and handoffs distinct.

## Historical artifacts created or materially edited

These paths were created or materially edited in the historical cbrewsterthegreat/ViewTube repository context and have not been reconciled into canonical viewtube-dev/viewtube/main:

- work/active/documentation-system-consolidation/work.md
- work/active/documentation-system-consolidation/MIGRATION-MAP.md
- work/active/documentation-system-consolidation/DISPOSITION-LOG.md
- work/active/documentation-system-consolidation/TOOL-COPY-KNOWLEDGE-WORKSTREAM.md
- work/active/documentation-system-consolidation/DASHBOARD-TOOL-KNOWLEDGE-INVENTORY-2026-10-01.md
- work/active/documentation-system-consolidation/DASHBOARD-COPY-AUDIT-2026-10-01.md
- docs/user-guide-v2/tool-knowledge/TOOL-QUESTION-MARK-DESCRIPTIONS-MASTER-2026-10-01.md

Temporary batch files were created and then removed in that historical branch: DASHBOARD-COPY-AUDIT-BATCH-01-2026-10-01.md and DASHBOARD-COPY-AUDIT-BATCH-02-2026-10-01.md. The user explicitly rejected batch-document proliferation; one master audit and one master contextual-copy catalog are preferred.

## Historical repository evidence

Reported historical operations include documentation consolidation PR #14 merged to historical main as dde74c656878ec81af48bf053e17544d8ad34b2c; tool copy/knowledge PR #17 merged as c45aedaac9cb0fc27126ea4689d36c9104676b94; Dashboard inventory commit 3cdafeeb51692c3a81e2eb5dfcb393053a3e9b4d; Dashboard audit commits fe94419bcb6e63d2e248fe934f5fe9db847b29e6 and 3ad65ed8fe499b4a7dcc05dc011f59844f7135bf.

These are conversation-reported historical evidence, not canonical implementation evidence until reconciled against viewtube-dev/viewtube/main.

## Canonical repository synchronization

Before this recovery, the current main branch was inspected for Recovery.md, Recovery.yaml, docs/Index.md, docs/Organization.md, docs/Document-System.md, docs/Document-Health.md, docs/recovery/Index.md, docs/recovery/Agent.md, and docs/recovery/History.md.

Verified canonical facts: Recovery.md and Recovery.yaml are canonical recovery state; Document-System defines document lifecycle and preservation; Document-Health defines migration gates; Organization defines the target shallow documentation structure; History is the shared operation ledger; Findings is the existing findings register; Knowledge Index and Recovery Index define navigation and consolidation rules.

The named historical TOOL-COPY-KNOWLEDGE-WORKSTREAM.md was not found in canonical viewtube-dev/viewtube/main during search. It remains historical/source conversation material until Round 2 reconciliation.

## Findings

FINDING-20261004-COPY-001 — Incomplete inventory risk. A single Dashboard registry/count is insufficient as the complete product tool inventory. Impact: missing tools/sections lead to incomplete ? and User Guide coverage. Recommended: reconcile registries, routes, toolbox definitions, page-native tools, and non-UI capabilities. Status: VERIFIED DISCOVERY; implementation UNKNOWN.

FINDING-20261004-COPY-002 — Contextual help should be derived, not independently authored. One canonical tool record should project concise ? help and expanded Learn More. Status: PROPOSED; current implementation UNKNOWN.

FINDING-20261004-COPY-003 — Tool identity needs manifestation-level identity: exact title, page, manifestation type, module/widget/tool name, and canonical ID. Status: PROPOSED; current implementation UNKNOWN.

FINDING-20261004-COPY-004 — Dashboard and Toolbox ownership must remain separate. Status: USER-APPROVED DECISION; implementation alignment UNKNOWN.

FINDING-20261004-COPY-005 — Copy claims need implementation evidence before being treated as current product truth. Status: VERIFIED DISCOVERY.

## Category review

BUGS: No new runtime bug was directly verified. Documentation/inventory incompleteness was identified.

CODE STRUCTURE: Potential ownership/identity ambiguity between Dashboard widgets, Toolbox modules, and underlying services was identified as a documentation/architecture risk. Current code structure remains UNKNOWN pending canonical implementation inspection.

TOOL IDEAS: governed tool/widget knowledge catalog and contextual ? / Learn More system.

WORKFLOW: reuse governance IDs; consolidate duplicate tasks/plans/audits; maintain one master copy catalog; separate simple quick work from complex audits/plans.

HANDOFFS: document inputs, outputs, integrations, handoffs, prompts, and downstream consumers for each tool.

AI: document actual prompts, prompt inputs/outputs, context, and AI integrations where applicable. No new AI implementation was verified here.

UX: contextual ? help should act as a one-tool User Guide synchronized with canonical tool knowledge.

PERFORMANCE: no specific performance optimization was verified. UNKNOWN.

SECURITY/RELIABILITY: no new runtime vulnerability was verified; provenance and stale-copy risks are documentation reliability concerns.

DATA: canonical IDs, manifestation metadata, inputs/outputs, persistence, and handoff schemas should be captured. Exact current schema UNKNOWN.

TESTING: verify copy against implementation and UI/interaction tests before marking current.

## Unresolved items

1. Reconcile historical copy work against viewtube-dev/viewtube/main.
2. Determine the complete Dashboard widget inventory and actual visual order.
3. Determine all Dashboard sections.
4. Enumerate every Toolbox/SubToolbox module and page.
5. Enumerate Projects, Vault, AI Brain, Resources, Analytics, Settings, User Guide, and Editor tools.
6. Determine the canonical owner for the final tool/copy catalog.
7. Verify actual current ? / Learn More implementation.
8. Reconcile historical tool IDs and implementation claims.
9. Determine whether Library artifacts should become repository source artifacts or remain conversation evidence.
10. Perform Round 2 reconciliation before superseding any historical source.

## Preservation rule

No historical source listed above should be deleted or treated as canonical implementation evidence merely because this handoff exists.