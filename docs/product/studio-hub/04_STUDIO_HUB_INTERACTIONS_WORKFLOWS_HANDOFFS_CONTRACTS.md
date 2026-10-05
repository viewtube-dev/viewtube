# ViewTube Studio Hub — Interactions, Workflows, Handoffs & Contracts

**Status:** ACTIVE — canonical interaction contract target
**Date:** 2026-10-05

## Interaction model
Context → Evidence → Specialized Transformation → Typed Result → Handoff → Execution/Measurement → Learning

Tools communicate through declared contracts. They do not scrape one another's UI, duplicate logic, or silently take ownership.

## Interaction rules
1. Every handoff has a reason.
2. Outputs retain source, version, evidence, confidence, uncertainty, and validation state.
3. Receiving a result does not transfer ownership.
4. Results may fan out to legitimate consumers.
5. Canonical objects are referenced rather than duplicated.
6. High-impact promotion is user-controlled where practical.
7. Validated knowledge is distinct from operational context.
8. Projects own execution.
9. Analytics owns measurement.
10. AI Brain owns durable validated knowledge.
11. Feedback loops cannot become circular ownership loops.
12. Creator Strategy Engine is the strategic synthesis boundary.

## Core contracts
### StudioIntelligenceEnvelope
~~~text
StudioIntelligenceEnvelope {
  id
  sourceTool
  sourceVersion
  creatorId
  projectId?
  timestamp
  inputReferences[]
  evidence[]
  observation?
  interpretation?
  hypothesis?
  outputType
  outputPayload
  confidence
  uncertainty
  recommendedActions[]
  brainCandidate?
  validationState
  relatedAssets[]
  relatedProjects[]
}
~~~

### StudioContext
~~~text
StudioContext {
  creator
  audience
  project
  content
  opportunity
  evidence
  goals
  constraints
  assets
  decisions
  experiments
  knowledgeRefs
  provenance
}
~~~

### ToolHandoff
~~~text
ToolHandoff {
  id
  sourceTool
  sourceVersion
  targetTool
  creatorId
  projectId?
  timestamp
  handoffType
  primaryObjectRef
  supportingReferences[]
  evidence[]
  assumptions[]
  confidence
  uncertainty
  validationState
  requestedAction
  userDecision?
  provenance[]
}
~~~

## Canonical object contracts
### Opportunity
~~~text
Opportunity {
  id
  title
  sourceSignals[]
  audience
  problemOrDemand
  evidence[]
  potentialValue
  strategicFit
  effort
  freshness
  expiration
  confidence
  recommendedAction
  relatedContent[]
  relatedProjects[]
  relatedAssets[]
}
~~~

### ContentConcept
~~~text
ContentConcept {
  id
  opportunityId?
  premise
  audience
  problemOrDesire
  promise
  format
  hook
  differentiation
  evidence[]
  expectedOutcome
  effort
  confidence
}
~~~

### StoryGraph
~~~text
StoryGraph {
  conceptId
  runtime
  hook
  beats[]
  escalation
  retentionHypotheses[]
  visualMapping[]
  audioMapping[]
  payoff
  cta
  productionBlueprint
}
~~~

### Evidence
~~~text
Evidence {
  id
  source
  timestamp
  observation
  metric?
  reference
  quality
  relevance
}
~~~

### KnowledgeCandidate
~~~text
KnowledgeCandidate {
  statement
  evidence[]
  validationState
  confidence
  scope
  creatorSpecificity
  expiration?
  provenance[]
}
~~~

## Canonical handoff types
- OpportunityContext
- ContentConcept
- StoryBlueprint
- AssetManifest
- ProductionAssets
- PublishedContent
- PerformanceResult
- ValidatedFinding
- ProjectReference
- AssetReference
- ToolHandoff
- AudienceOpportunity
- RevenueOpportunity
- ScenarioSet
- CausalFinding
- ExperimentResult
- NextBestMove

## User-facing interaction matrix
### Opportunity Radar
→ Content Architect: OpportunityContext
→ Audience Studio: audience signal references
→ Revenue Architect: revenue opportunity candidate
→ Creator Strategy Engine: qualified OpportunityContext
→ Post-Publication Analysis: opportunity analysis context

