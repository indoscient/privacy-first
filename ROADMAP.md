# Roadmap

Tracking upcoming enhancements, hardening work, and future explorations for
the Privacy-first encryption infrastructure.

**Last Updated:** 2026-11-21
**Current Progress:** 5 of 9 core review items complete (all critical and
high-priority security items are done).

---

## 📌 Near-Term (Recommended)

| Item | Priority | Est. Effort | Status |
|------|----------|-------------|--------|
| [Audit logging (ciphertext hashes + timestamps)](#audit-logging) — never plaintext, never IPs | Medium | ~2 hours | ⬜ Not started |
| [Patch timing-safe comparison length leak](#audit-logging) | Medium | ~30 min | ⬜ Not started |
| Ciphertext length validation in `/decrypt` | Low | ~30 min | ⬜ Not started |
| /logs endpoint with admin auth | Low | ~2 hours | ⬜ Not started |

### Details

**Audit Logging**
- Log ciphertext hashes (SHA-256) rather than raw data
- Include timestamps and request duration
- Store in append-only storage (e.g., database with immutable writes)
- **Do NOT log plaintext** — this preserves the no-persistence guarantee
- **Decision recorded 2026-11-21: no IP addresses in the audit log.**
  PRIVACY.md discloses IPs as seen only transiently on auth failures;
  persisting them in the audit trail would require updating that disclosure.
  If persistent IP logging is ever needed, amend [PRIVACY.md](PRIVACY.md)
  in the same PR.

**Timing-safe comparison patch**
- The current `timingSafeEqual` returns early on length mismatch, leaking
  key length. Replace with a SHA-256 digest of both inputs compared via
  Node's `crypto.timingSafeEqual`. (Low practical impact in the demo —
  the API key ships in the client bundle — but PRIVACY.md advertises
  timing protection, so the implementation should fully deliver it.)

**Ciphertext length validation**
- Reject bodies shorter than `crypto_box_SEALBYTES` (+ overhead check)
  before attempting decryption — cheap rejection of malformed inputs.

---

## 🛡️ Production Hardening (Required Beyond Demo Stage)

| Item | Why It Matters |
|------|----------------|
| Authentication redesign (server-issued short-lived tokens, or same-origin API proxying) | The bundled `VITE_API_KEY` is public by design — it functions as rate-limit friction, not a secret. See [PRIVACY.md](PRIVACY.md) → Limitations |
| Client-side user authentication (OAuth or JWT) | Prevents anonymous use of the encryption API |
| Secure secrets management (Vault / AWS Secrets Manager) | Replace `.env`-stored API key and private key |
| Key rotation with versioning | Static Curve25519 key pair limits blast radius of leaked private key — note: no forward secrecy today, so a leaked key can decrypt past traffic |
| HTTPS / TLS enforcement on the API server via reverse proxy (nginx, Cloudflare) | Required once the client calls the API from `https://privacy.indoscient.in` — browsers block mixed-content `http://` requests |
| Multi-tenant organization support | Enable org isolation, RBAC, team management |
| Signed, append-only audit trail | Enables tamper-evident accountability for enterprise settings |

---

## 🔮 Future Explorations (Low Priority)

| Item | Est. Effort | Description |
|------|-------------|-------------|
| Zero-knowledge sender verification | ~3–4 hours | Ed25519 detached signatures so senders prove identity without trusting API key alone |
| SOC 2 compliance groundwork | TBD | Currently "not applicable (demo only)" — revisit if offered as a service |

---

## 🏗️ Recommended Deployment Architecture

When leaving demo stage (backend hosting is the missing piece — the
frontend is already deployed):

| Component | Platform | Notes |
|-----------|----------|-------|
| Backend (Express API) | Render / Fly.io | Always-on required; must serve HTTPS; `ALLOWED_ORIGINS` must include `https://privacy.indoscient.in` |
| Frontend (Static assets) | GitHub Pages | ✅ Live at [privacy.indoscient.in](https://privacy.indoscient.in), deployed via GitHub Actions |
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
| 2026-10-15 | Deployment architecture added; status refresh |
| 2026-11-21 | Aligned with amended PRIVACY.md: removed IPs from audit-logging plan (decision recorded), corrected zero-knowledge phrasing, fixed header progress count (5 of 9), fixed broken audit-logging link, added timing-safe patch + ciphertext validation + auth-redesign items, renamed hardening section to reflect demo-stage deployment |

---

*For real-time progress, see the [Issues page](https://github.com/indoscient/privacy-first/issues).*
