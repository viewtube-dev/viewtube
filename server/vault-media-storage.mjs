import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const MAX_BYTES = Math.max(1024, Number(process.env.VAULT_MEDIA_MAX_OUTPUT_BYTES) || 64 * 1024 * 1024);
const BILLING_ORIGIN = process.env.BILLING_ORIGIN || "http://localhost:5173";

const json = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": BILLING_ORIGIN,
    "Access-Control-Allow-Credentials": "true",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
};

const readBody = (req, maxBytes) => new Promise((resolve, reject) => {
  const chunks = [];
  let size = 0;
  let rejected = false;
  if (Number(req.headers["content-length"] || 0) > maxBytes) {
    const error = new Error("Media output exceeds storage size limit.");
    error.statusCode = 413;
    reject(error);
    req.resume();
    return;
  }
  req.on("data", (chunk) => {
    size += chunk.length;
    if (size > maxBytes && !rejected) {
      rejected = true;
      const error = new Error("Media output exceeds storage size limit.");
      error.statusCode = 413;
      reject(error);
      req.resume();
      return;
    }
    if (!rejected) chunks.push(chunk);
  });
  req.on("error", reject);
  req.on("end", () => { if (!rejected) resolve(Buffer.concat(chunks)); });
});

const parseMultipart = (buffer, contentType) => {
  const boundaryMatch = String(contentType || "").match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  const boundary = boundaryMatch ? (boundaryMatch[1] || boundaryMatch[2]).trim() : "";
  if (!boundary) return { fields: {}, file: null };
  const delimiter = Buffer.from(`--${boundary}`);
  const fields = {};
  let file = null;
  let offset = 0;
  while (true) {
    const start = buffer.indexOf(delimiter, offset);
    if (start < 0) break;
    const next = buffer.indexOf(delimiter, start + delimiter.length);
    if (next < 0) break;
    let part = buffer.subarray(start + delimiter.length, next);
    if (part.subarray(0, 2).toString() === "\r\n") part = part.subarray(2);
    if (part.subarray(part.length - 2).toString() === "\r\n") part = part.subarray(0, part.length - 2);
    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd >= 0) {
      const headers = part.subarray(0, headerEnd).toString("utf8");
      const payload = part.subarray(headerEnd + 4);
      const name = headers.match(/name="([^"]+)"/i)?.[1] || "";
      const filename = headers.match(/filename="([^"]*)"/i)?.[1];
      const mimeType = headers.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || "application/octet-stream";
      if (name === "file" && filename !== undefined) file = { data: payload, mimeType };
      else fields[name] = payload.toString("utf8");
    }
    offset = next;
  }
  return { fields, file };
};

const safeId = (value) => /^[a-f0-9-]{20,80}$/i.test(String(value || ""));
const ownerDirectory = (root, userId) => path.join(root, crypto.createHash("sha256").update(String(userId)).digest("hex"));

