# Quarantined split text-input implementations

**Status: quarantined on 2026-11-14. Do not import, export, register, or use in production.**

The following implementations are retained in place as rollback/reference source while the active Studio UI standardizes on `StudioSideTextCounterIcon`:

- `../primitives/StudioSplitTextInput.tsx` and its adjacent `studio-split-text-input.css`
- `../../components/studio-hub/StudioHubConfirmedSplitTextInputCatalog.tsx` (standalone specimen catalog, now non-exported)
- `../../components/StudioHubConfirmedPrimitiveCatalog.tsx` (legacy catalog source; split-input specimen removed)
- `../primitives/StudioIconRailTextInput.tsx` and its adjacent `studio-icon-rail-text-input.css`
- The former `StudioSideTextInput` and `StudioDoubleSplitTextInput` declarations retained as non-exported private source in `../primitives/StudioControls.tsx`

The original `StudioSideTextCounter` numeric stepper is not quarantined. The replacement `StudioSideTextCounterIcon` remains active and keeps its five-tier API and optional accessible icon action.

Quarantine means the legacy designs are unreachable from the public Studio barrel and the Confirmed Primitive Library, and their dedicated component modules are not imported by active catalog code. Source files remain untouched for rollback. Do not re-enable them by adding imports or exports; any future reconsideration requires an explicit product decision and a new implementation review.
