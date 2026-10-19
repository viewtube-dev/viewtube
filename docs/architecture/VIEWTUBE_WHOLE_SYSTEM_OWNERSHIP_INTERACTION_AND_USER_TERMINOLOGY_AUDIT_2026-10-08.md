# ViewTube Whole-System Architecture, Ownership & User Experience Audit

**Branch:** `audit/system-convergence-identity-certification`
**Base:** `main`
**Audit date:** 2026-10-08
**Purpose:** Full inventory and conceptual map of how Projects, ContentBuild, Asset Engine, Assets, Vault, Video Packages, Publishing Packages, Handoffs, Studio Hub tools, Analytics, and Brain work together, with a user-facing terminology model that hides unnecessary implementation complexity.

## 1. Executive conclusion

ViewTube should be understood as **one continuous content-production system**, not a collection of independent databases or tools.

The durable spine is:

```text
Creator
  ↓
Project
  ↓
ContentBuild
  ↓
Assets + versions + variants
  ↓
Tools / operations / handoffs
  ↓
Video Package
  ↓
Publishing Package
  ↓
Publish
  ↓
YouTube
  ↓
Analytics
  ↓
Evaluation
  ↓
Brain / Learning
  ↺
next decision / next project
```

The critical architectural idea is that these are **different responsibilities around the same content identity**.

Do not make the creator understand the internal persistence model.

## 2. The simplest mental model

From the creator's perspective, ViewTube should answer five natural questions:

1. **What am I making?** → Project
2. **What is the current version of what I'm making?** → Content
3. **What things am I using to make it?** → Assets
4. **Is it ready to publish?** → Publishing
5. **How did it perform and what should I do next?** → Performance / Insights

Everything else is infrastructure supporting those five experiences.

## 3. Canonical ownership model

| System | Real responsibility | Creator-facing meaning | Should it feel like a separate system? |
|---|---|---|---|
| Project | Planning, organization, goals, schedule, tasks, intent | **Project** | Yes |
| ContentBuild | Durable identity and evolving content state | **Content** / current work | Usually no |
| Asset | One identifiable piece of content/media/output | **Asset** / file / version | Sometimes |
| Asset Engine | Asset relationships, versions, variants, selections, generation, lineage | Usually invisible; surfaced as **Assets** | No |
| Vault | Browse/search/manage durable assets | **Assets** / **Library** | Yes as a browsing experience |
| Video Package | Structured video configuration/projection | **Video setup** / package when needed | Usually no |
| Publishing Package | Exact publication-ready configuration | **Publish setup** | Usually no |
| PublishTransaction | External YouTube execution and idempotency | **Publishing** | No |
| Handoff | Controlled transfer of context/output between tools | **Send to…** / **Continue in…** | No |
| Operation | Traceable action/generation/execution | Usually invisible; surfaced as **Activity** when useful | No |
| Analytics | Measured performance | **Analytics** | Yes |
| Evaluation | Interpretation of measured result | **Analysis / Evaluation** | Usually no separate technical surface |
| Brain | Context, intelligence, evidence, recommendations, governed learning | **AI / Insights** | Yes, but integrated into tools |

## 4. Project

### Purpose

Project is the creator's **work container**.

It owns planning and organization:

- what the creator is trying to make;
- goals;
- tasks;
- schedule;
- priority;
- project status;
- planning context;
- project-level decisions;
- links into production work.

### Project does not own

- the permanent asset universe;
- duplicate content state;
- independent analytics truth;
- a second ContentBuild;
- independent AI memory.

### User-facing language

Use:
- Project
- Project plan
- Tasks
- Schedule
- Goals
- Ready to publish

Avoid exposing:
- ProjectContentIdentityService
- persistence scope
- identity transaction
- projection semantics.

## 5. ContentBuild

### Technical purpose

ContentBuild is the durable identity of the **content being made**.

It allows every relevant tool and lifecycle stage to refer to the same underlying work.

It carries the continuity that must survive:

- planning;
- research;
- scripting;
- generation;
- editing;
- packaging;
- publishing;
- post-publish measurement;
- learning.

### Why it exists

Without ContentBuild, every tool could accidentally create its own version of a video.

ContentBuild prevents:

```text
Script tool → its own video
Thumbnail tool → its own video
Publisher → its own video
Analytics → unrelated video
```

and instead provides:

