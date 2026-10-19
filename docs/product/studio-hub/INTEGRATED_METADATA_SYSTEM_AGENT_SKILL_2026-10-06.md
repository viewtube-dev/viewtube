# ViewTube Integrated Metadata System — Agent Skill Specification

**Status:** Proposed skill architecture  
**Purpose:** Give an implementation agent complete control of the integrated metadata ecosystem while enforcing canonical ownership, UI clarity, evidence discipline and safe AI behavior.

## Skill name

`viewtube-integrated-metadata-system`

## Mission

Design, implement, audit, test and maintain the metadata lifecycle across Projects, ContentBuild, Publishing Package, Publisher, Manager, Content Analysis, Analytics and AI Brain without creating duplicate system ownership.

## Core invariants

1. Publisher owns unpublished publication execution.
2. Manager owns published-video changes.
3. Publishing Package owns structured package state.
4. ContentBuild owns content identity/history.
5. Analytics owns measurements.
6. Content Analysis interprets evidence.
7. Brain reasons over canonical context and validated knowledge.
8. Metadata Intelligence is a capability/interface, not a competing data owner.
9. Manual editing is always available.
10. AI never silently replaces user content.
11. Every AI operation has provenance.
12. Every state-changing operation is auditable and recoverable.

## Agent operating modes

### Inspect
Read repository contracts, current implementation, tests and docs.

### Plan
Produce a decision-complete implementation plan.

### Design
Produce component/API/data contracts.

### Implement
Use TDD and existing architecture.

### Audit
Find purpose overlap, duplicate ownership, UI drift and missing integration.

### Prompt Lab
Design or revise metadata prompt recipes.

### Experiment Analysis
Analyze historical metadata changes and analytics.

### Migration
Move old behavior into the canonical architecture without losing functionality.

### QA
Run unit, integration, browser and visual checks.

## Required workflow

1. Ground in current repository state.
2. Identify canonical data owner.
3. Identify existing implementation.
4. Identify compatibility requirements.
5. Design contract.
6. Write failing tests for behavior.
7. Implement minimal change.
8. Run focused tests.
9. Run broader tests.
10. Run browser/visual QA.
11. Audit the result.
12. Record architecture decisions.

## Agent questions

Before modifying behavior, verify:

- Which tool owns the action?
- Is the content published?
- Is this a field change or package change?
- Is the user asking for generation, refinement, analysis or application?
- What canonical system owns the state?
- What historical event must be recorded?
- What analytics association should be created?
- Should the result become Brain knowledge?
- Can the action be safely retried?
- Can the action be undone?

## Prompt-generation protocol

The agent must construct metadata requests from:

**creator + channel + niche + audience + content + project + ContentBuild + current package + historical evidence + analytics + goal + purpose + style + constraints**

Then select:

**single / selected / package / batch**

and:

**generate / refine / analyze / rank / compare**

## Anti-duplication checks

Before adding a module, search for:

- existing generation functions;
- existing package types;
- existing analytics services;
- existing Brain context;
- existing history/versioning;
- existing SubToolbox components.

Prefer extending canonical modules.

## UI audit protocol

For every metadata field confirm:

- manual editing is immediately visible;
- Generate is immediately visible;
- Refine is immediately visible;
- alternatives are reachable;
- current state is obvious;
- history is reachable;
- AI actions never obscure manual controls.

## Safety protocol

Never:

- fabricate performance claims;
- claim causal certainty from observational data;
- erase current metadata automatically;
- mutate published metadata without explicit apply;
- create duplicate canonical stores;
- bypass schema validation;
- persist raw model output without provenance.

## Skill outputs

The agent should be able to produce:

- architecture plans;
- decision records;
- API/type contracts;
- migration plans;
- prompt recipes;
- UI component maps;
- test plans;
- browser QA reports;
- historical analysis reports;
- Brain knowledge proposals.

## Completion gate

A task is incomplete until:

- behavior is tested;
- current Publisher functionality is preserved;
- lifecycle ownership is clear;
- UI purpose is visually obvious;
- generated outputs have provenance;
- state changes have history;
- analytics associations are preserved;
- Brain integration is explicit;
- failure/retry behavior is defined.
