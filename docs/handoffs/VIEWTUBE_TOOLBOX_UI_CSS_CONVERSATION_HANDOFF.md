# ViewTube Toolbox UI + CSS — Conversation Continuation Handoff

**Status:** CURRENT CONVERSATION-DERIVED CONTINUATION HANDOFF  
**Production date:** 2026-09-27  
**Last edited:** 2026-09-27  
**Repository:** `themotionvisual/ViewTubeBUILD`  
**Audited main at authoring:** `a2b96622f302e95d5895da5850135ff7ea8ebac1`  
**Canonical master:** `docs/architecture/VIEWTUBE_TOOLBOX_UI_MASTER_RESOURCE.md`  
**Master handoff:** `docs/handoffs/VIEWTUBE_TOOLBOX_UI_CSS_MASTER_HANDOFF.md`  
**Component-library authority:** `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md`  
**Primary code authority:** `src/components/Toolbox.tsx` + `src/components/subtoolbox/*`  
**Primary CSS authority:** `src/styles/toolbox-system.css` + `src/styles/subtoolbox-system.css`  
**Token authority:** `src/components/subtoolbox/tokens.ts`  
**Palette authority:** `src/styles/toolboxPalette.ts`

---

## 0. Purpose of this handoff

This document captures the Toolbox / Studio UI / CSS conclusions, implementation rules, audit findings, responsive corrections, migration strategy and continuation priorities established in the conversation that produced the September 26–27 Toolbox stabilization work.

It is intentionally a **continuation handoff**, not a new design authority.

If anything here conflicts with current production code, executable tests, the canonical Toolbox master resource, or the master handoff, the newer executable/canonical source wins.

Use this document when the next agent needs to understand:

- why the current Toolbox system is shaped the way it is;
- what mobile defect triggered the latest stabilization wave;
- which rules are non-negotiable;
- which files own which CSS responsibilities;
- how header allocation must work;
- how SubToolbox vertical sizing must work;
- how mobile title, touch-target and palette behavior should work;
- what recent PRs changed;
- what remains visually uncertified;
- how to continue Studio migrations without recreating CSS archaeology.

---

# 1. Executive state

The Toolbox system is now a mature shared UI framework rather than a collection of page-local shells.

The highest-value correction completed in this conversation was not a one-page Video Publisher patch. The work established a **system-level responsive contract** so the same failure cannot reappear across Studio tools.

The key merged work is:

| PR | Purpose | Result |
| --- | --- | --- |
| #468 | mobile responsive stabilization | protected title allocation, canonical secondary header actions, intrinsic mobile SubToolbox height, 44px touch targets, `perf.css` ownership cleanup |
| #470 | cross-app responsive governance | prevents fixed-width header action clusters; breakpoint-scopes desktop equal-height behavior in Media Analyzer / Storyboard Studio |
| #474 | SEO Generator primitive migration | live `/seo-generator` moved from duplicate VIDEO PUBLISHER chrome, native controls and `Standard*` fields to canonical Toolbox primitives |

The code is ahead of visual certification. Do not translate "merged" into "visually perfect" without screenshot verification.

---

# 2. Audit baseline that triggered the stabilization wave

The conversation established this baseline:

| Dimension | Score | Main finding |
| --- | ---: | --- |
| Accessibility | 2/4 | help/collapse controls below preferred mobile touch floor; title clipping reduced readability |
| Performance | 3/4 | no runtime blocker, but competing `!important` responsive layers increased complexity |
| Responsive | 1/4 | mobile header/title/action allocation visibly broken |
| Theming | 3/4 | palette system strong, but feature-local hard-coded colors remained |
| Implementation integrity | 2/4 | canonical system existed, but local CSS and competing ownership defeated it |
| **Total** | **11/20** | significant correction required |

Target after certification: **20/20**.

The score is a historical baseline. It should remain in documentation even after improvement so future agents can see what changed and why.

---

# 3. What was actually breaking

## P1.1 — Main Toolbox mobile header allocation failure

Video Publisher exposed the system-level defect.

The old header tried to fit, simultaneously:

- an 80px-style icon rail / structural identity;
- a 26px title;
- help;
- collapse;
- action gaps and padding;
- a page-local fixed `w-[210px]` Longform / Shorts block.

At iPhone widths the math was impossible.

The visible symptom was the title becoming a clipped `VIDEO PUBLIS...` block.

### Root rule

The fix is **not** to shrink the title.

Optional actions yield first.

---

## P1.2 — SubToolboxes were stretched beyond their content

Several tools mixed:

- `openUnits`-derived minimum height;
- `shellClassName="h-full"`;
- `contentClassName="h-full"`;
- fixed upload-target minimums.

On phone layouts this turned compact stacked modules into giant empty cards.

