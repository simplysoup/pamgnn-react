# pamgnn

A Next.js + Payload site with a PostgreSQL-backed CMS and a local Docker Compose workflow.

## Local development

### Option 1: Docker Compose (recommended)

The repository includes a Compose stack with:
- PostgreSQL for the Payload database
- Mailhog for SMTP testing
- The Next.js app itself

From a fresh checkout, run:

```bash
make bootstrap
```

This creates a local .env.docker file if needed, starts the Compose stack, waits for the app health endpoint to become available, seeds the database with sample projects and globals, and creates a default admin account for local login.

Then open:
- http://localhost:3000 for the site
- http://localhost:3000/admin for the Payload admin
- http://localhost:8025 for the Mailhog inbox

If you want to start from a clean local database, use:

```bash
make reset
```

This removes the Compose stack and its volumes, which deletes all local data.

### Option 2: Local Next.js + Postgres

If you prefer to run the app outside Docker:

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Use the local Postgres connection string in .env and start a local Mailhog instance if you want to test the contact form:

```bash
docker run --rm -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

## Environment variables

The Compose stack uses .env.docker for runtime settings, while local development outside Docker uses .env. A sample template is available in .env.example.

To get started:

```bash
cp .env.example .env
```

For the Compose stack, create a matching .env.docker file and adjust the values for the container network:

```bash
cp .env.example .env.docker
```

Then update .env.docker with Compose-friendly values such as:
- DATABASE_URL=postgresql://pamgnn:pamgnn@postgres:5432/pamgnn
- SMTP_HOST=mailhog

Key variables include:
- DATABASE_URL for the Postgres connection
- PAYLOAD_SECRET for Payload
- SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / CONTACT_TO_EMAIL for the contact form

## Testing

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/contact-action.int.spec.ts
```

## Docker permissions on remote hosts

If Docker Compose needs sudo on your remote machine, the host is usually denying your user access to the Docker daemon socket. See [docs/docker-permissions.md](docs/docker-permissions.md) for the standard fix.

## Makefile workflow

A Makefile is included for the most common commands:

```bash
make bootstrap  # create .env.docker if needed, start the stack, wait for health, and seed content
make up         # build and start the full Compose stack
make down       # stop the Compose stack
make reset      # remove the Compose stack and all volumes (destructive)
make logs       # follow the app logs
make seed       # seed projects, skills, globals, and the local admin account
make test       # run the Vitest integration tests
```

After starting the stack, you can visit:
- http://localhost:3000 for the site
- http://localhost:3000/admin for Payload
- http://localhost:8025 for Mailhog
- http://localhost:3000/api/health for the health endpoint