export const handleVaultMediaBinaryUploadRoute = async (req, res, userId) => {
  try {
    const root = String(process.env.VAULT_MEDIA_STORAGE_DIR || "").trim();
    if (!root) {
      return json(res, 503, {
        error: "VAULT_MEDIA_STORAGE_NOT_CONFIGURED",
        message: "Server media storage is not configured. Set VAULT_MEDIA_STORAGE_DIR to a mounted persistent disk path.",
      });
    }
    const contentType = String(req.headers["content-type"] || "");
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return json(res, 400, { error: "INVALID_CONTENT_TYPE", message: "Use multipart/form-data." });
    }
    const body = await readBody(req, MAX_BYTES + 128 * 1024);
    const { fields, file } = parseMultipart(body, contentType);
    if (!file?.data?.length) return json(res, 400, { error: "FILE_REQUIRED", message: "A non-empty media output is required." });
    if (file.data.length > MAX_BYTES) return json(res, 413, { error: "MEDIA_LIMIT_EXCEEDED", message: "Media output exceeds the configured size limit." });
    const sourceAssetId = String(fields.sourceAssetId || "").trim();
    const operation = String(fields.operation || "").trim();
    if (!sourceAssetId || !operation) return json(res, 400, { error: "LINEAGE_REQUIRED", message: "Source asset ID and operation are required." });
    let parameters = {};
    try { parameters = JSON.parse(fields.parameters || "{}"); } catch {
      return json(res, 400, { error: "INVALID_PARAMETERS", message: "Operation parameters must be valid JSON." });
    }
    const id = crypto.randomUUID();
    const directory = ownerDirectory(root, userId);
    await fs.mkdir(directory, { recursive: true });
    const binaryPath = path.join(directory, `${id}.bin`);
    const metadataPath = path.join(directory, `${id}.json`);
    const metadata = {
      id,
      ownerUserId: String(userId),
      name: String(fields.name || "media-derivative").slice(0, 180),
      mimeType: file.mimeType,
      byteSize: file.data.length,
      sourceAssetId,
      operation,
      parameters,
      createdAt: new Date().toISOString(),
    };
    const tempBinaryPath = `${binaryPath}.tmp`;
    const tempMetadataPath = `${metadataPath}.tmp`;
    try {
      await fs.writeFile(tempBinaryPath, file.data, { flag: "wx" });
      await fs.writeFile(tempMetadataPath, JSON.stringify(metadata), { flag: "wx" });
      await fs.rename(tempBinaryPath, binaryPath);
      await fs.rename(tempMetadataPath, metadataPath);
    } catch (error) {
      try { await fs.unlink(tempBinaryPath); } catch {}
      try { await fs.unlink(tempMetadataPath); } catch {}
      try { await fs.unlink(binaryPath); } catch {}
      try { await fs.unlink(metadataPath); } catch {}
      throw error;
    }
    return json(res, 201, { asset: metadata, storage: "server-persistent-disk" });
  } catch (error) {
    const status = Number(error?.statusCode) || 500;
    console.error("[vault-media-storage] upload failed", error);
    return json(res, status, {
      error: status === 413 ? "MEDIA_LIMIT_EXCEEDED" : "MEDIA_STORAGE_FAILED",
      message: status === 413 ? "Media output exceeds the configured size limit." : "Could not persist this media derivative.",
    });
  }
};

export const handleVaultMediaBinaryGetRoute = async (req, res, id, userId) => {
  try {
    const root = String(process.env.VAULT_MEDIA_STORAGE_DIR || "").trim();
    if (!root) return json(res, 503, { error: "VAULT_MEDIA_STORAGE_NOT_CONFIGURED", message: "Server media storage is not configured." });
    if (!safeId(id)) return json(res, 400, { error: "INVALID_MEDIA_ID", message: "Media ID is invalid." });
    const directory = ownerDirectory(root, userId);
    const metadataPath = path.join(directory, `${id}.json`);
    const binaryPath = path.join(directory, `${id}.bin`);
    let metadata;
    try { metadata = JSON.parse(await fs.readFile(metadataPath, "utf8")); } catch {
      return json(res, 404, { error: "MEDIA_NOT_FOUND", message: "Media derivative was not found for this account." });
    }
    if (String(metadata.ownerUserId) !== String(userId)) return json(res, 404, { error: "MEDIA_NOT_FOUND", message: "Media derivative was not found for this account." });
    const data = await fs.readFile(binaryPath);
    res.writeHead(200, {
      "Content-Type": metadata.mimeType || "application/octet-stream",
      "Content-Length": String(data.length),
      "Cache-Control": "private, no-store",
      "Access-Control-Allow-Origin": BILLING_ORIGIN,
      "Access-Control-Allow-Credentials": "true",
      "X-VT-Media-Id": id,
      "X-VT-Source-Asset-Id": String(metadata.sourceAssetId || ""),
    });
    res.end(data);
  } catch (error) {
    console.error("[vault-media-storage] download failed", error);
    return json(res, 500, { error: "MEDIA_STORAGE_READ_FAILED", message: "Could not retrieve the stored media derivative." });
  }
};
