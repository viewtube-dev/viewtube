# Project-System Generation Prompts & AI Brain Integration Plan

**Date:** 2026-10-13  
**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Status:** Implementation plan; runtime changes must be verified separately  
**Scope:** Projects / ContentBuild planning-generation prompts, project-aware context resolution, and the shared Brain runtime connection.

## 1. Executive decision

Optimize the existing project and generation systems by connecting their current owners. Do **not** create a Projects-only Brain, prompt store, project memory database, parallel ContentBuild history, or provider stack.

The first vertical slice is **Project Strategy generation**. Establish one reliable path from the selected Project and its ContentBuild through bounded creator/channel/project context, a versioned project-planning prompt family, a typed JSON output contract, validation, and an auditable result. Once that path is proven, migrate storyboard and other project-generation callers one at a time.

## 2. Authorities read and how they fit together

1. `docs/architecture/VIEWTUBE_INTEGRATED_CONTENT_LIFECYCLE_ANALYTICS_STUDIO_HUB_MASTER_PLAN.md` — end-to-end lineage: Project → ContentBuild → generation/assets/variants → publishing package → publication → analytics → evaluation → governed learning. Reuse existing operation, receipt, evidence and outcome owners.
2. `docs/architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md` — Project owns planning/workflow state; ContentBuild is the durable content identity. Keep project IDs and ContentBuild IDs through specialist tool calls and handoffs.
3. `docs/architecture/VIEWTUBE_ASSET_ENGINE_MASTER_RESOURCE.md` — generation requests, context manifests, receipts, assets, versions, variant groups and provenance belong to the existing Asset Engine contracts.
4. `docs/product/VIEWTUBE_STUDIO_HUB_MASTER_TOOL_ARCHITECTURE.md` — Studio Hub tools have distinct transformations but share Brain, Project, Asset Engine and handoff contracts; tools are not independent persistence owners.
5. `docs/architecture/PRODUCT_ARCHITECTURE.md` — all creator-facing AI should converge on BrainRuntime/BrainModelGateway; Projects, ContentBuild, Asset Engine/Vault, analytics, evidence and learning retain their own ownership.

Supporting implementation authorities consulted: `docs/specifications/PROMPTS.md`, `docs/specifications/prompt-registry.json`, `docs/domains/BRAIN.md`, `docs/product/VIEWTUBE_GENERATION_SYSTEMS_DEFAULT_PROMPTS.md`, and `docs/product/studio-hub/METADATA_GENERATION_PROMPT_SYSTEM_2026-10-06.md`.

## 3. Initial source audit

### Existing foundations to preserve

- `src/services/brain/runtime/BrainRuntime.ts` is the canonical additive creator-facing entry point and delegates orchestration to `BrainOrchestrator`.
- `src/services/brain/runtime/BrainModelGateway.ts` provides the provider-neutral structured/JSON generation seam.
- `src/services/brain/CreatorContextResolver.ts` already resolves bounded creator/channel knowledge, style, Project/ContentBuild, visible context and provenance.
- `src/services/brain/BrainContextBroker.ts` includes Project context when the project-access control permits it.
- `src/services/asset-engine/GenerationWorkflow.ts` already defines `GenerationRequest`, `GenerationContextManifest`, `ToolReceipt`, and canonical ContentBuild scope checks.
- `docs/specifications/prompt-registry.json` already inventories `generateProjectStrategy` as a legacy generator requiring reachability/migration work.

### Confirmed gap in the inspected caller

`src/components/projects/ProjectStudioWorkflow.tsx` calls `generateProjectStrategy(concept, niche, audience, brain)` directly from `src/services/gemini.ts`. That function builds a one-off inline prompt and calls the provider directly. The function returns a typed-by-cast `ProjectPlan`, but the path shown does not pass a canonical Project ID, ContentBuild ID, context manifest, prompt-family version, or generation receipt into that call. The current prompt includes journal context, but this is not equivalent to the full bounded Creator Context contract.

This is a verified code-path finding, not a claim that all project-generation callers behave identically. `ProjectStudio.tsx` is another caller and must be inventoried before changing signatures.

## 4. Target request lifecycle

```text
Selected Project
  + canonical ContentBuild
  + creator request / existing plan
          ↓
Project-generation task contract
          ↓
BrainRuntime (one creator AI entry point)
          ↓
Creator Context Resolver + task-specific evidence selection
          ↓
Versioned Project Strategy prompt family
          ↓
BrainModelGateway / approved model route
          ↓
Typed output validation + bounded repair if needed
          ↓
Creator review / explicit apply
          ↓
Project plan update + generation provenance/receipt
          ↓
Project → ContentBuild → Asset Engine / Studio handoffs
```

The runtime must preserve the current Project and ContentBuild identities. Context is selected and bounded for the task; never concatenate every available profile, asset, conversation, and analytics record into the prompt.

## 5. Implementation waves

### Wave 0 — Establish an executable baseline

- [ ] Inventory all callers of `generateProjectStrategy`, `generateStoryboard`, `generateIdeaSpark`, `generateProjectSuggestions`, and other Project/ContentBuild planning generators.
- [ ] Inspect `BrainRuntimeRequest`, `BrainModelGateway`, `CreatorContextResolver`, task profiles, output schemas, prompt registry and current tests together.
- [ ] Add regression fixtures before behavior changes: rich Project + ContentBuild; Project without linked ContentBuild; no active Project; sparse channel context; project context disabled; stale/conflicting knowledge; provider failure; malformed JSON.
- [ ] Record the actual test commands and baseline results. Do not treat deployment build-rate-limit errors as test evidence.

### Wave 1 — Project Strategy vertical slice (first implementation target)

