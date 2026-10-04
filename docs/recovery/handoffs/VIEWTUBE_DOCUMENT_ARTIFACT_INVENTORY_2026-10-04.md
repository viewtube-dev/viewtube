# ViewTube Conversation Recovery — Documentation & Artifact Inventory
## 2026-10-04

Source conversation: Current ViewTube Recovery Agent activation conversation
Round: 1
Status: RECOVERED / PROPOSED INVENTORY
Repository: viewtube-dev/viewtube
Branch: main

## Purpose

Preserve the substantive project knowledge produced in this conversation about what ViewTube responses should become durable documents/artifacts. This is a conversation-derived inventory, not a claim that every proposed artifact exists or is implemented.

The conversation established that ChatGPT responses containing major plans, audits, specifications, architecture, implementation proposals, governance rules, discoveries, or system designs are document-equivalent and must be preserved durably.

## 1. Master ViewTube control documents identified

Proposed canonical control artifacts:
- docs/INDEX.md — master entry point to canonical ViewTube documentation.
- docs/governance/ARTIFACT_REGISTRY.md — document/artifact authority, status, provenance registry.
- docs/governance/VIEWTUBE_MASTER_LEDGER.md — master project event/change ledger.
- docs/governance/DECISION_AUTHORITY.md — source-of-truth and conflict authority.
- docs/governance/PROVENANCE.md — source → discovery → decision → implementation → verification lineage.
- docs/governance/STATUS_TAXONOMY.md — controlled status vocabulary.
- docs/governance/REPOSITORY_GOVERNANCE.md — repository/document governance.
- docs/handoffs/VIEWTUBE_MASTER_HANDOFF.md — durable project continuation handoff.

These are proposed in this conversation. Their existence and authority must be checked against main before treating them as canonical.

## 2. Conversation OS / governed-work system

The conversation identified:
- docs/governance/CONVERSATION_OS.md
- docs/governance/DOCUMENT_OUTPUT_ROUTING.md
- docs/governance/CONVERSATION_OS_KICKOFF_PROMPT.md
- docs/governance/CONVERSATION_HANDOFF_TEMPLATE.md
- docs/governance/WORK_SESSION_TEMPLATE.md
- docs/governance/TOOL_USAGE_PROVENANCE.md
- docs/governance/CONVERSATION_ARTIFACT_CAPTURE.md
- docs/governance/MAIN_BRANCH_COMPLETION_RULE.md

Recovered operating model:
conversation → discovery → plan → implementation → verification → merge → documentation → handoff.

A task/win is not implementation-complete merely because a plan or audit exists. Completion requires implementation, merge to main, and verification.

## 3. Recovery system

Identified recovery artifacts:
- docs/recovery/VIEWTUBE_RECOVERY_PROTOCOL.md
- docs/recovery/VIEWTUBE_RECOVERY_LEDGER.md
- docs/recovery/RECOVERY_MASTER_PROMPT.md
- docs/recovery/RECOVERY_ROUND_1.md
- docs/recovery/RECOVERY_ROUND_2.md
- docs/recovery/CHATGPT_LIBRARY_ARCHIVE.md
- docs/recovery/CHATGPT_ARTIFACT_IMPORT.md
- docs/recovery/CONVERSATION_ARCHIVE_INDEX.md
- docs/recovery/CONVERSATION_TO_ARTIFACT_MAP.md
- docs/recovery/RESOURCE_LIBRARY_RECOVERY.md
- docs/recovery/RESOURCE_LIBRARY_DIAGNOSTIC.md
- docs/recovery/RESOURCE_LIBRARY_MIGRATION.md
- docs/recovery/EXPORT_ERRORS_PLAN.md

Recovery model: Round 1 independently preserves unique conversation evidence; Round 2 compares and reconciles duplicate/conflicting sources. Conflict priority is current verified implementation > verified tests/deployments > current canonical docs > explicit approved decisions > recovery artifacts > plans > general discussion.

