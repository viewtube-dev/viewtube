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
