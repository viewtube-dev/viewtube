# ViewTube Deployment + Toolbox Recovery Source

**Status:** RECOVERED TECHNICAL EVIDENCE / PRODUCTION NOT VERIFIED
**Canonical target:** `viewtube-dev/viewtube`
**Date:** 2026-10-04

## Purpose
Preserve the known deployment-recovery identifiers and failure diagnosis so later agents do not repeat the unsafe reconstruction.

## Historical recovery identifiers
The recovered recovery record contains:

- known-good reference commit: `c45aedaac9cb0fc27126ea4689d36c9104676b94`
- bad commit: `d9ca808e`
- recovery commit: `236cf1aca1c0fa1bcc08a84b5b069177917257e4`
- Render deployment attempt: `dep-davcsp7avr4c73bge450`

These identifiers are historical evidence from the recovery corpus. They are not evidence that the current `viewtube-dev/viewtube` main branch has the same commit graph.

## Failure diagnosis
The failed deployment reported missing exports including:

- `ToolboxScaffold`
- `AccordionContainer`

The recovery work identified that the attempted fix had rewritten substantial portions of `src/components/Toolbox.tsx`.

## Correct recovery strategy
Do **not** reconstruct `Toolbox.tsx` from memory.

Use a surgical compatibility restoration:

1. recover the historical source that supplied the required exports;
2. compare it with the known-good implementation;
3. restore only the missing compatibility surface;
4. preserve the existing Toolbox implementation;
5. run type/build/tests;
6. deploy only after local verification;
7. verify the deployed service separately.

## Verification boundary
A successful GitHub commit or build does not establish a successful production deployment. The recovered record explicitly leaves Render LIVE production success unverified.

## Current-target caution
The canonical repository for this recovery pass is `viewtube-dev/viewtube`. Historical identifiers from another repository/account context must not be treated as current-target commits without explicit repository evidence.


## Additional conversation recovery evidence — 2026-10-04

**Status:** REPORTED CONVERSATION EVIDENCE / REQUIRES CURRENT RENDER VERIFICATION

A subsequent ViewTube conversation explicitly requested Render as the runtime verification surface after the user corrected that `viewtube.live` is not connected to the repository.

The conversation reported:

- one Render-connected preview service failed during Vite parsing at `src/components/Toolbox.ts:44:21` with `Expected `>` but found `{``;
- the reported diagnosis was JSX inside a `.ts` compatibility facade;
- another Render preview service was reported to invoke `npm run build` without installing dependencies and consequently reported `vite: not found`;
- a historical PR #40 was claimed to replace JSX-returning compatibility-facade functions with `React.createElement`.

These are preserved as **REPORTED** evidence only. The current canonical repository does not contain the historical implementation surface needed to independently verify these claims, and the external PR identifiers were not retrievable through the available GitHub search surface during this recovery pass.

### Authority correction

`viewtube.live` must not be used as repository runtime evidence unless a future verified deployment relationship explicitly establishes that it is built from the canonical repository/commit.

### Required verification

1. Query the current Render workspace/service connected to `viewtube-dev/viewtube`.
2. Identify the exact deployed commit.
3. Inspect current build/deploy status.
4. If a build fails, preserve the exact current error.
5. Verify any Toolbox compatibility fix against the actual canonical source before promoting it.


## Verified Render service boundary — 2026-10-04 recovery pass

The accessible Render workspace currently exposes a service named `viewtube-main-preview` (`srv-davin39srm7s73c5ljmg`) whose repository is explicitly:

`https://github.com/cbrewsterthegreat/ViewTube`

It tracks `main` and uses:

- build: `npm run build`
- start: `npm run preview -- --host 0.0.0.0`

Recent deployments queried during recovery are recorded as `build_failed`, including deployment `dep-davskv3tqb8s73fon8hg` for commit `bdf80ca0922aecd69bb37429e79f6b5e3ee19b76`.

**Conclusion:** Render access verified here is tied to the historical `cbrewsterthegreat/ViewTube` repository, not canonical `viewtube-dev/viewtube`. Therefore it cannot be used as canonical runtime verification for the current recovery target. The canonical Render service/deployment remains UNKNOWN.
