# Studio Hub individual implementation prompt pack

**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Purpose:** One self-contained execution prompt per canonical planned tool. These prompts require source investigation followed by implementation and verification, with an explicit build/combine/merge decision and reuse of existing capabilities.

## Operating model
- **Build:** create a distinct capability only when no existing owner performs the transformation.
- **Combine:** connect existing features into one end-to-end workflow under a clear owner.
- **Merge:** consolidate overlapping tools/capabilities and preserve compatibility for existing consumers.
- **Shared capability:** implement as a service/mode/report within an existing owner rather than a new destination.
- Studio Hub tools are distinct product/tool surfaces. They may call, reuse, or expose features and functions supplied by dashboard widgets, but must not be merged with, absorbed into, or substituted for widgets. A widget remains independently usable and registered/rendered; share underlying services/contracts where appropriate.
- A planned tool is not automatically a separate page. UI work is not the focus of this prompt pack; first establish domain contracts, integration, persistence, handoffs, and tests.

## Individual prompts
| # | Tool | Starting disposition | Prompt |
|---:|---|---|---|
| 01 | Opportunity Radar | COMBINE | [01-opportunity-radar.md](01-opportunity-radar.md) |
| 02 | Content Architect | MERGE | [02-content-architect.md](02-content-architect.md) |
| 03 | Video Genome | BUILD | [03-video-genome.md](03-video-genome.md) |
| 04 | Story Engine | COMBINE | [04-story-engine.md](04-story-engine.md) |
| 05 | Asset Forge | BUILD | [05-asset-forge.md](05-asset-forge.md) |
| 06 | Audience Pulse | MERGE | [06-audience-pulse.md](06-audience-pulse.md) |
| 07 | Content Autopilot | ADD | [07-content-autopilot.md](07-content-autopilot.md) |
| 08 | Experiment Lab | UNIFY | [08-experiment-lab.md](08-experiment-lab.md) |
| 09 | Causal Intelligence | BUILD | [09-causal-intelligence.md](09-causal-intelligence.md) |
| 10 | Channel Simulator | IMPLEMENT | [10-channel-simulator.md](10-channel-simulator.md) |
| 11 | Revenue Architect | CONSOLIDATE | [11-revenue-architect.md](11-revenue-architect.md) |
| 12 | Channel Flywheel | MERGE | [12-channel-flywheel.md](12-channel-flywheel.md) |
| 13 | Creator Strategy Engine | BUILD | [13-creator-strategy-engine.md](13-creator-strategy-engine.md) |

## Shared system boundaries
- Brain owns governed evidence/learning/orchestration; tools should cite and consume its contracts, not fork its memory.
- Projects and ContentBuild own accepted creator work identity and lifecycle.
- Asset Engine/Vault own asset records and binary provenance.
- Analytics Canon owns metric meaning, snapshots, and windows.
- Publisher owns publication preparation; Manager owns already-published video management.
- `superToolRegistry` describes product/work surfaces; `viewTubeToolChains` describes payload capabilities and handoffs. Map them explicitly rather than replacing one with the other.
- External writes require the existing approval/operation contracts.
- Treat current disposition as a source-verified hypothesis to validate during each prompt, not permission to duplicate code.

## Execution order
1. Opportunity Radar + Tactics Engine handoff — canonical opportunity inputs/lifecycle, then a typed handoff into the separate Tactics Engine tool.
2. Content Architect — accepted opportunity → project/content concept.
3. Video Genome — evidence-backed pattern extraction.
4. Story Engine — concept → narrative/production blueprint.
5. Asset Forge — blueprint → existing asset matches/gaps.
6. Audience Pulse — feedback signals → approved relationship action.
7. Content Autopilot — published content → derivative proposals.
8. Experiment Lab — hypothesis → measured learning.
9. Causal Intelligence — guarded explanation strength.
10. Channel Flywheel — lifecycle bottleneck diagnosis.
11. Channel Simulator — transparent scenario capability.
12. Revenue Architect — monetization plan with explicit assumptions.
13. Creator Strategy Engine — governed cross-tool synthesis and next-best move.

Order is a dependency suggestion, not a claim that earlier steps are complete. Each prompt must report real blockers and status.
## Existing-tool consolidation map

These are starting ownership decisions to verify against live consumers before deleting or relocating anything.

| Existing tool/capability | Target relationship | Guardrail |
|---|---|---|
| Opportunity Radar Studio Hub tool + Opportunity Radar widget + Brain opportunity adapters | Keep the widget and Studio Hub tool distinct; reuse shared opportunity services/contracts. Connect the distinct Tactics Engine through a typed handoff. | One canonical opportunity pipeline; no duplicate scoring/store, and never merge the tool surface with the widget surface. |
| Script Architect + hook generation | Content Architect and Story Engine modes/capabilities | Architect owns concept; Story Engine owns narrative/beat blueprint. Keep Video Director as production execution owner. |
| Content Analysis + analytics outputs | Video Genome, pre-publication analysis, post-publication analysis | Reuse Analytics Canon and evidence contracts; do not equate patterns with causality. |
| Video Director | Remains production-direction owner; consumes Story Engine output | Do not replace it with another editor or production surface. |
| Asset Engine + Vault | Asset Forge orchestration capability | Asset Engine/Vault remain the canonical asset stores. |
| Audience Studio + Community Posts + Comment Responder | Audience Pulse capabilities | Preserve source post/comment identity and creator approval for writes. |
| Thumbnail Studio + End-Screen Architect | Thumbnail Studio remains packaging owner; end-screen becomes a capability unless evidence proves separate ownership | Do not create competing packaging stores. |
| Publishing Package + Video Publisher | Publishing Package remains a Publisher subworkflow | Video Publisher owns unpublished publication preparation; Video Manager owns already-published video metadata. |
| Pre-Launch Priming | Keep as a pre-publication activation workflow, integrated with Audience Pulse/Publisher | Do not merge it into generic strategy without proving workflow parity. |
| Tactics Engine | Remains a distinct action/intervention tool; receives validated opportunities from Opportunity Radar and hands approved plans to Experiment Lab and Projects | Group the Radar-to-Tactics workflow in planning and handoff mapping, but do not merge Tactics Engine with Opportunity Radar, widgets, or Creator Strategy Engine. |
| Content Autopilot + Shorts extraction/editor routes | Content Autopilot proposes derivatives; existing Shorts/editor path performs production | No parallel editor or autonomous publishing. |
| Revenue Opportunity Map + scenario planning | Revenue Architect shares Channel Simulator scenario logic | Do not maintain separate scenario engines. |
| Channel Flywheel + cross-tool strategic synthesis | Flywheel is a diagnostic capability; Creator Strategy Engine prioritizes actions | Brain remains the canonical evidence and learning owner. |

**Migration safety:** these relationships are not permission to delete an existing tool. Each execution prompt must search consumers, define compatibility/adapters, test the replacement path, and only then remove redundant implementation.
