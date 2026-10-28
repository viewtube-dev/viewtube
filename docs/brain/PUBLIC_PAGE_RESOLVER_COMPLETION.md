# Public Page Resolver Completion

## Canonical behavior

- The browser sends public channel inputs to the server-side resolver; it does not call YouTube Data API endpoints or place a stored API key in a request URL.
- The server accepts bare handles, @handles, channel IDs, and supported YouTube channel URLs (/ @handle, /channel/ID, /c/name, /user/name).
- Upstream requests are restricted to allowlisted YouTube hosts, time out, and reject responses redirected to other hosts.
- Public page metadata resolves a channel ID and optional title/handle; the public RSS feed supplies recent upload IDs, titles, and publish timestamps.
- Public-page snapshots deliberately leave subscriber, video, and view statistics unavailable. Public RSS does not supply those statistics.
- The client validates resolver payloads, treats storage/network failures as non-fatal, and only falls back to explicitly enabled local fixtures.
- A selected handle can still be saved when the resolver is unavailable, but no channel ID or fetched data is fabricated.

## Deployment routes

- Serverless: `/api/public-channel?handle=...`
- Billing service: `/public-channel/resolve?handle=...`

Set `VITE_BILLING_API_BASE` when the billing service is hosted on a separate origin. The billing service's `BILLING_ORIGIN` must allow the frontend origin.

## Limitations

This is unauthenticated public metadata ingestion, not an OAuth connection. It cannot access private analytics, subscriber counts, per-video statistics, or other authenticated creator data. If YouTube changes its page markup or blocks RSS, the resolver reports unresolved/partial public data rather than manufacturing values.

## Validation

Focused checks:
```sh
npx vitest run api/public-channel.test.ts src/services/publicHandleMode.test.ts src/services/publicHandleMode.pending-ingestion.test.ts
npm run typecheck
npm run build
```

These checks must pass in CI before merge.
