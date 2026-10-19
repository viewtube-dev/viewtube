# ViewTube Round 2 UI / Render Reconciliation — 2026-10-04

**Target repository:** `viewtube-dev/viewtube`
**Base:** current `main`
**Round:** 2
**Status:** RECONCILED / IMPLEMENTATION BLOCKED BY MISSING CANONICAL UI SOURCE
**Provenance:** Round 1 recovery handoff + direct inspection of current canonical `main` + direct Render workspace inspection

## Executive result

Round 2 confirms that the recovered Dashboard/UI conversation should **not** be promoted as a second UI authority or copied wholesale into the canonical repository.

Current `main` already contains canonical/proposed authority documents for:

- UI and design-system rules: `docs/UI.md`
- Toolbox/SubToolbox architecture: `docs/Toolbox.md`
- cross-system architecture: `docs/Architecture.md`
- Studio Hub architecture: `docs/Studio-Hub.md`
- Studio Hub master tool architecture: `docs/product/VIEWTUBE_STUDIO_HUB_MASTER_TOOL_ARCHITECTURE.md`
- Toolbox Component Library Plan: `Toolbox Component Library Plan`

The recovered conversation therefore supplies **recovery evidence, audit findings, implementation requirements, and verification rules**, not a replacement architecture.

## 1. Current canonical-main findings

Direct inspection of the current `main` tree confirms a documentation-heavy repository state with the following relevant authorities already present.

### UI authority

`docs/UI.md` already records the important recovered decisions:

- the UI Reference Library is intended to contain actual primitive/reference representatives;
- it represents visual style, design tokens, component system, and default sizes;
- the size system defines default widget-layout sizes;
- primitives/components may adapt to other sizes;
- widget decisions follow **fix existing → create new → add variant**, depending on the situation;
- Toolbox/SubToolbox should consume the shared UI system rather than become an independent visual system.

### Toolbox authority

`docs/Toolbox.md` already records:

- Toolbox vs SubToolbox hierarchy;
- widgets as reusable compositions;
- shared primitives/components/styles/tokens/default sizes;
- the same fix/create/variant rule;
- separation between Brain capabilities and Toolbox controls;
- a reusable tool contract;
- compatibility/export concerns as reconciliation work.

### Architecture authority

`docs/Architecture.md` already establishes:

```
Account / Identity
        ↓
Context
        ↓
AI Brain
        ↓
UI + Toolbox
        ↓
Analytics / Projects / Studio Hub / Vault / Editor
```

It also explicitly states that current verified implementation outranks plans/recovery notes and that recovery artifacts do not prove implementation.

### Studio Hub authority

The repository already contains Studio Hub architecture documents and a canonicalization model for tool proposals. New UI work should attach to those authorities rather than invent a second Studio Hub architecture.

## 2. Dashboard implementation status

The current canonical `main` tree inspected during Round 2 does **not** establish the detailed Dashboard implementation described in the recovered conversation as canonical runtime code.

Therefore:

**Dashboard implementation status = UNKNOWN / NOT VERIFIED ON CANONICAL MAIN**

The recovered Dashboard implementation details remain valuable as a design/implementation candidate, but they must be treated as source evidence until corresponding runtime code is found and verified.

Do not describe the recovered Dashboard implementation as shipped, live, or canonical.

## 3. UI modernization requirements retained from recovery

The following remain valid implementation requirements to reconcile against actual runtime code:

1. Search and reuse existing primitives/components before creating new ones.
2. Preserve the UI Reference Library as the visual representative of the design system.
3. Keep the hierarchy:
   `tokens → foundations → primitives → components → composites → layouts → widgets → dashboard → product`.
4. Consolidate token sources rather than adding parallel token systems.
5. Define a reusable widget contract.
6. Treat default sizes as layout guidance, not rigid component limits.
7. Provide responsive behavior deliberately.
8. Include accessibility and keyboard/focus behavior.
9. Add performance and rendering considerations.
10. Add visual regression/evidence requirements.
11. Preserve Toolbox/SubToolbox compatibility.
12. Use the widget decision rule: fix existing, create new, or add a variant according to the actual need.

