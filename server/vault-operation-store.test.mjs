import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { handleVaultOperationStore } from "./vault-operation-store.mjs";

const invoke = async ({ method, pathname, userId = "user-a", body, root }) => {
  const chunks = body === undefined ? [] : [Buffer.from(JSON.stringify(body))];
  const req = Readable.from(chunks);
  const res = {
    statusCode: 0,
    headers: {},
    body: "",
    writeHead(status, headers) { this.statusCode = status; this.headers = headers; },
    end(value = "") { this.body = String(value); },
  };
  const previous = process.env.VAULT_OPERATION_STORAGE_DIR;
  if (root === undefined) delete process.env.VAULT_OPERATION_STORAGE_DIR;
  else process.env.VAULT_OPERATION_STORAGE_DIR = root;
  try {
    await handleVaultOperationStore({
      req, res, method, pathname, parsedUrl: new URL("http://localhost" + pathname), userId,
    });
    return { status: res.statusCode, headers: res.headers, body: JSON.parse(res.body || "{}") };
  } finally {
    if (previous === undefined) delete process.env.VAULT_OPERATION_STORAGE_DIR;
    else process.env.VAULT_OPERATION_STORAGE_DIR = previous;
  }
};

test("Vault operation store fails closed when persistent storage is not configured", async () => {
  const response = await invoke({ method: "GET", pathname: "/api/vault/operations", userId: "user-a" });
  assert.equal(response.status, 503);
  assert.equal(response.body.error, "VAULT_OPERATION_STORAGE_NOT_CONFIGURED");
});

test("Vault operation records are idempotent, persistent, and scoped to authenticated user", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "vault-operations-"));
  try {
    const request = { sourceAssetId: "asset-1", operation: "image-transform", idempotencyKey: "request-1", parameters: { width: 640 } };
    const created = await invoke({ method: "POST", pathname: "/api/vault/operations", userId: "user-a", body: request, root });
    assert.equal(created.status, 201);
    assert.equal(created.body.operation.status, "queued");
    const repeated = await invoke({ method: "POST", pathname: "/api/vault/operations", userId: "user-a", body: request, root });
    assert.equal(repeated.status, 200);
    assert.equal(repeated.body.reused, true);
    assert.equal(repeated.body.operation.id, created.body.operation.id);

    const otherUserList = await invoke({ method: "GET", pathname: "/api/vault/operations", userId: "user-b", root });
    assert.deepEqual(otherUserList.body.operations, []);
    const hidden = await invoke({ method: "GET", pathname: "/api/vault/operations/" + created.body.operation.id, userId: "user-b", root });
    assert.equal(hidden.status, 404);

    const cancel = await invoke({ method: "PATCH", pathname: "/api/vault/operations/" + created.body.operation.id, userId: "user-a", body: { action: "cancel" }, root });
    assert.equal(cancel.status, 200);
    assert.equal(cancel.body.operation.status, "cancelled");
    const retry = await invoke({ method: "PATCH", pathname: "/api/vault/operations/" + created.body.operation.id, userId: "user-a", body: { action: "retry" }, root });
    assert.equal(retry.status, 200);
    assert.equal(retry.body.operation.status, "queued");
    assert.equal(retry.body.operation.attempt, 1);

    const reopened = await invoke({ method: "GET", pathname: "/api/vault/operations/" + created.body.operation.id, userId: "user-a", root });
    assert.equal(reopened.body.operation.history.length, 3);
    assert.equal(reopened.headers["Cache-Control"], "private, no-store");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("Vault operation store rejects unsupported operations and invalid state transitions", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "vault-operations-"));
  try {
    const invalid = await invoke({ method: "POST", pathname: "/api/vault/operations", userId: "user-a", body: { sourceAssetId: "asset-1", operation: "arbitrary", idempotencyKey: "key" }, root });
    assert.equal(invalid.status, 400);
    const created = await invoke({ method: "POST", pathname: "/api/vault/operations", userId: "user-a", body: { sourceAssetId: "asset-1", operation: "image-transform", idempotencyKey: "key" }, root });
    const invalidRetry = await invoke({ method: "PATCH", pathname: "/api/vault/operations/" + created.body.operation.id, userId: "user-a", body: { action: "retry" }, root });
    assert.equal(invalidRetry.status, 409);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
