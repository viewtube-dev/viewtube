# Studio Controls simplified ownership migration

**Target:** `master/consolidated-feature-integration`  
**Approach:** compatibility-preserving consolidation, not a wholesale token/API replacement.

## Canonical rules
- `src/studio-ui/tokens.ts` remains canonical and preserves existing public exports and Toolbox integration.
- `scripts/emit-studio-control-vars.mjs` publishes generated variables from that source; generated CSS is never hand-edited.
- Semantic tier names are authoritative. Pixel aliases are migration-only and must not become new sources of truth.
- Shared globals and size aliases have one owner; family sheets own field appearance, split geometry, dropdown anatomy, and accordion motion.
- Mini remains 20px with 17.5px type/icons, 1.5px stroke, and 3px radius. Micro remains 12px with 10px type/icons and inherits Mini's 1.5px stroke, 3px radius, and 0.975px focus outline. Supreme type/icons are 52px.
- Global letter spacing is `-0.02em`; default/focus fill is 50%/15%; focus outline is secondary, 65% of border width, offset zero.
- Editable fields keep a black outer border and persistent primary inset stroke. Resting text/glyph stroke and caret are primary; focus text/glyph stroke is black, caret remains primary, and the secondary outline does not replace the inset.

## Migration sequence
1. Preserve public exports while consolidating repeated values in tokens.
2. Keep emitter parsing aligned with canonical token structure and regenerate CSS.
3. Make shared defaults and tier alias mapping single-owner without removing selectors still needed by production consumers.
4. Move field rules into the field sheet; split/accordion/dropdown geometry stays family-owned.
5. Migrate required behavior from recovery, distill, parity, and entry layers before deleting them.
6. Update hierarchy/default/exception documentation and CSS ownership tests in the same change.
7. Verify emitter determinism, focused Studio tests, typecheck, build, and browser-rendered five-tier/focus behavior.

## Guardrails
- Do not remove Toolbox imports or exported token contracts without auditing consumers.
- Do not replace Micro's Mini-matched stroke/radius with a smaller geometry.
- Do not add a second token table to the emitter.
- Do not claim visual verification without a browser run.
- Do not delete override files merely to reduce file count; migrate their live behavior first.
