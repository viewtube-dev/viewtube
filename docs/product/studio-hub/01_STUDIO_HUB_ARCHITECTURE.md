# ViewTube Studio Hub — Architecture, Implementation & Governance

**Status:** ACTIVE — canonical split architecture target
**Date:** 2026-10-05
**Source:** docs/product/VIEWTUBE_STUDIO_HUB_MASTER_TOOL_ARCHITECTURE.md
**Migration rule:** The source master remains preserved until this five-document system is verified.

## Purpose
Studio Hub is ViewTube's intelligence-and-action layer: specialized creator tools that move the creator from one measurable state to another. These are outcome engines, not generic utilities or chatbot panels.

The architecture has two separate questions:
1. Capability architecture: which intelligence transformations ViewTube needs.
2. User-facing Toolbox architecture: which existing or new tools should own those transformations.

The 13-engine capability model must not automatically become 13 new user-facing Toolboxes.

## Canonical principles
- Every tool owns one primary measurable transformation.
- Every tool has a decisive reason to exist and an explicit boundary.
- If removing a tool does not remove unique capability, merge it, make it a capability/variant/subtoolbox, or reject it.
- Evidence and provenance travel with meaningful outputs.
- Predictions expose confidence, uncertainty, assumptions, and time horizon.
- Only appropriately validated findings become durable AI Brain knowledge.
- Projects own execution state.
- Analytics owns measurement.
- Asset Engine/Vault owns reusable production assets.
- Editor owns editing and assembly.
- Resource Library owns governed reference resources.
- Creator Strategy Engine is the only Studio Hub tool authorized to synthesize cross-tool recommendations into a prioritized next best move.
- Closed-loop learning is Plan → Create → Publish → Measure → Explain → Learn → Improve → Plan.

## Capability architecture
| # | Capability | Transformation |
|---|---|---|
| 01 | Opportunity Radar | Signals → Opportunities |
| 02 | Content Architect | Opportunities → Content Concepts |
| 03 | Video Genome | Content → Structured Content Patterns |
| 04 | Story Engine | Concepts → Executable Narratives |
| 05 | Asset Forge | Production Blueprints → Production-Ready Asset Packages |
| 06 | Audience Pulse | Audience Behavior → Relationship Opportunities |
| 07 | Content Autopilot | Published Content → Derivative/Follow-up Opportunities |
| 08 | Experiment Lab | Hypotheses → Measurable Learning |
| 09 | Causal Intelligence | Observed Results → Probable Explanations |
| 10 | Channel Simulator | Current Channel State → Future Scenarios |
| 11 | Revenue Architect | Creator/Audience/Asset Intelligence → Monetization Opportunities |
| 12 | Channel Flywheel | Channel System → Growth Bottleneck |
| 13 | Creator Strategy Engine | Validated Intelligence → Next Best Move |

## User-facing ownership — Round 1
1. Opportunity Radar
2. Content Architect
3. Video Director
4. Asset Forge
5. Thumbnail Studio
6. Video Manager
7. Video Publisher
8. Pre-Publication Analysis
9. Post-Publication Analysis
10. Audience Studio
11. Tactics Engine
12. Revenue Architect
13. Creator Strategy Engine

This is PROPOSED / ROUND 1, not final production implementation.

## Workspace architecture
- Projects: execution layer.
- Analytics: measurement layer; Sync Controller, Intelligence Hub, Master Data Tables, Data Visuals.
- AI Brain: durable validated creator knowledge.
- Asset Engine/Vault: reusable production asset layer.
- Editor: production/editing layer.
- Resource Library: governed reference layer.
- Account/Creator Context: identity, permissions, and creator scope.

The system uses canonical references rather than disconnected copies.

## Ownership rules
| Question | Owner |
|---|---|
| What is becoming worth pursuing? | Opportunity Radar |
| What should we make? | Content Architect |
| What patterns already exist? | Video Genome |
| How should it unfold? | Story Engine |
| What production assets are required? | Asset Forge |
| Who needs attention? | Audience Pulse / Audience Studio |
| What more can existing content produce? | Content Autopilot |
| What should we test? | Experiment Lab |
| Why did this happen? | Causal Intelligence |
| What might happen next? | Channel Simulator |
| How can value become revenue? | Revenue Architect |
| Where is growth weakest? | Channel Flywheel |
| What should the creator do next? | Creator Strategy Engine |

## Implementation order
For each capability/tool: lock ownership → define contract → define backend transformation → map user-facing owner → reuse UI primitives → build SubToolboxes → implement controls → implement states → implement evidence → implement handoffs → validate success metric.

Capability build order:
1. Opportunity Radar
2. Content Architect
3. Video Genome
4. Story Engine
5. Asset Forge
6. Audience Pulse
7. Content Autopilot
8. Experiment Lab
9. Causal Intelligence
10. Channel Simulator
11. Revenue Architect
12. Channel Flywheel
13. Creator Strategy Engine

## Validation gate
A Studio Hub capability/tool is not complete because its UI exists. Completion requires unambiguous transformation, ownership boundary, data model, inspectable evidence, explicit uncertainty where applicable, AI Brain relationship, Projects relationship, Asset Engine relationship, working handoffs, ViewTube component-system usage, measurable success metric, and closed-loop learning.

Predictions are never promoted to validated knowledge merely because they were generated. Correlation is never labeled causation without adequate evidence.

## Migration strategy
1. Create this five-document folder.
2. Extract architecture/governance here.
3. Extract user-facing and pre-existing ownership into 02_STUDIO_HUB_TOOLS.md.
4. Extract intelligence, AI generation, prompts, and Brain integration into 03_STUDIO_HUB_INTELLIGENCE_AI_BRAIN_PROMPTS.md.
5. Extract interactions, workflows, handoffs, and contracts into 04_STUDIO_HUB_INTERACTIONS_WORKFLOWS_HANDOFFS_CONTRACTS.md.
6. Extract UI/toolbox architecture into 05_STUDIO_HUB_UI_ARCHITECTURE.md.
7. Cross-link all five.
8. Verify source coverage and ownership consistency.
9. Only after verification decide whether the old master becomes a compatibility/index document or remains historical.

No destructive deletion occurs during this migration.

## Governance
Every future Studio Hub proposal must prove unique primary transformation, unique reason to exist, non-overlap with existing ownership, standard tool specification coverage, correct UI architecture, typed interaction/handoff contract, AI Brain/evidence behavior, and measurable success criteria.

Conflicting historical evidence remains preserved until Round 2 reconciliation.

## Source lineage
The original master merged:
- docs/product/VIEWTUBE_STUDIO_HUB_TEN_TOOL_ARCHITECTURE.md
- docs/product/STUDIO_HUB_TOOL_IDEAS.md

It reconciled 20 source entries into 13 capability engines.

This five-document system is a structural decomposition of that master, not permission to discard source history.