### Content Architect
→ Video Director: ContentProductionBrief
→ Asset Forge: ProductionRequirementRequest
→ Pre-Publication Analysis: PrePublicationReviewRequest
→ Video Publisher: PublicationConceptPackage
→ Creator Strategy Engine: ConceptDirective
→ Projects: ProjectBrief

### Video Director
→ Asset Forge: ProductionAssetRequest
→ Projects: ProductionProjectBrief
→ Editor: EditDirection
→ Video Publisher: ProductionReadyPackage
→ Pre-Publication Analysis: ProductionReviewContext

### Asset Forge
→ Video Director: ProductionAssetPackage
→ Video Publisher: PublicationAssetPackage
→ Projects: AssetManifest
→ Revenue Architect: RevenueAssetPackage

### Thumbnail Studio
→ Pre-Publication Analysis: PackagingReviewRequest
→ Post-Publication Analysis: PackagingPerformanceContext
→ Video Publisher: PublicationPackagingPackage
→ Experiment Lab: PackagingExperimentCandidate

### Video Manager
→ Opportunity Radar: PublishedContentContext
→ Post-Publication Analysis: MetadataOptimizationContext
→ Thumbnail Studio / Content Architect: MetadataHistoryContext

### Video Publisher
→ Pre-Publication Analysis: FinalPrePublicationReview
→ Video Manager: PublishedVideoRecord
→ Pre-Launch Priming: LaunchScheduleContext
→ Projects / Asset Forge / Thumbnail Studio: PublicationPackageContext

### Pre-Publication Analysis
→ Video Publisher: PublicationReadinessFinding
→ Tactics Engine: PrePublicationTactic
→ Content Architect / Video Director / Thumbnail Studio: RevisionRequest
→ Creator Strategy Engine: PrePublicationDecisionContext

### Post-Publication Analysis
→ Video Manager: PublishedMetadataFinding
→ Opportunity Radar: PostPublicationOpportunitySignal
→ Content Architect: ContentIterationFinding
→ Audience Studio: AudienceFinding
→ Thumbnail Studio: PackagingFinding
→ Tactics Engine / Experiment Lab: LearningCandidate

### Audience Studio
→ Content Architect: AudienceOpportunity
→ Opportunity Radar: AudienceSignal
→ Revenue Architect: AudienceValueContext
→ Projects: AudienceActionProject
→ Tactics Engine: AudienceTactic

### Tactics Engine
→ Projects: TacticProjectBrief
→ Creator Strategy Engine: TacticCandidate
→ Experiment Lab: TacticExperimentCandidate
→ Video Director: ProductionTactic
→ Video Publisher: PublishingTactic
→ Video Manager: MetadataTactic

### Revenue Architect
→ Projects: RevenueProjectBrief
→ Content Architect: RevenueContentRequirement
→ Asset Forge: MonetizationAssetRequest
→ Creator Strategy Engine: RevenueOpportunity

### Creator Strategy Engine
→ Projects: NextBestMove
→ Content Architect / Video Director / Revenue Architect: StrategicDirective
→ Experiment Lab: StrategicExperimentDirective
→ Causal Intelligence / Channel Flywheel: StrategicDiagnosticDirective