### Root rule

Phone SubToolboxes are intrinsic-height by default.

Equal-height desktop layouts belong to the parent breakpoint/layout, not the child shell.

---

## P1.3 — Mobile CSS ownership was conflicted

Before consolidation:

- `perf.css` contained mobile Toolbox geometry;
- `toolbox-system.css` tried to restore canonical title behavior;
- `subtoolbox-system.css` added another header/action layer;
- feature CSS could add local compensating overrides.

That was CSS archaeology.

### Root rule

Every geometry responsibility has one owner.

No fix should add another competing selector below an existing conflict.

---

# 4. P2 issues carried into the architecture

## P2.1 — Header actions require a reservation contract

A `max-width` on the extras container is not enough if a descendant requests a fixed width.

The system needs a protected-title rule that makes oversize actions reflow.

## P2.2 — Mobile touch targets

Visual glyph sizes can remain compact.

Interactive help/collapse targets should be at least **44 × 44px** on mobile.

## P2.3 — Feature-local palette declarations

Normal Toolbox identity should come from the palette allocator.

Hard-coded header/icon colors are reserved for explicit, documented semantic exceptions.

## P2.4 — Painted-edge spacing

Raw CSS padding is not the same as perceived spacing.

A thick stroke/shadow consumes visual breathing room.

Top, left, right and bottom clearance must be judged from the **painted boundary**, not only numeric padding.

---

# 5. Canonical system hierarchy

The hierarchy is:

```text
PAGE
└── MAIN TOOLBOX
    └── SUBTOOLBOX
        └── INTERIOR SURFACE
            └── PRIMITIVE / COMPOUND
                └── CONTROL
```

Do not turn every interior feature into another Toolbox.

Kanban lanes, result cards, asset rows, filters, preview areas, editors and standard controls remain interior components unless they truly need SubToolbox behavior.

---

# 6. Structural geometry

## 6.1 Desktop structural ladder

| Level | Meaning | Height | Stroke | Radius | Shadow | Title |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| T0 | Main Toolbox | 80px | 5px | 16px | 10px | 26px |
| T1 | SubToolbox | 56px | 4px | 12px | 6px | 20px |
| T2 | interior structural level | 48px | 3px | 8px | 4px | 18px |
| T3 | dense structural level | 32px | 2px | 6px | 2px | 12px |

## 6.2 Mobile shell override

| Surface | Mobile |
| --- | --- |
| Main Toolbox | 56px shell/header height |
| SubToolbox | 44px shell/header height |

Mobile does not create a separate "Compact Toolbox system."

It is a responsive override of the same hierarchy.

## 6.3 Control ladder

Controls are separate from structural shell levels.

| Control level | Height | Stroke | Radius | Shadow | Typical type |
| --- | ---: | ---: | ---: | ---: | ---: |
| L0 | 56px | 4px | 12px | 6px | ~24px |
| L1 | 48px | 3px | 8px | 5px | ~18px |
| L2 | 32px | 2px | 6px | 4px | ~12px |

Do not derive Toolbox shell geometry from a control-size alias.

---

# 7. CSS ownership law

This is the most important continuation rule.

## 7.1 `toolbox-system.css` owns structural geometry

It owns:

- Main Toolbox shell geometry;
- SubToolbox shell geometry;
- mobile 56/44 shell behavior;
- shell stroke/radius/shadow;
- structural header allocation;
- protected title slots;
- primary-vs-secondary header action placement;
- title wrapping policy;
- structural content gutters;
- Mini SubToolbox shell structure;
- mobile intrinsic-height structural behavior.

## 7.2 `subtoolbox-system.css` owns primitive anatomy

It owns:

- help/collapse/palette-control anatomy;
- touch-target dimensions;
- inputs and textareas;
- selects and dropdowns;
- checkboxes/radios/toggles/switches;
- tags/badges;
- upload-frame anatomy;
- focus-visible states;
- primitive-level responsive behavior.

## 7.3 `perf.css` must not own visible Toolbox geometry

`perf.css` may optimize rendering.

It must not redefine:

- header height;
- title size;
- title wrapping/ellipsis;
- icon rail width;
- shell padding;
- SubToolbox height;
- help/collapse geometry.

## 7.4 Feature CSS must not redefine the shared system

Page-local files must not own:

- Toolbox title sizing;
- Toolbox shell radius/stroke;
- canonical icon-rail width;
- canonical header height;
- mobile title ellipsis;
- fixed mobile action allocation;
- ordinary SubToolbox mobile stretching.

### Explicitly forbidden regression patterns

```text
w-[210px] inside headerActions
page-local vt-toolbox-title font-size
page-local vt-toolbox-header geometry
bare h-full on ordinary stacked phone SubToolboxes
overflow:hidden used to hide title allocation failure
mobile ellipsis used instead of reflow
hard-coded normal Toolbox title/icon colors
```

