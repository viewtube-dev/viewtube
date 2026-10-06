# ViewTube Liquid Glass Material Research & Implementation Baseline

Status: canonical research baseline for the Liquid Glass Lab
Date: 2026-10-05

## 1. Required reference sources

This document establishes the following project as the primary technical reference for ViewTube's Liquid Glass experiments:

- Repository: https://github.com/iyinchao/liquid-glass-studio/
- README: https://github.com/iyinchao/liquid-glass-studio/blob/main/README.md
- App renderer orchestration: https://github.com/iyinchao/liquid-glass-studio/blob/main/src/App.tsx
- Control model: https://github.com/iyinchao/liquid-glass-studio/blob/main/src/Controls.tsx
- Live application: https://liquid-glass-studio.vercel.app/

The repository and live application are references, not code to copy blindly. The goal is to reproduce the underlying material behavior and architectural ideas in a ViewTube-compatible system.

## 2. Most important finding

The reference implementation does not create realistic glass primarily through ordinary CSS properties.

Its README explicitly describes:
- Refraction
- Dispersion
- Fresnel reflection
- Superellipse shapes
- Blob effect / shape merging
- Glare with customizable angle
- Gaussian blur masking
- Anti-aliasing
- WebGL2 / WebGPU dual-backend rendering
- Multipass Gaussian blur
- SDF-defined shapes and smooth merging
- Custom shader implementations

Therefore the ViewTube Glass Lab must treat **glass as a renderer/material**, not as a translucent surface style.

## 3. Actual renderer architecture observed in source

App.tsx constructs a multipass renderer.

WebGL pipeline:

1. bgPass
2. vBlurPass
3. hBlurPass
4. mainPass

The blur passes consume the preceding pass. The main pass receives both the original background and the blurred background.

The WebGPU implementation mirrors this pipeline with WGSL shaders.

This matters because a realistic glass component needs access to:
- the environment/background behind the component
- a blurred version of that environment
- the component's geometry/SDF
- geometry normals/edge distance
- material parameters

A simple DOM background with `backdrop-filter: blur()` cannot reproduce the full reference behavior.

## 4. Geometry model

The reference uses signed-distance geometry.

The shared SDF code defines:
- circle geometry
- rounded rectangle geometry
- superellipse-style corners
- smooth minimum / smooth merge

The rounded rectangle is not merely a CSS border-radius. Its distance field is used by the shader to derive material behavior.

The main SDF combines a circular shape and rounded rectangle using a smooth merge.

This provides the basis for:
- shape boundaries
- normals
- edge depth
- refraction displacement
- Fresnel response
- glare geometry
- anti-aliasing

### ViewTube requirement

Our material system should therefore separate:

`shape geometry -> distance field -> surface normal / edge depth -> material response -> compositing`

Geometry and material must not be conflated.

## 5. Refraction model

The main shader exposes these refraction controls:

| Control | Source default | Source range | Role observed in shader |
|---|---:|---:|---|
| refThickness | 20 | 1–80 | Defines the effective glass edge/thickness region |
| refDistance | 0.05 | 0–0.2 | Controls the amount of background displacement |
| refFactor | 1.4 | 1–4 | Refractive index-like factor used in angle calculation |
| refDispersion | 7 | 0–50 | Controls chromatic dispersion during texture sampling |
| refFresnelRange | 30 | 0–100 | Controls spatial range of Fresnel response |
| refFresnelHardness | 20 | 0–100 | Shapes Fresnel falloff |
| refFresnelFactor | 20 | 0–100 | Controls Fresnel contribution |

The shader derives an edge factor from the SDF distance and refThickness, then uses the surface normal to offset texture sampling.

This is the critical visual mechanism missing from our current prototype.

## 6. Chromatic dispersion

The shader samples the background and blurred background separately for RGB channels using slightly different offsets.

The source defines:

- N_R = 1.0 - 0.02
- N_G = 1.0
- N_B = 1.0 + 0.02

The dispersion parameter scales these channel-dependent sampling offsets.