## 4. UI / CSS / component system

Identified durable targets:
- docs/ui/VIEWTUBE_UI_SYSTEM.md
- docs/ui/RESPONSIVE_LAYOUT_SYSTEM.md
- docs/ui/SIZE_SYSTEM.md
- docs/ui/COMPONENT_LEVEL_DNA.md
- docs/ui/L0_L1_L2_COMPONENT_SPEC.md
- docs/ui/L0_L1_L2_RATIO_MATRIX.md
- docs/ui/L0_L1_L2_IMPLEMENTATION_CHECKLIST.md
- docs/ui/COMPONENT_CERTIFICATION.md
- docs/ui/PRIMITIVE_MIGRATION.md
- docs/ui/UI_REFERENCE_LIBRARY.md
- docs/ui/COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md
- docs/ui/REFERENCE_VS_PRODUCTION_LIBRARY.md
- docs/ui/TOOLBOX_UI_SPEC.md
- docs/ui/TOOLBOX_CSS_SYSTEM.md
- docs/ui/TOOLBOX_COMPONENT_CONTRACT.md
- docs/ui/TOOLBOX_ACCESSIBILITY.md
- docs/ui/TOOLBOX_IMPLEMENTATION_HANDOFF.md
- docs/ui/STUDIO_HUB_SPEC.md
- docs/ui/STUDIO_HUB_CORRECTION_PLAN.md
- docs/ui/STUDIO_HUB_COMPONENT_AUDIT.md
- docs/ui/SECOND_LIBRARY_MIGRATION.md
- docs/ui/UI_MODERNIZATION_PLAN.md
- docs/ui/UI_REGRESSION_CONTRACT.md
- docs/ui/UI_VERIFICATION_MATRIX.md
- docs/ui/UI_CERTIFICATION.md

Important UI decision: the size system provides default sizes for widget layouts, while components and primitives remain adaptable to other sizes.

Important component decision: structural T0–T3 concepts and component L0/L1/L2 concepts are distinct and should not be collapsed.

Audits are evidence/findings, not Quick Wins or implementation completion.

## 5. Content / Asset / Vault / Projects architecture

Recovered relationship:
ContentBuild → Asset Engine → Vault → Projects → Packages/Publishing

Identified architecture artifacts:
- docs/architecture/CONTENT_ASSET_VAULT_ARCHITECTURE.md
- docs/architecture/IDENTITY_AND_OWNERSHIP.md
- docs/architecture/PROJECTION_MODEL.md
- docs/architecture/OPERATION_RECORD.md
- docs/architecture/BRIDGE_RETIREMENT.md
- docs/architecture/VIEWTUBE_ARCHITECTURE.md
- docs/architecture/ARCHITECTURE_INVENTORY.md
- docs/architecture/CONVERGENCE_LEDGER.md

Convergence statuses discussed: KEEP, MERGE, PROJECT, ADAPTER, PAIR, QUARANTINE, REMOVE.

Bridge retirement pattern: migrate → prove unreachable → quarantine → remove.

## 6. Projects / Analytics / Vault tool inventory

Recovered page-level tool grouping:
Projects has four top-level tool groups:
1. AI Brain
2. Analytics
3. Vault
4. Editor

Analytics contains:
- Sync Controller
- Intelligence Hub
- Master Data Tables
- Data Visuals

Vault is one tool.
AI Brain is one tool.
Editor is one tool.
Resource Library is one tool.

The page-level boundary should be preserved; internal capabilities belong inside a tool's Inputs, Workflow, Outputs, or Connections rather than automatically becoming separate top-level tools.

## 7. AI Brain / intelligence system

The conversation explicitly identified AI Brain as a first-class ViewTube system.

