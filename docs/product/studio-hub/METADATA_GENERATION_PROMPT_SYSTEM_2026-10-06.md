# ViewTube Metadata Generation & Analysis Prompt System

## Goal

Define a controllable prompt architecture capable of generating and analyzing every supported metadata field as:

- a single input;
- a selected group;
- a full package;
- multiple candidates;
- multiple full packages;
- a mixed request.

## Prompt architecture

Do not maintain dozens of unrelated prompts.

Use layered prompt composition:

```
SYSTEM POLICY
  +
TASK CONTRACT
  +
CREATOR CONTEXT
  +
CONTENT CONTEXT
  +
CHANNEL CONTEXT
  +
ANALYTICS CONTEXT
  +
HISTORICAL EVIDENCE
  +
REQUEST SCOPE
  +
PURPOSE
  +
STYLE
  +
CONSTRAINTS
  +
OUTPUT SCHEMA
```

## Canonical context envelope

```ts
interface MetadataContextEnvelope {
  creatorProfile: unknown
  channelProfile: unknown
  niche: unknown
  audience: unknown
  project: unknown
  contentBuild: unknown
  sourceContent: unknown
  currentPackage: unknown
  historicalPackages: unknown
  historicalChanges: unknown
  analyticsEvidence: unknown
  goals: unknown
  constraints: unknown
}
```

## Request scope

```ts
type MetadataGenerationScope =
  | { kind: "single"; field: MetadataField; count: number }
  | { kind: "selected"; fields: MetadataField[]; count: number }
  | { kind: "package"; count: number }
  | { kind: "mixed"; requests: MetadataGenerationRequest[] }
```

## Purposes

Every generation request can select one or more objectives:

- search discoverability
- browse appeal
- suggested-video appeal
- CTR
- clarity
- curiosity
- authority
- education
- entertainment
- conversion
- subscriber growth
- topical relevance
- niche authority
- evergreen longevity
- launch momentum
- audience reactivation

## Styles

Support styles independently from purposes:

- direct
- concise
- conversational
- authoritative
- educational
- dramatic
- curiosity-driven
- understated
- energetic
- technical
- beginner-friendly
- premium
- playful
- documentary
- news-like
- story-driven
- contrarian
- minimalist
- brand-specific

Style must never override factual accuracy or platform constraints.

## Input modes

Every field supports:

### Manual
Creator writes the value.

### Generate
Create new candidates from context.

### Refine
Improve the current value while preserving its intent unless the user requests otherwise.

### Alternatives
Create alternatives without changing the current value.

### Analyze
Evaluate the current value.

### Compare
Compare current value against candidates.

### History
Show historical versions and performance associations.

## Candidate generation prompt contract

The model receives:

1. canonical context;
2. current value, if any;
3. purpose;
4. style;
5. constraints;
6. requested count;
7. diversity setting;
8. evidence rules.

It returns structured candidates with:

- value;
- strategy label;
- purpose;
- style;
- confidence;
- predicted strengths;
- predicted risks;
- evidence references where applicable.

## Full-package generation

A package request should generate coherent combinations, not independently generated fields pasted together.

The model must reason about:

- title ↔ thumbnail promise;
- title ↔ description;
- description ↔ actual content;
- tags ↔ topic;
- chapters ↔ content structure;
- package ↔ audience;
- package ↔ channel niche.

## Ranking

Ranking should accept:

- single candidates;
- candidate groups;
- complete packages.

Return:

- overall rank;
- objective scores;
- audience fit;
- channel fit;
- content fit;
- coherence;
- risk;
- novelty;
- evidence strength;
- explanation.

## Diversity controls

Support:

**Similar → Balanced → Diverse → Experimental**

Avoid producing ten superficial variations.

## Historical strategy prompt

When history is available, ask:

- What patterns have worked for this channel?
- What patterns repeatedly underperformed?
- Which conclusions have sufficient evidence?
- Which patterns are only hypotheses?
- Which historical examples are most comparable to this content?

Never instruct the model to blindly copy a historical winner.

## Prompt versioning

Every generation/refinement operation records:

- prompt template ID;
- prompt version;
- model/provider;
- context version;
- settings;
- output schema version;
- operation ID.

This makes generated results reproducible and auditable.

## Safety / truth constraints

The prompt system must prioritize:

1. factual accuracy;
2. creator intent;
3. content truthfulness;
4. platform constraints;
5. requested purpose;
6. requested style.

The model must not manufacture claims simply to improve CTR.

## Prompt library

Recommended recipe examples:

- “Generate 10 high-clarity titles under 60 characters.”
- “Generate 5 high-curiosity but non-clickbait titles.”
- “Generate 5 complete balanced publication packages.”
- “Refine this description for clarity while preserving factual claims.”
- “Generate three SEO-oriented packages and three browse-oriented packages.”
- “Rank these titles for this channel's audience.”
- “Find the strongest package using historical evidence, but explore one novel strategy.”
- “Analyze why this metadata changed performance.”
- “Generate a package optimized for returning subscribers.”
- “Generate a package for new viewers unfamiliar with the channel.”

## User customization

Expose:

- purpose;
- style;
- count;
- diversity;
- context depth;
- historical evidence;
- channel analytics;
- required terms;
- forbidden terms;
- character limits;
- audience;
- tone;
- risk tolerance;
- experimental intensity.

Advanced users can edit the recipe, but normal users should not need to write prompts.
