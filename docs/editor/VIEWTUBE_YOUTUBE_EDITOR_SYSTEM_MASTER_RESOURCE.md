# ViewTube YouTube Editor System — Living Master Resource

**Status:** canonical living resource  
**Scope:** unified desktop + mobile video editor, editor UX, project portability, Remotion, AI generation, Editor Brain assistant, assets, templates, Studio Hub integration, widgets, analytics integration, skills, plans, references, branch donors, verification, and update history  
**Canonical owner / concern:** ViewTube Editor System integration authority  
**Date created:** 2026-09-24  
**Last audited main commit:** 56e2c0c03f83a168bf385dd2f71d32bc87166d08  
**Supersedes:** no specialized authority automatically; this document consolidates and indexes them. A specialized authority remains authoritative for its bounded concern until explicitly superseded here and in docs/DOCUMENTATION_REGISTRY.md.  
**Related authorities:** docs/domains/BRAIN.md; docs/architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md; docs/architecture/VIEWTUBE_ASSET_ENGINE_MASTER_RESOURCE.md; docs/architecture/VIEWTUBE_TOOLBOX_UI_MASTER_RESOURCE.md; docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md; docs/DOCUMENTATION_GOVERNANCE.md

## 1. Mission

ViewTube should expose one editor product across desktop and mobile:

> One project model. One durable ContentBuild identity. One capability vocabulary. One Asset/Vault lineage. One Remotion render contract. One BrainRuntime orchestration path. Different adaptive layouts, never different products.

Desktop and mobile must be able to open the same project without translation loss. A capability that exists on one editor surface should either exist on the other surface or be explicitly marked as a parity gap in this document with an owner, plan, and verification target.

This file is intentionally editable Markdown. It is the editor program's shared source of truth between conversations, coding agents, implementation branches, audits, and future planning passes.

## 2. Domain update contract and global conversation handoff

This document is the canonical Editor domain authority. Its append-only Update Log, Current Work table, registries and parity notes are **domain projections**: they record editor-specific decisions, architecture, implementation state and verification. They are not a second conversation handoff, complete user-instruction register, cross-domain worklog or task ledger.

For every material Editor change:

1. Read this authority and inspect current target-branch code before making claims.
2. Identify the current project/state/render/AI owner; do not create a parallel subsystem.
3. Update the Editor Current Work table when editor-specific work is planned, started, blocked, partial, completed with evidence or superseded.
4. Append one concise row to the Editor Update Log for a material Editor-system change. Preserve history.
5. Register newly created or materially used editor-specific plans, references, skills, standalone HTML, branch donors, scripts, tests, API contracts and external sources in the appropriate Editor section.
6. Record exact branch/PR/commit and verification evidence when available. Distinguish local implementation, commit, PR, merge, target presence, application integration and acceptance verification.
7. Mark conversation-derived or old-plan claims unverified until checked against current target.
8. If architecture changes, update this resource before or with implementation.
9. If desktop/mobile behavior changes, update parity notes and verify both surfaces.
10. If AI can mutate editor state, document tool, permission, side effects, reversibility, approval and undo behavior.

### Global conversation capture

Use the single global process in [Conversation Handoffs](../governance/CONVERSATION_HANDOFFS.md) whenever a handoff trigger applies or the user requests a handoff. The global package at `tasks/conversation-intake/<conversation-id>/` owns the complete conversation-level instruction register, all-domain worklog, resumable handoff and reconciliation review. Do not create an Editor-only conversation log or ask the Editor Update Log to carry unrelated work.

When the user provides an existing package link and says **“Update the unfinished work log.”**, update that package's `handoff.md`, `worklog.json` and `review.md` in place. Preserve its identity and history. The Editor Update Log receives only the relevant Editor-specific projection.

### Status vocabulary

- planned — accepted direction, no implementation begun
- started — implementation or audit is actively underway
- partial — meaningful work exists but acceptance criteria are not met
- blocked — work cannot progress until a named dependency is resolved
- completed — acceptance criteria are verified with evidence
- superseded — replaced by a newer implementation or authority

A conversation saying something is done is not sufficient evidence. Completed requires code/runtime/test or equivalent repository evidence.

## 3. Current system architecture

### 3.1 Shared creator identity

The creator-facing unit is Project. ContentBuild remains the durable engineering identity underneath. The project, Video Package, editor state, generated assets, Vault collection, Publishing Package, and published outcome should remain manifestations of the same content identity rather than disconnected copies.

Primary authorities:
- docs/architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md
- docs/architecture/VIEWTUBE_ASSET_ENGINE_MASTER_RESOURCE.md

### 3.2 Editor state

The desktop and mobile editors must converge on the same canonical project/state contracts. Current mobile implementation visibly uses EditorStore under src/features/editor/mobile/state and current editor code already includes a bridge history for desktop/mobile state.

Rules:
- do not create a mobile-only project schema;
- do not add desktop-only effect or transition identifiers that mobile cannot deserialize;
- do not fork asset identity by device;
- maintain round-trip desktop → mobile → desktop fixtures;
- keep capability IDs stable even when layout differs.

### 3.3 Rendering

Remotion owns deterministic time, frames, composition registration, media composition, and final output. Current repository authority in src/remotion-editor is Remotion 4.0.465. The repository must not casually mix Remotion package versions.

Generative models create source media; Remotion creates deterministic composition, typography, overlays, captions, transitions, effects, data visuals, timing, and final render output.

### 3.4 AI

BrainRuntime remains the creator-facing reasoning and orchestration owner:
- src/services/brain/runtime/BrainRuntime.ts
- src/services/brain/runtime/BrainModelGateway.ts
- docs/domains/BRAIN.md

Editor UI must not call a model provider directly. The editor asks BrainRuntime for a capability; BrainRuntime gathers bounded context/evidence and returns explanations, proposals, or semantic tool actions.

### 3.5 Generative media

Video Director owns asynchronous generative-media job orchestration. Google Veo or any future provider should be added through the existing provider/job abstraction, not as an editor-specific provider stack.

Generated outputs must enter Asset Engine / Vault with provenance before they become durable timeline content.

## 4. Desktop + mobile parity contract

The feature set is shared; presentation adapts.

| Shared capability | Desktop expression | Mobile expression |
| --- | --- | --- |
| Project + media | rail/library + inspector | page/sheet + visual browser |
| Design Library | persistent browser + filters | full-height visual library |
| Preview | central dominant canvas | highest-priority ratio-correct region |
| Clip/text/asset inspect | contextual inspector | contextual page/sheet |
| Timeline | large compound timeline | compact compound timeline |
| FX | catalog + inspector | same catalog in touch cards |
| Transitions | seam + inspector | same seam contract + touch editor |
| Captions/transcript | panel/workspace | page/sheet |
| AI Brain | contextual sidecar | dedicated page/sheet or sidecar where space permits |
| Generate | queue + browser | same queue + generation page |
| Export | export workspace | export page/sheet |
| Help | contextual explainers | contextual explainers + guided navigation |

Parity is about capabilities and project semantics, not identical pixel placement.

## 5. Editor Brain Hub Assistant plan

The editor needs a first-class assistant that can both teach and act.

### 5.1 User modes

**Guide mode — read-only**
- explain any control, panel, timeline behavior, shortcut, or editor concept;
- answer "where is..." and navigate the user to the relevant surface;
- start guided walkthroughs;
- explain error, empty, loading, disabled, and capability-unavailable states;
- use current capability registry and this resource so it never invents a feature.

**Assist mode — proposal-first**
- analyze the selected clip, range, scene, transcript, or full project;
- propose trims, splits, pacing changes, audio adjustments, caption changes, overlays, B-roll placements, transitions, and layout changes;
- return typed patches that can be previewed individually or together;
- require Accept / Revise / Reject before mutation unless the action is explicitly configured as safe and reversible.

