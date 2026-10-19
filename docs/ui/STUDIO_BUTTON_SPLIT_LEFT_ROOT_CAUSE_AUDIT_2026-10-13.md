# Studio Button and Split-Left Primitive Root-Cause Audit

**Date:** 2026-10-13  
**Status:** Source-level findings documented; targeted runtime verification and corrective code changes remain outstanding.  
**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Scope:** Studio buttons, SubToolbox split-left buttons, Generate/Refine/Analyze actions, Post Workspace controls, Load/Refresh tracing, and the reported double-shadow behavior in catalog primitives 06/07.

## Executive finding

The button inconsistencies are caused by parallel component and CSS contracts, not simply by one incorrect CSS value. Studio controls and SubToolbox split-left controls have separate React implementations, default sizes, typography rules, and shadow behavior. Metadata actions use the SubToolbox split-left path while Post Workspace controls use the Studio split-left path. The 06/07 component-level split-left family has a concrete nested-shadow rule that can produce the reported double-shadow appearance.

This audit is a source-level investigation. It does not claim that screenshots, browser-computed styles, all Load/Refresh call sites, tests, or a production build have been verified.

## Findings

### 1. Studio button and Studio split-left defaults differ from SubToolbox split-left

**Studio control implementation**
- Source: `src/studio-ui/primitives/StudioControls.tsx`
- Styles: `src/styles/studio-control-system.css`
- The Studio control contract uses `data-vt-studio-control` and its own CSS variables.
- The standard control height is 48px; the action size is 56px.
- Studio button typography is set independently (including 14px standard text, heavy weight, uppercase formatting, and tight line height).
- The Studio split-left component defaults to the action size unless a caller supplies another size. This is distinct from a regular Studio button's standard-size default.

**SubToolbox split-left implementation**
- Source: `src/components/subtoolbox/SubToolboxSplitPrimitives.tsx`
- Styles: `src/styles/subtoolbox-split-primitives.css`
- This is a separate component and CSS contract from the Studio control family.
- Its label typography includes 14px text, weight 1000, tight letter spacing, and grid-based centering.
- Component-level variants add level-specific sizing and typography.

**Impact:** Identically purposed buttons can have different heights, font weights, label alignment, letter spacing, and capitalization depending on which component family they use. Their defaults are not interchangeable.

### 2. Generate / Refine / Analyze and Post Workspace use different families

**Metadata actions**
- Source: `src/components/metadata/CanonicalMetadataSections.tsx`
- Generate, Refine, and Analyze are rendered using `SubToolboxSplitButton`.
- The actions use component-level `level="l2"` sizing and action-specific color overrides.

**Post Workspace**
- Source: `src/components/CommunityPostGenerator.tsx`
- The controls use `StudioSplitLeftButton`.
- The caller explicitly selects `sizeVariant="standard"`, invoking the Studio control contract's standard geometry.

**Impact:** These groups are not variants of one shared implementation. They inherit distinct component-level sizing, typography, color handling, and interaction styling. The exact Load/Refresh call sites were not conclusively identified during this pass and must be traced before attributing them to either family.

### 3. A concrete nested-shadow rule explains the double-shadow report

**Shared split-left stylesheet:** `src/styles/subtoolbox-split-primitives.css`

The split-left parent uses a `filter: drop-shadow(...)` effect. Separately, the component-level label/body selector adds its own `box-shadow`:

```css
.vt-subtoolbox-split-button.has-component-level .vt-subtoolbox-split-button-label,
.vt-subtoolbox-split-dropdown.has-component-level .vt-subtoolbox-split-dropdown-label>b {
  box-shadow: var(--vt-component-shadow-offset) var(--vt-component-shadow-offset) 0
    color-mix(in srgb, var(--pair-a, #36e0f6) 42%, transparent);
}
```

The parent drop shadow and nested label/body shadow can both be visible, creating a double-shadow appearance. The 06/07 catalog examples also receive catalog-specific geometry and typography rules in `src/components/studio-hub/studio-hub-complete-primitive-catalog.css`; these overrides should be checked during visual certification, but the nested-shadow rule is the clearest confirmed source-level cause.

