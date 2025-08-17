# PP Orchestrator — Autonomous

Production-grade kernel with: API + Worker (Redis queue) + Postgres + PWA + Web Push approvals + OAuth adapters (Google Drive/Gmail/Calendar, GitHub).

## Services
- api: Express API, OAuth, webhooks, PWA, push endpoints, planning & policy.
- worker: background executor consuming Redis queue.
- db: migrations for Postgres.

## Quick Deploy (Render)
1) Push to GitHub.
2) Render → New → Web Service from repo (auto reads render.yaml).
3) Set env vars: DATABASE_URL, REDIS_URL, PUBLIC_BASE_URL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, GOOGLE_CLIENT_ID/SECRET, GITHUB_CLIENT_ID/SECRET, (optional) OPENAI_API_KEY.
4) Open PUBLIC_BASE_URL on iPhone → Add to Home Screen → Enable notifications.
5) Connect Google/GitHub at /oauth/google/start and /oauth/github/start.

## Kernel
Plan → Confirm → Act → Audit → Learn.
- Confirmations required for impactful actions (financial).
- Policies: caps, kill-switch, allow/deny lists.
- Audits: stored in Postgres.

