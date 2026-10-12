
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
