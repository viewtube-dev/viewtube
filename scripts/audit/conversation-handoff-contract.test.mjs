import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), "utf8");
const parse = (file) => JSON.parse(read(file));

const schema = parse("../../docs/governance/conversation-work-log.schema.json");
const template = read("../../.claude/skills/viewtube-conversation-handoff/templates/handoff-template.md");
const skill = read("../../.claude/skills/viewtube-conversation-handoff/SKILL.md");
const documentation = read("../../docs/governance/DOCUMENTATION.md");
const spec = read("../../docs/governance/CONVERSATION_HANDOFFS.md");
const worklogTemplate = parse("../../.claude/skills/viewtube-conversation-handoff/templates/worklog-template.json");
const intakeRoot = "../../tasks/conversation-intake/VT-CONV-2026-10-29-HANDOFF-LIVING-LOG";

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
  assert.equal(properties.documents.items.type, "object");
});

test("handoff template gives the one-link, one-phrase update instruction and bounded summary", () => {
  assert.match(template, /Update the unfinished work log\./);
  assert.match(template, /update this existing document and package in place/i);
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
  const worklog = parse(path.join(intakeRoot, "worklog.json"));
  const handoff = read(path.join(intakeRoot, "handoff.md"));
  const review = read(path.join(intakeRoot, "review.md"));

  assert.ok(Array.isArray(worklog.instructions) && worklog.instructions.length > 0);
  assert.ok(worklog.branchPrReconciliation.some((record) => record.pullRequest === 1170));
  assert.match(handoff, /pull\/1170/);
  assert.match(handoff, /0fd1d412758f212d8d6cf34a3a31d22270ea33c4/);
  assert.match(review, /PR #1170/);
  assert.match(review, /test:document-system/);
  assert.match(review, /audit:documents/);
});
