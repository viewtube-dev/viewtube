# Liquid Glass Lab — Architecture Decisions

## Decision 001 — Isolate the experiment

### Status
Accepted

### Decision
Build the Liquid Glass exploration environment on `feature/liquid-glass-lab` and place the runnable application under `apps/liquid-glass-lab`.

### Why
Liquid Glass is a substantial rendering and interaction experiment. Isolation prevents exploratory shader/material work from destabilizing ViewTube's existing UI system.

### Consequences
- The lab can change rapidly.
- Vercel can deploy the lab independently.
- Production ViewTube components remain untouched.
- Proven concepts can later be promoted deliberately.

## Decision 002 — Semantic behavior is renderer-independent

### Status
Accepted

### Decision
Component contracts describe semantics, state, events, accessibility, and data independently from the visual glass renderer.

### Why
A visual variant must not change what a button, input, slider, menu, or dialog means to the application/backend.

### Consequences
The same semantic contract can support:
- ordinary ViewTube rendering;
- CSS glass rendering;
- GPU-enhanced glass rendering;
- reduced-motion rendering;
- low-performance fallback rendering.

## Decision 003 — Progressive rendering

### Status
Accepted

### Decision
The system should support multiple rendering tiers instead of requiring WebGL/WebGPU.

### Why
The researched Liquid Glass Studio is GPU-heavy and primarily a visual exploration system. ViewTube needs broader device coverage and accessible fallbacks.

### Consequences
A component can select an appropriate renderer based on:
- browser capability;
- device/performance budget;
- user preference;
- reduced-motion preference;
- component criticality.

## Decision 004 — Independent component concepts

### Status
Accepted

### Decision
The lab does not define a universal set of four Liquid Glass visual families.

### Why
ViewTube's redesign process explicitly calls for independent concepts optimized around each component's unique properties and function.

### Consequences
Two glass buttons may look structurally unrelated if their jobs justify it. Similarity is allowed when it is earned by function rather than imposed by a style taxonomy.
