import { getAccountSnapshotData, getSessionUserId } from "../server/account-store.mjs";
import {
  listPersistedBrainEvents,
  listPersistedLifecycleObservations,
  upsertPersistedBrainEvents,
  upsertPersistedLifecycleObservations,
  listPersistedBrainLearningRecords,
  upsertPersistedBrainLearningRecords,
} from "../server/brain-intelligence-store.mjs";

const SESSION_COOKIE = "vt_session";
const parseCookies = (req) => Object.fromEntries(
  String(req.headers.cookie || "").split(";").map((part) => {
    const index = part.indexOf("=");
    return index < 0 ? [part.trim(), ""] : [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1))];
  }).filter(([key]) => key),
);

const requireUser = async (req) => {
  const userId = await getSessionUserId(parseCookies(req)[SESSION_COOKIE] || "");
  if (!userId) {
    const error = new Error("ViewTube sign-in required.");
    error.statusCode = 401;
    throw error;
  }
  return userId;
};

const requireConnectedChannel = async (userId, channelId) => {
  const account = await getAccountSnapshotData(userId);
  const connectedChannelId = String(account?.channelId || "").trim();
  if (!connectedChannelId || connectedChannelId !== channelId) {
    const error = new Error("The requested channel is not connected to this ViewTube account.");
    error.statusCode = 403;
    throw error;
  }
};

const readJson = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  const raw = Buffer.concat(chunks).toString("utf8");
  if (raw.length > 4_000_000) {
    const error = new Error("Brain intelligence payload is too large.");
    error.statusCode = 413;
    throw error;
  }
  return JSON.parse(raw);
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const userId = await requireUser(req);
    const method = String(req.method || "GET").toUpperCase();
    const url = new URL(req.url || "/api/brain-intelligence", `http://${req.headers.host || "localhost"}`);
    const channelId = String(url.searchParams.get("channelId") || "").trim();
    if (!channelId) return res.status(400).json({ error: "CHANNEL_ID_REQUIRED" });
    await requireConnectedChannel(userId, channelId);

    if (method === "GET") {
      const [events, observations, learningRecords] = await Promise.all([
        listPersistedBrainEvents({ userId, channelId }),
        listPersistedLifecycleObservations({ userId, channelId }),
        listPersistedBrainLearningRecords({ userId, channelId }),
      ]);
      return res.status(200).json({ channelId, events, observations, learningRecords });
    }

    if (method === "PUT") {
      const body = await readJson(req);
      const [eventCount, observationCount, learningRecordCount] = await Promise.all([
        upsertPersistedBrainEvents({ userId, channelId, events: body.events || [] }),
        upsertPersistedLifecycleObservations({ userId, channelId, observations: body.observations || [] }),
        upsertPersistedBrainLearningRecords({ userId, channelId, records: body.learningRecords || [] }),
      ]);
      return res.status(200).json({ ok: true, channelId, eventCount, observationCount, learningRecordCount });
    }

    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  } catch (error) {
    return res.status(Number(error?.statusCode) || 500).json({
      error: error instanceof Error ? error.message : "Brain intelligence persistence failed.",
    });
  }
}
