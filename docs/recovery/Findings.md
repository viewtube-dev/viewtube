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

### FIND-20261004-WIDGET-001 — UI Reference Library must be the production visual reference implementation
| Field | Value |
|---|---|
| ID | FIND-20261004-WIDGET-001 |
| Category | ARCHITECTURE / UX_PRODUCT / DOCUMENTATION |
| Affected area/tool/file | Widget UI Reference Library; Widget primitives/components |
| Discovery | The UI Reference Library is intended to contain/render the actual production primitives and serve as their visual representation of the shared style, token, default-size, state, and responsive system. |
| Source | Current conversation; canonical `docs/UI.md` reconciliation |
| Evidence | Existing `docs/UI.md` already stated the Library represents actual primitives/reference representatives; repository search found corroborating UI reconciliation requirements. |
| Status | VERIFIED DISCOVERY |
| Impact | Prevents a second parallel reference implementation from drifting away from production primitives. |
| Recommended improvement | Trace the Library to production primitive imports and use rendered Library examples as the shared visual baseline. |
| Verification needed | Source-level inspection of canonical primitive, token, size, CSS, Library, and Widget consumer paths. |

### FIND-20261004-WIDGET-002 — Widget default sizes are layout defaults, not rigid component dimensions
| Field | Value |
|---|---|
| ID | FIND-20261004-WIDGET-002 |
| Category | ARCHITECTURE / UX_PRODUCT |
| Affected area/tool/file | Widget size system; primitives/components |
| Discovery | Established Widget sizes are default sizes used when building Widget layouts; components and primitives remain adaptable to other contextual sizes. |
| Source | Current conversation; `docs/UI.md` |
| Evidence | Canonical UI document now records this rule. |
| Status | VERIFIED DISCOVERY |
| Impact | Prevents false-positive UI audits and unnecessary proliferation of size-specific primitives. |
| Recommended improvement | Audit size usage for semantic/layout correctness rather than exact pixel equality. |
| Verification needed | Trace actual size tokens/definitions and representative rendered consumers. |

### FIND-20261004-WIDGET-003 — Four-way Widget UI reconciliation classification
| Field | Value |
|---|---|
| ID | FIND-20261004-WIDGET-003 |
| Category | WORKFLOW / TESTING_VERIFICATION / ARCHITECTURE |
| Affected area/tool/file | Widget UI audits and implementation workflow |
| Discovery | Widget reconciliation should classify findings as exactly CANONICAL, DRIFT, DEFECT, or INTENTIONAL. |
| Source | Current conversation; user-approved decision |
| Evidence | User explicitly selected the four classifications and clarified situation-dependent corrective action for defects. |
| Status | VERIFIED DISCOVERY |
| Impact | Separates consumer drift from shared-system defects and legitimate Widget-specific behavior. |
| Recommended improvement | Make the four classifications the standard output of Widget UI audits and route each classification to the appropriate implementation action. |
| Verification needed | Apply to a representative Widget cohort. |

### FIND-20261004-WIDGET-004 — Primitive correction is situation-dependent
| Field | Value |
|---|---|
| ID | FIND-20261004-WIDGET-004 |
| Category | ARCHITECTURE / WORKFLOW / TOOL_IMPROVEMENT |
| Affected area/tool/file | Widget primitives/components and consumers |
| Discovery | A shared UI problem may require fixing an existing primitive/component, changing token/size behavior, adding a variant, creating a new primitive/component, or fixing the consumer depending on evidence. |
| Source | Current conversation; user clarification |
| Status | VERIFIED DISCOVERY |
| Impact | Prevents both under-generalizing shared defects and over-generalizing legitimate variations. |
| Recommended improvement | Require audit evidence to identify semantic scope before selecting corrective action. |
| Verification needed | Exercise the decision rule against real Widget discrepancies. |


