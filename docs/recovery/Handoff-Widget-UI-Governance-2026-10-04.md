# Widget UI Governance Conversation Handoff — 2026-10-04

**Status:** VERIFIED PRESERVATION / RUNTIME ALIGNMENT UNKNOWN  
**Source:** Current ChatGPT conversation  
**Canonical repository:** `viewtube-dev/viewtube`  
**Canonical branch:** `main`

## Purpose

Preserve the substantive Widget/UI governance decisions and implementation-direction discoveries from this conversation without creating a competing UI authority.

## Material knowledge preserved

### Documentation/workflow direction

The preferred ViewTube operating loop established in the conversation is:

`documentation governance → registry → architecture → task → code → verification → evidence → authority update`

Planning should guide implementation rather than become the center of work. Existing authorities, tasks, primitives, and plans should be reused/consolidated before new systems are created.

### Widget UI system

The existing Widget system already has production primitives and a UI Reference Library. The Library is intended to contain/render the actual production primitives and serve as the visual representative of the style, token, default-size, state, and responsive system used by Widgets.

The conversation rejected rebuilding the Widget primitive system or creating another Reference Library.

### Size model

The Widget size system provides **default sizes for building Widget layouts**. Components and primitives can adapt to other sizes. A contextual size is therefore not automatically an error or a new component.

### Widget change rule

For a Widget need, choose situation-dependently:

- fix the existing Widget;
- create a new Widget;
- add a variant.

### Audit classifications

The user approved exactly four:

- CANONICAL
- DRIFT
- DEFECT
- INTENTIONAL

When something is a DEFECT, the solution is situation-dependent: fix an existing primitive/component, add a variant, create a new primitive/component, correct a token/size behavior, or fix the consumer.

### Reference Library behavior

The Library should use actual production primitives/components, show canonical visual behavior, demonstrate default and representative contextual/responsive sizing, include reusable primitives/compound components/patterns, avoid becoming a gallery of every Widget's private internals, and remain a special internal/reference surface rather than a normal creator-facing Widget.

The Library validates shared primitives; it does not by itself certify every Widget.

### Audit method

A meaningful audit must inspect both source and rendered UI:

`source/code → tokens → primitive usage → composition → overrides → rendered result`

Disagreement between Library and Widget output must be investigated rather than automatically assigning authority to either side.

## Repository reconciliation

Existing canonical `docs/UI.md` owns the shared UI Reference Library, tokens, and size-system subject and was extended with these decisions.

`docs/Widgets.md` was named as the canonical Widget target by `docs/Organization.md` and `docs/Index.md` but was absent on main; it was created as the Widget-specific authority.

No destructive cleanup or superseding of historical UI artifacts was performed.

## Verified vs unknown

**Verified:** the documentation decisions above; existence of current UI/recovery authorities; canonical main as working source of truth.

**Unknown:** complete runtime alignment of all Widget consumers; exact current source paths for every primitive/token/size/CSS/Library relationship; current visual certification state of all Widgets.

## Next actions

1. Trace canonical Widget primitive sources and token/size definitions.
2. Trace UI Reference Library imports/implementations.
3. Audit representative Widget consumers.
4. Classify discrepancies CANONICAL / DRIFT / DEFECT / INTENTIONAL.
5. Implement only evidence-backed corrections.
6. Verify rendered UI and tests before claiming implementation completion.