## Pre-existing tool interactions
- Video Manager → Opportunity Radar, Pre/Post Publication Analysis, Content Architect, Thumbnail Studio.
- Video Publisher → Publishing Package, Pre-Publication Analysis, Thumbnail Studio/Content Architect, Projects, Post-Publication Analysis, Pre-Launch Priming, Video Manager.
- Content Analysis → Pre/Post Publication Analysis, Tactics Engine, Content Architect, Opportunity Radar, Thumbnail Studio, Video Director.
- Video Director → Content Architect, Asset Forge, Projects, Editor, Tactics Engine.
- Script Architect → Content Architect, Video Director, Hook Generator, Projects.
- Thumbnail Studio → Post-Publication Analysis, Content Architect, End-Screen Architect, Video Publisher, Experiment Lab.
- Publishing Package → Video Publisher, Asset Forge/Video Director, Pre-Publication Analysis.
- Community Posts → Audience Studio, Post-Publication Analysis, Content Architect, Opportunity Radar.
- Comment Responder → Audience Studio, Content Architect, Opportunity Radar, Tactics Engine.
- End-Screen Architect → Thumbnail Studio, Post-Publication Analysis, Experiment Lab, Video Publisher.
- Pre-Launch Priming → Video Publisher, Opportunity Radar, Content Architect/Hook Generator, Projects, Post-Publication Analysis.
- Hook Generator → Content Architect/Script Architect, Thumbnail Studio, Experiment Lab, Video Director/Projects.
- Tactics Engine → Projects, Pre/Post Publication Analysis, Opportunity Radar, Audience Studio, Experiment Lab, Creator Strategy Engine, Video Director, Video Publisher, Video Manager.

## Main creator workflow
~~~text
Signals / Audience / Existing Content
              ↓
      Opportunity Radar
              ↓ Opportunity
       Content Architect
              ↓ ContentConcept
          Story Engine
              ↓ StoryGraph / Blueprint
          Asset Forge
              ↓ AssetManifest
           Projects
              ↓ execution
            Editor
              ↓
           Publish
        ↙      ↓      ↘
Audience    Content   Analytics
 Studio     Autopilot    ↓
                         Causal Intelligence
                              ↓
                         Experiment Lab
                              ↓
                           AI Brain
                              ↓
        Channel Simulator / Revenue Architect / Channel Flywheel
                              ↓
                    Creator Strategy Engine
                              ↓
                       Next Best Move
                              ↓
                           Projects
~~~

This is a graph, not a mandatory sequence for every creator.

## Workspace-system interactions
- Projects receives typed briefs/directives and owns execution state, tasks, milestones, assets, experiments, publishing context, and outcome measurements.
- Analytics supplies measurement and does not own cross-tool strategy.
- AI Brain receives validated knowledge candidates and supplies durable creator-specific knowledge.
- Asset Engine/Vault owns reusable assets; Studio Hub uses typed references rather than another asset store.
- Editor owns editing/assembly; Studio Hub supplies narrative, production, and asset context.
- Resource Library supplies governed reference material and templates.
- Account/Creator Context retains creator/account scope and permissions; identity is never inferred from free text.

## Fan-out and fan-in
One canonical result may feed several tools without duplicate records.

~~~text
Opportunity
 ├─ Content Architect
 ├─ Audience Studio
 ├─ Revenue Architect
 └─ Creator Strategy Engine
~~~

Creator Strategy Engine is the only unrestricted cross-tool fan-in decision boundary.

## Feedback loops
- Content: Video Genome → Content Architect → Story Engine → Projects/Editor → Publish → Analytics → Causal Intelligence/Experiment Lab → AI Brain → Content Architect.
- Audience: Publish → Audience Studio → relationship/content opportunities → Content Architect / Projects / Opportunity Radar.
- Monetization: Audience + Content + Assets + Channel Intelligence → Revenue Architect → Revenue Plan → Projects → Results → Analytics → Causal Intelligence / AI Brain → Revenue Architect.
- Growth: Analytics → Channel Flywheel → Bottleneck → Causal Intelligence → Experiment Lab → Measured Result → AI Brain → Creator Strategy Engine.

## Interaction UI
Every handoff should show, where practical: From, To, Object, Why, Evidence, Confidence, State, What happens next, and user action such as Accept, Review, Edit, Save, Defer, Cancel.

## Completion criteria
- every canonical tool has upstream inputs and downstream consumers;
- handoffs use typed objects;
- provenance survives;
- evidence and uncertainty survive;
- canonical objects are referenced rather than duplicated;
- Projects owns execution;
- Analytics owns measurement;
- AI Brain owns durable validated knowledge;
- Asset Engine/Vault owns reusable assets;
- Editor owns editing;
- Creator Strategy Engine owns cross-tool synthesis;
- user-facing handoffs are understandable;
- measured results can return to relevant tools.