- [ ] Add a named/versioned project-strategy prompt family under the canonical prompt architecture; do not add another standalone prompt registry.
- [ ] Define the structured input envelope: request intent, Project ID, ContentBuild ID/revision, channel scope, current brief/plan, audience, creator-confirmed constraints, selected evidence refs, context provenance, prompt version and output-schema version.
- [ ] Define and validate a ProjectPlan schema (topic, description, length, audience, vision, hook plus any existing required fields). Avoid unchecked `JSON.parse as ProjectPlan` behavior; reject or bounded-repair invalid output.
- [ ] Extend BrainRuntime through an explicit typed task/output contract rather than forcing a ProjectPlan through the generic conversational response schema.
- [ ] Resolve context through CreatorContextResolver and the existing Brain controls. If Projects or personalization/analytics access is disabled, honor it and record the omission; do not quietly bypass controls.
- [ ] Carry `projectId` and `contentBuildId` through request metadata and, where appropriate, the existing GenerationRequest / ContextManifest / ToolReceipt pathway.
- [ ] Preserve current user-edited fields until the creator explicitly applies generated output; show failure state without overwriting the plan.
- [ ] Update both known Project Strategy callers only after the new contract is stable.

### Wave 2 — Other project generation families

- [ ] Migrate storyboard generation with script/concept context and stable scene output validation.
- [ ] Migrate idea sparks, project suggestions, timeline patches and project-research handoffs by task family.
- [ ] Reuse prompt composition, context manifests, provider routing, schema validation, and trace/provenance primitives; keep each tool's transformation and output schema distinct.
- [ ] Maintain legacy compatibility only during measured migration; remove a direct-provider path only after caller inventory, parity fixtures and production reachability are verified.

### Wave 3 — Project ↔ Asset Engine ↔ Brain continuity

- [ ] Ensure generated plans and storyboards remain attached to the originating Project/ContentBuild and become reusable downstream context without duplicating canonical state.
- [ ] Preserve prompt family/version, output schema version, model requested/served, context version/fingerprint, evidence refs, request/operation ID, output/asset refs and creator selection/rejection where available.
- [ ] Record consequential generation through existing operation/receipt contracts; do not create a project-only activity ledger.
- [ ] Provide handoffs to script/story, Asset Engine, Studio Hub and Publishing Package using existing identity-bearing contracts.
- [ ] Feed outcomes into governed evaluation/learning only after evidence and attribution rules are satisfied. Raw generated output or one successful project must not silently become durable Brain knowledge.

### Wave 4 — Evaluation and rollout

- [ ] Compare the new path against baseline fixtures for schema validity, task completion, creator edit distance/acceptance, factuality, project-context relevance, style fidelity, latency and cost.
- [ ] Test missing/disabled context and provider failure explicitly.
- [ ] Add integration tests proving Project and ContentBuild identity survive generation and subsequent project switching/reload.
- [ ] Update `docs/specifications/PROMPTS.md`, `docs/specifications/prompt-registry.json`, `docs/domains/BRAIN.md`, the Projects/ContentBuild master resource and the integrated lifecycle plan when runtime behavior actually changes.
- [ ] Record commit, changed paths, test output, remaining gaps and next action. Do not mark a migration complete on documentation alone.

## 6. Prompt precedence and composition

Follow canonical precedence:

1. safety/system rules and permission controls;
2. factual/evidence rules and explicit missingness;
3. creator's current explicit request;
4. confirmed creator/channel preferences;
5. current Project/ContentBuild intent and constraints;
6. fresh, scope-compatible measured evidence;
7. accepted style patterns and validated knowledge;
8. clearly labeled hypotheses/inferred patterns;
9. generic task-family defaults.

Compose: shared policy + task family + bounded Creator Context + Project/ContentBuild context + selected evidence + creator request + constraints + typed output schema + deterministic validation. Keep prompt versions and schema versions explicit. A model-inferred preference must not override a creator-confirmed preference; a prediction must not be presented as measured fact.

## 7. Acceptance criteria for the first vertical slice

The Project Strategy migration is ready to ship only when:

- A strategy request is tied to the selected Project and its canonical ContentBuild, when present.
- A project switch cannot accidentally apply an older request's result to the newly selected Project.
- Project/analytics/personalization controls are respected.
- The model receives a bounded, task-relevant context and does not get unsupported analytics claims.
- Output is validated against the ProjectPlan schema before the Project is updated.
- Existing manual edits are not silently overwritten by generation or retry.
- Prompt family/version, schema version, model, context provenance and request identity are inspectable.
- Failure, missing context and malformed output are tested.
- Both known callers are migrated or explicitly documented as remaining legacy callers.
- Relevant tests pass with recorded command/output; no completion claim is based solely on source edits or deployment status.

## 8. Non-goals

- Creating a second AI Brain or project-memory store.
- Replacing Projects/ContentBuild, Asset Engine/Vault, analytics-canon, publishing or learning ownership.
- Migrating every legacy generator in one change.
- Automatically applying plans, publishing content, or promoting raw generations to durable knowledge.
- Treating the Studio Hub architecture catalog as proof that every listed tool/capability is already implemented.

## 9. Current status

- [x] Read the five requested architecture documents on `master/consolidated-feature-integration`.
- [x] Read the current prompt/Brain authority documents and inspect the Project Strategy caller and generation path.
- [x] Identify the first concrete legacy seam: Project Strategy calls `src/services/gemini.ts` directly with no explicit Project/ContentBuild identity in the request.
- [ ] Add tests and establish baseline.
- [ ] Implement the typed BrainRuntime Project Strategy contract.
- [ ] Migrate the first caller and verify behavior.