This creates the colored separation that makes a glass edge read as an optical surface rather than a transparent gray rectangle.

### ViewTube requirement

Dispersion must be a real material operation.

It should not be simulated by adding a static pink/blue border.

## 7. Fresnel response

The reference calculates a Fresnel-like edge factor from the SDF position and refraction parameters.

It then mixes the refracted/blurred background toward a bright/highlighted response.

The source also contains comments showing alternative physical Fresnel formulations that were considered during development.

### ViewTube requirement

Fresnel should be:
- geometry-aware
- strongest around appropriate viewing/edge regions
- independently adjustable
- composited after the refraction stage

## 8. Glare model

Controls exposed by Controls.tsx:

| Control | Default | Range |
|---|---:|---:|
| glareRange | 30 | 0–100 |
| glareHardness | 20 | 0–100 |
| glareFactor | 90 | 0–120 |
| glareConvergence | 50 | 0–100 |
| glareOppositeFactor | 80 | 0–100 |
| glareAngle | -45 | -180–180 |

The shader derives a geometry factor from the SDF, derives a normal-based angle, and applies directional glare.

It also converts colors through LCH space for parts of the glare/fresnel treatment.

### ViewTube requirement

Glare is a directional optical response, not a generic box-shadow or white gradient.

The material editor therefore needs an explicit lighting/glare section with:
- direction
- range
- hardness
- intensity
- convergence
- opposite-side contribution

## 9. Tint

Controls.tsx exposes a color with RGBA components.

The shader uses the tint alpha to determine how strongly tint influences the refracted background.

The final shader stage also mixes the tint into the material before/alongside Fresnel and glare contributions.

### ViewTube requirement

Tint needs at least:
- hue/color
- opacity/strength
- interaction with Fresnel
- interaction with refraction
- interaction with glare

A CSS background color alone is insufficient.

## 10. Blur

The reference uses two explicit Gaussian blur passes.

Controls.tsx exposes:

- blurRadius: 1–200, default 1
- blurEdge: boolean, default true

The Gaussian kernel is computed from the blur radius.

The main shader can use:
- the blurred background for the interior
- selectively displaced blurred sampling at the glass edge
- the original background outside the shape

### ViewTube requirement

Blur must be modeled as part of the environment/compositing pipeline.

Do not treat `backdrop-filter: blur()` as the complete material implementation.

## 11. Shadow and environment

Controls.tsx exposes:

- shadowExpand: 2–100, default 25
- shadowFactor: 0–100, default 15
- shadowPosition: vector, default x=0, y=-10

These affect the background pass.

The reference therefore treats the environment around the glass as part of the visual result.

### ViewTube requirement

A glass component needs:
- environment context
- contact/ambient shadow behavior
- optional directional lighting
- background content that can visibly refract

## 12. Shape controls

The reference exposes:

- shapeWidth: 20–800, default 200
- shapeHeight: 20–800, default 200
- shapeRadius: 1–100, default 80
- shapeRoundness: 2–7, default 5
- mergeRate: 0–0.3, default 0.05
- showShape1: boolean

The shape is generated from SDFs rather than ordinary DOM geometry.

### ViewTube requirement

The material engine should eventually support a geometry contract independent of component semantics:

`shape = roundedRect | pill | circle | superellipse | customSDF`

A Button, Card, Drawer, or Media control can then request a shape without owning the rendering implementation.

## 13. Animation

App.tsx tracks pointer position and pointer velocity.

A spring controller drives mouse movement.

The shape size is modified by pointer velocity using springSizeFactor.

This creates physical-feeling elastic behavior.

Controls.tsx exposes:

- springSizeFactor: 0–50, default 10

### ViewTube requirement

Motion should remain a separate layer:

`semantic state -> material state -> animation state -> renderer`

Reduced motion must disable or simplify the dynamic response.

## 14. Debug/render-step architecture

The reference has a Show Step control from 0–9.

The shader exposes intermediate rendering stages including:
- SDF
- normals
- edge factor
- edge factor + normal
- basic blur/refraction
- Fresnel
- glare
- final compositing

