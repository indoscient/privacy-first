[![Sponsor](https://img.shields.io/badge/Sponsor-💖-orange)](https://github.com/sponsors/sumanjangili)

# 🔐 Privacy‑First Encrypted Message Demo  
*A tiny end‑to‑end encrypted mini‑app built with React, Vite, Node/Express and libsodium‑wrappers.*

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)    

---

## What it does  

This demo shows how a browser can encrypt a message with a recipient’s public key, send the ciphertext to a server, and have the server decrypt it with its private key—all without ever transmitting the plaintext. It uses **libsodium‑wrappers**, the modern, audited NaCl implementation, keeping the cryptography solid while the code stays short.

---

## Prerequisites  

- **Node ≥ 18** (native ESM support)  
- **npm** (or yarn/pnpm)  
- Docker (optional – see the Docker section)  

---

## Installation  

### 1️⃣ Clone the repo  

```bash
git clone https://github.com/sumanjangili/privacy-demo.git
cd privacy-demo

---

## Quick start

Run locally

1. Terminal 1 – start the API
cd server
npx ts-node-dev src/index.ts

2. Terminal 2 – start the React dev server
cd ../client
npm run dev

---

## Features

 End‑to‑end encryption using X25519 + XSalsa20‑Poly1305 (libsodium crypto_box).
 Ephemeral sender keys per message → forward secrecy.
 Zero‑knowledge transport – only ciphertext, nonce and sender public key travel over HTTP.
 TypeScript on both client and server for safety and autocompletion.

---

## Contributing

Please read our CONTRIBUTING.md for guidelines on how to propose changes, run tests, and submit pull requests.

---

## License

This project is licensed under the MIT License – see the LICENSE file for details.
