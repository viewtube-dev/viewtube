import { createRoot } from 'react-dom/client'
import './index.css'
// Keep the existing shared controls available to other primitives, then load the
// isolated plain text-input foundation last so its native input sizing wins.
import './styles/studio-control-system.css'
import './styles/studio-control-vars.generated.css'
import './styles/studio-control-core.css'
import './styles/studio-control-split.css'
import './styles/studio-control-fields.css'
import './styles/studio-control-motion.css'
import './styles/studio-text-input.css'
import './styles/studio-dropdown-geometry.css'
import './styles/studio-upload-geometry.css'
import './components/studio-hub/studio-hub-confirmed-full-width.css'
// Install developer-console error/rejection capture before anything else runs.
// Verbose request and long-task diagnostics stay disabled for normal users.
import { installOnScreenDiagnostics } from './app/onScreenDiagnostics'
import { logBuildInfo } from './config/buildInfo'
installOnScreenDiagnostics()
logBuildInfo()
// Eagerly evaluate authSession so its OAuth redirect hash listener fires
// before the app mounts. This ensures the popup window handles the token
// and calls window.close() before React can boot any auth side-effects.
import './services/auth/authSession'
import App from './App.tsx'
// Load the shared Studio focus owner after App's component styles so no primitive-local rule can replace it.
import './styles/studio-control-focus.css'

// If this window was opened as an OAuth popup, the authSession module-level
// hash listener already handled the token and sent postMessage. Don't mount
// the full app — just let the popup close itself.
if (!window.opener || !window.location.hash.includes('access_token')) {
  // StrictMode intentionally mounts effects twice in development. That is a
  // useful diagnostic default for small apps, but this shell owns auth,
  // catalog, and dashboard providers whose boot work is expensive. Keep the
  // local startup path representative of production and avoid duplicate
  // fetches/listeners while retaining the same production render behavior.
  createRoot(document.getElementById('root')!).render(<App />)
}
