# ViewTube Findings Register

**Purpose:** Single durable register for bugs, code-structure issues, discoveries, tool improvements, new-tool ideas, workflow improvements, handoff improvements, AI improvements, UX opportunities, optimization opportunities, and technical risks.

This is a register, not a replacement for detailed domain documents. Large findings should link to their detailed audit, plan, architecture, or implementation artifact.

## Finding schema
| Field | Required |
|---|---|
| ID | Yes |
| Category | Yes |
| Title | Yes |
| Affected area/tool/file | Yes when known |
| Discovery | Yes |
| Source | Yes |
| Evidence | Yes when available |
| Status | Yes |
| Impact | Yes when material |
| Recommended improvement | Yes when applicable |
| Proposed implementation | When applicable |
| Dependencies | When applicable |
| Related docs | When applicable |
| Verification needed | Yes |
| Owner/next action | When known |

## Categories
BUG · REGRESSION · CODE_STRUCTURE · ARCHITECTURE · TOOL_IMPROVEMENT · NEW_TOOL · WORKFLOW · HANDOFF · AI_IMPROVEMENT · UX_PRODUCT · PERFORMANCE · SECURITY_RELIABILITY · DATA_MODEL · TESTING_VERIFICATION · DEPENDENCY · DEPLOYMENT

## Priority
- P0: blocks core operation/security or causes severe data loss
- P1: major user/project impact or significant architectural risk
- P2: meaningful improvement, recurring friction, or technical debt
- P3: useful optimization or future opportunity

## Active findings
<!-- Agents append findings here. Detailed findings belong in linked artifacts when needed. -->

## Reconciliation
During Round 2, merge duplicate findings, preserve conflicting evidence, establish authoritative status, and link implemented fixes back to the original finding.


## Conversation findings — Analytics / Data Visuals — 2026-10-04

### FIND-20261004-AN-001 — Analytics JSON bundle rejected by running import surface
| Field | Value |
|---|---|
| ID | FIND-20261004-AN-001 |
| Category | BUG / DATA_MODEL / UX_PRODUCT |
| Affected area/tool/file | `/local-analytics` import flow; Analytics/Data Visuals fixtures |
| Discovery | A versioned JSON file intended as a ViewTube Analytics Bundle was imported into the running ViewTube site, but the UI displayed **“THIS IS NOT A VIEWTUBE ANALYTICS BUNDLE.”** |
| Source | Current conversation screenshot and user report |
| Evidence | Observed UI state; canonical-main code search found no matching error text, so the current-main implementation path is not yet established |
| Status | REPORTED |
| Impact | Blocks the attempted JSON fixture import and prevents reliable use of the supplied analytics dataset |
| Recommended improvement | Establish and document one canonical Analytics bundle schema, validate it with explicit schema/version errors, and provide individual CSV import as a supported recovery/test path |
| Proposed implementation | Trace the import validator in the canonical runtime; add schema/version diagnostics; add fixture validation before import |
| Dependencies | Canonical current-main analytics importer and fixture schema |
| Verification needed | Reproduce against current `viewtube-dev/viewtube/main` and identify the exact accepted format |
| Owner/next action | Analytics implementation/reconciliation |

### FIND-20261004-AN-002 — Null-value assignment error on /local-analytics
| Field | Value |
|---|---|
| ID | FIND-20261004-AN-002 |
| Category | BUG |
| Affected area/tool/file | `/local-analytics` |
| Discovery | Browser console reported **“Cannot set properties of null (setting 'value')”** after the Analytics route committed |
| Source | Current conversation browser-console capture |
| Evidence | Console log supplied in conversation; current-main code search did not locate the exact error text |
| Status | REPORTED |
| Impact | Indicates a DOM/state synchronization path is attempting to write through a missing element/reference and may break import or control initialization |
| Recommended improvement | Trace the null target, guard initialization/update paths, and add a regression test for the affected control |
| Proposed implementation | Reproduce in the canonical runtime; identify the selector/ref/state owner; fail safely when the target is unavailable |
| Dependencies | Canonical Analytics runtime source |
| Verification needed | Reproduction and stack trace from current main |
| Owner/next action | Analytics/runtime reconciliation |

