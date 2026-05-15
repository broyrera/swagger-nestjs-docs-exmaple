# Sprint 9: Database Foundation (Prisma + PostgreSQL)

## Sprint Goal

Introduce a real persistence layer to Lawan PMO Sports by setting up PostgreSQL via Docker Compose, integrating Prisma ORM, and modeling the full domain schema for all existing API contract modules.

This sprint marks the transition from contract-only stubs to a database-backed backend. No business logic is implemented yet — only the schema, infrastructure, and a Prisma client wired into NestJS.

## Why This Sprint Exists

The 7 contract modules (auth, organizations, competitions, participants, matches, standings, brackets) currently have controllers and DTOs but no persistence. Service methods either return placeholders or do nothing.

Before any module can become functional (Sprint 10+), the project needs:

- A running database that can be reproduced locally.
- A schema that reflects the domain decisions already locked in the API contract.
- A Prisma client integrated into NestJS as an injectable provider.
- A migration workflow developers can follow.

This is the foundation for Sprint 10 (real Auth) and every module sprint after it.

## Sprint Scope

This sprint focuses on:

- Docker Compose setup for a local PostgreSQL instance.
- `.env` and `.env.example` for the database connection string.
- Prisma installation and initialization.
- Full schema for all current contract modules.
- `PrismaService` provider integrated into NestJS.
- One initial migration committed.
- Developer onboarding doc for "how to run the database locally."

This sprint does NOT include:

- Real authentication implementation (Sprint 10).
- Any service method implementation (later sprints).
- Seed data beyond what is needed to verify the schema (kept minimal).
- Repository pattern abstraction (services will use `PrismaService` directly).

## Key Schema Decisions

### ID convention

API contract examples already use prefixed string IDs:

```txt
usr_123  org_123  cmp_123  par_123  mat_123  bm_123
```

The schema will preserve this convention. Each model uses `String @id` with a generated prefixed value (e.g. `usr_${cuid}`). A small ID generator helper will be added under `src/common/ids/` to keep the prefix → entity mapping in one place.

Reason: prefixed IDs are part of the public API contract and help debugging by making IDs self-describing.

### Soft remove vs hard delete

Participants use `status = REMOVED` for soft removal (already in the contract). No global `deletedAt` column. Matches and brackets are not soft-deleted; they are either updated or rejected by lifecycle constraints.

### Match score storage

Match scores are stored inline on the `Match` model as `homeScore Int?` and `awayScore Int?`. A separate `MatchScore` table is rejected for now because the API contract treats score as a single update on the match.

### RBAC tables

- `OrganizationMember` carries `OrganizationRole` (OWNER, ADMIN, MEMBER).
- `CompetitionRoleAssignment` carries `CompetitionRole` (OWNER, ADMIN, SCORE_ADMIN). A separate table (not just enum on Competition) is used so a competition can have multiple admins / score admins.
- Global `User.role` covers SUPER_ADMIN and USER.

Participants are NOT involved in any RBAC table. Authorization is always User-based (per [adr-001](../04-decisions/adr-001-participants-do-not-require-user-account.md)).

### Timestamps

Every model has `createdAt` and `updatedAt` with `@default(now())` and `@updatedAt`.

### Bracket structure

`BracketRound` (per-round metadata) and `BracketMatch` (per-slot data) are separate tables. `BracketMatch` may optionally link to a `Match` row when the bracket slot has been played.

## Data Model

Models to define:

- `User`
- `Organization`
- `OrganizationMember`
- `Competition`
- `CompetitionRoleAssignment`
- `Participant`
- `Match`
- `BracketRound`
- `BracketMatch`

Enums to define (mirroring existing TypeScript enums):

- `GlobalUserRole` (SUPER_ADMIN, USER)
- `OrganizationRole` (OWNER, ADMIN, MEMBER)
- `CompetitionRole` (OWNER, ADMIN, SCORE_ADMIN)
- `CompetitionType`, `CompetitionFormat`, `CompetitionVisibility`, `CompetitionStatus`
- `ParticipantType`, `ParticipantStatus`
- `MatchStatus`
- `BracketGenerationMode`, `BracketMatchStatus`

The Prisma enums must stay in sync with the TS enums in `src/modules/*/dto/*.enum.ts`. Sprint DoD requires manual verification.

## User Stories

### Story 9.1: Developer can run the database locally

As a backend developer,
I want to start a local PostgreSQL instance with one command,
so that I can run the application without installing Postgres on my machine.

Acceptance criteria:

- `docker compose up -d` starts a PostgreSQL container.
- `.env.example` documents `DATABASE_URL`.
- README (or a new onboarding doc) explains the local DB workflow.
- Container data persists across restarts via a named volume.

