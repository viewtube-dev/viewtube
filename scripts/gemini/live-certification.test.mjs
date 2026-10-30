import test from "node:test";
import assert from "node:assert/strict";
import { classifyProviderStatus, safeResult } from "./live-certification.mjs";

test("classifies provider authentication, permission, quota, outage and unsupported-model responses", () => {
  assert.equal(classifyProviderStatus(401), "invalid_credential");
  assert.equal(classifyProviderStatus(403), "permission_denied");
  assert.equal(classifyProviderStatus(429), "quota_or_rate_limit");
  assert.equal(classifyProviderStatus(503), "provider_unavailable");
  assert.equal(classifyProviderStatus(404), "unsupported_model");
});

test("emits only bounded, sanitized certification fields", () => {
  const result = safeResult({
    status: 200, ok: true, model: "gemini-2.5-flash",
    modelVersion: "gemini-2.5-flash", elapsedMs: 12.4,
  });
  assert.deepEqual(result, {
    status: "passed", classification: "success", httpStatus: 200,
    requestedModel: "gemini-2.5-flash", servedModel: "gemini-2.5-flash", elapsedMs: 12,
  });
  assert.equal(JSON.stringify(result).includes("API_KEY"), false);
});
