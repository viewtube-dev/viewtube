# ViewTube Studio Hub + Projects UI Component Manifestation Gaps

**Date:** 2026-10-13  
**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Document type:** Frontend component-gap inventory and implementation contract  
**Scope:** Creator-visible UI components, compound components, primitives, and layouts needed to make Studio Hub and Projects workflows concrete and operable.

> **Audit boundary:** This document records the component requirements identified during the UI gap discussion. It is not a claim that every item has been checked against the current rendered application or that a component is definitely absent from source. For each item, implementation work must first locate and reuse the canonical primitive/component if it already exists, then repair or extend it; create a new component only when no suitable canonical implementation exists.

## 1. Objective

Make Studio Hub and Projects capabilities visible and usable through consistent, reusable frontend components—not just architecture documents, service modules, or entries in the UI Reference Library.

The core requirement is **manifestation + behavior + shared implementation**:

1. The component exists in the canonical primitive/component source and UI Reference Library.
2. Production screens use that same implementation rather than a hard-coded visual copy.
3. The component exposes the state and callbacks required for its real workflow.
4. Shared style, sizing, typography, spacing, focus, disabled, loading, and error behavior stay consistent across tools.
5. Changes to canonical primitives propagate to their consumers.

## 2. Priority component inventory

### P0 — Field-level Generate / Refine / Analyze controls

#### 2.1 Title / Description Input with AI Action Row

**Purpose:** Let creators work on an individual metadata field without leaving the current Studio tool.

**Required manifestation**
- A title or description input/textarea.
- A single horizontal action row directly beneath the field.
- Three distinct actions: **Generate**, **Refine**, and **Analyze**.
- Canonical split-left/action button styling, icon treatment, typography, height, spacing, and disabled behavior.
- A clear relationship between each action and the field it operates on.
- Controls must wrap or adapt predictably at narrow widths without reverting to an unrelated vertical button stack.

**Behavior contract**
- Generate creates a candidate for the field.
- Refine improves the current field value or a clearly selected candidate.
- Analyze evaluates the current field value and returns feedback without silently replacing the value.
- Preserve the creator's last-edited text while an operation runs and when it fails.
- Do not overwrite text without an explicit result-apply step when the workflow supports candidate review.
- Provide working loading, disabled, success/result, and error states; prevent duplicate submissions while an operation is in flight.
- Each action must receive the correct field identity, current value, active project/package context, and relevant settings.

**Consumers to inspect:** Video Manager, Video Publisher metadata page/subtoolbox, and any Studio Hub tool that edits title/description-like fields.

#### 2.2 Labeled Input / Textarea Variant

**Purpose:** Support fields whose colored label belongs at the upper-right edge rather than inside or to the left of the input.

**Required manifestation**
- Canonical input and textarea variants with a top-right label slot.
- Label styling and alignment shared with the component library.
- No label overlap with the input value, resize affordance, or field controls.
- Responsive behavior for long labels and narrow layouts.

**Acceptance checks**
- The variant is available in the primitive source and component library.
- At least one intended production field uses the canonical variant.
- Existing input variants remain visually unchanged unless explicitly migrated.

#### 2.3 Input Options / Refinement Menu

**Purpose:** Expose less-frequently-used settings without overcrowding the main field.

**Required manifestation**
- A compact, consistently positioned dropdown/expandable control associated with the field or its action row.
- Support for style, full-set, refinement, analysis, or generation settings where the parent tool defines them.
- Clear selected/default states and an obvious way to close the menu.

**Behavior contract**
- Options affect the operation that consumes them; they must not be decorative.
- Keep settings scoped to the correct field or generation workflow.
- Preserve settings when the user changes an option and returns to the field, according to the parent tool's persistence contract.
- Support keyboard navigation, focus management, escape-to-close, and accessible names.

#### 2.4 AI Operation States

Treat these as shared component states, not one-off button implementations:
- Idle and ready.
- Generating, refining, or analyzing.
- Disabled because prerequisites are missing.
- Result available / candidate ready.
- Failed with a useful recoverable error.
- Cancelled or superseded, where cancellation is supported.