## 4. Recovered system-improvement backlog

The recovered conversation proposed ten improvements that should become implementation/audit capabilities only after mapping them to existing repository authorities:

1. component dependency graph;
2. UI duplication detector;
3. design-token drift audit;
4. UI state matrix;
5. density system;
6. responsive behavior matrix;
7. visual evidence requirement;
8. component migration receipt;
9. UI change impact map;
10. living UI system master resource.

These are **proposed capabilities**, not verified existing runtime systems.

Before creating documents for them, search the repository for existing equivalents and consolidate where possible.

## 5. Render boundary

Render workspace inspection identified the accessible service:

- service: `viewtube-main-preview`
- service ID: `srv-davin39srm7s73c5ljmg`
- repository: `https://github.com/cbrewsterthegreat/ViewTube`
- branch: `main`
- URL: `https://viewtube-main-preview.onrender.com`
- build: `npm run build`
- start: `npm run preview -- --host 0.0.0.0`

Recent deployments observed in the Render workspace were build-failed:

- `dep-davskv3tqb8s73fon8hg` — `bdf80ca0922aecd69bb37429e79f6b5e3ee19b76`
- `dep-davs260ae00c73dtu8v0` — `9eabd247c30dd8a45b56e3f164bb4cdaafa71e94`
- `dep-davru5dg1s2s7381om6g` — `914eaf0d8ca25d916a8b7db5e37b9cc6e7a11457`

### Authority rule

This Render service is **not** a canonical deployment for `viewtube-dev/viewtube`. It points to the historical `cbrewsterthegreat/ViewTube` repository.

Therefore Render evidence from this service may be used to recover historical failures, but it must not be used to claim that canonical `viewtube-dev/viewtube` is deployed or working.

The user also explicitly established that `viewtube.live` is not repository-connected. It is excluded from repository/runtime verification.

## 6. Historical code-recovery boundary

Direct GitHub access to `cbrewsterthegreat/ViewTube` was not available through the connected GitHub repository interface during this Round 2 pass.

Consequently:

- historical Render metadata is retained;
- historical PR/code claims remain provenance-tagged evidence;
- historical implementation cannot be copied into canonical `main` without independently recovering the source;
- no historical PR is promoted to canonical implementation based solely on prior conversation claims.

## 7. Correct implementation path

The next implementation pass should use a **fresh short-lived feature branch from current canonical `main`**.

Before modifying runtime code:

1. inventory the actual current `src/` implementation;
2. identify whether Dashboard/Toolbox/UI runtime code exists outside the current documentation-heavy tree;
3. locate the current primitive/component/token/reference-library sources;
4. map them against `docs/UI.md` and `docs/Toolbox.md`;
5. identify only the smallest missing implementation slice;
6. write/extend tests before behavior changes;
7. implement the smallest verified batch;
8. run build/tests/type checks;
9. capture visual evidence where UI is changed;
10. update the relevant canonical document only when implementation evidence warrants it.

## 8. Reconciliation decision

**Do not merge Round 1 PR #5 as-is.**

Reason: that branch is substantially behind current `main` and exists primarily as a Round 1 evidence package. Its information is now being reconciled against newer canonical-main authorities.

Round 2 should produce a smaller, current-main-based contribution rather than rebasing/overwriting the old recovery branch.

## 9. Final state

### Verified

- `viewtube-dev/viewtube` is the canonical repository.
- Current `main` contains UI, Toolbox, Architecture, and Studio Hub authority documents.
- The recovered UI decisions substantially overlap those existing authorities.
- The accessible Render service points to `cbrewsterthegreat/ViewTube`, not canonical `viewtube-dev/viewtube`.
- `viewtube.live` is excluded as repository evidence.

### Recovered but not implementation-verified

- detailed Dashboard implementation;
- historical Toolbox implementation claims;
- historical compatibility fixes attributed to prior PRs;
- the ten proposed UI-system improvement capabilities.

### Next implementation gate

**Current canonical runtime source discovery → component/token/reference-library inventory → smallest UI implementation slice → tests → visual verification → PR.**