```text
                 SAME CONTENT
                     │
      ┌──────────────┼──────────────┐
      ↓              ↓              ↓
    Script       Thumbnail       Publisher
      │              │              │
      └──────────────┼──────────────┘
                     ↓
                 YouTube
```

### User-facing language

Do not normally call it **ContentBuild** in the interface.

Preferred:
- Content
- This video
- Current project content
- Current version

ContentBuild should remain an architectural term unless the user is in an advanced/debugging surface.

## 6. Asset

An Asset is a **specific thing used or produced during creation**.

Examples:

- script;
- title option;
- thumbnail;
- image;
- video clip;
- audio;
- storyboard;
- rendered video;
- description;
- metadata package;
- generated variant.

An asset can have:

- versions;
- variants;
- selection state;
- provenance;
- relationships;
- source information;
- generation information;
- usage/outcome references.

### User-facing language

Use the natural specific noun whenever possible:

- Thumbnail
- Script
- Video
- Image
- Audio
- Title
- Description
- Version
- Option

Do not make the creator learn that every one of these is technically an `AssetRecord`.

## 7. Asset Engine

### Real responsibility

Asset Engine is the **system that manages the relationships and lifecycle of assets**.

It owns:

- artifact lifecycle;
- versions;
- variants;
- selections;
- lineage;
- dependencies;
- generation relationships;
- derived assets;
- outcome attribution.

### What it is not

Asset Engine is not simply a file browser.

Vault is the browse/manage/storage experience over the same asset identities.

### User-facing rule

**Asset Engine should usually disappear behind the word Assets.**

Instead of:

> Open Asset Engine → Asset Lineage → VariantGroup

the creator should see:

> Assets → Thumbnail → Options → Choose one

Technical Asset Engine surfaces belong in advanced workflows, diagnostics, and specialized production tools.

## 8. Vault

Vault is the creator's durable asset library and management experience.

Think:

**Asset Engine = how assets work**

**Vault = where the creator finds and manages them**

Vault should not create a competing asset identity.

User-facing vocabulary:

- Assets
- Library
- My Assets
- Browse Assets
- Recent
- Used in this project

## 9. Versions and variants

These are important technically but should have very simple UI semantics.

### Version

A later revision of the same thing.

User sees:
- Version 2
- Previous version
- Restore
- Compare versions

### Variant

An alternative option.

User sees:
- Options
- Alternatives
- Try another
- Choose this

Therefore:

**Version = changed version of the thing.**

**Option = alternative choice.**

Reserve the technical word `Variant` for advanced interfaces/documentation.

## 10. Video Package

Video Package is the structured representation of the video's current production/publishing configuration.

It should primarily act as a **projection of ContentBuild state**, not a competing content identity.

It can surface:

- title;
- thumbnail;
- description;
- tags;
- category;
- audience;
- visibility;
- schedule;
- captions;
- end screen;
- routing;
- readiness.

### User-facing language

Prefer:
- Video setup
- Video details
- Publishing setup
- Package

Do not force creators to understand why a Video Package is technically a projection.

## 11. Publishing Package

Publishing Package answers one question:

**What exactly are we preparing to publish?**

It brings together the exact publication-ready choices:

- final render;
- title;
- thumbnail;
- description;
- metadata;
- audience;
- visibility;
- category;
- schedule;
- captions;
- other publication settings.

It should be a projection of the current ContentBuild and selected assets.

### User-facing language

Prefer:
- Publish
- Publishing setup
- Ready to publish
- Review before publishing

Use **Publishing Package** in technical/advanced contexts, not as the primary creator vocabulary.

## 12. Publishing boundary

Publishing is where ViewTube crosses from preparation into an external side effect.

Conceptually:

```text
Prepare
  ↓
Review
  ↓
Approve
  ↓
Freeze exact publish state
  ↓
Publish
  ↓
Verify YouTube result
```

`ApprovedPublishSnapshot` is the frozen exact input.
`PublishTransaction` is the controlled external operation.

Current canonical documentation says the snapshot/transaction foundation exists on main. Remaining certification includes durable server authority, remote reconciliation, and failure/recovery/idempotency behavior.

## 13. Handoffs

A handoff is **not a copy of the project**.

It is a controlled transfer of context and/or an output to another tool.

A good handoff carries the minimum required context:

- project;
- content;
- selected assets;
- relevant evidence;
- requested action;
- source tool;
- provenance/trace where appropriate.

### User-facing language