**Create mode — generative assets**
- generate video, images, captions, subtitles, transcripts, title cards, thumbnails, overlays, visual assets, voice or sound assets where an approved provider exists;
- send media-generation work through Video Director;
- persist results through Asset Engine/Vault;
- insert results as candidate assets before making them final.

**Operate mode — semantic tool execution**
- open panels, focus selected objects, prepare exports, create caption tracks, organize assets, apply accepted editor patches, and launch supported workflows;
- mutating actions declare side effects, approval requirement, reversibility, and undo behavior.

### 5.2 Context scopes

The assistant should understand four nested scopes:
1. Selection — active clip, text element, transition, effect, caption, asset, or control.
2. Range / scene — selected timeline range and adjacent context.
3. Project — full editor project, transcript, asset set, settings, output targets.
4. ContentBuild / channel — durable project intent, package state, relevant analytics evidence, channel profile, and publishing context when permissions allow.

Context must be bounded and just-in-time. Do not dump raw analytics or entire conversation histories into every turn.

### 5.3 Target flow

Editor UI  
→ Editor Assistant Controller  
→ BrainRuntime  
→ semantic editor tools / typed edit proposals / media-generation requests  
→ user preview + approval  
→ EditorStore or Video Director  
→ Asset Engine / Vault when assets are created  
→ undoable editor state  
→ Remotion preview/final render

### 5.4 Initial semantic tools

- explain_editor_feature
- find_editor_feature
- open_editor_panel
- start_guided_walkthrough
- inspect_selection
- suggest_edit
- propose_timeline_patch
- generate_captions
- translate_captions
- search_project_assets
- generate_video_asset
- generate_image_asset
- insert_asset_candidate
- prepare_editor_package
- prepare_export

The tool catalog should be semantic and task-oriented rather than a large set of tiny getters and setters.

### 5.5 Mutation safety

Every AI mutation must:
- produce a typed patch or semantic action record;
- identify target project and selection;
- show intended effect before commit;
- be individually accept/rejectable where practical;
- enter normal editor undo/redo history;
- preserve project schema validity;
- never silently delete source media;
- never bypass user permission, provider cost disclosure, or external-write approval.

### 5.6 Help and onboarding behavior

The assistant should be able to:
- highlight the relevant panel/control;
- explain why a control is disabled;
- adapt instructions for desktop, mobile portrait, mobile landscape, keyboard, or touch;
- offer a "show me" walkthrough rather than only text;
- link to the exact internal guide/reference;
- explain keyboard shortcuts and touch alternatives;
- use contextual examples from the user's current project without changing it.

### 5.7 Assistant evaluation matrix

A release-ready assistant should pass tests for:
- correct feature explanations;
- no hallucinated unavailable features;
- correct page/panel navigation;
- desktop/mobile instruction parity;
- correct selected-item scope;
- safe typed edit proposals;
- accept/reject/undo fidelity;
- caption generation;
- media-generation handoff;
- provenance preservation;
- provider failure and cancellation;
- cost/usage display;
- accessibility-aware guidance;
- missing-data honesty;
- no direct provider calls from editor UI.

A detailed implementation plan lives at docs/editor/EDITOR_BRAIN_HUB_ASSISTANT_PLAN.md.

## 6. Generative Media: Veo + image generation

Current public-source research as of 2026-09-24 indicates:
- Veo 3.1 production model IDs include veo-3.1-generate-001 and veo-3.1-fast-generate-001.
- Veo 3.1 supports text-to-video, image-to-video, first/last-frame guidance, reference images, extension, supported aspect ratios, and synchronized audio on supported endpoints/configurations.
- Veo is a video model; still-image creation belongs to Google's image-generation family.
- Gemini 3.1 Flash Image is the current recommended general image-generation/editing route in the Gemini family; older Imagen 4 Gemini API endpoints were deprecated/shut down in August 2026.

Authoritative external sources:
- https://ai.google.dev/gemini-api/docs/veo
- https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/3-1-generate
- https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos-from-first-and-last-frames
- https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-references
- https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/extend-videos
- https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-image
- https://ai.google.dev/gemini-api/docs/image-generation
- https://ai.google.dev/gemini-api/docs/deprecations

Provider capabilities must be discovered and validated at runtime; model IDs and limits are time-sensitive.

### 6.1 Canonical media-generation request

A generation request should carry:
- contentBuildId and editorProjectId;
- purpose;
- prompt and optional negative guidance;
- target aspect ratio, duration, resolution and variant count;
- reference asset IDs;
- optional first/last frames;
- optional source timeline range;
- provider policy and provider/model selection;
- audio-generation preference where supported;
- seed or deterministic hint where supported;
- creator/user identity and permission context.

### 6.2 Provenance

Store:
- provider/model/version;
- prompt and prompt-template version;
- reference assets;
- source clip/range;
- seed/settings where available;
- requested and actual cost/credits;
- timestamps and job IDs;
- safety/moderation/error state;
- output asset IDs;
- selected/used/rejected variant;
- later outcome links when measurable.

## 7. Remotion integration contract

Repository state verified on main at 96a3cb13fcdfd36720aebd845e0ac5f7a5ab12c1:
- src/remotion-editor/package-lock.json pins Remotion packages at 4.0.465.
- src/remotion-editor/src/assets/QA.md explicitly treats 4.0.465 as repository authority.
- src/remotion-editor contains asset registry, composition, engine, cloud/player, transitions, captions/media, and render-related architecture.
- src/editor-design-library/integration/remotionAssetAdapter.ts already bridges design-library assets.

Rules:
1. Keep all @remotion packages version-aligned.
2. Upgrade only through a controlled migration with preview/final-render fixtures.
3. Use Player/preview for interactive editor playback and a server-authoritative final render path.
4. Keep frame-based deterministic animation.
5. Generated media becomes source material; exact text/graphics/captions/timing remain Remotion-controlled.
6. Add preview-vs-final frame parity fixtures before broadening AI-generated timelines.
7. Treat current official Remotion documentation and official Agent Skills as upstream authority when available.

Official sources:
- https://www.remotion.dev/
- https://www.remotion.dev/docs
- https://www.remotion.dev/docs/ai/skills
- https://github.com/remotion-dev/skills

## 8. FLOWSTACK + UI system rule

Editor UI work should use the repository's existing primitives, Toolbox/Subtoolbox system, and current FLOWSTACK/UI-review skills when they are available in the active agent environment.

Do not invent FLOWSTACK component APIs from memory. Exact package/version-specific implementation is blocked until the repository dependency or package authority for the requested component is inspected. If FLOWSTACK is only available as an agent skill and not a repository dependency, use it for design/review guidance without claiming a runtime dependency exists.

Primary UI authorities:
- docs/architecture/VIEWTUBE_TOOLBOX_UI_MASTER_RESOURCE.md
- docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md
- relevant component-library source and tests
- this document's desktop/mobile parity contract

## 9. Skill and workflow registry

### 9.1 Editor lead skill

**viewtube-youtube-editor-system**  
Installed in:
- .claude/skills/viewtube-youtube-editor-system/SKILL.md
- .codex/skills/viewtube-youtube-editor-system/SKILL.md
- skills/viewtube-youtube-editor-system/SKILL.md

This skill is the lead routing and governance skill for all editor-specific work and requires agents to update this document.

### 9.2 Existing repo skills to reuse

