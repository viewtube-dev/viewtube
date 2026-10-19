# ViewTube Widgets

**Status:** PROPOSED / CANONICAL WIDGET AUTHORITY TARGET  
**Authority:** Widget architecture and implementation guidance  
**Owner:** ViewTube Widget/Dashboard system  
**Created:** 2026-10-04 22:05:18 EDT  
**Source:** Widget UI governance conversation and current canonical documentation reconciliation  
**Canonical Location:** `docs/Widgets.md`

## Purpose

Define Widget-specific architecture and decision rules on top of the shared UI system. Shared visual primitives, tokens, and default layout sizes belong to `docs/UI.md`; Widget-specific ownership and composition rules belong here.

## 1. Existing system is the baseline

The Widget system already has production primitives, a UI Reference Library, a style/token system, and a default size system. This work does **not** create a replacement primitive system or a second Reference Library.

## 2. UI Reference Library relationship

The UI Reference Library contains/renders the actual production primitives and reusable components that visually represent the style, tokens, default sizes, states, and responsive behavior used by Widgets. It is a living visual reference implementation, not a parallel mock or static gallery.

## 3. Size model

Widget size definitions are **default sizes for building Widget layouts**, not hard component-size constraints. A production primitive or component can adapt to another size when the surrounding layout or interaction requires it.

## 4. Widget decision rule

For a Widget need, choose case-by-case: **fix the existing Widget**, **create a new Widget**, or **add a variant**. Avoid duplicates and local reimplementations when a canonical solution already exists.

## 5. Four audit classifications

- **CANONICAL** — correct use of the existing system.
- **DRIFT** — a canonical solution exists but is bypassed, duplicated, or misused.
- **DEFECT** — the existing system or implementation is inadequate and needs correction/evolution.
- **INTENTIONAL** — legitimate Widget-specific behavior or composition.

A DEFECT may be resolved by fixing an existing primitive/component, changing token/size behavior, adding a variant, creating a new primitive/component, or correcting the consumer, depending on evidence.

## 6. Composition and semantics

Shared primitives do not require identical Widget compositions. Widgets retain workflow-specific grouping, hierarchy, labels, and interaction sequences. Semantic/functionality takes precedence over superficial visual similarity.

## 7. Reference Library scope

The Library should represent foundational production primitives, reusable compound components, canonical shared patterns, and representative default/contextual/responsive states. It should not become a catalog of every Widget's private implementation. It is a special internal/reference surface, not a normal creator-facing Widget with independent product identity.

## 8. Audit method

Inspect both code and rendered behavior:

`source/code → tokens → primitive usage → composition → CSS/other overrides → rendered result`

Classify the result CANONICAL, DRIFT, DEFECT, or INTENTIONAL. Do not assume a Library/Widget disagreement automatically makes either side authoritative.

## 9. Current implementation status

These are **verified project/documentation decisions**. This conversation did not establish that every current Widget consumer already follows them.

Runtime alignment is currently **BLOCKED / UNKNOWN**: the previously referenced Widget implementation paths are not present on canonical `main`, and the preserved pre-migration snapshot also does not contain them. No production implementation should be reconstructed from documentation alone.

## Change Log

| Update ID | Conversation / Agent | Action | Time | Summary | Verification |
|---|---|---|---|---|---|
| DOC-20261004-019 | Widget UI governance conversation / GPT-5.6 Luna | CREATE | 2026-10-04 22:05:18 EDT | Established Widget-specific authority and four-way audit model without replacing the existing UI primitive system. | Repository authority and related UI/recovery documents inspected before creation; runtime alignment remained UNKNOWN. |
| DOC-20261004-020 | Widget source audit / GPT-5.6 Luna | AUDIT | 2026-10-04 22:12:28 EDT | Checked the previously referenced Widget runtime paths and both canonical main and the preserved pre-migration tree. | Named implementation paths are absent; runtime source authority remains BLOCKED / UNKNOWN. |


## Recovered implementation source

The Widget runtime implementation has been located in `themotionvisual/ViewTubeBUILD/main`. This repository is currently treated as a **recovered implementation source**, not automatically as the canonical target for `viewtube-dev/viewtube/main`.

The recovered source contains the previously referenced Widget primitives, primitive extensions, primitive-system token API, primitive CSS layers, Widget UI Reference Library, Studio Hub primitive migration catalog, palette authority, and Widget tests.

**Canonical-source decision: UNKNOWN pending repository/history/deployment reconciliation.**

Until that decision is made, do not copy or rewrite production Widget code into `viewtube-dev/viewtube/main` merely to satisfy the documentation model.