Proposed artifact family:
- docs/ai/VIEWTUBE_AI_BRAIN_MASTER.md
- docs/ai/BRAIN_RUNTIME_ARCHITECTURE.md
- docs/ai/AI_CONTEXT_ARCHITECTURE.md
- docs/ai/AI_MEMORY_ARCHITECTURE.md
- docs/ai/AI_TOOL_ORCHESTRATION.md
- docs/ai/AI_AGENT_ARCHITECTURE.md
- docs/ai/AI_WORKFLOW_ENGINE.md
- docs/ai/AI_KNOWLEDGE_SYSTEM.md
- docs/ai/AI_PROJECT_CONTEXT.md
- docs/ai/AI_ASSET_CONTEXT.md
- docs/ai/AI_DECISION_SYSTEM.md
- docs/ai/AI_EVIDENCE_SYSTEM.md
- docs/ai/AI_GOVERNANCE.md
- docs/ai/AI_BRAIN_IMPLEMENTATION_MATRIX.md

Conceptual Brain flow:
User → Account/Identity → Workspace/Project → Conversation → Context → Memory → Knowledge → Tools/Connectors → Agents → Workflows → Actions → Evidence → Artifacts → Ledger.

Conceptual distinctions:
- AI Brain: intelligence/orchestration layer.
- Brain Runtime: execution environment.
- Memory: persistent user/project knowledge.
- Context: information relevant to the current task.
- Knowledge: structured/retrieved domain information.
- Agents: specialized workers.
- Tools: external capabilities.
- Evidence: proof supporting decisions/actions.
- Artifacts: durable outputs.
- Ledger: history/provenance.

Repository reconciliation finding: an existing Brain report is already present at docs/VIEWTUBE_BRAIN_AI_SYSTEM_REPORT_2026-10-02.md. Brain is also referenced by Creator Workspaces, Resource Library, Master System Rebuild, Vault/Asset Workbench, and Conversation OS resources. Therefore the proposed docs/ai family must not be blindly created as competing authorities.

## 8. Account / login / identity system

The conversation explicitly identified Account/Login as another first-class foundation.

Proposed artifact family:
- docs/identity/ACCOUNT_IDENTITY_MASTER.md
- docs/identity/AUTHENTICATION_ARCHITECTURE.md
- docs/identity/ACCOUNT_LIFECYCLE.md
- docs/identity/SIGNUP_LOGIN_FLOW.md
- docs/identity/SESSION_ARCHITECTURE.md
- docs/identity/USER_PROFILE_ARCHITECTURE.md
- docs/identity/WORKSPACE_ARCHITECTURE.md
- docs/identity/ORGANIZATION_ARCHITECTURE.md
- docs/identity/AUTHORIZATION_MODEL.md
- docs/identity/ROLE_PERMISSION_MODEL.md
- docs/identity/GOOGLE_AUTH_ARCHITECTURE.md
- docs/identity/YOUTUBE_AUTHORIZATION.md
- docs/identity/CONNECTIONS_ARCHITECTURE.md
- docs/identity/API_CREDENTIAL_ARCHITECTURE.md
- docs/identity/ACCOUNT_RECOVERY.md
- docs/identity/SECURITY_MODEL.md
- docs/identity/IDENTITY_DATA_MODEL.md
- docs/identity/IDENTITY_IMPLEMENTATION_MATRIX.md

Account system scope includes identity, sessions, profile, workspace ownership, connections, YouTube/Google authorization, permissions, Brain boundaries, Vault ownership, Projects ownership, analytics evidence boundaries, and recovery/security.

Repository reconciliation finding: current main already contains docs/recovery/VIEWTUBE_ACCOUNT_SYSTEM_RECOVERY_SOURCE_2026-10-04.md and the Master System Rebuild Resource Index references a planned docs/account/VIEWTUBE_ACCOUNT_SYSTEM_MASTER.md. Reconcile those before creating a competing identity authority.

## 9. Context system — bridge between Account and Brain

