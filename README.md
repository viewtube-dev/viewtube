# ViewTube Priority-25 Frontend Package — branch + PR kit

Everything in this single folder is the complete frontend build-out for the 25 candidates in
`docs/product/VIEWTUBE_HIDDEN_CAPABILITIES_RESOURCE_AND_ROADMAP.md` of
[viewtube-dev/viewtube](https://github.com/viewtube-dev/viewtube), flattened into one directory so it
can travel as one zip. Systems **1 (Channel Intelligence Engine)** and **2 (Evidence-Connected AI
Brain)** are fully implemented (pure cores + page UI + tests); the other 23 are consistent scaffolds.

- **Where each file goes:** see [`MANIFEST.md`](MANIFEST.md) — flat filename → repository path.
  Naming rule: the flat name is the repo path with every `/` replaced by `__`
  (e.g. `src__features__capabilities__registry.ts` → `src/features/capabilities/registry.ts`).
  Two special cases: `SCAFFOLD-README.md` is the scaffold's own `README.md`, and
  `ROADMAP-REFERENCE.md` / `MANIFEST.md` / this file / `restore-to-repo.sh` are package-only.
- **Verified before packaging:** typechecked against the repo's exact `tsconfig.app.json` +
  dependency stack (React 19, react-router-dom v7, Tailwind v4, Vite), and **11/11 vitest tests
  pass** for the two implemented systems. The only tsc error in isolation is intentional:
  `src/app/capabilitiesRoutes.tsx` imports the repo's own `src/app/lazyRoute.tsx`, which resolves
  the moment the files sit inside the repo.

---

## 1. Contents overview

| Group | Files (flat names in this folder) |
|---|---|
| Shared capability infra | `src__features__capabilities__registry.ts`, `...__CapabilityHub.tsx`, `...__shared__asyncCapabilityStore.ts`, `...__shared__CapabilityPageShell.tsx`, `...__shared__FlagGate.tsx`, `...__shared__AsyncStateView.tsx`, `...__shared__EvidencePanel.tsx`, `...__shared__brainContracts.ts`, `...__shared__capabilityAdapter.ts` |
| Flags + routing + API | `src__flags__featureFlags.ts`, `src__app__capabilitiesRoutes.tsx`, `src__app__pageRegistry.capabilities-snippet.ts`, `src__api__client.ts` |
| System 1 — Channel Intelligence Engine (full) | `src__features__capabilities__channel-intelligence-engine__*` (core `channelIntelligence.ts`, page, hook, API, `channelIntelligence.test.ts`, index) |
| System 2 — Evidence-Connected AI Brain (full) | `src__features__capabilities__evidence-connected-brain__*` (core `evidenceLink.ts`, page, hook, API, `evidenceLink.test.ts`, index) |
| Scaffolds 3–25 | `src__features__capabilities__<slug>__*` for: ai-video-editor, shorts-vertical-modes, veo-video-generation, metadata-refinement, thumbnail-upload-reuse, ranked-tag-analysis, transcript-language-tools, caption-subtitle-management, kpi-time-window-controls, csv-document-analytics, cross-video-comparison, evidence-quality-validation, opportunity-discovery, channel-information-management, public-channel-resolution, project-state-resume, cross-tool-handoffs, subscriber-api-dispatch, hidden-tools-pages, advanced-studio-controls, feature-discovery-registry |
| Package-only | `README.md` (this file), `MANIFEST.md`, `restore-to-repo.sh`, `ROADMAP-REFERENCE.md`, `SCAFFOLD-README.md` (the scaffold's own readme, restored to `README.md`) |

## 2. Exact git commands (new branch off the consolidated master, restore, verify, PR)

Run from the folder containing this README. Base branch and repo are confirmed on the remote.

```bash
# 0) Inputs (confirmed via git ls-remote on 2026-10-29)
REPO="https://github.com/viewtube-dev/viewtube.git"
BASE="master/consolidated-feature-integration"          # the master consolidated branch
BRANCH="feat/priority25-frontend-scaffolds"             # your new branch
PKG_DIR="$(cd "$(dirname "$0")" && pwd)"                # this folder

# 1) Clone (or reuse an existing checkout) and create the branch off BASE
git clone "$REPO" viewtube && cd viewtube
git checkout -b "$BRANCH" "origin/${BASE}"
# if the branch isn't fetched yet: git fetch origin "$BASE" first

# 2) Restore every packaged file to its repository path (per MANIFEST.md)
bash "$PKG_DIR/restore-to-repo.sh" "$PKG_DIR"

# 3) Wire the two integration points (details in the restored README.md)
#    a) src/app/AppRoutes.tsx — add inside your <Routes> tree:
#         import { CAPABILITY_ROUTES } from "./capabilitiesRoutes"
#         {CAPABILITY_ROUTES}
#    b) src/app/pageRegistry.ts — paste the entries from
#       src/app/pageRegistry.capabilities-snippet.ts (defaults: hidden + lab)

# 4) Verify
npm install
npm run typecheck          # capabilitiesRoutes' lazyRoute import now resolves in-repo
npx vitest run \
  src/features/capabilities/channel-intelligence-engine/channelIntelligence.test.ts \
  src/features/capabilities/evidence-connected-brain/evidenceLink.test.ts   # 11 tests
npm run check:routes       # governance test after the pageRegistry paste

# 5) Commit and push
git add src/flags/featureFlags.ts src/api/client.ts src/app/ src/features/capabilities/
git commit -m "feat(capabilities): Priority-25 frontend scaffolds; systems 1-2 fully implemented"
git push -u origin "$BRANCH"

# 6) Open the PR against the master consolidated branch
gh pr create \
  --base "$BASE" \
  --head "$BRANCH" \
  --title "feat(capabilities): Priority-25 frontend scaffolds (systems 1-2 fully implemented)" \
  --body "Implements the frontend for docs/product/VIEWTUBE_HIDDEN_CAPABILITIES_RESOURCE_AND_ROADMAP.md. Items 1 (Channel Intelligence Engine) and 2 (Evidence-Connected AI Brain) are fully implemented (pure cores + page UI + 11 passing vitest tests); items 3-25 are consistent scaffolds behind default-off flags. Guardrails honored: no invented data (adapters/endpoints only, CapabilityEndpointError otherwise), no second registry/store (canonical pageRegistry + BrainCapabilityRegistry stay owners), review-only handoffs. Two wiring points: AppRoutes.tsx renders CAPABILITY_ROUTES; pageRegistry.ts receives the snippet entries (hidden/lab until audited)."

# No gh CLI? Push, then open:
# https://github.com/viewtube-dev/viewtube/compare/master/consolidated-feature-integration...<BRANCH>
```

## 3. Copy-paste prompt for a coding agent

```text
You are working with repository https://github.com/viewtube-dev/viewtube.

Goal: land the ViewTube "Priority 25" frontend package (folder `viewtube-consolidated/`) on a new
branch and open a PR to the master consolidated branch.

Steps:
1. Clone the repo if needed. The BASE branch is `master/consolidated-feature-integration`
   (confirmed to exist on the remote). Create a new branch off it named
   `feat/priority25-frontend-scaffolds`.
2. The package folder contains flat files plus MANIFEST.md. Read MANIFEST.md: it maps every flat
   filename to its repository path. Rule: flat name = repo path with every "/" replaced by "__";
   `SCAFFOLD-README.md` restores to `README.md`; `README.md`, `MANIFEST.md`, `restore-to-repo.sh`
   and `ROADMAP-REFERENCE.md` are package-only and must NOT be restored into the repo.
   Run `bash <package-folder>/restore-to-repo.sh <package-folder>` to restore all 118 files.
3. Wire two integration points exactly as described in the restored README.md:
   a) in `src/app/AppRoutes.tsx`, render `CAPABILITY_ROUTES` from `./capabilitiesRoutes`;
   b) paste the entries from `src/app/pageRegistry.capabilities-snippet.ts` into the canonical
      `src/app/pageRegistry.ts` (keep navigationVisibility "hidden" and lifecycle "lab" defaults).
4. Run and make pass: `npm install`, `npm run typecheck`, then
   `npx vitest run src/features/capabilities/channel-intelligence-engine/channelIntelligence.test.ts
   src/features/capabilities/evidence-connected-brain/evidenceLink.test.ts` (11 tests), then
   `npm run check:routes`. If typecheck reports only `capabilitiesRoutes.tsx` importing
   `./lazyRoute`, that resolves once files are inside the repo — it must not error after step 2.
5. Commit everything under src/ with message:
   "feat(capabilities): Priority-25 frontend scaffolds; systems 1-2 fully implemented"
6. Push the branch and open a PR with `gh pr create --base master/consolidated-feature-integration`,
   titling it "feat(capabilities): Priority-25 frontend scaffolds (systems 1-2 fully implemented)"
   and summarizing: items 1-2 fully implemented with passing tests, items 3-25 scaffolds behind
   default-off flags, guardrails honored (no invented data, no second registry/store,
   review-only handoffs), two wiring points as above.
Do not modify any file outside src/app/AppRoutes.tsx, src/app/pageRegistry.ts and the restored
paths. Do not enable any flag other than the two default-ON implemented previews
(`capability.channel-intelligence-engine`, `capability.evidence-connected-brain`).
```

## 4. After merge — per-capability path to exposure

Each of the 25 follows the roadmap's audit loop (also in the restored README): verify
implementation + active caller on the target branch → record the audit row (SHA, files, caller,
state owner, tests, A/B/C/D, vertical slice, rollback) → wire the canonical adapter
(`setCapabilityAdapter`) or endpoint → replace generic panel with `src/studio-ui` primitives →
flip its flag in `src/flags/featureFlags.ts` → flip the pageRegistry entry (`hidden`/`lab` →
`drawer`/`beta`+) → `npm run check:routes`. Items 1–2 are already at the "wire the adapter" step.