Do not blindly remove every shadow declaration. First confirm the intended single external shadow against the canonical primitive reference, then remove the redundant effect and verify both live controls and catalog examples.

## Recommended source-of-truth direction

Use the existing production SubToolbox primitive contract as the shared foundation where anatomy and behavior match. Do not add another consistency stylesheet.

1. **Tokens:** define shared typography, stroke, radius, shadow, color, and sizing tokens once; preserve meaningful distinctions between standard, compact, action, L0, L1, and L2 sizes.
2. **Primitive implementation:** make one canonical split-left implementation own the rail, separator, label/body, states, and external shadow.
3. **Studio compatibility:** where Studio split-left buttons share the same anatomy, adapt them to the canonical contract rather than independently redefining geometry. Keep genuinely different Studio behavior as a thin wrapper or explicit variant.
4. **Shadow ownership:** retain one intentional external shadow for the compound control. Remove the nested label/body shadow only after visual comparison verifies that it is not a deliberate reference effect.
5. **Catalog CSS:** `studio-hub-complete-primitive-catalog.css` may size and arrange examples, but should not introduce competing production typography or shadow rules. Catalog-specific adjustments must be clearly scoped to reference rendering.
6. **Consumers:** migrate matching controls to the shared primitive, preserving event behavior, accessible names, disabled/loading states, palette mapping, and action-specific semantics.
7. **Stylesheet imports:** check `src/styles/toolbox-entry.css` and import order to ensure legacy/compatibility selectors do not override the canonical contract.

## Files inspected / linked

- [StudioControls.tsx](../../src/studio-ui/primitives/StudioControls.tsx)
- [SubToolboxSplitPrimitives.tsx](../../src/components/subtoolbox/SubToolboxSplitPrimitives.tsx)
- [SubToolboxPrimitives.tsx](../../src/components/subtoolbox/SubToolboxPrimitives.tsx)
- [studio-control-system.css](../../src/styles/studio-control-system.css)
- [studio-split-left-consistency.css](../../src/styles/studio-split-left-consistency.css)
- [subtoolbox-system.css](../../src/styles/subtoolbox-system.css)
- [subtoolbox-split-primitives.css](../../src/styles/subtoolbox-split-primitives.css)
- [toolbox-entry.css](../../src/styles/toolbox-entry.css)
- [studio-hub-complete-primitive-catalog.css](../../src/components/studio-hub/studio-hub-complete-primitive-catalog.css)
- [CanonicalMetadataSections.tsx](../../src/components/metadata/CanonicalMetadataSections.tsx)
- [CommunityPostGenerator.tsx](../../src/components/CommunityPostGenerator.tsx)
- [Studio Hub Component Library source of truth](STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md)

## Remaining verification work

- [ ] Locate and document every Load/Refresh call site and identify the actual primitive used at each.
- [ ] Trace all production consumers of `StudioButton`, `StudioSplitLeftButton`, and `SubToolboxSplitButton`, including variants and local class overrides.
- [ ] Inspect `studio-split-left-consistency.css` and all relevant CSS imports for additional conflicting selectors.
- [ ] Run the canonical component tests and add regression coverage for typography, size defaults, square rail geometry, color inheritance, focus/disabled/loading states, and shadow count.
- [ ] Compare the 06/07 reference examples and production consumers in a browser at desktop and mobile sizes.
- [ ] Verify build and tests before marking any CSS migration complete.

## Acceptance criteria for the eventual fix

- One production source of truth for split-left anatomy and baseline typography.
- Regular Studio buttons and split-left buttons retain intentional differences, not accidental divergence.
- Generate/Refine/Analyze, Load/Refresh, and Post Workspace controls follow the same design contract where they are the same control family.
- Exactly one intended external shadow on the 06/07 compound split-left control; no accidental nested shadow.
- Catalog rendering faithfully demonstrates the production primitive without becoming a second styling authority.
- Regression tests and production build pass.
