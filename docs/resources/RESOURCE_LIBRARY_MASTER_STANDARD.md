# Resource Library Master Standard

**Status:** Active implementation standard  
**Canonical UI palette owner:** `src/styles/toolboxPalette.ts`  
**Canonical runtime resource source:** `src/features/resource-library/resources/*.md`  
**Runtime registry:** `src/features/resource-library/resourceLibraryRegistry.ts`

## 1. Source authority

- Resource Markdown under `src/features/resource-library/resources/` is the runtime content source.
- The registry owns resource identity, title, categories, tags, difficulty, reading-time metadata, update date, source path, and accent palette index.
- Editorial mirrors in `docs/resources/library/` are reference copies only. They must not become a second runtime source.
- Palette values and pair order come from `src/styles/toolboxPalette.ts`; do not add a Resource Library-specific list of spectrum hex values.
- Use shared Toolbox/SubToolbox primitives for component chrome. Resource-specific CSS may handle editorial document layout, but must not reimplement the global toolbox shell.

## 2. Canonical 12-color spectrum and pair contract

The spectrum order is defined only by `VT_SPECTRUM_PALETTE_06`. Resolve component pairs with `getToolboxPaletteColors(index)`:
- primary/header = palette slot `index`;
- secondary/icon = palette slot `index + 4`, wrapped by the canonical resolver;
- normalize all indices through the shared resolver rather than creating a local color cycle.

The Resource Library injects all twelve spectrum slots into CSS custom properties from the canonical exported array. CSS references those variables; it does not declare alternate hues. Resource cards use each registry entry's `accentPaletteIndex` to resolve its pair. Overview modules likewise use explicit pair indices. The main Toolbox scaffold keeps its existing canonical `paletteIndex={8}` allocation.

Use pair colors for decorative fills, active states, borders/accent rails, and translucent shadows. Do not use positional `:nth-child()` rules to assign independent hues. Semantic quote/evidence states may use a fixed canonical spectrum slot when meaning requires stable cross-resource encoding; that is a semantic mapping to the canonical palette, not a new palette.

## 3. Neutral surfaces, borders, and shadows

- Neutral ink, paper, and surface values are structural neutrals, not extra spectrum colors.
- Keep neutral colors in shared design tokens when available; any local neutral fallback is compatibility-only.
- Colored shadows must be derived from the active pair with `color-mix()`; do not use black shadows.
- Preserve the established Toolbox/SubToolbox corner, stroke, spacing, and shell ownership. The Resource Library stylesheet owns only its document layout and content presentation.

## 4. Editorial typography

Control labels can use the ViewTube's emphatic uppercase style. Long-form guide content is an intentional editorial exception: keep body paragraphs readable in sentence case, with comfortable line-height and link affordances. Do not apply control typography globally to prose, tables, code, or citations.

## 5. Evidence and quote semantics

Use explicit semantics in authored Markdown and renderer behavior before adding more visual variants:
- **Direct quotation:** exact words with a clear attribution and source.
- **Platform guidance:** accurately paraphrased or quoted platform documentation.
- **Evidence:** a claim with a traceable source or described dataset.
- **Creator takeaway:** practical interpretation, clearly separated from the source.
- **Caution:** risk, limitation, or a common misreading.
- **Unknown:** uncertainty or a point the available evidence cannot establish.

Never style an interpretation as a platform rule, invent citations, or imply a causal claim from correlation. Visual states should map to canonical spectrum slots and expose their meaning in text, not color alone.

## 6. Resource discovery and metadata

Keep search deterministic and local to the registry until an evidence-backed recommendation service is designed. Search should cover title, short title, description, category, secondary categories, tags, and—when implemented—glossary terms and task synonyms. Add learning paths by referencing canonical resource IDs rather than copying Markdown.

Metadata extensions such as prerequisites, learning-path IDs, audience level, source-review status, and review date should be introduced only with a documented registry contract and tests. Do not maintain a second source for reading time.

## 7. Quality gates

- Assert the canonical palette contains twelve slots and pair resolution matches the shared resolver's header/icon order.
- Assert the Resource Library imports the canonical palette and derives its CSS variables from the exported array.
- Guard against reintroduced local hue hex values or independent spectrum declarations in Resource Library CSS.
- Verify all registry accent indices resolve through the canonical palette.
- Run the focused Resource Library contract test, then the repository test, typecheck, CSS checks, and production build before release.
- Do not claim visual or deployment certification without an actual browser inspection and a deployment using the verified commit.
