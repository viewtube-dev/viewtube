# ViewTube Resource Library Handoff

**Last audited:** 2026-10-15  
**Status:** Active — content convergence and depth remediation underway  
**Primary route:** `/resources`  
**Published collection:** 15 registered creator guides

## Purpose

The Resource Library is ViewTube's creator-facing knowledge system: source-grounded guides, references, playbooks and checklists rendered through the shared Toolbox/SubToolbox document system.

```text
Research and historical comparison
    ↓
Canonical runtime Markdown
    ↓
Resource registry
    ↓
Resource Library page
    ↓
Shared document renderer
    ↓
Creator-facing learning experience
```

## Current assessment

All 15 resource IDs are registered, but registration is not the same as editorial completion. Guides 1–3 are detailed creator-first resources of approximately 4,200–5,200 words. Guides 4–15 were substantially shorter at the start of this audit, approximately 600–800 words each, and are being expanded to deliver a comparable practical learning experience.

The goal is not to force every guide to the same word count. The goal is to ensure each one has enough useful substance: plain-language mental model, worked examples, creator questions, diagnostic workflows, decision aids, common mistakes, relevant ViewTube handoffs, glossary, and reliable sources. Reading time must reflect the final document.

## Source authority

- **Runtime content authority:** `src/features/resource-library/resources/*.md`, as imported by `src/features/resource-library/resourceLibraryRegistry.ts`.
- **Registry authority:** `src/features/resource-library/resourceLibraryRegistry.ts`.
- **Renderer authority:** `src/features/resource-library/ResourceDocumentRenderer.tsx` plus shared CSS.
- **Editorial mirrors:** `docs/resources/library/` contains copies of the first three guides for historical/editorial continuity. They must not be edited independently; sync them deliberately when changing the corresponding runtime source.
- **Git history and donor repository:** source of prior versions, not competing runtime authorities.
- **Older abbreviated drafts for guides 9–15:** seven unregistered files preserved under `docs/resources/archive/legacy-drafts/`. Their unique material was reviewed and carried into the registered guides where useful; the archive is for provenance and is not runtime content.

Donor repo: [themotionvisual/ViewTubeBUILD](https://github.com/themotionvisual/ViewTubeBUILD). Preserve the September 27 creator-facing rewrites of guides 1–2 as primary learning versions; use earlier technical versions to recover useful detail into optional Advanced Reference sections, not to replace the beginner-first path.

## Creator-first editorial contract

Every resource should:

1. Explain the idea in ordinary creator language before introducing jargon.
2. Explain why it matters to a real channel or video.
3. Give concrete examples, including contrasting examples where helpful.
4. Teach the reader what to inspect and how to interpret it.
5. Separate observation, documented fact, inference, creator anecdote and unknowns.
6. Offer practical next steps without inventing algorithm weights, thresholds or guarantees.
7. Connect the lesson to relevant ViewTube tools without claiming an integration exists unless current code confirms it.
8. Include a concise quick-reference table, useful glossary and sources with a description of what each source supports.
9. Put API/backend detail in optional Advanced Reference unless creators need it earlier.
10. Keep reading-time metadata honest and review dates explicit.

### Beginner test

Could a YouTuber without an analytics, API or machine-learning background understand the first half, use it to make a better decision, and know what to check next? If not, revise the main learning path.

## Canonical paths

- Inventory: `docs/resources/README.md`
- Template: `docs/resources/templates/VIEWTUBE_RESOURCE_DOCUMENT_TEMPLATE.md`
- Registry: `src/features/resource-library/resourceLibraryRegistry.ts`
- Registry/parser tests: `src/features/resource-library/resourceLibraryRegistry.test.ts`
- Render contract: `src/features/resource-library/ResourceLibrary.contract.test.tsx`
- Renderer: `src/features/resource-library/ResourceDocumentRenderer.tsx`
- Runtime resource content: `src/features/resource-library/resources/`
- Historical source map: `docs/recovery/VIEWTUBE_RESOURCE_LIBRARY_SOURCE_MAP_2026-10-04.md`

## Renderer contract

- Each `##` heading becomes a SubToolbox.
- Standard Markdown, tables, checklists, links and simple Mermaid flows are supported.
- Blockquotes can receive semantic callout tones based on their wording. A callout is not a verified external quotation; attribute direct quotations explicitly in the document.
- Avoid advanced Mermaid syntax and nested YAML structures until parser support is verified.
- Keep tables narrow enough to remain usable on mobile.

## Historical convergence workflow

Before changing a resource:
1. Read its current runtime file and registry metadata.
2. Inspect all path-specific Git history.
3. Compare any older abbreviated draft against the registered guide.
4. Check `themotionvisual/ViewTubeBUILD` for donor versions when relevant.
5. Preserve unique material and record the source/provenance of any recovered detail.
6. Edit the runtime authority, then update any editorial mirror deliberately.
7. Keep stable IDs and filenames unless a reviewed migration requires otherwise.

## Validation contract

Run or confirm the registry/parser tests, render contract, typecheck, lint, production build, route/source governance, and browser review on desktop and mobile. Compare full-suite failures against the base branch and report pre-existing failures separately. Do not claim a check passed unless it was actually run.

## Product boundaries

- Resource Library: reusable creator/platform knowledge.
- Vault: user assets.
- Research/evidence systems: project-specific evidence.
- User Guide: how to operate ViewTube.
- UI Reference Library: internal component/design-system reference.
- Engineering docs: implementation truth and plans.

Link between these systems when useful; do not duplicate their purpose.

## Completion checklist for the current convergence effort

- [ ] Runtime source authority and duplicate-copy policy are explicit.
- [ ] Guides 1–3 remain creator-first; useful technical history is preserved as optional reference where appropriate.
- [x] Older drafts for guides 9–15 are compared, their unique material preserved, and the original drafts archived outside the runtime directory.
- [ ] Guides 4–15 provide substantial beginner-facing explanations and practical application.
- [ ] Reading times are recalculated from actual content.
- [ ] Broken or placeholder source URLs are corrected or removed.
- [ ] Related-resource metadata and cross-links are coherent.
- [ ] Registry and renderer contracts pass.
- [ ] Desktop/mobile presentation is reviewed.
- [ ] A focused PR documents changes and validation results.

## Status of the first series

All 15 IDs remain registered. Guides 4–15 have been expanded substantially, their reading times and registry descriptions corrected, the first two technical donor guides recovered into optional Advanced Reference sections, and the seven short legacy drafts moved to the archive. The collection remains in **content-quality remediation** until tests, source checks, and rendered desktop/mobile review are complete.

