# ViewTube Recovery Handoff — Account / YouTube / Beta Continuation Conversation

**Recovery ID:** REC-20261004-account-system-conversation-001  
**Round:** 1  
**Source:** Current ChatGPT conversation  
**Canonical recovery repository:** `viewtube-dev/viewtube`  
**Canonical branch:** `main`  
**Historical/working repository discussed:** `cbrewsterthegreat/ViewTube`  
**Historical working branch:** `codex/account-system-beta-phase1`  
**Status:** VERIFIED recovery artifact; implementation claims below retain their individual evidence/status.

## 1. Purpose

This handoff preserves the substantive knowledge from the conversation that led from ViewTube beta/account planning into an account/YouTube credential-boundary implementation effort.

The conversation's primary product goal is to make ViewTube usable as a beta as quickly as possible while continuing development of the larger system. The user wants existing systems to be completed, integrated, optimized, simplified, and stabilized rather than replaced by duplicate systems.

The user currently cannot access the old YouTube-build repository, its Google Cloud account, or the production site. Repository work that does not require those external credentials should continue now. Production OAuth/Google Cloud work is a dependency to complete when access is restored.

## 2. User-approved product direction

The immediate beta-critical functions identified by the user are:

1. Account creation and login.
2. Google account connection.
3. YouTube connection.
4. YouTube API analytics synchronization into the VT Sync / Analytics master data tables.
5. AI chatbot connected to available evidence, knowledge, analytics, user input, and application capabilities.
6. Video manager and publisher tools/widgets for publishing and managing YouTube videos.
7. Metadata-generation tools/widgets.
8. Community post and comment responder tools.
9. Onboarding.
10. Video editor project saving.
11. MP4 rendering/export from video editor projects.
12. Thumbnail generation.
13. Script generation.

The user described these as partially working and wants near-complete existing systems finished before creating replacements.

### Product architecture principle

The user wants the application to evolve like an operating system: when new versions are introduced, existing tools and systems should continue to work. New functionality should be layered behind stable interfaces rather than repeatedly creating parallel systems.

The user specifically questioned why Projects, Packaging, Asset Engine, and other video systems appear similar. The preferred direction is to make these backend capabilities work together while presenting a coherent front-end Video Project experience. This does not require deleting useful backend subsystems; it requires clarifying ownership, reducing duplication, and stabilizing shared contracts.

## 3. Current source-of-truth decisions

### Analytics

The user's stated current source of truth for analytics/statistics is the **VT Sync / Analytics page**, moved from the Performance Hub. Its master data tables contain synced YouTube statistics/data for the connected channel.

The desired flow is:

```
ViewTube account
  ↓
Google/YouTube connection
  ↓
server-owned credential
  ↓
YouTube API
  ↓
VT Sync
  ↓
master data tables
  ↓
Analytics / downstream AI and tools
```

### Account/channel identity

The preferred architecture is:

```
ViewTube Account
  ↓
Google Provider Connection
  ↓
YouTube Connection
  ↓
Active YouTube Channel
  ↓
Canonical Channel Session / Connection State
  ↓
VT Sync / Analytics / Publisher / Community / AI / UI
```

Authentication truth should be owned by the account/session layer. Browser UI code should not become the owner of Google OAuth tokens.

### AI Brain

The AI chatbot/Brain is an ongoing capability, not a one-time feature. The desired direction is to connect it to as many already-designed/implemented sources as possible: evidence, knowledge, analytics, user input, resource systems, application capabilities, and tool/action execution.

Do not create another AI knowledge system if an existing Brain/Context/Resource system can be integrated or extended.

## 4. Repository/recovery situation

The conversation worked primarily against `cbrewsterthegreat/ViewTube` because that is the repository the user can currently work with.

The recovery protocol in the canonical ViewTube repository identifies `viewtube-dev/viewtube` as the canonical recovery repository and `main` as its canonical branch. Therefore this Round 1 artifact preserves both repositories as provenance rather than silently treating the cbrew repository as canonical.

Historical claims from `cbrewsterthegreat/ViewTube` must be reconciled against `viewtube-dev/viewtube/main` during Round 2.

## 5. Account/YouTube implementation discoveries from the conversation

### 5.1 YouTube read transport is already substantially migrated

Repository inspection during the conversation found that:

