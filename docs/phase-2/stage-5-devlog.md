# Stage 5 development log

## Goal
Standardize the repository's environment-file strategy so local development and the Compose stack use a clear, predictable setup.

## Implementation summary
- Updated the ignore rules so runtime env files and uploaded media are not tracked by Git.
- Expanded the example environment file to cover both local development and the Compose-based Postgres/Mailhog stack.
- Documented the expected .env and .env.docker workflow in the README.

## Validation
- Verified the repository now has a clear environment-file template in .env.example.
- Confirmed the Compose stack continues to start and serve the app with the updated configuration.

## Status
Stage 5 is complete. The project now has a documented and consistent environment-file workflow for both local runs and Docker Compose.
