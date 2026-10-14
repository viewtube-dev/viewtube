# ViewTube Branch Integration Audit — 2026-10-14

## Purpose and decision

This audit checks the recent creator/editor, Script Architect, Studio primitive, Vault-workbench PRs and the changes that exist on `main` but must be reconciled into `master/consolidated-feature-integration`.

**Do not merge `main` wholesale into the integration branch.** GitHub's compare reports the branches have diverged: `main` is 30 commits ahead and 949 commits behind, with merge base `3b26ccd46e48601aa9d3d9897229c08d6207b3de`. A direct branch merge would drag a large amount of unrelated older history into the canonical integration branch.

Instead, compare file content and behavior, retain the more advanced integration implementation where it already contains the main-branch work, and port only useful missing behavior.

## Main-branch reconciliation findings

| Area | Finding | Disposition |
|---|---|---|
| Recovery docs, Vault docs, Vault Asset Workbench master resource | The checked versions have identical Git blob SHAs on `main` and `master/consolidated-feature-integration`. | Already reconciled; no overwrite needed. |
| Resource Library registry and checked resource documents | Registry, tests, README/handoff, and checked audience, community, planning, rights, live-streaming, playlist, publishing, analytics, thumbnail/title, traffic, and revenue resources have identical blobs. | Already reconciled; no copy needed. |
| Studio/SubToolbox CSS | Integration's `src/styles/subtoolbox-system.css` is substantially larger and reflects the newer consolidation work; main's version is stale relative to integration. | Keep integration's version; do not copy main over it. |
| Crop presets and editor navigation | Integration contains the expanded crop implementation, including focal-point support and the current aspect-ratio controls; main has an older, smaller version. | Keep integration's implementation. |
| `trimClipSourceBounds.ts` on main | The helper is absent from the current integration tree and is not called by the integrated trim path. Existing trim-to-playhead and source-slip controls are already integrated. Copying this helper alone would create unused code. | Do not port as a standalone file. Revisit only if a future refactor wires it into the canonical reducer with tests. |
| `scriptImport.ts` and its test on main | The pure import helper existed on main, but main's UI did not expose it. A separate branch had added a controller method that imported the missing module, leaving that branch incomplete. | Reconcile the helper and tests with the current BrainRuntime/export-aware Script Architect, and add an actual TXT/Markdown import control. This PR is that completion. |

## Recent PR and branch disposition

### Already merged into `master/consolidated-feature-integration`

- Vault Workbench: #97, #98, #99, #100, #101.
- Studio controls/primitive repairs: #103, #106, #108, #109, #125, #129, #143, #144, #146, #148.
- Initial creator crop and split controls: #102, #105, #107, #110.
- Source-aware trim/audio/editor controls: #113, #114, #117, #118, #121, #124.
- Script export and BrainRuntime integration: #126, #127, #128, #130, #139.
- Editor production tools: #136, #137, #138, #140, #141, #142, #145, #147.

These are already part of the integration branch; re-merging their feature branches is unnecessary and risks duplicate/conflicting history.

### Closed without merge; audited as superseded

| PR | Branch work | Current integration evidence / disposition |
|---|---|---|
| #104 | Confirmed primitive non-default settings docs | Superseded by #109, which merged the conflict-resolved documentation. |
| #111 | Additional ratio preset follow-up | The current crop inspector already exposes 16:9, 1:1, 9:16, 4:5 and project-ratio crops; focal-point crop is also present. |
| #112 | Earlier source-slip controls | Source-slip controls are present in the integrated Clip Settings panel and the later #113/#130 work. |
| #115 | Quick image/video adjustments | The current inspector has brightness, contrast and saturation controls using the shared FX catalog. |
| #116 | Centralized source-aware trim helper | Later source-range fixes #114/#117 merged; current editor already has source-aware trimming behavior. The unmerged helper is not referenced. |
| #119 | Trim edges to playhead | The integrated tree already contains `trimAtPlayhead.ts`, its test, and the panel controls. |
| #120 | Plain-text Script Architect export | Superseded by merged #126 and the consolidated #130 work. |
| #122 | Batch crop/trim controls | Current integration already has ratio crop presets and trim-to-playhead controls. |
| #123 | Source-slip UI | The later consolidation #130 and current Clip Settings panel already include source slip. |

The branches above should not be merged as-is: their relevant behavior is already integrated, and their old bases are hundreds of commits behind the current branch.

## Creator production work from this reconciliation

This PR completes the one main-branch behavior identified as useful but not user-accessible: importing a plain-text script into Script Architect.

- Imports `.txt`, `.md`, and `.markdown` files through the existing Script Architect.
- Preserves the source prose as one editable section; it does not invent scene structure or caption timestamps.
- Normalizes a leading BOM and line endings while preserving the remaining text.
- Rejects empty/whitespace-only input.
- Asks before replacing an existing assembled result; saved drafts remain available.
- Uses the existing Script Architect controller, autosave, BrainRuntime, and export model rather than introducing a second editor state.

## Validation status and next steps

- GitHub branch refs, PR metadata, file presence, and selected file blob SHAs were inspected.
- This GitHub-only pass has not executed Vitest, typecheck, build, or browser QA. The import tests are authored but must run in CI or a checkout.
- No deployment is claimed.
- After this PR's checks and review, request landing confirmation for this exact head. Do not use a direct branch merge of `main`, do not force-push, and do not merge stale duplicate branches.
