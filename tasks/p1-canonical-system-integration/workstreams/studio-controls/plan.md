# P1-06 Studio Controls Ownership Convergence

**Production Date:** 2026-10-29  
**Last Edited:** 2026-10-29  
**Class:** PROGRAM  
**Status:** ACTIVE — PLANNED / DISCOVERY REQUIRED  
**Concern:** studio controls ownership convergence  
**Owner:** Toolbox UI authority + Studio Controls token/primitive owners  
**Registry ID:** DOC-PLAN-P1-STUDIOCONTROLS  
**Last Audited Main SHA:** 61cfb726db9b32de53b9c89a5a339db696782a11  
**Capabilities:** CAP-WIDGET-SURFACES, CAP-VERIFICATION
**Status:** PLANNED / DISCOVERY REQUIRED | **Owner:** Toolbox UI authority + Studio Controls token/primitive owners
**Capabilities:** CAP-WIDGET-SURFACES, CAP-VERIFICATION

## Objective
Certify one ownership chain from semantic token source through generated CSS, primitive styles, catalog presentation and production export. Remove duplicate owners only after parity and consumer proof.

## Chain to verify
src/components/subtoolbox/tokens.ts → scripts/emit-studio-control-vars.mjs → src/styles/studio-control-vars.generated.css → studio-control-core.css + studio-control-fields.css + studio-control-system.css → src/studio-ui/** → Studio Hub Component Library source-of-truth/catalog and certification.

Latest simplified contract is a discovery lead, not authority until current code is checked: semantic standard tokens, flat defaults, one token system, field native border + primary inset behavior, current size ladder, split rail geometry, no stale pixel aliases. Current executable token source wins over stale prose until reconciled.

## Phases
0. Reconcile PRs/branches #935, #988, #992 and newer Studio work.
1. Map token, emitter, generated output, CSS ownership, primitive export, catalog, certification and consumer imports.
2. Verify deterministic generation and generated-file ownership.
3. Remove duplicate tokens/CSS only after import/cascade/tests prove no unique behavior is lost.
4. Ensure catalog representatives are production exports; variants live in correct module sections.
5. Certify fields, split controls, toggles, counters, dropdowns, sliders, accordion, composer and responsive behavior.
6. Verify exports/import graph and update Studio authorities/registry.

## Acceptance
One token source/emitter/generated output; CSS layers have explicit ownership; catalog maps to actual production exports; no lost unique behavior; focused parity/geometry/catalog tests pass; desktop/mobile visual proof exists. Commands: studio:tokens, test:studio-controls, test:studio-field-style-ownership, test:confirmed-library-layout, certify:studio-components.


## Corrected live source-of-truth map (2026-10-30)
Current executable token source is `src/studio-ui/tokens.ts`, and `scripts/emit-studio-control-vars.mjs` reads that file to emit `src/styles/studio-control-vars.generated.css`. Do not treat `src/components/subtoolbox/tokens.ts` as the emitter input. The current shared tier-selector owner remains `src/styles/studio-control-system.css`; core/fields/system and remaining family/recovery sheets must be inspected as a cascade, not assumed to be fully consolidated.

Current target tier values read from source: Supreme 60/3/6/52; Standard 44/3/6/38; Compact 28/2/4/24; Mini 20/1.5/3/17.5; Micro 12/1.5/3/10. The current token source still stores focus widths per tier. PR #992's focus-ratio derivation is a donor proposal, not current-main behavior. PR #1203's dropdown token emitter fix is merged. PRs #935/#988/#992 overlap and remain non-mergeable; selective donor harvest only.
