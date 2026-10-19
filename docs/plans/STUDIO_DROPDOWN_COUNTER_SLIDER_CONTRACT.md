# Studio Dropdown, Counter, and Slider Contract

**Target:** `master/consolidated-feature-integration`  
**Implementation branch:** `codex/studio-dropdown-counter-slider-contract`  
**Method:** CSS UI System Organizer + test-driven development. Tokens own numeric values and color-state semantics; TSX owns semantic markup; the canonical Studio stylesheet owns presentation. No competing token generator or duplicate CSS authority.

## Required outcomes

### Shared dropdown chevron contract
- Define chevron rail size, glyph size, and stroke once in the canonical Studio token/CSS contract.
- Apply it to single-select, split dropdowns, and Legend Multi dropdowns.
- Simple dropdowns have a trailing chevron only and no split rail.
- Split-left dropdowns use the canonical Studio split-shell anatomy: leading square secondary-color rail with a configurable/default icon; the chevron stays in the opposite, trailing rail.
- Keep the dropdown value pane flexible, full-row, and free of duplicate borders/dividers.

### Side counter geometry and state
- Side/left counter action rows remain equal halves.
- The horizontal divider is an overlay centered on the exact 50% boundary using the shared counter stroke token; it must not consume row height or enlarge the lower cell.
- Press/focus/hold active numeral text fill and stroke are black for both counter orientations. The outer border remains black and the value-area background follows the existing counter contract.

### Slider/counter shared state styling
- Reuse shared token variables for numeral default mix and active black glyph state.
- Default slider readout is 50% white mixed with its own value-area background; active slider readout is black.
- Keep the existing slider track gradient/interaction semantics and don't accidentally recolor the handle or rails.

## Work sequence
1. Add regression checks for markup, token ownership, divider geometry, and default/active number states.
2. Implement the shared token/CSS contract and dropdown markup.
3. Fix both canonical and later duplicate counter divider/state declarations at their source.
4. Bring the slider readout onto the shared counter-number state contract.
5. Update defaults index and confirmed catalog wording only where necessary.
6. Run targeted tests, `npm run test:studio-controls`, CSS parse, typecheck/build when execution is available; inspect standard/compact specimens in the deployed Primitive Library.

## Completion criteria
No speculative overrides; no duplicate chevron sources; simple/split variants are structurally distinct; divider thickness and centerline are both correct; active number stroke is black; default slider number fill/stroke is 50% white mix; automated and rendered verification results are reported separately.