---

# 8. Header allocation contract

The header should be treated as a resource-allocation system, not an arbitrary flex row.

## 8.1 Conceptual equation

```text
AVAILABLE HEADER WIDTH
- ICON RAIL
- OUTER INSETS
- HELP TARGET
- COLLAPSE TARGET
- REQUIRED GAPS
= SHARED CONTENT WIDTH

SHARED CONTENT WIDTH
= PROTECTED TITLE WIDTH + OPTIONAL ACTION WIDTH

OPTIONAL ACTION WIDTH
<= SHARED CONTENT WIDTH - PROTECTED TITLE WIDTH
```

If that equation cannot be satisfied, optional actions move.

The title does not shrink to rescue them.

## 8.2 Priority order

On constrained mobile widths:

1. icon rail;
2. complete title;
3. collapse;
4. help;
5. compact header actions;
6. secondary action strip / overflow location.

A lower-priority element yields before a higher-priority structural element is damaged.

## 8.3 Title rules

Main Toolbox title:

- established size remains 26px;
- may wrap to two tight complete lines;
- must not ellipsize purely because an optional action is too large.

SubToolbox title:

- established size remains 20px;
- may use two tight lines if needed;
- must not be reduced merely to fit sibling actions.

## 8.4 Action categories

Use a normalized mental model:

```text
HEADER_ACTION_INLINE
HEADER_ACTION_COMPACT
HEADER_ACTION_SECONDARY
HEADER_ACTION_OVERFLOW
```

Small two-state toggles belong in the compact pattern.

Larger action groups move into the secondary strip rather than compressing the title.

---

# 9. SubToolbox vertical sizing law

The safe default is:

```text
SubToolbox -> intrinsic height
parent layout -> optional breakpoint-scoped equalization
```

Avoid:

```text
SubToolbox -> h-full by default
mobile CSS -> undo stretch later
```

That dependency is fragile.

## 9.1 Equal-height desktop panels

If a desktop layout genuinely needs equal-height columns, express that where the layout becomes multi-column.

Examples from the stabilization wave:

- Media Analyzer equalization scoped to `md:`;
- Storyboard Studio equalization scoped to `xl:`.

## 9.2 `openUnits`

`openUnits` may provide desktop/tablet minimum guidance.

It must not force giant stacked phone modules.

Longer term, height semantics should remain conceptually separated:

```text
intrinsic
minimum
equalized
fill
```

`fill` should be rare and explicit.

---

# 10. Upload-frame sizing

Upload targets can have a preferred desktop height.

They must not force a 220px minimum on every phone.

Phone behavior should be responsive and bounded.

The shared upload primitive should own this rule rather than each tool manually patching its frame.

---

# 11. Painted-edge spacing

ViewTube uses thick strokes and shadows.

Therefore:

```text
CSS padding != perceived visual clearance
```

Spacing must account for:

- border thickness;
- shadow offset;
- neighboring shell stroke;
- title/header paint;
- internal control shadow.

When debugging "cramped" or "floating" modules, inspect the visible painted edge, not just the computed padding value.

Recommended spacing vocabulary:

```text
layout gap
content inset
paint clearance
shadow clearance
```

Do not solve a canonical painted-clearance problem with one-off page margins.

---

# 12. Palette and theming

The production 12-color palette remains the identity system.

Normal Toolbox/SubToolbox color should come from `toolboxPalette.ts`.

## 12.1 Pairing

Owning shell resolves:

- `--pair-a` = title/header color;
- `--pair-b` = icon/rail color.

Nested primitives consume that pair.

## 12.2 Sequential allocation

Automatic palette flow should continue across sibling and nested SubToolboxes.

Do not restart the sequence casually.

## 12.3 Hard-coded colors

Use hard-coded colors only when they communicate real semantic meaning.

Do not use them merely because a feature once had a custom header.

The SEO Generator migration removed this type of feature-local Toolbox color ownership.

---

# 13. Primitive direction

The canonical system should continue replacing page-local raw HTML with reusable Studio primitives.

Key families include:

- Button;
- Icon Button;
- Split Button;
- Input;
- Textarea;
- Select;
- Dropdown;
- Search;
- Stepper;
- Checkbox;
- Radio;
- Toggle;
- Switch;
- Tabs;
- Pagination;
- Breadcrumb;
- Tag;
- Spectrum Tag;
- Badge;
- Tooltip;
- Popover;
- Upload Frame;
- Video Selector;
- Media Selector;
- Output Card;
- State Panel;
- Progress;
- Slider;
- Loading/Skeleton.