- `youtubeApiClient.ts` supports unified/account-server operation.
- `googleReadTransport.ts` has existing tests around account proxy behavior, proxy-not-found fallback, proxy-origin rejection, scope failure, unified accounts disabled, and reconnect behavior.
- `getValidAccessToken()` remains in compatibility paths.

**Interpretation:** the read transport should not be rebuilt. Continue the existing migration and remove legacy token dependence only after parity is verified.

### 5.2 YouTube write/publishing transport is already substantially migrated

Repository inspection found:

- `YouTubeUploadService` routes unified-mode uploads through `uploadUnifiedVideo()`.
- The unified write transport covers upload sessions/chunks, comments, video updates, thumbnails, captions, playlists, and structured reconnect/retry errors.

**Interpretation:** do not create a second publishing system. The legacy Google-token uploader is a compatibility path and should only be retired after parity verification.

### 5.3 VT Sync is the major remaining credential-boundary hotspot

`src/features/vt-sync-local/adapters/localSyncEngine.ts` was found to contain a fallback where a server-account/proxy failure can dynamically import `authSession`, obtain a browser Google token, and continue directly against Google.

This is the important legacy behavior to eliminate.

The correct target is not another proxy/fallback system. It is:

```
VT Sync
  ↓
typed server-side YouTube/Analytics operation
  ↓
server-owned Google credential
  ↓
YouTube API
```

The VT Sync engine itself should not be rewritten. It already has sync categories, analytics contracts, inventory sync, snapshots, persistence, windowing/retention, traffic-detail handling, merge/preservation behavior, and tests.

### 5.4 Typed YouTube Analytics endpoint already exists

The repository inspection found:

- `POST /api/youtube/analytics/query`
- route implementation in `api/youtube/_route.mjs`
- server implementation in `server/simple-analytics.mjs`

The server-side analytics service authenticates from the ViewTube session/account layer and calls YouTube Analytics through the server-side Google client.

**Recommended migration:** move VT Sync analytics operations to this existing typed route/service first, preserving all existing VT Sync dataset/master-table contracts.

### 5.5 Canonical account snapshot already contains channel information

Repository inspection found `UnifiedAccountSnapshot` already contains the major fields needed for a canonical channel-session projection, including:

- ViewTube user identity;
- authentication status;
- Google connection state;
- YouTube scopes;
- channel ID;
- channel title;
- channel handle;
- channel thumbnail;
- capabilities;
- content-owner state;
- onboarding state.

Therefore a new competing account/channel store is unnecessary.

### 5.6 connectionState is a projection, not another authority

`connectionState.ts` already defines `ChannelConnectionSnapshot` and a resolver used by UI consumers.

The identified architectural problem is that legacy `AuthState` is still involved in deriving connection state even though newer unified account/channel information exists.

Correct direction:

```
UnifiedAccountSnapshot
        +
canonical account/channel state
        ↓
resolveChannelConnectionSnapshot()
        ↓
existing ChannelConnectionSnapshot
        ↓
UI
```

Preserve the output contract so downstream UI does not need an unnecessary rewrite.

## 6. Working-branch implementation recorded in the conversation

The conversation reported actual writes to:

`cbrewsterthegreat/ViewTube` branch `codex/account-system-beta-phase1`.

These claims were re-read from GitHub during the conversation, but they are **not merged to the canonical recovery main branch** and should not be treated as production completion.

### Commit 45f19b1

Reported message:

`refactor(account): accept canonical account snapshot in channel state`

Changes reported:

- `src/services/connectionState.ts` accepts `UnifiedAccountSnapshot` as an optional canonical source.
- canonical authentication takes precedence when supplied;
- canonical YouTube channel title/handle/ID/thumbnail can establish channel identity;
- existing `AuthState` behavior remains available as compatibility behavior.

**Status:** IMPLEMENTED on the historical working branch; not merged to canonical main.

### Commit 09bde69

Reported message:

`test(account): cover canonical channel authentication precedence`

Changes reported:

- tests for canonical authenticated channel state;
- tests proving stale legacy authenticated state cannot override canonical anonymous state.

**Status:** IMPLEMENTED on the historical working branch; not merged to canonical main.

### Commit e3d8fdc

Reported message:

`refactor(account): use cached canonical snapshot for channel state`

Changes reported:

- `readCachedAccountSnapshot()` is used as a compatibility bridge when the newer canonical snapshot is absent;
- cached canonical authentication is accepted only when it agrees with live authenticated state, preventing stale cached authentication from resurrecting logged-out UI.