Proposed context artifacts:
- docs/context/VIEWTUBE_CONTEXT_SYSTEM.md
- docs/context/USER_CONTEXT.md
- docs/context/WORKSPACE_CONTEXT.md
- docs/context/PROJECT_CONTEXT.md
- docs/context/CONTENT_CONTEXT.md
- docs/context/ASSET_CONTEXT.md
- docs/context/CONVERSATION_CONTEXT.md
- docs/context/CONTEXT_RESOLUTION.md
- docs/context/CONTEXT_INHERITANCE.md
- docs/context/CONTEXT_PROVENANCE.md

Conceptual chain:
User → Workspace → Project → ContentBuild → Asset → Conversation → AI task.

The Brain should know which context it is operating inside before it acts.

This must be reconciled against Brain, Conversation OS, Creator Workspaces, Vault, Projects, and Account resources before creating separate canonical files.

## 10. Implementation / Quick Wins

Identified:
- docs/implementation/QUICK_WINS_PROGRAM.md
- docs/implementation/QUICK_WINS_EXECUTION_RULES.md
- docs/implementation/100_TASK_EXECUTION_MATRIX.md
- docs/implementation/TASK_LIFECYCLE.md
- docs/implementation/PLAN_REGISTRY.md
- docs/implementation/IMPLEMENTATION_MATRIX.md

Recovered Quick Win rules:
- audits are not Quick Wins;
- Quick Wins are actual implementation/fixes/documentation/configuration or established-plan slices;
- completion requires merge to main;
- verification follows merge;
- recover the authoritative Quick Wins 100 source before recreating a tracker.

## 11. Deployment / beta readiness

Identified:
- docs/deployment/RENDER_DEPLOYMENT.md
- docs/deployment/RENDER_VERIFICATION.md
- docs/deployment/BUILD_COMPATIBILITY.md
- docs/deployment/DEPLOYMENT_HANDOFF.md
- docs/implementation/BETA_READINESS_PLAN.md
- docs/implementation/BETA_READINESS_CHECKLIST.md
- docs/governance/BETA_PRIORITY_DECISION.md

Recovered beta-related areas included server-owned Google authentication, session truth, YouTube API gateways, Video Manager integration, production auth routing, signup/login, YouTube authorization, channel recognition, and VT-SYNC. These remain reported/proposed unless independently verified.

## 12. Documentation architecture / handoffs

The conversation proposed a shallow docs structure:
docs/
├── INDEX.md
├── governance/
├── architecture/
├── ui/
├── implementation/
├── deployment/
├── recovery/
├── handoffs/
└── plans/

Earlier repository recovery material also identifies a broader convention of docs/, work/active/, work/intake/, ideas/, and archive/. This is a reconciliation point, not a silent replacement.

Handoff targets:
- docs/handoffs/VIEWTUBE_MASTER_HANDOFF.md
- docs/handoffs/UI_SYSTEM_HANDOFF.md
- docs/handoffs/ARCHITECTURE_HANDOFF.md
- docs/handoffs/RECOVERY_HANDOFF.md
- docs/handoffs/IMPLEMENTATION_HANDOFF.md

The existing Vault/Projects handoff should remain historical evidence while durable decisions are consolidated into canonical resources.

## 13. Material discoveries / optimizations

DISC-20261004-001 — Document-equivalent response preservation
Category: Recovery/governance
Discovery: substantive assistant responses are recoverable document-equivalent artifacts.
Status: VERIFIED as a recovery-policy requirement.
Action: preserve substantive response content in actual repository artifacts.

DISC-20261004-002 — Brain is a first-class system
Category: AI/architecture
Discovery: Brain has distinct runtime, context, memory, knowledge, agents, tools, workflow, evidence, governance, and implementation concerns.
Status: PROPOSED in this conversation; existing Brain report is repository evidence.
Action: reconcile existing Brain resources before creating competing authorities.

DISC-20261004-003 — Account/Login is a first-class foundation
Category: Identity/architecture
Discovery: Account/Login underpins identity, sessions, workspaces, connections, YouTube authorization, permissions, Brain boundaries, Vault ownership, Projects ownership, and analytics evidence boundaries.
Status: REPORTED/RECOVERED; implementation status UNKNOWN.
Action: reconcile existing Account System resources first.

