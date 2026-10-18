# Token and Size-Ladder Patterns

## Single source of numeric truth

Adapt examples to the repository's existing type and token conventions:

```ts
const SIZE_BASE = {
  standard: { height: 44, stroke: 3, radius: 6, fontSize: 38 },
  compact: { height: 28, stroke: 2, radius: 4, fontSize: 24 },
  // Derive micro mechanically where possible, preserving documented legibility floors.
} as const
```

Keep the complete size contract in one authoritative module, including icon, text stroke, input, multiline, and focus dimensions as applicable.

## CSS variable bridge

A helper can map a tier to the CSS variables expected by the stylesheet:

```ts
export function sizeTierToCssVars(size: keyof typeof SIZE_BASE) {
  const tier = SIZE_BASE[size]
  return {
    "--control-height": `${tier.height}px`,
    "--control-stroke": `${tier.stroke}px`,
    "--control-radius": `${tier.radius}px`,
    "--control-font-size": `${tier.fontSize}px`,
  }
}
```

CSS should consume these variables on the root control and let children inherit:

```css
[data-vt-studio-control="true"] {
  box-sizing: border-box;
  height: var(--control-height);
  border-width: var(--control-stroke);
  border-radius: var(--control-radius);
  font-size: var(--control-font-size);
}

[data-vt-studio-control="true"][data-size="compact"] {
  /* Override only size-related custom properties. */
}
```

Do not add a second generator if the repository already has a canonical token-to-CSS mechanism.

## Exception registration

```ts
export const GLOBAL_RULE_EXCEPTIONS = {
  spectrumTag: {
    owner: "VaultAssetModule",
    height: 15,
    stroke: 2,
    radius: 4,
    fontSize: 8,
    fontWeight: 900,
    rationale: "Dense metadata chip with spectrum identity",
  },
} as const
```

Each exception should also appear in the human-readable index and the confirmed catalog.

## Width policy

Default controls fill their row. Content-width variants must be explicitly allow-listed and named, for example:

```ts
export const WIDTH_POLICY = {
  default: "row",
  contentWidthAllowList: ["spectrumTag", "closeableBadge", "wordToggle"],
  attribute: "data-width=content",
} as const
```
