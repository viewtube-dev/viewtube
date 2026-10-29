# ViewTube Provider Credential Security and BYO-Key Plan

**Date:** 2026-10-29  
**Status:** Proposed security plan — architecture decision required before implementation  
**Repository:** `viewtube-dev/viewtube`  
**Planning baseline:** `master/consolidated-feature-integration` at `e2e09fd5767cb5782f3bf1d133a0b01462c74bfc`  
**Related source:** `src/services/keyVault.ts`, `src/context/GeminiKeyContext.tsx`, `src/services/gemini.ts`, account/session APIs, deployment configuration  
**Related plans:** Brain Model Gateway Convergence; Prompt Migration and Quality Governance

## 1. Objective

Define and implement an honest, supportable security boundary for provider credentials, especially creator-supplied Gemini API keys (BYOK).

The current implementation stores Gemini credentials in browser `localStorage` under `yt_api_key` and legacy aliases, reads them through `keyVault.ts`, and exposes provider calls from the browser-side Gemini service. A browser key stored this way is available to same-origin JavaScript and is not encrypted by the application. A build-time `VITE_*` secret is bundled into client assets and must be treated as public. These are concrete exposure properties, not proof that a particular user's key has been stolen.

**Success means:** ViewTube clearly distinguishes browser-held BYOK credentials, server-managed provider credentials, and public client API identifiers; documents the chosen threat model; prevents accidental secret bundling/logging; and provides a tested user-controlled migration, rotation, and deletion path.

## 2. Current source-backed findings

- `src/services/keyVault.ts` maps Gemini to `yt_api_key` and reads/writes legacy aliases including `vt_gemini_api_key`, `gemini_api_key`, and `google_api_key`.
- `getVaultKey('gemini')` and `setVaultKey('gemini', ...)` use browser `localStorage`.
- `src/context/GeminiKeyContext.tsx` loads the key on mount, saves it locally, and validates it by calling the Google SDK from the browser.
- `src/services/gemini.ts` constructs/uses the Google Gemini client in the frontend and resolves the BYOK key through the local vault path.
- Any credential supplied through a Vite `VITE_*` variable is potentially embedded in built client code. Environment variable names and consumers must be classified individually; a public/restricted Google API key is not automatically equivalent to a Gemini secret.
- The current design is a local BYOK model, not a server-side secret vault. Do not describe browser localStorage as encrypted or secure against XSS.

Reconfirm these facts against the exact implementation branch before changing behavior. Do not infer a breach from the storage model alone.

## 3. Required architecture decision

No storage migration should begin until the product owner approves one of the following explicit models (or a documented hybrid).

### Option A — Explicit browser-held BYOK

The creator's key remains on that creator's device and is sent directly to the provider from the browser.

**Advantages**
- No server-side retention of creator secrets.
- Preserves current direct-provider behavior and avoids a credential migration service.
- User can remove the key locally.

**Risks and required controls**
- Same-origin JavaScript/XSS can read or exfiltrate the key.
- Browser extensions, compromised dependencies, injected scripts, and shared-device access are in the threat model.
- localStorage is not encrypted by the app and is readable by same-origin scripts.
- Do not label it a secure vault or imply protection against XSS.
- Provide clear BYOK disclosure, least-privilege key setup guidance, Google API restrictions, rotation/revocation instructions, and one-click local deletion.
- Never include key material in logs, diagnostics, analytics, crash reports, URLs, or persisted Brain records.
- Consider session-only storage as a usability/security trade-off, but do not claim it solves XSS; an active malicious script can still read in-memory credentials.

### Option B — Authenticated server-side BYOK proxy

The creator submits a key to ViewTube over an authenticated session. ViewTube stores it server-side and proxies provider requests.

**Advantages**
- Provider secrets are not shipped to the browser on each request.
- Centralized authorization, quotas, abuse controls, and audit boundaries are possible.

**Risks and required controls**
- ViewTube becomes responsible for secret custody, access control, encryption, rotation, deletion, incident response, and operational access.
- Require user-scoped secret records, envelope encryption with managed key material, strict service authorization, least-privilege access, and key rotation.
- Never use one shared environment variable to impersonate all users' BYOK credentials.
- Bind every request to the authenticated ViewTube user and authorized capability; enforce per-user quotas and provider allowlists.
- Redact secrets at ingress, egress, exception, tracing, and support tooling.
- Add abuse/rate limits, payload limits, timeouts, provider error normalization, and spend controls.
- Define retention, backup, deletion, and breach-response policies before launch.

### Option C — ViewTube-managed provider credentials only

ViewTube owns provider credentials and charges/limits usage through its account/entitlement system. Creator BYOK is disabled or retained only as a separately governed opt-in.

