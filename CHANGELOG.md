# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Centralized `PRIVACY.md` at project root documenting privacy-by-design
  controls, data flow, data-not-collected disclosures (including transient
  IP logging on auth failures), limitations, and compliance notes.
- `.github/SECURITY.md` security policy: supported versions, private
  vulnerability reporting channel, response SLAs, and demo-scope notes.
- API key authentication on protected endpoints via `X-API-Key` (or
  `Authorization: Bearer`) header, using constant-time comparison
  middleware with fail-closed behavior (503 when `API_KEY` is unset).
- Rate limiting:
  - Global limiter: 100 requests / 15 minutes per IP.
  - `/decrypt` limiter: 20 requests / 15 minutes per IP.
  - Standard `RateLimit-*` response headers.
- CORS origin whitelist driven by `ALLOWED_ORIGINS` environment variable.
- Security headers via Helmet.js (HSTS, X-Frame-Options,
  X-Content-Type-Options, etc.).
- Payload cap: 64 KB JSON body limit.
- `GET /public-key` endpoint returning the server's Curve25519 public key
  (Base64, ORIGINAL variant, auth-protected).
- `npm run gen:keypair` and `npm run sanity` utility scripts for
  generating and validating Curve25519 key pairs.
- `npm run typecheck` scripts in both client and server packages.
- ESLint 9 flat config (`client/eslint.config.mjs`) with
  typescript-eslint, eslint-plugin-react, and eslint-config-prettier.
- GitHub Actions Pages deployment to `privacy.indoscient.in` with
  build-time injection of `VITE_*` variables from repository secrets.

### Changed
- `decryptMessage` is now fully async: removed synchronous `require()`
  calls and awaits `initCrypto()` throughout.
- Restricted default CORS configuration from open (`cors()`) to a
  whitelisted origin callback for production readiness.
- Client pinned to `libsodium-wrappers@0.7.13` (exact): versions 0.7.15+
  ship a broken ESM dist that fails under Vite/Rollup
  ("Could not resolve ./libsodium.mjs").
- Client `tsconfig.json`: `moduleResolution` switched to `"bundler"`,
  unused `@/*` path alias removed, strict extras enabled
  (`noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`,
  `noFallthroughCasesInSwitch`).
- Server `tsconfig.json`: stale `typeRoots` reference to the removed
  `typings/` directory dropped; same strict extras enabled.
- Both packages marked `"private": true`; `engines` set to Node >= 20
  (Vite 7 requires >= 20.19).
- Server scripts added: `typecheck`, `sanity`; `sanity-check.ts` moved
  under `src/` so it participates in type checking.
- Documentation set overhauled for accuracy and mutual consistency:
  root README, client/server READMEs, `PRIVACY.md`, `ROADMAP.md`,
  `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`. Encryption claims corrected:
  architecture described as client-side sealed-box encryption with
  trusted-server in-memory decryption (not end-to-end or zero-knowledge,
  which are roadmap goals), forward-secrecy claim removed
  (ephemeral sender keys provide sender unlinkability only),
  IP-logging disclosure added to `PRIVACY.md`.

### Fixed
- Removed stray placeholder text ("Indos Creation....") from
  `client/index.html`.
- Removed custom `cors.d.ts` shim (lacked the `CustomOrigin` callback
  form used by the server); replaced by `@types/cors`.
- Broken cross-links and inaccurate claims across documentation
  (audit-logging anchor, zero-knowledge phrasing, "ciphertext length
  validation" claim with no corresponding code, Node version
  prerequisites, script names).

### Security
- Decryption endpoint hardened against unauthorized access, abuse, and
  resource-exhaustion attacks (see authentication and rate limiting
  above).
- Honest scope note: plaintext is never persisted — it exists only in
  browser memory and transiently in server memory during decryption,
  then is discarded with the response. The server holds the private key
  and can decrypt by design; zero-knowledge operation is a roadmap goal.

### Documentation
- Client README updated with **Privacy**, **Environment Variables**, and
  live-demo sections linking to `PRIVACY.md`.
- Server README updated with a **Privacy** section, full API endpoint
  table (auth requirements, error responses including fail-closed 503),
  security controls table, and scripts overview.
- `ROADMAP.md` reconciled with `PRIVACY.md`: IP addresses excluded from
  the planned audit log (decision recorded 2026-11-21), progress count
  corrected to 5 of 9, timing-safe comparison length leak and ciphertext
  length validation added as tracked items.

### Verified
- End-to-end round trip confirmed: seal (client/libsodium) → transmit →
  decrypt (server) → plaintext response.
- Negative-path behavior confirmed: 401 on missing/invalid API key,
  503 when `API_KEY` is unset, 429 on rate-limit triggers, 400 on
  missing/non-string ciphertext, 500 on undecryptable ciphertext.
- Middleware load order verified (Helmet, CORS, auth, rate limits).
- Toolchain verified end-to-end: server `typecheck` + `build`, client
  `lint` + `typecheck` + `build`, `gen:keypair`, and `sanity` all pass.

## [0.1.0] - 2026-10-11

### Added
- Initial release of the encryption demo:
  - React + TypeScript + Vite client using `libsodium-wrappers`
    (`crypto_box_seal`) for browser-side encryption.
  - Express + TypeScript server for receiving ciphertext and decrypting
    with libsodium sealed boxes.
  - In-memory-only processing: no plaintext or ciphertext persistence,
    no user accounts or PII, stateless API.
  - `PRIVACY.md` initial privacy design documentation.

[Unreleased]: https://github.com/indoscient/privacy-first/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/indoscient/privacy-first/releases/tag/v0.1.0
