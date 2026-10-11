[![Sponsor Me](https://img.shields.io/badge/Sponsor-💖-orange)](https://github.com/sponsors/sumanjangili)
Help me build faster, more secure libraries for the community

## 🔐 Privacy‑First Encrypted Message Demo  
*A tiny end‑to‑end encrypted mini‑app built with React, Vite, Node/Express and libsodium‑wrappers.*

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)    

---

### What it does  
This demo shows how a browser can encrypt a message with a recipient's public key, send the ciphertext to a server, and have the server decrypt it with its private key—all without ever transmitting the plaintext. It uses **libsodium‑wrappers**, the modern, audited NaCl implementation, keeping the cryptography solid while the code stays short.

---

### Features   
- **End-to-end encryption** using X25519 + XSalsa20‑Poly1305 (libsodium sealed-box `crypto_box_seal`).
- **Forward secrecy** — ephemeral keys generated per message.
- **Zero-knowledge transport** – only ciphertext travels over HTTP (no plaintext, nonces, or key material exposed).
- **API authentication** — API key middleware protects decryption endpoints.
- **Rate limiting** — prevents abuse (20 req/15min on `/decrypt`).
- **Security headers** — Helmet.js enforces HSTS, X-Frame-Options, etc.
- **TypeScript** on both client and server for safety and autocompletion.

---


---

### Prerequisites  
- **Node ≥ 18** (native ESM support)  
- **npm** (or yarn/pnpm)  
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
npm run gen:keypair

# 5. Copy outputs to .env files
# server/.env: PRIVATE_KEY, API_KEY, ALLOWED_ORIGINS
# client/.env: VITE_SERVER_PUBLIC_KEY, VITE_API_KEY, VITE_API_URL
```

---

### Configuration
Create .env files before starting:
```bash
server/.env:

PRIVATE_KEY=<from gen:keypair output>
API_KEY=<random 32-byte hex string>
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=4000

client/.env:

VITE_SERVER_PUBLIC_KEY=<from gen:keypair output>
VITE_API_URL=http://localhost:4000/decrypt
VITE_API_KEY=<same value as server/API_KEY>
```

### Usage
1. Terminal 1 – start the API:
   ```bash
   cd server && npm run dev
   ```
3. Terminal 2 – start the React dev server:
   ```bash
   cd client && npm run dev
   ```

---

### Documentation

| Resource | Description |
|----------|-------------|
| **[Client README](./client/README.md)** | Front-end setup, scripts, and usage |
| **[Server README](./server/README.md)** | Back-end endpoints, security controls |
| **[Privacy Design Decisions](./PRIVACY.md)** | Privacy-by-design controls and data flow |

---

### Contributing
Please read our CONTRIBUTING.md for guidelines on how to propose changes, run tests, and submit pull requests.

---

### License
This project is licensed under the MIT License – see the LICENSE file for details.

---
