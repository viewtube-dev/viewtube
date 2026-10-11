# Component Library corrective changelog

- Replaced the partial Studio Hub reference-gallery body with the canonical complete catalog.
- Added direct rendering of all 56 registered families at L0/L1/L2.
- Restored Main Toolbox header geometry to 80px inside the Component Library instead of inheriting the erroneous 56px global rule.
- Updated reference-library tests to assert representative families including Split Search, Toggle, Settings Switch, Checkbox, Radio, Slider, Range Slider, Popover, Pagination and Vault asset modules.
- Added a mobile regression source test and a visual certification checklist.


## 2026-10-11 — Missing compound patterns

- Added `SubToolboxScriptBar` as a reusable weighted timeline primitive and migrated Script Architect's inline multi-section bar to it.
- Registered six missing production-track examples: Tone / Tension / Cinematic Dropdown, Nested Square Choice, Tag-Adjacent Split Action Row, Multi-Section Script Bar, Ranked Metadata Tag, and Education Timestamp Notes.
- Used existing shared primitives for dropdown, split-left action, checkbox, tag editor, ranked tags, and timestamp field; no parallel styling system was introduced.
- Extended the component index and mobile-regression source tests. The 62-family frozen hardcoded baseline remains unchanged.
