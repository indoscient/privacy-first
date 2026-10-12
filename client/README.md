# 📄 `privacy-first-client`

## @indoscient/privacy-first-client

A **privacy-first** front-end demo built with **React**, **TypeScript**, and **Vite**.  
It showcases how to use `libsodium-wrappers` in the browser for end-to-end encryption while communicating with the companion server package (`@indoscient/privacy-first-server`).

---

### Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Build & Preview](#build--preview)
- [Scripts Overview](#scripts-overview)
- [Privacy](#privacy)
- [Contributing](#contributing)
- [License](#license)
- [Related Projects](#related-projects)

---

### Installation

From npm:
```bash
npm install @indoscient/privacy-first-client
```

Clone the demo and install dev dependencies:
```bash
git clone https://github.com/indoscient/privacy-first.git
cd privacy-first/client
npm ci        # installs exact versions from lockfile
```

---

### Development
Start a hot‑reloading dev server:
```bash
npm run dev
```

### Build & Preview
Create a production-ready bundle:
```bash
npm run build
npm run preview
```

---

### Scripts Overview
- **dev**	Starts Vite in development mode with hot-module replacement.
- **build**	Bundles the app for production (vite build).
- **preview**	Serves the dist/ folder locally (vite preview).
- **lint**      Runs ESLint on all source files..
- **format**    Formats code with Prettier
- **typecheck** Executes tsc --noEmit to verify TypeScript types

---

### Privacy

See our **[Privacy Design Decisions](../PRIVACY.md)** for details on how this client handles encryption and data minimization.

#### Key highlights:

- Client-side encryption only — plaintext never leaves the browser
- No localStorage/sessionStorage/IndexedDB usage
- Public key injected via environment variables (secure delivery)

---

### Contributing
We love contributions! Follow these steps:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feat/my‑feature
   ```
3. Make your changes and run:
   ```bash
   npm run lint && npm run typecheck.
   ```
4. Submit a Pull Request against the main branch.
Please adhere to the existing coding style (ESLint + Prettier) and include tests or type‑checking where applicable.

---

### License
MIT © Suman Jangili. See the LICENSE file for details.

---

### Related Projects

- **[Server](../server/README.md)** – an Express API that handles authentication and decryption with libsodium.
- **[Privacy Design Decisions](../PRIVACY.md)** – centralized privacy documentation for the full demo.
- **[Full Demo Repository](https://github.com/indoscient/privacy-first)**
