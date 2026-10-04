# ViewTube Recovery — Creator Workspace Documentation + Resource Verification Handoff
## 2026-10-04

**Round:** 1  
**Status:** VERIFIED recovery artifact / mixed-status project evidence  
**Repository:** `viewtube-dev/viewtube`  
**Branch:** `main`  
**Source conversation title:** Unavailable in current runtime; do not invent a title.  
**Primary purpose:** Preserve the durable ViewTube knowledge recovered during this conversation, including the creator-workspace tool-context documentation, Dashboard/Studio Hub inventories, documentation governance rules, GitHub recovery coordination, and verification of the public Resource Library page.

---

## 1. Recovery scope

This conversation was activated as a ViewTube Recovery + Research + Documentation + Implementation Agent under:

`docs/recovery/VIEWTUBE_CONVERSATION_AGENT_ACTIVATION_PROMPT.md`

The required recovery contract was read first, followed by the current:

- `Recovery.md`
- `Recovery.yaml`
- `docs/recovery/AGENT_RECOVERY_PLAYBOOK.md`
- `docs/recovery/VIEWTUBE_CONVERSATION_RECOVERY_INDEX_2026-10-02.md`
- `docs/recovery/VIEWTUBE_CHATGPT_DOCUMENT_CATALOG_2026-10-04.md`
- `docs/recovery/handoffs/VIEWTUBE_DOCUMENT_ARTIFACT_INVENTORY_2026-10-04.md`
- `docs/product/VIEWTUBE_CREATOR_WORKSPACES_MASTER_TOOL_CONTEXT.md`

This handoff preserves Round 1 evidence. It does not perform cross-conversation Round 2 reconciliation.

---

## 2. Canonical documentation rule recovered

The creator-workspace tool documentation uses this exact hierarchy:

**Description → Inputs → Workflow → Outputs → Connections**

For every tool:

- **Description** — concise explanation of what the tool does.
- **Learn More**
  1. **Inputs** — inputs and controls.
  2. **Workflow** — how the creator uses it.
  3. **Outputs** — what it produces or changes.
  4. **Connections** — integrations and workflow handoffs.

The documentation should be brief, clear, precise, high-density, and avoid repetitive sections such as separate Purpose, Controls, or Handoffs sections.

---

## 3. Canonical creator-workspace inventory recovered

The documented core workspace inventory is:

### Projects — 4
1. Project Builder
2. Project Board
3. Project Calendar
4. Storyboard Studio

### AI Brain — 1
5. AI Brain

### Analytics — 4
6. Sync Controller
7. Intelligence Hub
8. Master Data Tables
9. Data Visuals

### Vault — 1
10. Vault

### Editor — 1
11. Editor

### Resource Library — 1
12. Resource Library

The repository also contains a master tool-context document covering Dashboard and Studio Hub tools.

Canonical master:

`docs/product/VIEWTUBE_CREATOR_WORKSPACES_MASTER_TOOL_CONTEXT.md`

Latest verified repository state during this recovery pass includes the core workspace tools plus Dashboard and Studio Hub sections. A prior update reported commit:

`862ae7dd61f77f43d6a08bb51ca8d38aebf6c7e4`

and file blob SHA:

`be1ef5e8884347c2d01c56eb8ab185ee10e1e1af`

Those identifiers are preserved as repository evidence from the conversation; the current file should still be re-fetched before any future write.

---

## 4. Dashboard inventory recovered

The screenshot-confirmed Dashboard inventory contains 66 widgets:

