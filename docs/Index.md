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
| Repository document history | recovery/History.md |

**Rule:** substantive knowledge belongs in its canonical subject document; operation history belongs in `docs/recovery/History.md`.
