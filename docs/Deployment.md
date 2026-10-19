# ViewTube Deployment

**Status:** RECOVERED EVIDENCE / PRODUCTION NOT VERIFIED  
**Authority:** canonical deployment/release verification target.

## Purpose
Define the evidence boundary between repository changes, builds, deployments, and live production.

## Recovery evidence
Historical recovery records identify:
- known-good reference: `c45aedaac9cb0fc27126ea4689d36c9104676b94`;
- bad commit: `d9ca808e`;
- recovery commit: `236cf1aca1c0fa1bcc08a84b5b069177917257e4`;
- Render deployment attempt: `dep-davcsp7avr4c73bge450`.

These are historical identifiers and are not claims about the current main commit graph.

## Known deployment failure
A recovered Render build reported missing exports including:
- `ToolboxScaffold`;
- `AccordionContainer`.

The recovery record also reports that a substantial portion of `src/components/Toolbox.tsx` had been rewritten during the failed fix.

## Safe recovery strategy
Do not reconstruct Toolbox implementation from memory.

1. Recover the historical source supplying the required exports.
2. Compare it with the known-good implementation.
3. Restore only the missing compatibility surface.
4. Preserve the existing Toolbox implementation.
5. Run type/build/tests.
6. Deploy only after local verification.
7. Verify the deployed service separately.

## Verification boundaries
- Commit success does not prove build success.
- Build success does not prove deployment success.
- Deployment success does not prove live production behavior.
- Production claims require direct production evidence.

## Current state
Live Render production success remains **UNVERIFIED**.

**Primary source:** `docs/recovery/VIEWTUBE_DEPLOYMENT_AND_TOOLBOX_RECOVERY_SOURCE_2026-10-04.md`.


## 2026-10-09 — Convergence branch public check

The separate Render service `viewtube-system-convergence` (`srv-db3tf87lot8c73bvpalg`) tracks `audit/system-convergence-identity-certification`, not `main`. Its public homepage, Studio route, Settings route, and `/video-publisher` route were inspected read-only on 2026-10-09 UTC.

- Homepage and Publisher route loaded without visible build/runtime errors.
- Publisher was publicly reachable without a sign-in redirect and showed an empty Project/package state (“No projects available” / “NO CANONICAL PUBLISHING PACKAGE IS AVAILABLE”).
- The served app bundle reported commit prefix `a93728f2b138` and build time `2026-10-09T19:02:08.389Z`.
- Public check links: [homepage](https://viewtube-system-convergence.onrender.com/), [Studio](https://viewtube-system-convergence.onrender.com/studio), [Video Publisher](https://viewtube-system-convergence.onrender.com/video-publisher), [Settings](https://viewtube-system-convergence.onrender.com/settings), [served app bundle](https://viewtube-system-convergence.onrender.com/assets/index-Bq9KrwWw.js).

This is a branch-preview page-load check only. It does not certify `main`/production, populated-project persistence, saved metadata option behavior, upload durability, or automated tests. Documentation commits triggered new Render auto-deploys after the observed build, so the latest deployment must be checked again before calling the current HEAD live.