**Status:** IMPLEMENTED on the historical working branch; not merged to canonical main.

### Account handoff created in the historical repository

The conversation also created:

`docs/agent-handoff/VIEWTUBE-ACCOUNT-SYSTEM-CONVERSATION-HANDOFF-2026-10-02.md`

in `cbrewsterthegreat/ViewTube` on `codex/account-system-beta-phase1`.

It contains the earlier account-system plan, beta requirements, credential-boundary findings, implementation sequence, and an explicit list of work not in main.

**Status:** IMPLEMENTED as a historical-repository handoff; canonical recovery copy is this artifact.

## 7. Branch/merge discovery

The conversation attempted to merge the historical working branch into its `main`.

GitHub reported branch divergence, and the assistant explicitly did not force-update main.

Therefore:

- do not assume the historical branch is a clean descendant of main;
- do not force-push it over main;
- reconcile the branch against the canonical repository before moving code;
- preserve both sides until differences are understood.

This is especially important because the recovery system says current verified implementation on the canonical main branch has priority over historical branch claims.

## 8. Exact unfinished implementation sequence

### CHANNEL-001A — canonical channel-state projection

1. Preserve the existing `ChannelConnectionSnapshot` API.
2. Make `UnifiedAccountSnapshot` / canonical account-channel data authoritative.
3. Keep an explicit compatibility adapter for legacy `AuthState` callers.
4. Add/retain tests for:
   - authenticated + verified channel;
   - authenticated + unverified channel;
   - disconnected account;
   - cached analytics while disconnected;
   - active sync;
   - failed sync;
   - completed sync.
5. Update `GlobalDataContext` to feed canonical account/channel state into the resolver.
6. Find remaining direct `AuthState` consumers and classify them as migration, compatibility, or retirement candidates.

### VT-SYNC-001 — analytics transport migration

1. Identify analytics operations still using generic Google proxy/browser-token fallback.
2. Map them to the existing typed analytics route.
3. Preserve existing VT Sync categories, schemas, merge logic, snapshots, and master-data tables.
4. Migrate one analytics category at a time.
5. Add parity tests.
6. Remove the browser-token fallback only after parity is demonstrated.

### VT-SYNC-002 — remaining sync transports

Map inventory, metadata, reporting, playlists, and other sync operations to existing typed server-side services. Reuse existing services instead of creating duplicate API clients.

### AUTH-RETIRE-001 — legacy browser token retirement

After parity:

- remove normal production dependence on `authSession.getValidAccessToken()`;
- remove browser-token persistence where no longer required;
- keep only explicitly justified compatibility shims temporarily;
- enforce governance/tests against new direct legacy auth usage.

## 9. Production-blocked work

The user currently cannot access the old Google Cloud account or production site. The following are therefore BLOCKED/QUEUED rather than failed:

- Google Cloud OAuth configuration/approval;
- production OAuth redirect URI configuration;
- production environment secrets;
- real-user Google/YouTube OAuth callback testing;
- live YouTube API credential verification;
- production beta sign-up/login verification;
- production deployment verification.

These should not block repository-side architecture and migration work.

## 10. Broader project knowledge preserved from this conversation

The conversation also reaffirmed these project-wide priorities:

### Documentation/governance

- ViewTube Conversation OS should remain alive and be updated as work changes.
- Documents governance is a real system, not a one-time audit.
- Recovery/handoff documents should preserve implementation evidence, plans, failures, and provenance.
- Agents should ask themselves what was actually implemented versus merely planned.
- Before merging major creative/architectural changes, the user wants approval.
- The user explicitly welcomes AI improvements and better practices, but wants approval before merging changes that exercise broad creative freedom.

### UI/design system

The user previously clarified:

- the widget system already has primitives and a UI reference library;
- the UI reference library is intended to contain the actual visual representatives of the style/token/size system used by widgets;
- size definitions are default layout sizes, while components/primitives can adapt to other sizes;
- when a widget need appears, decide case-by-case whether to fix an existing widget, create a new widget, or add a variant.

### Video-system consolidation

The user wants multiple backend video systems to remain possible if useful, but wants the front end to make them understandable as one coherent Video Project system. Projects, packaging, asset engine, and creation/assembly capabilities should be analyzed for overlap and shared contracts before any new duplicate feature is created.

