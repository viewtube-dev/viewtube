import { afterEach, describe, expect, it } from "vitest";
import { Readable } from "node:stream";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  handleVaultMediaBinaryGetRoute,
  handleVaultMediaBinaryUploadRoute,
} from "./vault-media-storage.mjs";

let root = "";
const priorRoot = process.env.VAULT_MEDIA_STORAGE_DIR;

const multipart = (fields, file, boundary) => {
  const chunks = [];
  for (const [name, value] of Object.entries(fields)) {
    chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`));
  }
  chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="output.mp4"\r\nContent-Type: video/mp4\r\n\r\n`));
  chunks.push(Buffer.from(file));
  chunks.push(Buffer.from(`\r\n--${boundary}--\r\n`));
  return Buffer.concat(chunks);
};

const makeRequest = (body, boundary) => {
  const request = Readable.from([body]);
  request.headers = { "content-type": `multipart/form-data; boundary=${boundary}`, "content-length": String(body.length) };
  return request;
};

const makeResponse = () => ({
  status: 0,
  headers: {},
  body: null,
  writeHead(status, headers) { this.status = status; this.headers = headers; },
  end(body) { this.body = body; },
});

afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
  root = "";
  if (priorRoot === undefined) delete process.env.VAULT_MEDIA_STORAGE_DIR;
  else process.env.VAULT_MEDIA_STORAGE_DIR = priorRoot;
});

describe("Vault media binary storage", () => {
  it("stores binary bytes and returns them only to the owning account", async () => {
    root = await mkdtemp(path.join(os.tmpdir(), "vt-vault-storage-test-"));
    process.env.VAULT_MEDIA_STORAGE_DIR = root;
    const boundary = "vt-test-boundary";
    const body = multipart({
      name: "clip-trim.mp4",
      sourceAssetId: "source-123",
      operation: "trim",
      parameters: JSON.stringify({ startSeconds: 1, endSeconds: 3 }),
    }, "processed bytes", boundary);
    const uploadResponse = makeResponse();
    await handleVaultMediaBinaryUploadRoute(makeRequest(body, boundary), uploadResponse, "owner-a");
    expect(uploadResponse.status).toBe(201);
    const payload = JSON.parse(uploadResponse.body);
    const id = payload.asset.id;
    expect(payload.asset.sourceAssetId).toBe("source-123");
    expect(await readFile(path.join(root, (await import("node:crypto")).default.createHash("sha256").update("owner-a").digest("hex"), `${id}.bin`), "utf8")).toBe("processed bytes");

    const readResponse = makeResponse();
    await handleVaultMediaBinaryGetRoute({ headers: {} }, readResponse, id, "owner-a");
    expect(readResponse.status).toBe(200);
    expect(readResponse.body.toString("utf8")).toBe("processed bytes");

    const otherOwnerResponse = makeResponse();
    await handleVaultMediaBinaryGetRoute({ headers: {} }, otherOwnerResponse, id, "owner-b");
    expect(otherOwnerResponse.status).toBe(404);
  });

  it("does not pretend server storage exists without a configured persistent directory", async () => {
    delete process.env.VAULT_MEDIA_STORAGE_DIR;
    const boundary = "vt-test-boundary";
    const body = multipart({
      name: "clip.mp4", sourceAssetId: "source-123", operation: "proxy", parameters: "{}",
    }, "bytes", boundary);
    const response = makeResponse();
    await handleVaultMediaBinaryUploadRoute(makeRequest(body, boundary), response, "owner-a");
    expect(response.status).toBe(503);
    expect(JSON.parse(response.body).error).toBe("VAULT_MEDIA_STORAGE_NOT_CONFIGURED");
  });
});
