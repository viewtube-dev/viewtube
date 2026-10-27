# Side toggle ↔ side counter unification

Side toggles and side counters share a value face plus a square chevron rail. Their dimensions and interaction are owned globally by `studio-side-rail-unify.css`, not by a component-grid selector.

| Property | Contract |
|---|---|
| Rail width / height | Equal to active `--vt-studio-control-height` |
| Standard / compact / mini / micro / supreme | 44 / 28 / 20 / 12 / 60px |
| Stroke / radius | Active tier tokens; supreme uses standard system; micro follows mini |
| Chevron | Scales with the rail and stays centered |
| Divider | Single shared-edge stroke; no duplicate outer border |
| Press | Flat feedback and the same registered `vt-studio-counter-pop` animation |
| Grid | Layout only; children remain canonical Studio primitives |

Do not add grid-scoped arrow geometry or catalog-local overrides. Verify side counter beside side toggle on a normal page with no grid.
