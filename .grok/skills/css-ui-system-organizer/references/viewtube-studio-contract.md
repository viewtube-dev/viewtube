# ViewTube Studio Controls — Contract Snapshot

Snapshot reconciled on 2026-10-18 against the current `master/consolidated-feature-integration` implementation. This is a reference aid, not authority over newer source or explicit user-confirmed decisions; re-check the live tokens, CSS import graph, and defaults index before changing production code.

## Expected source-of-truth locations

- Tokens: `src/studio-ui/tokens.ts`
- Primitives: `src/studio-ui/primitives/StudioControls.tsx`, `StudioTextInput.tsx`, `StudioTextArea.tsx`
- CSS entry point: `src/styles/studio-control-entry.css`, importing `studio-control-system.css`, generated vars, core, split, fields, and motion styles
- Defaults index: `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`
- Confirmed catalog: `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`

## Global defaults (size-independent)

- Font family: Inter, ui-sans-serif, system-ui, sans-serif
- Weight: 1000
- Text transform: uppercase where appropriate
- Letter spacing: -0.02em
- Primary: `--pair-a`; secondary: `--pair-b`
- Default field fill: 50% primary at rest; fields use 15% primary fill on focus where the focused-field contract applies
- Solid 100% fills are named family/variant choices, not the global field default
- Default field text: primary at rest, black while focused
- Default outer field border: black; focus outline: secondary at 65% of border stroke, offset 0
- Label/icon alignment: centered except text fields, which are left-aligned
- Default width: row-fill (100% / flex), with documented content-width exceptions
- Shadows, transitions, and transforms: none on shells and faces unless a named exception is explicitly registered
- Focus must not shift layout

## Size ladder

| Property | Standard | Compact | Micro |
|---|---:|---:|---:|
| Height | 44px | 28px | 14px |
| Border stroke | 3px | 2px | 1px |
| Radius | 6px | 4px | 2px |
| Single-line input font size | 38px | 24px | 10px |
| Input text stroke | 1px | 0.5px | 0.25px |
| Secondary focus outline | 1.95px | 1.3px | 0.65px |
| Component gap | 4px | 4px | 4px |

Micro is reserved for informational split-left badges rather than general interactive controls. Treat family-specific icon dimensions and strokes as token-owned values; verify them in the current token module instead of assuming they match text dimensions.

## Fixed-ratio families

- Square toggles, checkboxes, and icon buttons: 1:1 face at the selected tier
- Radio: 1:1 footprint with circular indicator
- Inline stepper: square action : flexible value : square action
- Split stepper: editable pane at 2:1 relative to square action rail
- Split-left/right/double-split: square rails, flexible label region, one shared divider per boundary
- Prefer shared split-shell anatomy over duplicated one-off split markup

## Text fields

- Single-line fields: 44/28px geometry and 38/24px typography (micro typography is a named 10px informational exception); left aligned
- Text field text stroke is independent of the black outer border stroke
- Fields: 50% primary fill at rest; 15% primary fill on focus where the field focus fill rule applies; primary text at rest and black text while focused
- Focus outline: secondary color at 65% of the relevant border stroke; offset 0; no black glow or layout movement
- Textarea-only typography exception: 18px standard / 14px compact, text stroke 0.5px / 0.35px, line-height 1.25 / 1.3, minimum height 92px, vertical resize
- Floating/fixed labels have their own typography rules; never use label font size as evidence of native input font size

## Named exceptions

- Vault spectrum tag: verify current registered dimensions, stroke, radius, typography, and color treatment in tokens and the defaults index before editing
- Tag-editor actions and closeable badges: preserve their named family geometry and content-width policy
- Textarea typography: multiline reading scale above
- Prominent action button: separate family, not a third ordinary size tier
- Content-width is an allow-list exception, never a blanket size-tier behavior

## Ownership rules

- Tokens own numeric contracts; CSS owns presentation; TSX owns markup and data attributes
- Catalog specimens import production primitives rather than duplicate their geometry
- Changing size must not silently change color roles, text weight, alignment, or row-fill behavior
- Every intentional exception must be reflected consistently in tokens, the defaults index, and the confirmed catalog
- This snapshot is guidance, not permission to override newer implementation or user-confirmed requirements
