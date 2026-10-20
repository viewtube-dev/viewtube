# Confirmed Specimen Grid

Status: reusable catalog-layout component added; production family integration and browser certification remain pending.

## Contract

- `ConfirmedSpecimenGrid.tsx` and `ConfirmedSpecimenGrid.css` are colocated in the Studio Hub catalog directory.
- The grid owns catalog arrangement only. Its stylesheet must not style descendant primitive geometry or faces.
- `renderSpecimen({ id, tier, label })` must render a real production component. Use `id` to isolate per-specimen state where needed, and map each tier to the component's supported size API. Meaningful variant labels may replace the suggested label.
- Never cast unsupported size values or simulate unsupported tiers through catalog CSS.
- Supreme (60px) and Micro (12px) are only valid where the production family explicitly supports and tests them. Interactive/informational micro variants need an explicit family decision before certification.

## Layout modes

Reference mode contains Supreme full width; Standard full width, halves and quarters; Supreme beside Compact full/halves; and two Supreme halves beside Micro full/halves/quarters.

Clean mode places Standard and three Compact specimens in the left column, with Supreme and four Micro specimens in the right column. The documentation slot is unmounted in clean mode. Move external family headings/settings into the documentation slot or control them from the same view state. Keep an accessible family name on the region.

The native view switch is intentionally local and independently controlled per module. Replace its visual face with the canonical Studio switch only when that integration is available, preserving the accessible name, checked state, and controlled content id.

## Validation still required

- Typecheck/build and focused component tests.
- Browser verification of independent switches, 4px gaps, actual production outer heights (60/44/28/12px), row-fill, long text/dropdown overflow, keyboard access, duplicate accessible names, and clean-mode focusability.
- Confirm component state behavior while switching views. Current view branches remount specimens, so their internal state resets; lift state by stable semantic variant if persistence is required.
- Exact column counts intentionally remain at narrow widths; browser QA must decide whether a documented alternative is needed.