**Advantages**
- Simplifies client behavior and centralized usage policy.
- Avoids storing per-user provider secrets if BYOK is removed.

**Risks and required controls**
- ViewTube assumes provider spend, abuse, quota, and cost-control responsibility.
- Entitlement, credit, rate-limit, and fraud controls must be enforced server-side.
- Product/pricing and user communication changes require explicit approval.

### Decision record

- [ ] Product owner selects Option A, B, C, or an explicitly scoped hybrid.
- [ ] Security owner approves threat model and residual risk.
- [ ] Billing owner approves quota, spend, and credit semantics.
- [ ] Data/privacy owner approves retention, deletion, and incident-response requirements.
- [ ] Architecture decision record is added before implementation.

## 4. Scope and boundaries

### In scope

- Full credential inventory: Gemini BYOK, other provider keys, public Google API identifiers, OAuth client IDs, server-only secrets, build-time variables, aliases, caches, diagnostics, and persistence.
- Threat model for browser, server, build, logs, extensions, XSS, account compromise, and shared devices.
- Explicit product/security decision among A/B/C.
- Safe transition plan, user disclosure, key rotation/deletion, and backwards-compatibility strategy.
- Tests and build checks that prevent secret leakage.

### Out of scope

- Changing provider architecture as an incidental part of gateway work.
- Assuming every Google API key is a secret; classify by purpose, restriction, and actual exposure.
- Automatically uploading existing browser keys to a server.
- Silently deleting or rewriting creator credentials.
- Claiming local encryption or XSS protection where none exists.

## 5. Dependency graph

```Credential and environment inventory
                |
                v
         Threat model + risk review
                |
                v
       Product/security ADR approval
                |
                v
      Chosen credential architecture
                |
       +--------+---------+
       |                  |
       v                  v
 Client/build guards   Server custody controls
       |                  |
       +--------+---------+
                |
                v
   User migration / rotation / deletion
                |
                v
    Security, privacy, and release tests
```

The Brain gateway plan must consume the approved credential-resolution interface. It must not independently invent a second key store.

## 6. Ordered task plan

### Phase 1 — Inventory and threat model (read-only)

- [ ] **Task 1 — Inventory all credential sources and consumers.**
  - Acceptance: every key/identifier has a classification (secret, user BYOK, public restricted key, OAuth client ID, server secret, unknown), storage location, consumer, exposure, and owner.
  - Verify: source search plus build configuration and deployment environment review; no key values are copied into the report.
  - Likely files: `keyVault.ts`, `GeminiKeyContext.tsx`, provider services, env examples/config, diagnostics redaction tests.
  - Dependencies: none.

- [ ] **Task 2 — Map exposure and trust boundaries.**
  - Acceptance: diagram covers browser storage, client bundle, provider requests, server APIs, logs/telemetry, account session, deployment secrets, and third-party scripts.
  - Verify: each trust boundary is linked to concrete source/config evidence.
  - Likely files: security plan, source inventory artifact.
  - Dependencies: Task 1.

- [ ] **Task 3 — Complete threat model and risk classification.**
  - Acceptance: XSS, malicious dependency, extension, shared device, account takeover, server compromise, log leakage, build artifact exposure, key misuse, and deletion/backup risks are classified with mitigations and residual risk.
  - Verify: adversarial review by security owner; unresolved high risks block the architecture decision.
  - Likely files: threat model, risk register.
  - Dependencies: Task 2.

### Checkpoint A — Decision is informed

- [ ] Browser localStorage is described accurately as accessible to same-origin scripts and not app-encrypted.
- [ ] `VITE_*` secrets are treated as client-exposed.
- [ ] Public/restricted API identifiers are distinguished from user secrets.
- [ ] No migration is started before explicit architecture approval.

### Phase 2 — Architecture decision and contract

- [ ] **Task 4 — Select credential ownership model.**
  - Acceptance: Option A/B/C or hybrid is explicitly selected with user-facing disclosure, cost ownership, residual risk, retention, deletion, and support responsibilities.
  - Verify: approved ADR signed by product, security, billing, and privacy owners as applicable.
  - Likely files: new ADR under `docs/architecture/decisions/`, security plan.
  - Dependencies: Checkpoint A.

- [ ] **Task 5 — Define one credential-resolution contract.**
  - Acceptance: gateway/provider layer requests credentials by authenticated user + provider + capability; callers cannot read raw server secrets; local BYOK behavior is explicit if retained.
  - Verify: contract tests with fake resolver and no real credentials.
  - Likely files: credential contract types, provider adapter, contract tests.
  - Dependencies: Task 4.

### Phase 3 — Implement the approved model

