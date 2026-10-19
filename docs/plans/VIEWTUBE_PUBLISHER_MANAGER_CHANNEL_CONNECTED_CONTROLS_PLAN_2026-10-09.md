# ViewTube Publisher + Manager Channel-Connected Metadata Controls Plan

**Date:** 2026-10-09  
**Repository:** `viewtube-dev/viewtube`  
**Working branch:** `audit/system-convergence-identity-certification`  
**Status:** PARTIAL IMPLEMENTATION COMMITTED — local verification and Maps autocomplete integration pending  
**Parent continuation record:** [Conversation-Publisher-Metadata-Render-2026-10-09.md](../recovery/Conversation-Publisher-Metadata-Render-2026-10-09.md)  
**Canonical persistence plan:** [VIEWTUBE_PUBLISHER_METADATA_PROJECT_PACKAGE_PERSISTENCE_PLAN_2026-10-08.md](VIEWTUBE_PUBLISHER_METADATA_PROJECT_PACKAGE_PERSISTENCE_PLAN_2026-10-08.md)

## 1. Purpose and continuity

Continue the existing Publisher metadata → Project / ContentBuild / Video Package work on `audit/system-convergence-identity-certification`. Do not restart the architecture, add a new publishing page, create a parallel metadata store, or replace the shared Toolbox/SubToolbox primitive system.

This slice fixes the shared controls used by Video Publisher and Video Manager. The existing persistence work, saved metadata options, Project Manifestation, asset lineage, publish transaction boundary, and analytics handoff remain in scope and must not regress.

## 2. Ownership boundaries

- **Video Publisher** prepares and publishes unpublished projects/content. It owns upload and pre-publication workflow.
- **Video Manager** edits already-published YouTube videos only. Do not add upload or initial-publishing controls to Manager.
- **CanonicalMetadataSections** remains the shared metadata layout authority.
- **PublishingControls** remains a compact publishing-settings composition only where needed; reconcile duplicate privacy/category/playlist controls rather than letting two controls disagree.
- **Project / ContentBuild / Video Package / Publishing Package** remain the durable metadata and package authorities. Do not introduce a Publisher-local permanent store.
- Existing ViewTube Toolbox/SubToolbox primitives and size/tone/state tokens must be reused. If a primitive is missing a required variant, extend the primitive and its reference-library counterpart rather than hardcoding a one-off widget.

## 3. Canonical section order

Preserve this exact order:

1. Video Upload
2. Title
3. Thumbnail
4. Visibility
5. Audience
6. Timestamps
7. Description
8. Location
9. Playlists
10. Community
11. AI Use
12. Tags
13. Category

Manager may hide Video Upload, Playlists, or Category when its live-video editing composition already handles them elsewhere, but there must be one authoritative control for each setting and no conflicting duplicates.

## 4. Required control contracts

### 4.1 Visibility

Use a dropdown with four user-facing options:

- Public
- Private
- Unlisted
- Scheduled

The persisted YouTube privacy status remains only `public | private | unlisted`. Scheduled is a ViewTube publication-workflow state backed by a valid schedule timestamp and supported privacy configuration; do not send `scheduled` as a YouTube `privacyStatus`. Prevent a scheduled state without a valid future date/time. Keep the Manager's update flow and Publisher's transaction flow distinct.

### 4.2 Playlists

Replace free-form playlist ID/name entry with a channel-connected, searchable multi-select dropdown.

- Resolve the authorized channel/account using the existing YouTube authentication/session layer.
- Fetch the user's playlists with YouTube Data API `playlists.list`, scoped to the authenticated user's channel and paginated.
- Display playlist titles and store stable playlist IDs.
- Provide loading, empty, retry, expired-auth, and API-error states.
- Publisher applies selected playlist IDs through its existing publish transaction routing step.
- Manager computes playlist membership differences and uses existing add/remove playlist-item service methods.
- Do not silently accept arbitrary playlist IDs as valid channel selections.
- Do not fetch a different user's channel's playlists or infer the channel from an editable text field.

### 4.3 Location

Create a reusable compound input/dropdown primitive.

