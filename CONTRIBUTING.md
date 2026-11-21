# 🤝 Contributing to the Privacy-first infrastructure

Thank you for your interest in improving this project! This guide explains
how to set up a development environment, follow our coding standards, and
submit changes safely.

---

### Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Testing & Validation](#testing--validation)
6. [Handling Environment Variables & Secrets](#handling-environment-variables--secrets)
7. [Submitting a Pull Request](#submitting-a-pull-request)
8. [Style Guidelines](#style-guidelines)
9. [Security & Responsible Disclosure](#security--responsible-disclosure)
10. [License](#license)

---

### Code of Conduct

All participants must adhere to the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
By contributing you agree to treat everyone with respect and follow the
outlined standards.

---

### Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/indoscient/privacy-first.git
   cd privacy-first
   ```
3. Install dependencies for both packages:
   
   ```bash 
   cd client && npm ci && cd ..
   cd server && npm ci && cd ..
   ```
> Always use npm ci rather than npm install — it installs exactly what package-lock.json pins, keeping your environment reproducible.
4. **Configure environment files.** Neither package starts without them:

   <details> <summary><code>client/.env</code></summary>

   ```bash
   VITE_SERVER_PUBLIC_KEY="<base64 public key from generate-keypair>"
   VITE_API_URL="http://localhost:4000/decrypt"
   VITE_API_KEY="<shared demo key>"
   ```
> Remember: every VITE_* variable is compiled into the shipped JavaScript bundle. Never put anything genuinely secret in this file.

</details> <details> <summary><code>server/.env</code></summary> 

   ```bash
   PRIVATE_KEY="<base64 private key from generate-keypair>"
   API_KEY="<same shared demo key as client>"
   ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
   ```
> Note: if API_KEY is unset the server runs fail-closed — all requests to /decrypt are rejected with 503.

5. **Generate a keypair** (one-off, per environment):
   ```bash
   cd server
   npm run generate-keypair   # prints PRIVATE and PUBLIC base64 strings
   ```
6. **Validate your private key** before first run:
   ```bash
   npm run sanity-check       # confirms a valid 32-byte secret key
   ```
---

### Project Structure

```tree
privacy-first/
├── client/              # Vite + React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx      # UI, fetch to /decrypt
│   │   ├── crypto.ts    # libsodium sealed-box encryption
│   │   └── environment.d.ts  # ImportMetaEnv declarations for VITE_* vars
│   ├── vite.config.ts
│   └── .env             # VITE_* build-time variables (never commit)
├── server/              # Express + TypeScript backend
│   ├── src/
│   │   ├── index.ts     # Routes, auth middleware, rate limiting
│   │   ├── crypto.ts    # libsodium sealed-box decryption
│   │   └── generate-keypair.ts
│   └── .env             # PRIVATE_KEY, API_KEY, ALLOWED_ORIGINS (never commit)
├── .github/
│   ├── workflows/deploy.yml  # Pages deployment on push to main
│   └── SECURITY.md           # Vulnerability reporting policy
├── PRIVACY.md           # Privacy design decisions
├── ROADMAP.md           # Enhancement & hardening tracking
└── CNAME                # privacy.indoscient.in
```

---

### Development Workflow
Start both packages in separate terminals:
```bash
# Terminal 1 — server (listens on :4000)
cd server && npm run dev

# Terminal 2 — client (Vite dev server on :5173)
cd client && npm run dev
```
**Behavioral notes that prevent common head-scratchers:**

- The client disables the form until libsodium finishes initializing; if you see "VITE_SERVER_PUBLIC_KEY not set", your client/.env is missing or malformed (restart the dev server after editing .env — Vite reads it at startup).
- A 401 from the server means the client and server API_KEY values don't match. A 503 means the server has no API_KEY configured at all.
- Base64 encoding uses libsodium's ORIGINAL variant everywhere. If you touch any crypto code, keep both sides on the same variant or decryption fails silently.

---

### Testing & Validation
Before pushing, run the full check suite locally:
```bash
# Type-check both packages (matches what CI enforces)
cd server && npx tsc --noEmit && cd ..
cd client && npx tsc --noEmit && cd ..

# Build both packages
npm run build --prefix server
npm run build --prefix client

# Key round-trip sanity: generate keypair, configure both .env files,
# send a message through the running stack and confirm the decrypted
# response matches the input.
```

CI runs the client build automatically on every push to main (.github/workflows/deploy.yml), so a type error will surface as a red run — but catching it locally first saves a round trip.

**If you touch the crypto code** (client/src/crypto.ts, server/src/crypto.ts), please also:

- State which libsodium primitives you changed and why
- Verify the sealed-box round trip works end-to-end
- Never downgrade the encoding variant or swap primitives without discussing it in the PR first

---

### Handling Environment Variables & Secrets

- **Never commit** .env, .env.*, keys, or tokens. The .gitignore must always cover them; check git status before committing.
- **New VITE_* variables:** update both client/src/environment.d.ts (the ImportMetaEnv interface) and the deploy workflow's build-step env: block if the variable is needed in production. Un-declared variables fail the type check; un-injected ones fail at runtime.
- **Keys are environment-specific.** Don't reuse your dev keypair's private key in any deployed environment.
- Production secrets for CI live in repo/environment-level GitHub Secrets (see deploy.yml for which variables the build step injects).

---

### Submitting a Pull Request
1. **Branch from main** with a descriptive name: git checkout -b feat/<short-description> or fix/<short-description>
2. **Keep changes focused** — one logical change per PR.
3. **Confirm tsc --noEmit passes** for both packages.
4. **Write a clear PR description:** what changed, why, and how you verified it. For crypto or auth changes, include your test steps.
5. **Link related issues** (Fixes #N) if applicable.
6. Wait for the CI run to go green; a maintainer will review.

**Docs-only changes** (`PRIVACY.md`, `ROADMAP.md`, `SECURITY.md`) are welcome and low-risk — please keep cross-references between them accurate, since these documents are mutually consistent by design (e.g., what data the server logs must match what PRIVACY.md discloses).

---

### Style Guidelines
- **TypeScript strict mode** in both packages; no any unless justified in a comment.
- **Comments explain why**, not what — the code already says what.
- Follow the formatting conventions already present in the file you edit rather than reformatting unrelated lines.
- Commit messages: imperative mood, concise subject line, optional body explaining rationale (see this repo's history for examples).
- Prefer small, named exports; keep the existing barrel/file layout.

---

### Security & Responsible Disclosure
**Do not open public GitHub issues for security vulnerabilities.**

Please follow the process in [SECURITY.md](.github/SECURITY.md): use GitHub's Private Vulnerability Reporting (Security tab → "Report a vulnerability"), or open a placeholder issue with no technical details.

The privacy guarantees described in [Privacy Design Decisions](PRIVACY.md) are the core of this project — if your contribution touches encryption, key handling, authentication, logging, or data persistence, expect extra review scrutiny. Known limitations (bundled API key, no key rotation, server-side decryption) are tracked in PRIVACY.md and ROADMAP.md; contributions that close those gaps are especially welcome.

---

### License

By contributing, you agree that your contributions will be licensed under the license that covers this repository. See LICENSE for details.

---


