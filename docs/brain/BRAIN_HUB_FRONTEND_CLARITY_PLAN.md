# Brain Hub Frontend Clarity Plan

**Date:** 2026-10-23  
**Target base:** `master/consolidated-feature-integration`  
**Implementation branch:** `fix/brain-hub-mobile-clarity`  
**Scope:** presentation-only recovery; no new Brain capabilities or backend/evidence-store changes.

## Contract

The chat surface has one clear primary focus: the creator's conversation. Context remains available but compact. Diagnostics, evidence lineage, readiness lists, and learning metadata stay on demand rather than competing with the answer.

### P0 — Mobile layout and truthful context

- Context actions must never squeeze their labels into unreadable fragments. On narrow screens, actions stack; at wider widths they share a row. Labels describe the action ("Clear selection", "Clear project"), use canonical Studio buttons, and wrap safely.
- Long project and selection labels truncate at a word-safe visual boundary with the full value available through the existing title/accessible label.
- Runtime summary must use creator-facing language. A fallback trace is presented as "Using channel-wide fallback"; project and build context are separate, explicitly labelled fields.
- Keep the actual underlying trace/runtime state intact. Do not convert unavailable state into success.

### P1 — Progressive disclosure

- Learning receipts are collapsed by default. The compact header says "Learning saved"; the existing receipt content and review actions remain available when expanded.
- Evidence/readiness details remain disclosure-controlled. Empty evidence and diagnostics should not be rendered as prominent default-view panels.
- Technical identifiers, detailed scope/category, quality diagnostics, and evidence lineage belong in expanded details, not in the default answer hierarchy.

### P2 — Creator language and empty states

- Prefer calm actionable language such as "No project", "No response yet", and "Connect a channel to unlock performance advice".
- Do not show raw internal mode names, ledger/manifest terminology, UUIDs, or empty quality/evidence sections in the default view.
- Keep feedback, learning review, and tool handoffs secondary to the answer.

### P3 — Regression guardrails

- Test narrow context-action layout and full action labels.
- Test long context-label truncation and accessible title/label retention.
- Test fallback status wording and explicit project/build labels.
- Test learning receipt disclosure defaults.
- Before marking visually certified, capture mobile screenshots and verify keyboard focus, virtual-keyboard composer geometry, horizontal overflow, scroll behavior, and browser console.

## Implementation checkpoint

- [x] Stack context actions below 480px and use full action labels.
- [x] Truncate long project/selection labels without removing their full title/accessible label.
- [x] Replace raw fallback mode with creator-facing runtime status text and separate project/build labels.
- [x] Collapse learning receipt details by default.
- [x] Add source-contract regression assertions for the above.
- [x] Summarize readiness as one creator-facing line; mount the diagnostic list only after the creator expands it.
- [ ] Run focused Vitest contract, Studio Controls tests, typecheck, and production build on the PR head.
- [ ] Browser-certify narrow phone, landscape, desktop, keyboard navigation, and virtual-keyboard states.

**Verification status:** Source changes and test assertions have been authored. Automated tests/build and browser visual checks have not yet been executed in this environment; this document does not claim certification.
