# ViewTube Documentation Index

**Purpose:** one clear entry point for current project knowledge.

## Start here

1. Architecture — system structure and boundaries.
2. Organization — repository structure, document ownership, consolidation and migration rules.
3. Tools — complete creator-tool catalog and navigation.
4. Conversation OS — how ViewTube work is routed, executed and verified.
5. Toolbox — Toolbox/SubToolbox/widget capability surface.
6. UI — UI Reference Library, style, tokens, primitives and size system.

## Product systems

| System | Canonical document |
|---|---|
| Account | Account.md |
| AI / Brain | AI.md |
| Analytics | Analytics.md |
| Context | Context.md |
| Editor | Editor.md |
| Projects | Projects.md |
| Resource Library | Resource-Library.md |
| Studio Hub | Studio-Hub.md |
| Vault | Vault.md |
| YouTube | YouTube.md |

## Engineering / operations

| Subject | Canonical document |
|---|---|
| Deployment | Deployment.md |
| Security | Security.md |
| Testing | Testing.md |
| Quick Wins | Quick-Wins.md |
| Widgets | Widgets.md |
| Settings | Settings.md |

## Recovery

Recovery state lives at the repository root:

- Recovery.md
- Recovery.yaml

Recovery-specific operating material lives in recovery/Index.md.

## Navigation rule

Canonical current knowledge belongs directly under docs/.

Recovery and historical evidence belong under docs/recovery/.

Runtime implementation belongs under src/.

Do not create a new document for an existing subject. Update or consolidate its canonical owner first.

## Documentation operations

| Subject | Canonical document |
|---|---|
| Document System | Document-System.md |
| Document Health / Migration | Document-Health.md |
| Conversation synchronization | recovery/Sync.md |
| Repository document history | recovery/History.md |

**Rule:** substantive knowledge belongs in its canonical subject document; operation history belongs in `docs/recovery/History.md`.

## Current implementation / conversation records

- [Publisher metadata persistence plan](plans/VIEWTUBE_PUBLISHER_METADATA_PROJECT_PACKAGE_PERSISTENCE_PLAN_2026-10-08.md) — current implementation state and remaining verification gates.
- [Publisher/Manager channel-connected controls plan](plans/VIEWTUBE_PUBLISHER_MANAGER_CHANNEL_CONNECTED_CONTROLS_PLAN_2026-10-09.md) — four-state visibility workflow, channel playlists, location autocomplete, audience/AI semantics, API boundaries, implementation slices, and acceptance criteria.
- [Publisher metadata and Render conversation record](recovery/Conversation-Publisher-Metadata-Render-2026-10-09.md) — decisions, implementation summary, deployment evidence, known blockers, and next steps.
