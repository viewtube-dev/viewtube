# ViewTube Testing & Verification

**Status:** PROPOSED / VERIFICATION AUTHORITY TARGET

## Purpose
Define what evidence is required before ViewTube work is considered complete.

## Verification principle
Use the smallest sufficient evidence for the claim, but never weaker evidence than the risk requires.

## Evidence classes
| Claim | Appropriate evidence |
|---|---|
| Documentation change | repository file + review of content |
| Type/API behavior | focused typecheck/unit/integration test |
| Build integrity | successful build |
| UI behavior | runtime/screenshot evidence plus relevant tests |
| Migration | before/after state and migration checks |
| Account/security behavior | permission/authentication tests and runtime checks |
| Deployment | deployment result plus independent live verification |
| Production behavior | direct production evidence |

## Completion rule
`IMPLEMENTED` is not equivalent to `VERIFIED`.

A verified change should record:
- requirement/claim;
- evidence;
- test/build/runtime/screenshot result;
- date;
- exact commit or artifact;
- remaining uncertainty.

## Failure handling
Failed tests, builds, deployments, and verification attempts are durable evidence. Preserve the failure, diagnosis, attempted fix, and next action.

## Current repository state
The current recovery corpus defines strong verification rules, but a complete repository-wide test/verification matrix has not yet been established. This document is therefore a canonical target, not a claim that every test surface already exists.

**Primary sources:** `Recovery.md`, `Recovery.yaml`, `docs/governance/CONVERSATION_OS_REBUILD_MASTER.md`.
