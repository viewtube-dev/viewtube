# Vault Phases 0–2 Target-Branch Reconciliation

**Date:** 2026-11-11  
**Repository:** `viewtube-dev/viewtube`  
**Implementation target:** `fix/studio-controls-regression-recovery-2026-10-31`  
**Target head inspected:** `d237d97b576ef30e1bb398b8be4194cd9712a46d`  
**Audit branch disposition:** `audit/vault-product-clarity-2026-11-11` is not merged; it is 5 commits ahead and 136 behind this target and must not be merged wholesale.  
**Audit type:** static source and task-ledger inspection; no local runtime or browser certification.

## Executive result

The 10-31 recovery branch is now the authoritative target for this Vault work. The earlier audit branch was created against a different target and is substantially divergent. Its documents were treated as planning input only; no merge or ref movement was performed.

The target branch already contains meaningful Library-first UX work: workspace layout controls are in a modal, Library search and filters have dedicated toolbar/drawer surfaces, batch/group/handoff actions are selection-dependent, and asset cards prioritize media previews. These existing implementations should be completed and certified, not replaced with a second Vault shell.

The requested phases are **not all complete**. Phase 0 source reconciliation is complete, but executable baseline checks are blocked by the lack of a local repository shell. Phase 1 has verified source-level progress but still needs responsive/browser certification and remaining UX task completion. Phase 2 has a capability registry and adaptive host, but the host currently presents capability labels/status rather than routing every capability to a real operation. The gap is recorded below rather than being marked complete.

## Phase 0 — reconcile current truth

### Verified target facts

- `/vault` is mounted through `AppRoutes.tsx` to `CreatorVaultOS`.
- Canonical asset search and identity remain in `src/services/vaultAdapter.ts`; the adapter stores asset metadata in browser localStorage. This is not proof of server durability.
- `CreatorVaultOS.tsx` imports the canonical Studio Controls and SubToolbox systems, the canonical Vault adapters/services, project handoff services, and the existing Vault deep-link resolver.
- `src/services/vaultAssetDeepLink.ts` is the actual resolver path on this branch. The earlier audit's reference to `resolveVaultAssetDeepLink.ts` was a filename error; do not create that duplicate.
- `src/services/brain/BrainVaultAdapter.ts` is read-only and permission-gated, but currently emits the stale generic route `/reference-studio/toolbox-system`.
- `src/services/brain/phaseOneIntegration.ts` already registers Vault routes and describes the existing Vault adapter as a Brain source. This binding must be reconciled with the real `/vault` resource deep-link contract; it is not evidence that all Brain actions are implemented.
- `package.json` defines `test`, `typecheck`, `build`, `check:src-governance`, and `test:vault-operation-store`. None was executed in this environment.

### Branch reconciliation

The prior audit branch compares as 5 commits ahead / 136 behind this target. Do not merge it wholesale, cherry-pick its branch history, or move the requested target ref. Apply only individually reviewed findings that are valid against the 10-31 source.

### Phase 0 exit status

- [x] Exact requested target branch identified and read.
- [x] Relevant Vault, Brain, route, capability and test sources inspected on that branch.
- [x] Existing resolver filename corrected.
- [x] Divergent audit branch rejected as a merge source.
- [ ] Focused tests, typecheck, build, lint and architecture checks executed on the exact target head.
- [ ] Baseline browser screenshots and interactions captured on desktop, mobile portrait and mobile landscape.

**Status: source reconciliation complete; executable baseline blocked.**

## Phase 1 — Library-first UX and plain-language clarity

### Existing source work verified

- Workspace settings are opened through a dedicated “Workspace” action and rendered in a modal dialog, not as a normal page-flow configuration module.
- The Library toolbar owns search, navigation and filter entry points.
- Library navigation and filters are opened as separate contextual surfaces; their triggers close the other surface to avoid overlapping drawers.
- Selection-dependent batch, Group Builder and “Send to ViewTube…” actions render only when there is a selection and the corresponding mode is active.
- External handoffs are visibly grouped under “Send to ViewTube…”.
- Asset cards use the shared `VaultAssetModule` with media preview, title and compact metadata.
- Existing layout preferences and workspace state are preserved through `vaultWorkspaceState`.

