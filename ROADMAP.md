# Roadmap

Tracking upcoming enhancements, hardening work, and future explorations for the privacy-first encryption demo.

**Current Progress:** 7 of 9 core review items complete (all critical and high-priority security items are done).

---

## 📌 Near-Term (Recommended)

| Item | Priority | Est. Effort | Status |
|------|----------|-------------|--------|
| Audit logging (ciphertext hashes + timestamps only, never plaintext) | Medium | ~2 hours | ⬜ Not started |
| Remove remaining demo placeholders and verify client bundle | Low | ~5 min | ⬜ Not started |

### Details

**Audit Logging**
- Log ciphertext hashes (SHA-256) rather than raw data
- Include timestamps, IP addresses, and request duration
- Store in append-only storage (e.g., database with immutable writes)
- **Do NOT log plaintext** — this preserves zero-knowledge guarantee

---

## 🛡️ Production Hardening (Required Before Deployment)

These items become blockers if you plan to use this beyond a demo:

| Item | Why It Matters |
|------|----------------|
| Secure secrets management (Vault / AWS Secrets Manager) | Replace `.env`-stored API key and private key |
| Key rotation with versioning | Static Curve25519 key pair limits blast radius of leaked private key |
| HTTPS / TLS enforcement via reverse proxy (nginx, Cloudflare) | Sealed-box protects content, not transport metadata |
| Client-side user authentication (OAuth or JWT) | Prevents anonymous use of the encryption API |
| Signed, append-only audit trail | Enables tamper-evident accountability for enterprise settings |

### Implementation Notes

**Secrets Management:**

.env (demo) → AWS Secrets Manager / HashiCorp Vault (production)

**Key Rotation:**
- Regenerate Curve25519 key pairs periodically
- Maintain versioned public keys for backward compatibility
- Document rotation schedule and procedures

**TLS Enforcement:**
- Deploy behind Nginx, Cloudflare, or equivalent reverse proxy
- Force HTTPS redirects at infrastructure level
- Enable HSTS headers (already done via Helmet, but enforcement needed)

---

## 🔮 Future Explorations (Low Priority)

| Item | Est. Effort | Description |
|------|-------------|-------------|
| Zero-knowledge sender verification | ~3–4 hours | Ed25519 detached signatures (`crypto_sign_detached`) so senders prove identity without trusting API key alone |
| `/logs` endpoint with admin auth | ~2 hours | Surface audit-log history to operators without exposing plaintext |
| SOC 2 compliance groundwork | TBD | Currently "not applicable (demo only)" — revisit if offered as service |

---

## 🏗️ Recommended Deployment Architecture

When leaving demo stage:

| Component | Recommended Platform | Notes |
|-----------|---------------------|-------|
| Backend (Express API) | Render or Fly.io | Always-on required |
| Frontend (Static assets) | Vercel or Netlify | Optimized for SPAs |
| CDN / WAF (optional) | Cloudflare | Adds caching, DDoS protection, geographic routing |

---

## 📊 Tracking Against Original Security Review

| Category | Total Items | Completed | Pending |
|----------|-------------|-----------|---------|
| Critical | 2 | ✅ 2 | ⬜ 0 |
| High | 3 | ✅ 3 | ⬜ 0 |
| Medium | 2 | ⬜ 0 | ⬜ 2 |
| Low | 2 | ⬜ 0 | ⬜ 2 |
| **Total** | **9** | **✅ 5** | **⬜ 4** |

---

## 🤝 Contributing to the Roadmap

Interested in working on any of these items?

1. Check existing issues first to avoid duplicate efforts
2. Comment on the relevant GitHub Issue to claim it
3. Reference the issue number in your PR description
4. Tag maintainers for review upon completion

**Contact:** [GitHub Issues](https://github.com/indoscient/privacy-first/issues)

---

## 📝 Version History

| Date | Change |
|------|--------|
| 2026-10-12 | Initial roadmap created based on security review |

---

*This roadmap reflects community priorities and may evolve. For real-time progress, see the [Issues page](https://github.com/indoscient/privacy-first/issues).*