1. About ViewTube
2. Channel Overview
3. Community Post
4. Comment Responder
5. Upload Cadence
6. Realtime
7. Goals Tracker
8. Keyword Engine
9. Daily Oracle
10. Ask Me
11. AI Journal
12. Brain Hub
13. Next Best Action
14. Opportunity Radar
15. Content Pipeline
16. Audience Requests
17. Video Asset Engine
18. Publishing Command
19. Channel Progress
20. Video Director
21. Shorts Multiplier
22. Image Generator
23. Video Uploader
24. Video Manager
25. Traffic Sources
26. Long vs Short
27. Published Momentum
28. Audience Matrix
29. Settings
30. Keyword Overlap
31. Retention Simulator
32. Upload Scheduler
33. Thumb AI
34. Quick Actions
35. Revenue Momentum
36. Title Rewriter
37. Description Editor
38. Hashtag Analyzer
39. Social Channels
40. Mini Calendar
41. Task Stack
42. Recent Uploads
43. Top Performer
44. Alerts Feed
45. News Ticker
46. Tag Generator
47. Revenue Tracker
48. Retention Dip
49. Longform Optimizer
50. Reach Funnel
51. Algo Benchmark
52. The Ad Stack
53. Bridge Efficiency
54. Burnout Monitor
55. Collab Matchmaker
56. UI Reference Library
57. Video Autopsy
58. A/B Thumbnail Test
59. Algorithm Benchmark
60. CPM by Geography
61. Device Matrix
62. Guest Ratio
63. Playback Origins
64. Premium Pulse
65. Sharing DNA
66. Video Comment Operator

Important discrepancy: an earlier repository registry reported 65 widgets while the user-provided screenshots established 66. The documentation intentionally follows the screenshot-visible 66 rather than silently dropping a widget to match the older registry count. This discrepancy remains a reconciliation item.

---

## 5. Studio Hub inventory and source-backed relationships

Studio Hub contains 13 documented tools:

1. Video Manager
2. Video Director
3. Video Publisher
4. Publishing Package
5. Content Analysis
6. Thumbnail Studio
7. Community Posts
8. Comment Responder
9. End-Screen Architect
10. Pre-Launch Priming
11. Hook Generator
12. Tactics Engine
13. Script Architect

Repository/source evidence identified:

- `src/views/StudioHub.tsx` — Studio Hub modules.
- `src/services/viewTubeToolChains.ts` — tool-chain IDs, labels, routes, accepted inputs, produced outputs, status, and descriptions.
- `src/views/dashboard/useDashboardData.ts` — Studio tool routing to `/studio#...`.
- `src/content/userGuideContent.ts` — user-guide/tool instructions.
- `src/assets/studioHubIconData.ts` — icon mappings.
- Relevant implementation files include `VideoPublisher.tsx`, `MediaAnalyzer.tsx`, `ThumbnailStudio.tsx`, `HookGenerator.tsx`, `ActionableTactics.tsx`, `ScriptArchitect.tsx`, `VideoDirector.tsx`, and `PreLaunchPriming.tsx`.
- `StudioPublishingCockpit.tsx` implements Publishing Package.
- `ProjectPublishingPackageSummary.tsx` describes Publishing Package as a compact YouTube readiness summary for a ContentBuild.
- `CreatorCanvasOS.tsx` describes Script Architect as turning a chosen angle into beats, proof order, transitions, and storyboard-ready scene packets.
- `VideoDirector.tsx` describes directing single videos, variations, sequences, and campaigns from a traceable Video DNA system.
- `VideoPublisher.tsx` covers SEO-optimized titles, descriptions, tags, and publishing information.
- `MediaAnalyzer.tsx` covers scripts/videos, pacing, retention drops, and quality fixes.
- `ThumbnailStudio.tsx` creates thumbnails and image assets for end screens, posts, polls, and more.
- `StudioHub.tsx` includes Community Posts and Comment Responder workflows.

Source-backed tool-chain details recovered include:

- Thumbnail Studio accepts video/image/metadata/analysis/hook and produces thumbnail/image/asset.
- Community Posts accepts image/video/metadata/analysis/poll and produces community-post/poll/asset.
- Comment Responder accepts comment/video/metadata/analysis and produces comment/analysis/video.
- End-Screen Architect accepts video/analysis/metadata and produces metadata/script/video.
- Pre-Launch Priming accepts video/thumbnail/metadata/analysis and produces tactic/metadata/project.
- Hook Generator accepts script/video/analysis/tactic/metadata and produces hook/script.
- Tactics Engine accepts analysis/evidence/video/metadata and produces tactic/project.

Script Architect timing is supported by `scriptBudget.ts`, while quality checks are supported by `scriptQuality.ts`.

---

## 6. Core workspace architecture decisions recovered

### Projects

Project Builder creates and configures a project that keeps its brief, goals, content, assets, tasks, and publishing work together.

Project Board manages projects through their production lifecycle.

