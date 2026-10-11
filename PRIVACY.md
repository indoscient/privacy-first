# Privacy Design Decisions

This demo implements privacy-by-design controls to demonstrate end-to-end encryption with minimal data collection.

---

## 🛡️ Core Principles

| Principle | Implementation |
|-----------|----------------|
| **Zero-knowledge architecture** | Plaintext never leaves the client device. The server only receives encrypted ciphertext. |
| **Data minimization** | Only encrypted payloads traverse the network. No plaintext or metadata about message content is stored. |
| **Access control** | API key authentication (`X-API-Key` header) prevents unauthorized access to decryption endpoints. |
| **Integrity protection** | Rate limiting (20 req/15min on `/decrypt`) prevents abuse and resource exhaustion. |
| **Confidentiality by default** | TLS recommended in production; libsodium sealed-box encryption ensures confidentiality in transit. |

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
| Rate limiting | `express-rate-limit` | Limits to 100 req/15min global, 20 req/15min on `/decrypt` |
| CORS restrictions | Origin whitelist (`ALLOWED_ORIGINS`) | Restricts which domains can access the API |
| Security headers | `helmet` | Enforces HSTS, X-Frame-Options, X-Content-Type-Options, etc. |
| No ciphertext persistence | In-memory only | Decrypted plaintext discarded after response |

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
remains in         ciphertext           plaintext
browser only       only in transit      displayed to user

---

## 🚫 What We Do NOT Collect

| Data Type | Collected? | Notes |
|-----------|------------|-------|
| Plaintext messages | ❌ No | Never transmitted or stored |
| User identity | ❌ No | No accounts, emails, or PII |
| Ciphertext logs | ❌ No | Server does not persist request bodies |
| IP addresses | ❌ No | Not logged (only transient console warning on auth failures) |
| Session cookies | ❌ No | Stateless API, no sessions |

---

## ⚠️ Limitations

This is a **demonstration project** and has the following limitations:

| Limitation | Mitigation for Production |
|------------|---------------------------|
| API key stored in `.env` | Use secure secrets management (AWS Secrets Manager, HashiCorp Vault) |
| No key rotation | Implement periodic key regeneration + versioning |
| No audit trail | Add signed, immutable logging (e.g., to append-only storage) |
| No client-side authentication | Add user auth (OAuth, JWT) before allowing encryption access |
| No HTTPS enforcement | Deploy behind reverse proxy (nginx, Cloudflare) with TLS |

---

## 📜 Compliance Notes

| Regulation | Relevance | Status |
|------------|-----------|--------|
| **GDPR Art. 25** (Privacy-by-design) | Applies if processing EU residents' data | ✅ Implemented for demo |
| **CCPA/CPRA** | Applies if selling/handling California consumer data | ✅ No PII collected |
| **SOC 2** | Required for enterprise SaaS providers | ⚠️ Not applicable (demo only) |

---

## 🔗 Related Documentation

- [Client README](./client/README.md)
- [Server README](./server/README.md)
- [Full Demo Repository](https://github.com/indoscient/privacy-first)

---

## ✏️ Last Updated

**2026-10-11** — Initial privacy design documentation.

---

## 💬 Questions or Feedback?

For questions about this privacy design or suggestions for improvement, please open an issue in the repository.

**Contact**: [GitHub Issues](https://github.com/indoscient/privacy-first/issues)
