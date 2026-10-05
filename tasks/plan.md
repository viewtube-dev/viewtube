# Liquid Glass Lab Implementation Plan

## Goal

Create an isolated ViewTube Liquid Glass exploration system that can be run locally and deployed as a standalone Vercel application.

## Dependency Graph

```
glass-material
   ↓
glass-components
   ↓
glass-contracts
   ↓
glass-lab
   ↓
glass-skill
   ↓
ViewTube promotion
```

## Work Packages

### 1. Foundation
- Material tokens and performance tiers.
- Serializable concept definitions.
- Semantic component contracts.

### 2. Lab
- Concept selector.
- Material controls.
- Component selector.
- Live preview.
- Contract inspector.
- Responsive layout.

### 3. Renderer evolution
- CSS baseline renderer.
- Optional GPU renderer.
- Fallback renderer.
- Runtime capability detection.

### 4. Component library
- First pilot components.
- Four independent directions per component.
- Shared semantic contracts.
- Accessibility and responsive states.

### 5. Skill
- Source audit workflow.
- Concept-generation workflow.
- Contract-first implementation.
- Browser verification.
- Performance/accessibility gates.
- Promotion/rejection decisions.

### 6. Integration
- Map promoted components to the existing ViewTube component library.
- Keep backend/data contracts renderer-independent.
- Add production tokens only after approval.

## Verification Gates

1. Build succeeds.
2. Lab renders without console errors.
3. Keyboard interaction works.
4. Reduced motion works.
5. Lite/fallback mode works.
6. Responsive layout works.
7. Contract inspector matches the semantic component.
8. No production ViewTube component is changed by the experiment.
9. Promoted concepts pass code/design/accessibility review.