| Skill | Role in editor work |
| --- | --- |
| viewtube-ai-system-governor | BrainRuntime, evidence, tools, generation, evals, anti-duplication |
| viewtube-prince-brain | Brain architecture/reasoning specialist |
| viewtube-skill-finder | choose smallest skill set before creating more |
| viewtube-solution-finder | search existing solution/prior art |
| viewtube-docs-grill | interrogate docs and stale assumptions |
| viewtube-verification-chancellor | verification/evidence discipline |
| viewtube-toolbox-builder | Studio Toolbox component work |
| viewtube-mobile-widget-system | touch/mobile widget composition |
| viewtube-widget-dashboard | Dashboard widget integration |
| viewtube-widget-dashboard-system | dashboard system-level widget integration |
| youtube-api-expert | only when editor work actually needs YouTube API capabilities |

### 9.3 Existing locked external skills relevant to this program

These exist in skills-lock.json but the external skill supply chain is explicitly unreviewed. Use only after reviewing the instruction content for the current task.

- ai-video-generation
- remotion-render
- captions
- subtitles
- transcript
- video-transcript
- YouTube Thumbnail Generation
- youtube-clipper
- youtube-seo
- youtube-tools
- ui-ux-pro-max
- ckm:design-system
- web-design-guidelines
- clean-code
- improve-codebase-architecture
- tdd
- prototype
- handoff
- review

### 9.4 High-value agent skills available in the current ChatGPT environment

These are environment capabilities, not repository runtime dependencies. A future agent host may not have all of them.

- Official Remotion skill family: best practices, markup, multimedia, interactivity, render, Studio, captions, SaaS, docs, upgrade.
- FLOWSTACK UI: builder, review, compose.
- UI Audit.
- Agent Skills: spec-driven development, planning/task breakdown, frontend UI engineering, source-driven development, TDD, incremental implementation, code simplification, accessibility/security/performance/observability workflows.
- Matt Skills Curated: skill-conductor, writing-for-agents, code review, research and specification workflows.
- Deep Research for current external capability/product research and source-backed benchmark passes.
- Visualize / data-visualization workflows for editor architecture diagrams, flow maps, capability matrices, and visual QA artifacts when useful.
- Plan and document workflows.

If a host lacks one of these, the repository skill and the official source documentation are the fallback. Do not block the project on a host-specific plugin.

### 9.5 Skill-installation policy

- Prefer an existing skill over a near-duplicate.
- Repo-local editor behavior belongs in viewtube-youtube-editor-system.
- Official upstream Remotion skills are preferred over third-party Remotion instructions.
- Do not silently expand skills-lock.json with unreviewed third-party instruction packages.
- Any external skill adopted into the repo must be source-reviewed, hash-pinned, dated, and logged here and in agent/registry/candidates.md or capabilities.md.

## 10. Fifty-item editor improvement program

| # | Improvement | Priority |
| --- | --- | --- |
| 1 | One canonical desktop/mobile capability contract | P0 |
| 2 | Generate capability registry from real shared modules/tests | P0 |
| 3 | One typed shared FX catalog | P0 |
| 4 | One shared transition catalog | P0 |
| 5 | Desktop → mobile → desktop project round-trip tests | P0 |
| 6 | Preview-vs-final-render frame fixtures | P0 |
| 7 | Make mobile Timeline one compound module | P0 |
| 8 | Give Preview first claim on remaining mobile space | P0 |
| 9 | Lock timeline track-row geometry | P0 |
| 10 | Explicit hidden-track recovery | P0 |
| 11 | Unify Templates/Custom/Graphics/Backgrounds/Patterns as Design Library | P1 |
| 12 | True visual thumbnails for every Design Library item | P1 |
| 13 | Favorites, Recents, Saved, Project Assets and Collections | P1 |
| 14 | Same page IDs/names/icons/order on desktop and mobile | P1 |
| 15 | Universal command palette / Add launcher | P1 |
| 16 | One selection-driven inspector | P1 |
| 17 | Progressive disclosure for advanced controls | P1 |
| 18 | Compact, Comfortable and Touch density modes | P1 |
| 19 | Approximately 44×44 primary touch targets | P0 |
| 20 | Non-drag alternatives for drag-only operations | P0 |
| 21 | Transcript-based editing synchronized to timeline | P1 |
| 22 | Natural-language visual + transcript media search | P1 |
| 23 | Beat, bar and phrase markers | P1 |
| 24 | AI silence/filler/retake detection with review queue | P1 |
| 25 | Highlight extraction and candidate Shorts | P1 |
| 26 | Semantic Auto Reframe for output ratios | P1 |
| 27 | Object/person mask + tracking abstraction | P2 |
| 28 | One-click dialogue cleanup | P1 |
| 29 | Speech-aware music ducking and loudness presets | P1 |
| 30 | Translation + multilingual captions and subtitle export | P2 |
| 31 | Selection-aware AI Brain sidecar on both editors | P0 |
| 32 | AI edits as previewable typed patches | P0 |
| 33 | Explain This contextual help on complex controls | P1 |
| 34 | Reusable AI edit recipes | P1 |
| 35 | Veo 3.1 text-to-video in Generate | P0 |
| 36 | Veo image-to-video from image/frame | P0 |
| 37 | First-frame + last-frame video generation | P1 |
| 38 | Reference-subject video generation | P1 |
| 39 | Insert generated video as candidate clips first | P0 |
| 40 | Gemini 3.1 Flash Image generation/editing | P0 |
| 41 | Persist prompt/model/reference/seed provenance | P0 |
| 42 | Show expected generation cost/credits before submission | P0 |
| 43 | Shared queue/progress/cancel/retry/variant UI across surfaces | P0 |
| 44 | Compact Generate / Video Director dashboard widget | P1 |
| 45 | Send selected timeline range directly to Video Director | P1 |
| 46 | Resolve generated media into Asset Engine/Vault before timeline commitment | P0 |
| 47 | Analytics may influence recommendations only through evidence-backed Brain tasks | P1 |
| 48 | Interactive onboarding, demo project and task-specific walkthroughs | P1 |
| 49 | Use official Remotion skill suite; audit/retire redundant overlap | P0 |
| 50 | Maintain this living Editor System status + branch recovery + parity ledger | P0 |

## 11. Resource and reference registry

### 11.1 Canonical / current authorities

- docs/editor/VIEWTUBE_YOUTUBE_EDITOR_SYSTEM_MASTER_RESOURCE.md — this editor integration authority and live ledger.
- docs/editor/EDITOR_BRAIN_HUB_ASSISTANT_PLAN.md — assistant implementation plan.
- docs/editor/EDITOR_PHASE_A_PARITY_FOUNDATIONS_AUDIT_2026-09-24.md — live Phase A source audit, parity-gap inventory, shared transition contract, and acceptance gates.
- src/shared/vtE1TransitionCatalog.js — canonical VT_E1 transition IDs, aliases, presentation mapping, and render-worker accepted vocabulary.
- src/shared/vtE1TransitionFrame.js — pure preview/final transition frame contract with deterministic fixtures.
- src/shared/vtE1FxCatalog.js — canonical VT_E1 FX keys, defaults, ordering, clamping, bypass/disable policy, keyframe vocabulary, and shared CSS filter math.
- docs/architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md — project/content identity.
- docs/architecture/VIEWTUBE_ASSET_ENGINE_MASTER_RESOURCE.md — assets, generation lineage, Vault integration.
- docs/domains/BRAIN.md — BrainRuntime authority.
- docs/architecture/VIEWTUBE_TOOLBOX_UI_MASTER_RESOURCE.md — Toolbox UI.
- docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md — component/primitives UI authority.
- docs/DOCUMENTATION_GOVERNANCE.md — documentation lifecycle rules.
- docs/DOCUMENTATION_REGISTRY.md — global documentation registry.
- agent/registry/references.md — agent-facing reference index.
- agent/registry/capabilities.md — agent capability/skill inventory.
- agent/contracts/herald-out.md — cross-agent response/evidence/update discipline.