Never expose:
- ActionPacket;
- ToolReceipt;
- ContextManifest;
- operation envelope.

Use:

- Send to Script
- Send to Thumbnail Studio
- Continue in Video Publisher
- Open in Editor
- Use this thumbnail
- Bring this result back

## 14. Operations

An operation is a traceable action such as:

- generation;
- research;
- analysis;
- transformation;
- rendering;
- handoff;
- publishing;
- external execution.

Technical systems currently have several operation/provenance concepts including ActionPacket, ToolReceipt, GenerationRecord and BrainTrace.

The architectural goal is shared operation identity without unsafe forced storage replacement.

### User-facing language

Do not expose OperationRecord as a normal concept.

Use:
- Activity
- History
- Generated by AI
- Created from…
- Changed by…
- Published on…

## 15. AI / Brain

The Brain should not be another place where the creator must manually manage data.

It should work across the system:

```text
Context
  ↓
Evidence
  ↓
Analysis
  ↓
Recommendation
  ↓
Creator decision
  ↓
Action
  ↓
Outcome
  ↓
Evaluation
  ↓
Learning candidate
  ↓
Governed knowledge
```

The Brain should use canonical Project/ContentBuild/assets/analytics/evidence rather than creating parallel stores.

### What the user should see

Instead of:

> BrainRuntime → EvidenceRecord → LearningCandidate

show:

> **AI Insight**
> Based on your recent videos…
> Here's why…
> Recommended action…
> Use it / Ignore / Tell me more

Brain should feel like intelligence woven into the application, not a separate database.

## 16. Analytics

Analytics measures what happened.

It should not decide what happened without sufficient evidence.

The chain should be:

```text
Published content
  ↓
Analytics checkpoints
  ↓
Comparable measurements
  ↓
Evaluation
  ↓
Insight
```

Analytics must remain connected to the exact content, assets, decisions and publication state that produced the observation.

## 17. Decision vs Change

This distinction is essential for future learning.

**Change:** what technically changed.

**Decision:** why an intentional choice was made.

Example:

```text
Change:
Thumbnail A → Thumbnail B

Decision:
Replace thumbnail because the creator accepted an AI recommendation
after observing low click-through performance.
```

Future analytics should be able to connect:

Decision → Change → Exact version → Exposure → Analytics → Evaluation.

## 18. Evidence

Evidence answers:

**What do we actually know, and where did it come from?**

It should preserve:

- source;
- freshness;
- metric/window;
- provenance;
- missingness;
- confidence;
- contradictions.

User-facing language:

- Based on…
- Evidence
- What we know
- Confidence
- Not enough data yet

Avoid exposing internal `EvidenceRecord` terminology except in advanced diagnostics.

## 19. Learning

ViewTube should not automatically turn every observation into permanent knowledge.

The safe progression is:

```text
Observation
  ↓
Evidence-supported association
  ↓
Evaluation
  ↓
Learning candidate
  ↓
Review / governance
  ↓
Channel knowledge
```

This prevents a single lucky result from becoming a permanent rule.

## 20. Full interaction map

```text
                           ┌──────────────┐
                           │     BRAIN    │
                           │ context      │
                           │ evidence     │
                           │ intelligence │
                           │ learning     │
                           └──────┬───────┘
                                  │
                                  │
CREATOR                            │
  │                                │
  ▼                                │
PROJECT ────────────────┐          │
  │                     │          │
  ▼                     │          │
CONTENTBUILD ◄──────────┘          │
  │                                │
  ├───────────────┐                │
  ▼               ▼                │
ASSETS         TOOLS ◄─────────────┘
  │               │
  │               ├── Script
  │               ├── Story
  │               ├── Thumbnail
  │               ├── Video Director
  │               ├── Editor
  │               ├── Metadata
  │               ├── Analysis
  │               └── Audience
  │
  ▼
ASSET ENGINE
  │
  ├── versions
  ├── options
  ├── selections
  ├── lineage
  └── generated/derived assets
  │
  ▼
VIDEO PACKAGE
  │
  ▼
PUBLISHING PACKAGE
  │
  ▼
PUBLISH TRANSACTION
  │
  ▼
YOUTUBE
  │
  ▼
ANALYTICS
  │
  ▼
OUTCOME / EVALUATION
  │
  └──────────────────────────────► BRAIN
                                  │
                                  ▼
                              NEXT DECISION
```

## 21. What tools should own