Studio-specific compounds should be built from these primitives rather than introducing new CSS micro-systems.

---

# 14. Important compound components

## 14.1 Media Player

Canonical media-player compound should own:

- viewport;
- media state;
- transport;
- duration;
- volume;
- progress/timeline;
- optional actions.

## 14.2 Asset Module

Three useful densities remain:

### Small

```text
thumbnail + title + checkbox
```

### Medium

```text
thumbnail + editable title + tags + notes + checkbox
```

### Expanded

Full metadata/actions.

Image/video portrait and landscape ratios remain meaningful.

## 14.3 Upload / Generate Station

Shared compound:

- upload;
- generate;
- drag/drop;
- progress;
- cancel;
- completion;
- asset handoff.

## 14.4 Video Selector

Canonical content:

```text
thumbnail
title
format
state
dropdown
```

---

# 15. Dropdown interaction contract

A dropdown is not certified because it looks correct.

It must:

- update the selected value;
- close intentionally;
- reopen with the new value;
- support keyboard navigation;
- display focus;
- expose selected state;
- support disabled state;
- keep menu geometry aligned with control geometry;
- avoid clipping inside shell boundaries.

The earlier Studio bug where choosing another option closed the menu but preserved the old value is specifically a regression to prevent.

---

# 16. Collapse control and motion

The established collapse/expand identity is the four-arrow / expand-shrink visual, not a generic new down-arrow substitute.

Canonical shell disclosure motion remains approximately:

- **600ms ease-out**;
- reduced-motion support required.

Micro feedback can remain faster.

Do not rewrite shell motion timing because a button animation uses ~180ms.

---

# 17. Accessibility contract

Mobile interactive targets should meet a **44px floor**.

The visual icon can be smaller than the hit region.

Require:

- visible focus;
- keyboard operation;
- correct native/ARIA semantics;
- labels for icon-only actions;
- selected state not communicated by color alone;
- reduced-motion support;
- mobile touch usability;
- no title truncation caused by optional controls.

Accessibility certification must include interaction, not only markup review.

---

# 18. Responsive composition rules

## Desktop

Prefer one-row control composition when space permits.

## Narrow desktop / tablet

Recompose rather than shrink controls below usable geometry.

## Mobile landscape

Preserve compact multi-column composition where it remains legible.

## Mobile portrait

Two-row composition is normal.

The key rule remains:

> module titles keep their established size and wrap rather than shrink.

Other remembered mobile laws:

- header toggle remains visible;
- content cannot be clipped at the top;
- large textareas retain intended relative proportions where possible;
- dropdowns must remain usable;
- section switches must actually switch content;
- phone modules use intrinsic height unless explicitly designed otherwise.

---

# 19. Grid equality rule

When adjacent desktop columns intentionally equalize:

```text
TOTAL COMPONENT HEIGHTS + GAPS + STROKES
must visually resolve across the paired columns
```

Do not fake equality with unconditional child `h-full` that later damages mobile layout.

The parent layout owns equalization.

---

# 20. Studio Hub as certification environment

Studio Hub Component Library is the Toolbox equivalent of the Widget Library.

Each primitive should be demonstrated in meaningful states:

```text
Default
Hover
Focus
Active
Selected
Disabled
Loading
Error
Success
Empty
Overflow
```

And representative layouts:

```text
Desktop
Narrow
Mobile landscape
Mobile portrait
```

The library demonstrates production primitives.

It must not become a second stylesheet with private geometry.

---

# 21. Required viewport certification matrix

At minimum:

```text
1440 desktop
1024 narrow desktop/tablet
768 tablet
430 portrait
390 portrait
375 portrait
320 portrait
phone landscape
```

The specific failure that started this wave must remain covered at approximately 390px iPhone width.

---

# 22. Screenshot verification workflow

A UI/CSS task is not finished at compile success.

Use:

```text
BUILD
-> TEST
-> RUN
-> CAPTURE
-> INSPECT SCREENSHOTS
-> FIX
-> REPEAT
```

After code changes, agents should verify:

- actual rendered title;
- action placement;
- touch areas;
- no horizontal overflow;
- no clipped border/shadow;
- no giant empty module space;
- dropdown behavior;
- focus states;
- neighboring-tool regressions.

---

# 23. Governance tests to preserve

The system should reject or flag:

- page-local fixed-pixel Toolbox header widths;
- page-local Toolbox title sizing;
- competing canonical header selectors outside approved files;
- unscoped `h-full` on ordinary stacked SubToolboxes;
- mobile ellipsis hiding allocation failure;
- global selectors that repaint unrelated primitives;
- duplicate shell geometry systems;
- arbitrary feature palette ownership;
- inaccessible interaction targets;
- visual-only dropdowns.