### Story 9.2: Project has a Prisma schema for all current modules

As a backend developer,
I want a single `schema.prisma` that models every contract module,
so that future service implementations have a real persistence layer to bind to.

Acceptance criteria:

- `prisma/schema.prisma` defines all 9 models listed above.
- All Prisma enums match the existing TypeScript enums.
- Foreign keys and onDelete behavior reflect domain rules (e.g. removing a competition cascades to its participants and matches).
- Schema passes `prisma format` and `prisma validate`.

### Story 9.3: Prisma client is injectable in NestJS

As a backend developer,
I want a `PrismaService` provider,
so that any module can inject it and start replacing stub logic.

Acceptance criteria:

- `PrismaService` uses composition — it holds a `PrismaClient` and exposes the extended client as a public readonly `db` property. Implements `OnModuleInit` (connect) and `OnModuleDestroy` (disconnect).
- A `PrismaModule` exports the service globally (via `@Global()`).
- Importing `PrismaModule` once in `AppModule` makes the service available everywhere.
- Existing controllers/services still build and Swagger UI still loads.

### Story 9.4: Project has an initial migration

As a backend developer,
I want one initial migration committed to the repo,
so that any developer can `prisma migrate deploy` and reproduce the schema.

Acceptance criteria:

- `prisma migrate dev --name init` succeeds against the Docker Postgres.
- The generated migration is committed under `prisma/migrations/`.
- `prisma migrate status` reports the migration as applied.

### Story 9.5: ID prefix is enforced by a Prisma client extension

As a backend developer,
I want prefixed IDs to be applied automatically at the persistence layer,
so that no service can accidentally create a row without the correct prefix.

Acceptance criteria:

- `src/common/ids/id-prefix.ts` defines `ID_PREFIX_BY_MODEL` (typed map of Prisma model name → prefix string) and exports `IdPrefix` and `ModelName` types.
- `src/common/ids/generate-id.ts` exports `generateId(prefix: IdPrefix)` using `nanoid` for the suffix.
- `src/common/prisma/auto-id.extension.ts` defines a Prisma client extension that intercepts `create`, `createMany`, and `upsert` on `$allModels` and injects `id = generateId(prefix)` when not explicitly provided.
- `schema.prisma` models declare `id String @id` with NO `@default(...)` — the extension is the single source of IDs.
- Bypassing the extension (e.g. raw SQL or directly using a non-extended `PrismaClient`) will fail at the DB level with a NOT NULL violation. This is intentional safety.

Architecture note: because `$extends` returns a new client type that is not assignable back to `PrismaClient`, `PrismaService` uses **composition** rather than inheritance. The extended client is exposed as a public readonly property (`db`) on the service. Call sites read as `this.prisma.db.user.findMany()`.

## Deliverables

- `docker-compose.yml` (Postgres service)
- `.env.example` and `.env` (gitignored)
- `prisma/schema.prisma`
- `prisma/migrations/<timestamp>_init/`
- `src/common/prisma/prisma.service.ts`
- `src/common/prisma/prisma.module.ts`
- `src/common/ids/generate-id.ts` and `id-prefix.type.ts`
- Updated `app.module.ts` importing `PrismaModule`
- Updated `package.json` with Prisma deps and migration scripts
- New onboarding doc `docs/00-overview/local-database-setup.md`

## Persistence Learning Goals

By the end of this sprint, the project should demonstrate:

- Prisma schema modeling for a non-trivial domain.
- Enum sync between Prisma and TypeScript.
- `PrismaService` lifecycle in NestJS (`OnModuleInit`, `OnModuleDestroy`).
- `@Global()` module pattern for cross-cutting providers.
- Local-first DB workflow with Docker Compose.
- Prisma migration workflow (`migrate dev`, `migrate deploy`).

## Out of Scope (Explicit)

- JWT issuance, password hashing, login flow → Sprint 10.
- Service method implementation → Sprint 10+.
- Seed data beyond a minimal smoke check → later.
- Test fixtures and integration test database → later.
- Production migration and deployment strategy → later.
- AuditLog model → deferred per product vision.

## Definition of Done

Sprint 9 is complete when:

- `docker compose up -d` starts Postgres locally and the connection works from the app.
- `prisma/schema.prisma` defines all 9 models + 11 enums listed above.
- All Prisma enums are verified to match the corresponding TypeScript enum sets.
- `prisma migrate dev --name init` produces a committed migration.
- `PrismaService` is importable and used in at least one smoke check (e.g. a temporary log in `main.ts` or a health endpoint, removed before sprint close).
- `npm run build` is green.
- Swagger UI still loads with no contract regression.
- Onboarding doc explains: install dependencies → start docker → set env → run migration → start app.
- ID prefix helper exists and is documented in the onboarding doc.
