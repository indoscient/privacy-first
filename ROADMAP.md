# Roadmap

Tracking upcoming enhancements, hardening work, and future explorations for the privacy-first encryption demo.

**Last Updated:** 2026-10-15
**Current Progress:** 6 of 9 core review items complete (all critical and high-priority security items are done).

---

## 📌 Near-Term (Recommended)

| Item | Priority | Est. Effort | Status |
|------|----------|-------------|--------|
| Audit logging (ciphertext hashes + timestamps only, never plaintext) | Medium | ~2 hours | ⬜ Not started |
| /logs endpoint with admin auth | Low | ~2 hours | ⬜ Not started |

### Details

**Audit Logging**
- Log ciphertext hashes (SHA-256) rather than raw data
- Include timestamps, IP addresses, and request duration
- Store in append-only storage (e.g., database with immutable writes)
- **Do NOT log plaintext** — this preserves zero-knowledge guarantee

---

## 🛡️ Production Hardening (Required Before Deployment)

| Item | Why It Matters |
|------|----------------|
| Secure secrets management (Vault / AWS Secrets Manager) | Replace `.env`-stored API key and private key |
| Key rotation with versioning | Static Curve25519 key pair limits blast radius of leaked private key |
| HTTPS / TLS enforcement via reverse proxy (nginx, Cloudflare) | Sealed-box protects content, not transport metadata |
| Client-side user authentication (OAuth or JWT) | Prevents anonymous use of the encryption API |
| Multi-tenant organization support | Enable org isolation, RBAC, team management |
| Signed, append-only audit trail | Enables tamper-evident accountability for enterprise settings |

---

## 🔮 Future Explorations (Low Priority)

| Item | Est. Effort | Description |
|------|-------------|-------------|
| Zero-znowledge sender verification | ~3–4 hours | Ed25519 detached signatures so senders prove identity without trusting API key alone |
| SOC 2 compliance groundwork | TBD | Currently "not applicable (demo only)" — revisit if offered as service |

---

## 🏗️ Recommended Deployment Architecture

When leaving demo stage:

| Component | Platform | Notes |
|-----------|----------|-------|
| Backend (Express API) | Render / Fly.io | Always-on required |
| Frontend (Static assets) | GitHub Pages / Vercel / Netlify | GitHub Pages free for demos; Vercel/Netlify for enterprise |
| CDN / WAF (optional) | Cloudflare | Caching, DDoS protection, geographic routing |

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

## 📝 Version History

| Date | Change |
|------|--------|
| 2026-10-12 | Initial roadmap created based on security review |

---

*For real-time progress, see the [Issues page](https://github.com/indoscient/privacy-first/issues).*
