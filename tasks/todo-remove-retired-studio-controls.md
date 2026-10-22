# Removal Checklist — Retired Studio Controls

- [ ] Inventory all exact names, aliases, CSS selectors, data attributes, tests, callsites, and docs on the target branch.
- [ ] Remove Inline Stepper from the confirmed catalog and production code.
- [ ] Remove Side/Split Stepper from the confirmed catalog and production code.
- [ ] Remove Username Text Input composite and its split-input alias; preserve generic text inputs.
- [ ] Remove Split Rail Accordion from the catalog and production code.
- [ ] Remove Panel Accordion from the catalog and production code.
- [ ] Remove family-only styles, exports, types, helpers, tests, and documentation.
- [ ] Replace essential callsites with existing canonical primitives without recreating the removed patterns.
- [ ] Run focused tests and typecheck.
- [ ] Run production build.
- [ ] Repeat repository-wide searches and review the complete diff.
