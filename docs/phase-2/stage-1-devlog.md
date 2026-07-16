# Stage 1 development log

## Goal
Switch the Payload app from the SQLite adapter to PostgreSQL and confirm the local admin and build flows work with the new database backend.

## Implementation summary
- Installed the PostgreSQL adapter and removed the SQLite adapter from the project dependencies.
- Updated the Payload config to use `postgresAdapter` with `DATABASE_URL` sourced from the environment.
- Updated the local environment file to point at a Postgres connection string for local development.

## Validation
- Started a temporary PostgreSQL container and verified it accepted connections.
- Ran `pnpm build` successfully against the Postgres-backed configuration.
- Verified the dev server responded successfully at `/admin`.
- Ran the integration tests with `pnpm test:int`, which passed.

## Status
Stage 1 is complete. Payload now boots against PostgreSQL locally, and the app/admin paths are working with the new adapter.
