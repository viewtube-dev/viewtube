# ViewTube Master System Rebuild Resource Index

**Purpose:** Single navigation index for the master resources used to reconstruct and continue ViewTube.

## Master systems

| System | Canonical resource | Status | Notes |
|---|---|---|---|
| Conversation OS | `docs/governance/CONVERSATION_OS.md` or existing canonical equivalent | TO RECONCILE | Do not create a competing OS |
| Documentation Governance | existing canonical governance resource under `docs/governance/` | TO RECONCILE | Consolidate overlaps |
| Vault / Asset Workbench | `docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md` | PLANNED | Create only if no equivalent exists |
| Quick Wins 100 | existing tracker/plan or `docs/governance/QUICK_WINS_100_MASTER.md` | PLANNED | Recover before recreating |
| Account System | `docs/account/VIEWTUBE_ACCOUNT_SYSTEM_MASTER.md` | PLANNED | Lane 2 architecture work |

## Shared resources

- `docs/governance/MASTER_SYSTEM_REBUILD_RESOURCE_PLAN.md`
- `docs/governance/MASTER_SYSTEM_REBUILD_DEPENDENCY_MAP.md`

## Required supporting artifacts

- system inventory
- source map
- ownership map
- dependency map
- migration/consolidation matrix
- verification matrix
- handoff/receipt record

## Source classes

1. current `main`
2. verified implementation/tests/deployments
3. current project documents
4. explicit user-approved decisions
5. recovery artifacts
6. historical branches/PRs
7. conversation-derived plans
8. external prior art

Lower-ranked material must not silently override higher-ranked evidence.

## Status rule

This index tracks the rebuild program. It does not claim that a listed resource has been implemented merely because a target filename is proposed.