The tests introduced around PRs #468/#470 are architectural safeguards, not temporary regression tests.

---

# 24. Recent implementation receipts

## PR #468 — Fix Toolbox mobile responsive contract

Implemented:

- protected title slot;
- optional actions yield to secondary strip;
- Video Publisher compact header toggle;
- phone intrinsic SubToolbox sizing;
- responsive upload minimum behavior;
- `perf.css` removed from Toolbox geometry ownership;
- 44px mobile header-control targets;
- regression coverage.

## PR #470 — Harden cross-app responsive governance

Implemented:

- guard against fixed-width header action clusters;
- Media Analyzer equal-height behavior scoped to desktop breakpoint;
- Storyboard Studio equal-height behavior scoped to wide breakpoint;
- mobile intrinsic sizing protected by source structure, not only CSS specificity.

## PR #474 — SEO Generator canonical Toolbox migration

Implemented:

- `SEO GENERATOR` identity instead of duplicate `VIDEO PUBLISHER`;
- two `ToolboxHeaderToggle` controls;
- canonical inputs/textareas/upload target;
- canonical buttons/layouts/output cards;
- removal of legacy `StandardUploadBox` / `StandardTextArea`;
- removal of native page-local form/button styling;
- preservation of SEO generation, Brain state, Sheets export, Drive sync and ZIP behavior.

SEO Generator and Video Publisher remain separate tools until a deliberate capability-consolidation decision is made.

---

# 25. Migration philosophy

The system should standardize:

- shell;
- geometry;
- tokens;
- typography;
- palette inheritance;
- focus;
- accessibility;
- responsive behavior;
- primitive anatomy.

It should **not** make every Studio tool look functionally identical.

```text
uniform UI DNA
+
unique functional instrument
```

Comment Responder should still feel like Comment Responder.

Thumbnail Studio should still feel like Thumbnail Studio.

Video Director should still feel like Video Director.

---

# 26. Recommended continuation waves

## Wave A — Visual certification of the responsive stabilization

Run the viewport matrix against current `main`.

Re-score:

- Accessibility;
- Performance;
- Responsive;
- Theming;
- Implementation Integrity.

Do not claim 20/20 before visual evidence exists.

## Wave B — CSS ownership audit

Search for:

- `.vt-toolbox-title`;
- `.vt-subtoolbox-title`;
- `.vt-toolbox-header-actions`;
- canonical header variables;
- page-local mobile shell geometry;
- `!important` blocks that touch shared geometry.

Classify each result:

```text
CANONICAL
COMPATIBILITY
MIGRATE
REMOVE
```

## Wave C — Primitive migration of remaining live Studio tools

Prioritize tools that still contain:

- native buttons/inputs;
- old `Standard*` controls;
- hand-built toggles;
- hard-coded shell colors;
- page-local dropdown anatomy;
- duplicate result-card CSS.

## Wave D — Compound-component consolidation

Promote reusable media, asset, upload/generate, selector and output patterns into shared compounds.

## Wave E — Legacy retirement

Only after parity proof:

```text
harvest useful behavior
-> redirect consumers
-> remove obsolete imports
-> archive/quarantine donor
-> update docs/registry
-> delete dead CSS
```

---

# 27. Cross-application regression targets

At minimum, every major Toolbox CSS correction should be checked against:

- Video Publisher;
- SEO Generator;
- Studio Hub;
- Video Manager;
- Thumbnail Studio;
- Media Analyzer;
- Storyboard Studio;
- Projects;
- Creator Vault;
- Settings;
- Comment Responder;
- other ordinary SubToolbox consumers.

A shared fix is not complete if it works only in the page that originally exposed it.

---

# 28. Definition of done

A Toolbox / Studio UI change is complete only when:

- canonical primitive is used;
- functionality still works;
- selected state persists correctly;
- correct Toolbox hierarchy is preserved;
- CSS ownership is respected;
- palette authority is respected;
- desktop verified;
- narrow layout verified;
- 430px verified;
- 390px verified;
- 375px verified where relevant;
- phone landscape verified;
- no horizontal page overflow;
- no giant dead mobile vertical region;
- title is complete and readable;
- 44px mobile interaction targets are preserved;
- keyboard/focus behavior works;
- tests pass or branch-specific delta is explicitly proven;
- screenshots are captured and inspected;
- neighboring tools are regression-checked;
- canonical master/handoff is updated when system behavior changes.

---

# 29. Do not do these things

Do not:

- solve mobile overflow by shrinking module titles;
- add another bottom-of-file `!important` patch;
- restore Toolbox geometry to `perf.css`;
- hide allocation errors with ellipsis;
- introduce page-local fixed-width header action clusters;
- use unconditional `h-full` on stacked mobile modules;
- restart palette sequences arbitrarily;
- hard-code ordinary Toolbox identity colors;
- create a second "compact Toolbox" shell hierarchy;
- create a new control when a canonical primitive already exists;
- call a UI migration complete without rendering it;
- collapse SEO Generator into Video Publisher without a deliberate feature/ownership plan.

