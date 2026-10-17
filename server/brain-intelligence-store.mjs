import pg from "pg";
import { withVerifiedPostgresSslMode } from "./account-store.mjs";

const { Pool } = pg;
const DATABASE_URL = String(process.env.DATABASE_URL || "").trim();
const NODE_ENV = String(process.env.NODE_ENV || "development");

let pool = null;
let initialized = false;
const memoryEvents = new Map();
const memoryObservations = new Map();
const memoryLearningRecords = new Map();

const schemaSql = `
CREATE TABLE IF NOT EXISTS viewtube_brain_intelligence_events (
  viewtube_user_id TEXT NOT NULL REFERENCES viewtube_users(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(viewtube_user_id,channel_id,event_id)
);
CREATE INDEX IF NOT EXISTS viewtube_brain_intelligence_events_channel_idx
  ON viewtube_brain_intelligence_events(viewtube_user_id,channel_id,updated_at DESC);
CREATE TABLE IF NOT EXISTS viewtube_brain_lifecycle_observations (
  viewtube_user_id TEXT NOT NULL REFERENCES viewtube_users(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  observation_key TEXT NOT NULL,
  observation JSONB NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(viewtube_user_id,channel_id,observation_key)
);
CREATE INDEX IF NOT EXISTS viewtube_brain_lifecycle_observations_channel_idx
  ON viewtube_brain_lifecycle_observations(viewtube_user_id,channel_id,observed_at DESC);
CREATE TABLE IF NOT EXISTS viewtube_brain_learning_records (
  viewtube_user_id TEXT NOT NULL REFERENCES viewtube_users(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  record JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(viewtube_user_id,channel_id,record_id)
);
CREATE INDEX IF NOT EXISTS viewtube_brain_learning_records_channel_idx
  ON viewtube_brain_learning_records(viewtube_user_id,channel_id,updated_at DESC);`;

const scope = (userId, channelId) => `${userId}:${channelId}`;

export const initBrainIntelligenceStore = async () => {
  if (initialized) return;
  if (!DATABASE_URL) {
    if (NODE_ENV === "production") throw new Error("DATABASE_URL is required for production Brain intelligence storage.");
    initialized = true;
    return;
  }
  const candidate = new Pool({
    connectionString: withVerifiedPostgresSslMode(DATABASE_URL),
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" },
    max: Math.max(2, Number(process.env.DATABASE_POOL_SIZE || 8)),
  });
  await candidate.query(schemaSql);
  pool = candidate;
  initialized = true;
};

export const listPersistedBrainEvents = async ({ userId, channelId }) => {
  await initBrainIntelligenceStore();
  if (!pool) return [...(memoryEvents.get(scope(userId, channelId))?.values() || [])];
  const result = await pool.query(
    `SELECT event FROM viewtube_brain_intelligence_events
     WHERE viewtube_user_id=$1 AND channel_id=$2 ORDER BY updated_at DESC LIMIT 2500`,
    [userId, channelId],
  );
  return result.rows.map((row) => row.event);
};

export const upsertPersistedBrainEvents = async ({ userId, channelId, events }) => {
  await initBrainIntelligenceStore();
  const rows = (Array.isArray(events) ? events : []).filter((event) => event?.id && event?.channelId === channelId).slice(0, 2500);
  if (!pool) {
    const key = scope(userId, channelId);
    const map = memoryEvents.get(key) || new Map();
    rows.forEach((event) => map.set(event.id, event));
    memoryEvents.set(key, map);
    return rows.length;
  }
  for (const event of rows) {
    await pool.query(
      `INSERT INTO viewtube_brain_intelligence_events(viewtube_user_id,channel_id,event_id,event)
       VALUES($1,$2,$3,$4::jsonb)
       ON CONFLICT(viewtube_user_id,channel_id,event_id)
       DO UPDATE SET event=EXCLUDED.event,updated_at=NOW()`,
      [userId, channelId, event.id, JSON.stringify(event)],
    );
  }
  return rows.length;
};