Use the canonical button and status primitives for these states. Do not create a separate visual language for Generate/Analyze, Load/Refresh, and workspace split-left buttons.

### P0 — Project selection and active-context controls

#### 2.5 Project Selector / Switcher

**Purpose:** Let creators find and switch the active project while working in a Studio tool.

**Required manifestation**
- Displays the current project's name and identity.
- Opens a selectable project list.
- Makes the active/selected project visually unambiguous.
- Supports empty, loading, and no-results states.
- Shows useful context such as thumbnail, status, scheduled date, or project stage when available.

**Behavior contract**
- Selecting a project updates the active project context for the parent workflow.
- Components must use the canonical project identity; do not create a parallel UI-only project record.
- Handle a project being removed or becoming unavailable while selected.
- Keep manual selection stable when unrelated parent state changes; synchronize to a new active-project ID when that ID actually changes.
- Do not silently discard unsaved field edits during a switch. Follow the product's established save/confirm behavior.

#### 2.6 Active Project Header

**Purpose:** Keep the current project visible in toolboxes and subtoolboxes so creators understand which project the tool is acting on.

**Required manifestation**
- Compact project identity, usually name plus a useful secondary identifier such as thumbnail or status.
- A switch/change-project affordance that opens the shared selector.
- Consistent alignment and dimensions across Studio Hub tools.
- A sensible compact form for narrow layouts.

**Acceptance checks**
- The same canonical component is reused across eligible tools.
- Changing the active project updates the header and downstream tool context together.
- The header does not create a second independent source of active-project state.

#### 2.7 Project Card / Project Row

**Purpose:** Represent a project as a selectable, actionable item across Projects, boards, lists, and selectors.

**Required manifestation, when data exists**
- Project title.
- Thumbnail or defined fallback.
- Status/stage.
- Scheduled or target date.
- Selected/active state.
- Optional useful metadata appropriate to the layout.

**Behavior contract**
- Selection and quick actions are distinct interactions.
- Status and date must come from project data, not hard-coded display strings.
- Missing thumbnail/date/status must have intentional fallback behavior.
- Card and row layouts should be variants of a shared component contract where practical, not divergent copies.

#### 2.8 Project Manifestation Panel

**Purpose:** Show and operate on the selected project's durable content/package context inside tools that need it.

**Required manifestation**
- Clear selected-project identity.
- Summary of relevant package contents (as applicable): title, description, thumbnail, video, tags, and other metadata/assets.
- Explicit **Load**, **Swap In**, and **Refresh** actions only where those actions have distinct meanings.
- Empty/unselected and unavailable-project states.

**Behavior contract**
- Define and document the difference between Load, Swap In, and Refresh before presenting all three.
- Do not wire distinct labels to the same handler unless they are intentionally equivalent and the UI communicates that.
- Loading a project and swapping the active working context must respect unsaved-change handling.
- Refresh updates the displayed projection from canonical data without creating a duplicate project/package.
- Preserve the link between Project, ContentBuild, Video Package, and Publishing Package identities.

#### 2.9 Project Search / Filter Bar

**Purpose:** Make project selection usable as project counts grow.

**Required manifestation**
- Search by project title or supported identifiers.
- Filters only for fields actually represented by the data model (for example status/stage or scheduled state).
- Clear-filter/reset affordance and a useful no-results state.

**Behavior contract**
- Search/filter changes update the visible list.
- Filtering must not accidentally change the active project.
- Use shared input, dropdown, and chip/tag primitives.

#### 2.10 Project Package Summary

**Purpose:** Make the contents of a project package visible before opening or applying it.

**Required manifestation**
- A compact, scannable summary of the available title, description, thumbnail, video, tags, and other relevant saved fields.
- Clear distinction between missing, draft, saved, and ready content where those states exist.
- Avoid showing every possible field in every compact context; use a shared summary with layout variants.

#### 2.11 Project Status / Stage Control

**Purpose:** Let the user understand the current lifecycle stage and change it where the workflow permits.

