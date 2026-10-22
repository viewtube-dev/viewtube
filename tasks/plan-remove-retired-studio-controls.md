# Remove Retired Studio Controls

## Goal
Completely remove the Inline Stepper, Side/Split Stepper, Username Text Input composite, Split Rail Accordion, and Panel Accordion from the application and confirmed primitive library.

## Scope
- Delete each dedicated implementation, public export, type, alias, helper, style sheet, and family-specific CSS.
- Remove all catalog registrations, specimens, provenance, variant examples, imports, callsites, tests, snapshots, and active documentation references.
- Replace essential callsites only with existing canonical primitives; do not recreate the removed designs under new names.
- Preserve unrelated generic text inputs, counters/number inputs, accordions, steppers, and shared CSS used elsewhere.

## Execution
1. Inventory target-branch consumers, exports, styles, tests, and docs for all five families and aliases.
2. Remove the library families and their demonstrations.
3. Remove component implementations and public API references.
4. Remove direct/indirect consumers and orphaned styling.
5. Delete dedicated source/style files and family-only tests.
6. Run focused tests, typecheck, production build, and exhaustive repository search.
7. Review the diff for accidental removal of unrelated controls.

## Acceptance criteria
- No implementation, import, export, type, alias, callsite, specimen, style, or active documentation remains for the five retired families.
- No dedicated family CSS or dead helper remains.
- Generic controls and unrelated components continue to work.
- Typecheck, relevant tests, and production build pass, with any pre-existing failures explicitly identified.
