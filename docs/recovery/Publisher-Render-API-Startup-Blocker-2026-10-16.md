# Publisher Render API Startup Blocker

Status: BLOCKED pending Render service configuration update.

The Publisher dashboard at https://publisher-3n7h.onrender.com/ renders, but `/api/release` and `/api/auth-session` returned HTTP 502 during a read-only browser check. Render application logs showed Vite proxy `ECONNREFUSED` errors for `/api/auth-session` and `/api/youtube/playlists`.

The deployed Render service uses build command `npm install; npm run build` and start command `npm run preview -- --host 0.0.0.0 --port $PORT`. The repository contains `npm run start:production` (`scripts/production-stack.mjs`), which starts `server/billing-server.mjs`, waits for `/api/release` to become healthy, and starts Vite preview on the public port. This makes the current service start command a high-confidence cause of the API outage.

Required action: in the authenticated Render dashboard for service `srv-db4rukd9fdbs73amd2gg`, change the start command to `npm run start:production`, preserve the build command, and deploy manually. Then verify `/api/release`, `/api/auth-session`, and `/api/youtube/playlists` against the live service and inspect startup logs.

Acceptance: dashboard shell PASS; API health FAIL; service configuration correction BLOCKED because the available browser session is not signed in and the Render connector does not expose a start-command update action; test suite UNVERIFIED because the execution environment cannot resolve github.com and could not clone the repository. Do not claim end-to-end production certification until the API is healthy and lifecycle tests have been observed.
