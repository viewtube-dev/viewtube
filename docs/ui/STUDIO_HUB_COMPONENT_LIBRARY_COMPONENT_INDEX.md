# Studio Hub Component Library component index

**Status:** Generated production-registry reference  
**Audited main:** `988098840050f4b658a266e1a7d6fe1c4d939c81`  
**Source:** `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx` → `STUDIO_HUB_COMPONENT_FAMILIES`  
**Count:** 62 registered component families

Do not hand-add a family here without adding it to the production registry. The Component Library also contains migration/certification examples outside this base family array; keep those separately identified rather than silently inflating this registry count.

1. Primary Button
2. Secondary Button
3. Neutral Button
4. Destructive Button
5. Square Icon Button
6. Split Left Button
7. Head Tail Action
8. Split Menu
9. Dropdown
10. Select Menu
11. Context Menu
12. Text Input
13. Textarea
14. Split Search
15. Number Field
16. Input Action
17. Stepper
18. Slider
19. Range Slider
20. Toggle
21. Settings Switch
22. Checkbox
23. Radio
24. Segmented Choice
25. Button Group
26. Tag
27. Removable Tag
28. Selectable Tag
29. Tag Editor
30. Badge
31. Status Badge
32. Progress Bar
33. Progress Value
34. KPI
35. Stat Card
36. Metric Strip
37. Tooltip
38. Popover
39. Disclosure
40. Divider
41. Horizontal Scrollbar
42. Vertical Scrollbar
43. Data Stats Module
44. Disabled Button
45. Disabled Split Button
46. Upload Frame
47. Pagination
48. Vault Landscape Asset
49. Vault Portrait Asset
50. Vault Audio Asset
51. Vault Document Asset
52. Knob Dial
53. Controller Switch
54. LED Light
55. Alphabetical Spectrum Tags
56. Icon Rail Control
57. Two Color Data Stats
58. Monochrome Data Stats
59. Tiny Data Stats
60. Tooltip Dark
61. Tooltip Color
62. Dashboard Pill Tags


## Confirmed Square Icon Button — registered variants

**Family #5 · production-backed source:** `src/studio-ui/primitives/StudioControls.tsx`  
**Shared styles:** `src/styles/studio-control-system.css`  
**Live catalog:** `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx`

All variants below are registered under the existing **Square Icon Button** family. They do not create duplicate primitives or inflate the frozen family count.

### Visual skins

- **V1 — Primary face:** `--pair-a` fill with `--pair-b` hard offset shadow.
- **V2 — Inverse face:** `--pair-b` fill with `--pair-a` hard offset shadow.
- **V3 — Selectable inverse pair:** toggles the V1/V2 pair together and exposes pressed state.
- **V4 — Black face:** black face with the inherited primary-pair icon.

### Confirmed interaction effects

- **Pop on activation** — opt-in feedback; does not animate on mount.
- **Notification badge** — optional count/status badge with feedback when the value changes.
- **Rotated toggle** — opt-in selected-state rotation.
- **3D flip** — two-face flip; alternate icon supplied by the caller.
- **Tooltip** — contextual label on hover/focus with accessible description.
- **Morph** — icon crossfade/scale/rotation with an alternate icon.
- **Success** — outcome-driven success state, checkmark and optional polite status announcement.

### Inherited geometry and rules

- Standard: **44×44px**, 3px border, 28px icon.
- Compact: **28×28px**, 2px border, 18px icon.
- Uses the existing sequential 12-color palette and `--pair-a` / `--pair-b` tokens.
- The shared Studio button owns outer geometry, border, radius, shadow, focus, disabled and press behavior. Effects operate on inner layers and do not redefine the component's dimensions.
- Effects are opt-in; reduced-motion preferences are honored.
- Interactive regression contract: `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.square-icon-button.test.tsx`.


## Additional migrated compound patterns

These patterns are registered in `STUDIO_HUB_MIGRATED_FAMILIES` and rendered on the **Primitive** track. They are deliberately listed separately from the frozen 62-family hardcoded baseline above; the baseline count is not inflated by migration examples.

- Multi-Section Script Bar — reusable weighted timeline segments, extracted from Script Architect and now used by the production view.
- Nested Square Choice — reusable `SubToolboxNestedSquareChoice` with keyboard-operable radio semantics and an inner-square selection marker.
- Tag-Adjacent Split Action Row — reusable `SubToolboxTagActionRow` with removable tags and compact REFINE / GENERATE / ANALYZE split-left actions directly underneath.
- Tone / Tension / Cinematic Dropdown — arrow-triggered, colored dropdown pattern using the existing Toolbox dropdown primitive.
- Ranked Metadata Tag — SEO rank/color tag from Video Manager metadata.
- Education Timestamp Notes — validated timestamp/question field used by the Education category flow.
