# Gemini live certification

This workflow is a deliberately narrow, manually dispatched smoke test. It verifies that the repository's authorized Gemini test credential can list models and complete one text-generation request for the selected model.

## Run

1. Add the repository Actions secret `GEMINI_LIVE_TEST_API_KEY` using a dedicated, least-privilege Gemini test project/key.
2. Open **Actions → Gemini live certification → Run workflow**.
3. Select a model supported by that project (default: `gemini-2.5-flash`).
4. Inspect the sanitized JSON output. Never enable shell tracing or print request headers, environment variables, provider response bodies, or the key.

## Scope and interpretation

- A passing run certifies model discovery and one text-generation smoke request at that time, for that key/project/model only.
- It does not certify image, video, audio, streaming, structured-output, quota exhaustion, permission denial, invalid-key behavior, or provider-outage behavior.
- Those negative scenarios require isolated controlled fixtures or a dedicated restricted test project. The workflow must not intentionally exhaust production quota or induce provider outages.
- Provider response bodies are never emitted. Reports contain only HTTP status, coarse failure classification, requested/served model, and elapsed time.
- The key is supplied only to the workflow process through the Actions secret context and is sent in the `x-goog-api-key` request header. It is not a Vite variable and must never be added to a client build.
- This workflow does not change ViewTube's browser BYOK storage model. The separate credential-security architecture decision remains required.

## Local tests

`node --test scripts/gemini/live-certification.test.mjs`
