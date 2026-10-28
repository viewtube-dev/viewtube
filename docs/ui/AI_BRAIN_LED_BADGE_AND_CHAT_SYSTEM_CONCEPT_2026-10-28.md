# AI Brain LED Status Badge System & Chat Workspace Concept

**Date:** 2026-10-28  
**Status:** Design proposal / standalone interactive prototype  
**Target integration branch:** `master/consolidated-feature-integration`

## Purpose

Explore 35 diverse animated LED status-badge concepts, shortlist ten, and use those visual motifs to establish a coherent AI Brain workspace language across the chat composer, response modules, project strip, prompt module, and handoff cards.

This is a concept proposal, not a production integration. No live Brain runtime, evidence store, persistence owner, or publication workflow is replaced by this work.

## 35 badge concepts

1. **Pulse Core** — Single glass lens with a hot core and soft expanding halo.
2. **Twin Orbit** — Two unequal orbit LEDs crossing around a dark center.
3. **Signal Ladder** — Three rising rectangular signal bars with staggered ignition.
4. **Fiber Optic** — A bright fiber tip with a traveling light trail.
5. **Prism Split** — Triangular prism splitting a beam into three colors.
6. **Radar Sweep** — Thin radar arc sweeps around a fixed bright dot.
7. **Circuit Trace** — Angular PCB trace with a moving node.
8. **Breathing Ring** — Concentric rings breathe at different rates.
9. **Pixel Bloom** — Pixel cluster blooms from one seed to a matrix.
10. **Liquid Drop** — Glossy droplet with a refracted inner highlight.
11. **Candle Signal** — Tiny flame-shaped LED flickers inside a black socket.
12. **Magnetic Field** — Four curved field lines bend around a bright center.
13. **Helix** — Two colored strands twist in a looping helix.
14. **Monolith Slot** — Narrow luminous slit with a vertical scan.
15. **Comet Tail** — Bright comet head drags a dotted fading tail.
16. **Honeycomb** — One hex cell lights, then its neighbors answer.
17. **Heartbeat** — Two sharp waveform peaks on a compact baseline.
18. **Quantum Dice** — Three tiny facets flip between luminous states.
19. **Kaleidoscope** — Rotating four-way mirrored shards.
20. **Deep Sea** — Bioluminescent speck with drifting micro-particles.
21. **Magenta Coil** — Coiled neon tube winds around a black core.
22. **Thermal Bar** — A segmented heat meter sweeps cool to hot.
23. **Glass Capsule** — A capsule with a rolling luminous bead.
24. **Star Map** — Four stars connect into a changing constellation.
25. **Liquid Metal** — Chrome bead catches moving colored reflections.
26. **Ink Scan** — A luminous ink blot scans left to right.
27. **Dual Gate** — Two sliding gates open around a center light.
28. **Spiral Galaxy** — Bright nucleus with asymmetric spiral arms.
29. **Retro CRT** — Mini phosphor screen with rolling scanlines.
30. **Aurora Veil** — Three translucent ribbons ripple across the lens.
31. **Mechanical Iris** — Eight blades rotate open around a pinpoint LED.
32. **Data Rain** — Falling micro-glyphs converge on a bright landing point.
33. **Sonic Ring** — Nested sound rings ripple unevenly from the center.
34. **Warning Beacon** — Offset beacon cap flashes with a rotating side glow.
35. **Split Rail** — Two squared rails frame a saturated center LED.

## Ten selected directions

These are the strongest starting points for a varied but related system; the shortlist deliberately spans calm presence, analysis, generation, routing, progress, and gated actions.

1. **Pulse Core** — Default presence / ready state. Calm breathing halo; no aggressive flash.
2. **Prism Split** — Synthesis and multi-option generation. Color separation should be brief and restrained.
3. **Circuit Trace** — Context routing and connected evidence. A single node travels a clear path.
4. **Pixel Bloom** — Generating or assembling an answer. Grow from one seed to a compact matrix.
5. **Helix** — Multi-step reasoning or joined context streams. Slow, legible, low-amplitude rotation.
6. **Comet Tail** — Handoff in progress. Directional motion implies transfer, not completion.
7. **Thermal Bar** — Priority, load, or task progress. Use labeled states as well as color.
8. **Dual Gate** — Approval required / action blocked pending creator review. Never imply an action has executed.
9. **Aurora Veil** — Planning and synthesis. Soft layered motion for a non-blocking state.
10. **Split Rail** — Studio connection, context boundary, or split-mode state. Stable geometry with a distinct center light.

