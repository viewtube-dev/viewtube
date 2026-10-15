# Studio Field Floating-Label Variant Refactor

**Status:** Implementation branch in progress; not merged or deployment-verified  
**Target branch:** `master/consolidated-feature-integration`  
**Working branch:** `refactor/studio-field-floating-label-variants-2026-10-15`

## Objective

Delete the standalone `StudioLabeledInput` and `StudioLabeledTextArea` component APIs and recreate their label behavior as presentation variants of the canonical simple field families:

- **Input family:** `StudioTextInput variant="simple"` (default) and `StudioTextInput variant="floating-label" label="…"`.
- **Textarea family:** `StudioTextArea variant="simple"` (default) and `StudioTextArea variant="floating-label" label="…"`.

The label is an adornment/wrapper variant. It must not create a second field family or own field typography, border, focus, or size tokens.

## Canonical rules

### Input family

- Standard typography: **38px**, compact typography: **24px**; Inter, weight 1000, shared 0.86 line-height.
- Standard/compact control geometry remains **44px / 28px**, with **3px / 2px** border and **6px / 4px** radius.
- The floating-label variant accepts `label`, optional `level="l0" | "l1" | "l2"`, and an input-only `floatingLabelVariant="b"` specimen for the compact secondary-color focus stroke.
- The floating label keeps the shared 24px label text and overlap geometry regardless of field size.

### Textarea family

- Standard typography: **18px**, compact typography: **14px**; Inter, weight 1000.
- Keep the **92px minimum writing surface**, multiline line-height/padding, and vertical resizing.
- Standard/compact border and radius remain size-driven: **3px / 2px** and **6px / 4px**.
- The floating-label variant changes only the wrapper/label presentation. It must not change the textarea's family typography or writing-surface behavior.

## Migration phases

1. **Consolidate APIs** — implemented in the working branch. Add variant props and render the native input/textarea from the family component; remove standalone labeled exports.
2. **Migrate library consumers** — implemented for Confirmed Primitive Library and Complete Primitive Catalog examples. The demos now live inside the matching input or textarea family. Finish a repository-wide stale-reference audit.
3. **Lock the contract** — update source-governance tests to assert the family variants and reject standalone component exports/imports.
4. **Verify behavior** — run focused audit tests, typecheck, and production build. Inspect the live Studio catalog for empty/focused/filled labels, standard/compact sizes, keyboard focus, and textarea resize.
5. **Merge and deploy** — merge only after all remaining consumers are migrated and checks are green; then confirm the deployment is serving the merged commit and visually recheck the catalog.

## Definition of done

- [ ] No code imports, exports, or calls `StudioLabeledInput` or `StudioLabeledTextArea`.
- [ ] Both floating-label presentations are selected through the corresponding family component's `variant` prop.
- [ ] Floating-label wrappers add no second border or duplicate focus ring.
- [ ] Input typography remains 38px/24px; textarea typography remains 18px/14px with its multiline exception.
- [ ] Label typography/overlap remains consistent between standard and compact sizes.
- [ ] Focused source-governance tests, typecheck, and production build pass.
- [ ] Rendered Studio verification is complete before merge/deployment.