| Tool category | Primary job | Reads | Writes / produces |
|---|---|---|---|
| Projects | Plan and organize work | Project + content context | Project tasks/goals/schedule/intent |
| Script / Story tools | Develop content | Content + Brain context + evidence | Script/story assets |
| Thumbnail Studio | Create/select thumbnails | Content + assets + analytics insights | Thumbnail assets/options/selections |
| Video Director / Editor | Assemble video | Content + media assets | Renders/derived assets |
| Metadata tools | Prepare metadata | Content + evidence + analytics | Metadata versions/options |
| Video Publisher | Prepare and execute publication workflow | Publishing Package | Approved publication state / publish action |
| Video Manager | Manage already-published video | Published binding + analytics | Live metadata/thumbnail changes |
| Content Analysis | Interpret content/performance | Content + analytics + evidence | Findings/recommendations |
| Audience tools | Manage audience/community work | Audience evidence + content | Posts/comments/actions/outcomes |
| Brain | Provide intelligence | Context + evidence + outcomes | Recommendations / governed learning candidates |

## 22. Front-end simplification rules

### Rule 1 — Show the user's object, not the storage layer

Say **Video**, not `ContentBuild`.
Say **Thumbnail**, not `AssetRecord`.
Say **Publish**, not `PublishingPackageProjection`.

### Rule 2 — Use verbs for actions

Prefer:
- Create
- Edit
- Choose
- Compare
- Generate
- Refine
- Send to
- Publish
- Analyze
- Review

Avoid technical verbs such as:
- hydrate
- reconcile
- project
- persist
- resolve identity.

### Rule 3 — One concept, one name

Do not call the same object:

- ContentBuild;
- Content Object;
- Video Content State;
- Build;
- Production Record

in different UI surfaces.

Preferred user term: **Content** or **Video** depending on context.

### Rule 4 — Hide technical nesting

Do not make users navigate:

Project → ContentBuild → VideoPackage → PublishingPackage → AssetEngine.

Instead:

**Project → Work → Publish**

with contextual detail revealed when needed.

### Rule 5 — Make handoffs feel continuous

Instead of:

> Create ActionPacket

show:

> **Send to Thumbnail Studio**

Then the destination opens with the correct content and assets already loaded.

### Rule 6 — AI should explain itself

Every meaningful AI recommendation should answer:

- What are you recommending?
- Why?
- What evidence supports it?
- What will happen if I accept it?
- Can I undo it?

### Rule 7 — Do not make users manage provenance

Provenance should be automatic.

Users should see it when useful through:

- History
- Details
- Why?
- Source
- Compare

### Rule 8 — Technical vocabulary belongs in advanced surfaces

Advanced users may inspect:

- ContentBuild ID;
- Asset ID;
- operation ID;
- generation record;
- evidence ID;
- snapshot hash.

But these belong in diagnostics, not ordinary creation flows.

## 23. Recommended navigation vocabulary

Top-level creator experience should gravitate toward:

```text
Projects
  ├─ Plan
  ├─ Create
  ├─ Assets
  ├─ Review
  ├─ Publish
  └─ Performance

Studio Hub
  ├─ Create
  ├─ Design
  ├─ Analyze
  ├─ Audience
  └─ Publish

Assets
  ├─ All Assets
  ├─ Project Assets
  ├─ Versions
  └─ Favorites

Analytics
  ├─ Performance
  ├─ Changes
  ├─ Experiments
  └─ Insights

AI
  ├─ Ask
  ├─ Recommendations
  ├─ Decisions
  └─ Learning
```

These are product-language recommendations, not a mandate to rebuild current navigation wholesale.

## 24. Important ownership boundaries

### Projects owns
- planning;
- goals;
- tasks;
- schedule;
- project intent.

### ContentBuild owns
- durable content identity;
- evolving content state;
- lifecycle continuity.

### Asset Engine owns
- asset relationships;
- versions;
- variants/options;
- selections;
- lineage;
- generated/derived asset lifecycle.

### Vault owns
- asset browsing;
- storage-oriented management experience;
- search and organization.

### Publishing owns
- publication preparation;
- approval;
- external publishing;
- recovery/reconciliation.

### Analytics owns
- canonical measurement;
- windows;
- metric comparability;
- performance observations.

### Brain owns
- context resolution;
- evidence-backed intelligence;
- recommendations;
- evaluation/learning governance.

None of these should create a parallel identity store.

