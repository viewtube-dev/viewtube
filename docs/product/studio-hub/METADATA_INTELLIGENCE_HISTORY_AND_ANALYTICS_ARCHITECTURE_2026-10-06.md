# Metadata Intelligence — History, Analytics & Learning Architecture

## Purpose

Create a durable evidence chain connecting:

**metadata input → publication/change event → time window → analytics → observation → analysis → learned knowledge**

This is a shared capability of existing ViewTube systems, not a new parallel datastore.

## Event model

Recommended event families:

- `METADATA_CREATED`
- `METADATA_REFINED`
- `METADATA_REPLACED`
- `METADATA_SELECTED`
- `PACKAGE_CREATED`
- `PACKAGE_VERSIONED`
- `PACKAGE_PUBLISHED`
- `PUBLISHED_METADATA_CHANGED`
- `THUMBNAIL_CHANGED`
- `TITLE_CHANGED`
- `DESCRIPTION_CHANGED`
- `TAGS_CHANGED`
- `PUBLISHING_SETTINGS_CHANGED`
- `ANALYSIS_COMPLETED`
- `OBSERVATION_RECORDED`
- `KNOWLEDGE_PROMOTED`

## Metadata change record

A change record should conceptually contain:

```ts
interface MetadataChangeRecord {
  id: string
  contentBuildId: string
  projectId?: string
  videoId?: string
  publishingPackageId?: string
  packageVersionId?: string
  field: MetadataField
  previousValue: unknown
  nextValue: unknown
  operation: "manual" | "generated" | "refined" | "selected" | "imported"
  actor: "creator" | "ai" | "system"
  occurredAt: string
  operationId?: string
  promptVersionId?: string
  reason?: string
}
```

## Package version

```ts
interface PublishingPackageVersion {
  id: string
  publishingPackageId: string
  version: number
  fields: Record<string, unknown>
  source: "manual" | "ai" | "mixed" | "imported"
  createdAt: string
  selectedAt?: string
  publishedAt?: string
  supersedes?: string
}
```

## Analytics association

Do not copy analytics into metadata records as a competing source.

Instead store references/projections:

```ts
interface OutcomeObservation {
  id: string
  changeEventId?: string
  packageVersionId?: string
  analyticsSource: string
  beforeWindow?: AnalyticsWindow
  afterWindow?: AnalyticsWindow
  metrics: Record<string, number>
  comparison: Record<string, number>
  observation: string
  confidence: "low" | "medium" | "high"
  causality: "unknown" | "suggestive" | "stronger-evidence"
}
```

## Analysis discipline

Content Analysis should produce four separate layers:

### 1. Observed
“CTR increased from 4.8% to 6.1%.”

### 2. Associated
“The increase occurred after the title changed.”

### 3. Hypothesized
“The title's increased specificity may have contributed.”

### 4. Concluded
“Across 18 comparable historical changes, this pattern is associated with improved CTR.”

The system should also report confounders such as:

- traffic-source changes;
- seasonality;
- impressions changes;
- major external events;
- thumbnail changes occurring simultaneously;
- audience changes;
- video age;
- publication lifecycle.

## Before/after windows

Support configurable windows:

- 24 hours
- 3 days
- 7 days
- 14 days
- 28 days
- custom

For mature videos, use matched historical controls where possible.

## Single-field analysis

Example:

```
TITLE CHANGE
Before: ...
After: ...

Observed:
CTR +18%
Views/day +11%

Historical:
13 similar title changes
9 positive
2 neutral
2 negative

AI conclusion:
Moderate evidence of a positive association.
```

## Package analysis

When multiple fields change together, label the event as a **package change** and avoid attributing the outcome to one field unless independent evidence exists.

## Learning promotion

Only promote observations to durable Brain knowledge when:

- evidence is sufficient;
- provenance is present;
- confidence is recorded;
- the claim is appropriately scoped;
- it does not conflict with newer evidence.

Knowledge should support future generation without becoming an unquestioned rule.

## Privacy and trust

Creators should be able to inspect:

- what historical data influenced a recommendation;
- what analytics periods were used;
- which changes were associated;
- which conclusions were inferred;
- which knowledge was promoted to Brain memory.

## Integration points

- Projects: content/project identity.
- ContentBuild: durable content lineage.
- Publishing Package: package/version state.
- Publisher: publication event.
- Manager: live change event.
- Analytics: canonical metrics.
- Content Analysis: interpretation.
- AI Brain: contextual reasoning and durable learned knowledge.
