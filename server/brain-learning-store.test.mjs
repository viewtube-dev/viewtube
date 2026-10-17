import assert from "node:assert/strict";
import test from "node:test";
import {
  listPersistedBrainLearningRecords,
  upsertPersistedBrainLearningRecords,
} from "./brain-intelligence-store.mjs";

test("learning envelopes remain user/channel scoped and idempotent by type and record ID", async () => {
  const userA = "learning-test-user-a";
  const userB = "learning-test-user-b";
  const channelA = "learning-channel-a";
  const channelB = "learning-channel-b";
  const outcome = { recordType: "brainOutcome", record: { id: "outcome-1", channelId: channelA, outcome: "completed" } };
  const evaluation = { recordType: "evaluation", record: { id: "evaluation-1", channelId: channelA, outcome: "positive" } };

  assert.equal(await upsertPersistedBrainLearningRecords({ userId: userA, channelId: channelA, records: [outcome, evaluation, outcome] }), 2);
  assert.equal(await upsertPersistedBrainLearningRecords({ userId: userB, channelId: channelA, records: [outcome] }), 1);
  assert.equal(await upsertPersistedBrainLearningRecords({ userId: userA, channelId: channelB, records: [outcome] }), 0);

  const rows = await listPersistedBrainLearningRecords({ userId: userA, channelId: channelA });
  assert.equal(rows.length, 2);
  assert.deepEqual(new Set(rows.map((row) => row.record.id)), new Set(["outcome-1", "evaluation-1"]));
  assert.deepEqual(new Set(rows.map((row) => row.recordType)), new Set(["brainOutcome", "evaluation"]));
  assert.equal((await listPersistedBrainLearningRecords({ userId: userB, channelId: channelA })).length, 1);
  assert.equal((await listPersistedBrainLearningRecords({ userId: userA, channelId: channelB })).length, 0);
});

test("learning writes reject unknown types, missing IDs, and mismatched channel identities", async () => {
  const count = await upsertPersistedBrainLearningRecords({
    userId: "learning-test-user-validation",
    channelId: "learning-channel-validation",
    records: [
      { recordType: "unknown", record: { id: "bad-type", channelId: "learning-channel-validation" } },
      { recordType: "assetOutcome", record: { id: "wrong-channel", channelId: "another-channel" } },
      { recordType: "evaluation", record: { channelId: "learning-channel-validation" } },
      { recordType: "evaluation", id: "raw-record-not-envelope", channelId: "learning-channel-validation" },
    ],
  });
  assert.equal(count, 0);
});

test("learning writes reject conflicting stable identity reuse without replacing the canonical record", async () => {
  const userId = "learning-test-identity-conflict";
  const channelId = "learning-channel-identity-conflict";
  const original = {
    recordType: "brainOutcome",
    record: {
      id: "outcome-stable-identity",
      channelId,
      sourceRecordId: "asset-outcome-original",
      traceId: "trace-original",
      actionPacketId: "action-packet-1",
      outcome: "completed",
    },
  };
  assert.equal(await upsertPersistedBrainLearningRecords({ userId, channelId, records: [original] }), 1);

  await assert.rejects(
    upsertPersistedBrainLearningRecords({
      userId,
      channelId,
      records: [{
        recordType: "brainOutcome",
        record: {
          ...original.record,
          sourceRecordId: "asset-outcome-conflicting",
          traceId: "trace-conflicting",
        },
      }],
    }),
    /Brain learning identity conflict.*sourceRecordId/,
  );

  const rows = await listPersistedBrainLearningRecords({ userId, channelId });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].record.sourceRecordId, "asset-outcome-original");
  assert.equal(rows[0].record.traceId, "trace-original");
});