**Required manifestation**
- Canonical status badge and, where editable, a control for changing stage.
- Correct typography, weight, capitalization, stroke/border, and sizing aligned with existing reference implementations.
- Read-only status presentation must not look like an editable dropdown.

**Behavior contract**
- Stage transitions must follow existing project rules.
- A status change must persist to canonical project data and update all relevant views.
- Do not introduce new stage names in UI without aligning them with the domain model.

#### 2.12 Project Quick Actions

**Purpose:** Expose supported actions without forcing the user to open each project.

Potential actions, only when supported by the existing workflow:
- Open/edit.
- Duplicate.
- Archive.
- Schedule/reschedule.
- Open related package or handoff.

Actions must be individually permissioned/available according to state, use standard icon/action primitives, and confirm destructive or materially disruptive changes.

#### 2.13 Project Selection Empty / Loading / Error States

Create reusable states for:
- No projects exist yet.
- Projects are loading.
- Search/filter returned no matches.
- A selected project is no longer available.
- Project data failed to load.

Each state should explain the situation and offer a relevant recovery action where possible; avoid blank panels or dead-end spinners.

## 3. Shared primitives and compound components to reconcile

Before building new UI, inspect the canonical primitive source and component library for the following. Reuse or repair the existing implementation when present.

| Component contract | Required outcome |
|---|---|
| Standard Input / Textarea | Consistent labels, sizing, focus, disabled/error states, and field spacing |
| Top-right Label Input / Textarea | Supported label slot and responsive alignment |
| Field AI Action Row | Generate / Refine / Analyze in one canonical horizontal row |
| Split-left Action Button | One source of truth for icon segment, text segment, typography, shadows, sizing, and states |
| Field Options Dropdown | Shared menu behavior and option presentation |
| Project Selector / Switcher | Canonical active-project selection |
| Active Project Header | Reusable project identity in toolbox headers |
| Project Card / Row | Shared project identity and selection states |
| Project Manifestation Panel | Consistent package summary and meaningful Load / Swap In / Refresh semantics |
| Project Package Summary | Reusable compact content/package projection |
| Project Status Badge / Control | Consistent visual and domain-state contract |
| Project Search / Filter | Shared controls and empty states |
| Project Quick Action | Shared icon button, tooltip/label, disabled, and confirmation behavior |
| Project Empty / Loading / Error State | Reusable recovery patterns |
| Toolbox / Subtoolbox Header Slot | Consistent placement of project context and header actions |

### Styling governance

- Canonical primitives own their visual details; consuming tools should not reimplement them with local CSS.
- Match the established component library for font family, capitalization, weight, text size, border/stroke, icon size, segment proportions, and shadow depth.
- Audit the Generate/Analyze, Load/Refresh, and workspace split-left buttons together to remove unintended differences in source, style, and duplicate shadows.
- Use semantic variants for real differences; do not create near-identical primitives just to work around inconsistent defaults.
- Maintain keyboard focus visibility, reduced-motion support, accessible names, and usable touch targets.

## 4. Required integration points

Inspect and map the component contracts into these real application surfaces:

1. **Video Manager:** Published-video management; no video-upload control. Apply field AI controls to relevant metadata fields and ensure the current project/package context is clear where used.
2. **Video Publisher:** Unpublished projects and publishing metadata. Reuse the same metadata field/action components as Manager while preserving Publisher's separate Write/Create workflow.
3. **Projects page / Project Builder:** Project identity, creation/planning, project selection, status, and the path into the project's working package.
4. **Project Board and Calendar:** Shared project card/row and status/date manifestation; selecting a project must resolve to the same canonical project identity.
5. **Studio Hub tools:** Shared active-project header and selector wherever a tool operates on project-specific context.
6. **ContentBuild / Video Package / Publishing Package handoffs:** UI must present the same durable content identity across handoffs, not create independent copies or ambiguous labels.

This is a mapping checklist, not an assertion that every surface needs every component. Each integration should be justified by the workflow and actual data it consumes.

## 5. Implementation sequence

