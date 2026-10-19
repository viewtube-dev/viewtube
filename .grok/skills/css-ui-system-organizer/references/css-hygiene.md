# CSS Hygiene Recipes for UI Primitive Systems

## Flat-control enforcement

Use a centralized, carefully scoped rule for the known Studio control family:

```css
:where(
  [data-vt-studio-control="true"],
  [data-vt-studio-button="true"]
) {
  box-shadow: none;
  text-shadow: none;
  transition: none;
  transform: none;
  translate: none;
}
```

Check actual markup and specificity before applying broad rules. Avoid blanket `!important` unless a documented compatibility constraint requires it. Apply the flat contract to inner faces where relevant. Intentional motion must be a named exception and respect `prefers-reduced-motion`.

## Data-attribute scoping

Prefer stable attributes over long selector chains:

```css
[data-vt-studio-control="true"] {
  /* Declare shared custom properties and box sizing here. */
}

[data-vt-studio-control="true"][data-size="compact"] {
  /* Override only size-related properties. */
}
```

## Avoid focus layout shift

```css
[data-vt-studio-control="true"]:is(input, textarea):focus {
  outline-offset: 0;
}
```

Do not change padding or margin on hover/focus. Use a focus indicator that meets the existing design and accessibility contract; do not remove keyboard focus indication merely to keep the UI flat.

## Selector hygiene checklist

- Prefer `:where()` for low-specificity shared utility rules.
- Keep one authoritative system stylesheet or a small set of files imported together.
- Remove duplicate declarations and hard-coded sizes already owned by tokens.
- Prefer CSS variables and color-role tokens to drifting raw colors.
- Do not create parallel token generators or generated stylesheets.
- Preserve accessible focus indicators and verify contrast when changing fills.

## Split-shell anatomy

For left/right/double-split controls, use shared shell anatomy and stable data hooks. Rails are fixed 1:1 at the chosen tier; the label region flexes. Use exactly one shared divider per split boundary—avoid adjacent duplicate borders.