### AI Brain

The Brain should be connected to:

- analytics;
- evidence;
- knowledge/resource library;
- user input;
- creator/channel context;
- existing tools/actions;
- video and metadata systems;
- Conversation OS/project continuity;
- research/current information where appropriate.

The goal is better contextual intelligence and tool execution, not another isolated chatbot.

## 11. Material engineering/product findings

### FIND-ACCOUNT-001 — duplicated authentication interpretation

- **Category:** Code structure / security / reliability
- **Affected area:** `AuthState`, `UnifiedAccountSnapshot`, `connectionState.ts`, `GlobalDataContext`
- **Finding:** Legacy AuthState and newer unified account/channel state can both influence authentication/channel UI interpretation.
- **Evidence:** Repository inspection during conversation.
- **Status:** VERIFIED architectural finding; migration partially IMPLEMENTED on historical branch.
- **Impact:** stale or contradictory auth interpretations can cause UI inconsistency and complicate future account changes.
- **Recommendation:** one canonical account/channel contract with compatibility adapters during migration.
- **Verification needed:** canonical-main implementation and test verification after merge.

### FIND-VTSYNC-001 — browser-token fallback

- **Category:** Security / architecture
- **Affected area:** `localSyncEngine.ts`
- **Finding:** VT Sync can fall back from server account/proxy behavior to browser Google access-token usage.
- **Status:** VERIFIED repository finding during conversation.
- **Impact:** keeps credential ownership split and prevents clean server-side account architecture.
- **Recommendation:** migrate sync operations to typed server-side YouTube/Analytics services, then retire browser-token fallback.
- **Verification needed:** parity tests and live API verification once Google access returns.

### FIND-YT-001 — generic proxy versus typed transport

- **Category:** Architecture
- **Affected area:** account Google proxy / YouTube transports / analytics.
- **Finding:** typed YouTube/Analytics routes already exist and should become the stable integration boundary.
- **Status:** VERIFIED.
- **Recommendation:** stop adding new generic Google proxy usage; migrate existing operations incrementally.

### FIND-PRODUCT-001 — duplicate video-system perception

- **Category:** UX/product/architecture
- **Affected area:** Projects, Packaging, Asset Engine, video creation/assembly/editor.
- **Finding:** user perceives overlapping video systems and wants a coherent Video Project front-end.
- **Status:** REPORTED user requirement.
- **Recommendation:** map capabilities and ownership before building new video functions.

### FIND-RECOVERY-001 — repository identity must remain explicit

- **Category:** Workflow/handoff
- **Finding:** the conversation worked on `cbrewsterthegreat/ViewTube`, while canonical recovery identifies `viewtube-dev/viewtube` as the durable recovery repository.
- **Status:** VERIFIED.
- **Recommendation:** preserve both as provenance; use Round 2 reconciliation before promoting historical implementation claims.

### FIND-RECOVERY-002 — merge-to-main is the completion gate

- **Category:** Workflow/verification
- **Finding:** branch commits and plans are not completion.
- **Status:** VERIFIED governance rule.
- **Recommendation:** implementation status should remain IMPLEMENTED until merged and verified; then become VERIFIED IMPLEMENTATION.

## 12. Ideas and improvements surfaced

### Tool/workflow improvements

- Build a canonical account/channel capability contract consumed by all downstream tools.
- Use typed server-side YouTube routes as stable capability boundaries.
- Add automated governance checks for direct legacy auth-token usage.
- Add transport parity test suites so legacy compatibility can be removed safely.
- Add repository reconciliation tooling for historical branches and canonical main.

### AI improvements

- Feed canonical account/channel state into Brain context.
- Feed current VT Sync/master analytics evidence into Brain context.
- Allow Brain tool/action execution through stable service contracts.
- Preserve provenance for AI evidence and distinguish current synced data from stale/cached data.
- Integrate Conversation OS/project continuity with Brain context rather than making separate memory systems.

### UX improvements

- Make account connection state understandable to users.
- Make the transition from account → channel → sync → analytics visible.
- Make the video creation workflow appear as one coherent Video Project experience even if backend capabilities remain modular.

### Testing/verification improvements

- Add canonical account/channel state matrix tests.
- Add VT Sync transport parity tests.
- Verify account/session behavior under disconnected, reconnecting, cached, syncing, and failed states.
- Separate repository-side tests from production OAuth verification.
- Never report live YouTube behavior as verified without real credential/API evidence.

