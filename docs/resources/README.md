# ViewTube Resource Library

This folder documents the creator-facing **Resource Library** at `/resources`. The application reads registered Markdown from `src/features/resource-library/resources/`.

## Source-of-truth rules

- **Runtime content authority:** the Markdown files imported by `src/features/resource-library/resourceLibraryRegistry.ts` under `src/features/resource-library/resources/`.
- **Registry authority:** `src/features/resource-library/resourceLibraryRegistry.ts` controls stable IDs, metadata, search terms and runtime imports.
- **Presentation authority:** `src/features/resource-library/ResourceDocumentRenderer.tsx` and its shared styles.
- **Historical/editorial mirrors:** files under `docs/resources/library/` preserve the original three creator-first guides and their editorial provenance. They must not be independently edited. When a change is needed, update the runtime source first and deliberately synchronize the mirror in the same change.
- PDFs, screenshots and exports are derivatives, never competing authorities.
- Git history is the authority for prior revisions. Older draft files are research donors, not extra published resources.

## Current Collection

| ID | Resource | Category | Runtime source |
|---|---|---|---|
| `youtube-recommendations-discovery` | How YouTube Finds Viewers for Your Videos | YouTube Strategy | `src/features/resource-library/resources/how-youtube-recommendations-and-discovery-work.md` |
| `youtube-metrics-dimensions-glossary` | How to Read YouTube Analytics | Analytics | `src/features/resource-library/resources/youtube-metrics-and-dimensions-master-glossary.md` |
| `shorts-vs-long-form-signals` | Shorts vs Long-Form: Different Systems, Different Signals | YouTube Strategy | `src/features/resource-library/resources/shorts-vs-long-form-different-systems-signals.md` |
| `publishing-best-practices-preflight` | Publishing Best Practices and Preflight Checklist | Publishing | `src/features/resource-library/resources/publishing-best-practices-and-preflight-checklist.md` |
| `thumbnail-title-packaging-handbook` | Thumbnail and Title Packaging Handbook | YouTube Strategy | `src/features/resource-library/resources/thumbnail-and-title-packaging-handbook.md` |
| `audience-retention-watch-behavior` | Audience Retention and Watch Behavior Guide | Analytics | `src/features/resource-library/resources/audience-retention-and-watch-behavior-guide.md` |
| `traffic-sources-discovery-pathways` | Traffic Sources and Discovery Pathways | Analytics | `src/features/resource-library/resources/traffic-sources-and-discovery-pathways.md` |
| `audience-subscribers-returning-viewers` | Audience, Subscribers and Returning Viewers | Audience | `src/features/resource-library/resources/audience-subscribers-and-returning-viewers.md` |
| `youtube-revenue-monetization-fundamentals` | YouTube Revenue and Monetization Fundamentals | Monetization | `src/features/resource-library/resources/youtube-revenue-and-monetization-fundamentals.md` |
| `live-streaming-operations-handbook` | Live Streaming Operations Handbook | Publishing | `src/features/resource-library/resources/live-streaming-operations-handbook.md` |
| `playlist-series-channel-architecture` | Playlist, Series and Channel Architecture Guide | YouTube Strategy | `src/features/resource-library/resources/playlist-series-and-channel-architecture-guide.md` |
| `comments-community-audience-feedback` | Comments, Community and Audience Feedback Playbook | Audience | `src/features/resource-library/resources/comments-community-and-audience-feedback-playbook.md` |
| `content-planning-experiments-learning-loops` | Content Planning, Experiments and Learning Loops | YouTube Strategy | `src/features/resource-library/resources/content-planning-experiments-and-learning-loops.md` |
| `copyright-rights-reuse-ai-generated-media` | Copyright, Rights, Reuse and AI-Generated Media Reference | Publishing | `src/features/resource-library/resources/copyright-rights-reuse-and-ai-generated-media-reference.md` |
| `reading-analytics-correctly-scope-windows-missingness` | Reading Analytics Correctly: Scope, Windows, Missingness and Statistical Traps | Analytics | `src/features/resource-library/resources/reading-analytics-correctly-scope-windows-missingness-and-statistical-traps.md` |

The fifteen IDs above are the published collection. The seven shorter files with older, abbreviated names under the runtime directory are unregistered historical drafts for guides 9–15; they are not additional resources. Compare them before any archival or deletion, and preserve their unique material and Git history.

## Editorial status

The first three guides are the current depth and audience benchmark: long-form, creator-facing, plain-language, evidence-aware and organized around real creator questions. Guides 4–15 are undergoing a substantive content-quality pass. Standardized frontmatter and section headings alone do not mean a guide is editorially complete.

Each guide should help a beginner understand the subject, apply it to a real channel decision, interpret evidence, recognize uncertainty, and decide what to do next. Technical/API material belongs in optional Advanced Reference sections. Reading-time metadata must be based on actual content, not aspirational targets.

## Canonical template

Use `templates/VIEWTUBE_RESOURCE_DOCUMENT_TEMPLATE.md`. Every resource should explain the subject in plain creator language, show why it matters, teach diagnosis/action, connect to relevant ViewTube workflows, prevent common misinterpretations, include a useful glossary and source links, and retain review metadata.

## Add or revise a resource

1. Inspect current source and Git history before editing; compare older drafts and donor-repository versions.
2. Research and verify important claims against primary sources.
3. Author the runtime Markdown using the canonical template and stable resource ID.
4. Use one meaningful concept per `##` section because each becomes a SubToolbox.
5. Include worked creator examples, decision procedures, checklists and explicit caveats where they genuinely help.
6. Register or update metadata only when necessary; do not change stable IDs casually.
7. Update this inventory and the handoff/source map when authority or collection state changes.
8. Run registry/parser tests, render-contract tests, typecheck, lint and production build; distinguish new failures from baseline failures.
9. Inspect desktop and mobile rendering before calling the resource complete.

## Historical donor repository

The original repository `themotionvisual/ViewTubeBUILD` preserves the September 2026 technical drafts and creator-facing rewrites of guides 1–3. See the [recommendations guide history](https://github.com/themotionvisual/ViewTubeBUILD/commits/main/docs/resources/library/how-youtube-recommendations-and-discovery-work.md), [analytics guide history](https://github.com/themotionvisual/ViewTubeBUILD/commits/main/docs/resources/library/youtube-metrics-and-dimensions-master-glossary.md), and [Shorts guide history](https://github.com/themotionvisual/ViewTubeBUILD/commits/main/docs/resources/library/shorts-vs-long-form-different-systems-signals.md). Preserve the creator-first rewrites as the main learning path; recover technical detail only when it improves accuracy or belongs in Advanced Reference.
