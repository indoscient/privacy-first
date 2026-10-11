
---

## 📁 `server/README.md`

```markdown
# 📄 `privacy-first-server`
```

## @indoscient/privacy-first-server

A minimal **privacy-first** backend built with **Express**, **TypeScript**, and **libsodium-wrappers**.  
It provides a secure API for receiving encrypted ciphertext and decrypting data—perfect for pairing with the companion client package (`@indoscient/privacy-first-client`).

---

### Table of Contents

- [Installation](#installation)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Security Controls](#security-controls)
- [Scripts Overview](#scripts-overview)
- [Privacy](#privacy)
- [Building & Publishing](#building--publishing)
- [Contributing](#contributing)
- [License](#license)
- [Related Projects](#related-projects)

---

### Installation

From npm:
```bash
npm install @indoscient/privacy-first-server

clone the repo and install dev dependencies:
git clone https://github.com/indoscient/privacy-first.git
cd privacy-first/server
npm ci        # installs exact versions from lockfile
```

### Running Locally
1. Start the development server with hot-reload:
   ```bash
   npm run dev
   ```
2. The server will listen on http://localhost:4000, For production:
   ```bash
    npm run build
    npm start
   ```

---

### API Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| `GET` | `/` | ❌ No | Welcome message |
| `GET` | `/health` | ❌ No | Health check `{ status: 'ok' }` |
| `GET` | `/public-key` | ✅ Yes | Returns server's public key (Base64) |
| `POST` | `/decrypt` | ✅ Yes | Body: `{ ciphertext }` → Response: `{ plaintext }` |

> **Note:** All authenticated endpoints require the `X-API-Key` header.

---

### Error Responses

| Status | Body | Meaning |
|--------|------|---------|
| `400` | `{ error: 'Missing or invalid ciphertext' }` | Malformed request |
| `401` | `{ error: 'Unauthorized' }` | Invalid or missing API key |
| `429` | `{ error: 'Too many requests...' }` | Rate limit exceeded |
| `500` | `{ error: 'Failed to decrypt' }` | Decryption error |

---

### Security Controls

| Control | Implementation |
|---------|----------------|
| **Authentication** | API key middleware with constant-time comparison |
| **Rate Limiting** | 100 req/15min global, 20 req/15min on `/decrypt` |
| **CORS Restrictions** | Origin whitelist via `ALLOWED_ORIGINS` env var |
| **Security Headers** | Helmet.js (HSTS, X-Frame-Options, etc.) |
| **Payload Validation** | JSON body cap at 64KB, ciphertext length validation |

---

### Contributing
We love contributions! Follow these steps:
1. Fork the repository.
2. Create a feature branch
   ```bash
    git checkout -b feat/awesome-feature
   ```
3. Implement your change and run the test suite and lint to ensure TypeScript compiles:
   ```bash
    npm test && npm run lint && npm run typecheck
   ```
4. Open a Pull Request against main.
Please keep the API surface stable and add documentation for any new endpoints.

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

---

### Privacy

See our **[Privacy Design Decisions](../PRIVACY.md)** for details on how this client handles encryption and data minimization.

**Key highlights**:
- **ero-knowledge**: Server never stores plaintext messages
- **Minimal metadata**: Only auth failure warnings logged (no request bodies)
- ** No persistence**: Ciphertext discarded immediately after decryption

---

### License
MIT © Suman Jangili. See the LICENSE file for full terms.

---

### Related Projects

- **[Server](../server/README.md)** – an Express API that handles authentication and decryption with libsodium.
- **[Privacy Design Decisions](../PRIVACY.md)** – centralized privacy documentation for the full demo.
- **[Full Demo Repository](https://github.com/indoscient/privacy-first)**
