
# 📄 `privacy-first-server`

## @indoscient/privacy-first-server

A minimal **privacy-first** backend built with **Express**, **TypeScript**,
and **libsodium-wrappers**. It provides an API for receiving sealed-box
ciphertext and decrypting it in memory — pairing with the companion client
package (`@indoscient/privacy-first-server`'s sibling,
`@indoscient/privacy-first-client`).

---

### Table of Contents

- [Installation](#installation)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Error Responses](#error-responses)
- [Security Controls](#security-controls)
- [Scripts Overview](#scripts-overview)
- [Privacy](#privacy)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Related Projects](#related-projects)

---

### Installation

Clone the repo and install dependencies:
```bash
git clone https://github.com/indoscient/privacy-first.git
cd privacy-first/server
npm ci        # installs exact versions from lockfile
```

---

### Running Locally
1. Configure server/.env first (see Environment Variables).
2. Start the development server with hot-reload:
   ```bash
   npm run dev
   ```
3. The server will listen on http://localhost:4000, For production:
   ```bash
    npm run build
    npm start
   ```
> **Fail-closed behavior:** if API_KEY is unset, the server starts but rejects every request to authenticated endpoints with 503. It will not run in an unauthenticated mode by accident.

---

### API Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| `GET` | `/` | ❌ No | Welcome message |
| `GET` | `/health` | ❌ No | Health check `{ status: 'ok' }` |
| `GET` | `/public-key` | ✅ Yes | Returns server's public key (Base64) |
| `POST` | `/decrypt` | ✅ Yes | Body: `{ ciphertext }` → Response: `{ plaintext }` |

> **Note:** All authenticated endpoints require the `X-API-Key` header.
> **Why does /public-key require auth?** By design — this demo treats key distribution as an access-controlled operation. In production you would typically expose the public key openly; that change is tied to the client-authentication roadmap item.

---

### Error Responses

| Status | Body | Meaning |
|--------|------|---------|
| `400` | `{ error: 'Missing or invalid ciphertext' }` | Malformed request |
| `401` | `{ error: 'Unauthorized' }` | Invalid or missing API key |
| `429` | `{ error: 'Too many requests...' }` | Rate limit exceeded |
| `500` | `{ error: 'Internal server error' }` | Disallowed CORS origin, oversized body, or malformed JSON — details logged server-side, never sent to the client |
| `500` | { error: 'Server authentication is not configured.' } |

---

### Security Controls

| Control | Implementation |
|---------|----------------|
| **Authentication** | API key middleware with constant-time comparison; accepts X-API-Key |
| **Fail-closed** | Missing API_KEY ⇒ all authenticated routes return 503 |
| **Rate Limiting** | 100 req/15min global, 20 req/15min on `/decrypt`; standard RateLimit-* headers |
| **CORS Restrictions** | Origin whitelist via ALLOWED_ORIGINS env var; requests without an Origin header (curl/Postman) allowed |
| **Security Headers** | Helmet.js (HSTS, X-Frame-Options, etc.) |
| **Payload Validation** | JSON body cap at 64KB, ciphertext length validation |
| **No persistence** | Plaintext exists only in memory for the duration of the request; nothing is written to disk |

---

### Scripts Overview

| Script | Description |
|--------|-------------|
| **dev** | Runs `ts-node-dev` for live reload while developing |
| **build** | Compiles TypeScript to `dist/` (`tsc`) |
| **start** | Executes the compiled server (`node dist/index.js`) |
| **gen:keypair** | Utility script to generate a Curve25519 key pair from CLI | 
   
Generate a new key pair:
```bash
npm run gen:keypair
```
Then validate the private key before first:
```bash
npx ts-node sanity-check.ts to: npm run sanity  # confirms a valid 32-byte secret key
```

---

### Privacy

See our **[Privacy Design Decisions](../PRIVACY.md)** for details on how this client handles encryption and data minimization.

**Key highlights**:
- **In-memory decryption only** — plaintext never touches disk, databases, or logs. It exists transiently in memory during decryption, then is discarded with the response.
- **Minimal metadata** — the only log output is a transient auth-failure warning (method, path, IP) that is not persisted and is lost on restart.
- **No request-body logging** — ciphertext and plaintext are never logged.
- **Honest scope** — this server is the decryption endpoint, so it sees plaintext in memory. Zero-knowledge operation is the project's roadmap destination, not the current state.tence**: Ciphertext discarded immediately after decryption

---

### Environment Variables

| Variable | Required | Purpose |
| :--- | :--- | :--- |
| PRIVATE_KEY | Yes | Base-64 Curve25519 private key (server exits at boot without it) |
| API_KEY | Recommended | Shared secret for authenticated endpoints; unset ⇒ fail-closed 503s |
| ALLOWED_ORIGINS | Recommended | Comma-separated origin whitelist; defaults to http://localhost:5173,http://localhost:3000 |
| PORT | Optional | Defaults to 4000 |

For the deployed demo, ALLOWED_ORIGINS must include https://privacy.indoscient.in.

---

### Contributing
We love contributions! Follow these steps:
1. Fork the repository.
2. Create a feature branch
   ```bash
    git checkout -b feat/awesome-feature
   ```
3. Implement your change and verify the TypeScript compiles:
   ```bash
   npx tsc --noEmit && npm run build
   ```
4. Open a Pull Request against main.
Please keep the API surface stable and add documentation for any new endpoints.

---

### License
MIT © Suman Jangili. See the LICENSE file for full terms.

---

### Related Projects

- **[Client](../client/README.md)** – Client handles encryption and dataminimization.
- **[Privacy Design Decisions](../PRIVACY.md)** – centralized privacy documentation for the full demo.
- **[Full Demo Repository](https://github.com/indoscient/privacy-first)**

