# ViewTube Account System — Recovery Source

**Status:** RECOVERED / RECONSTRUCTION SOURCE — implementation not claimed
**Canonical target:** `viewtube-dev/viewtube`
**Date:** 2026-10-04

## Purpose
Preserve the recovered Account System architecture lane without inventing a runtime implementation. This document supplements the master-system rebuild resources and is not a competing authority.

## Recovered scope
The Account System is the identity and access boundary shared by the creator-facing systems. Recovered repository evidence identifies these responsibilities:

- identity
- authentication
- account/workspace/channel boundaries
- permissions and access control
- recovery
- YouTube linkage
- Brain identity/context boundaries
- Vault identity/permissions
- Projects identity/ownership
- Analytics identity/evidence boundaries

## Canonical relationship
The repository's master rebuild resources identify the intended canonical master as:

`docs/account/VIEWTUBE_ACCOUNT_SYSTEM_MASTER.md`

If that file is not present, this recovery source records the missing authority rather than silently substituting another document.

## System boundaries
Account identity must remain distinct from:

- YouTube channel data and analytics evidence;
- Brain reasoning/context;
- Vault asset ownership and permissions;
- Projects/content ownership;
- Analytics synchronization and derived analysis.

These systems may consume account-scoped identity, but they should not redefine the identity authority independently.

## Recovery rule
Do not mark authentication, permissions, persistence, deletion/disconnect, or YouTube linkage as implemented solely because they appear in architecture documents. Runtime code and verification are required.

## Next reconciliation
1. Recover or verify `docs/account/VIEWTUBE_ACCOUNT_SYSTEM_MASTER.md`.
2. Compare it with current account/auth code.
3. Verify workspace/channel ownership boundaries.
4. Verify permission enforcement at runtime.
5. Verify recovery/deletion/disconnect behavior.
6. Record tests and deployment evidence separately from architecture claims.

## Evidence classification
- **VERIFIED IN REPOSITORY:** master rebuild resources reference this Account System lane and its intended canonical path.
- **RECOVERED:** the scope and boundaries above come from prior ViewTube recovery work.
- **UNKNOWN:** complete runtime implementation and production verification.