### Remaining Phase 1 work

- Complete the existing RH-UX120–146 tasks against this exact branch; do not duplicate their task IDs.
- Verify whether Navigator/Explorer legacy modules remain visible or are only persisted migration IDs; remove only after tracing all handlers and migration behavior.
- Review first useful Library content placement and the desktop 3-column / mobile 1-column composition in a real browser.
- Verify the list view's bounded horizontal overflow behavior, all filter states, focus management, touch targets, and drawer/sheet dismissal.
- Finish media-first card density, idle Task Center, contextual Inspector and all module row-packing requirements.
- Capture exact-commit desktop, portrait and landscape screenshots; run the existing UI audit workflow.

**Status: substantial source implementation present; not visually certified or complete.**

## Phase 2 — capability discoverability and truthful states

### Verified current capability model

- `src/features/vault-workbench/capabilities.ts` declares the capability IDs for inspect, organize, compare, image edit, video/audio process, metadata edit, lineage, archive, delete and send-to.
- Eligibility is explicitly documented as a UI hint, not a server authorization boundary.
- Video and audio processing default to unavailable unless their processor availability is explicitly true. The page currently passes `false` for both, with an explanatory unavailable reason.
- `VaultAdaptiveWorkbenchHost.tsx` displays modes and capability labels, disables modes without registered capability entries, and exposes availability/reason through labels and titles.
- The host does not currently execute capability actions: capability entries are rendered as status spans, not action controls connected to operation handlers.
- Existing page-level actions (metadata editing, archive/trash, compare, import, transcript, task retry, project handoff and specialist workbench operations) are implemented elsewhere in `CreatorVaultOS` and its canonical services. They need a complete inventory and mapping before any duplicate action surface is added.

### Phase 2 gaps

1. Create a source-backed map from every visible Vault action to its handler, service, permission/policy check, output/receipt, recovery path and test.
2. Decide which existing page actions should be surfaced as capability entries and which should remain contextual controls owned by their current module.
3. Do not turn the adaptive host's status chips into fake buttons. A capability becomes actionable only when it has a real callback/operation contract and a regression test.
4. Keep processor-dependent capabilities unavailable until a real processor and durable result path are verified.
5. Add focused tests for capability eligibility, truthful unavailable reasons, selection compatibility and the absence of fake execution claims.
6. Verify the UI explains prerequisites, consequences, destination and recovery in plain language.

**Status: registry and truthful processor defaults exist; end-to-end capability discoverability/action mapping remains incomplete.**

## Architecture and safety decisions

- Keep one canonical Vault asset identity and adapter.
- Keep Projects/ContentBuild, Asset Engine, BrainRuntime, ActionPacket/Handoff and specialist media processors in their existing ownership boundaries.
- Brain retrieval remains read-only and permission-gated. Brain mutations remain proposal-first and require existing approval/receipt contracts.
- Do not introduce a second asset registry, Brain index, operation store, project store, capability registry, processor or Studio primitive system.
- Do not claim localStorage is cloud-durable.
- Do not claim video/audio processing is available while the page reports processor availability as false.

## Required verification before declaring Phases 0–2 complete

Run from a checkout of this exact branch and record outputs:

```bash
npx vitest run src/views/CreatorVaultOS*.test.ts src/services/__tests__/vaultBrainSearch.test.ts
npm run test:vault-operation-store
npm run typecheck
npm run check:src-governance
npm run build
```

Then run changed-file lint, keyboard/accessibility review, and desktop/mobile portrait/mobile landscape browser checks. The above commands and browser checks were not run during this static audit.