- Text entry remains available while suggestions load.
- Suggestions use an approved real place/autocomplete/geocoding provider and spelling-tolerant matching; do not hardcode a small location list.
- Support keyboard navigation, accessible option announcements, selection, clearing, and retry/error states.
- Preserve the creator's display text, but distinguish custom text from a resolved place.
- Store provider/place ID and normalized address where available, plus coordinates only when returned and valid.
- Map only the fields supported by YouTube's `recordingDetails.location` / `recordingDetails.locationDescription` contract. Never send a provider result blindly as a YouTube location.
- Inspect current project providers, server proxy patterns, and secret handling before choosing or adding a provider. Do not expose server-only keys in client code or add a dependency without reviewing existing solutions.

### 4.4 Audience

Use a real Yes/No toggle with the visible question **“IS IT MADE FOR KIDS?”**

- Store `true | false | unset` so a new/unknown state is not silently interpreted as No.
- Map to YouTube's applicable made-for-kids fields using the existing API bridge and current official API semantics.
- Explain or validate unset before a workflow that requires a deliberate audience declaration.
- Preserve the existing shared toggle primitive sizing and styling.

### 4.5 AI Use / disclosure

Use a real Yes/No toggle labelled **AI USE**, preserving a separate internal meaning for general AI assistance.

- Do not assume all AI-assisted writing, ideation, tags, or metadata constitutes YouTube's altered/synthetic-content disclosure.
- If a disclosure field is needed, model it separately with wording that reflects the actual YouTube requirement, and map it only when the content qualifies.
- Preserve legacy `aiUse` values in saved metadata options and packages; add normalization rather than dropping old data.
- Avoid silently changing existing defaults without inspecting migration and product semantics.

### 4.6 Timestamps, Community, Category

Keep Timestamps as an optional field with existing Education timestamp validation behavior. Community remains an independent Yes/No value. Category remains a dropdown populated from the current supported YouTube category list. Do not conflate Community with playlist membership or audience declarations.

## 5. Source inspection and dependencies

Inspect the current branch before coding, including:

- `src/components/metadata/CanonicalMetadataSections.tsx`
- `src/components/metadata/PublishingControls.tsx`
- `src/views/VideoPublisher.tsx`
- `src/views/VideoManager.tsx`
- `src/components/subtoolbox/SubToolboxPrimitives.tsx` and corresponding CSS/reference-library definitions
- Existing YouTube authentication, playlist list/membership, video update, publish transaction, and API proxy services
- Existing Project / ContentBuild / Video Package persistence and saved metadata option tests
- `package.json` scripts and current CI/deployment constraints

Current observed baseline: CanonicalMetadataSections renders Visibility with only three privacy options, renders Location as a plain text input, renders Playlists as free-form text, and defaults Audience/AI values to booleans. Video Manager already has channel playlist data and a separate PublishingControls multi-select; reconcile it with the canonical section instead of adding a second source of truth. Publisher currently serializes playlist IDs as text and casts visibility to the three YouTube privacy values. These are known migration points, not proof that all related API services are absent.

## 6. Implementation slices and gates

### Slice A — Contract and compatibility tests

- Define types for privacy workflow state, selected channel playlists, location selection, and audience/disclosure state.
- Add tests for legacy metadata normalization and saved-option round trips.
- Confirm current auth/channel ownership and API services before creating new ones.

**Gate:** tests document current failures and data compatibility; no UI changes yet.

### Slice B — Shared primitive/control layer

- Add or extend shared dropdown/combobox and explicit Yes/No toggle primitives using ViewTube's standard sizes and styling.
- Keep native accessibility semantics, focus states, keyboard support, and disabled/loading states.
- Update the primitive reference/library source if a required variant does not exist.

**Gate:** primitive-level tests and visual/reference check pass.

### Slice C — Canonical metadata UI

- Add four-option visibility workflow selection with a separate schedule date/time contract.
- Replace playlist text entry with a channel-backed multi-select.
- Replace Location text-only control with a searchable text/dropdown compound control.
- Label Audience as “IS IT MADE FOR KIDS?” and keep its state explicit.
- Keep AI Use independent from the YouTube altered/synthetic-content disclosure.
- Preserve canonical order and existing optional-field density.

**Gate:** component tests confirm values/callbacks, empty/loading/error states, and no duplicated controls.

### Slice D — API and tool adapters

- Wire Publisher playlist fetch/selection to its authenticated channel and existing publish transaction.
- Wire Manager playlist membership to existing add/remove methods and save workflow.
- Map visibility/schedule state to the existing publish transaction bridge without changing the meaning of YouTube `privacyStatus`.
- Map audience/disclosure and location only through supported API fields and existing secure server/proxy boundaries.