### 11.2 Editor reference/plan material

- docs/EDITOR_DESKTOP_PROJECT_BRIDGE_HOOK_HANDOFF.md
- docs/editor/EDITOR_RECOVERY_PHASES_1_3_2026-09-18.md
- docs/editor/EDITOR_SVG_TEMPLATE_ASSET_CONSOLIDATION_PLAN_2026-09-18.md
- docs/editor/MOBILE_EDITOR_PRIMITIVES_AND_TOUCH_CONTROLS_2026-09-19.md
- docs/editor/MOBILE_EDITOR_WORKSPACE_REPAIR_2026-09-18.md
- docs/editor/component-style-default.md
- src/remotion-editor/src/engine/FEATURES.md
- src/remotion-editor/src/assets/README.md
- src/remotion-editor/src/assets/QA.md

These references must be reconciled against current code before they are promoted to current authority.

### 11.3 Important source areas

- src/features/editor/
- src/features/editor/mobile/
- src/editor-design-library/
- src/remotion-editor/
- src/services/brain/runtime/
- src/components/brain/
- src/features/video-director/
- server/video-director-*
- API routes used by Video Director generation jobs
- Asset Engine / Vault / ContentBuild services and adapters

### 11.4 Known standalone HTML / prototype references

These are reference/prototype artifacts, not runtime authority:
- public/editor-template-library.html
- public/widget-primitives.html
- src/assets/reference/viewtube-full-component-library.html
- src/assets/reference/viewtube-mini-toolbox-bundle.html
- docs/migration/reference/prototypes/ADAPTIVE_BRAIN_ORCHESTRATOR_2026-09-03.html
- docs/migration/reference/prototypes/VIEWTUBE_BRAIN_USER_CONTROL_CENTER_2026-09-03.html
- docs/demos/ViewTube_Crown_Control_Room.html

The global inventory remains in docs/DOCUMENTATION_REGISTRY.md and agent/registry/references.md. Every newly used or created editor-related standalone artifact must also be added here.

## 12. Branch donor / recovery audit log

Verified branch existence on 2026-09-24 through GitHub branch search. Existence does not mean safe-to-merge.

| Branch | Known relevance | Current disposition |
| --- | --- | --- |
| plan/mobile-editor-consolidation-2026-09-22 | mobile/desktop convergence and layout consolidation plan | donor plan; harvest current ideas, do not treat as runtime |
| feat/editor-template-library-main-aligned-v2 | template/design-library donor work | inspect behavior-level deltas; no wholesale merge |
| feat/editor-svg-template-library | older template/SVG donor | inspect only missing behavior; no wholesale merge |
| feature/video-director-foundation-2026-09-19 | Video Director foundation | current main already contains major infrastructure; compare unique commits before any harvest |
| feature/editor-system-living-authority-2026-09-24 | this living-resource/skill work | active branch until PR disposition |

For any branch audit, record:
- branch;
- base/head SHA;
- ahead/behind counts;
- unique commits via git cherry or equivalent;
- files/capabilities with unique value;
- stale/conflicting owners;
- disposition: merge / cherry-pick / manually harvest / archive / delete candidate;
- verification after harvest.

## 13. Current Work

| Work item | Status | Owner / surface | Verification target | Next action |
| --- | --- | --- | --- | --- |
| Living editor authority + shared update log | present | docs/editor + agent guidance | authority file present on audited main | keep this file current after editor work |
| Editor-specific agent skill | present | skills/.claude/.codex | discoverable editor-system skill references | maintain parity across agent surfaces |
| Cross-agent editor update requirement | present | AGENTS / CLAUDE / Conversation OS / Gemini / Copilot / Cursor | agent pointers route to living authority | keep pointers synchronized |
| Desktop ↔ mobile shared project bridge | present | VT_E1 + editorProjectBridge + mobile host | bridge hook tests + round-trip fixtures | continue parity fixtures; do not describe adapter as pending |
| Template element inspector / direct selection / measured preview requirements | needs re-verification | current Editor + template/design library | current-main capability audit + desktop/mobile visual evidence | requirements promoted from 2026-09-18 SVG/template donor plan; implement only missing gaps |
| Mobile/desktop capability parity | partial | editor state + UI | rich round-trip fixture + capability matrix | rich round-trip fixture is verified; next expand evidence-backed capability matrix and visual-frame parity |
| Shared FX/transition catalogs | partial | editor core | same IDs and rendering on both surfaces | transition + FX contracts merged through PR #408; desktop FX surface still requires explicit wiring/verification |
| Preview ↔ final Remotion parity | started | editor + remotion | frame fixtures pass | transition + FX filter/keyframe math now share contracts; expand to transforms/crop/assets/audio |
| Editor Brain Hub assistant | planned | BrainRuntime + editor | eval matrix in section 5.7 | implement plan phases |
| Veo/Gemini generative media adapter | planned | Video Director + Asset Engine | provider contract/job tests | verify provider API + add adapter |
| Unified generation queue/widget | planned | editor + Dashboard + Studio Hub | same job state across surfaces | reuse Video Director job model |
| Official Remotion skill adoption | partial | agent tooling | source-reviewed/pinned or environment-provided | complete supply-chain audit before vendoring |
| External skills-lock audit | planned | agent tooling | all editor-relevant external instructions reviewed | inspect hashes/sources and classify retain/replace |
| Editor donor-branch audit | planned | GitHub | unique-commit matrix for each donor | run branch-level audit |
| Creator production workbench — crop controls first slice | started | shared VT_E1 editor / mobile inspector | crop state, preview/render parity, undo/redo, desktop/mobile parity | add quick reversible crop presets to the existing clip inspector; continue image, video, script, audio/captions surfaces without a parallel project model |

## 14. Phased implementation plan

### Phase A — truth and parity foundations

1. Establish this living authority and skill.
2. Audit capability IDs from actual code/tests.
3. Build one desktop/mobile capability matrix.
4. Extract shared FX and transition catalogs.
5. Add desktop → mobile → desktop round-trip fixtures.
6. Add Preview → final Remotion frame fixtures.

Exit gate: project state survives surface changes; shared catalog IDs are proven; render parity has fixtures.

### Phase B — editor UX consolidation

1. Compound mobile Timeline.
2. Preview-first responsive sizing.
3. Hidden-track recovery.
4. Unified Design Library.
5. Same navigation vocabulary and page IDs.
6. Selection-driven inspector.
7. Touch/keyboard alternatives and accessible target sizing.

Exit gate: feature parity with adaptive layouts, no device-specific project logic.

### Phase C — Editor Brain guide + proposal assistant

1. Add editor-specific context adapter to BrainRuntime.
2. Add Guide mode and feature/navigation knowledge.
3. Add typed edit-proposal schema.
4. Integrate preview/accept/reject/undo.
5. Add help/walkthrough anchors to UI capability IDs.
6. Add assistant evals.

Exit gate: assistant cannot hallucinate unavailable controls and cannot silently mutate editor state.

### Phase D — Generative Media

1. Verify current Google API/model limits from official docs.
2. Add Google provider adapter to existing Video Director provider registry.
3. Support text-to-video and image-to-video first.
4. Add first/last-frame, reference, extension and audio options only where current provider contract supports them.
5. Add Gemini image generation/editing.
6. Persist every output in Asset Engine/Vault with provenance.
7. Add candidate insertion into editor.
8. Share queue/progress/cancel/retry UI with widget/Studio surfaces.

Exit gate: no direct editor→provider call; every durable output has provenance and ContentBuild identity.

### Phase E — analytics, learning and advanced workflows

