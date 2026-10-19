# ViewTube Account

**Status:** RECONSTRUCTION / CANONICAL TARGET  
**Purpose:** Define the identity and access boundary shared by creator-facing ViewTube systems.

## 1. Scope

The Account system covers:

- identity;
- authentication;
- authorization;
- sessions;
- providers;
- creator/profile/channel relationships;
- workspace boundaries;
- account switching;
- recovery;
- secure persistence;
- deletion/disconnect;
- YouTube linkage;
- Brain identity/context boundaries;
- Vault permissions;
- Projects ownership;
- Analytics evidence boundaries.

## 2. Boundary model

```text
Identity
  ↓
Account
  ↓
Workspace
  ↓
Channel
  ↓
Project
  ↓
Asset / Analytics / Brain Context
```

These are related but must not be treated as interchangeable identifiers.

## 3. YouTube relationship

YouTube channel information should be represented through canonical account/channel state rather than duplicated independently by UI services.

Recovered implementation evidence indicates that `UnifiedAccountSnapshot` can provide canonical authentication and channel identity, while `connectionState.ts` should act as a projection/compatibility layer rather than another source of truth.

## 4. Security principles

- permissions must be explicit;
- consequential actions require controlled authorization;
- sessions and credentials require secure persistence;
- disconnect/recovery behavior must be defined;
- account boundaries must be preserved when Brain context is assembled;
- historical implementation claims must be verified before promotion.

## 5. Required contracts

The canonical account architecture should eventually define:

| Contract | Purpose |
|---|---|
| Identity | stable creator identity |
| Session | authenticated interaction |
| Workspace | creator/team boundary |
| Channel | YouTube/channel ownership boundary |
| Authorization | permitted actions |
| Account snapshot | canonical UI/service projection |
| Brain context | identity and permission context supplied to Brain |

## 6. Current state

**Not yet verified as a complete canonical implementation.**

Existing recovery material establishes substantial architecture and code discoveries, but the repository still requires reconciliation of current auth/runtime code, historical work and the account-system recovery sources.

Do not treat proposed account architecture as proof of implementation.

**Primary sources:** Account System Recovery Source; Account/YouTube/Beta recovery; Master System Rebuild Resource Plan; recovery artifact inventory.
