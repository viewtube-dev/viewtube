# ViewTube Master System Rebuild Dependency Map

**Status:** INITIAL / TO BE RECONCILED AGAINST MAIN

## System graph

```
Conversation OS
      │
      ├── Documentation Governance
      │        │
      │        ├── Master resources
      │        ├── Source/ownership maps
      │        └── Verification / handoff
      │
      ├── Quick Wins 100
      │        │
      │        └── implementation backlog
      │
      ├── Vault / Asset Workbench
      │        ├── Asset Engine
      │        ├── Resource Library
      │        ├── Projects
      │        └── ContentBuild
      │
      └── Account System
               ├── identity
               ├── permissions
               ├── channels/workspaces
               ├── Analytics
               ├── Vault
               ├── Projects
               └── Brain

Brain / AI
      ├── Resource Knowledge
      ├── Analytics evidence
      ├── creator context
      ├── research
      ├── tools/actions
      ├── Projects
      └── Asset intelligence
```

## Dependency classes

### Governance dependencies
- Every master resource must have one canonical owner.
- Durable work products follow the repository's documentation-routing rules once those rules are reconciled.
- Historical/recovery sources provide provenance, not automatic authority.

### Runtime dependencies
- Runtime code must not depend on documentation-only artifacts.
- Resource/knowledge data used at runtime belongs with runtime-owned resources.
- Generated indexes must be distinguishable from canonical sources.

### Account dependencies
Account identity/permissions must be established before consequential cross-system actions are treated as authorized.

### Brain dependencies
Brain context should consume canonical contracts for:
- creator identity/context;
- analytics evidence;
- Resource Knowledge;
- asset intelligence;
- Projects;
- tool/action capabilities.

## Implementation sequence

1. Establish canonical governance and ownership.
2. Reconcile account identity/permission boundaries.
3. Establish Vault asset/workflow contracts.
4. Establish canonical Quick Wins tracker.
5. Connect Brain to stable contracts.
6. Implement cross-system actions only after permission and verification boundaries are explicit.

## Open reconciliation questions

- Which current files are already canonical for Conversation OS?
- Which documentation governance artifacts already exist under `docs/`?
- Does a current Vault master already exist under another path?
- Where is the authoritative Quick Wins 100 registry?
- What current account/auth implementation is present on `main`?
- What `@Thinking` material is available for account-system reconciliation?
- Which recovered artifacts are historical versus current?

These are discovery tasks, not assumptions.
