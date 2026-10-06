---
name: viewtube-liquid-glass
description: Design, prototype, implement, test, and review ViewTube Liquid Glass components using a shader-based optical material system derived from the Liquid Glass Studio reference while keeping semantic behavior, backend contracts, accessibility, performance, and rendering independently testable.
---

# ViewTube Liquid Glass Skill

## Mission

Build experimental and production-ready Liquid Glass interfaces for ViewTube without turning "glass" into a superficial CSS theme.

The primary external technical and visual reference is:

- Repository: https://github.com/iyinchao/liquid-glass-studio/
- Live material editor: https://liquid-glass-studio.vercel.app/

Canonical ViewTube research baseline:

- `docs/research/LIQUID_GLASS_STUDIO_SOURCE_AND_MATERIAL_MODEL.md`

The reference establishes the baseline material model. ViewTube may diverge where component semantics, accessibility, performance, or product requirements require it, but deviations must be explicit.

## Core Material Principle

Glass is a renderer/material, not a decorative surface.

A valid glass implementation must be able to respond to an environment behind the surface. The minimum credible pipeline is:

`environment -> blur -> geometry/SDF -> normals/edge depth -> refraction -> dispersion -> Fresnel -> glare -> tint/composite`

A translucent rectangle, backdrop blur, border, gradient, or shadow by itself is not considered a glass implementation.

## Reference Material Model

The Liquid Glass Studio source exposes and uses these material dimensions:

### Refraction
- thickness
- distance
- refractive factor
- dispersion

### Fresnel
- range
- hardness
- factor

### Glare
- range
- hardness
- factor
- convergence
- opposite-side factor
- angle

### Environment / blur
- Gaussian blur radius
- blur-edge behavior
- background/image/video source
- shadow expansion
- shadow strength
- shadow position

### Tint
- color
- alpha/strength

### Geometry
- width
- height
- radius
- roundness
- merge rate
- shape visibility

### Motion
- spring response
- pointer/interaction response

These controls are derived directly from the inspected `Controls.tsx` and `fragment-main.glsl` implementation. Preserve the vocabulary where practical so the ViewTube lab can be compared against the reference.

## Renderer Architecture

The reference repository uses WebGL2 and WebGPU and constructs a multipass pipeline:

1. background pass
2. vertical Gaussian blur
3. horizontal Gaussian blur
4. glass/main compositing pass

The main shader receives the original and blurred environment.

ViewTube should preserve this separation:

`semantic component`
→ `glass material contract`
→ `geometry/SDF`
→ `renderer backend`
→ `WebGL/WebGPU`
→ `fallback renderer`

A component must not depend on a specific graphics backend.

## Geometry Architecture

The reference uses signed-distance functions and smooth merging.

Use geometry to derive:
- surface boundary;
- normals;
- edge distance;
- refraction region;
- Fresnel response;
- glare region;
- anti-aliased edge behavior.

Do not substitute ordinary CSS border-radius for the material geometry when the component requires optical refraction.

## Optical Rules

### Refraction

Use the surface normal and edge/depth factor to displace environment sampling.

### Dispersion

Use channel-dependent environment sampling to create chromatic separation.

Do not simulate dispersion with a static colored border.

### Fresnel

Make edge/view-dependent reflection a material stage, not a generic highlight.

### Glare

Treat glare as directional optical response derived from surface orientation and the configured glare angle/range/hardness/convergence.

### Blur

Use the environment blur as an input to the material pipeline.

`backdrop-filter: blur()` may be used as a fallback or lightweight tier, but it is not the canonical high-quality implementation.

### Tint

Tint modifies the material/composited optical response. It is not simply a solid translucent fill.

## Glass Lab Requirements

The Liquid Glass Observatory must eventually include:

1. **Reference Rectangle Lab**
   - two independent glass rectangles;
   - identical controls;
   - live environment behind them;
   - immediate visual response.

2. **Material Controls**
   - refraction;
   - thickness;
   - distance;
   - refractive factor;
   - dispersion;
   - Fresnel;
   - glare;
   - tint;
   - blur;
   - shadow;
   - geometry;
   - motion.

3. **Environment Lab**
   - high-contrast images;
   - gradients/patterns;
   - UI-like content;
   - moving video;
   - custom user media where supported.

4. **Render Step Inspector**
   - SDF;
   - normals;
   - edge factor;
   - refracted image;
   - Fresnel;
   - glare;
   - final composite.

5. **Component Base Lab**
   - turn the reference rectangle into a reusable `GlassSurface`;
   - apply the same material to buttons, cards, inputs, panels, drawers, media controls, etc.

6. **Renderer/Fallback Lab**
   - WebGPU;
   - WebGL2;
   - balanced/lite;
   - non-GPU fallback.

## Component Workflow

### Phase 1 — Source Audit

Inspect:
- existing ViewTube component;
- semantic HTML;
- states;
- dimensions;
- tokens;
- interaction model;
- backend/data contract;
- responsive behavior;
- accessibility behavior.

### Phase 2 — Functional Brief

Define:
- primary job;
- user context;
- success condition;
- information hierarchy;
- failure modes;
- backend dependencies;
- performance budget.

