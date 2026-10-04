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