## 13. Open questions

1. Which historical working-branch commits exist in canonical `viewtube-dev/viewtube/main` already under different commits or implementations?
2. What is the exact divergence between `cbrewsterthegreat/ViewTube/main` and `codex/account-system-beta-phase1`?
3. Which remaining VT Sync categories still use the generic proxy/browser-token path?
4. Which typed routes already cover each remaining category?
5. Which direct `AuthState` consumers remain after the channel-state migration?
6. Which production Google Cloud settings remain after the user's account is recovered?
7. What is the exact current canonical implementation status of the beta-critical systems listed in Section 2?

## 14. Recommended continuation order

**Do not restart the account-system investigation.**

Resume in this order:

1. Reconcile the historical account branch against canonical `viewtube-dev/viewtube/main`.
2. Finish canonical channel-state projection.
3. Migrate `GlobalDataContext`.
4. Map VT Sync analytics operations to `/api/youtube/analytics/query`.
5. Add parity tests.
6. Migrate remaining VT Sync transports.
7. Retire browser-token dependence.
8. Verify account → YouTube → VT Sync → master-data path.
9. Revisit the beta-critical feature matrix and complete near-working systems.
10. Only then merge approved changes to canonical main.

## 15. Status summary

| Area | Status |
|---|---|
| Recovery artifact | VERIFIED |
| Account/channel architecture discovery | VERIFIED |
| Historical branch account changes | IMPLEMENTED on historical branch; not canonical main |
| Channel-state migration | IMPLEMENTED partially; continuation required |
| VT Sync browser-token removal | PROPOSED / NOT COMPLETE |
| Typed analytics route | VERIFIED existing capability |
| VT Sync analytics migration | PROPOSED / NOT COMPLETE |
| Production Google OAuth | BLOCKED |
| Production beta verification | BLOCKED |
| Canonical-main merge of historical branch | NOT COMPLETE / requires reconciliation |
| Full beta readiness | UNKNOWN |

## 16. Provenance

Primary evidence sources:

- current conversation and user statements;
- direct reads of canonical ViewTube recovery files;
- direct repository inspection described in the conversation;
- historical `cbrewsterthegreat/ViewTube` branch/commit claims;
- existing ViewTube recovery governance.

Historical implementation claims must be reconciled against canonical `viewtube-dev/viewtube/main` before they are treated as current project state.

---

# Complete work list from this conversation that is not established as merged + verified on canonical main

1. Canonical account snapshot input to `connectionState.ts` (historical commit `45f19b1`).
2. Canonical authentication precedence tests (historical commit `09bde69`).
3. Cached canonical-account compatibility bridge (historical commit `e3d8fdc`).
4. Canonical `GlobalDataContext` migration.
5. Complete canonical channel-state matrix tests.
6. Remaining direct `AuthState` consumer migration/classification.
7. VT Sync analytics transport migration to typed analytics endpoint.
8. VT Sync analytics parity tests.
9. VT Sync browser-token fallback retirement.
10. Remaining VT Sync transport migrations.
11. Generic Google proxy retirement where typed routes provide parity.
12. Legacy browser-token ownership retirement.
13. Auth governance tests preventing new legacy token/auth usage.
14. End-to-end account → Google → YouTube → channel → VT Sync → master-data verification.
15. Production Google Cloud OAuth configuration/approval.
16. Production OAuth callback/redirect verification.
17. Production environment credential verification.
18. Real-user Google/YouTube connection verification.
19. Live YouTube Analytics sync verification.
20. Production beta sign-up/login verification.
21. Production deployment verification.
22. AI Brain integration with canonical account/channel state and current analytics/evidence.
23. Completion/stabilization of video manager/publisher.
24. Metadata-generation tooling completion.
25. Community post/comment responder completion.
26. Onboarding completion.
27. Video editor project persistence.
28. MP4 rendering/export.
29. Thumbnail generation completion.
30. Script generation completion.
31. Video-system consolidation/clarification behind a coherent Video Project front end.
32. Continued toolbox/widget/dashboard UI/CSS consolidation.
33. Continued Conversation OS/document-governance maintenance.
34. Continued application-wide compatibility/stability work.

**Round 1 rule:** this list is a recovery inventory, not a claim that every item is absent from canonical main. Each item must be reconciled against verified main implementation during Round 2.
