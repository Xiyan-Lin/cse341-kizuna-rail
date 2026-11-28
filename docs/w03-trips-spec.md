## W03 Feature Set 1 — Trips (independent makeup)
Proposed individual feature, pending instructor approval of the alternative submission. This is not a claim of team assignment or review.

## Goal
Use Mongoose for Trips, separate EJS and API routes/controllers, and hydrate the existing trip list using client-side JavaScript. Preserve existing trip detail, schedule display, and booking routes. Schedules and Bookings refactors are outside this PR.

## Data model
Collection: `trips`. Public string id (unique), name, description, region, startStation, endStation, duration, nonnegative numeric distance, highlights (string array), bestSeason, operatingMonths (integer array 1–12), optional imageUrl. Use lean queries and exclude _id. Share the Mongoose connection's native Db with legacy routes/seed tools.

## API contract
- GET /api/trips: 200 JSON `{ "trips": [...] }` (including empty array); 500 `{ "error": "Failed to fetch trips" }`.
- GET /api/trips/:id: 200 matching trip, 404 `{ "error": "Trip not found" }`, 500 `{ "error": "Failed to fetch trip" }`.
- Document both routes with OpenAPI and serve Swagger at /api-docs.

## Implementation
- Create schemas/trips.js, models/trips.js and controllers/trips.js with getTripById/getAllTrips and named EJS controllers.
- Split EJS and JSON routes; retire old list/details/trips route modules.
- List page renders a reusable HTML template, fetches JSON, checks response.ok, handles loading/error/empty states, supports region and season filters without reload.
- Details page uses new trip model, retains legacy schedules until Feature Set 2, preserves existing links and returns 404 for unknown trip.
- Add tests and maintain existing trains behavior.

## Test plan
- [ ] npm install (update dependency lockfile), npm run swagger, npm run lint.
- [ ] npm run test:catalog (offline fetch/filter tests).
- [ ] npm test (Vitest temporary database, existing and new tests).
- [ ] Local /api/trips lists six seeds; /api/trips/alpine-panorama returns 200; /api/trips/not-a-trip returns JSON 404.
- [ ] /trips loads cards using fetch; filters update without full reload; details link works.
- [ ] /trips/alpine-panorama preserves schedules and booking links; unknown detail returns 404.
- [ ] Swagger executes both Trips routes; browser console and failure state checked.
- [ ] Record local walkthrough and attach link to PR; arrange actual review with instructor/team.

One vertical issue keeps related model, API and UI changes reviewable together. In a shared team codebase the database connection might warrant a separate coordinated PR.