test("publication and evaluation lineage fields are immutable across stable learning-record retries", async () => {
  const userId = "learning-test-publication-identity";
  const channelId = "learning-channel-publication-identity";
  const originalOutcome = {
    recordType: "brainOutcome",
    record: {
      id: "outcome-publication-identity",
      channelId,
      sourceRecordId: "asset-outcome-1",
      traceId: "trace-1",
      contentBuildId: "build-1",
      publishTransactionId: "publish-1",
      approvedSnapshotHash: "snapshot-hash-1",
      publishedVideoId: "video-1",
      analyticsCheckpointIds: ["checkpoint-1"],
      evidenceIds: ["evidence-1"],
    },
  };
  await upsertPersistedBrainLearningRecords({ userId, channelId, records: [originalOutcome] });

  await assert.rejects(
    upsertPersistedBrainLearningRecords({
      userId,
      channelId,
      records: [{
        ...originalOutcome,
        record: { ...originalOutcome.record, publishedVideoId: "video-conflict" },
      }],
    }),
    /Brain learning identity conflict.*publishedVideoId/,
  );

  const originalEvaluation = {
    recordType: "evaluation",
    record: {
      id: "evaluation-publication-identity",
      channelId,
      projectId: "project-1",
      publishTransactionId: "publish-1",
      contentBuildId: "build-1",
      youtubeVideoId: "video-1",
      approvedSnapshotId: "snapshot-1",
      approvedSnapshotHash: "snapshot-hash-1",
      analyticsCheckpointIds: ["checkpoint-1"],
      evidenceIds: ["evidence-1"],
      outcome: "pending",
    },
  };
  await upsertPersistedBrainLearningRecords({ userId, channelId, records: [originalEvaluation] });

  await assert.rejects(
    upsertPersistedBrainLearningRecords({
      userId,
      channelId,
      records: [{
        ...originalEvaluation,
        record: { ...originalEvaluation.record, approvedSnapshotHash: "snapshot-hash-conflict" },
      }],
    }),
    /Brain learning identity conflict.*approvedSnapshotHash/,
  );

  const rows = await listPersistedBrainLearningRecords({ userId, channelId });
  assert.equal(rows.find((row) => row.record.id === originalOutcome.record.id)?.record.publishedVideoId, "video-1");
  assert.equal(rows.find((row) => row.record.id === originalEvaluation.record.id)?.record.approvedSnapshotHash, "snapshot-hash-1");
});

test("learning lifecycle updates may change outcome state while preserving stable evaluation identity", async () => {
  const userId = "learning-test-lifecycle-update";
  const channelId = "learning-channel-lifecycle-update";
  const pending = {
    recordType: "evaluation",
    record: {
      id: "evaluation-lifecycle-update",
      channelId,
      projectId: "project-1",
      publishTransactionId: "publish-1",
      youtubeVideoId: "video-1",
      approvedSnapshotHash: "snapshot-hash-1",
      outcome: "pending",
      updatedAt: 100,
    },
  };
  const resolved = {
    ...pending,
    record: { ...pending.record, outcome: "positive", updatedAt: 200 },
  };

  assert.equal(await upsertPersistedBrainLearningRecords({ userId, channelId, records: [pending] }), 1);
  assert.equal(await upsertPersistedBrainLearningRecords({ userId, channelId, records: [resolved] }), 1);
  const rows = await listPersistedBrainLearningRecords({ userId, channelId });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].record.outcome, "positive");
  assert.equal(rows[0].record.updatedAt, 200);
});

test("sparse retries preserve previously asserted stable identity fields", async () => {
  const userId = "learning-test-sparse-retry";
  const channelId = "learning-channel-sparse-retry";
  const original = {
    recordType: "brainOutcome",
    record: {
      id: "outcome-sparse-retry",
      channelId,
      sourceRecordId: "asset-outcome-original",
      traceId: "trace-original",
      projectId: "project-original",
      outcome: "completed",
    },
  };
  await upsertPersistedBrainLearningRecords({ userId, channelId, records: [original] });

  await upsertPersistedBrainLearningRecords({
    userId,
    channelId,
    records: [{
      recordType: "brainOutcome",
      record: {
        id: original.record.id,
        channelId,
        outcome: "reviewed",
      },
    }],
  });

  const rows = await listPersistedBrainLearningRecords({ userId, channelId });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].record.outcome, "reviewed");
  assert.equal(rows[0].record.sourceRecordId, "asset-outcome-original");
  assert.equal(rows[0].record.traceId, "trace-original");
  assert.equal(rows[0].record.projectId, "project-original");
});