## 25. Current major gaps to certify

1. Project/ContentBuild capability verification and test coverage.
2. Asset lineage verification across all production tools.
3. Universal operation identity convergence.
4. Handoff producer/consumer coverage.
5. Approved snapshot server authority and remote reconciliation.
6. PublishTransaction interruption/retry/idempotency certification.
7. Post-publish ContentBuild checkpoint continuity.
8. Exact used asset/metadata attribution.
9. Outcome producer identity and idempotency.
10. Evaluation target coverage.
11. Evidence continuity.
12. Brain learning promotion across the complete lifecycle.

## 26. Recommended certification path

Do not attempt to certify every tool independently first.

Certify one complete vertical slice:

```text
Project
 ↓
ContentBuild
 ↓
Script
 ↓
Thumbnail
 ↓
Video / Render
 ↓
Publishing Package
 ↓
Approved Publish Snapshot
 ↓
Publish
 ↓
YouTube
 ↓
Analytics checkpoint
 ↓
Outcome
 ↓
Evaluation
 ↓
Brain learning candidate
```

Once that spine is proven, use the same contracts to certify the remaining Studio Hub tools.

## 27. Final architectural principle

**Internally, ViewTube can be sophisticated. Externally, it should feel simple.**

The creator should think:

**I'm making a video.**

ViewTube should internally handle:

Project identity → ContentBuild → assets → versions → tools → handoffs → publishing → analytics → outcomes → learning.

That is the central UX objective:

**One piece of content. One continuous journey. Many specialized tools. No duplicated worlds.**

## 14. Binding ownership decision — Video Publisher, Video Manager, Metadata Master

The three tools have become too similar at the visible feature level. The correction is **shared metadata capabilities with distinct lifecycle ownership**, not three independent metadata implementations and not one tool that absorbs the others.

### 14.1 The boundary in one table

| Capability | Video Publisher (VP) | Video Manager (VM) | Metadata Master (MM) |
|---|---|---|---|
| Primary object | Unpublished Project / content in production | Already-published YouTube video | Metadata package or proposed update set |
| Primary question | “Prepare this project for publication.” | “Manage and improve this published video.” | “What metadata should we use, and why?” |
| Generate full publishing package from rough input | **Owns**: phrase, concept, script, rough edit/video, or fuller project context | No; may request a focused refresh for an existing published video | Can construct/optimize a full metadata set for a project when the user supplies a project/package and goal |
| Edit metadata manually | Yes, before publication | Yes, after publication | Can edit/compose a proposed set; it is not the final lifecycle editor |
| Title, description, tags, thumbnail | Owns pre-publication preparation and selected package | Owns post-publication changes to the live video | Generates, compares, scores, and recommends candidate values/sets |
| Publish / upload workflow | **Owns** unpublished publishing workflow and final publish action | Never uploads or publishes an unpublished project | Never publishes; returns proposed metadata/assets to the owning workflow |
| Existing published video metadata update | Not its default responsibility | **Owns** live-video edits and update execution | Can prepare a proposed update set for VM to review/apply |
| Analytics-aware goals and optimization | May use project/channel goals to prepare the initial package | Uses performance context for a targeted post-publication refinement | **Owns the deep optimization workspace**: goal-aware package generation, analytics interpretation inputs, candidate comparison, ranking and recommendations |
| Tag ranking and custom field adjustments | Basic generation and direct edits appropriate to pre-publication setup | **Owns** practical live-video metadata controls, including tag ranking and custom adjustments | Can recommend/rank alternatives; does not replace VM's direct controls |
| Saved alternatives / history | Project/package alternatives before publication | Versioned change history for published metadata | Comparative candidate sets, optimization rationale and recommendation provenance |
| Final source of truth | Current Project + ContentBuild + Video/Publishing Package until publication | Current published-video record plus canonical change/version history after publication | No independent truth store; candidate/recommendation workspace over canonical project, package, asset and analytics data |

### 14.2 Lifecycle rules

