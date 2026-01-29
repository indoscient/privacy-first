
📄 `privacy‑first‑server`

## @suman-jangili/privacy‑first‑server
A minimal **privacy‑first** backend built with **Express**, **TypeScript**, and **libsodium‑wrappers**.  
It provides a tiny API for generating key pairs, encrypting, and decrypting data—perfect for pairing with the companion client package (`@suman-jangili/privacy‑first‑client`).

---

### Table of Contents

- [Installation](#installation)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Scripts Overview](#scripts-overview)
- [Building & Publishing](#building--publishing)
- [Contributing](#contributing)
- [License](#license)
- [Related Projects](#related-projects)

---

### Installation
From npm:
```bash
npm install @suman-jangili/privacy-first-server
```
**Or** add it as a dependency in your own project
```bash
npm i @suman-jangili/privacy-first-server
```
To develop the server yourself, clone the repo and install dev dependencies:
```bash
git clone https://github.com/sumanjangili/privacy-first.git
cd privacy-first/server
npm ci        # installs exact versions from lockfile
```

---

### Running Locally
1. Build the TypeScript sources
   ```bash
   npm run build
   ```
2. Start the server (defaults to PORT 3000)
   ```bash
    npm start
   ```
3. The server will listen on http://localhost:3000. You can also use the development script for hot‑reloading:
   ```bash
   npm run dev
   ```
---

#### API Endpoints
*Method	Path	Description*
- **GET	/health**	Simple health check ({ ok: true }).
- **POST /keypair**	Returns a freshly generated NaCl key pair (publicKey, secretKey).
- **POST /encrypt**	Body: { publicKey, secretKey?, message } → Returns { ciphertext, nonce }.
- **POST /decrypt**	Body: { publicKey, secretKey, ciphertext, nonce } → Returns { message }.
- All payloads and responses are JSON‑encoded. Errors are returned with a 400 status and an error field describing the problem.

---

#### Scripts Overview
- **dev**	Runs ts-node-dev for live reload while developing.
- **build**	Compiles TypeScript to dist/ (tsc).
- **start**	Executes the compiled server (node dist/index.js).
- **gen:keypair**	Utility script to generate a key pair from the CLI:
  ```bash
   npm run gen:keypair
  ```

---

### Building & Publishing
When you’re ready to publish a new version to npm:
1. Bump the version (patch, minor, or major)
   ```bash
   npm version patch   # → e.g., 0.1.6 → 0.1.7
   ```
2. Compile the code
   ```bash
   npm run build
   ```
3. Publish (public)
   ```bash
   npm publish --access public
   ```
The package ships type declarations (*.d.ts) automatically, so consumers get full TypeScript support.

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

### License
MIT © Suman Jangili. See the LICENSE file for full terms.

---

#### Related Projects
- [Client](https://www.npmjs.com/package/@suman-jangili/privacy-first-client) – the React front‑end that talks to this API.
- [See Full Demo Repo](https://github.com/sumanjangili/privacy-first)