Project Calendar plans timing, deadlines, milestones, and publishing activity.

Storyboard Studio turns creative direction into organized scenes, beats, shots, and production planning.

### AI Brain

AI Brain is treated as a first-class ViewTube intelligence/orchestration system, not merely a widget.

Its recovered conceptual responsibilities include:

- conversation/reasoning;
- creator/channel context;
- project context;
- analytics context;
- content/assets;
- evidence;
- recommendations;
- actions;
- workflow orchestration;
- persistent creator context where supported.

Existing repository Brain resources must remain the authority until Round 2 reconciliation establishes whether proposed Brain sub-documents are actually needed.

### Analytics

Analytics is a page-level grouping with:

- Sync Controller;
- Intelligence Hub;
- Master Data Tables;
- Data Visuals.

The intended flow is synchronized YouTube data → canonical structured tables → intelligence/analysis → visual evidence and creator decisions.

### Vault

Vault stores, organizes, inspects, versions, and reuses creator assets across projects and production workflows.

### Editor

Editor composes and edits video from media, scenes, audio, captions, overlays, transitions, and related production assets.

### Resource Library

Resource Library is a page-level tool for searchable documentation, guides, references, playbooks, and reusable creator resources.

---

## 7. UI/design-system decisions preserved

A critical UI decision recovered from the conversation:

> The size system provides default sizes for widget layouts, while components and primitives remain adaptable to other sizes.

Another important decision:

> The UI Reference Library is intended to contain the actual primitives/reference representatives of the style, token, and size system used by widgets.

When a widget need arises, the preferred decision is situation-dependent:

> fix an existing one, create a new one, or add a variant.

The component/reference library and production widgets should not be treated as interchangeable merely because they share primitives.

---

## 8. Toolbox / SubToolbox recovery findings

The conversation recorded a significant concern that the Toolbox and SubToolbox system had become more unstable/error-prone during recent work.

Recovered durable themes:

- create/maintain a master Toolbox UI + CSS resource artifact;
- preserve compatibility/export-error findings;
- distinguish reference-library primitives from production widget implementations;
- use canonical UI primitives and tokens rather than repeatedly inventing widget-specific styling;
- maintain explicit handoffs between Toolbox, SubToolbox, UI Reference Library, Studio Hub, and Dashboard work.

Relevant known recovery documents include:

- `docs/plans/VIEWTUBE_TOOLBOX_COMPATIBILITY_31_EXPORT_ERRORS_PLAN_2026-10-02.md`
- `docs/handoffs/VIEWTUBE_TOOLBOX_UI_CSS_CURRENT_CONVERSATION_HANDOFF_2026-10-02.md`
- `docs/governance/CONVERSATION_OS.md`

The exact current implementation state of all Toolbox/SubToolbox changes remains a Round 2 verification target unless directly verified against `main`.

---

## 9. Documentation governance and recovery findings

The conversation reinforced these rules:

- GitHub is durable shared memory; chat is evidence.
- Every major plan, audit, specification, architecture/design decision, implementation discussion, or substantive assistant response is document-equivalent.
- A one-line recovery log is not sufficient preservation for major material.
- Existing canonical documents should be updated rather than creating competing authorities.
- Round 1 preserves unique evidence without premature reconciliation.
- Round 2 reconciles duplicates and conflicts.
- Completion requires implementation → merge to `main` → verification.
- Status must not be upgraded without evidence.
- Before updating shared files, fetch the latest content and blob SHA.
- Never stale-write over another agent's newer contribution.

The conversation also identified the danger of documentation explosion: many proposed AI/identity/context documents may overlap existing authorities. Search and reconcile first.

---

## 10. AI Brain / Account / Context architecture recovered

The conversation identified three related first-class architectural concerns:

### AI Brain

Conceptual flow:

User → Account/Identity → Workspace/Project → Conversation → Context → Memory → Knowledge → Tools/Connectors → Agents → Workflows → Actions → Evidence → Artifacts → Ledger.

The conceptual distinctions preserved are:

- AI Brain = intelligence/orchestration layer.
- Brain Runtime = execution environment.
- Memory = persistent knowledge.
- Context = information relevant to the current task.
- Knowledge = structured/retrieved domain information.
- Agents = specialized workers.
- Tools = external capabilities.
- Evidence = proof supporting decisions/actions.
- Artifacts = durable outputs.
- Ledger = history/provenance.

