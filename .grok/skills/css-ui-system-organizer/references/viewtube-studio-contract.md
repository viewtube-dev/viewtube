# ViewTube Studio Controls — Contract Snapshot

Snapshot supplied for this skill, dated 2026-10-17, for `master/consolidated-feature-integration`. Verify these details against the current branch before applying changes.

## Expected source-of-truth locations

- Tokens: `src/studio-ui/tokens.ts`
- Primitives: `src/studio-ui/primitives/StudioControls.tsx`, `StudioTextInput.tsx`, `StudioTextArea.tsx`
- CSS: `src/styles/studio-control-system.css` and its imported vars/core/split/fields files
- Defaults index: `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`
- Confirmed catalog: `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`

## Global defaults (size-independent)

- Font family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif
- Weight: 1000
- Text transform: uppercase for labels/tags
- Letter spacing: -0.02em (micro may use -0.01em)
- Single-line baseline line-height: 0.86
- Primary: `--pair-a`; secondary: `--pair-b`
- Default fill: 100% primary unless a named secondary/alternate variant applies
- Alternate/split-rail fill: secondary
- Default label color and outer border: black
- Label/icon alignment: centered except text fields, which are left-aligned
- Default width: row-fill (100% / flex)
- Shadows, transitions, and transforms: none on shells and faces
- Focus outline offset: 0; no layout shift

## Size ladder

| Property | Standard | Compact | Micro |
|---|---:|---:|---:|
| Height | 44px | 28px | 14px |
| Stroke | 3px | 2px | 1px |
| Radius | 6px | 4px | 2px |
| Font size | 38px | 24px | 10px |
| Text stroke | 1px | 0.5px | 0.25px |
| Icon size | 38px | 24px | 10px |
| Icon stroke | 1.9px | 2px | 1.5px |
| Secondary focus outline | 1.95px | 1.3px | 0.65px |
| Gap | 4px | 4px | 4px |
| Line height | 0.86 | 0.86 | 1.0 |

Micro is based on compact geometry with a legibility floor and is reserved for informational split-left badges, not general interactive controls. Confirm actual token calculations before changing values.

## Fixed-ratio families

- Square toggles, checkboxes, and icon buttons: 1:1 face at the selected tier
- Switch reference geometry: 75.68 × 44; scale only where compact is explicitly supported
- Radio: 1:1 footprint with circular indicator
- Inline stepper: 1:2:1 (square action : flexible value : square action)
- Split stepper: editable pane 2:1 relative to square action rail
- Split-left/right/double-split: square rails 1:1; flexible label region; secondary rail by default
- One shared `StudioSplitShell` anatomy for split-left buttons, split badges, and username inputs

## Text fields

- Single-line and multiline text are left-aligned.
- Single-line fields inherit 38/24px typography and 44/28px geometry; 50% primary fill at rest, 15% primary fill on focus, primary text at rest, black text on focus, secondary outline at about 65% of border width, outline offset 0.
- Multiline textarea exception: 18/14px type, 0.5/0.35 text stroke, line-height 1.25/1.3, minimum height 92px, vertical resize; same color/focus contract.

## Named exceptions in this snapshot

- Vault spectrum tag: 15px high, 2px border, 4px radius, 8px type, weight 900, spectrum colors
- Tag-editor plus/check actions: compact 28px square, no shadow
- Textarea typography: multiline reading scale above
- Prominent action button: separate 56px family, not a third ordinary size tier
- Content-width allow-list: spectrumTag, closeableBadge, wordToggle, tagEditorTag

## Ownership rules

- Catalog specimens import production primitives; they do not duplicate geometry.
- Changing size must not change color roles, weight, centering, or row-fill.
- Add each new exception to tokens, this index, and catalog together.