1. Add transcript semantic editing/search.
2. Add AI cleanup/highlight/Shorts recipes.
3. Permit analytics-informed recommendations through Brain evidence only.
4. Link accepted AI actions/generation choices to later outcomes where measurable.
5. Feed results into governed Evaluation/Learning, never direct unreviewed profile mutation.

Exit gate: evidence → recommendation/generation → creator decision → artifact/action → outcome → evaluation trace exists.

## 15. Verification and quality gates

For every relevant change:
- focused unit/contract tests;
- project round-trip fixtures;
- final render fixture where output changes;
- desktop 1440×1000 visual evidence for UI changes;
- mobile 390×844 plus relevant landscape capture for responsive changes;
- keyboard and touch path;
- undo/redo;
- empty/loading/error/disabled states;
- accessibility checks;
- provider error/cancel/retry tests for generation;
- provenance and identity assertions;
- no direct provider call from editor UI;
- no second project model;
- no new AI store or parallel Brain runtime.

## 16. Risks / ask-first boundaries

Ask before:
- changing canonical project schema or migration;
- changing ContentBuild identity semantics;
- changing Remotion package version;
- adding a third-party external skill to the repo without source review/hash pinning;
- changing OAuth scopes or external publishing permissions;
- introducing irreversible AI edits;
- adding a paid provider path without cost/usage disclosure;
- deleting old editor branches or reference artifacts;
- replacing a specialized canonical authority rather than indexing it here.

## 17. Update Log — append only

| Date / time | Agent / conversation | Branch / PR | Status | Work completed / begun / planned | Changed or created paths | Verification / evidence | New references / sources | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-09-24 | ChatGPT Phase A visual-frame parity pass | feat/editor-phase-a-visual-frame-parity-v2-2026-09-24 | started | Added canonical shared visual-frame contract for keyframe easing/evaluation, clip transform, crop and track ordering. Refactored mobile preview and final Remotion output to consume it; preserved track order through the desktop/mobile bridge; added focused deterministic fixtures. | src/shared/vtE1VisualFrame.*; mobilePreviewGeometry.ts; MobileProjectPreview.tsx; editorState.ts; editorDesktopProjectAdapter.ts + test; Composition.tsx; Phase A audit | branch is based exactly on main 2ce55f0... and currently ahead only; focused CI pending | Phase A parity audit + shared transition/FX contracts | open PR, run CI, repair branch-introduced failures, merge deliberately, then continue template/assets + audio parity and Phase B UI consolidation |
| 2026-09-24 | ChatGPT Phase A rich-parity pass | PR #410 / feat/editor-phase-a-rich-parity-fixtures-2026-09-24 | partial | Added and verified a rich desktop→mobile→desktop project fixture covering video/audio/overlay/caption tracks, layers, crop/transform/FX, keyframes, design-template clips, Remotion asset clips, audio metadata, captions, transitions, ContentBuild/legacy IDs, asset selections, generation provenance, and unknown desktop fields. Repaired editor-owned type debt in the render client, export ID narrowing, motion-keyframe narrowing, bridge fixtures, and desktop timeline adapter declarations. Fixed layer normalization so absent visibility stays absent instead of mutating to `true`. | editorProjectRichParity.test.ts; editorDesktopProjectAdapter.ts; renderJobContract.ts; ExportRenderPanel.tsx; PreviewPane.tsx; useDesktopProjectBridge.test.tsx; desktopTimelineAdapter.d.ts + test | runtime head `e2bea9e2...`: rich parity 4/4, editorDesktopBridgeRuntime 8/8, useDesktopProjectBridge 2/2, desktopTimelineAdapter 5/5; production-build/source-governance/local-smoke passed; static-quality has no remaining errors in changed editor files; remaining full/focused/static failures are existing unrelated repository debt | Phase A parity audit + canonical transition/FX contracts + PR #410 | merge PR #410 deliberately; next extract shared visual-frame parity for transform/crop/visibility/order and then asset/audio parity |
| 2026-09-24 | ChatGPT Phase A shared-FX pass | PR #408 / feat/editor-phase-a-shared-fx-2026-09-24 | partial | Continued after PR #405 merged (`052ff029...`). Added canonical FX catalog for blur/saturation/brightness/hue/contrast/sepia/grayscale/opacity; refactored mobile FX rack, mobile preview, Remotion final composition, mobile keyframe evaluation, and render-worker keyframe vocabulary to the shared contract; added per-surface capability truth so active mobile/preview/render FX do not masquerade as desktop parity. Fixed two branch-introduced FX typing/import errors after the first CI run. | src/shared/vtE1FxCatalog.*; EffectsLibrariesPanel.tsx; MobileProjectPreview.tsx; mobilePreviewGeometry.ts; Composition.tsx; vt-e1-render-server.mjs; editorCapabilities.ts + test | run 36036825165 on runtime head `684464996...`: production-build, source-governance, local-smoke passed; new FX catalog tests 5/5 and capability tests 3/3 passed; static/full/focused remained red only on pre-existing main debt, with no errors in the FX-changed files | canonical FX contract + Phase A parity audit + PR #408 | merge PR #408 deliberately; next add rich whole-project round-trip fixture and bounded editor typing debt fixes |
| 2026-09-24 | ChatGPT Phase A editor parity pass | feat/editor-phase-a-parity-foundations-2026-09-24 | started | Audited current capability/timeline/bridge/transition architecture; created canonical transition catalog; unified mobile transition UI, browser presentation mapping, final Remotion transition math, and worker accepted IDs; normalized desktop layers for mobile; expanded full-project bridge fingerprinting; added desktop→mobile→desktop and transition frame fixtures. | src/shared/vtE1TransitionCatalog.*; src/shared/vtE1TransitionFrame.*; editorDesktopProjectAdapter*; editorDesktopBridgeRuntime*; PanelBodies.tsx; EditorControlManifest.tsx; transitionPresentations.tsx; Composition.tsx; vt-e1-render-server.mjs; Phase A audit doc | source-level audit against main 4a273685...; targeted fixtures committed, CI pending | docs/editor/EDITOR_PHASE_A_PARITY_FOUNDATIONS_AUDIT_2026-09-24.md | open PR, run release gates, repair branch-introduced failures, then build shared FX catalog |
| 2026-09-24 | ChatGPT editor-system living authority pass | feature/editor-system-living-authority-2026-09-24 | started | Created canonical living editor resource; planned Brain Hub assistant; created editor skill and cross-agent update contract; indexed research, skills, branches and references | docs/editor/VIEWTUBE_YOUTUBE_EDITOR_SYSTEM_MASTER_RESOURCE.md and linked files | main baseline 96a3cb13fcdfd36720aebd845e0ac5f7a5ab12c1; GitHub source/branch searches; Deep Research source audit | official Remotion + Google Veo/Gemini docs; current repo authorities | open PR, review, then begin Phase A |
| 2026-09-24 | ChatGPT editor-system living authority pass | PR #400 / feature/editor-system-living-authority-2026-09-24 | partial | Opened PR #400; verified exact 50-item backlog and identical 196-line skill mirrors; added Gemini, Copilot and Cursor editor-authority pointers. Release gates are in progress. Vercel preview failed only because the project exceeded the free daily deployment quota, so no preview evidence is claimed. | GEMINI.md; .github/copilot-instructions.md; .cursor/rules/viewtube-youtube-editor-system.mdc; master resource status | GitHub compare: branch ahead 13 before final pointer commits and behind 0; PR mergeable; structural document/skill checks passed; runtime code unchanged | PR #400; Vercel quota comment; agent distribution targets from Herald contract | wait for release gates, refresh PR status, then merge if gates allow |
| 2026-09-24 | ChatGPT editor-system living authority pass | PR #400 / feature/editor-system-living-authority-2026-09-24 | partial | Release gates completed. Production build, source-governance, and local-smoke passed. Full-suite, focused-contracts, and static-quality remained red; the latest integrated PR-head baseline (`c075e3bb...`, parent of main merge `96a3cb13...`) showed the same gate pattern, so these are existing repository debts rather than failures introduced by this docs/agent-guidance-only branch. Vercel preview remained unavailable because the daily free deployment quota was exceeded. | master resource status; PR #400 evidence | Current branch changes are documentation/agent guidance/skills only; latest baseline and PR #400 both pass build/governance/smoke and fail the same three debt gates | GitHub Actions run 36031118522; baseline run 36011979615; PR #400; Vercel quota comment | merge PR #400 deliberately; begin Phase A capability/parity audit |
| 2026-09-24 | Docs consolidation Wave 6 | docs/consolidation-wave6-auth-editor-deploy-guide-2026-09-24 | current-state refresh | Re-audited editor authority against main 2efe0f56eb52c1029c71543291cf65e2b1a2245f; confirmed VT_E1 mounts useDesktopProjectBridge; promoted unique template-inspector/direct-selection/measured-preview donor requirements into Current Work; demoted completed recovery/donor docs | editor master + related editor docs | code search/fetch against audited main; no runtime changes in this wave | current bridge/runtime source; prior donor docs | continue Phase A/B parity and certify remaining template/preview gaps |

