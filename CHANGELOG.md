# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Centralized `PRIVACY.md` at project root documenting privacy-by-design
  controls, data flow, data-not-collected list, limitations, and compliance notes.
- API key authentication on protected endpoints via `X-API-Key` header,
  using constant-time comparison middleware.
- Rate limiting:
  - Global limiter: 100 requests / 15 minutes per IP.
  - `/decrypt` limiter: 20 requests / 15 minutes per IP.
- CORS origin whitelist driven by `ALLOWED_ORIGINS` environment variable.
- Security headers via Helmet.js (HSTS, X-Frame-Options,
  X-Content-Type-Options, etc.).
- Payload validation: 64KB JSON body cap and ciphertext length checks.
- `GET /public-key` endpoint returning the server's Curve25519 public key
  (Base64, auth-protected).
- `npm run gen:keypair` utility script for generating Curve25519 key pairs
  from the CLI.

### Changed
- `decryptMessage` is now fully async: removed synchronous `require()`
  calls and awaits `initCrypto()` throughout.
- Restricted default CORS configuration from open (`cors()`) to a
  whitelisted origin callback for production readiness.

### Fixed
- Removed stray placeholder text ("Indos Creation....") from
  `client/index.html`.

### Security
- Decryption endpoint hardened against unauthorized access, abuse, and
  resource-exhaustion attacks (see authentication and rate limiting above).
- Note: plaintext never leaves the client — the server only receives
  sealed-box ciphertext and discards it after decryption.

### Documentation
- Client README updated with a **Privacy** section linking to
  `PRIVACY.md` and covering client-side encryption guarantees.
- Server README updated with a **Privacy** section, full API endpoint
  table (auth requirements and error responses), security controls
  table, and scripts overview.

### Verified
- End-to-end round trip confirmed: seal (client/libsodium) → transmit →
  decrypt (server) → `{"plaintext":"Helloprivyo test"}`.
- Negative-path testing confirmed: 401 on missing/invalid API key,
  429 on rate-limit triggers, 400 on malformed ciphertext.
- Middleware load order verified (Helmet, CORS, auth, rate limits).

## [0.1.0] - 2026-10-11

### Added
- Initial release of the end-to-end encryption demo:
  - React + TypeScript + Vite client using `libsodium-wrappers`
    (`crypto_box_seal`) for browser-side encryption.
  - Express + TypeScript server for receiving ciphertext and decrypting
    with libsodium sealed boxes.
  - In-memory-only processing: no plaintext or ciphertext persistence,
    no user accounts or PII, stateless API.
  - `PRIVACY.md` initial privacy design documentation.

[Unreleased]: https://github.com/indoscient/privacy-first/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/indoscient/privacy-first/releases/tag/v0.1.0
