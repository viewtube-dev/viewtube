# Video Publisher + Video Manager — Hybrid UI Redesign

## Design objective

Make the two workstations visually related because they operate on the same kinds of video metadata, while making their lifecycle purpose immediately obvious.

## Publisher identity

**Prepare & Publish**

Primary visual signals:

- project/content selection;
- video asset;
- thumbnail;
- editable metadata;
- publishing configuration;
- schedule;
- final review;
- Publish action.

## Manager identity

**Manage Live Video**

Primary visual signals:

- published status;
- live video;
- current live metadata;
- performance;
- change history;
- update/apply action.


## Canonical metadata section order and hierarchy

Publisher and Manager must use the same fixed metadata section sequence:

1. **Video Upload** — primary
2. **Title** — primary
3. **Thumbnail** — primary
4. **Visibility** — secondary/compact
5. **Audience** — secondary/compact
6. **Timestamps** — secondary/compact
7. **Description** — primary
8. **Location** — secondary/compact
9. **Playlists** — primary
10. **Community** — secondary/compact
11. **AI Use** — secondary/compact
12. **Tags** — primary
13. **Category** — primary

Primary sections receive the full ViewTube metadata-field treatment. Secondary sections are deliberately visually subordinate: compact inline controls, toggles, binary yes/no controls, pills, small selectors, or tiny expandable controls. Secondary status does not mean removable from the canonical sequence; their semantic positions remain fixed even when collapsed, optional, or empty.

No Publisher/Manager mode, Metadata Intelligence view, generation flow, responsive layout, or populated-state optimization may reorder these sections. Advanced AI actions are embedded in the relevant section and never create a second metadata sequence.

## Shared metadata field component

Every field uses the same primitive family:

```
FieldHeader
  FieldTitle
  StateBadge
  CharacterCount
  HistoryButton

FieldValue
  ManualEditor

FieldActions
  Edit
  Generate
  Refine
  Alternatives
  Analyze
  History
```

The action row should collapse intelligently at narrow widths without removing access.

## Publisher layout

1. Project / ContentBuild selector
2. Video
3. Thumbnail
4. Title
5. Description
6. Tags
7. Category
8. Playlists
9. Chapters
10. End screen / related video
11. Audience/restrictions
12. Visibility
13. Schedule
14. Metadata Intelligence
15. Final Review
16. Publish

The existing Publisher generation system remains available and is explicitly preserved.

## Manager layout

1. Published video selector
2. Live status
3. Video
4. Current title
5. Current description
6. Current tags
7. Thumbnail
8. Category/playlists
9. Chapters/end screen where editable
10. Performance snapshot
11. Metadata Intelligence
12. Change History
13. Review Changes
14. Apply Update

## Header toggle pattern

Reuse the established ViewTube pattern where a toolbox can expose alternate pages/views from the header.

Recommended Publisher toggle:

**WORKSPACE | INTELLIGENCE**

Recommended Manager toggle:

**LIVE EDITOR | INTELLIGENCE**

The normal workspace remains the default.

The intelligence view inherits the exact current context and does not become a separate navigation destination.

## Metadata Intelligence view

Recommended regions:

- Current Package
- Generate
- Refine
- Candidate Sets
- Compare
- Rank
- Strategy
- Historical Evidence
- Analytics Effects
- Package Builder
- Apply / Handoff

## Batch operations

Use a consistent selection primitive:

```
[ ] Title
[ ] Description
[ ] Tags
[ ] Thumbnail
[ ] Chapters
[ ] Other
```

Then:

**Generate Selected · Refine Selected · Analyze Selected**

Separate control:

**Generate Full Package**

And:

**Generate N Packages**

## Candidate presentation

Each candidate should visually show:

- candidate value;
- purpose;
- style;
- score;
- strengths;
- risks;
- historical evidence;
- select;
- refine;
- compare.

## Package presentation

A package card should show:

- package score;
- strategy;
- field completeness;
- coherence;
- evidence;
- selected fields;
- Apply;
- Duplicate;
- Refine;
- Compare.

## Special components

### Metadata Candidate Card
Compact candidate with score and actions.

### Package Matrix
Fields × candidate packages matrix.

### Evidence Timeline
Changes aligned against analytics events.

### Strategy Dial
Purpose/style/diversity controls.

### Generation Scope Bar
Single / Selected / Full / Batch.

### Historical Impact Card
Before/after metrics plus confidence.

### Package Lineage
Original → Generated → Refined → Selected → Published → Changed.

### AI Explanation Drawer
Why a candidate was generated/ranked/recommended.

### Safe Apply Diff
Exact changes before applying.

## Visual language

Use existing ViewTube SubToolbox primitives first.

Create special primitives only where existing primitives cannot communicate:

- evidence timeline;
- candidate matrix;
- package lineage;
- impact comparison;
- generation scope control.

Do not invent a separate visual language.

## Layout principle

The first viewport should expose the most important controls without requiring navigation.

The user should immediately see:

**current value + manual control + Generate + Refine**

Advanced analysis remains one interaction away.

## Accessibility

- every AI action has a text label;
- keyboard access;
- clear state changes;
- no color-only scoring;
- candidate rank is available as text;
- destructive/apply actions require explicit confirmation;
- loading states preserve current values.
