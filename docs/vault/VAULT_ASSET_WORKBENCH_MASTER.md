# ViewTube Vault / Asset Workbench Master

**Status:** RECONSTRUCTION MASTER / IMPLEMENTATION NOT CLAIMED  
**Purpose:** Define the complete Vault/Asset Workbench system and tool inventory while preserving the distinction between verified implementation and planned capability.

## System boundary
The Workbench is the operational interface over ViewTube asset/media capabilities.

Target flow:

`asset source → ingestion → inspection → metadata → editing/transformation → derivatives → collections → discovery → lineage/provenance → rights/usage → workflow/operations → Projects/ContentBuild`

## Required tool families

### Media inspection
- image preview
- video preview
- audio preview
- technical metadata
- EXIF where available
- dimensions/duration/codec/container
- asset health/validation

### Editing and transformation
- crop
- resize
- format conversion
- image adjustments
- derivative generation
- batch transformation where supported

### Organization
- collections
- search
- filtering
- discovery
- tagging/classification
- related assets

### Governance
- lineage/provenance
- rights/usage
- source attribution
- lifecycle/state
- version/derivative relationships
- destructive-action controls

### Workflow
- operations
- processing state
- retry/error state
- import/export
- Projects integration
- ContentBuild integration

## Tool record contract
Every tool must eventually record:

| Field | Requirement |
|---|---|
| Name | canonical tool name |
| Purpose | user outcome |
| Inputs | accepted asset/data types |
| Outputs | generated/changed records |
| Owner | canonical subsystem |
| Dependencies | runtime dependencies |
| State | lifecycle/operation states |
| Permissions | authorization boundary |
| Consequence | reversible/destructive/consequential |
| UI entry | Workbench surface |
| Runtime | implementation reference |
| Tests | verification evidence |
| Status | exact implementation status |
| Provenance | source of requirement/design |

## Current evidence
The repository Recovery artifact explicitly identifies Asset/Media Systems as including Asset Engine, Resource Library, asset inspection, image/video/audio tools, metadata/EXIF, rights/usage, derivatives, transformations, and Projects/ContentBuild. The Brain report additionally identifies asset intelligence, metadata/lineage, and Brain integration as future/current architectural seams.

## Important boundary
Do not claim the complete toolset is implemented merely because it is listed here. This is the canonical reconstruction target until each tool is backed by current code and verification.

## Integration targets
- Resource Library
- Projects
- ContentBuild
- Brain/AI
- Analytics evidence where asset performance is relevant
- Account/workspace permissions

## Completion gate
A tool is complete only when its runtime implementation, UI entry point, state/permission behavior, and verification evidence are identified.
