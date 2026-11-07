# Testing

Three layers of automated tests, all runnable locally and in CI
(`.github/workflows/ci.yml` runs them on every push / pull request).

## Server — unit + integration (Jest + Supertest)

Runs against a throwaway **in-memory MongoDB** (`mongodb-memory-server`); no running
services needed.

```bash
cd server
npm ci
npm test                 # all suites
npm test -- --coverage   # with a coverage report (./coverage)
```

Covers: password hashing, auth middleware, the mailer retry/never-throw behaviour,
the image pipeline (watermark + WebP + EXIF-strip), and REST flows — auth,
animals, and the adoption workflow (approve auto-rejects the other requests and
marks the animal unavailable) including error paths (401/403/400).

## Client — unit (Karma + Jasmine, headless Chrome)

```bash
cd animal-adoption-client
npm ci
npm run test:ci          # headless (ChromeHeadlessNoSandbox)
```

Covers: `AuthService` and `AnimalService` (correct requests + state), and the
animal-detail image gallery logic.

## End-to-end (Playwright)

Drives a real browser against the **running stack**, so bring it up and seed first:

```bash
docker compose up -d --build
docker compose --profile seed run --rm seed

cd e2e
npm ci
npx playwright install chromium   # first time only
npx playwright test
```

Covers one full user journey: register → log in → open an animal → submit an
adoption request → see the "already requested" state.

## CI

`ci.yml` runs three parallel jobs — **server-tests**, **client-tests**, and
**e2e** (which builds the compose stack, seeds it, and runs Playwright). The
server coverage report and the Playwright HTML report are uploaded as build
artifacts. A separate `security.yml` runs dependency/image scanning and SBOMs.
