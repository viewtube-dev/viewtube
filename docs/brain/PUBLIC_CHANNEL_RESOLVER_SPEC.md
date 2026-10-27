# Public Channel Resolver

## Status

Initial server-side resolver foundation. It is not a connected-channel or YouTube Analytics integration.

## Request

`POST /api/public-channel/resolve`

```json
{ "input": "@channelhandle" }
```

The endpoint accepts a public channel handle, a supported YouTube channel URL, or a channel ID. It returns the public channel profile, the ten most recently returned public videos, and public video statistics where the YouTube Data API returns them.

## Server configuration

Configure `YOUTUBE_DATA_API_KEY` (preferred) or `YOUTUBE_API_KEY` in the server environment only. Do not use `VITE_YOUTUBE_API_KEY`, a browser environment variable, or localStorage for this key. If no server key is configured, the endpoint returns `503 PUBLIC_LOOKUP_UNAVAILABLE`.

## Safety and data semantics

- The endpoint is read-only and uses YouTube Data API public channel/video resources.
- It never accepts a caller-supplied API key.
- It validates input and limits request-body size.
- It applies an in-memory per-process request limit and caches successful lookups for three hours and not-found results for thirty minutes.
- Missing or hidden counts remain `null`; they are not inferred from other metrics.
- Responses include `provenance.source = youtube_data_api_public`, `evidenceMode = public_handle`, and `privateMetricsIncluded = false`.
- This endpoint does not grant OAuth, YouTube Analytics, audience demographics, revenue, or other private connected-channel access.

## Operational limitations to resolve before broad production rollout

The rate limit and cache are process-local. Multi-instance deployments need a shared limiter/cache or edge-level protection. Confirm the deployment's API proxy/origin routing and configure the server key and YouTube Data API quota alerts before enabling broad anonymous usage. The resolver intentionally does not claim an anonymous allowance is fully abuse-resistant.

## Canonical Brain evidence

`src/services/brain/public/publicChannelEvidence.ts` maps the response to the existing `EvidenceRecord` contract with `owner: "research"`, public source references, missingness markers, and public-only limitations. It is an adapter, not a second evidence store. Wiring these records into the canonical Brain turn and capability enforcement remains a follow-on step.
