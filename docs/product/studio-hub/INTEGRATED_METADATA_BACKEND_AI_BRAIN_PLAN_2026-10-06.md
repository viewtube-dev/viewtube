# Integrated Metadata Backend + AI Brain Plan

## Architectural rule

The backend must extend canonical owners instead of creating duplicate systems.

The repository already identifies Project/ContentBuild/VideoPackage/PublishingPackage as canonical architecture concerns and the AI canonical contract explicitly rejects parallel Brain memory, analytics, artifact, or context stores.

## Proposed deep modules

### Metadata Operation Module

One narrow interface for generation/refinement/analysis operations.

Responsibilities:

- validate request;
- assemble context;
- select prompt recipe;
- execute AI operation;
- validate structured output;
- record operation receipt;
- return candidates/results.

### Publication History Module

One narrow interface for:

- recording publication;
- recording metadata changes;
- versioning packages;
- retrieving lineage;
- associating analytics references.

### Metadata Analysis Module

One narrow interface for:

- score candidates;
- compare candidates;
- compare packages;
- create observations;
- estimate confidence;
- produce evidence-backed conclusions.

### Metadata Context Resolver

Reads canonical owners and produces a stable Context Envelope.

It must not own duplicate copies of:

- project identity;
- ContentBuild identity;
- analytics;
- Brain memory.

### Prompt Registry

Versioned recipes with:

- recipe ID;
- version;
- supported fields;
- purposes;
- styles;
- required context;
- output schema;
- model policy;
- validation policy.

## Backend request contract

```ts
interface MetadataOperationRequest {
  operationId: string
  contentBuildId: string
  projectId?: string
  videoId?: string
  scope: MetadataGenerationScope
  purpose?: string[]
  styles?: string[]
  constraints?: Record<string, unknown>
  currentValues?: Record<string, unknown>
  useAnalytics?: boolean
  useHistory?: boolean
  contextDepth?: "minimal" | "standard" | "deep" | "maximum"
  candidateCount?: number
  diversity?: number
  recipeId?: string
}
```

## Output contract

```ts
interface MetadataOperationResult {
  operationId: string
  status: "completed" | "partial" | "failed"
  candidates: MetadataCandidate[]
  packages: MetadataPackageCandidate[]
  evidence: EvidenceReference[]
  promptVersionId: string
  warnings: string[]
}
```

## Validation

AI output must be validated against schemas before it reaches UI or persistence.

Validate:

- field type;
- character limits;
- required fields;
- allowed enum values;
- package coherence;
- malformed output;
- unsafe/inaccurate claims where detectable.

## Idempotency

Generation and mutation operations must carry stable operation IDs.

A retry must not create duplicate publication-history events.

## AI Brain integration

Brain should receive:

### Context
Current project/content/package/user goals.

### Evidence
Historical changes and analytics observations.

### Learned knowledge
Only validated/promoted observations.

### Task
Generate/refine/analyze/rank.

### Constraints
User controls and system policies.

Brain should return structured reasoning outputs suitable for UI, not opaque prose-only blobs.

## Brain memory layers

1. **Ephemeral task context**
2. **Project context**
3. **ContentBuild context**
4. **Channel profile**
5. **Historical evidence**
6. **Validated learned knowledge**

Do not collapse these into one undifferentiated memory.

## Learning loop

```
Operation
 ↓
Result
 ↓
Publication / change
 ↓
Analytics
 ↓
Observation
 ↓
Validation
 ↓
Knowledge candidate
 ↓
Brain memory
 ↓
Future generation
```

## Customizability

Expose configuration at several levels:

### Creator level
Default style, channel niche, audience, brand voice.

### Project level
Current goals, topic, audience, campaign.

### Operation level
Purpose, style, count, diversity, context depth.

### Recipe level
Prompt strategy and output schema.

### System level
Safety, validation, evidence and platform constraints.

## Provider abstraction

Keep provider/model selection behind the operation module.

The UI should request an intent, not know how the provider works.

## Failure handling

If generation fails:

- preserve all current values;
- show the failure reason;
- allow retry;
- record failed operation where useful;
- never partially overwrite the current package without explicit user action.

## Backend tests

Must cover:

- single generation;
- batch generation;
- full package generation;
- refinement;
- history recording;
- duplicate retry;
- package versioning;
- analytics association;
- Brain context assembly;
- prompt version tracking;
- malformed model output;
- partial failure;
- stale package update;
- safe apply.