---

# 30. High-priority open work

1. Re-run the full visual audit and replace the 11/20 baseline with a documented post-fix score while preserving the baseline historically.
2. Capture the exact iPhone portrait failure case on current main and confirm the title/action repair visually.
3. Verify painted top/side/bottom clearance across ordinary SubToolboxes.
4. Continue removing feature-local `!important` geometry where it still exists.
5. Complete component-library state coverage for all canonical primitives.
6. Expand governance to catch new native controls in migrated Studio surfaces.
7. Audit portalized dropdown/popover palette bridging.
8. Verify four-arrow collapse icon consistency everywhere.
9. Audit live Studio tools for duplicate header-toggle implementations.
10. Keep Widget/Dashboard CSS and Toolbox/Studio CSS as sibling systems over the same foundation rather than letting either leak into the other.

---

# 31. Relationship to Widget / Dashboard architecture

The intended top-level relationship is:

```text
VIEWTUBE UI FOUNDATION
├── tokens
├── color
├── typography
├── accessibility
└── utilities

TOOLBOX / STUDIO UI
├── Toolbox shell
├── SubToolbox shell
├── Studio primitives
├── compounds
└── Studio certification

WIDGET / DASHBOARD UI
├── Widget shell
├── Widget primitives
├── signature instruments
└── Widget certification
```

The systems are siblings.

They share foundation principles but should not become one leaking selector namespace.

---

# 32. Agent handoff protocol

Before editing Toolbox UI:

1. read `docs/architecture/VIEWTUBE_TOOLBOX_UI_MASTER_RESOURCE.md`;
2. read `docs/handoffs/VIEWTUBE_TOOLBOX_UI_CSS_MASTER_HANDOFF.md`;
3. read this continuation handoff;
4. inspect current tokens/code/tests;
5. inspect Studio Hub Component Library authority;
6. search for an existing canonical primitive before inventing one;
7. write/regress a test before changing behavior;
8. change the canonical owner instead of adding another override;
9. render and inspect screenshots;
10. update the living documentation if the contract changed.

---

# 33. Authority reminder

This file exists to preserve the reasoning and implementation knowledge from the conversation.

It should help future work continue quickly.

It must **not** become another parallel design authority.

When in doubt:

```text
CURRENT MAIN CODE + TESTS
-> CANONICAL TOOLBOX MASTER RESOURCE
-> MASTER HANDOFF
-> THIS CONVERSATION HANDOFF
-> HISTORICAL / DONOR MATERIAL
```

That ordering is intentional.


---

# 34. Studio Controls consolidation continuation — 2026-10-30

Target branch: `master/consolidated-feature-integration`

Working branch: `studio-controls-system-consolidation-v2`

## Confirmed source contracts

- Five canonical tiers are `supreme`, `standard`, `compact`, `mini`, and `micro`.
- Mini is 20px high, 1.5px stroke, 3px radius, 17.5px type/icon.
- Micro retains the simplified 12px / 1px stroke / 2px radius / 10px type geometry.
- Generated size variables must be emitted from `src/studio-ui/tokens.ts`; hand-edited fallbacks must not become a second authority.
- Split text input now accepts the shared `StudioControlSize` type rather than a narrowed standard/compact union.
- Editable input/textarea focus text and glyph stroke must both resolve to black; default text and glyph stroke remain primary.
- The simple input must not retain a special focused-primary glyph-stroke exception.
- Text boxes retain black text, a primary inline inset stroke, black outer border, and secondary outline.
- The Confirmed Library Representatives section is intended to use a single full-width column.
- Vertical word-toggle handle overrides that forced a fixed 3px inset were removed so the primitive's measured word-bound geometry can own placement.
- Side-counter and counter number cells retain the 2:1 width/height contract; side-counter remains a separate family rather than nested in the counter family.

## Changes made on the continuation branch