export const listPersistedLifecycleObservations = async ({ userId, channelId }) => {
  await initBrainIntelligenceStore();
  if (!pool) return [...(memoryObservations.get(scope(userId, channelId))?.values() || [])];
  const result = await pool.query(
    `SELECT observation FROM viewtube_brain_lifecycle_observations
     WHERE viewtube_user_id=$1 AND channel_id=$2 ORDER BY observed_at DESC LIMIT 12000`,
    [userId, channelId],
  );
  return result.rows.map((row) => row.observation);
};

export const upsertPersistedLifecycleObservations = async ({ userId, channelId, observations }) => {
  await initBrainIntelligenceStore();
  const rows = (Array.isArray(observations) ? observations : []).filter((row) => row?.channelId === channelId && row?.videoId && row?.metric);
  const observationKey = (row) => `${row.videoId}:${row.metric}:${Math.round(Number(row.lifecycleHour || 0) * 100)}:${Number(row.observedAt || 0)}`;
  if (!pool) {
    const key = scope(userId, channelId);
    const map = memoryObservations.get(key) || new Map();
    rows.forEach((row) => map.set(observationKey(row), row));
    memoryObservations.set(key, map);
    return rows.length;
  }
  for (const row of rows.slice(0, 12000)) {
    await pool.query(
      `INSERT INTO viewtube_brain_lifecycle_observations(viewtube_user_id,channel_id,observation_key,observation,observed_at)
       VALUES($1,$2,$3,$4::jsonb,to_timestamp($5/1000.0))
       ON CONFLICT(viewtube_user_id,channel_id,observation_key)
       DO UPDATE SET observation=EXCLUDED.observation,observed_at=EXCLUDED.observed_at,updated_at=NOW()`,
      [userId, channelId, observationKey(row), JSON.stringify(row), Number(row.observedAt || Date.now())],
    );
  }
  return rows.length;
};


/**
 * Durable learning records are scoped to both the authenticated ViewTube user
 * and the connected channel. Stable record IDs make retries idempotent.
 * Raw creator communication must not be stored here; records should contain
 * reviewed candidates, evaluation summaries, and explicit provenance only.
 */
export const listPersistedBrainLearningRecords = async ({ userId, channelId }) => {
  await initBrainIntelligenceStore();
  if (!pool) return [...(memoryLearningRecords.get(scope(userId, channelId))?.values() || [])];
  const result = await pool.query(
    `SELECT record FROM viewtube_brain_learning_records
     WHERE viewtube_user_id=$1 AND channel_id=$2 ORDER BY updated_at DESC LIMIT 5000`,
    [userId, channelId],
  );
  return result.rows.map((row) => row.record);
};

