# ViewTube Security & Reliability

**Status:** PROPOSED / CANONICAL SECURITY TARGET

## Purpose
Define security boundaries for the account, identity, YouTube, Brain, Vault, Projects, analytics, and deployment surfaces without claiming unverified runtime behavior.

## Core boundaries
- Identity and authentication belong to the Account boundary.
- Authorization must be enforced at the relevant resource boundary.
- YouTube channel identity/data must remain distinct from ViewTube identity.
- Brain context may consume scoped identity/context but must not become the identity authority.
- Vault ownership/permissions must remain distinct from analytics evidence.
- Consequential external writes require explicit approval and verification.
- Production deployment claims require independent verification.

## Account security targets
The recovered Account architecture calls for:
- server-owned credentials;
- secure session handling;
- explicit account/workspace/channel boundaries;
- authorization enforcement;
- recovery;
- deletion/disconnect handling;
- controlled YouTube linkage.

These are architecture targets unless backed by runtime evidence.

## Reliability principles
- Prefer surgical compatibility fixes over broad rewrites when recovering regressions.
- Preserve provenance and uncertainty.
- Detect and surface contradictions rather than silently choosing one claim.
- Treat failures as reusable engineering evidence.
- Verify high-blast-radius changes separately from low-risk documentation changes.

## Current state
The repository recovery pass has not established a complete runtime security audit. Security claims must remain scoped to the evidence available.

**Primary sources:** `docs/Account.md`, `docs/Architecture.md`, `docs/recovery/VIEWTUBE_ACCOUNT_SYSTEM_RECOVERY_SOURCE_2026-10-04.md`, `docs/Deployment.md`.
