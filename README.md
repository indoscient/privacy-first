[![Sponsor Me](https://img.shields.io/badge/Sponsor-💖-orange)](https://github.com/sponsors/sumanjangili)
Help me build faster, more secure libraries for the community

## 🔐 Privacy-first Infra
> **Privacy-first infrastructure — client-side sealed-box encryption with minimal data collection.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)

---

### Our Mission

Enable data-driven value extraction while preserving confidentiality through
cryptographic guarantees rather than trust assumptions. This demo is the first
milestone: **privacy-first infrastructure built on client-side encryption** —
a stepping stone toward zero-knowledge, user-controlled cryptography as
tracked in the [ROADMAP](ROADMAP.md).

### What It Does

This demo shows how a browser can encrypt a message with the recipient's
public key (libsodium sealed-box, `crypto_box_seal`) and send only ciphertext
to a server. The server decrypts **in memory** with its private key and
returns the result — plaintext is never stored, logged, or persisted anywhere.
It uses **libsodium-wrappers**, the modern, audited NaCl implementation,
keeping the cryptography solid while the code stays short.

> **Honest scope note:** the server is the designated decryption endpoint, so
> it sees plaintext transiently in memory. True zero-knowledge (where the
> server can never decrypt) is the *destination* on our
> [roadmap](ROADMAP.md), not the current state.

### How It Works

| Traditional Model | This Demo |
|-------------------|-----------|
| Raw data shared with any requester | Client-side encryption — only ciphertext crosses the network |
| Plaintext stored in databases/logs | Nothing persisted: ciphertext in transit, plaintext in memory only |
| Trust assumed, not verified | Fail-closed API auth, rate limiting, CORS whitelist, security headers |
| Privacy review as afterthought | Privacy design decisions documented in [PRIVACY.md](PRIVACY.md) |

---

### Features

- **Client-side encryption** using X25519 + XSalsa20-Poly1305 (libsodium
  sealed-box `crypto_box_seal`) — only ciphertext ever crosses the wire.
- **Ephemeral sender keys per message** — each sealed box uses a fresh
  ephemeral keypair, providing sender unlinkability. *(Note: this is not
  forward secrecy — a compromised server private key can decrypt past
  messages. Key rotation is on the [roadmap](ROADMAP.md).)*
- **Encrypted payload transport** — no plaintext, and no long-term key
  material, is exposed in transit.
- **Fail-closed API authentication** — if `API_KEY` is not configured, the
  decryption endpoint rejects every request (503).
- **Rate limiting** — 100 req/15min global, 20 req/15min on `/decrypt`.
- **Security headers** — Helmet.js enforces HSTS, X-Frame-Options, etc.
- **Payload cap & timing-safe auth** — 64kb body limit and constant-time
  key comparison.
- **TypeScript** on both client and server.
- **Live demo** deployed via GitHub Actions to
  [privacy.indoscient.in](https://privacy.indoscient.in).

---

### Prerequisites

- **Node ≥208** (native ESM support)
- **npm**
- Git

---

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/indoscient/privacy-first.git
cd privacy-first

# 2. Install client dependencies
cd client && npm install

# 3. Install server dependencies
cd ../server && npm install

# 4. Generate server key pair (run once)
npm run gen:keypair      # ⚠️ verify this matches the script name in server/package.json

# 5. Copy outputs to .env files
# server/.env: PRIVATE_KEY, API_KEY, ALLOWED_ORIGINS
# client/.env: VITE_SERVER_PUBLIC_KEY, VITE_API_KEY, VITE_API_URL
```

---

### Configuration
Create .env files before starting:
```bash
# server/.env
PRIVATE_KEY=<from gen:keypair output>
API_KEY=<random 32-byte hex string>
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=4000

# client/.env
VITE_SERVER_PUBLIC_KEY=<from gen:keypair output>
VITE_API_URL=http://localhost:4000/decrypt
VITE_API_KEY=<same value as server/API_KEY>
```
> Every VITE_* variable is compiled into the shipped JavaScript bundle and readable by anyone with DevTools. Treat VITE_API_KEY as rate-limit friction, not a secret. See [PRIVACY.md](PRIVACY.md) → Limitations.

**Usage**

1. Terminal 1 — start the API:
```bash
   cd server && npm run dev
```
2. Terminal 2 — start the React dev server:
```bash
   cd client && npm run dev
```

---

### Documentation

| Resource | Description |
|-------------------|-----------|
| Client README | Front-end setup, scripts, and usage |
| Server README | Back-end endpoints, security controls |
| [Privacy Design Decisions](PRIVACY.md) | Privacy-by-design controls, data flow, verified limitations |
| [Roadmap](ROADMAP.md) | Enhancement tracking and production-hardening items |
| Security Policy | Vulnerability reporting and supported versions |
| Contributing | Dev environment, standards, PR process |
| Code of Conduct | Community standards and enforcement |

---

### Contributing

Please read our CONTRIBUTING.md for guidelines on how to propose changes, run checks, and submit pull requests. Contributions that close roadmap gaps (key rotation, short-lived tokens, TLS enforcement) are especially welcome.

---

### License

This project is licensed under the MIT License — see the LICENSE file for details.

---

Built with ❤️ by the Indos Team — Privacy First, Always.