### FIND-20261004-AN-003 — Persisted toolbox-open helper was undefined
| Field | Value |
|---|---|
| ID | FIND-20261004-AN-003 |
| Category | BUG / CODE_STRUCTURE |
| Affected area/tool/file | Toolbox persistence / Analytics route bootstrap |
| Discovery | An earlier running-app error displayed **“readPersistedToolboxOpen is not defined.”** |
| Source | Current conversation screenshot |
| Evidence | User-provided runtime error screenshot; current-main code search found no matching symbol |
| Status | REPORTED |
| Impact | Can interrupt route/bootstrap execution before the Analytics surface is usable |
| Recommended improvement | Establish one shared, imported toolbox persistence utility rather than relying on an undeclared route-local/global helper |
| Proposed implementation | Locate the canonical toolbox persistence implementation, make the dependency explicit, and add route-level bootstrap tests |
| Dependencies | Current toolbox persistence code in canonical runtime |
| Verification needed | Reproduce and trace the missing symbol in current main |
| Owner/next action | Toolbox/runtime reconciliation |

### FIND-20261004-AN-004 — Analytics fixture temporal coverage is insufficient unless intentionally varied
| Field | Value |
|---|---|
| ID | FIND-20261004-AN-004 |
| Category | DATA_MODEL / TESTING_VERIFICATION |
| Affected area/tool/file | Data Visuals analytics fixtures |
| Discovery | The conversation explicitly required traffic-by-day, daily, upload-time, and successful-video statistics to span all days/times and occur at different dates/times so consistency can be evaluated |
| Source | Current conversation and Analytics screenshots |
| Evidence | User-specified fixture requirements |
| Status | PROPOSED |
| Impact | Narrow or clustered fixture timestamps can produce misleading conclusions about successful upload timing or consistency |
| Recommended improvement | Build a fixture validator requiring seven-day coverage, multiple dates, multiple time-of-day buckets, and non-clustered successful-video observations |
| Proposed implementation | Add dataset-level validation before import and a deterministic fixture generator with configurable distributions |
| Dependencies | Canonical Analytics fixture schema |
| Verification needed | Verify actual current fixture coverage and importer expectations |
| Owner/next action | Analytics data-model/test reconciliation |

### FIND-20261004-AN-005 — Individual CSV import is a useful interoperability fallback
| Field | Value |
|---|---|
| ID | FIND-20261004-AN-005 |
| Category | TOOL_IMPROVEMENT / WORKFLOW / DATA_MODEL |
| Affected area/tool/file | Analytics fixture import |
| Discovery | After the JSON bundle failed, the conversation moved toward producing a ZIP containing individual CSV files |
| Source | Current conversation |
| Evidence | User request and observed bundle-import failure |
| Status | PROPOSED |
| Impact | Individual datasets are easier to inspect, validate, replace, and diagnose than one opaque bundle when schema compatibility is uncertain |
| Recommended improvement | Support explicit per-dataset CSV imports and a documented manifest/schema version for bundle imports |
| Proposed implementation | Define canonical CSV schemas for traffic-by-day, videos, countries, daily, upload-times, and successful-video analysis; validate headers and types |
| Dependencies | Canonical Analytics data model and importer |
| Verification needed | Confirm which CSV datasets the current runtime accepts |
| Owner/next action | Analytics import/data-model design |