### Account / Identity

Account/Login was identified as a first-class foundation covering:

- identity;
- authentication;
- sessions;
- profile;
- workspace ownership;
- connections;
- Google/YouTube authorization;
- permissions;
- Brain boundaries;
- Vault ownership;
- Projects ownership;
- analytics evidence boundaries;
- recovery/security.

Existing account recovery resources must be reconciled before creating a competing identity master.

### Context

Context was identified as the bridge between Account/Identity and Brain.

Conceptual chain:

User → Workspace → Project → ContentBuild → Asset → Conversation → AI task.

The Brain must know which context it is operating inside before it acts.

These are architecture proposals/recovered knowledge unless directly verified by current implementation.

---

## 11. GitHub recovery coordination

The conversation preserved the GitHub-account interruption/recovery situation and the need for a multi-conversation coordination mechanism.

The intended coordination workflow:

### Round 1
Each conversation independently:

1. reads the shared recovery state;
2. inventories its documents and document-equivalent responses;
3. identifies important discoveries, plans, audits, decisions, bugs, and implementation details;
4. updates shared durable artifacts;
5. records provenance and status.

### Round 2
After each conversation has contributed:

1. re-submit the shared recovery document/state;
2. compare conversation contributions;
3. reconcile duplicate/conflicting information;
4. establish authoritative versions;
5. verify implementation against `main`;
6. explicitly supersede stale material.

The user wanted this mechanism to preserve work despite GitHub account/repository disruption and make separate ChatGPT conversations able to contribute to shared ViewTube recovery.

---

## 12. Public Resource Library verification

A public ViewTube resource URL was inspected:

https://view-tube-ashy.vercel.app/resources?resource=analytics-scope-windows-statistical-traps

Verified page findings:

- Page title: `viewtube`.
- Visible resource title: **READING ANALYTICS CORRECTLY: SCOPE, WINDOWS, MISSINGNESS AND STATISTICAL TRAPS**.
- Format/status: ANALYTICS · MARKDOWN · PUBLISHED.
- Level/duration: Intermediate · 24–32 minutes.
- Sections: 13.
- It is a creator-facing analytics guide, not the general ViewTube documentation/master content itself.

The resource explains:

- define scope before comparing numbers;
- choose equivalent time windows;
- treat missing data explicitly;
- distinguish correlation from causation;
- inspect segments and uncertainty;
- avoid over-reading noisy metrics such as CTR, views, and averages.

The surrounding library reportedly describes canonical Markdown and Toolbox/SubToolbox rendering, but the selected resource itself is not the general documentation/master body.

This is important because a prior assumption in the conversation was that this public Resource Library page might itself contain the missing master documentation. The direct inspection does **not** support that conclusion. It is evidence of a published analytics resource and of the Resource Library/rendering model, not evidence that it is the creator-workspace master document.

---

## 13. Recovery-specific discoveries and findings

### DISC-20261004-CW-001 — Creator Workspace tool-context hierarchy
- **Category:** Documentation / UX
- **Affected area:** Creator Workspaces / Tool documentation
- **Discovery:** The canonical tool context format is Description → Inputs → Workflow → Outputs → Connections.
- **Source:** Current conversation and repository master/tool-context artifacts.
- **Status:** VERIFIED in repository documentation.
- **Impact:** Gives all workspace tool help a consistent compact information architecture.
- **Recommended improvement:** Apply the hierarchy consistently to future tool/resource documentation.

### DISC-20261004-CW-002 — Screenshot inventory exceeds older registry count
- **Category:** Data / documentation reconciliation
- **Affected area:** Dashboard widget registry
- **Discovery:** User-provided screenshot inventory contains 66 widgets while an older registry reported 65.
- **Status:** REPORTED / recovered; current discrepancy requires Round 2 reconciliation.
- **Impact:** Silent normalization to 65 would lose a user-confirmed widget.
- **Recommended improvement:** Compare the 66-widget documentation against current `WidgetRenderer`/registry implementation and explicitly resolve the extra widget.

