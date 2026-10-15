# ViewTube Resource Library — Source Map and Historical Convergence

**Last verified:** 2026-10-15  
**Canonical target:** `viewtube-dev/viewtube`  
**Runtime branch under remediation:** `master/consolidated-feature-integration`

## Authority map

| Layer | Authority | Rule |
|---|---|---|
| Runtime resource text | `src/features/resource-library/resources/*.md` | Canonical text imported by the app registry |
| Resource identity and metadata | `src/features/resource-library/resourceLibraryRegistry.ts` | Stable IDs, labels, search/category metadata and imports |
| Rendering | `ResourceDocumentRenderer.tsx` and `resource-library.css` | Presentation behavior, not content authority |
| Editorial copies of first three guides | `docs/resources/library/*.md` | Mirrors/historical editorial references; do not independently edit |
| Historical revisions | Git commit history | Use for provenance and recovery |
| Donor repository | `themotionvisual/ViewTubeBUILD` | Earlier versions and editorial provenance; not the runtime authority |
| Unregistered abbreviated drafts | Seven files under runtime resources for topics 9–15 | Research donors, not extra published resources |

## Creator-first history in the donor repository

The donor repository contains the key editorial transition for guides 1–2:

- Guide 1 original technical version: commit `8a17b270837c2682fb53f1ecd059fe77eee6c3ca`; creator-facing rewrite: `574d164dde41cb286e7ef7ec7edd4e9478603b26`; Markdown/Mermaid repair: `1c0256b5f88bead1d1bf264298dbd12c915c3e05`.
- Guide 2 original technical version: `17f318eeb42a735e0efce702a6378a2023358da3`; creator-facing rewrite: `53fe306679cb4b8d30046597010c8e94c7bf7094`; Markdown/Mermaid repair: `b3c97094ba86dca16c3fcdb1c8947cdc2ac1e94e`.
- Guide 3 first tracked creator guide: `5976990635418eaa69788e1fe860535402222bb4`.

History links:
- [Guide 1 history](https://github.com/themotionvisual/ViewTubeBUILD/commits/main/docs/resources/library/how-youtube-recommendations-and-discovery-work.md)
- [Guide 2 history](https://github.com/themotionvisual/ViewTubeBUILD/commits/main/docs/resources/library/youtube-metrics-and-dimensions-master-glossary.md)
- [Guide 3 history](https://github.com/themotionvisual/ViewTubeBUILD/commits/main/docs/resources/library/shorts-vs-long-form-different-systems-signals.md)

**Recovery decision:** keep the creator-facing rewrites as the main learning path. Use the original technical drafts as donors for useful precise definitions and implementation caveats, placing them in optional Advanced Reference sections where appropriate. Do not revert the guides to developer-first organization.

## Resource inventory and content depth

Fifteen resources are registered. The first three are the current detailed benchmark (roughly 4,200–5,200 words). The registered versions of guides 4–15 were previously roughly 600–800 words each and are being expanded to deliver meaningful beginner-facing education. A common template or large number of headings does not establish completeness.

## Seven older unregistered drafts

The following are separate, abbreviated historical drafts. Their full-name counterparts are the registered versions. Compare before archiving or deleting; preserve any unique material.

| Historical draft | Registered counterpart |
|---|---|
| `revenue-and-monetization.md` | `youtube-revenue-and-monetization-fundamentals.md` |
| `live-streaming-operations.md` | `live-streaming-operations-handbook.md` |
| `playlist-series-and-channel-architecture.md` | `playlist-series-and-channel-architecture-guide.md` |
| `comments-community-and-audience-feedback.md` | `comments-community-and-audience-feedback-playbook.md` |
| `content-planning-and-experiments.md` | `content-planning-experiments-and-learning-loops.md` |
| `copyright-rights-reuse-and-ai-media.md` | `copyright-rights-reuse-and-ai-generated-media-reference.md` |
| `analytics-scope-missingness-and-statistical-traps.md` | `reading-analytics-correctly-scope-windows-missingness-and-statistical-traps.md` |

## First three duplicate paths

The first three documents also exist under `docs/resources/library/`. The copies were identical to the runtime files at the time of audit. The runtime versions are what the registry imports. The docs copies are retained for editorial/history continuity but are not independent authorities; synchronize them intentionally whenever the corresponding runtime document changes.

## Architecture and evidence boundaries

Resource Library is general creator/platform knowledge. Analytics supplies channel-specific evidence. AI Brain may use approved resource knowledge as bounded context, but general guidance must not be represented as proof about a specific channel. Projects preserve decisions and outcomes. Presence of a document or metadata link does not prove that a downstream integration is implemented.

## Required convergence actions

1. Preserve donor history and the creator-first editorial contract.
2. Compare the seven old drafts with current counterparts; retain unique information and then label/archive them as historical drafts rather than registering them.
3. Expand guides 4–15 with examples, diagnostics, action checklists, caveats, ViewTube handoffs and topic-specific sources.
4. Recalculate read-time metadata from final word counts.
5. Verify every source link and remove placeholders such as `undefined`.
6. Keep registry IDs stable and run focused tests/build/render checks before merge.
