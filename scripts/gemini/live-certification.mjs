import process from "node:process";
import { fileURLToPath } from "node:url";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export function classifyProviderStatus(status) {
  if (status === 401) return "invalid_credential";
  if (status === 403) return "permission_denied";
  if (status === 429) return "quota_or_rate_limit";
  if (status >= 500) return "provider_unavailable";
  if (status === 404) return "unsupported_model";
  return "provider_request_failed";
}

export function safeResult({ status, ok, model, modelVersion, elapsedMs }) {
  return {
    status: ok ? "passed" : "failed",
    classification: ok ? "success" : classifyProviderStatus(status),
    httpStatus: Number.isInteger(status) ? status : null,
    requestedModel: model,
    servedModel: typeof modelVersion === "string" ? modelVersion : null,
    elapsedMs: Number.isFinite(elapsedMs) ? Math.max(0, Math.round(elapsedMs)) : null,
  };
}

async function request(path, apiKey, body) {
  const started = Date.now();
  const response = await fetch(`${API_BASE}/${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      "x-goog-api-key": apiKey,
      ...(body ? { "content-type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(30_000),
  });
  let payload = null;
  try { payload = await response.json(); } catch { /* response body is intentionally not logged */ }
  return { response, payload, elapsedMs: Date.now() - started };
}

async function run() {
  const apiKey = process.env.GEMINI_LIVE_TEST_API_KEY;
  if (!apiKey) {
    process.stderr.write("GEMINI_LIVE_TEST_API_KEY is not configured.\n");
    process.exitCode = 2;
    return;
  }

  const model = process.env.GEMINI_LIVE_TEST_MODEL || "gemini-2.5-flash";
  const report = { schemaVersion: 1, provider: "google-gemini", checks: {} };

  try {
    const discovery = await request("models?pageSize=1", apiKey);
    report.checks.credentialAndDiscovery = safeResult({
      status: discovery.response.status, ok: discovery.response.ok,
      model: "model-discovery", elapsedMs: discovery.elapsedMs,
    });
    if (!discovery.response.ok) {
      process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
      process.exitCode = 1;
      return;
    }

    const generation = await request(`models/${encodeURIComponent(model)}:generateContent`, apiKey, {
      contents: [{ role: "user", parts: [{ text: "Reply with exactly: VIEWTUBE_GEMINI_LIVE_OK" }] }],
      generationConfig: { temperature: 0, maxOutputTokens: 32 },
    });
    report.checks.textGeneration = safeResult({
      status: generation.response.status,
      ok: generation.response.ok,
      model,
      modelVersion: generation.payload?.modelVersion,
      elapsedMs: generation.elapsedMs,
    });
    report.checks.controlledFailureScenarios = {
      invalidCredential: "not_exercised (requires isolated invalid-key request)",
      unsupportedModel: "not_exercised (requires explicit negative probe)",
      permissionDenied: "not_exercised (requires restricted test project/model)",
      quotaExceeded: "not_exercised (must not intentionally exhaust quota)",
      providerOutage: "not_exercised (must not simulate against production provider)",
    };
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    if (!generation.response.ok) process.exitCode = 1;
  } catch (error) {
    const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
    report.checks.transport = {
      status: "failed",
      classification: timedOut ? "request_timeout" : "network_or_transport_failure",
    };
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await run();
