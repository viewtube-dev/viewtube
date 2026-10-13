# ViewTube Resource Library

This folder contains the canonical Markdown source documents that populate the creator-facing **Resource Library** at `/resources`.

## Authority

- The Markdown document is the editable content authority for each resource.
- The production Resource Library renderer is the presentation authority.
- PDFs, screenshots and future exports are generated derivatives and must not become competing content authorities.
- Research claims should retain evidence status, source provenance and review metadata.

## Current Collection

| ID | Resource | Category | Status | Source |
|---|---|---|---|---|
| `youtube-recommendations-discovery` | How YouTube Finds Viewers for Your Videos | YouTube Strategy | Published | `library/how-youtube-recommendations-and-discovery-work.md` |
| `youtube-metrics-dimensions-glossary` | How to Read YouTube Analytics | Analytics | Published | `library/youtube-metrics-and-dimensions-master-glossary.md` |
| `shorts-vs-long-form-signals` | Shorts vs Long-Form: Different Systems, Different Signals | YouTube Strategy | Published | `library/shorts-vs-long-form-different-systems-signals.md` |
| `publishing-best-practices-preflight` | Publishing Best Practices and Preflight Checklist | Publishing | Published | `src/features/resource-library/resources/publishing-best-practices-and-preflight-checklist.md` |
| `thumbnail-title-packaging-handbook` | Thumbnail and Title Packaging Handbook | YouTube Strategy | Published | `src/features/resource-library/resources/thumbnail-and-title-packaging-handbook.md` |
| `audience-retention-watch-behavior` | Audience Retention and Watch Behavior Guide | Analytics | Published | `src/features/resource-library/resources/audience-retention-and-watch-behavior-guide.md` |
| `traffic-sources-discovery-pathways` | Traffic Sources and Discovery Pathways | Analytics | Published | `src/features/resource-library/resources/traffic-sources-and-discovery-pathways.md` |
| `audience-subscribers-returning-viewers` | Audience, Subscribers and Returning Viewers | Audience | Published | `src/features/resource-library/resources/audience-subscribers-and-returning-viewers.md` |
| `youtube-revenue-monetization-fundamentals` | YouTube Revenue and Monetization Fundamentals | Monetization | Published | `src/features/resource-library/resources/youtube-revenue-and-monetization-fundamentals.md` |
| `live-streaming-operations-handbook` | Live Streaming Operations Handbook | Publishing | Published | `src/features/resource-library/resources/live-streaming-operations-handbook.md` |
| `playlist-series-channel-architecture` | Playlist, Series and Channel Architecture Guide | YouTube Strategy | Published | `src/features/resource-library/resources/playlist-series-and-channel-architecture-guide.md` |
| `comments-community-audience-feedback` | Comments, Community and Audience Feedback Playbook | Audience | Published | `src/features/resource-library/resources/comments-community-and-audience-feedback-playbook.md` |
| `content-planning-experiments-learning-loops` | Content Planning, Experiments and Learning Loops | YouTube Strategy | Published | `src/features/resource-library/resources/content-planning-experiments-and-learning-loops.md` |
| `copyright-rights-reuse-ai-generated-media` | Copyright, Rights, Reuse and AI-Generated Media Reference | Publishing | Published | `src/features/resource-library/resources/copyright-rights-reuse-and-ai-generated-media-reference.md` |
| `reading-analytics-correctly-scope-windows-missingness` | Reading Analytics Correctly: Scope, Windows, Missingness and Statistical Traps | Analytics | Published | `src/features/resource-library/resources/reading-analytics-correctly-scope-windows-missingness-and-statistical-traps.md` |

**Initial creator-reference series:** 15 of 15 documents authored and registered in the application registry. The first three canonical documents remain under `docs/resources/library/`; resources 4–15 use the runtime-safe source directory `src/features/resource-library/resources/`.

## Handoff

For the current implementation map, ingestion workflow, testing contract, known limitations, and next-agent instructions, read:

`RESOURCE_LIBRARY_HANDOFF.md`

## Template

Use:

`templates/VIEWTUBE_RESOURCE_DOCUMENT_TEMPLATE.md`

The template is intentionally semantic and creator-first rather than visually branded or developer-first. Every resource should explain the subject in plain creator language, show why it matters, teach how to diagnose or act on it in ViewTube, and move technical/API detail into optional advanced reference sections. The production renderer converts those structures into the ViewTube Toolbox/SubToolbox UI.

## Add a Resource

1. Research and author the resource as Markdown.
2. Start from the canonical template.
3. Keep the full research in the Markdown source.
4. Put one major concept under each `##` heading so it can become a SubToolbox.
5. Use tables for comparisons, checklists for actions and Mermaid for relationships/processes.
6. Add the source file under `src/features/resource-library/resources/` and register its raw Markdown import and metadata in `RESOURCE_LIBRARY_ENTRIES`.
7. Verify search/filter metadata and direct `?resource=<id>` selection.
8. Run tests, typecheck, lint and production build.
9. Review desktop and mobile rendering before publishing.

## Planned First 15

1. How YouTube Finds Viewers for Your Videos
2. How to Read YouTube Analytics
3. Shorts vs Long-Form: Different Systems, Different Signals
4. Publishing Best Practices and Preflight Checklist
5. Thumbnail and Title Packaging Handbook
6. Audience Retention and Watch Behavior Guide
7. Traffic Sources and Discovery Pathways
8. Audience, Subscribers and Returning Viewers
9. YouTube Revenue and Monetization Fundamentals
10. Live Streaming Operations Handbook
11. Playlist, Series and Channel Architecture Guide
12. Comments, Community and Audience Feedback Playbook
13. Content Planning, Experiments and Learning Loops
14. Copyright, Rights, Reuse and AI-Generated Media Reference
15. Reading Analytics Correctly: Scope, Windows, Missingness and Statistical Traps
