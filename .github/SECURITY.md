# Security Policy

## Supported Versions

This project is a pre-release demonstration and is under active development
on the `main` branch only. There are no tagged releases yet.

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| all other branches / forks | :x: |

Security fixes are applied to `main` and are immediately visible in the
public commit history. Do not expect backports, as there is no stable
version line to backport to.

## Reporting a Vulnerability

We take reports seriously, especially given this project demonstrates
privacy and cryptography controls.

**Preferred channel:** Use GitHub's **Private Vulnerability Reporting**
(Repository → Security tab → "Report a vulnerability"). This keeps the
details encrypted and private to the maintainers.

- If Private Reporting is unavailable, contact the maintainers by opening
  a GitHub issue titled *"Security review"* with **no technical details**,
  so we can provide a secure contact point.

**What to include (helps us triage faster):**
- The affected component (`client/`, `server/`, deployment configuration)
- Steps to reproduce or a proof of concept
- Your assessment of severity and impact

**Response expectations:**
- **Acknowledgment:** within 72 hours
- **Triage decision (accepted / declined / needs more info):** within 7 days
- **Status updates:** at least weekly until resolution
- Fixes for accepted vulnerabilities are prioritized and published to `main`

**Scope notes for this demo project:**
- The client-bundled `VITE_API_KEY` is a **known, documented limitation** —
  see [Privacy Design Decisions](../PRIVACY.md) and
  [ROADMAP](../ROADMAP.md). Reports about it are welcome but will be
  triaged against the existing tracking, not treated as new findings.
- Demos intentionally trade some hardening for simplicity (no TLS
  enforcement on the API server yet, no key rotation). These are tracked
  in the [Production Hardening](../ROADMAP.md#-production-hardening-required-before-deployment)
  section of the roadmap.

**Out of scope:** volumetric DoS, social engineering, issues in
third-party dependencies not reachable through this project's deployed
surface, or reports requiring physical access to maintainers' machines.

We will credit reporters in the commit message or release notes upon
fix, unless you prefer otherwise. Please do not test exploits against the
live deployment beyond what is necessary to demonstrate the issue.
