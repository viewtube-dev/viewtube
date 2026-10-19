# ViewTube Projects + Analytics Tool Source

**Status:** RECOVERED SOURCE / PRODUCT TOOL CONTEXT
**Canonical target:** `viewtube-dev/viewtube`
**Date:** 2026-10-04

## Purpose
Preserve the page-level tool breakdown recovered from the ViewTube creator-workspace documentation. This is a source/recovery artifact; the repository's canonical product document remains `docs/product/VIEWTUBE_CREATOR_WORKSPACES_MASTER_TOOL_CONTEXT.md`.

## Canonical page-level tools
The recovered workspace context defines 12 page-level tools:

### Projects
1. Project Builder
2. Project Board
3. Project Calendar
4. Storyboard Studio

### AI Brain
5. AI Brain

### Analytics
6. Sync Controller
7. Intelligence Hub
8. Master Data Tables
9. Data Visuals

### Vault
10. Vault

### Editor
11. Editor

### Resource Library
12. Resource Library

## Boundary rule
These are page-level tools. Internal capabilities belong inside each tool's Inputs, Workflow, Outputs, or Connections and should not automatically become additional top-level tools.

## Analytics boundary
The four Analytics tools form one Analytics surface:

- **Sync Controller:** synchronization/control boundary for incoming analytics data.
- **Intelligence Hub:** analytical interpretation and intelligence surface.
- **Master Data Tables:** canonical tabular/data-management surface.
- **Data Visuals:** visual exploration and presentation surface.

The exact implementation/API for these tools must be established from current code before being called implemented.

## Projects boundary
The four Projects tools form one Projects surface:

- **Project Builder:** project creation/configuration.
- **Project Board:** project work/status organization.
- **Project Calendar:** time-based planning.
- **Storyboard Studio:** structured narrative/content planning.

## Cross-system dependencies
Recovered architecture places Projects, Analytics, Vault, and Brain behind shared identity/context boundaries. Resource Library supplies knowledge; Analytics supplies evidence; Brain reasons over bounded inputs; Projects provide work context.

## Evidence discipline
The tool names and page-level grouping are recovered/verified in the repository product document. Functional descriptions above are intentionally bounded and must not be treated as proof of specific APIs or runtime implementation.
