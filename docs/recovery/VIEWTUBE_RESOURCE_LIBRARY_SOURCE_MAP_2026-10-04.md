# ViewTube Resource Library — Recovered Source Map

**Status:** VERIFIED REPOSITORY SOURCE MAP
**Canonical target:** `viewtube-dev/viewtube`
**Date:** 2026-10-04

## Purpose
Record the Resource Library sources already recovered into the repository and their relationships to Analytics, AI Brain, and Projects.

## Verified resource sources
The repository currently contains resource documents including:

- `src/features/resource-library/resources/how-youtube-recommendations-and-discovery-work.md`
- `src/features/resource-library/resources/shorts-vs-long-form-different-systems-signals.md`
- `src/features/resource-library/resources/youtube-metrics-and-dimensions-master-glossary.md`

## Cross-tool relationships
Recovered metadata connects these resources to:

- Analytics
- AI Brain
- Projects
- Content Analysis
- Packaging Intelligence
- Thumbnail Studio
- Opportunity Intelligence

The metrics/glossary resource also connects to VT-SYNC and Intelligence Hub.

## Architectural role
Resource Library is the knowledge/reference layer. Analytics supplies evidence; Brain can use resource knowledge as bounded context; Projects consume the resulting knowledge in creator workflows.

## Evidence rule
A resource being present in the repository establishes source availability, not that every downstream integration is implemented. Integration claims require current code and verification.

## Deduplication rule
Do not create another general Resource Library master if these existing resources and the canonical creator-workspace document already provide the required authority. Add narrowly scoped source documents only when a missing artifact is actually recovered.
