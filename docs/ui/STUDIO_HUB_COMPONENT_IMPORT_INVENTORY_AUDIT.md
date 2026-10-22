# Studio Hub component import inventory audit

## Purpose

Generate a reproducible, source-backed dependency inventory for all code reachable from the real Studio Hub entry point. This is not a substitute for the Confirmed Primitive Library and must not be used to infer that catalog-only examples are production consumers.

## Commands

Run the focused parser test:

```sh
node --test scripts/audit/studio-hub-component-import-inventory.test.mjs
```

Generate the report from the repository root:

```sh
node scripts/audit/studio-hub-component-import-inventory.mjs
```

Outputs are written to `reports/studio-hub-component-import-inventory/`:
- `studio-hub-component-import-inventory.json` — file-level import graph, bindings, JSX component tags, and unresolved local imports.
- `studio-hub-component-import-inventory.md` — human-readable file map and summary.

An alternate entry path may be supplied as the first argument.

## Scope and interpretation

The graph starts at `src/views/StudioHub.tsx` and follows resolvable static and literal dynamic imports. It includes imported components and their transitive local dependencies, not only primitive imports. It records JSX component tag names per file to help distinguish imports from visible component instantiation.

The report is a static inventory, not a claim that every imported component is rendered in every state. Registry-driven component selection, computed import paths, feature flags, conditionally mounted content, and runtime behavior require targeted follow-up. Any unresolved local import is surfaced and makes the command exit non-zero.

## Reconciliation checklist

1. Compare the discovered root-level toolbox components with the actual mounts in `src/views/StudioHub.tsx`.
2. Review registry-based component selection in `src/components/subtoolbox/registry.ts` and the Studio Hub catalog components.
3. Follow imported aliases and barrel exports to their canonical implementation.
4. Keep production use, tests, demos, and catalog-only examples distinct.
5. Compare production-used controls with the Confirmed Primitive Library and identify missing coverage.
6. Run the focused test, generate the report, inspect unresolved imports, and run the project's typecheck/build before merging.

## Known limitation

This audit utility provides the recursive source graph and evidence for follow-up reconciliation. It does not yet automatically classify every JSX tag as a primitive versus a domain component, infer every registry-driven runtime branch, or certify browser rendering. Those statuses must not be marked complete without additional evidence.
