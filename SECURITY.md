# Security

This document records the security posture of the project: secrets handling,
runtime hardening, dependency and image scanning, and the SBOM.

## Secrets management

- **No secrets are committed.** `.env` files are git-ignored (root `.gitignore`
  and `server/.gitignore`); only `.env.example` files are tracked.
- The server **fails fast** if required config is missing: it exits with a clear
  message when `MONGODB_URI` or `SESSION_SECRET` is not set
  (`server/src/index.ts`), so a misconfigured environment cannot start silently.
- `SESSION_SECRET` is supplied per environment:
  - **dev** — an insecure default in `docker-compose.yml`, overridable via `./.env`;
  - **prod** — `docker-compose.prod.yml` makes it **required** (`${SESSION_SECRET:?...}`),
    so the prod stack refuses to start without a real secret.

## Runtime hardening (`server/src/index.ts`)

- **Session secret** comes from `SESSION_SECRET` (previously a hard-coded
  `'testsecret'`).
- **Session cookie** is `httpOnly`, `sameSite=lax`, and `secure` when
  `SESSION_COOKIE_SECURE=true` (set behind HTTPS).
- **CORS** uses an explicit allowlist from `CORS_ORIGINS` (default
  `http://localhost:4200,http://localhost:8080`).
- Password hashing uses **bcryptjs** (pure JS).

## Dependency scanning (`npm audit`)

Run in CI on each app's **production** dependencies.

| Scope | Result |
|-------|--------|
| `server` (prod deps) | **0 vulnerabilities** |
| `animal-adoption-client` (prod deps) | 4 high (Angular framework) — tracked for an Angular upgrade |
| `animal-adoption-client` (dev deps) | build toolchain (vite/esbuild/webpack) — **build-time only**, never shipped to the browser or the nginx runtime image |

Gate policy: server audits at `--audit-level=high` (clean); the client audits at
`--audit-level=critical` (clean) because the remaining highs are Angular framework
advisories pending a major/minor upgrade.

## Image scanning (Trivy)

Both runtime images are scanned in CI with `--severity HIGH,CRITICAL --ignore-unfixed`.

- **Application layers are clean** — the server image's Node packages report no
  HIGH/CRITICAL (after the bcryptjs change); the client runtime image ships only
  static compiled assets (no `node_modules`).
- **Base-image findings** (the Node runtime in `node:22-slim`, OS packages in
  `nginx:*-alpine`) are upstream issues resolved by rebuilding on refreshed base
  images. Images are rebuilt with `--pull`, and the image-scan job **reports**
  these (uploads results) rather than hard-failing the build. Accepted CVEs can be
  pinned in `.trivyignore`.

## SBOM

CycloneDX SBOMs are generated per app with `npm run sbom`
(`@cyclonedx/cyclonedx-npm`) and uploaded as CI artifacts. They are not committed
(`**/sbom.cdx.json` is git-ignored) since they are build outputs.

## CI

`.github/workflows/security.yml` runs on every push/PR:
1. `npm audit` (both apps, production deps) — the gate.
2. SBOM generation + artifact upload.
3. Docker image build + Trivy scan (reporting).