1. **VP owns the pre-publication lifecycle.** It accepts as little or as much source material as the creator has: one-sentence idea, concept, script, rough cut, final video, or a substantially complete project. It can generate a complete publishing package, let the creator manually edit it, save alternatives, select the final set, and publish. Its main output is a Project-linked, publication-ready package.
2. **VM owns the post-publication lifecycle.** It works on videos that are already published. It provides direct, field-level metadata controls; custom adjustments; tag ordering/ranking; current-versus-proposed comparisons; and controlled update execution. It must not show unpublished-project upload/publish controls.
3. **MM owns metadata intelligence, not video lifecycle execution.** It consumes a Project/ContentBuild, current Video/Publishing Package, relevant user input/goals, and—when updating published content—available analytics/performance context. It creates proposed full metadata sets or focused update sets, generates associated candidate assets when requested, compares and ranks alternatives, explains recommendations, and hands the result back to VP or VM.
4. **MM may serve both lifecycle stages without becoming a third editor.** For an unpublished project, its result is a proposed package/option for VP to review and select. For a published video, its result is a proposed update set for VM to review and apply. MM itself does not publish and does not silently overwrite current metadata.
5. **Shared fields do not imply shared ownership.** Title, thumbnail, tags, and description should use shared canonical field contracts, primitives, validation, and asset references. VP and VM must not implement separate competing metadata schemas or write to separate stores.
6. **The selected values remain owned by the active lifecycle object.** Before publication, the active Project/ContentBuild and package are authoritative. After publication, the published-video metadata state and its canonical change/version history are authoritative. MM candidates are alternatives until explicitly selected/applied.
7. **Every change has a reason and a record.** Preserve the distinction: a Decision records why a candidate/change was chosen; a Change records what field/value/asset changed. Record source (manual, VP generation, MM recommendation, analytics-informed refinement), prior/current value, timestamp, and related package/project/video identity through existing canonical records.
8. **No duplicated “Metadata Master inside Manager/Publisher.”** Embed contextual MM actions/results where useful, but keep the full optimization workspace distinct. A handoff must carry references to the same Project/ContentBuild/package/video and candidate assets, not clone the project or create a competing metadata store.

### 14.3 Canonical workflows

**Unpublished project**

`Project / ContentBuild → VP source input and context → MM optional package generation/optimization → candidate metadata/assets → VP review/edit/compare/select → Publishing Package → publish → published-video identity`

VP can generate a package without MM. MM is an optional intelligence pass, not a required gate. A user can also invoke MM directly for a full package, then hand the proposed set into VP.

**Published video**

`Published video + current metadata + analytics window + user goal → VM direct controls and/or MM optimization → proposed field/set changes → compare/rank/review → explicit apply in VM → recorded metadata change → subsequent analytics evaluation`

VM can edit and refine without MM. MM is optional and must not block ordinary manual edits.

### 14.4 UI and navigation rules

- Keep one shared metadata field contract and the canonical section order; lifecycle-specific sections/actions may differ.
- VP labels should emphasize **Prepare package**, **Generate package**, **Save to Project**, **Save as Option**, **Select package**, and **Publish**.
- VM labels should emphasize **Edit published video**, **Rank tags**, **Refine metadata**, **Apply changes**, and **Change history**.
- MM labels should emphasize **Generate set**, **Optimize**, **Compare**, **Rank options**, **Why this recommendation?**, and **Send to Publisher / Send to Manager**.
- MM's analytics-goal and optimization-intensity controls belong in MM. VP and VM can expose compact goal/context inputs without reproducing the full MM control surface.
- Never place a video upload/publish action in VM. Never make MM's generated option appear already applied. Never require MM for routine VP/VM edits.
- A single shared primitive may render in all three tools, but labels, available actions, and data source must be explicitly supplied by the owning workflow rather than inferred from duplicated local state.

### 14.5 Acceptance tests for the boundary

- VP can generate/save/select a package from a one-phrase idea with no MM interaction.
- VP can accept script/rough-cut context and create a full package; selection remains attached to the active Project/ContentBuild.
- MM can create a full unpublished-project metadata set and return it to VP as an alternative, without changing the selected set until the creator chooses it.
- VM can edit a published video's title, description, thumbnail and tags without opening MM.
- VM can rank/reorder tags and apply a manual refinement without invoking AI.
- MM can analyze analytics and goals for a published video, produce ranked proposed changes, and hand them to VM; the live metadata changes only after explicit apply.
- Applying a proposal records the exact fields/assets changed and links the reason/recommendation to the same video identity.
- The same metadata field, selected asset, and package are not stored independently in VP, VM, and MM.
- Project/unpublished actions cannot accidentally update a published video's metadata; published-video actions cannot accidentally mutate an unrelated active Project.
- All three tools reuse the canonical metadata components/primitives while keeping lifecycle-specific actions separate.