- Added `scripts/audit/studio-controls-system-audit.test.mjs` and wired it into `test:studio-controls`.
- Corrected the Supreme/Mini size documentation in `StudioControls.tsx`.
- Corrected focused text stroke color for shared field rules and standalone text inputs.
- Removed the special simple-input focus rule that held glyph stroke primary while text fill turned black.
- Added Mini textarea typography coverage.
- Expanded split text input's size type to the canonical five-tier type.
- Aligned Micro token values and generated CSS with the 1px / 2px contract; removed a duplicate legacy Micro declaration and corrected remaining fallbacks.
- Removed competing vertical word-toggle handle inset overrides.
- Updated representative-module title matching so the full-width layout applies to the Representatives section.
- Consolidated split text input styling into one canonical stylesheet at `src/styles/studio-split-text-input.css`; the primitive imports it directly, the global entry no longer imports a duplicate, and the duplicate primitive-local stylesheet was deleted.
- Updated the catalog audit to verify the actual badge-shell + square-rail + primary-inset editable-field contract instead of the stale contradictory primary-border expectation.
- Corrected the disclosure audit so it tests the actual default state and explicit counter-family expansions rather than mistaking `open={defaultOpen || undefined}` for an always-open panel.
- Changed catalog family classification to fail closed: unknown items are surfaced in an explicit Unclassified family warning instead of silently falling into Compositions.