### Phase 3 — Material Recreation

Before inventing ViewTube-specific glass variants, reproduce the reference rectangle behavior closely enough that the following are visibly demonstrable:

- environment distortion;
- blur;
- edge thickness;
- chromatic dispersion;
- Fresnel edge response;
- directional glare;
- tint;
- depth/shadow.

If these are not visible, do not proceed to component styling.

### Phase 4 — Concept Generation

Generate 10–20 independent component concepts.

A concept must differ structurally or behaviorally, not merely through:
- color;
- radius;
- shadow;
- opacity;
- tint.

### Phase 5 — Component Contract

Define:

```ts
type ComponentContract = {
  name: string
  role: string
  props: Record<string, unknown>
  states: string[]
  events: string[]
  controlled?: boolean
  asyncLifecycle?: string[]
  accessibility: string[]
  responsiveRules: string[]
  renderer: string
  fallbackRenderer: string
}
```

The semantic contract must survive a renderer swap.

### Phase 6 — Material Contract

Use a component-facing material schema rather than exposing raw shader uniforms:

```ts
type GlassMaterial = {
  shape: {
    type: 'roundedRect' | 'pill' | 'circle' | 'superellipse' | 'custom'
    width: number
    height: number
    radius: number
    roundness: number
    mergeRate: number
  }
  environment: {
    source: 'scene' | 'image' | 'video' | 'solid'
    blurRadius: number
    blurEdge: boolean
    shadowExpand: number
    shadowFactor: number
    shadowPosition: { x: number; y: number }
  }
  refraction: {
    thickness: number
    distance: number
    factor: number
    dispersion: number
  }
  fresnel: {
    range: number
    hardness: number
    factor: number
  }
  glare: {
    range: number
    hardness: number
    factor: number
    convergence: number
    oppositeFactor: number
    angle: number
  }
  tint: {
    color: string
    strength: number
    alpha: number
  }
  motion: {
    springSizeFactor: number
    enabled: boolean
  }
  renderer: {
    preferred: 'webgpu' | 'webgl'
    quality: 'high' | 'balanced' | 'lite' | 'fallback'
  }
}
```

This is an initial ViewTube contract and may evolve after renderer implementation.

### Phase 7 — Prototype

Build a real interactive prototype with:
- keyboard interaction;
- focus state;
- hover/pressed states;
- disabled state;
- loading/error states when applicable;
- responsive layout;
- reduced motion;
- fallback rendering;
- visible optical response.

### Phase 8 — Runtime Verification

Verify in a real browser:
- DOM semantics;
- console errors;
- network failures;
- interactions;
- multiple viewport sizes;
- rendering quality;
- performance;
- GPU fallback;
- reduced motion.

### Phase 9 — Adversarial Review

Ask:
- Does the environment visibly react through the glass?
- Is refraction actually visible?
- Is dispersion actually visible?
- Is the edge/thickness readable?
- Does Fresnel create an optical edge response?
- Does glare respond directionally?
- Is tint integrated into the material?
- Does the component still work without GPU effects?
- Is the semantic API independent of the renderer?
- Is the material over-parameterized?
- Does the effect improve the component's job?

### Phase 10 — Promotion

Classify:
- Promote;
- Promote with changes;
- Merge;
- Keep as experiment;
- Reject.

Record the reason.

## Governing Rules

1. Do not impose a global visual-family system.
2. Design from the component's job outward.
3. Preserve semantic HTML and accessible interaction.
4. Separate semantic state from visual rendering.
5. Treat Liquid Glass Studio as the primary external material reference.
6. Reproduce material behavior before inventing ViewTube-specific styling.
7. Use the lightest renderer that achieves the required optical result.
8. Always provide a fallback for GPU-dependent effects.
9. Honor reduced motion.
10. Never call a recolor a new component concept.
11. Verify in a real browser before promotion.
12. Record important architectural decisions.
13. Do not claim a glass component is successful because it is merely translucent.
14. When the material model changes, update the research baseline and skill references.

## Anti-Rationalization Table

| Excuse | Required response |
|---|---|
| "It is only a visual component." | Verify semantics and interaction. |
| "A translucent card is enough." | Test against an environment and require optical response. |
| "The shader is the design." | Define the component contract separately. |
| "We can add accessibility later." | Accessibility is part of the contract. |
| "WebGL works on my machine." | Test fallback and representative browsers/devices. |
| "The variants are different colors." | Reject; generate structural alternatives. |
| "Tests can come later." | Add verification before promotion. |
| "We need every shader parameter." | Expose only meaningful component properties. |
| "Glass should be everywhere." | Apply glass only where it improves the job. |

## Evidence Required Before Promotion

Provide:
- source audit;
- material recreation evidence;
- component contract;
- rendered prototype;
- browser/runtime evidence;
- accessibility evidence;
- responsive evidence;
- performance/fallback evidence;
- tests/build output;
- decision record.

## Completion

A Liquid Glass component is complete only when its semantic behavior, optical material, renderer, fallback path, accessibility behavior, responsive behavior, and verification evidence all agree.