## Status semantics and motion rules

| Status family | Suggested motif | Motion |
|---|---|---|
| Ready / idle | Pulse Core | Slow, subtle breathing |
| Context linked / evidence routed | Circuit Trace | One traveling node |
| Synthesizing / multiple candidates | Prism Split | Short, restrained color split |
| Generating | Pixel Bloom | Progressive fill |
| Multi-step reasoning | Helix | Slow looping twist |
| Handoff transferring | Comet Tail | Directional travel |
| Progress / priority | Thermal Bar | Segmented progression, not a color-only signal |
| Approval needed / blocked | Dual Gate | Gate stays closed until explicit approval |
| Planning | Aurora Veil | Low-amplitude ribbon drift |
| Studio / split context | Split Rail | Stable rails; center LED reflects state |

Motion must never be the only way to communicate status. Pair each badge with text or an accessible label; support `prefers-reduced-motion`; avoid rapid flashing, shell movement, layout shifts, and decorative animation that competes with message content. Keep state changes deterministic and consistent across desktop and mobile.

## Brain workspace composition

### 1. Chat composer

- One obvious multiline entry field with a clear placeholder and visible send action.
- Keep capability access close to the entry point without turning the composer into a dense toolbar.
- Suggested tools: **Prompt**, **Context**, **Tools**, and **Evidence**; each opens a real, labeled picker in production.
- Keyboard send behavior, focus management, disabled/loading states, draft retention, and mobile viewport behavior must be explicit.
- A prompt selection prepares a draft; it must not silently send, invoke a capability, or change creator context.

### 2. Project strip

- Show the active project first, with compact switchable project/context chips.
- Separate project selection from evidence provenance and Brain runtime status.
- Use Split Rail or Circuit Trace sparingly to show an active context connection; never imply cross-device sync unless implemented.

### 3. Response modules

- Answer-first narrative remains the primary reading path.
- Attach compact expandable modules for plans, comparisons, evidence, uncertainty, and next steps.
- Use Pixel Bloom only while generating; return to a stable badge after completion.
- Evidence-linked claims must use the existing canonical evidence records and context pipeline; this visual design does not create a parallel evidence store.

### 4. Handoff cards

- Each card names the deliverable, what is ready, the next action, and what requires creator approval.
- Use Comet Tail during transfer and Dual Gate for pending approval.
- Separate **Keep draft**, **Review**, and any eventual **Approve** action. Do not claim publication or execution from a preview interaction.
- Show provenance and any missing evidence before a handoff is treated as ready.

### 5. Prompt module

- Organize by task intent: Investigate evidence, Generate concepts, Compare options, Prepare handoff.
- Each prompt has a short explanation and a deliberate **Use prompt** action.
- Selecting a prompt places editable text into the canonical composer; it does not execute automatically.
- Search, category selection, expanded details, and the composer draft should remain synchronized.

### 6. Responsive and accessibility behavior

- Desktop may use a context rail beside a bounded conversation viewport; mobile should prioritize the conversation and keep the composer reachable.
- Use one scroll owner for the transcript and pin the composer without covering the last response.
- Honor reduced motion, keyboard operation, visible focus, accessible names, contrast, and text scaling.
- Avoid color-only status, rapid flashing, ellipsis on essential labels, and animation that changes control geometry.

## Integration boundaries and acceptance gates

- Treat this document and the associated standalone HTML showcase as design artifacts only; the prototype's chat, prompt, and handoff actions are local demonstrations, not connected backend operations.
- Before production adoption, reconcile with the existing canonical Studio Controls exports, AI Brain composer owner, Prompt Library/capability registry, context selection, evidence pipeline, local persistence, and handoff/approval boundaries.
- Do not add duplicate state stores, registries, evidence systems, or replacement composer send owners.
- Add focused tests for status-to-badge mapping, reduced-motion behavior, accessible labels, keyboard and mobile composer flows, prompt-to-composer handoff, and approval gating.
- Validate the current target branch before editing; run focused tests, typecheck, production build, and rendered desktop/mobile visual checks before declaring implementation complete.

## Prototype artifact

The initial standalone interactive prototype was generated as `brain-led-badge-lab.html` in the design session. Its chat composer, prompts, and handoff cards are intentionally labeled as preview-only. This PR records the design contract and integration boundaries; it does not claim that the standalone HTML has been wired into the production application.