Pull request: `https://github.com/viewtube-dev/viewtube/pull/1232` (draft; replaces closed draft PR #1231). The release-gates workflow now runs `npm run test:studio-controls` in the focused-contracts job.

## Required verification still outstanding

The GitHub source-editing workflow did not provide a local checkout or a test runner. Do not report the new tests, generated-token parity, browser behavior, typecheck, or production build as passing until CI executes them.

Next steps:
1. Run the new audit and the existing Studio Controls suite in CI.
2. Repair any audit assumptions that do not match actual component exports.
3. Run browser geometry and interaction tests at all five sizes.
4. Verify split input typing/focus, field default/focus glyph colors, focus fade timing, counter ratios, toggle handle bounds, bar tooltip visibility, and outer-only double-side focus outline.
5. Finish the family-module/catalog coverage audit before deleting any obsolete primitive implementation.
6. Update this handoff with actual test and browser evidence before requesting merge.


---

# 35. Studio Controls contract reconciliation and CI follow-up — 2026-10-30

## Additional implementation and contract changes

- Reconciled Micro to the canonical 12px / 1px stroke / 2px radius / 10px type-icon / 0.65px focus-outline bundle. Updated the conflicting parity test and size documentation; Mini remains 20px / 1.5px / 3px / 17.5px.
- Split-left, split-right, and double-split badge labels now center against the complete outer shell. Rails are explicitly placed in their square grid columns and paint above the full-width label. Split text input is excluded and remains left-aligned/editable.
- Promoted counter value-area ratio and bar geometry into family tokens: STUDIO_COUNTER_NUMBER_TOKENS.valueAreaAspectRatio and STUDIO_BAR_TOGGLE_TOKENS (height/text 1:1, height/width 2.5:1, 2px radius, 50% white/primary empty fill, black full fill). The emitter generates the variables; system CSS owns the rules.
- Removed duplicate bar, arrow-stack, and double-side divider/focus geometry from the recovery stylesheet. The canonical system layer now owns those declarations.
- Counter and Side Counter now have ratio-derived shell widths: value width is 2× the inner control height (outer height minus two border strokes); Counter adds two square rails, Side Counter adds one, and the outer border strokes are added back. The value-area ratio and rail counts are canonical tokens; split-family CSS applies the family width exception after the global row-width default.
- Confirmed Double Split Word Counter keeps its solid primary face; removed the stale audit expectation for a 50%-white blend. The audit also rejects an arrow-toggle-specific 50% fill override.
- Removed the duplicate :root size ladder from studio-side-rail-unify.css. Side-counter and side-toggle rails now use the shared inner square rail size (control height minus two border strokes) and the global per-tier icon-stroke token; redundant per-tier SVG/divider overrides were removed.
- Added static regression checks for measured vertical word-toggle handle bounds, shared horizontal/vertical handle radius and side inset, shared side-arrow implementation, and outer-only double-side focus outline.
- Updated the three canonical Studio UI documents to remove stale Micro, counter, word-counter, split-input, and catalog-classifier requirements.
- Audited the requested retired library entries against the current target branch: StudioSearchInput, StudioSelectStandard, StudioChatActionGroup, Chat Action Group, Select Standard, and Designs Compilations are absent from the Confirmed Library and public Studio barrel. No corresponding dedicated implementation files exist to delete. Added a guard test so these entries cannot silently return.

## Latest CI evidence observed

- test:studio-component-grid-css passed.
- audit:confirmed-catalog passed after the split-input stylesheet and catalog fail-closed repairs.
- check:src-governance passed in the same run.
- A production build completed successfully in an earlier run on this branch.
- The existing focused regression step for counter/dropdown contracts passed after its stale word-counter fill expectation was corrected.
- test:studio-controls previously exposed a stale Micro parity expectation; the parity audit was updated to 1px / 2px / 0.65px. The latest full release-gates run is required to confirm the complete suite after that change and the additional outer-centering tests.
- audit:documents remains blocked by pre-existing competing ACTIVE document records for the P1 workstreams (four documents claiming the same execution-packet concern for each of several workstreams). These are outside the Studio Controls change set and need separate document-registry reconciliation.

## Remaining release requirements

1. Confirm the latest test:studio-controls, test:confirmed-library-layout, typecheck, production build, and full suite results.
2. Run browser measurements at all five sizes for badge label center coordinates, square rails, Counter/Side Counter 2:1 value regions, vertical word-toggle handle bounds, and InterModule full-bleed geometry.
3. Exercise split text input typing, cursor placement, focus/blur, and text/stroke transitions.
4. Verify bar tooltip focus visibility, empty/full bar colors, 2.5:1 geometry, and outer-only double-side focus outline.
5. Complete the public-export-to-family-module coverage check and dependency audit before deleting any retired primitive implementations.
6. Do not mark this PR merge-ready while release-gates checks remain pending/failing.

## 2026-10-30 follow-up — latest-target field and focus cleanup

- Replayed the remaining work on `studio-controls-system-consolidation-v5`, created directly from the latest `master/consolidated-feature-integration` head after a substantial target update. The new branch preserves the latest primitive-restoration plan, canonical UI docs, and catalog changes.
- Repaired the malformed textarea selector assertion and aligned audit coverage with the actual TextBox field owner and `StudioValueToggles.tsx` implementation.
- Removed duplicate editable-field and TextBox declarations from the recovery stylesheet so the recovery layer no longer competes with canonical field styling.
- Replaced hard-coded Standard and Compact floating-field focus widths with generated tier tokens.
- Made the Double Side Toggle center divider explicitly outline-free and shadow-free; the outer shell remains the focus owner.
- Updated vertical word-toggle audit assertions to match the actual multiline CSS declarations while retaining measured-handle and radius checks.
- Targeted static audit harness: 26 assertions passed across 20 fetched repository fixtures. This is not the repository Node/Vitest runner, a production build, typecheck, or browser verification.
- Required before merge: `npm run test:studio-controls`, `npm run typecheck`, `npm run build`, and browser/mobile verification.

## 2026-10-30 follow-up — latest-target field and focus cleanup

- Replayed the remaining work on `studio-controls-system-consolidation-v5`, created directly from the latest `master/consolidated-feature-integration` head after the target's primitive-restoration and catalog updates. Those target changes are preserved.
- Repaired the malformed textarea selector assertion and aligned audit coverage with the actual TextBox field owner and `StudioValueToggles.tsx` implementation.
- Updated the split-input geometry assertion to check the actual inner-rail width token rather than requiring a grid track that the current implementation no longer uses.
- Removed duplicate editable-field and TextBox declarations from the recovery stylesheet so the recovery layer no longer competes with canonical field styling.
- Replaced hard-coded Standard and Compact floating-field focus widths with generated tier tokens.
- Made the Double Side Toggle center divider explicitly outline-free and shadow-free; the outer shell remains the focus owner.
- Updated vertical word-toggle audit assertions to match the actual multiline CSS declarations while retaining measured-handle and radius checks.
- Targeted static audit harness: 26 assertions passed across 20 fetched source fixtures. This is not the repository Node/Vitest runner, a production build, typecheck, or browser verification.
- Required before merge: `npm run test:studio-controls`, `npm run typecheck`, `npm run build`, and browser/mobile verification.

## 2026-10-30 CI-driven repairs — split input, TextBox, and upload-frame CSS

- The first release-gates run exposed an invalid reduced-motion selector in the Studio Upload Frame block: two hover selectors ended with a comma and no declaration. Replaced it with a valid reduced-motion icon rule that suppresses the hover scale transform. This was the Lightning CSS production-build failure.
- The Confirmed Catalog audit and split-input geometry test still encoded the older transparent/inset-shadow field model. Updated them to the latest production primitive: badge-owned black perimeter, native input's primary border, 50% resting primary fill, 15% focused primary fill, black focused glyphs, and the shell-owned secondary focus outline.
- Restored the TextBox's permanent primary inset stroke in the canonical TextBox system rule (not the recovery layer), while retaining black glyphs and its always-present secondary outline.
- Updated the TextBox text-contract test to inspect the canonical system rule rather than requiring duplicate `!important` recovery declarations.
- Removed retired StudioSelect and StudioSearchInput from the parity audit's active representative list; corrected the Micro focus expectation to its own 0.65px token rather than Mini's 0.975px.
- The CI run that exposed the build and catalog failures also reported unrelated existing type errors in Brain/test files and P1 document-registry authority collisions. Those are not represented as Studio Controls fixes.
- The corrected branch is awaiting the next release-gates run; keep the PR draft until the real Node/Vitest checks and build confirm these repairs.