DISC-20261004-004 — Context bridges Identity and Brain
Category: AI/architecture
Discovery: user/workspace/project/content/asset/conversation context is the bridge that lets Brain operate within account and project boundaries.
Status: PROPOSED architecture with related repository evidence.
Action: establish canonical context model in Round 2.

DISC-20261004-005 — Avoid document explosion
Category: Governance/maintainability
Discovery: dozens of proposed documents could become competing authorities because related canonical resources already exist.
Status: INFERRED from repository search and recovery policy.
Action: search main before creating each proposed artifact; consolidate and preserve provenance.

DISC-20261004-006 — Page-level tool boundary
Category: Product/UX/architecture
Discovery: Projects has four top-level tool groups: AI Brain, Analytics, Vault, Editor. Analytics contains Sync Controller, Intelligence Hub, Master Data Tables, Data Visuals. Vault, AI Brain, Editor, and Resource Library are each page-level tools.
Status: REPORTED; related repository context exists.
Action: preserve page-level boundaries.

DISC-20261004-007 — Size-system boundary
Category: UI architecture
Discovery: default size presets belong to widget/layout sizing; components/primitives can adapt to arbitrary sizes.
Status: REPORTED.
Action: preserve in canonical UI documentation.

DISC-20261004-008 — Audits are not completion
Category: Governance/implementation
Discovery: audit findings must not be counted as Quick Wins or implementation completion.
Status: VERIFIED as consistent with recovery completion rules.
Action: require implementation → merge to main → verification.

## 14. What is intentionally not claimed

This conversation does not establish that every proposed document exists, is canonical, or is implemented.

Specifically:
- proposed docs/ai, docs/identity, and docs/context families are not automatically canonical;
- existing Brain and Account resources require reconciliation first;
- historical cbrewsterthegreat/ViewTube claims remain separate evidence until verified against viewtube-dev/viewtube/main;
- no deployment state is inferred from these plans;
- no implementation is inferred merely from a plan, audit, or discussion.

## 15. Required Round 2 actions

1. Reconcile existing Brain/AI resources with the proposed Brain artifact family.
2. Reconcile Account System recovery/master resources with the proposed identity artifact family.
3. Reconcile context concepts across Brain, Conversation OS, Creator Workspaces, Vault, Projects, and Account.
4. Search main before creating proposed UI/system documents.
5. Establish/update the master artifact registry.
6. Mark duplicate or superseded documents explicitly rather than silently deleting provenance.
7. Verify implementation against current main.
8. Create missing canonical documents only after reconciliation.

## Provenance

Repository findings in this recovery artifact were checked against current viewtube-dev/viewtube/main during Round 1. Existing relevant resources include:
- docs/VIEWTUBE_BRAIN_AI_SYSTEM_REPORT_2026-10-02.md
- docs/product/VIEWTUBE_CREATOR_WORKSPACES_MASTER_TOOL_CONTEXT.md
- docs/recovery/VIEWTUBE_ACCOUNT_SYSTEM_RECOVERY_SOURCE_2026-10-04.md
- docs/governance/MASTER_SYSTEM_REBUILD_RESOURCE_INDEX.md
- docs/governance/MASTER_SYSTEM_REBUILD_RESOURCE_PLAN.md
- docs/governance/MASTER_SYSTEM_REBUILD_DEPENDENCY_MAP.md
- docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md
- docs/governance/CONVERSATION_OS_REBUILD_MASTER.md
- docs/recovery/VIEWTUBE_PROJECTS_ANALYTICS_TOOL_SOURCE_2026-10-04.md
- docs/recovery/VIEWTUBE_CHATGPT_DOCUMENT_CATALOG_2026-10-04.md

Recovery status: Round 1 contribution preserved. Cross-conversation reconciliation remains pending.