### DISC-20261004-CW-003 — Resource URL is not the missing master document
- **Category:** Resource Library / documentation
- **Affected area:** Public Resource Library
- **Discovery:** The inspected public URL is a published 13-section analytics guide, not general master documentation.
- **Evidence:** Direct public-web inspection completed 2026-10-04.
- **Status:** VERIFIED.
- **Impact:** Prevents treating creator-facing educational content as the canonical product documentation source.
- **Recommended improvement:** Keep Resource Library content and product documentation linked but distinguish their authority roles.

### DISC-20261004-CW-004 — Resource Library is itself an architectural surface
- **Category:** Product / architecture
- **Affected area:** Resource Library
- **Discovery:** The public resource page exposes canonical-Markdown/toolbox-rendering concepts around creator-facing resources.
- **Status:** VERIFIED for the inspected page's surrounding library metadata; broader implementation architecture requires source verification.
- **Recommended improvement:** Document the resource lifecycle from canonical source → renderer → published resource while preserving the distinction between educational resources and canonical product specs.

### DISC-20261004-CW-005 — Avoid document explosion
- **Category:** Governance / maintainability
- **Discovery:** Existing Brain, Account, Vault, Projects, Conversation OS, Creator Workspace, and Master Rebuild resources overlap with many proposed artifact families.
- **Status:** INFERRED from repository inspection.
- **Impact:** Blindly creating every proposed file would create competing sources of truth.
- **Recommended improvement:** Reconcile existing authorities first; create only missing canonical documents.

### DISC-20261004-CW-006 — Page-level tool boundaries
- **Category:** Product / architecture
- **Discovery:** Projects/Analytics/Vault/Editor/Resource Library boundaries should be preserved; internal capabilities should normally remain inside Inputs, Workflow, Outputs, or Connections unless explicitly promoted.
- **Status:** REPORTED / repository context exists.
- **Recommended improvement:** Preserve page-level boundaries during future tool inventory work.

### DISC-20261004-CW-007 — Round 1 vs Round 2 must remain explicit
- **Category:** Recovery workflow
- **Discovery:** Independent recovery and later reconciliation are separate lifecycle stages.
- **Status:** VERIFIED as recovery-policy requirement.
- **Recommended improvement:** Do not silently reconcile conflicts during initial recovery.

---

## 14. Code discoveries reviewed

The conversation's repository inspection established source locations and relationships but did not perform a new code change in this activation pass.

Important source relationships:

- Studio Hub UI is assembled in `src/views/StudioHub.tsx`.
- Studio tool-chain contracts live in `src/services/viewTubeToolChains.ts`.
- Dashboard-to-Studio routing is handled in `src/views/dashboard/useDashboardData.ts`.
- User-facing tool guidance is represented in `src/content/userGuideContent.ts`.
- Studio icons are mapped in `src/assets/studioHubIconData.ts`.
- Publishing Package has implementation in `StudioPublishingCockpit.tsx` and readiness summary support in `ProjectPublishingPackageSummary.tsx`.
- Script Architect timing/quality logic includes `scriptBudget.ts` and `scriptQuality.ts`.

No new runtime bug was independently reproduced during this recovery activation. Historical Toolbox/export-error and deployment failures remain preserved as recovery evidence and require current-main verification before being treated as current defects.

---

## 15. Engineering/product intelligence review

### Bugs / regressions
- Reviewed. No new bug was independently reproduced in this activation.
- Historical Toolbox/SubToolbox instability and export-error findings remain relevant recovery evidence but are not upgraded to current verified defects without fresh implementation evidence.

### Code structure
- Reviewed. The strongest observed concern is potential fragmentation between tool registries, UI modules, guide content, and documentation inventories.
- Recommended verification: compare `viewTubeToolChains.ts`, `StudioHub.tsx`, `useDashboardData.ts`, guide content, and the master documentation for drift.

### Tool improvements
- Standardize every tool's Learn More context using the canonical hierarchy.
- Make tool connections explicit and source-backed.

### New tools
- No new standalone tool is established by this recovery pass.
- Proposed Brain/Account/Context sub-artifact families are documentation/architecture candidates, not new product tools.

### Workflow
- Use repository-backed tool-chain definitions as the implementation reference for documentation.
- Use screenshots/user inventories as product evidence and reconcile discrepancies rather than silently normalizing them.

