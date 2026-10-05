---
name: viewtube-liquid-glass
description: Design, prototype, implement, test, and review Liquid Glass UI components for ViewTube while keeping semantic behavior, backend contracts, accessibility, performance, and visual rendering independently testable.
---

# ViewTube Liquid Glass Skill

## Mission

Build experimental and production-ready Liquid Glass interfaces for ViewTube without turning "glass" into a superficial theme.

This skill treats Liquid Glass as a combination of:
- material behavior;
- optical effects;
- geometry;
- depth;
- motion;
- interaction feedback;
- renderer strategy;
- semantic component architecture.

The skill must preserve ViewTube's component contracts and may produce completely different visual solutions for different components.

## Source Principles

The Liquid Glass Studio research provides the rendering inspiration:
- WebGL2/WebGPU;
- multipass blur;
- SDF-defined shapes;
- shader-based refraction/reflection/dispersion;
- parameterized controls;
- spring-based animation.

The component-building guidance provides the architecture discipline:
- primitives and components;
- composable APIs;
- slots/render props where appropriate;
- controlled/uncontrolled state;
- tokens and theming;
- accessibility;
- reusable contracts.

Frontend engineering guidance provides the verification discipline:
- responsive behavior;
- WCAG accessibility;
- state management;
- browser/runtime verification;
- performance checks;
- production-quality implementation.

## Governing Rules

1. Do not impose a global visual-family system.
2. Design from the component's job outward.
3. Preserve semantic HTML and accessible interaction.
4. Separate semantic state from visual rendering.
5. Use the lightest renderer that achieves the desired result.
6. Always provide a fallback for GPU-dependent effects.
7. Honor reduced motion.
8. Never call a recolor a new component concept.
9. Verify in a real browser before promotion.
10. Record important architectural decisions.

## Workflow

### Phase 1 — Source Audit

Inspect:
- existing ViewTube component;
- semantic HTML;
- current states;
- dimensions;
- tokens;
- interaction model;
- backend/data contract;
- responsive behavior;
- accessibility behavior.

Output:
`SOURCE-AUDIT.md`.

### Phase 2 — Functional Brief

Define:
- primary job;
- user context;
- success condition;
- information hierarchy;
- failure modes;
- backend dependencies;
- performance budget.

Do not design visual styling yet.

Output:
`FUNCTIONAL-BRIEF.md`.

### Phase 3 — Concept Generation

Generate 10–20 independent concepts.

For each concept vary meaningful dimensions:
- composition;
- geometry;
- interaction;
- information density;
- material behavior;
- depth;
- motion;
- control placement;
- feedback model.

Reject concepts that differ only by color, radius, shadow, or tint.

Select four directions with distinct optimization targets.

### Phase 4 — Material Design

Define the minimum material parameters needed by the component.

Typical parameters:
- fill opacity;
- backdrop blur;
- refraction;
- dispersion;
- edge/specular light;
- glare;
- tint;
- depth;
- surface noise;
- animation intensity.

Do not expose shader parameters merely because they exist. Expose parameters that improve the component's design/function.

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

### Phase 6 — Prototype

Build a real interactive prototype.

Required:
- keyboard interaction;
- focus state;
- hover/pressed states;
- disabled state;
- loading/error states when applicable;
- responsive layout;
- reduced-motion behavior;
- fallback rendering.

### Phase 7 — Runtime Verification

Use browser inspection to verify:
- DOM semantics;
- console errors;
- network failures;
- interaction behavior;
- layout at multiple sizes;
- frame/performance behavior;
- GPU fallback behavior.

### Phase 8 — Adversarial Review

Ask:

- Is this actually a new concept?
- Does the glass effect improve the component?
- Is text readable over dynamic backgrounds?
- Can the component work without GPU effects?
- Does reduced motion remove unnecessary motion?
- Is the API independent of visual styling?
- Would this survive integration into ViewTube?
- Is the component over-parameterized?
- Is the implementation more complex than the user value warrants?

### Phase 9 — Promotion Decision

Classify:
- Promote;
- Promote with changes;
- Merge with another concept;
- Keep as experiment;
- Reject.

Document why.

## Anti-Rationalization Table

| Excuse | Required response |
|---|---|
| "It is only a visual component." | Verify semantics and interaction. |
| "The shader is the design." | Define the component contract separately. |
| "We can add accessibility later." | Accessibility is part of the component contract. |
| "WebGL works on my machine." | Test fallback and representative browsers/devices. |
| "The variants are different colors." | Reject; generate structural alternatives. |
| "Tests can come later." | Add verification before promotion. |
| "We need every shader parameter." | Expose only meaningful component properties. |
| "Glass should be everywhere." | Apply glass only where it improves the job. |

## Evidence Required Before Promotion

Provide:
- source audit;
- component contract;
- rendered prototype;
- browser/runtime evidence;
- accessibility evidence;
- responsive evidence;
- performance/fallback evidence;
- tests/build output;
- decision record.

## Progressive Disclosure

Keep this file as the workflow entry point.

Load detailed references only when needed:
- `references/material-system.md`
- `references/component-contract.md`
- `references/performance.md`
- `references/accessibility.md`
- `references/runtime-review.md`
- `references/viewtube-integration.md`

## Completion

A Liquid Glass component is complete only when its semantic behavior, visual renderer, fallback path, accessibility behavior, responsive behavior, and verification evidence all agree.