This is exceptionally important for ViewTube.

### Required Glass Lab feature

Our observatory should include a **Render Pipeline / Step Inspector** that can show the intermediate material stages.

This lets us determine whether a visual problem comes from:
- geometry
- normals
- edge thickness
- blur
- refraction
- dispersion
- Fresnel
- glare
- compositing

## 15. Backend/rendering contract

The reference supports WebGL2 and WebGPU.

The ViewTube architecture should preserve this separation:

`Component semantic contract`
→ `Glass material contract`
→ `Geometry/SDF contract`
→ `Renderer backend`
→ `WebGL/WebGPU implementation`
→ `fallback renderer`

The component should not know whether its glass is implemented using WebGL, WebGPU, or a fallback.

## 16. Proposed ViewTube material schema

Initial conceptual schema:

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

This schema is deliberately close to the reference control vocabulary so the lab can reproduce the reference material before ViewTube-specific abstractions are added.

## 17. What the current ViewTube Glass Observatory gets wrong

The previous prototype emphasized:
- CSS translucency
- backdrop blur
- colored background decoration
- cards with borders/shadows
- semantic component examples

Those are useful UI scaffolding, but they do not demonstrate the reference material.

The missing core layers are:

1. Real environment sampling
2. Multipass Gaussian blur
3. SDF geometry
4. Surface normals
5. Edge-depth calculation
6. Normal-based refraction displacement
7. Chromatic dispersion
8. Fresnel response
9. Directional glare
10. LCH-based optical color treatment
11. Render-step inspection
12. WebGL/WebGPU renderer separation

## 18. New design rule

For this project, “glass” must pass the following visual test:

> If the environment behind the surface is replaced with a high-contrast image or moving video, the component must visibly distort, blur, separate, highlight, and optically respond to that environment.

A translucent white rectangle does not pass.

## 19. Prototype progression

### Phase 1 — Material recreation

Recreate the reference's two-rectangle test environment.

The lab should expose:
- original background
- glass rectangle A
- glass rectangle B
- live controls
- render-step inspector

### Phase 2 — Material controls

Implement the reference control groups:

- Refraction
- Dispersion
- Fresnel
- Glare
- Blur
- Tint
- Shadow
- Shape
- Animation

### Phase 3 — Renderer

Build:

`background -> blur vertical -> blur horizontal -> glass material -> compositing`

with WebGL first and WebGPU as the parallel backend.

### Phase 4 — Component base

Turn the rectangle material into a reusable glass surface primitive.

Candidate primitive:

`<GlassSurface>`

It receives a material contract and renders the requested geometry.

### Phase 5 — Semantic components

Build glass renderers for:
- Button
- Icon Button
- Input
- Slider
- Select
- Tag
- Card/Panel
- Drawer
- Dialog
- Media controls

The semantic contracts remain independent of the material.

### Phase 6 — ViewTube integration

Only after the material can reproduce the reference behavior should it be mapped into the canonical ViewTube component library.

## 20. Reference usage policy

Every future Liquid Glass plan, prototype, component experiment, and material decision must explicitly consider the Liquid Glass Studio repository and live application as the primary external reference.

Required references:

- https://github.com/iyinchao/liquid-glass-studio/
- https://liquid-glass-studio.vercel.app/

Source-derived claims must be checked against the repository implementation.

The live application is the visual verification reference for the material editor and control behavior.

We should not claim that a ViewTube glass implementation is successful merely because it looks translucent. It must demonstrate optical behavior comparable in principle to the reference.

## 21. Important source limitation

This document is grounded in the repository files inspected directly, especially README.md, App.tsx, Controls.tsx, fragment-main.glsl, sdf.glsl, the blur shaders, GLUtils.ts, PresetControls.tsx, and package.json.

The live Vercel application was also identified as the repository's published demo, but the automated live-browser inspection did not return a completed interaction report during this research run. Therefore this document does not invent live-only observations or claim exact live UI behavior that was not returned by the browser inspection.

