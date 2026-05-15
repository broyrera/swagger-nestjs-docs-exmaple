# Local Database Setup

This guide explains how to run Lawan PMO Sports against a local PostgreSQL database using Docker Compose and Prisma.

## Prerequisites

- Node.js (project tested with v24)
- Docker Desktop running (`docker --version`, `docker compose version`)
- Repo cloned and `npm install` finished

## One-time setup

1. Copy `.env.example` to `.env`:

   ```sh
   cp .env.example .env
   ```

   The default `DATABASE_URL` points at `localhost:5433`. Host port 5433 is used (not the default 5432) to avoid conflicting with any Postgres already running on the developer machine. The container itself still listens on 5432 internally.

   The `.env` also defines:

   | Var | Purpose |
   | --- | --- |
   | `JWT_SECRET` | Signing key for access tokens. **Must be at least 32 characters.** App fails to boot if missing or shorter. Replace the dev placeholder with a random string for any non-local environment. |
   | `JWT_EXPIRES_IN` | Access token lifetime. Accepts `ms`-style strings (e.g. `1d`, `12h`, `30m`). Default `1d`. |
   | `PORT` | App listen port. Default `3000`. |

   Env validation runs at boot via [src/common/config/env.validation.ts](../../src/common/config/env.validation.ts). Misconfiguration produces a clear error like `Invalid environment configuration: JWT_SECRET must be at least 32 characters long`.

2. Start the Postgres container:

   ```sh
   npm run db:up
   ```

   This launches the `lawan-pmo-postgres` container with a named volume so data persists across restarts.

3. Run the initial migration:

   ```sh
   npm run prisma:migrate
   ```

   This applies all migrations in `prisma/migrations/` and (re)generates the Prisma client.

4. Start the API:

   ```sh
   npm run start:dev
   ```

   You should see `[PrismaService] Connected to database` in the log right before `Nest application successfully started`.

## Daily workflow

| Task | Command |
| --- | --- |
| Start the database | `npm run db:up` |
| Stop the database | `npm run db:down` |
| Tail the database logs | `npm run db:logs` |
| Apply pending migrations | `npm run prisma:migrate` |
| Regenerate Prisma client only | `npm run prisma:generate` |
| Open Prisma Studio (DB GUI) | `npm run prisma:studio` |

The container data lives in the `lawan_pmo_postgres_data` named volume. Removing the container does NOT remove the data. To wipe completely:

```sh
docker compose down -v
```

## ID prefix convention

Every model in [prisma/schema.prisma](../../prisma/schema.prisma) declares `id String @id` with **no `@default(...)`**. IDs are injected automatically by [src/common/prisma/auto-id.extension.ts](../../src/common/prisma/auto-id.extension.ts) on every `create` / `createMany` / `upsert` call routed through `PrismaService.db`.

Prefixes are defined in [src/common/ids/id-prefix.ts](../../src/common/ids/id-prefix.ts):

| Model | Prefix | Example |
| --- | --- | --- |
| `User` | `usr` | `usr_V1StGXR8_Z5jdHi6B-myT` |
| `Organization` | `org` | `org_...` |
| `OrganizationMember` | `om` | `om_...` |
| `Competition` | `cmp` | `cmp_...` |
| `CompetitionRoleAssignment` | `cra` | `cra_...` |
| `Participant` | `par` | `par_...` |
| `Match` | `mat` | `mat_...` |
| `BracketRound` | `br` | `br_...` |
| `BracketMatch` | `bm` | `bm_...` |

**Always inject `PrismaService` and use `prisma.db.<model>`** — not a raw `PrismaClient`. Bypassing the extension will fail at the DB level (NOT NULL on `id`). This is intentional safety.

Example:

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: { name: string; ownerId: string }) {
    return this.prisma.db.organization.create({ data: input });
    // → row.id = "org_<nanoid>"
  }
}
```

## Authentication (Sprint 10)

All endpoints except `POST /api/v1/auth/register` and `POST /api/v1/auth/login` require a valid `Authorization: Bearer <jwt>` header. The global `JwtAuthGuard` ([src/common/auth/jwt-auth.guard.ts](../../src/common/auth/jwt-auth.guard.ts)) is registered as `APP_GUARD` in `AppModule`.

To opt-out a new public endpoint, decorate the controller method with `@Public()`:

```ts
import { Public } from '../../common/auth/public.decorator';

@Public()
@Get('health')
health() {
  return { ok: true };
}
```

To read the current authenticated user inside a controller:

```ts
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { AuthenticatedUser } from '../../common/auth/jwt-payload.type';

@Get('something')
doSomething(@CurrentUser() user: AuthenticatedUser) {
  return this.someService.doSomething(user.id);
}
```

JWT payload shape is `{ sub: userId, email, role }` — see [src/common/auth/jwt-payload.type.ts](../../src/common/auth/jwt-payload.type.ts). The role is included so future RBAC checks can run without an extra DB hit.

## Schema and enum sync

Prisma enums in [schema.prisma](../../prisma/schema.prisma) mirror the TypeScript enums in `src/modules/*/dto/*.enum.ts`. When adding or changing an enum value:

1. Update the TS enum file.
2. Update the Prisma enum.
3. Run `npm run prisma:migrate` to generate a migration for the change.

There is no automated sync — divergence is caught at code review.

## Troubleshooting

### Port 5433 already allocated

Another Postgres or service is on 5433. Change the host port in `docker-compose.yml`:

```yaml
ports:
  - "5434:5432"
```

…and update `DATABASE_URL` in `.env` to match.

### `Cannot find module '@prisma/client/runtime/...'`

Stale Prisma client install (often after `npm install` interrupted on Windows). Fix:

```sh
npm install @prisma/client@^6 --force
npm run prisma:generate
```

### `prisma migrate dev` says drift detected

Your local DB schema diverged from `prisma/migrations/`. Either reset (wipes data):

```sh
npx prisma migrate reset
```

…or investigate which migration was applied out of band.
