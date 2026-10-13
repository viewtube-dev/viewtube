# Project Strategy Brain Integration — Branch Port Audit

**Date:** 2026-10-13  
**Base:** `master/consolidated-feature-integration`  
**Working branch:** `feat/project-strategy-brain-runtime`  
**Scope:** Inspect non-base branch work relevant to project-generation prompts, Brain context, and project/content-package lineage before selectively porting anything.

## Decision

No candidate branch is a safe wholesale merge for this work. Reuse contract ideas and focused tests, not entire divergent feature branches. The first implementation should remain a small vertical slice rooted in the integration branch and preserve the existing owners: BrainRuntime for creator-facing orchestration, CreatorContextResolver for bounded context, prompt registry for prompt identity/versioning, and Project/ContentBuild/Asset Engine for state and provenance.

## Candidate findings

### 1. `feat/metadata-master-studio-hub-v2`

Compare: https://github.com/viewtube-dev/viewtube/compare/master%2Fconsolidated-feature-integration...feat%2Fmetadata-master-studio-hub-v2

**Useful, selectively portable**
- `src/services/metadataMaster.ts` defines a typed package with `projectId`, `contentBuildId`, version, generation time, warnings, score, source and provenance.
- `src/services/metadataMaster.test.ts` tests deterministic scoring, duplicate-tag warnings, and transport-safe handoff payloads.
- `docs/product/studio-hub/04_STUDIO_HUB_INTERACTIONS_WORKFLOWS_HANDOFFS_CONTRACTS.md` states the useful cross-tool contract: Context → Evidence → Specialized Transformation → Typed Result → Handoff → Execution/Measurement → Learning. It also says outputs retain source/version/evidence/confidence/uncertainty/validation, projects own execution, analytics owns measurement, and Brain owns durable validated knowledge.

**Do not port wholesale**
- The branch is substantially behind the integration base.
- Its metadata-master localStorage persistence is not the authority for project-generation history and must not become a competing persistence owner.
- Its package types are metadata-publication contracts, not a project strategy output schema.

**Adoption rule:** Reuse the provenance and deterministic-validation principles, not the service or persistence implementation, for the Project Strategy vertical slice.

### 2. `integration/publisher-metadata-package-persistence`

Compare: https://github.com/viewtube-dev/viewtube/compare/master%2Fconsolidated-feature-integration...integration%2Fpublisher-metadata-package-persistence

**Useful, selectively portable**
- `src/services/publisherMetadataProjectPersistence.ts` binds publisher metadata to an existing Project, ContentBuild, VideoPackage, and versioned metadata assets.
- The service's result carries project identity, ContentBuild identity, package identity, revision, and save mode.

**Do not port wholesale**
- The branch is highly divergent from integration (five commits ahead, hundreds behind in the comparison at audit time).
- Its domain is publisher metadata persistence, not the project-generation prompt path.

**Adoption rule:** Preserve the identity/revision/provenance pattern when Project Strategy generation is eventually recorded as a ContentBuild operation. Do not copy its persistence bridge into the prompt layer.

### 3. `audit/system-convergence-identity-certification`

Compare: https://github.com/viewtube-dev/viewtube/compare/master%2Fconsolidated-feature-integration...audit%2Fsystem-convergence-identity-certification

**Finding:** Contains project UI and primitive changes, but no evidence in the inspected comparison that it implements the missing prompt-to-Brain runtime seam. Excluded from this implementation unless a later targeted diff proves a relevant contract fix.

### 4. Older `feat/metadata-master-studio-hub`

Compare: https://github.com/viewtube-dev/viewtube/compare/master%2Fconsolidated-feature-integration...feat%2Fmetadata-master-studio-hub

**Finding:** Older/overlapping lineage relative to v2. Do not merge both; use v2 as the single reference branch for any further targeted inspection.

## Integration-base source findings

- `src/components/projects/ProjectStudioWorkflow.tsx` calls `generateProjectStrategy(concept, niche, audience, brain)` and writes the returned plan to the selected Project.
- `src/components/ProjectStudio.tsx` independently calls the same legacy generator. Both call paths must migrate together or behavior will diverge.
- `src/services/gemini.ts` owns an inline prompt and direct provider request for `generateProjectStrategy`; this path lacks an explicit prompt-family version, typed generation envelope, and explicit ContentBuild lineage.
- `src/services/brain/runtime/BrainRuntime.ts` is the canonical additive Brain entry point. `BrainModelGateway.ts` is the provider-neutral generation seam.
- `src/services/brain/CreatorContextResolver.ts` resolves creator/channel knowledge, style, project context, linked ContentBuild and provenance, respecting user controls.
- `src/services/asset-engine/GenerationWorkflow.ts` defines the existing generation request/context manifest/receipt contracts. Any durable operation record should use these contracts where applicable rather than inventing a parallel ledger.

## Implementation order

1. Define a versioned Project Strategy prompt family and strict output validator; include clear instruction boundaries so project/user text is data, not prompt instructions.
2. Add a typed service contract carrying project ID, ContentBuild ID (when present), channel ID, source revision/context references, prompt family/version, and request trace.
3. Resolve bounded context through existing Brain/CreatorContext owners and respect disabled personalization/project access.
4. Route model work through the canonical Brain runtime/gateway contract. Do not create a Project-only provider or memory store.
5. Validate all six existing `ProjectPlan` fields before returning. Reject malformed/empty results; do not silently cast arbitrary JSON.
6. Update both callers in one change. Capture the target project's identity before awaiting and avoid applying a response if the selected project/context changed or the user's current plan was edited while generation was running.
7. Record generation provenance/receipt through existing ContentBuild/Asset Engine contracts only where a canonical ContentBuild exists. Never promote generated copy to durable Brain knowledge automatically.
8. Add unit tests for prompt version, schema rejection, bounded context/control behavior, stale response protection, and both callers; run focused tests/typecheck before calling this complete.

## Validation status

This is a source/branch audit only. No code from candidate branches has been merged or cherry-picked. Tests and typecheck have not been run as part of this audit.
