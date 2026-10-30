import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), "utf8");
const parse = (file) => JSON.parse(read(file));

const schema = parse("../../docs/governance/conversation-work-log.schema.json");
const template = read("../../.claude/skills/viewtube-conversation-handoff/templates/handoff-template.md");
const skill = read("../../.claude/skills/viewtube-conversation-handoff/SKILL.md");
const documentation = read("../../docs/governance/DOCUMENTATION.md");
const index = read("../../docs/Index.md");
const spec = read("../../docs/governance/CONVERSATION_HANDOFFS.md");
const worklogTemplate = parse("../../.claude/skills/viewtube-conversation-handoff/templates/worklog-template.json");
const intakeRoot = new URL("../../tasks/conversation-intake/VT-CONV-2026-10-29-HANDOFF-LIVING-LOG/", import.meta.url);

test("conversation work-log schema supports the living handoff metadata and evidence registers", () => {
  const properties = schema.properties;
  for (const key of [
    "conversationName",
    "application",
    "sourceApplication",
    "sourceConversationUrl",
    "repository",
    "targetBranch",
    "executiveSummary",
    "documents",
    "instructions",
    "branchPrReconciliation",
    "integrationGaps",
  ]) {
    assert.ok(properties[key], `schema is missing ${key}`);
  }
  assert.equal(properties.executiveSummary.maxItems, 10);
  assert.equal(properties.executiveSummary.items.type, "string");
  assert.equal(properties.documents.items.$ref, "#/$defs/document");
  assert.equal(schema.$defs.document.type, "object");
  assert.equal(schema.$defs.document.properties.path.minLength, 1);
});

test("handoff template gives the one-link, one-phrase update instruction and bounded summary", () => {
  assert.match(template, /Update the unfinished work log\./);
  assert.match(template, /update this existing document and its matching/i);
  assert.match(template, /Conversation date/);
  assert.match(template, /Conversation name/);
  assert.match(template, /Application \/ product/);
  assert.match(template, /Source application/);
  assert.match(template, /Links to documents created or changed/);
  assert.match(template, /Executive handoff — no more than 10 sentences/);
  assert.match(template, /Unfinished work — single-line checklist/);
  assert.match(template, /Five best finishing and improvement ideas/);
  assert.match(template, /- \[ \]/);
});

test("handoff skill instructs agents to update an existing linked log instead of duplicating it", () => {
  assert.match(skill, /Update the unfinished work log\./);
  assert.match(skill, /update the existing handoff package in place/i);
  assert.match(skill, /Do not create a second living log/i);
});

test("Documentation Governance recognizes the handoff as provenance, not a competing authority", () => {
  assert.match(documentation, /Conversation handoff and living logs/i);
  assert.match(documentation, /CONVERSATION_HANDOFFS\.md/);
  assert.match(documentation, /not a second Task Index or canonical task ledger/i);
  assert.match(index, /Update the unfinished work log\./);
  assert.match(spec, /Update the unfinished work log\./);
});

test("worklog template exposes all optional living-log collections", () => {
  for (const key of [
    "conversationName",
    "application",
    "sourceApplication",
    "sourceConversationUrl",
    "repository",
    "targetBranch",
    "executiveSummary",
    "documents",
    "instructions",
    "branchPrReconciliation",
    "integrationGaps",
  ]) {
    assert.ok(Object.hasOwn(worklogTemplate, key), `worklog template is missing ${key}`);
  }
  assert.ok(Array.isArray(worklogTemplate.executiveSummary));
  assert.ok(Array.isArray(worklogTemplate.documents));
  assert.ok(Array.isArray(worklogTemplate.instructions));
});

test("originating conversation package records PR 1170 and its actual delivery boundary", () => {
  const worklog = JSON.parse(fs.readFileSync(new URL("worklog.json", intakeRoot), "utf8"));
  const handoff = fs.readFileSync(new URL("handoff.md", intakeRoot), "utf8");
  const review = fs.readFileSync(new URL("review.md", intakeRoot), "utf8");

  assert.ok(Array.isArray(worklog.instructions) && worklog.instructions.length > 0);
  assert.ok(worklog.branchPrReconciliation.some((record) => record.pullRequest === 1170));
  assert.match(handoff, /pull\/1170/);
  assert.match(handoff, /0fd1d412758f212d8d6cf34a3a31d22270ea33c4/);
  assert.match(review, /PR #1170/);
  assert.match(review, /test:document-system/);
  assert.match(review, /audit:documents/);
});

test("originating worklog records truthful statuses, document links and all nine maturity axes", () => {
  const worklog = JSON.parse(fs.readFileSync(new URL("worklog.json", intakeRoot), "utf8"));
  const instructionStatuses = schema.$defs.instruction.properties.status.enum;
  const deliveryStates = schema.$defs.instruction.properties.deliveryState.enum;
  const branchClassifications = schema.$defs.branchPrReconciliation.properties.classification.enum;
  const axes = [
    "architecture",
    "backend",
    "frontend",
    "integration",
    "tests",
    "runtime",
    "responsive",
    "documentation",
    "release",
  ];

  assert.ok(worklog.executiveSummary.length <= 10);
  assert.ok(worklog.instructions.every((entry) => instructionStatuses.includes(entry.status)));
  assert.ok(worklog.instructions.every((entry) => deliveryStates.includes(entry.deliveryState)));
  assert.ok(worklog.documents.every((entry) => entry.title && entry.path && entry.url));
  assert.ok(worklog.branchPrReconciliation.every((entry) => branchClassifications.includes(entry.classification)));
  assert.ok(worklog.integrationGaps.every((entry) => axes.every((axis) => entry.maturity[axis])));
});
