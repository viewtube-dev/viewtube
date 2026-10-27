# Public Channel Mode fixture testing

Public Channel Mode includes a small, explicitly synthetic fixture set for testing the Settings → Resolve → Brain public-evidence path without YouTube login or a YouTube Data API key.

## Allowlisted inputs

- `@themotionvis` or `themotionvis`
- `@viewtube_demo` or `demo`

The fixture titles include `(fixture)`. The snapshot provenance is `source: "fixture"`, and the canonical evidence adapter adds a synthetic-data limitation and fixture-specific provenance route. Do not describe fixture counts or engagement as live YouTube analytics.

## Enable fixtures

Fixtures are enabled when any one of these is true:

- Vite development mode (`import.meta.env.DEV`)
- Build-time `VITE_PUBLIC_HANDLE_FIXTURES=1`
- Browser local storage `vt_public_handle_fixtures=1`

For a deployed build that already contains this feature, open the browser console and run:

```js
localStorage.setItem("vt_public_handle_fixtures", "1")
location.reload()
```

This setting only enables the allowlisted local fixtures. It does not make the real YouTube Data API available and does not bypass server configuration for arbitrary handles. A new deployment is required if the currently deployed build does not include this code.

## Live lookup precedence

The existing server-side Data API route remains the first choice. Fixtures are used only when the server explicitly reports that its Data API key is not configured and fixtures are enabled. A successful live response always wins. API errors, rate limits, and arbitrary lookup failures do not silently become fixture responses.

The server-side key remains `YOUTUBE_DATA_API_KEY` (or `YOUTUBE_API_KEY`). This branch keeps the key server-side; it does not reintroduce browser-side Google API calls or require OAuth.
