# ViewTube Liquid Glass Lab — Specification

## Status
Proposed implementation on `feature/liquid-glass-lab`.

## Objective

Create an isolated, Vercel-launchable design laboratory for exploring a ViewTube-compatible Liquid Glass component system.

The lab is not the production ViewTube UI and does not replace the existing component library. It is an experimental environment for:

- exploring independent Liquid Glass component concepts;
- comparing material, geometry, depth, lighting, motion, and interaction treatments;
- defining reusable glass tokens and component contracts;
- testing frontend/backend separation;
- producing implementation-ready component specifications;
- identifying which concepts should graduate into ViewTube.

## Source Basis

The design direction is informed by:

- `iyinchao/liquid-glass-studio`: GPU-oriented glass rendering, WebGL2/WebGPU, multipass blur, SDF shapes, shader effects, parameter controls, and spring animation.
- Vercel Components Build skill: primitives, composable APIs, slots/render props, controlled/uncontrolled state, accessibility, tokens/theming, and publishable component architecture.
- Addy Osmani frontend UI engineering skill: component architecture, design systems, state, responsive behavior, WCAG accessibility, runtime verification, and engineering discipline.
- ViewTube's existing component library and independent-variant redesign process.

## Governing ViewTube Rule

Do not impose a global four-family visual system.

Each component may have an independent Liquid Glass expression chosen for its function. Glass is a material/interaction technology, not a mandatory visual template.

## Capability Map

| Module | Responsibility | Depends on |
|---|---|---|
| glass-material | Glass material tokens, effect parameters, fallback tiers | — |
| glass-components | Reusable semantic component contracts and renderers | glass-material |
| glass-lab | Interactive concept exploration and comparison | glass-material, glass-components |
| glass-contracts | Serializable component state/presets/backend contracts | glass-components |
| glass-skill | Agent workflow for designing, implementing, testing, and reviewing glass UI | all |

Build order: glass-material → glass-components → glass-contracts → glass-lab → glass-skill.

## Success Criteria

1. The lab runs locally with one documented command.
2. The lab can be deployed from Vercel using the `apps/liquid-glass-lab` root.
3. Users can switch between multiple independent component concepts.
4. Users can manipulate meaningful glass properties without editing source code.
5. Every interactive component retains semantic HTML behavior and keyboard accessibility.
6. Glass effects have quality/performance tiers and a non-WebGL fallback.
7. A concept can be described by a serializable component contract.
8. The skill provides a repeatable workflow with checkpoints and evidence requirements.
9. Nothing in the experiment requires production ViewTube UI adoption.
10. A future promotion can move a proven component into the ViewTube component library without changing its semantic/backend contract.

## Commands

From `apps/liquid-glass-lab`:

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Boundaries

### Always
- Preserve semantic HTML.
- Keep visual renderer separate from component behavior.
- Provide reduced-motion behavior.
- Provide a performance fallback.
- Document decisions that affect public contracts.
- Test before promotion.

### Ask first
- Adding production ViewTube dependencies.
- Changing existing ViewTube tokens.
- Adding a backend/database.
- Promoting a glass component into the canonical component library.
- Introducing GPU/shader dependencies into production.

### Never
- Replace existing ViewTube components globally from the lab.
- Hide inaccessible interactions behind visual effects.
- Treat a color change as a new component concept.
- Make backend contracts depend on a visual variant.
- Ship unverified WebGL-only UI.

## Project Structure

```
apps/liquid-glass-lab/
  index.html
  package.json
  src/
    main.jsx
    styles.css
    glass/
      materials.js
      concepts.js
      contracts.js

docs/plans/LIQUID_GLASS_LAB_SPEC.md
docs/decisions/LIQUID_GLASS_LAB_DECISIONS.md
skills/viewtube-liquid-glass/SKILL.md
```

## Initial Lab Capabilities

### Material explorer
Controls for:
- translucency;
- blur;
- refraction;
- edge/specular intensity;
- tint;
- depth;
- glare direction;
- animation amount;
- performance tier.

### Concept explorer
Initial independent concepts:
- Glass Slab;
- Fluid Capsule;
- Refraction Rail;
- Prism Tile;
- Frosted Command;
- Optical Drawer;
- Liquid Stack;
- Crystal Control.

These are starting experiments, not a global style taxonomy.

### Component playground
Initial semantic targets:
- button;
- icon button;
- input;
- slider;
- select;
- tag;
- card/panel;
- dialog/drawer;
- media control.

### Contract inspector
Show:
- semantic role;
- props;
- state machine;
- emitted events;
- persistence model;
- async lifecycle;
- accessibility requirements;
- performance tier;
- fallback behavior.

### Export target
Generate a Markdown/JSON-ready component specification suitable for a future ViewTube implementation.

## Architecture

```text
Semantic Component
      |
      +--> Component State / Events
      |
      +--> Glass Renderer
      |       +--> CSS effects
      |       +--> optional GPU effects
      |       +--> fallback renderer
      |
      +--> ViewTube Tokens
      |
      +--> Contract / Preset
      |
      +--> Lab Inspector
```

The backend, when eventually introduced, stores semantic component/preset data. It does not store assumptions about a particular visual renderer.

## Initial Backend Contract

The first lab is frontend-only. The contract is deliberately designed so persistence can be added later:

```ts
type GlassPreset = {
  id: string
  name: string
  component: string
  concept: string
  material: {
    tint: string
    opacity: number
    blur: number
    refraction: number
    edgeLight: number
    glare: number
    depth: number
  }
  motion: {
    intensity: number
    reducedMotion: boolean
  }
  performance: "high" | "balanced" | "lite" | "fallback"
}
```

## Promotion Gate

A concept may graduate toward ViewTube only after:

- functional contract review;
- visual originality review;
- accessibility review;
- responsive review;
- performance review;
- browser/runtime verification;
- reduced-motion verification;
- frontend/backend contract review;
- code review;
- documentation/ADR update.

The lab is successful even when a concept is rejected. Rejection is a design result.
