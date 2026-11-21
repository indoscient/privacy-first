# Privacy Design Decisions

This demo implements **privacy-first infrastructure** — client-side sealed-box encryption (libsodium) with minimal data collection — as a demonstration milestone toward zero-knowledge, user-controlled encryption infrastructure.

---

## 🛡️ Core Principles

| Principle | Implementation |
|-----------|----------------|
| **Client-side encryption** | Messages are encrypted in the browser before transmission. **The trusted server decrypts in memory** to return the result; it never persists plaintext. |
| **Data minimization** | Only encrypted payloads traverse the network. No plaintext or metadata about message content is stored. |
| **Access control** | API key authentication (`X-API-Key` header) prevents unauthorized access to decryption endpoints. In the demo deployment, the key functions as rate-limit friction, not a secret — it is compiled into the client bundle. |
| **Integrity protection** | Rate limiting (20 req/15min on `/decrypt`) prevents abuse and resource exhaustion. |
| **Confidentiality by default** | **TLS required in production** — deployed at `privacy.indoscient.in` over HTTPS; mixed-content browser policies block plaintext HTTP anyway. Libsodium sealed-box encryption ensures payload confidentiality in transit. |

---

## 🔐 Technical Controls

### Client-Side (`client/`)

| Control | Technology | Purpose |
|---------|------------|---------|
| Client-side encryption | `libsodium-wrappers` | Sealed-box (`crypto_box_seal`) ensures only the server can decrypt |
| Public key injection | `.env` variables | Prevents client-side tampering with recipient identity |
| No plaintext storage | React state only | Messages never written to localStorage, sessionStorage, or IndexedDB |

### Server-Side (`server/`)

| Control | Technology | Purpose |
|---------|------------|---------|
| API key authentication | Custom middleware + constant-time comparison | Prevents unauthorized decryption requests |
| Fail-closed auth | Middleware returns 503 when `API_KEY` is unset | Server is unusable without configured credentials |
| Payload cap | `express.json({ limit: '64kb' })` | Rejects oversized or malicious request bodies |
| Timing-safe key comparison | Constant-time string comparison | Resists timing attacks on auth |
| Rate limiting | `express-rate-limit` | Limits to 100 req/15min global, 20 req/15min on `/decrypt` |
| CORS restrictions | Origin whitelist (`ALLOWED_ORIGINS`) | Restricts which domains can access the API |
| Security headers | `helmet` | Enforces HSTS, X-Frame-Options, X-Content-Type-Options, etc. |
| No ciphertext persistence | In-memory only | Decrypted plaintext discarded after response |

> **Note:** Transient console logs (auth failures) are not persisted to disk and are lost on restart.

---

## 📊 Data Flow Diagram

┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Browser   │────▶│    Server    │◀────│    User     │
│             │     │              │     │             │
│ • Input     │     │ • Auth       │     │ • Enters    │
│ • Encrypt   │     │ • Decrypt    │     │   Message   │
│ • Send      │     │ • Response   │     │ • Receives  │
│             │◀────│              │────▶│   Result    │
└─────────────┘     └──────────────┘     └─────────────┘
     ✅                    ✅                   ✅
Plaintext          Encrypted            Decrypted
exists in          ciphertext           plaintext
browser and in     only in transit      displayed to user
server memory
during decryption
— never stored

---

## 🚫 What We Do NOT Collect

| Data Type | Collected? | Notes |
|-----------|------------|-------|
| Plaintext messages | ❌ No | Never transmitted or stored |
| User identity | ❌ No | No accounts, emails, or PII |
| Ciphertext logs | ❌ No | Server does not persist request bodies |
| IP addresses | ⚠️ Only on failed auth | Written transiently to server console on unauthorized requests (`req.ip` in the auth-failure log line). Never persisted, never used for tracking. |
| Session cookies | ❌ No | Stateless API, no sessions |

---

## ⚠️ Limitations

This is a **demonstration project** and has the following limitations. Planned mitigations are tracked in **[ROADMAP.md](ROADMAP.md)**.


| Limitation | Mitigation for Production | Roadmap Item |
|------------|---------------------------|--------------|
| API key stored in `.env` and bundled into client JS (`VITE_*` is public by design) | In the demo deployment, the key functions as rate-limit friction, not a secret. For production: server-issued short-lived tokens, same-origin API proxying, and secure secrets management | [Authentication redesign](ROADMAP.md#production-hardening-required-before-deployment) |
| No key rotation | Implement periodic key regeneration + versioning; note that build-time `VITE_*` injection means key rotation requires a client rebuild | [Key rotation with versioning](ROADMAP.md#production-hardening-required-before-deployment) |
| No audit trail | Add signed, immutable logging (e.g., to append-only storage) | [Audit logging (ciphertext hashes + timestamps)](ROADMAP.md#near-term-recommended) |
| No client-side authentication | Add user auth (OAuth, JWT) before allowing encryption access | [Client-side user authentication](ROADMAP.md#production-hardening-required-before-deployment) |
| Timing-safe comparison leaks key length | Hash both inputs (SHA-256) before constant-time comparison | [Production hardening](ROADMAP.md#production-hardening-required-before-deployment) |
| No HTTPS enforcement on the API server | Deploy behind reverse proxy (nginx, Cloudflare) with TLS — required, since Pages serves HTTPS and browsers block mixed-content `http://` calls | [HTTPS / TLS enforcement](ROADMAP.md#production-hardening-required-before-deployment) |

> 💡 **Tip:** If deploying beyond demo purposes, review all items in **[Production Hardening](ROADMAP.md#production-hardening-required-before-deployment)** before go-live.

---

## 📜 Compliance Notes

| Regulation | Relevance | Status |
|------------|-----------|--------|
| **GDPR Art. 25** (Privacy-by-design) | Applies if processing EU residents' data | ✅ Implemented for demo |
| **CCPA/CPRA** | Applies if selling/handling California consumer data | ✅ No PII collected |
| **SOC 2** | Required for enterprise SaaS providers | ⚠️ Not applicable (demo only) - see [SOC 2 groundwork](ROADMAP.md#future-explorations-low-priority) for future plans |

---

## 🔗 Related Documentation

- [Client README](./client/README.md)
- [Server README](./server/README.md)
- [Roadmap](ROADMAP.md) — Track upcoming enhancements and production hardening items
- [Full Demo Repository](https://github.com/indoscient/privacy-first)

---

## ✏️ Last Updated

**2026-11-21** — Corrected IP-collection disclosure (auth-failure logging), replaced overstated zero-knowledge/E2EE phrasing with the verified architecture (client-side encryption with trusted-server decryption), upgraded TLS to "required," and added the client-bundled API key limitation.

---

## 💬 Questions or Feedback?

For questions about this privacy design or suggestions for improvement, please open an issue in the repository.

**Contact**: [GitHub Issues](https://github.com/indoscient/privacy-first/issues)

---
