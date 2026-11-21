# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Nothing yet.

## [1.0.2] - 2026-11-21

Package versions bumped from 0.1.9 to align with the existing tag lineage
(v1.0 → v1.0.1 → v1.0.2). First release to ship code and changelog together.

### Added
- Centralized `PRIVACY.md` at project root documenting privacy-by-design
  controls, data flow, data-not-collected disclosures (including transient
  IP logging on auth failures), limitations, and compliance notes.
- `.github/SECURITY.md` security policy: supported versions, private
  vulnerability reporting channel, response SLAs, and demo-scope notes.
- API key authentication on protected endpoints via `X-API-Key` (or
  `Authorization: Bearer`) header, using constant-time comparison
  middleware with fail-closed behavior (503 when `API_KEY` is unset).
- Rate limiting: 100 req/15min global, 20 req/15min on `/decrypt`,
  with standard `RateLimit-*` response headers.
- CORS origin whitelist driven by `ALLOWED_ORIGINS` environment variable.
- Security headers via Helmet.js (HSTS, X-Frame-Options,
  X-Content-Type-Options, etc.).
- Payload cap: 64 KB JSON body limit.
- `GET /public-key` endpoint returning the server's Curve25519 public key
  (Base64, ORIGINAL variant, auth-protected).
- Server scripts: `gen:keypair`, `sanity` (keypair generation and private-key
  validation), `typecheck`.
- Client `typecheck` script; ESLint 9 flat config (`eslint.config.mjs`) with
  typescript-eslint, eslint-plugin-react, and eslint-config-prettier.
- GitHub Actions Pages deployment to `privacy.indoscient.in` with
  build-time injection of `VITE_*` variables from repository secrets.

### Changed
- `decryptMessage` is now fully async: removed synchronous `require()`
  calls and awaits `initCrypto()` throughout.
- Restricted default CORS configuration from open (`cors()`) to a
  whitelisted origin callback for production readiness.
- Client pinned to `libsodium-wrappers@0.7.13` (exact): 0.7.15+ ships a
  broken ESM dist that fails under Vite/Rollup
  ("Could not resolve ./libsodium.mjs").
- Client tsconfig: `moduleResolution: "bundler"`, unused `@/*` path alias
  removed, strict extras enabled (`noUnusedLocals`, `noUnusedParameters`,
  `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`).
- Server tsconfig: stale `typeRoots` reference to the removed `typings/`
  directory dropped; same strict extras enabled.
- Both packages marked `"private": true`; `engines` set to Node >= 20
  (Vite 7 requires >= 20.19).
- `sanity-check.ts` moved under `server/src/` so it participates in
  type checking.
- Documentation set overhauled for accuracy and mutual consistency:
  root README, client/server READMEs, `PRIVACY.md`, `ROADMAP.md`,
  `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`. Encryption
  claims corrected: architecture described as client-side sealed-box
  encryption with trusted-server in-memory decryption (not end-to-end or
  zero-knowledge, which are roadmap goals); forward-secrecy claim removed
  (ephemeral sender keys provide sender unlinkability only); IP-logging
  disclosure added to `PRIVACY.md`.

### Fixed
- Removed stray placeholder text ("Indos Creation....") from
  `client/index.html`.
- Removed custom `cors.d.ts` shim (lacked the `CustomOrigin` callback form
  used by the server); replaced by `@types/cors`.
- Broken cross-links and inaccurate claims across documentation
  (audit-logging anchor, zero-knowledge phrasing, a "ciphertext length
  validation" claim with no corresponding code, Node version
  prerequisites, script names).

### Security
- Decryption endpoint hardened against unauthorized access, abuse, and
  resource-exhaustion attacks (see authentication and rate limiting above).
- Honest scope note: plaintext is never persisted — it exists only in
  browser memory and transiently in server memory during decryption, then
  is discarded with the response. The server holds the private key and can
  decrypt by design; zero-knowledge operation is a roadmap goal.

### Verified
- End-to-end round trip confirmed: seal (client/libsodium) → transmit →
  decrypt (server) → plaintext response.
- Negative-path behavior confirmed: 401 on missing/invalid API key, 503
  when `API_KEY` is unset, 429 on rate-limit triggers, 400 on
  missing/non-string ciphertext, 500 on undecryptable ciphertext.
- Toolchain verified end-to-end: server `typecheck` + `build`, client
  `lint` + `typecheck` + `build`, `gen:keypair`, and `sanity` all pass.

## [1.0.1] - 2026-01-21 (legacy)

Tag applied to documentation housekeeping commits ("chore: bump to 1.0.1");
no corresponding package publish. See commit history for details. Package
versions subsequently drifted to 0.1.x before realignment in 1.0.2.

## [1.0.0] - 2026-01-19 (legacy)

Tag applied to a README revision; ceremonial only, no code release.

## [1.0] - 2026-01-19 (legacy)

Earliest tag (applied to the commit adding CODE_OF_CONDUCT.md and
CONTRIBUTING.md); retained for history. Superseded by 1.0.0/1.0.1.

[Unreleased]: https://github.com/indoscient/privacy-first/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/indoscient/privacy-first/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/indoscient/privacy-first/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/indoscient/privacy-first/compare/v1.0...v1.0.0
[1.0]: https://github.com/indoscient/privacy-first/commit/00592866af2c6fc853339a1a78844da71445f6b1
