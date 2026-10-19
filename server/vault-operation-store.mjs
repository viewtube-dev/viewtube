import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const json = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "private, no-store" });
  res.end(JSON.stringify(body));
};
const dirFor = (root, userId) => path.join(root, crypto.createHash("sha256").update(String(userId)).digest("hex"));
const idPattern = /^[0-9a-f-]{36}$/i;
const canonicalJson = (value) => JSON.stringify(value, (_key, item) => {
  if (!item || typeof item !== "object" || Array.isArray(item)) return item;
  return Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)));
});
const readBody = async (req) => {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk.toString("utf8");
    if (raw.length > 1024 * 1024) throw Object.assign(new Error("Request is too large."), { statusCode: 413 });
  }
  try { return JSON.parse(raw || "{}"); }
  catch { throw Object.assign(new Error("Expected JSON body."), { statusCode: 400 }); }
};
const persist = async (dir, record) => {
  const file = path.join(dir, record.id + ".json");
  const temp = file + "." + crypto.randomUUID() + ".tmp";
  await fs.writeFile(temp, JSON.stringify(record), { flag: "wx", mode: 0o600 });
  await fs.rename(temp, file);
};

/** Authenticated, per-account operation receipts. Configure a persistent mounted disk. */
export const handleVaultOperationStore = async ({ req, res, method, pathname, parsedUrl, userId }) => {
  const root = String(process.env.VAULT_OPERATION_STORAGE_DIR || "").trim();
  if (!root) return json(res, 503, { error: "VAULT_OPERATION_STORAGE_NOT_CONFIGURED" });
  if (!userId) return json(res, 401, { error: "Authentication required." });
  const dir = dirFor(root, userId);
  try {
    await fs.mkdir(dir, { recursive: true, mode: 0o700 });
    if (method === "GET" && pathname === "/api/vault/operations") {
      const files = (await fs.readdir(dir)).filter((name) => idPattern.test(name.replace(/\.json$/, "")) && name.endsWith(".json"));
      const records = [];
      for (const name of files) {
        try { records.push(JSON.parse(await fs.readFile(path.join(dir, name), "utf8"))); } catch {}
      }
      records.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
      return json(res, 200, { operations: records.slice(0, 100) });
    }
    if (method === "POST" && pathname === "/api/vault/operations") {
      const body = await readBody(req);
      const sourceAssetId = typeof body.sourceAssetId === "string" ? body.sourceAssetId.trim().slice(0, 180) : "";
      const operation = typeof body.operation === "string" ? body.operation.trim() : "";
      const key = typeof body.idempotencyKey === "string" ? body.idempotencyKey.trim().slice(0, 180) : "";
      if (!sourceAssetId || !key || !["image-transform", "video-trim", "video-proxy", "video-transcode", "frame-extract", "audio-extract", "compress-analysis", "thumbnail-generate", "metadata-analyze"].includes(operation)) {
        return json(res, 400, { error: "INVALID_OPERATION", message: "Source asset, supported operation, and idempotency key are required." });
      }
      const parameters = body.parameters && typeof body.parameters === "object" && !Array.isArray(body.parameters) ? body.parameters : {};
      const names = (await fs.readdir(dir)).filter((name) => name.endsWith(".json"));
      for (const name of names) {
        try {
          const prior = JSON.parse(await fs.readFile(path.join(dir, name), "utf8"));
          if (prior.idempotencyKey !== key) continue;
          const sameRequest = prior.sourceAssetId === sourceAssetId && prior.operation === operation && canonicalJson(prior.parameters || {}) === canonicalJson(parameters);
          if (!sameRequest) return json(res, 409, { error: "IDEMPOTENCY_KEY_CONFLICT" });
          return json(res, 200, { operation: prior, reused: true });
        } catch {}
      }
      if (names.length >= 1000) return json(res, 429, { error: "OPERATION_LIMIT_REACHED" });
      const now = new Date().toISOString();
      const record = { id: crypto.randomUUID(), userId: String(userId), sourceAssetId, operation, parameters, idempotencyKey: key, status: "queued", attempt: 0, createdAt: now, updatedAt: now, history: [{ status: "queued", at: now }] };
      await persist(dir, record);
      return json(res, 201, { operation: record, reused: false });
    }
    const match = pathname.match(/^\/api\/vault\/operations\/([0-9a-f-]{36})$/i);
    if (!match || !idPattern.test(match[1])) return json(res, 404, { error: "VAULT_OPERATION_NOT_FOUND" });
    const file = path.join(dir, match[1] + ".json");
    let record;
    try { record = JSON.parse(await fs.readFile(file, "utf8")); } catch { return json(res, 404, { error: "VAULT_OPERATION_NOT_FOUND" }); }
    if (String(record.userId) !== String(userId)) return json(res, 404, { error: "VAULT_OPERATION_NOT_FOUND" });
    if (method === "GET") return json(res, 200, { operation: record });
    if (method !== "PATCH") return json(res, 405, { error: "METHOD_NOT_ALLOWED" });
    const body = await readBody(req);
    const now = new Date().toISOString();
    if (body.action === "cancel" && ["queued", "running"].includes(record.status)) record.status = "cancelled";
    else if (body.action === "retry" && ["failed", "cancelled"].includes(record.status)) { record.status = "queued"; record.attempt += 1; record.error = null; }
    else return json(res, 409, { error: "INVALID_OPERATION_TRANSITION" });
    record.updatedAt = now;
    record.history.push({ status: record.status, at: now, reason: body.action });
    await persist(dir, record);
    return json(res, 200, { operation: record });
  } catch (error) {
    return json(res, Number(error?.statusCode) || 500, { error: "VAULT_OPERATION_STORE_FAILED", message: Number(error?.statusCode) === 400 || Number(error?.statusCode) === 413 ? error.message : "Could not access persistent operation storage." });
  }
};
