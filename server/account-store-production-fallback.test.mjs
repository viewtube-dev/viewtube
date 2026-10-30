import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import test from "node:test";

const tempRoot = await mkdtemp(path.join(os.tmpdir(), "viewtube-account-store-production-"));
process.env.NODE_ENV = "production";
delete process.env.DATABASE_URL;
process.env.ACCOUNT_STORE_DIR = tempRoot;

const store = await import(`./account-store.mjs?production-fallback=${Date.now()}`);

test.after(async () => {
  await rm(tempRoot, { recursive: true, force: true });
});

test("production account storage initializes without DATABASE_URL and uses its file fallback", async () => {
  await store.initAccountStore();

  const state = `oauth-state-${Date.now()}`;
  const expected = {
    state,
    codeVerifier: "verifier",
    nonce: "nonce",
    intent: "connect",
    returnTo: "/account",
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  };

  await store.saveOAuthState(expected);
  const consumed = await store.consumeOAuthState(state);

  assert.deepEqual(consumed, {
    codeVerifier: expected.codeVerifier,
    nonce: expected.nonce,
    intent: expected.intent,
    returnTo: expected.returnTo,
  });
});
