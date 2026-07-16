# Phase 3 — One-command bootstrap and richer seed dataset

**Goal:** A developer who has just cloned the repository should be able to run a single command and have a fully working local stack with sample content, an admin user, and no manual environment file editing required.

**Current state:**
- `make up` does not wait for the app healthcheck to pass before returning; developers must poll manually.
- Bootstrapping requires manually copying `.env.example` to `.env.docker` and filling in secrets.
- The seed dataset has project titles and slugs but no `category` values, no SiteSettings content, and no default admin user.
- There is no first-run detection to avoid destroying existing data when re-running setup.

---

## Stage overview

| Stage | Goal | Validation |
|---|---|---|
| 1 | Bootstrap script | `./scripts/bootstrap.sh` idempotently sets up `.env.docker`, starts the stack, and waits for health | Stack reaches healthy state from a clean checkout with one command |
| 2 | Richer project seed data | Every seeded project has `category`, `summary`, and `featured` values matching the real site | Admin shows correct category badges; frontend work/reel pages render |
| 3 | SiteSettings seed | Default `SiteSettings` global values are written on first run | Site name, social links, and contact email render from the CMS |
| 4 | Admin user seed | A default admin user is created on first run if no users exist | Developer can log into `/admin` immediately after bootstrap |
| 5 | Makefile and README polish | `make bootstrap` is the single documented entry point; README reflects the updated flow | New developer can read README and be running in under five minutes |

---

## Stage 1 — Bootstrap script

### 1.1 Purpose

`scripts/bootstrap.sh` is the single entry point for local setup. It:

1. Checks that Docker is available.
2. Copies `.env.example` to `.env.docker` if `.env.docker` does not already exist, then prompts the developer to review the defaults and confirm before continuing.
3. Runs `docker compose up --build -d` to start the stack.
4. Polls `GET /api/health` until it returns `200` or a timeout is reached, printing a spinner.
5. Runs `make seed` to populate the database.
6. Prints the URLs for the site, admin, and Mailhog.

### 1.2 Idempotency rules

- If `.env.docker` already exists, the script skips the copy step.
- If the containers are already running and healthy, the script skips `docker compose up`.
- The seed script already skips records that exist, so re-running bootstrap is safe.

### 1.3 Script outline

```sh
#!/usr/bin/env sh
set -e

# 1. Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "Error: docker not found."; exit 1; }
command -v pnpm   >/dev/null 2>&1 || { echo "Error: pnpm not found.";   exit 1; }

# 2. Environment file
if [ ! -f .env.docker ]; then
  cp .env.example .env.docker
  echo "Created .env.docker from .env.example."
  echo "Review the file and re-run bootstrap when ready, or press Enter to continue with defaults."
  read -r _
fi

# 3. Start the Compose stack
docker compose up --build -d

# 4. Wait for the app to become healthy
echo "Waiting for app to become healthy..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "App is healthy."
    break
  fi
  printf '.'
  sleep 3
done

# 5. Seed content
make seed

# 6. Print URLs
echo ""
echo "  Site:    http://localhost:3000"
echo "  Admin:   http://localhost:3000/admin"
echo "  Mailhog: http://localhost:8025"
```

### ✅ Stage 1 validation

```bash
# Clean checkout scenario
rm .env.docker
./scripts/bootstrap.sh
# Expected: .env.docker created, stack starts, health passes, seed runs, URLs printed
```

---

## Stage 2 — Richer project seed data

### 2.1 Add `category` values to every project

All eight seeded projects should have realistic `category` arrays matching the collection's select options (`illustration`, `web-design`, `motion`, `identity`).

| Project | Categories |
|---|---|
| Comfortabull | `identity`, `web-design` |
| Camp Brigitte | `illustration`, `identity` |
| Vaughan Intl. Film Festival | `identity`, `motion` |
| Dynastic Wealth | `identity` |
| Shinee Love Sick | `illustration`, `motion` |
| Pearl Earring | `illustration` |
| Animated Business Cards | `motion` |
| Social Media Graphics & Ads | `illustration`, `motion` |

### 2.2 Verify frontend pages render correctly

After seeding with categories, the `/work` and `/project/[slug]` pages should render without empty category badges.

### ✅ Stage 2 validation

```bash
make seed
curl http://localhost:3000/work/web-design
# Expected: page renders with no empty category badges
```

---

## Stage 3 — SiteSettings seed

### 3.1 Inspect the SiteSettings global

The `SiteSettings` global in `src/globals/SiteSettings.ts` defines the fields available for the site name, contact email, and social links. The seed should write a first-run default for each field.

### 3.2 Add a `seedGlobals` function to `scripts/seed.ts`

```ts
async function seedGlobals(payload: BasePayload) {
  const existing = await payload.findGlobal({ slug: 'site-settings' })
  if (existing.siteName) {
    console.log('  – SiteSettings already set, skipping.')
    return
  }
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Pam Graphic Design',
      contactEmail: process.env.CONTACT_TO_EMAIL || '',
    },
  })
  console.log('  ✓ SiteSettings seeded.')
}
```

### ✅ Stage 3 validation

```bash
make seed
# Expected: SiteSettings line prints "✓ SiteSettings seeded."
# Admin → Globals → Site Settings should show the default values
```

---

## Stage 4 — Admin user seed

### 4.1 Seed a default admin user on first run

If no Users documents exist, create an initial admin user from environment variables so the developer can log in immediately.

Add two variables to `.env.example` and `.env.docker`:

```
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=change-me-on-first-login
```

Add a `seedAdminUser` function to `scripts/seed.ts`:

```ts
async function seedAdminUser(payload: BasePayload) {
  const existing = await payload.find({ collection: 'users', limit: 1 })
  if (existing.docs.length > 0) {
    console.log('  – Admin user already exists, skipping.')
    return
  }
  const email    = process.env.SEED_ADMIN_EMAIL    || 'admin@example.com'
  const password = process.env.SEED_ADMIN_PASSWORD || 'change-me'
  await payload.create({
    collection: 'users',
    data: { email, password, role: 'admin' },
  })
  console.log(`  ✓ Admin user created: ${email}`)
}
```

### 4.2 Security note

`SEED_ADMIN_PASSWORD` is a local-dev convenience only. It must be rotated before any environment exposed to the internet. Document this clearly in `.env.example`.

### ✅ Stage 4 validation

```bash
# Start from a fresh database (docker compose down -v && make up)
make seed
# Expected: "✓ Admin user created: admin@example.com"
# Visit http://localhost:3000/admin and log in with the seeded credentials
```

---

## Stage 5 — Makefile and README polish

### 5.1 Add `make bootstrap` as the primary entry point

```makefile
bootstrap:
	chmod +x scripts/bootstrap.sh && ./scripts/bootstrap.sh
```

### 5.2 Update README quick-start section

Replace the current "Run: `make up`" block with a single `make bootstrap` command and an explanation of what it does.

### 5.3 Document the `make reset` escape hatch

Add a `reset` target that tears down the Compose stack and removes volumes, so developers can start from scratch:

```makefile
reset:
	docker compose down -v
```

Warn clearly in the README that this deletes all local data.

### ✅ Stage 5 validation

```bash
make bootstrap
# Expected: full stack reaches healthy state with seeded content and admin user from one command
```