### Handoff/recovery
- Shared recovery state must be append-only for Round 1 and protected against stale writes.
- Every substantive response should become a durable artifact or canonical-document update.

### AI
- Continue separating Brain, context, memory, knowledge, tools, agents, workflows, evidence, and artifacts.
- Avoid creating overlapping AI documentation authorities before reconciliation.

### UX/product
- Keep Learn More content compact and actionable.
- Make tool-to-tool handoffs visible through Connections.

### Performance/scalability
- No new performance bottleneck was verified in this activation.

### Security/reliability
- Preserve repository identity and account/identity conflicts as explicit provenance rather than silently merging historical claims.
- Do not treat external or historical repository claims as current canonical implementation.

### Data/model
- Reconcile screenshot-visible inventories against code registries.
- Preserve explicit source authority for creator-facing resources versus product documentation.

### Testing/verification
- Add automated inventory drift checks where practical between Dashboard/Studio tool registries and documentation.
- Verify implementation completion only after merge to `main` and verification.

---

## 16. Existing artifacts intentionally not recreated

The following were reviewed but intentionally not duplicated because canonical or recovery artifacts already exist:

- `Recovery.md`
- `Recovery.yaml`
- `docs/recovery/AGENT_RECOVERY_PLAYBOOK.md`
- `docs/recovery/VIEWTUBE_CONVERSATION_AGENT_ACTIVATION_PROMPT.md`
- `docs/recovery/VIEWTUBE_CONVERSATION_RECOVERY_INDEX_2026-10-02.md`
- `docs/recovery/VIEWTUBE_CHATGPT_DOCUMENT_CATALOG_2026-10-04.md`
- `docs/recovery/handoffs/VIEWTUBE_DOCUMENT_ARTIFACT_INVENTORY_2026-10-04.md`
- `docs/product/VIEWTUBE_CREATOR_WORKSPACES_MASTER_TOOL_CONTEXT.md`

No competing Brain, Account, or Context master was created because existing repository resources require Round 2 reconciliation first.

---

## 17. Verification status

### Verified
- Recovery activation prompt read.
- Recovery.md read.
- Recovery.yaml read.
- Recovery playbook read.
- Recovery index read.
- ChatGPT document catalog read.
- Documentation/artifact inventory read.
- Creator Workspaces master exists on canonical main.
- Public Resource Library URL inspected successfully.
- Public URL is an analytics guide rather than general master documentation.
- Studio Hub source-file relationships were identified from repository evidence.

### Reported / recovered but not newly verified
- Historical GitHub account suspension/recovery claims.
- Historical external repository implementation claims.
- Historical Toolbox/SubToolbox regression and export-error claims.
- Prior implementation/deployment claims not freshly verified during this activation.

### Unknown / pending
- Exact current Dashboard 66-vs-65 implementation reconciliation.
- Full Round 2 reconciliation across all conversation artifacts.
- Current runtime state of every proposed Brain/Account/Context architecture component.
- Whether every historical handoff has a corresponding canonical current document.

---

## 18. Next actions

1. Run Round 2 reconciliation across Brain, Account/Identity, Context, Conversation OS, Creator Workspaces, Vault, Projects, Analytics, Dashboard, Studio Hub, and Master Rebuild resources.
2. Compare the 66-widget screenshot inventory with current Dashboard registries/renderers and explicitly resolve the count discrepancy.
3. Compare Studio Hub documentation against `viewTubeToolChains.ts`, `StudioHub.tsx`, and user-guide content for drift.
4. Establish the authoritative Resource Library lifecycle and distinguish educational resources from product specifications.
5. Reconcile proposed Brain/Account/Context artifact families against existing canonical resources before creating additional files.
6. Preserve Toolbox/SubToolbox export-error and UI/CSS findings as historical evidence until current-main verification establishes their present state.
7. Add automated documentation/registry drift checks where feasible.

---

## 19. Provenance

**SOURCE → DISCOVERY → DECISION/RECOVERY → REPOSITORY ARTIFACT → VERIFICATION → ROUND 2 RECONCILIATION**

This file is a Round 1 recovery handoff. It must not be treated as the final authoritative architecture or implementation specification where a current verified implementation or canonical document conflicts with it.
