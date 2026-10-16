# ViewTube Vault

**Status:** RECONSTRUCTION / CANONICAL TARGET  
**Scope:** creator asset and media workbench

## Purpose
Vault is the durable asset layer for storing, organizing, inspecting, versioning and reusing creator assets across projects and production workflows.

## Core flow
```text
Asset source
 ↓
Ingestion
 ↓
Metadata / Inspection
 ↓
Transformations
 ↓
Derivatives
 ↓
Collections / Discovery
 ↓
Lineage / Provenance / Rights
 ↓
Projects / Editor / Production
```

## Expected capability areas
Where supported by implementation evidence, the Vault architecture covers:

- image/video/audio preview;
- technical metadata;
- rights and usage;
- editing/crop/resize/conversion;
- derivative generation;
- collections;
- search/discovery;
- inspection;
- lineage/provenance;
- workflow operations;
- Projects/ContentBuild integration;
- lifecycle;
- import/export.

## Tool boundary
The canonical Vault surface should document each implemented capability by purpose, inputs/outputs, owner, dependencies, state, permissions, destructive behavior, UI entry point, runtime evidence and tests.

## Brain relationship
Vault provides asset context and provenance. Brain should reason over asset information without becoming the asset database.

## Current state
Recovered planning establishes this architecture, but current runtime implementation and exact tool inventory require verification. Planned capabilities must not be presented as implemented.

**Primary sources:** Master System Rebuild Resource Plan; Creator Workspaces Master Tool Context; recovery artifacts.


## Complete continuation reference

For the full capability inventory, adaptive Workbench modes, operation and lineage contracts, integrations, security, testing gates, and phased implementation plan, see the canonical [Vault / Asset Workbench — Tools, Capabilities, Plans & Systems Reference](vault/VAULT_ASSET_WORKBENCH_MASTER.md).

This reference defines the target system; individual runtime capabilities must still be verified against canonical source, tests, and runtime behavior.

## Implementation audits

- [Phases 0–2: canonical source, identity/selection, adaptive host](vault/VAULT_PHASES_0_1_2_IMPLEMENTATION_AUDIT.md)
- [Phases 3–6: inspection, operation receipts, media preflight, compare and governance](vault/VAULT_PHASES_3_4_5_6_IMPLEMENTATION_AUDIT.md)
- [Phases 7–10: cross-system workflow, authenticated operation records, batch operations and release gates](vault/VAULT_PHASES_7_8_9_10_IMPLEMENTATION_AUDIT.md)

These audits distinguish implementation from pending CI, runtime, persistent-disk configuration, worker execution, processor-health, cross-system, and AI-provider verification. The server operation API fails closed without `VAULT_OPERATION_STORAGE_DIR` and is not a processing worker.
