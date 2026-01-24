📄 privacy‑first‑client – README.md

# @suman-jangili/privacy‑first‑client

A **privacy‑first** front‑end demo built with **React**, **TypeScript**, and **Vite**.  
It showcases how to use `libsodium-wrappers` in the browser for end‑to‑end encryption while communicating with the companion server package (`@suman-jangili/privacy‑first‑server`).

---

## Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Build & Preview](#build--preview)
- [Scripts Overview](#scripts-overview)
- [Testing Types](#testing-types)
- [Contributing](#contributing)
- [License](#license)
- [Related Projects](#related-projects)

---

## Installation

```bash
# From npm
npm install @suman-jangili/privacy-first-client

# Or add it as a dependency in your own project
npm i @suman-jangili/privacy-first-client

If you want to run the demo locally, clone the repo and install dev dependencies:
git clone https://github.com/sumanjangili/privacy-first.git
cd privacy-first/client
npm ci        # installs exact versions from lockfile

Development
Start a hot‑reloading dev server:
npm run dev

Open http://localhost:5173 (or the port Vite reports) in your browser.
Changes to any src/**/*.tsx or src/**/*.ts file trigger an automatic reload.

Build & Preview
Create a production‑ready bundle:
npm run build
The compiled assets land in dist/. To preview the built output locally:
npm run preview

Scripts Overview

Script	Description
dev	Starts Vite in development mode with hot‑module replacement.
build	Bundles the app for production (vite build).
preview	Serves the dist/ folder locally (vite preview).
lint	Runs ESLint on all source files.
format	Formats code with Prettier.
typecheck	Executes tsc --noEmit to verify TypeScript types without emitting files.
Testing Types
The project ships type declarations out of the box (via the compiled .d.ts files). To verify they work in a consuming project:
import { encrypt, decrypt } from '@suman-jangili/privacy-first-client';

// Example usage (pseudo‑code)
const ciphertext = await encrypt('hello world');
const plaintext = await decrypt(ciphertext);
If you encounter any type errors, feel free to open an issue.

Contributing
Contributions are welcome!
Fork the repository.
Create a feature branch (git checkout -b feat/my‑feature).
Make your changes and run npm run lint && npm run typecheck.
Submit a Pull Request against the main branch.
Please adhere to the existing coding style (ESLint + Prettier) and include tests or type‑checking where applicable.

License
MIT © Suman Jangili. See the LICENSE file for details.

Related Projects
Server: https://www.npmjs.com/package/@suman-jangili/privacy-first-server – a tiny Express API that handles key generation and encryption.
Full Demo Repo: https://github.com/sumanjangili/privacy-first