- [ ] **Task 6 — Add client/build secret-leak guards.**
  - Acceptance: production build fails or warns according to policy when known secret variables are configured for client exposure; public restricted keys use explicit allowlist and documented restrictions.
  - Verify: positive and negative build-config fixtures; inspect built assets for test sentinel secrets.
  - Likely files: Vite config, env validation, build tests.
  - Dependencies: Task 5.

- [ ] **Task 7 — Implement server custody or explicit browser BYOK controls.**
  - Acceptance: implementation matches the approved ADR; no second vault is created; access, redaction, rotation, and deletion semantics are tested.
  - Verify: user isolation tests, authorization tests, secret-redaction tests, provider failure tests.
  - Likely files: existing credential owner, provider adapter, API route/store only if Option B is approved, focused tests.
  - Dependencies: Task 6.

- [ ] **Task 8 — Implement user migration, rotation, and deletion flow.**
  - Acceptance: users receive clear disclosure; migration is opt-in; existing local keys are not silently transmitted; revoke/delete behavior is explicit and observable without exposing secret values.
  - Verify: migration tests for no key, valid key, invalid key, interrupted migration, duplicate aliases, revoke, and account deletion.
  - Likely files: Settings credential UI/context, key owner, migration tests.
  - Dependencies: Task 7.

- [ ] **Task 9 — Integrate gateway and billing policy.**
  - Acceptance: BrainModelGateway obtains credentials through the approved resolver; account auth, entitlements, preflight, usage, and metering have one policy owner.
  - Verify: BYOK and ViewTube-managed credential tests across signed-in/signed-out and streaming/non-streaming flows.
  - Likely files: provider adapter, gateway, account/billing tests.
  - Dependencies: Task 7 and gateway plan.

### Phase 4 — Security certification

- [ ] **Task 10 — Audit logs, telemetry, persistence, and built artifacts.**
  - Acceptance: sentinel key never appears in logs, telemetry, persisted records, URLs, source maps, or built assets; diagnostic events expose only sanitized status.
  - Verify: automated secret sentinel scan and manual build inspection.
  - Likely files: diagnostics redaction tests, build tests, security checklist.
  - Dependencies: Tasks 7–9.

- [ ] **Task 11 — Release and incident-response readiness.**
  - Acceptance: rotation/revocation instructions, user-facing disclosure, operational alerting, quota policy, backup/deletion behavior, and rollback plan are documented.
  - Verify: tabletop test or staged exercise; security sign-off.
  - Likely files: security docs, support/runbook, release checklist.
  - Dependencies: Task 10.

### Final checkpoint

- [ ] One approved credential ownership model exists.
- [ ] No secret is shipped in client bundles or logged.
- [ ] Existing users are not silently migrated or stripped of credentials.
- [ ] User-scoped access and provider quotas are enforced where server custody is chosen.
- [ ] Rotation, revocation, deletion, retention, and incident response are documented and tested.
- [ ] BrainModelGateway uses the one approved credential-resolution contract.
- [ ] Security, privacy, billing, typecheck, build, and focused provider tests pass.

## 7. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Server-side proxy creates a high-value secret store | Critical | Envelope encryption, strict isolation, minimal access, audit, rotation, incident response |
| Browser BYOK is described as secure storage | High | Explicit disclosure of XSS/same-origin risk; never claim app encryption |
| Vite secret leaks into client assets | Critical | Env allowlist, build guard, artifact scan, remove secret build variables |
| Public Google API key is mistakenly treated as a user secret | Medium | Classify by purpose, API restrictions, and consumer before changes |
| Silent migration uploads user keys | Critical | Explicit opt-in, no background transfer, visible confirmation |
| Gateway and Settings create duplicate credential stores | High | One credential owner and one resolver contract |
| Logs or diagnostics retain key material | Critical | Redaction at every boundary and sentinel tests |

## 8. Boundaries

- **Always:** treat browser localStorage as accessible to same-origin JavaScript; classify every key by purpose; redact secrets; preserve user choice; require explicit approval for custody changes.
- **Ask first:** server-side custody, disabling BYOK, changing billing/spend ownership, migrating existing keys, or changing retention.
- **Never:** call localStorage encrypted; ship private keys in `VITE_*`; upload keys without opt-in; put credentials in URLs/logs/analytics; use a shared provider key as a user's BYOK key; claim a breach without evidence.

## 9. Open questions

- Is BYOK a long-term product capability, a transitional feature, or to be replaced by ViewTube-managed provider credentials?
- If server-side BYOK is selected, which managed key service and encryption/rotation controls are available in the current deployment environment?
- Which Google API keys are intentionally public/restricted identifiers versus confidential Gemini credentials?
- What is the user-facing migration and support policy for keys already stored in local browser profiles?
