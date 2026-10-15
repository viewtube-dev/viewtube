import assert from "node:assert/strict";
import test from "node:test";
import {
  listPersistedBrainLearningRecords,
  upsertPersistedBrainLearningRecords,
} from "./brain-intelligence-store.mjs";

test("learning records are user/channel scoped and idempotent by record type and id", async () => {
  const userA = "learning-test-user-a";
  const userB = "learning-test-user-b";
  const channelA = "learning-channel-a";
  const channelB = "learning-channel-b";
  const outcome = {
    recordType: "brainOutcome",
    record: { id: "outcome-1", channelId: channelA, outcome: "completed" },
  };
  const evaluation = {
    recordType: "evaluation",
    record: { id: "evaluation-1", channelId: channelA, outcome: "positive" },
  };

  assert.equal(await upsertPersistedBrainLearningRecords({
    userId: userA, channelId: channelA, records: [outcome, evaluation, outcome],
  }), 2);
  assert.equal(await upsertPersistedBrainLearningRecords({
    userId: userB, channelId: channelA, records: [outcome],
  }), 1);
  assert.equal(await upsertPersistedBrainLearningRecords({
    userId: userA, channelId: channelB, records: [outcome],
  }), 0);

  const rows = await listPersistedBrainLearningRecords({ userId: userA, channelId: channelA });
  assert.equal(rows.length, 2);
  assert.deepEqual(new Set(rows.map((row) => row.id)), new Set(["outcome-1", "evaluation-1"]));
  assert.equal((await listPersistedBrainLearningRecords({ userId: userB, channelId: channelA })).length, 1);
  assert.equal((await listPersistedBrainLearningRecords({ userId: userA, channelId: channelB })).length, 0);
});

test("learning record writes reject unsupported types and mismatched channel identities", async () => {
  const count = await upsertPersistedBrainLearningRecords({
    userId: "learning-test-user-validation",
    channelId: "learning-channel-validation",
    records: [
      { recordType: "unknown", record: { id: "bad-type", channelId: "learning-channel-validation" } },
      { recordType: "assetOutcome", record: { id: "wrong-channel", channelId: "another-channel" } },
      { recordType: "evaluation", record: { channelId: "learning-channel-validation" } },
    ],
  });
  assert.equal(count, 0);
});