### Health review for this conversation
- Authority: **VERIFIED** for the canonical owner `docs/Analytics.md`; runtime implementation authority remains **UNKNOWN** for the reported errors.
- Duplication: **REVIEWED**; no new competing Analytics canonical document was created.
- Provenance: **VERIFIED** for the findings as conversation evidence; runtime root causes remain **UNKNOWN**.
- Preservation: **VERIFIED** for the material Analytics/Data Visuals requirements captured here.
- Metadata: **ATTENTION** — existing `docs/Analytics.md` has limited formal document metadata; no new competing file was created.
- Links: **UNKNOWN** for a repository-wide link scan in this operation.
- Status: findings are explicitly marked REPORTED/PROPOSED rather than upgraded to implementation facts.
- Conflicting claims: no authoritative runtime contradiction was found; current-main code searches did not locate the reported symbols/error strings.
- Orphaned recovery material: **UNKNOWN** repository-wide.
- Obsolete paths: **UNKNOWN** repository-wide.


### FINDING-20261004-COPY-001 — Incomplete tool/widget inventory
- **Category:** TOOL_IMPROVEMENT / WORKFLOW / UX_PRODUCT
- **Affected area:** Dashboard, Toolbox/SubToolbox, Projects, Vault, AI Brain, Resources, Analytics, Settings, User Guide, Editor
- **Discovery:** A single Dashboard registry/count cannot safely be treated as the complete ViewTube tool inventory.
- **Source:** Current conversation; historical tool-copy workstream
- **Evidence:** Historical work produced a 68-widget assumption that the user later rejected as incomplete. Canonical main has not yet been fully reconciled.
- **Status:** VERIFIED DISCOVERY
- **Impact:** Incomplete inventory would produce missing or incorrect contextual help and User Guide coverage.
- **Recommended improvement:** Reconcile registries, routes, toolbox definitions, page-native tools, and non-UI capabilities into one manifestation inventory.
- **Verification needed:** Canonical code inspection and UI registry reconciliation.
- **Owner/next action:** Tool-copy knowledge workstream.

### FINDING-20261004-COPY-002 — Contextual help should project from canonical tool knowledge
- **Category:** UX_PRODUCT / WORKFLOW / AI_IMPROVEMENT
- **Affected area:** Tool/widget contextual ? and Learn More
- **Discovery:** The user defined the ? panel as a one-tool User Guide.
- **Source:** Current conversation
- **Status:** PROPOSED
- **Impact:** Independent copy creates stale or contradictory help.
- **Recommended improvement:** Maintain one canonical tool record and project concise ? copy plus expanded Learn More from it.
- **Verification needed:** Inspect current help implementation and rendering path.
- **Owner/next action:** Tool-copy knowledge workstream.

### FINDING-20261004-COPY-003 — Manifestation-level tool identity
- **Category:** ARCHITECTURE / DOCUMENTATION
- **Affected area:** Tool/widget/module catalog
- **Discovery:** Tool identity needs exact title, page, manifestation type, module/widget/tool name, and canonical ID.
- **Source:** Current conversation
- **Status:** PROPOSED
- **Impact:** Prevents backend services and similarly named Dashboard/Toolbox tools from being incorrectly merged.
- **Verification needed:** Reconcile current IDs and registries.

### FINDING-20261004-COPY-004 — Separate Dashboard and Toolbox ownership
- **Category:** ARCHITECTURE / UX_PRODUCT
- **Affected area:** Dashboard Widget system; Toolbox/SubToolbox system
- **Discovery:** Matching primitives do not imply shared ownership.
- **Source:** User-approved decision in current conversation
- **Status:** PROPOSED
- **Impact:** Prevents incorrect architectural/documentation consolidation.
- **Recommended improvement:** Maintain separate authorities and explicitly link shared primitives.
- **Verification needed:** Inspect current UI architecture.

### FINDING-20261004-COPY-005 — Implementation evidence required for current-state copy
- **Category:** UX_PRODUCT / TESTING_VERIFICATION
- **Affected area:** Tool descriptions and contextual help
- **Discovery:** Copy can overstate ranking, algorithmic, CTR, demand, or performance outcomes.
- **Source:** Current conversation copy audit
- **Status:** VERIFIED DISCOVERY
- **Recommended improvement:** Require implementation/evidence verification before marking copy as current product truth.
- **Verification needed:** Tool-by-tool implementation tracing.
