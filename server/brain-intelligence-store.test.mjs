import assert from "node:assert/strict";
import test from "node:test";
process.env.NODE_ENV = "production";
delete process.env.DATABASE_URL;

const {
  listPersistedBrainEvents,
  listPersistedLifecycleObservations,
  upsertPersistedBrainEvents,
  upsertPersistedLifecycleObservations,
} = await import("./brain-intelligence-store.mjs");

test("Brain intelligence events remain user and channel scoped", async () => {
  const userA = "test-user-a";
  const userB = "test-user-b";
  const channelA = "channel-a";
  const channelB = "channel-b";

  await upsertPersistedBrainEvents({
    userId: userA,
    channelId: channelA,
    events: [
      { id: "event-a", channelId: channelA, createdAt: 100 },
      { id: "wrong-channel", channelId: channelB, createdAt: 200 },
    ],
  });
  await upsertPersistedBrainEvents({
    userId: userB,
    channelId: channelA,
    events: [{ id: "event-b", channelId: channelA, createdAt: 300 }],
  });

  const rowsA = await listPersistedBrainEvents({ userId: userA, channelId: channelA });
  const rowsB = await listPersistedBrainEvents({ userId: userB, channelId: channelA });
  const otherChannel = await listPersistedBrainEvents({ userId: userA, channelId: channelB });

  assert.deepEqual(rowsA.map((row) => row.id), ["event-a"]);
  assert.deepEqual(rowsB.map((row) => row.id), ["event-b"]);
  assert.deepEqual(otherChannel, []);
});

test("lifecycle observations remain user and channel scoped", async () => {
  const userId = "test-user-observations";
  const channelId = "channel-observations";

  await upsertPersistedLifecycleObservations({
    userId,
    channelId,
    observations: [
      { channelId, videoId: "video-1", metric: "views", value: 100, lifecycleHour: 24, observedAt: 1000 },
      { channelId: "other-channel", videoId: "video-2", metric: "views", value: 200, lifecycleHour: 24, observedAt: 1000 },
    ],
  });

  const rows = await listPersistedLifecycleObservations({ userId, channelId });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].videoId, "video-1");
  assert.equal(rows[0].metric, "views");
});

test("server persistence strips raw creator communication on the first write", async () => {
  const userId = "test-user-server-redaction-first-write";
  const channelId = "channel-server-redaction-first-write";
  const rawText = "Private creator text must never reach durable storage.";
  await upsertPersistedBrainEvents({
    userId,
    channelId,
    events: [{
      id: "creator-communication:first-write",
      channelId,
      kind: "CREATOR_COMMUNICATION_CLASSIFIED",
      metadata: { communicationId: "first-write", communicationText: rawText },
    }],
  });

  const rows = await listPersistedBrainEvents({ userId, channelId });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].metadata.communicationText, undefined);
  assert.equal(rows[0].metadata.rawCommunicationTextRetained, false);
  assert.equal(rows[0].metadata.retentionPolicy, "classification-only-server-redaction-v1");
  assert.equal(JSON.stringify(rows[0]).includes(rawText), false);
});

test("server persistence never restores creator text after the record is redacted", async () => {
  const userId = "test-user-monotonic-redaction";
  const channelId = "channel-monotonic-redaction";
  const eventId = "creator-communication:channel-monotonic-redaction:legacy-1";
  const rawText = "Private creator message that must remain purged.";
  const baseEvent = {
    id: eventId,
    channelId,
    kind: "CREATOR_COMMUNICATION_CLASSIFIED",
    metadata: { communicationId: "legacy-1", communicationText: rawText },
  };
  const redactedEvent = {
    ...baseEvent,
    summary: "Creator communication classified; legacy raw text redacted.",
    metadata: {
      communicationId: "legacy-1",
      communicationTextFingerprint: "0123456789abcdef",
      rawCommunicationTextRetained: false,
      retentionPolicy: "classification-and-fingerprint-only-v1",
    },
  };

  await upsertPersistedBrainEvents({ userId, channelId, events: [baseEvent] });
  await upsertPersistedBrainEvents({ userId, channelId, events: [redactedEvent] });
  // A stale browser may retry the pre-redaction event after an offline period.
  await upsertPersistedBrainEvents({ userId, channelId, events: [baseEvent] });

  const rows = await listPersistedBrainEvents({ userId, channelId });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].metadata.communicationText, undefined);
  assert.equal(rows[0].metadata.rawCommunicationTextRetained, false);
  assert.equal(rows[0].metadata.communicationTextFingerprint, "0123456789abcdef");
  assert.equal(JSON.stringify(rows[0]).includes(rawText), false);
});

test("legacy creator communication redaction replaces previously persisted raw metadata", async () => {
  const userId = "test-user-communication-redaction";
  const channelId = "channel-communication-redaction";
  const eventId = "creator-communication:channel-communication-redaction:legacy-1";
  await upsertPersistedBrainEvents({
    userId,
    channelId,
    events: [{
      id: eventId,
      channelId,
      kind: "CREATOR_COMMUNICATION_CLASSIFIED",
      metadata: {
        communicationId: "legacy-1",
        communicationText: "Private creator message that must be purged.",
      },
    }],
  });

  await upsertPersistedBrainEvents({
    userId,
    channelId,
    events: [{
      id: eventId,
      channelId,
      kind: "CREATOR_COMMUNICATION_CLASSIFIED",
      metadata: {
        communicationId: "legacy-1",
        communicationTextFingerprint: "0123456789abcdef",
        rawCommunicationTextRetained: false,
      },
    }],
  });

  const rows = await listPersistedBrainEvents({ userId, channelId });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].metadata.communicationText, undefined);
  assert.equal(rows[0].metadata.rawCommunicationTextRetained, false);
  assert.equal(JSON.stringify(rows[0]).includes("Private creator message that must be purged."), false);
});