## 18. Handoff template for future agents

Before ending an editor-related turn, add an Update Log row containing:

- Agent / conversation identifier:
- Date:
- Branch / PR / commit:
- Status:
- Intent:
- Started:
- Completed:
- Blocked:
- Changed paths:
- Tests / runtime / screenshots:
- New docs / HTML / skills / branches / sources:
- Current risks:
- Next exact action:

If this document was not updated, the editor work is not fully handed off.


## 19. Editor page feature opportunity intake — 2026-09-27

**Canonical catalog:** \`docs/architecture/PRODUCT_ARCHITECTURE.md#editor-opportunities\`  
**Status:** OPPORTUNITY / FUTURE DEVELOPMENT INPUT.

1. **IDEA-EDIT-001 — AI Rough Cut:** propose an initial assembly from script/narration/media/scenes with creator approval.
2. **IDEA-EDIT-002 — Script-Synchronized Timeline:** bind timeline ranges to script/narration/scenes/evidence/source assets.
3. **IDEA-EDIT-003 — Smart B-Roll Manager:** identify coverage gaps and route to Vault or governed generation with provenance.
4. **IDEA-EDIT-004 — Scene Inspector:** one scene-level view for script, assets, prompts, camera, audio, captions, effects, sources and alternatives.
5. **IDEA-EDIT-005 — Timeline Intelligence:** detect pacing/dead-space/missing-media/static-section/audio-gap/duplicate-footage/placeholder issues.
6. **IDEA-EDIT-006 — Version Branching:** alternate cuts/versions sharing canonical project/assets rather than cloned project universes.
7. **IDEA-EDIT-007 — Visual Style System:** reusable project-level typography, color, motion, captions, transitions, overlays, grain and framing.
8. **IDEA-EDIT-008 — Remotion Component Browser:** governed reusable animated components/charts/maps/lower-thirds/timelines/backgrounds/diagrams.
9. **IDEA-EDIT-009 — AI Edit Assistant:** BrainRuntime edit proposals with preview/diff/approval before mutation.
10. **IDEA-EDIT-010 — Automated Quality Control:** pre-render validation for assets, clipping, blank frames, silence, caption overflow, safe crops, transitions, ratios and render config.

### Editor integration rule

All proposals preserve the existing project bridge, one editor project model, ContentBuild/asset identity, deterministic render parity, undo/redo and explicit AI approval boundaries. AI UI must not call providers directly. Generated/recommended artifacts enter canonical provenance/asset flows.

### Update Log addition — 2026-09-27

| Date / time | Agent / conversation | Branch / PR | Status | Work completed / begun / planned | Changed or created paths | Verification / evidence | New references / sources | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-10-14 | Creator production tools — caption timing nudges | PR #147 / feat/creator-workbench-caption-srt-export-20261014 | started | Added −0.5s/−0.1s/+0.1s/+0.5s batch timing nudges for caption-track clips, using one undoable reducer action. Shifts all caption tracks uniformly, clamps negative offsets once against the earliest cue, preserves duration/overlaps, and leaves other tracks untouched. | src/features/editor/mobile/state/captionTiming.ts; src/features/editor/mobile/state/captionTiming.test.ts; src/features/editor/mobile/state/editorState.ts; src/features/editor/mobile/state/editorState.captionImport.test.ts; src/features/editor/mobile/components/ClipSettingsPanel.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Tests authored and source inspected; Vitest/build and preview/render QA pending | existing caption track IDs + editor reducer history + explicit clip start/end times | run focused caption timing tests and undo/preview QA; then connect Script Architect sections only through explicit timing inputs |
| 2026-10-14 | Creator production tools — timed SRT caption export | PR pending / feat/creator-workbench-caption-srt-export-20261014 | started | Added deterministic SRT serialization and Export SRT Captions beside import. Exports only timed caption-track clips, preserves multiline text and timeline times, sorts cues, rounds to milliseconds, and skips invalid/empty cues. | src/features/editor/mobile/state/srtCaptionExport.ts; src/features/editor/mobile/state/srtCaptionExport.test.ts; src/features/editor/mobile/components/ClipSettingsPanel.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Focused Vitest cases authored and source inspected; tests/build and browser download flow remain unverified | existing caption-track clips + SRT import format + editor timeline start/end | run SRT export tests and browser download; then connect script sections only with explicit timing inputs |
| 2026-10-14 | Creator production tools — durable video-frame stills | integrated / master/consolidated-feature-integration | integrated | Added Save Frame to Vault beside the existing Capture Frame as Still timeline action. Uses source-time mapping, same-origin worker upload, and Asset Engine createVersionedAsset with clip/source/timeline metadata and optional ContentBuild/parent lineage. | src/features/editor/mobile/components/ClipSettingsPanel.tsx; src/features/editor/mobile/state/imageDerivativeStorage.ts; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source inspected; browser capture/upload, Vault discovery, tests/build, and persistent worker storage unverified | existing sourceFrameTime + captureVideoFrameAsFile + /api/vt-e1/render/assets + Asset Engine | verify worker persistence and lineage end-to-end; then connect Script Architect and captions with explicit timing |
| 2026-10-14 | Creator production tools — server-backed crop derivative | integrated / master/consolidated-feature-integration | integrated | Added same-origin render-worker asset upload for cropped PNGs and registered successful uploads through Asset Engine createVersionedAsset, including crop/media metadata and ContentBuild linkage when available. Failures distinguish worker upload from local Vault registration and expose a recoverable stored path. | src/features/editor/mobile/state/imageDerivativeStorage.ts; src/features/editor/mobile/state/imageDerivativeStorage.test.ts; src/features/editor/mobile/components/ClipSettingsPanel.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Helper tests authored and source inspected; Vitest/build, deployed worker persistence, and browser save flow remain unverified | existing /api/vt-e1/render/assets proxy + Asset Engine createVersionedAsset + render-worker persistent volume contract | verify upload, Vault discovery, ContentBuild version and lineage on configured persistent storage; then persist captured video frames through the same path |
| 2026-10-14 | Creator production tools — focal-point crop positioning | integrated / master/consolidated-feature-integration | integrated | Added focal-point-aware aspect crop math and selected-clip controls for left/center/right or top/center/bottom positioning based on which axis must be cropped for the project ratio. Uses existing source dimensions and updateClipTransform; no source mutation. | src/features/editor/mobile/state/cropPresets.ts; src/features/editor/mobile/state/cropPresets.test.ts; src/features/editor/mobile/components/EditorNavigationPages.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source and regression cases inspected; Vitest/build and preview/final-render visual parity remain unverified | existing media layer width/height, project aspect setting, shared crop transform | run focused crop tests and render parity QA; next connect exported derivatives to durable Asset Engine/Vault provenance |
| 2026-10-13 | Creator production tools — ratio-aware crop slice | PR pending / feat/creator-workbench-ratio-aware-crop | started | Added a pure aspect-ratio crop calculator and wired Project Ratio/Square presets into the selected image/video inspector using factual linked-layer dimensions. Presets disable when dimensions/media identity are unavailable; unsafe extreme crops return null. | src/features/editor/mobile/state/cropPresets.ts; src/features/editor/mobile/state/cropPresets.test.ts; src/features/editor/mobile/components/EditorNavigationPages.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source diff inspected; focused Vitest/build and responsive preview/render QA not run | media layer width/height from ClipSettingsPanel ingest; existing project portrait/landscape setting; crop transform contract | run crop helper tests and preview/final parity QA; next trace real durable image derivative/video processing path |
| 2026-10-13 | Creator production tools — split eligibility test slice | PR #105 / feat/creator-workbench-image-video-controls-sync | started | Extracted split-button eligibility into a pure helper and added Vitest cases for valid interior playheads, edge guard bands, missing clips, invalid ranges, and non-finite playheads; UI now uses the shared predicate. | src/features/editor/mobile/state/splitClipEligibility.ts; src/features/editor/mobile/state/splitClipEligibility.test.ts; src/features/editor/mobile/components/PanelBodies.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Tests authored and source inspected; Vitest/build not executable in this GitHub-only pass | existing splitClipAtPlayhead action + shared editor history | run the focused Vitest file and desktop/mobile UI tests; continue with source-backed media processing only after confirming durable output storage seam |
| 2026-10-14 | Creator production tools — SRT caption import | PR pending / feat/editor-srt-caption-import | started | Added SRT parsing and an editor toolbox import action. Caption clips preserve exact source cue times, support overlaps, and are appended with one undoable reducer action; a caption track is created only when needed. Parser and reducer tests added. | src/features/editor/mobile/state/srtCaptionImport.ts; src/features/editor/mobile/state/srtCaptionImport.test.ts; src/features/editor/mobile/state/editorState.ts; src/features/editor/mobile/state/editorState.captionImport.test.ts; src/features/editor/mobile/components/ClipSettingsPanel.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source and tests inspected; Vitest/build/rendering/undo visual QA pending | existing caption track kind, text layer renderer, and editor history | run focused parser/reducer tests; verify caption render/undo; next connect script sections to captions with explicit timing |
| 2026-10-14 | Creator production tools — audio waveform inspector | PR pending / feat/editor-audio-waveform-inspector | started | Added an on-demand waveform preview for selected audio clips. It decodes only on request, caps large inputs, reduces decoded channels into bounded peak bars, closes the temporary AudioContext, and reports errors without mutating the source. | src/features/editor/mobile/state/audioWaveform.ts; src/features/editor/mobile/state/audioWaveform.test.ts; src/features/editor/mobile/components/AudioWaveformInspector.tsx; src/features/editor/mobile/components/ClipSettingsPanel.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source and tests inspected; Vitest/build/browser decode/responsive QA pending | existing audio layer mediaUrl + browser Web Audio decode | run focused tests and browser QA; next connect caption/script handoff with explicit timing |
| 2026-10-14 | Script Architect Markdown export | PR pending / feat/script-architect-markdown-export | started | Added Markdown download alongside TXT export with topic metadata and unchanged script text. Includes formatter and filename tests. | src/features/script-architect/scriptMarkdownExport.ts; src/features/script-architect/scriptMarkdownExport.test.ts; src/features/script-architect/useScriptArchitect.ts; src/views/ScriptArchitect.tsx | Tests and browser download verification pending | existing Script Architect controller and script output | verify tests/download; next connect script sections to captions only with explicit timing |
| 2026-10-14 | Creator production tools — resized image export | PR pending / feat/editor-resize-image-exports | started | Added source-size and 720px/1080px/1920px-width options for cropped PNG export. Output height preserves crop aspect ratio and output widths are bounded; source image and crop state remain unchanged. | src/features/editor/mobile/state/imageCropExport.ts; src/features/editor/mobile/state/imageCropExport.test.ts; src/features/editor/mobile/components/ClipSettingsPanel.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source/tests inspected; Vitest, browser export, and image quality QA pending | existing crop rectangle + PNG canvas export | verify resized outputs; next connect local derivatives to durable Asset Engine/Vault provenance |
| 2026-10-14 | Creator production tools — cropped PNG export | PR pending / feat/editor-export-cropped-image-derivative | started | Added an image-clip inspector action that downloads a PNG from the current normalized crop rectangle; the original source and crop state remain unchanged. Added a pure pixel-rectangle helper and regression tests. Output is a local download, not yet a Vault/Asset Engine derivative. | src/features/editor/mobile/state/imageCropExport.ts; src/features/editor/mobile/state/imageCropExport.test.ts; src/features/editor/mobile/components/ClipSettingsPanel.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source/tests inspected; Vitest/build, browser download and cross-origin QA pending | existing clip crop transform + mediaUrl + image inspector | run focused tests and browser QA; next connect exported derivatives to Asset Engine provenance and storage |
| 2026-10-14 | Creator production tools — capture video frame as still | PR pending / feat/editor-capture-video-frame-as-still | started | Added selected-video frame capture that maps playhead time into the source window, creates a JPEG, and inserts it via existing image clip ingest without mutating the source video; added source-time mapping tests. | src/features/editor/mobile/state/videoFrameCapture.ts; src/features/editor/mobile/state/videoFrameCapture.test.ts; src/features/editor/mobile/components/ClipSettingsPanel.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source and test files inspected; Vitest/build, browser capture, undo/redo, and responsive visual QA pending | existing video layer mediaUrl, source-in/out metadata, addFileClip image ingest, and shared editor history | run focused tests and browser QA; next add poster/thumbnail asset handoff with provenance after confirming asset engine derivative contract |
| 2026-10-14 | Creator production tools — failed render retry | PR #136 / feat/editor-render-retry-failed-formats | started | Added a pure retry selector and a Retry failed control to the existing Export/Render panel. It retries only failed selected formats and preserves successful output links. The render server contract has no cancellation endpoint, so no fake cancel control is exposed. | src/features/editor/render/renderJobRetry.ts; src/features/editor/render/renderJobRetry.test.ts; src/features/editor/mobile/components/ExportRenderPanel.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source and tests inspected; Vitest/build and interactive render retry verification pending | existing Remotion render job client/status/download contract | run focused tests and UI QA; next add a safe video frame/poster workflow that preserves asset provenance |
| 2026-10-14 | Creator production tools — PR #120/#123 consolidation | PR pending / feat/creator-workbench-pr120-pr123-consolidation | started | Reconciled Script Architect TXT export and source-slip controls against the current canonical branch. Export helper/UI/tests were already present. The Trim panel had basic slip controls, but the selected-media ClipSettingsPanel did not; added its Source Window inspector using the existing slipClip reducer, standardized both surfaces on ±0.1-second precision plus one-second steps, and added bounded source-window eligibility tests. | src/features/script-architect/scriptExport.ts; src/features/script-architect/scriptExport.test.ts; src/features/script-architect/useScriptArchitect.ts; src/views/ScriptArchitect.tsx; src/features/editor/mobile/components/PanelBodies.tsx; src/features/editor/mobile/components/ClipSettingsPanel.tsx; src/features/editor/mobile/state/sourceSlipControls.ts; src/features/editor/mobile/state/sourceSlipControls.test.ts; src/shared/vtE1TimelineOperations.test.ts; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Existing canonical export and slip features re-read; new pure helper/test source-inspected; Vitest/build/UI runtime verification pending | canonical Script Architect state + shared slipClip reducer/history | run focused export/slip tests and build; close stale PRs after the consolidation PR is open; continue crop preview/render parity and focal-point positioning |
| 2026-10-13 | Creator production tools — third implementation slice | PR #103 / feat/creator-workbench-image-video-controls-sync | started | Wired the existing splitClipAtPlayhead reducer action to a dedicated Split Clip panel; shows playhead/clip range, disables splitting outside the clip interior, and uses existing editor history for undo. | src/features/editor/mobile/components/PanelBodies.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source diff inspected; focused tests, undo/redo, and responsive visual verification pending | existing splitTimelineClip operation + splitClipAtPlayhead reducer/history | run focused timeline/editor tests and visual QA; then trace real image derivatives and video processing jobs |
| 2026-10-13 | Creator production tools — second implementation slice | PR #103 / feat/creator-workbench-image-video-controls-sync | started | Added clockwise/counterclockwise 90-degree rotation presets and rotation-only reset to the selected-clip Transform inspector. Edits use updateClipTransform and preserve unrelated transform/crop fields. | src/features/editor/mobile/components/EditorNavigationPages.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source diff inspected; tests/build, undo/redo and preview/final-render parity remain unverified | shared ClipVisualTransform + VT_E1 visual-frame contract | verify rotation/crop round trips and responsive UI; trace real image derivative and video processing APIs before implementing file operations |
| 2026-10-13 | Creator production tools — first implementation slice | PR #102 / feat/creator-workbench-image-video-controls | started | Audited the existing VT_E1 crop path and added one-click centered 10%/20% crop presets plus crop-only reset in the existing clip inspector. Edits use the shared updateClipTransform action, preserve editor state/history, and do not modify source assets. | src/features/editor/mobile/components/EditorNavigationPages.tsx; docs/editor/VIEWTUBE_YOUTUBE_EDITOR_SYSTEM_MASTER_RESOURCE.md; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | GitHub diff confirms three changed files; tests/build, undo/redo, and desktop/mobile visual verification remain pending | existing shared crop transform in src/shared/vtE1VisualFrame.js; EditorStore crop contract | run focused editor tests/build, inspect desktop/mobile crop UI and undo/redo, then continue image/video workbench and Script Architect integration |
| 2026-10-14 | Creator production tools — video thumbnail candidate workflow | PR pending / feat/editor-video-poster-frame-candidate | started | Added Save as Thumbnail Candidate beside Save Frame to Vault. Both use the existing source-timestamp capture and render-worker storage path; the new mode registers through createVersionedAsset in the canonical thumbnail slot, records provenance/parent linkage, and does not auto-select or publish the candidate. | src/features/editor/mobile/components/ClipSettingsPanel.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source diff inspected; build/tests, storage integration, ContentBuild selection and browser capture remain unverified | existing videoFrameCapture + uploadImageDerivative + createVersionedAsset contracts | run focused UI/helper tests and validate durable thumbnail candidate resolution in ContentBuild/Publisher; continue Script Architect and caption handoff audit |
| 2026-10-14 | Creator production tools — focal crop controls for all presets | PR pending / feat/creator-workbench-focal-crop-controls-current | started | Generalized focal-point controls from project aspect ratio to the currently active 16:9, 1:1, 9:16, 4:5, or project-ratio crop preset. Directional controls use cropToAspectRatioAtFocalPoint and preserve source bounds. | src/features/editor/mobile/components/EditorNavigationPages.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source diff inspected; Vitest/build, undo/redo, preview/render parity and responsive visual QA pending | existing cropToAspectRatioAtFocalPoint helper and shared updateClipTransform contract | run crop helper tests and UI QA; next verify poster/frame extraction and durable asset lineage before adding file operations |
| 2026-10-14 | Creator production tools — source-aware trim slice | PR / fix/editor-trim-source-range-20261014 | started | Fixed trimClip so left-edge trims advance sourceInSec and right-edge trims reduce sourceOutSec proportionally to source/timeline duration; source-less overlays remain timeline-only. Added reducer tests for both edges and undo. | src/features/editor/mobile/state/editorState.ts; src/features/editor/mobile/state/editorState.trim.test.ts; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source/test reviewed via GitHub; Vitest/build, browser preview, Remotion render parity, and visual QA not executed | existing trimClip reducer + sourceTimeAtTimelineSec contract + reducer history | run trim reducer tests; validate preview and Remotion source frames; then continue Script Architect BrainRuntime boundary audit |
| 2026-10-14 | Creator production tools — audio render control slice | PR / feat/editor-audio-render-controls-20261014 | started | Added shared audio render settings resolution so clip-level volume/playbackRate edits override layer defaults and are honored by Remotion; Audio panel now reads legacy payload defaults and limits volume to the renderer's 0–1 range. Added contract tests for override/fallback/default/clamp behavior. | src/shared/vtE1AudioContract.ts; src/shared/vtE1AudioContract.test.ts; src/remotion-editor/src/Composition.tsx; src/features/editor/mobile/components/PanelBodies.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source/test inspected via GitHub; Vitest/build and rendered audio playback checks not executed | existing custom Remotion Audio primitive + layer payload defaults + EditorStore clip properties | run focused contract tests and rendered-audio checks; audit custom Audio source-offset semantics before adding fade-in/fade-out automation |
| 2026-10-14 | Creator production tools — video embedded-audio controls | PR pending / feat/creator-workbench-video-audio-controls-20261014 | started | Added video-layer volume and mute controls to Clip Settings. Volume defaults to 100%, matching OffthreadVideo render behavior; mute and volume update existing layer payload fields consumed by the renderer. Separate audio-clip controls are unchanged. | src/features/editor/mobile/components/ClipSettingsPanel.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source contract inspected; build/tests and browser preview/final-render verification pending | existing payload.volume/payload.muted + Remotion OffthreadVideo | run component/build checks and verify mute/volume in preview and final render; then continue Script Architect/caption handoff audit |
| 2026-10-14 | Creator production tools — audio fade controls slice | PR / feat/editor-audio-fades-20261014 | started | Added Audio panel Fade In/Fade Out controls and a shared deterministic audioVolumeAtFrame curve used by Remotion Composition; clip-level fades override legacy layer payload defaults and mute/overlapping fades are handled. Added frame-curve tests. | src/shared/vtE1AudioContract.ts; src/shared/vtE1AudioContract.test.ts; src/features/editor/mobile/state/audioClip.ts; src/features/editor/mobile/components/PanelBodies.tsx; src/remotion-editor/src/Composition.tsx; docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md | Source/tests inspected; Vitest/build and rendered audio playback not executed | shared audio render settings contract + Remotion Audio volume callback | run focused contract tests, then validate audio fade output in preview and final render before proceeding to Script Architect BrainRuntime integration |
| 2026-09-27 | ChatGPT page-feature opportunity integration | docs/page-feature-opportunity-registry-2026-09-27 | planned/cataloged | Added ten Editor feature opportunities and tied them to current editor/Brain/asset/render ownership; no runtime implementation claimed. | editor master + Product Architecture | documentation/code-owner reconciliation only | canonical 80-item page opportunity registry | promote selected \`IDEA-EDIT-*\` items through scoped plans/tasks before implementation |
