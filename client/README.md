# 📄 `privacy-first-client`

## @indoscient/privacy-first-client

A **privacy-first** front-end demo built with **React**, **TypeScript**, and
**Vite**. It showcases client-side sealed-box encryption with
`libsodium-wrappers` in the browser, communicating with the companion server
package (`@indoscient/privacy-first-server`).

> **Live demo:** [privacy.indoscient.in](https://privacy.indoscient.in) —
> deployed automatically via GitHub Actions on every push to `main`.

---

### Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Build & Preview](#build--preview)
- [Scripts Overview](#scripts-overview)
- [Privacy](#privacy)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Related Projects](#related-projects)

---

### Installation

Clone the demo and install dependencies:
```bash
git clone https://github.com/indoscient/privacy-first.git
cd privacy-first/client
npm ci        # installs exact versions from lockfile
```

---

### Development
Start a hot-reloading dev server:
```bash
npm run dev
```
> Vite reads client/.env at startup — restart the dev server after editing it.

---

### Build & Preview
Create a production-ready bundle:
```bash
npm run build
npm run preview
```

---

### Scripts Overview

- **dev** — Starts Vite in development mode with hot-module replacement.
- **build** — Bundles the app for production (vite build).
- **preview** — Serves the dist/ folder locally (vite preview).
- **lint** — Runs ESLint on all source files.
- **format** — Formats code with Prettier.
- **typecheck** — Runs tsc --noEmit to verify TypeScript types.

---

### Environment Variables
Configured in client/.env (see src/environment.d.ts for the typed declarations):

| Variable | Purpose | Notes |
| :--- | :--- | :--- |
| VITE_SERVER_PUBLIC_KEY | Server's libsodium public key (Base-64, ORIGINAL variant) | Public by definition |
| VITE_API_URL | Fetch target for /decrypt | Falls back to http://localhost:4000/decrypt |
| VITE_API_KEY | Sent as X-API-Key header | Compiled into the bundle — treat as public |

> **Every VITE_* variable is compiled into the shipped JavaScript**. Anyone with DevTools can read them. This is inherent to how Vite works — never place genuinely secret values here.

___

### Privacy
See the [Privacy Design Decisions](PRIVACY.md) for the full picture of how this client handles encryption and data minimization.

Key highlights:

- **Client-side encryption** — messages are sealed in the browser with crypto_box_seal; only ciphertext crosses the network outbound.
- **No storage** — messages live in React state only; never written to localStorage, sessionStorage, or IndexedDB.
- **Honest scope** — the trusted server decrypts in memory to return the result; plaintext is never persisted anywhere. True zero-knowledge is the project's roadmap destination, not the current state.

---

### Contributing
We love contributions! Please start with the repository-wide CONTRIBUTING.md for the full workflow. Quick version:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feat/my-feature
   ```
3. Make your changes and run:
   ```bash
   npm run lint && npm run typecheck
   ```
4. Submit a Pull Request against the main branch.

Please adhere to the existing coding style (ESLint + Prettier) and include tests or type-checking where applicable.

---

### License

MIT © Suman Jangili. See the LICENSE file for details.

---

### Related Projects

- **[Server](../server/README.md)** – an Express API that handles authentication and decryption with libsodium.
- **[Privacy Design Decisions](../PRIVACY.md)** – centralized privacy documentation for the full demo.
- **[Full Demo Repository](https://github.com/indoscient/privacy-first)**