export const upsertPersistedBrainLearningRecords = async ({ userId, channelId, records }) => {
  await initBrainIntelligenceStore();
  const allowedTypes = new Set(["assetOutcome", "brainOutcome", "evaluation", "learningCandidate"]);
  const publicationIdentityFields = [
    "publishTransactionId",
    "approvedSnapshotId",
    "approvedSnapshotHash",
    "publishedVideoId",
    "youtubeVideoId",
    "publicationIdentity",
    "analyticsCheckpointIds",
    "evidenceIds",
  ];
  const recommendationIdentityFields = [
    "sourceRecordId",
    "traceId",
    "assetId",
    "assetType",
    "projectId",
    "contentBuildId",
    "generationId",
    "actionPacketId",
    "workflowId",
    "recommendationId",
    "experimentId",
  ];
  const identityFields = {
    assetOutcome: [...recommendationIdentityFields, ...publicationIdentityFields, "evaluationRecordId"],
    brainOutcome: [...recommendationIdentityFields, ...publicationIdentityFields],
    evaluation: [
      "projectId", "source", "recommendation", "actionPacketId", "workflowId",
      "recommendationId", "experimentId", "publishTransactionId", "contentBuildId",
      "youtubeVideoId", "approvedSnapshotId", "approvedSnapshotHash", "selectedWindow",
      "analyticsCheckpointIds", "evidenceIds", "publicationIdentity",
    ],
    learningCandidate: [
      "projectId", "evaluationRecordId", "source", "recommendation", "selectedWindow",
      "actionPacketId", "workflowId", "recommendationId", "experimentId",
      "publishTransactionId", "contentBuildId", "youtubeVideoId", "approvedSnapshotId",
      "approvedSnapshotHash", "analyticsCheckpointIds", "evidenceIds", "publicationIdentity",
    ],
  };
  const hasIdentityValue = (value) => value !== undefined && value !== null && value !== "";
  const assertIdentityCompatible = (existing, incoming) => {
    if (!existing || !incoming || existing.recordType !== incoming.recordType) return;
    for (const field of identityFields[incoming.recordType] || []) {
      const previous = existing.record?.[field];
      const next = incoming.record?.[field];
      // Missing legacy fields may be enriched, but two asserted identities may not conflict.
      if (hasIdentityValue(previous) && hasIdentityValue(next) && JSON.stringify(previous) !== JSON.stringify(next)) {
        throw new Error(`Brain learning identity conflict for ${incoming.recordType}:${incoming.record.id} (${field}).`);
      }
    }
  };
  const preserveMissingIdentity = (existing, incoming) => {
    if (!existing || !incoming || existing.recordType !== incoming.recordType) return incoming;
    const record = { ...incoming.record };
    for (const field of identityFields[incoming.recordType] || []) {
      if (!hasIdentityValue(record[field]) && hasIdentityValue(existing.record?.[field])) {
        record[field] = existing.record[field];
      }
    }
    return { ...incoming, record };
  };
  const unique = new Map();
  for (const item of Array.isArray(records) ? records : []) {
    if (!item || !allowedTypes.has(item.recordType) || !item.record
      || typeof item.record.id !== "string" || !item.record.id.trim()
      || item.record.channelId !== channelId) continue;
    const key = `${item.recordType}:${item.record.id}`;
    const previous = unique.get(key);
    assertIdentityCompatible(previous, item);
    unique.set(key, preserveMissingIdentity(previous, item));
  }
  const rows = [...unique.values()].slice(0, 1000);
  const recordKey = (item) => `${item.recordType}:${item.record.id}`;
  if (!pool) {
    const key = scope(userId, channelId);
    const map = memoryLearningRecords.get(key) || new Map();
    for (const item of rows) {
      const previous = map.get(recordKey(item));
      assertIdentityCompatible(previous, item);
      map.set(recordKey(item), preserveMissingIdentity(previous, item));
    }
    memoryLearningRecords.set(key, map);
    return rows.length;
  }
  for (const item of rows) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Serialize same-user/channel/record writes, including first-insert races.
      await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`${userId}:${channelId}:${recordKey(item)}`]);
      const existing = await client.query(
        `SELECT record FROM viewtube_brain_learning_records
         WHERE viewtube_user_id=$1 AND channel_id=$2 AND record_id=$3 FOR UPDATE`,
        [userId, channelId, recordKey(item)],
      );
      const previous = existing.rows[0]?.record;
      if (previous) assertIdentityCompatible(previous, item);
      const durableItem = preserveMissingIdentity(previous, item);
      await client.query(
        `INSERT INTO viewtube_brain_learning_records(viewtube_user_id,channel_id,record_id,record)
         VALUES($1,$2,$3,$4::jsonb)
         ON CONFLICT(viewtube_user_id,channel_id,record_id)
         DO UPDATE SET record=EXCLUDED.record,updated_at=NOW()`,
        [userId, channelId, recordKey(item), JSON.stringify(durableItem)],
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  return rows.length;
};