### FIND-20261004-WIDGET-005 — Canonical main has no verifiable Widget runtime source surface
| Field | Value |
|---|---|
| ID | FIND-20261004-WIDGET-005 |
| Category | CODE_STRUCTURE / ARCHITECTURE / DEPLOYMENT / TESTING_VERIFICATION |
| Affected area/tool/file | Widget runtime; production primitives; UI Reference Library; Widget CSS/tokens/consumers |
| Discovery | The previously referenced runtime paths `src/views/dashboard/widgets/UIReferenceLibraryWidget.tsx`, `src/views/dashboard/widgets/WidgetPrimitives.tsx`, and `src/views/dashboard/widgets/WidgetPrimitiveExtensions.tsx` are not present on canonical `main`. The recursive `main` tree currently exposes `src/features/resource-library` as the only application-source subtree found in the source tree inspection. |
| Source | Canonical `viewtube-dev/viewtube/main` tree inspection at 2026-10-04 22:12:28 EDT; preserved `recovery/pre-document-system-migration-2026-10-04` tree inspection |
| Evidence | Direct GitHub fetch of each named source path returned 404; recursive tree inspection of both `main` and the preserved pre-migration branch found no matching Widget primitive/Reference Library source paths. Repository code search also returned no matches for the named symbols. |
| Status | VERIFIED DISCOVERY / BLOCKED |
| Impact | The planned source-level Widget reconciliation cannot yet certify runtime behavior, classify real consumers, or safely implement Widget fixes because the canonical runtime implementation surface is absent/unresolved. |
| Recommended improvement | Recover or identify the authoritative runtime source repository/branch before changing Widget implementation. Do not reconstruct production Widget code from documentation alone. Once source authority is established, rebuild the source map and apply the four-way audit. |
| Proposed implementation | Trace repository history/branches and known historical ViewTube source locations; identify the authoritative implementation tree; preserve recovered source as evidence; then inventory primitives, tokens, sizes, CSS, Reference Library, and representative consumers. |
| Dependencies | Authoritative runtime source location; branch/repository reconciliation; source provenance |
| Verification needed | Establish the exact canonical runtime source and verify it against `main`/deployment provenance before any implementation change. |
| Owner/next action | Round 2 repository/source reconciliation |

### FIND-20261004-WIDGET-006 — Documentation references a Widget implementation surface that is not currently backed by canonical source
| Field | Value |
|---|---|
| ID | FIND-20261004-WIDGET-006 |
| Category | CODE_STRUCTURE / DOCUMENTATION / RECOVERY |
| Affected area/tool/file | Widget UI governance docs; historical source references |
| Discovery | Current recovery knowledge describes production Widget primitives and a UI Reference Library, while the canonical repository tree does not currently expose the referenced implementation surface. |
| Source | Current Widget governance handoff plus canonical repository inspection |
| Evidence | Governance claims are preserved as conversation/documentation evidence; implementation existence is not verified in canonical main. |
| Status | BLOCKED / UNKNOWN IMPLEMENTATION |
| Impact | Future agents could incorrectly treat recovered architecture descriptions as proof that the implementation exists in current main. |
| Recommended improvement | Keep documentation decisions and implementation verification explicitly separated; mark runtime alignment BLOCKED until source authority is recovered. |
| Verification needed | Source/deployment provenance reconciliation. |
| Owner/next action | Recovery/source-map reconciliation |


### FIND-20261004-WIDGET-007 — Widget runtime source recovered in ViewTubeBUILD
| Field | Value |
|---|---|
| ID | FIND-20261004-WIDGET-007 |
| Category | RECOVERY / CODE_STRUCTURE / ARCHITECTURE |
| Affected area/tool/file | Widget primitives, UI Reference Library, Widget CSS/tokens, Toolbox/Studio Hub component library |
| Discovery | The previously missing Widget implementation surface is present in the accessible `themotionvisual/ViewTubeBUILD` repository. Its source map identifies `WidgetPrimitives.tsx`, `WidgetPrimitiveExtensions.tsx`, `widgetPrimitiveSystem.ts`, primitive CSS layers, palette authority, and `UIReferenceLibraryWidget.tsx` as current production owners. |
| Source | `themotionvisual/ViewTubeBUILD/main`; `.claude/skills/viewtube-widget-dashboard-system/references/source-code-map.md`; `primitives-tokens-color.md` |
| Evidence | Recursive source-tree inspection found the complete Widget surface, including the named Reference Library/primitives, 40+ widget implementations, tests, and Reference Studio sources. Direct file reads verified the implementations. |
| Status | VERIFIED RECOVERY SOURCE / NOT YET CANONICAL TARGET |
| Impact | The Widget audit can now proceed against recovered production evidence, but `viewtube-dev/viewtube/main` must not be assumed equivalent or overwritten. Repository provenance and migration/selection remain unresolved. |
| Important architecture | `WidgetPrimitives.tsx` is the primary consumer import surface; `WidgetPrimitiveExtensions.tsx` is documented as a temporary compatibility/implementation module; `widgetPrimitiveSystem.ts` owns the shared size/tone/state API; CSS layers own exact geometry/tones/variants/responsive behavior; `UIReferenceLibraryWidget.tsx` is the dashboard Reference Library surface. |
| Verified system facts | Primitive sizes are 18/24/32/38px; tones are default/primary/secondary; states include default/selected/active/loading/disabled/success/warning/danger/info; size tokens define height/font/radius/stroke/shadow/padding/gap/icon/icon-stroke; palette authority is `src/styles/toolboxPalette.ts` with a 12-color spectrum. |
| Recommended improvement | Treat ViewTubeBUILD as recovered implementation evidence and perform controlled repository reconciliation before any copy/migration. Establish whether it is the intended canonical implementation source, a recovery source, or a related branch/repository. |
| Verification needed | Compare repository identity/history, deployment provenance, and intended canonical ownership; then compare recovered source to `viewtube-dev/viewtube/main` before moving/copying code. |
| Owner/next action | Round 2 repository reconciliation |