**Gate:** API contract tests cover pagination, wrong-channel rejection, authorization expiry, update failures, and schedule validation.

### Slice E — Persistence and round-trip

- Extend Publisher save/current/option payloads to preserve normalized playlist IDs, location identity, audience state, schedule state, and disclosure semantics.
- Restore selected metadata options without duplicate variants, package artifacts, or provenance.
- Keep Project, ContentBuild, and Video Package as the only canonical durable authorities.
- Preserve Manager's published-video ownership and Publisher's unpublished-project ownership.

**Gate:** edit → save → leave → reload retains values; saving an alternative does not overwrite the selected set; selecting an option restores values correctly.

### Slice F — Full verification and deployment receipt

Use the repository's current commands from `package.json`:

- Focused tests for changed components/services.
- `npm run typecheck`
- `npm test -- --run` is **not** assumed valid; use the declared `npm test` script (`vitest run`) or focused `npx vitest run <paths>`.
- `npm run build`
- Applicable governance / document checks.

Then inspect the current Render branch deployment and logs, load the public route, and test the populated Publisher/Manager workflows only with authorized accounts. Record separate evidence for commit, tests, build, deployment, route load, and interactive behavior. Do not claim a test or interaction was performed unless it actually was.

## 7. Official API references

- YouTube playlists list: https://developers.google.com/youtube/v3/docs/playlists/list
- YouTube playlist item insert: https://developers.google.com/youtube/v3/docs/playlistItems/insert
- YouTube playlist item delete: https://developers.google.com/youtube/v3/docs/playlistItems/delete
- YouTube videos resource and update: https://developers.google.com/youtube/v3/docs/videos
- YouTube video resource: https://developers.google.com/youtube/v3/docs/videos#resource
- Google Places Autocomplete: https://developers.google.com/maps/documentation/places/web-service/place-autocomplete

Verify current API support, authorization scopes, quota costs, writable fields, and channel/account restrictions during implementation. Documentation links are references, not proof that the repository already has these integrations configured.

## 8. Acceptance criteria

- [ ] Visibility exposes Public, Private, Unlisted, Scheduled; scheduled state is not sent as a YouTube privacy enum.
- [ ] Playlist dropdown loads the authenticated user's channel playlists, paginates, searches, supports multi-select, and persists stable IDs.
- [ ] Location dropdown supports free text plus provider-backed spelling-tolerant suggestions and preserves normalized place identity.
- [ ] Audience explicitly asks “Is it made for kids?” and supports an unset state.
- [ ] AI Use is distinct from any applicable altered/synthetic-content disclosure.
- [ ] Manager and Publisher share canonical controls/primitives and do not display conflicting duplicates.
- [ ] Manager remains published-video-only; Publisher remains responsible for pre-publication upload and publishing.
- [ ] Existing saved metadata options, Project/ContentBuild/package identity, and asset/provenance lineage remain intact.
- [ ] No secrets are exposed client-side and no parallel playlist, location, metadata, or asset store is created.
- [ ] Relevant tests, typecheck, build, and populated-workflow checks have recorded outcomes.

## 9. Superpowers handoff

Implement in small test-first slices. First inspect current code and existing API/auth/provider patterns; do not presume integrations are missing just because the canonical UI is incomplete. Write/extend tests before changing components. Keep changes scoped and commit-ready. Run adversarial review for the API mapping, ownership boundaries, and persistence compatibility before merging. If an external location provider or secret/configuration is required, document the exact dependency and configuration gate rather than shipping a client-side key.

**Current implementation receipt (2026-10-09):** CanonicalMetadataSections now owns Manager privacy/category/playlist controls instead of duplicating them in PublishingControls; channel playlist options are sourced through the existing authenticated `fetchSimplePlaylists` API in both tools; Publisher has a Scheduled workflow state and datetime input with future-time validation; audience is labelled “IS IT MADE FOR KIDS?”; Manager sends the supported self-declared audience field and recording location through its server API; community and AI Use values are persisted into project publishingMetadata. Shared YouTube category options and focused layout contract tests were updated. **Not yet complete:** provider-backed Maps/Places autocomplete and spelling-tolerant suggestions are not wired because no existing provider/service was found in the branch; audience unset-state migration and full Publisher API mapping still need review; tests/typecheck/build have not been run in this environment. Next: inspect the available secure Maps provider/configuration, implement its server-backed autocomplete and place normalization, then run the focused tests, typecheck, full tests, and production build before deployment.
