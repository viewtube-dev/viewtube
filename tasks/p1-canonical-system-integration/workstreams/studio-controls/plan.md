# P1-06 Studio Controls Ownership Convergence
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
