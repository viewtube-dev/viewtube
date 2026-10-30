# Toolbox UI Domain Change Review

**Scope:** Toolbox, Subtoolbox, Studio Hub components/primitives, hierarchy, layout, responsive behavior, state, accessibility, certification and related UI systems.

**Global conversation continuity authority:** [Conversation Handoffs](../../governance/CONVERSATION_HANDOFFS.md). This file is a Toolbox-specific review extension, not a separate conversation handoff, work log, task ledger or cross-agent status system.

## When to use this extension

Use this review for any material change to Toolbox UI authority or production behavior. For ordinary bounded changes, update the canonical Toolbox master and its living update log. Create or update a global conversation-intake package when the global handoff triggers apply: long/repetitive context, owner/phase change, unfinished work requiring resumption, substantial multi-agent work, or explicit user request. The global package captures all meaningful conversation work, not only Toolbox work.

## 1. Audit the relevant domain work

Review relevant code edits, commits, branches, PRs, merge state, screenshots, regressions, fixes, component/primitive/token/CSS/layout/mobile changes, states, accessibility, Reference Library work, tests, legacy code, architectural decisions and implementation lessons. Ignore unrelated work unless it materially affects Toolbox authority.

## 2. Classify domain findings

Use: `CANONICAL`, `IMPLEMENTED`, `VERIFIED`, `MIGRATE`, `LEGACY COMPATIBILITY`, `EXCEPTION`, `PLANNED`, `SUPERSEDED`, `REMOVE`, `REGRESSION / OPEN ISSUE`.

Never promote a prototype, screenshot, temporary patch or feature-local CSS rule to CANONICAL without explicit system-level acceptance.

## 3. Record code evidence

When available record repository, source/target branch, PR, commit, merge state, files, components, primitives, selectors, tokens, recipes, tests, previous/new behavior, affected pages, desktop/mobile verification, open/closed verification, connected/disconnected verification, loading/empty/error verification and regression risk.

Distinguish implemented locally, committed, in a PR, merged, present on target, integrated and verified. Unknown lineage remains UNKNOWN.

## 4. Check current authorities

Inspect current target-branch code before making production claims. The current code/tests and canonical Toolbox authority outrank old conversation notes. Level owns height, stroke, radius, shadow, typography scale and structural spacing. Component type owns internal anatomy and behavior. Base rhythm is 4px. Connection/data states remain separate: `DISCONNECTED != EMPTY`, `DISCONNECTED != ERROR`, `DISCONNECTED != MISSING UI`.

## 5. Reference Library certification

Required chain:

`TOKENS -> CODED PRIMITIVE -> UI REFERENCE LIBRARY EXAMPLE -> PRODUCTION CONSUMER`

If code changed without the library, mark `REFERENCE LIBRARY UPDATE REQUIRED`. If the library outruns production, mark `REFERENCE ONLY / NOT YET PRODUCTIONIZED`. Mark `CERTIFIED` only when code/library behavior and required states/variants are actually tested.

## 6. Motion

Verify Toolbox, Subtoolbox, Widget, Dropdown and other disclosure motion independently. Never assume one global duration. If code and documentation disagree, record `MOTION AUTHORITY CONFLICT — REQUIRES RECONCILIATION`.

## 7. Update the domain authority

Append one concise row to the Toolbox master’s living update log for every system-level update. Update only affected authority, component registry, decision log, page/tool status, certification ledger and domain-specific unfinished work. Preserve history; mark obsolete rules SUPERSEDED instead of silently deleting them.

This domain log is a projection of Toolbox-specific changes. It does not replace the global conversation worklog or duplicate the complete user-instruction register.

## 8. Global handoff and reconciliation

When a global handoff trigger applies, create/update exactly one package at `tasks/conversation-intake/<conversation-id>/` with:

- `handoff.md` — concise, resumable living log and one checkbox per distinct user instruction/unfinished action;
- `worklog.json` — structured record of all meaningful planned, completed, partial, blocked, abandoned and discovered work;
- `review.md` — evidence-based reconciliation against current repository truth and canonical destinations.

Use the global update phrase **“Update the unfinished work log.”** to update the existing package in place. Do not create a Toolbox-specific parallel handoff package for the same conversation.

After capture, run the global reconciliation skill/process. Record domain findings and evidence in the global package; promote only accepted Toolbox-specific decisions into this master and related domain registries.

## 9. Domain contribution summary

For a material Toolbox pass, the domain-specific summary should identify:

1. important Toolbox findings;
2. master/registry changes;
3. code/document alignment;
4. UI Reference Library alignment;
5. genuine unfinished Toolbox work;
6. repository/PR/verification evidence;
7. the next safe domain action.

The complete conversation handoff remains governed by `docs/governance/CONVERSATION_HANDOFFS.md`.

## Preservation rules

Inspect current target before repository claims or writes. Do not confuse PR state with target-branch presence, prototypes with production, documentation completion with application migration, or feature-local CSS with system authority. Do not duplicate canonical primitives, silently reconcile conflicting geometry/motion, or remove working behavior merely to normalize appearance. Keep Widget/Editor/Analytics CSS ownership separate from Toolbox authority.
