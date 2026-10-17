# Studio Hub individual implementation prompt pack

**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Purpose:** One self-contained execution prompt per canonical planned tool. These prompts require source investigation followed by implementation and verification, with an explicit build/combine/merge decision and reuse of existing capabilities.

## Operating model
- **Build:** create a distinct capability only when no existing owner performs the transformation.
- **Combine:** connect existing features into one end-to-end workflow under a clear owner.
- **Merge:** consolidate overlapping tools/capabilities and preserve compatibility for existing consumers.
- **Shared capability:** implement as a service/mode/report within an existing owner rather than a new destination.
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
1. Opportunity Radar — canonical opportunity inputs and lifecycle.
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
