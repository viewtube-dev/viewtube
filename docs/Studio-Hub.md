# ViewTube Studio Hub

**Status:** PROPOSED / ARCHITECTURE DEFINITION  
**Scope:** Ten outcome-oriented intelligence tools

## Product goal
Studio Hub is a connected creator operating system, not ten disconnected dashboards.

The core loop is:

**Discover → Decide → Create → Produce → Communicate → Measure → Explain → Learn → Simulate → Monetize → Prioritize**

## Ten tools

| # | Tool | Primary transformation |
|---:|---|---|
| 1 | Opportunity Radar / Content Opportunity Engine | identify the highest-value next opportunity |
| 2 | Content Architect / Story Engine | turn an opportunity into a defensible creative plan |
| 3 | Story Engine / Story & Retention Architect | design the viewer journey |
| 4 | Asset Forge | turn production requirements into asset packages |
| 5 | Audience Pulse / Audience Signal Miner | turn audience behavior into structured signals |
| 6 | Experiment Lab | turn uncertainty into measurable learning |
| 7 | Causal Intelligence | explain probable causes of performance changes |
| 8 | Channel Simulator | compare future scenarios |
| 9 | Revenue Architect | identify monetization opportunities |
| 10 | Creator Strategy Engine / Command Brain | prioritize the next best action |

**Naming note:** existing repository sources use more than one naming set. This document preserves that relationship rather than silently declaring one naming set implemented.

## Shared intelligence contract
Studio Hub architecture defines a shared `StudioIntelligenceEnvelope` carrying source tool/version, creator/project references, evidence, observations, interpretations, hypotheses, outputs, confidence, uncertainty, recommended actions, validation state, assets and related projects.

## Validation states
`OBSERVATION → SIGNAL → HYPOTHESIS → PREDICTION → FINDING → VALIDATED`, with `REJECTED` and `EXPIRED` as terminal/invalid states where appropriate.

## Handoffs
Common actions include:

- Inspect
- Save
- Send to Brain
- Create Project
- Send to Asset Engine
- Send to Editor
- Run Experiment
- Simulate
- Use as Input
- View Evidence
- Compare
- Track Outcome

## UI rule
Studio Hub reuses the existing UI Reference Library. It must not create a second primitive/style/token/size system.

## Completion criteria
A tool needs a defined transformation, inputs, outputs, backend processing, evidence/provenance, Brain behavior, project handoff, relevant asset/editor interaction, success state, user-facing Toolbox/SubToolboxes, real controls and states, and measurable outcome.

## Current state
Architecture is defined/proposed. The repository does not by itself establish complete implementation of all ten tools.

**Primary sources:** Studio Hub Ten Tool Architecture; Studio Hub Tool Ideas.
