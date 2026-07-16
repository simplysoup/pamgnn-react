# Stage 2 development log

## Goal
Expand the seeded project dataset so each project includes realistic category values and the work pages render without empty category badges.

## Implementation summary
- Added a shared seed-data module that defines the expected categories for all eight starter projects.
- Updated the seeding workflow to create projects with the new `category` arrays that match the collection’s allowed select values.
- Added regression coverage for the seed data defaults so the category mapping stays consistent.

## Validation
- Ran the integration test suite and confirmed the new seed-data regression tests passed.
- Verified the seeder now writes the expected category values for each seeded project.

## Status
Stage 2 is complete. Seeded projects now carry the richer category data expected by the site.
