# ViewTube YouTube Integration

**Status:** RECONSTRUCTION / CANONICAL INTEGRATION TARGET

## Purpose
Define the boundary between ViewTube account identity and YouTube channel/data integration.

## Boundary
The recovered architecture separates:

**ViewTube identity → account → workspace → channel relationship → YouTube data/evidence**

YouTube is an external platform integration. It must not redefine the ViewTube identity authority.

## Expected integration surfaces
Based on the recovered Account, Analytics, Projects, and Brain architecture, YouTube integration participates in:
- channel linkage;
- authenticated access;
- analytics synchronization;
- channel-scoped evidence;
- publishing workflows;
- project/content context;
- Brain analysis and recommendations.

## Analytics flow
The documented product model is:

**YouTube → Sync Controller → Master Data Tables → Data Visuals / Intelligence Hub → Brain / Projects**

The four Analytics tools are:
1. Sync Controller
2. Intelligence Hub
3. Master Data Tables
4. Data Visuals

## Identity rule
YouTube channel identity/data and ViewTube account identity remain separate concepts. Consumers may use account-scoped identity and channel linkage, but they should not create independent identity authorities.

## Security rule
YouTube credentials/tokens and external-write permissions require the Account/security boundary. Consequential publishing or external mutations require explicit approval and verification.

## Current implementation state
The recovery corpus establishes the architecture and product boundaries but does not provide sufficient current-main evidence to claim a complete production YouTube integration. Runtime authentication, channel linkage, synchronization, publishing, and production verification remain reconciliation work.

**Primary sources:** `docs/Account.md`, `docs/Analytics.md`, `docs/Architecture.md`, `docs/recovery/VIEWTUBE_ACCOUNT_SYSTEM_RECOVERY_SOURCE_2026-10-04.md`.
