# ViewTube — Source-Code AI / Generation Audit

**Audit date:** 2026-10-05  
**Repository:** `viewtube-dev/viewtube`  
**Branch audited:** `main`  
**Audited commit:** `365c04a645721054316708a9072ee96be1fd7d49`

## Executive finding

The current `main` repository does **not** contain an implemented AI/generation runtime.

The source tree is currently:

```
src/
└── features/
    └── resource-library/
        └── resources/
            └── *.md
```

There are no JavaScript/TypeScript application files, package manifests, AI SDK imports, API client implementations, generation functions, prompt registries, agent runtimes, or server/API routes in the audited tree.

Therefore:

> The generation systems and prompts documented in the ViewTube planning documents are **architecture/specification**, not verified runtime implementations in the current `main` source tree.

## 1. Runtime implementation audit

### AI SDKs / model providers

Searched source/repository for common implementation indicators including:

- OpenAI
- Anthropic
- Gemini
- AI SDK
- `generateText`
- `streamText`
- `generateObject`
- chat completions
- model calls
- system/user message construction

**Result:** No runtime implementation found.

### HTTP/API generation calls

Searched for:

- `fetch(`
- Axios
- `/api/`
- model/API request patterns
- AI provider endpoints

**Result:** No generation API implementation found.

### Prompt source code

Searched source for:

- system prompts
- user prompts
- prompt templates
- generation instructions
- agent instructions
- generator functions

**Result:** No runtime prompt implementation found.

### Generated-output functions

Searched for:

- generator functions
- generation handlers
- AI response transformations
- output schemas tied to model calls
- generation pipelines

**Result:** No runtime generation functions found.

## 2. What DOES exist in source

The only current `src` feature is:

`src/features/resource-library/`

It contains Markdown knowledge resources.

One resource contains a literal user-facing prompt under an **Ask the Brain** section:

> “Analyze this video using the correct scope, metrics, dimensions and filters. Explain what changed, what evidence supports each conclusion, what is unknown, and which ViewTube tool I should open next.”

Source:

`src/features/resource-library/resources/youtube-metrics-and-dimensions-master-glossary.md`

This is a documented/useful prompt, but there is no corresponding AI runtime implementation in `src` that executes it.

## 3. Documentation prompts vs code prompts

The repository contains a substantial documented generation architecture, especially:

`docs/product/studio-hub/03_STUDIO_HUB_INTELLIGENCE_AI_BRAIN_PROMPTS.md`

That document contains the canonical Studio Hub default prompt contract and specialist prompt patterns.

Examples include:

- Opportunity Radar
- Content Architect
- Video Genome
- Story Engine
- Asset Forge
- Audience Pulse
- Content Autopilot
- Experiment Lab
- Causal Intelligence
- Channel Simulator
- Revenue Architect
- Channel Flywheel
- Creator Strategy Engine

These prompts are **verified as repository documentation**.

They are **not verified as runtime prompts**, because no source-code generation implementation exists in the current `main` tree.

## 4. Prompt evidence classification

| Prompt source | Exists? | Runtime verified? |
|---|---:|---:|
| Studio Hub default prompt contract | Yes | No |
| Studio Hub specialist prompt patterns | Yes | No |
| AI Brain documented prompt architecture | Yes | No |
| Ask the Brain Resource Library prompt | Yes | No |
| OpenAI runtime system prompts | No | No |
| Anthropic runtime system prompts | No | No |
| Gemini runtime system prompts | No | No |
| AI SDK generation templates | No | No |
| Runtime prompt registry | No | No |
| Runtime generation router | No | No |
| Runtime generator functions | No | No |
| Runtime AI API calls | No | No |
| Runtime output-generation handlers | No | No |

## 5. Important correction to previous generation document

`docs/product/VIEWTUBE_GENERATION_SYSTEMS_DEFAULT_PROMPTS.md` contains a mixture of:

1. repository-verified documented prompts;
2. architecture-derived defaults;
3. proposed defaults for capabilities that are not yet implemented.

It must **not** be interpreted as a catalog of prompts currently executing in ViewTube.

The distinction is now:

- **CODE-VERIFIED** — literal prompt/function/API call exists in source code.
- **DOC-VERIFIED** — literal prompt exists in repository documentation.
- **ARCHITECTURE** — documented system design, not runtime.
- **PROPOSED** — newly authored default for future implementation.

## 6. Current implementation gap

The current repository has a significant gap between the documented ViewTube generation architecture and executable source.

The documented architecture describes:

```
User Request
 → AI Brain
 → Context
 → Generation System
 → Prompt
 → AI Model
 → Validation
 → Artifact
 → Handoff
```

The current `main` source tree does not yet implement that pipeline.

## 7. What must exist for the documented generation systems to become runtime systems

At minimum, implementation will require:

1. application/runtime package structure;
2. model-provider abstraction;
3. secure provider/API configuration;
4. AI Brain/context interface;
5. prompt registry;
6. prompt versioning;
7. generator registry/router;
8. typed generator input/output schemas;
9. model invocation layer;
10. validation/evaluation layer;
11. provenance/generation records;
12. artifact storage;
13. permission/security boundaries;
14. tests and prompt regression fixtures;
15. UI/tool actions connected to the generation APIs.

## 8. Audit conclusion

**No actual ViewTube AI generation runtime was found in the audited `main` branch.**

The repository currently contains an extensive **documented generation architecture and prompt specification**, but not the corresponding executable AI implementation.

This is an important baseline for recovery and future implementation because it prevents documentation from being mistaken for shipped code.

---

## Audit scope

The audit covered the repository's complete Git tree at:

`365c04a645721054316708a9072ee96be1fd7d49`

The recursive tree reported no additional source-code directories beyond the documented `src/features/resource-library` Markdown resources.

**Next audit target:** historical branches/commits, especially the integration branch and any prior implementation commits, because the missing runtime may exist in repository history even though it is absent from current `main`.