### Wave 1 — Field AI controls
1. Locate the canonical input, textarea, split-left button, and action-row implementations.
2. Record the current variants and identify whether Generate / Refine / Analyze are already implemented in any tool.
3. Implement or repair the shared Field AI Action Row and field label/options variants.
4. Migrate the highest-priority title and description fields in Video Manager and Video Publisher.
5. Verify that actions call real handlers and preserve user edits.

### Wave 2 — Project context
1. Trace active-project state from its canonical source through ProjectManifestation and the parent tool.
2. Implement/reuse Project Selector and Active Project Header.
3. Add them to the Project Builder and eligible Studio Hub tools.
4. Test active-project changes, manual selection stability, missing-project fallback, and unsaved edits.

### Wave 3 — Project representation and package controls
1. Reconcile Project Card/Row, status, package summary, and quick actions.
2. Clarify Load vs Swap In vs Refresh semantics and ensure handlers match the labels.
3. Integrate shared representations into Project Board, Calendar, selectors, and package panels.

### Wave 4 — Library/source convergence
1. Add or update each canonical component's entry in the UI Reference Library with its true production implementation and supported variants.
2. Replace local copies in consuming screens with canonical components.
3. Remove duplicate styling and redundant implementations only after references and behavior are verified.
4. Run component-library checks, focused tests, typecheck, build, and relevant browser smoke tests; document failures without marking unrun checks as passed.

## 6. Acceptance checklist

A component is not complete merely because it appears in a design-library preview. Verify all applicable items:

- [ ] Canonical implementation exists in source and is referenced by the UI Reference Library.
- [ ] At least one real production consumer uses that implementation.
- [ ] Props and callback contracts are typed and documented.
- [ ] Visual size, typography, spacing, colors, borders, icon geometry, and shadows match the canonical design.
- [ ] All visible actions have real behavior; no decorative controls or placeholder handlers.
- [ ] Loading, disabled, empty, error, selected, and focus states are covered where relevant.
- [ ] Project identity and active-project state remain consistent across the workflow.
- [ ] User edits are preserved through generation, errors, refreshes, and project switching according to the save contract.
- [ ] Keyboard interaction, accessible naming, focus management, and reduced-motion behavior are checked.
- [ ] Focused tests and component-library checks pass, or failures are explicitly recorded.
- [ ] Browser verification confirms the component in the actual frontend, not only in isolation.

## 7. Evidence and status tracking template

For each component, add a row to the implementation audit:

| Field | Record |
|---|---|
| Component / variant | Canonical component name |
| Canonical source | File path and exported symbol |
| Library entry | Reference Library path/entry |
| Current consumers | Actual production screens/components |
| Gap type | Missing / exists but unused / duplicated / styling drift / behavior incomplete / integration broken |
| Required change | Smallest safe repair or addition |
| Data contract | Inputs, active project/package identity, outputs |
| Tests | Focused test and component-library check |
| Browser verification | Route/screen and observed behavior |
| Status | Not inspected / confirmed gap / implemented / verified |

Do not mark an item as **missing** until source inspection establishes that no reusable implementation exists. Distinguish a missing primitive from a primitive that exists but is not used, is styled inconsistently, or has nonfunctional handlers.

## 8. Relationship to canonical workflow documentation

Keep this document focused on **frontend manifestations and component contracts**. The existing Projects / ContentBuild / Video Package workflow reference remains the authority for durable identity, lifecycle, ownership, and handoffs. The Studio Hub master architecture remains the authority for the tool catalog and tool purposes. Update those documents only when the underlying workflow or tool architecture changes; link to this document when the remaining issue is a concrete UI component or layout.

## 9. Immediate next action

Perform a source-backed inventory on `master/consolidated-feature-integration` for the P0 components first:
1. Title/Description Input + Generate/Refine/Analyze row.
2. Project Selector / Switcher.
3. Active Project Header.
4. Project Card / Row.
5. Project Manifestation Panel and the distinct behavior of Load / Swap In / Refresh.

For each, report the canonical source, consumers, real behavior, and gap category before editing. Then implement the smallest coherent shared change and verify it in the actual frontend.
