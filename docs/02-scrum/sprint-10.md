# Sprint 10: Real Authentication

## Sprint Goal

Replace the `AuthService` stub with a real implementation backed by the database from Sprint 9. Issue and verify JWTs. Wire a global `JwtAuthGuard` with `@Public()` opt-out so future module sprints inherit authentication for free.

This sprint is the first step on the implementation priority list ([project-implementation-priorities](../../memory/project_implementation_priorities.md), step 4) and unblocks every module sprint after it.

## Why This Sprint Exists

Sprint 9 delivered a database and a Prisma client. The 7 modules now have persistence available, but every service still returns hardcoded stub data. Authentication is the natural first module to replace because:

- Every other protected endpoint depends on knowing "who is the current user."
- The `User` model already exists in the schema.
- Auth has the smallest data dependencies (just `User`).
- Wiring the global guard now means future module sprints don't need to remember `@UseGuards(JwtAuthGuard)`.

## Sprint Scope

This sprint focuses on:

- Real `AuthService` for `/register`, `/login`, `/me` against the DB.
- `bcrypt` for password hashing.
- JWT issuance and verification via `@nestjs/jwt` + `@nestjs/passport` + `passport-jwt`.
- A `JwtAuthGuard` wired globally as `APP_GUARD`.
- A `@Public()` decorator to opt-out specific routes (`/register`, `/login`).
- A `@CurrentUser()` decorator to extract the authenticated user in controllers.
- `@nestjs/config` with required-env validation (boot fails if `JWT_SECRET` missing).
- Manual smoke test via `curl`.

This sprint does NOT include:

- RBAC / role checks (Sprint 11+ per module).
- Refresh tokens.
- Password reset / forgot-password flow.
- Email verification.
- Account lockout / brute-force protection / rate limiting.
- Service implementation for non-auth modules — they remain stubs but now require a valid JWT to reach.
- Automated unit/integration tests beyond a manual smoke check (separate later sprint).
- Renaming existing `currentUserRole`/example fields in stub services — left as-is.

## Side Effect of Global Guard

After this sprint, every endpoint in `organizations`, `competitions`, `participants`, `matches`, `standings`, `brackets` will require a valid Bearer token to reach the controller — even though the underlying service still returns placeholder data.

This is intentional: it makes the auth boundary explicit and prevents stub endpoints from being publicly callable. The placeholders inside those services do not change in this sprint.

## Tech Decisions (Locked)

| Decision | Choice | Rationale |
| --- | --- | --- |
| Password hash | `bcryptjs` | Pure-JS, identical API to `bcrypt`, no native build (avoids node-gyp/python/msbuild on Windows). Slightly slower than native but imperceptible for login flow. Argon2 deferred (more secure but bigger build complexity). |
| JWT lib | `@nestjs/jwt` + `@nestjs/passport` + `passport-jwt` | NestJS-idiomatic; plays cleanly with guards/strategies. |
| JWT payload | `{ sub: userId, email, role }` | Allows future RBAC checks without an extra DB hit. Trade-off: role changes require re-login or token expiry. |
| Token strategy | Access token only | Matches existing contract `LoginResponseDataDto` (no refresh field). Refresh is its own future sprint. |
| Token expiry | `JWT_EXPIRES_IN` env, default `1d` | Dev-friendly default; production tunes. |
| Env config | `@nestjs/config` with `class-validator` schema | Boot fails fast if `JWT_SECRET` missing or short. |
| Guard wiring | Global via `APP_GUARD` | Per Sprint 10 scope answer — less footgun in future sprints. |

## User Stories

### Story 10.1: Register persists a user

As a new user,
I want my registration to create a real database row,
so that I can later log in.

Acceptance criteria:

- `POST /api/v1/auth/register` hashes the password with `bcrypt` and inserts a `User` row via `PrismaService`.
- The response returns `UserProfileDto` (id, name, email, role) — no password hash, no token.
- A duplicate email returns `409 Conflict` with the existing `Email already exists` error shape.
- Validation failures still return `400 Bad Request` via the existing pipe.
- The new user's `role` defaults to `USER` (per the `GlobalUserRole` enum).
- The endpoint is `@Public()` — no token required.

### Story 10.2: Login issues a real JWT

As a registered user,
I want `/login` to return a JWT I can use on protected endpoints,
so that subsequent requests can identify me.

Acceptance criteria:

- `POST /api/v1/auth/login` looks up the user by email and verifies the password with `bcrypt.compare`.
- On success: returns `{ accessToken, user }` where `accessToken` is a signed JWT and `user` is `UserProfileDto`.
- JWT payload is `{ sub: userId, email, role }`. Signed with `JWT_SECRET`. Expires per `JWT_EXPIRES_IN`.
- Invalid email or wrong password returns `401 Unauthorized` with description `Invalid email or password` (already wired in [auth.swagger.ts](../../src/modules/auth/docs/auth.swagger.ts)).
- The endpoint is `@Public()` — no token required.

### Story 10.3: Authenticated user fetches their profile

As an authenticated user,
I want `GET /api/v1/auth/me` to return my own profile,
so that the client can confirm which account is active.

Acceptance criteria:

- The endpoint requires a valid JWT — no `@Public()`.
- `JwtStrategy.validate` parses the payload and returns the current user data attached to the request.
- The controller uses `@CurrentUser()` to receive the authenticated user.
- `AuthService.getMe(userId)` reads the latest `User` row from DB (so renamed/role-changed users see fresh data).
- Returns `UserProfileDto`.
- Missing/invalid/expired token returns `401 Unauthorized`.
- If the user was deleted between issuance and request, returns `401` (treat as invalid token).

### Story 10.4: Project has reusable auth primitives

As a backend developer building future modules,
I want a `JwtAuthGuard`, `@Public()`, and `@CurrentUser()` available globally,
so that I never re-implement these basics.

Acceptance criteria:

- `src/common/auth/jwt-auth.guard.ts` — extends `AuthGuard('jwt')`, respects `@Public()` via `Reflector`.
- `src/common/auth/public.decorator.ts` — `SetMetadata('isPublic', true)`.
- `src/common/auth/current-user.decorator.ts` — `createParamDecorator` returning `request.user`.
- `src/common/auth/jwt.strategy.ts` — `passport-jwt` strategy reading from `Authorization: Bearer <token>`.
- `src/common/auth/jwt-payload.type.ts` — typed payload `{ sub: string; email: string; role: GlobalUserRole }`.
- `JwtAuthGuard` is registered globally via `APP_GUARD` in `AppModule`.

### Story 10.5: Env config layer with required-var validation

As a backend developer,
I want the app to fail to boot if a required env var is missing,
so that misconfigured environments are caught immediately.

Acceptance criteria:

- `@nestjs/config` is registered as `ConfigModule.forRoot({ isGlobal: true, validate })`.
- `src/common/config/env.validation.ts` defines an `EnvSchema` class with `class-validator` decorators for `DATABASE_URL`, `JWT_SECRET` (min length 32), `JWT_EXPIRES_IN` (string, default `1d`), `PORT` (int, default 3000).
- A missing or short `JWT_SECRET` causes boot to throw with a clear error.
- `JwtModule.registerAsync` uses `ConfigService` to read the secret and expiry at registration time.

## Deliverables

**New files:**

- `src/common/auth/jwt-auth.guard.ts`
- `src/common/auth/jwt.strategy.ts`
- `src/common/auth/jwt-payload.type.ts`
- `src/common/auth/current-user.decorator.ts`
- `src/common/auth/public.decorator.ts`
- `src/common/config/env.validation.ts`

**Modified files:**

- `src/modules/auth/auth.service.ts` — real implementation
- `src/modules/auth/auth.module.ts` — import `JwtModule.registerAsync`, `PassportModule`
- `src/modules/auth/auth.controller.ts` — `@Public()` on register/login, `@CurrentUser()` on `/me`
- `src/app.module.ts` — `ConfigModule.forRoot`, `APP_GUARD` provider, register `JwtStrategy` (or via AuthModule)
- `package.json` — add deps + `db:reset` script (handy for Sprint 10 dev cycles)
- `.env`, `.env.example` — `JWT_SECRET`, `JWT_EXPIRES_IN`
- `docs/00-overview/local-database-setup.md` — append "Auth env vars" section

**No new migration:** the `User` model from Sprint 9 already has `passwordHash` + `role`.

## Persistence and Auth Learning Goals

By the end of this sprint, the project should demonstrate:

- `bcrypt.hash` / `bcrypt.compare` for password storage and verification.
- `@nestjs/jwt` registration via `JwtModule.registerAsync` reading from `ConfigService`.
- `passport-jwt` strategy with custom `validate(payload)`.
- Global guard via `APP_GUARD` with `@Public()` opt-out using `Reflector`.
- `@CurrentUser()` custom param decorator.
- Detecting Prisma unique constraint violations (`P2002`) and converting them to `ConflictException`.
- Validating env config at boot time with `class-validator`.

## Manual Smoke Test (Definition of Done check)

After implementation, run the following sequence and verify each step:

```sh
# 1. Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Suci","email":"suci@example.com","password":"Password123!"}'
# expect 201 with data.id starting with "usr_"

# 2. Register duplicate → 409
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Suci","email":"suci@example.com","password":"Password123!"}'
# expect 409 with "Email already exists"

# 3. Login wrong password → 401
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"suci@example.com","password":"WrongPassword!"}'
# expect 401 with "Invalid email or password"

# 4. Login correct → JWT
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"suci@example.com","password":"Password123!"}'
# expect 200 with data.accessToken and data.user

# 5. /me without token → 401
curl http://localhost:3000/api/v1/auth/me
# expect 401

# 6. /me with token → profile
TOKEN="<paste accessToken from step 4>"
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
# expect 200 with the registered user

# 7. Protected stub endpoint without token → 401
curl http://localhost:3000/api/v1/organizations
# expect 401 (because of global JwtAuthGuard)

# 8. Protected stub endpoint with token → 200 stub data
curl http://localhost:3000/api/v1/organizations \
  -H "Authorization: Bearer $TOKEN"
# expect 200 with hardcoded stub list
```

## Definition of Done

Sprint 10 is complete when:

- All 8 manual smoke test steps pass.
- `npm run build` is green.
- App boots without `JWT_SECRET` set → fails fast with a clear validation error.
- App boots with `JWT_SECRET` set → `[PrismaService] Connected to database` followed by `Nest application successfully started`.
- `User.passwordHash` in the DB never contains plaintext (verify by reading one row in Prisma Studio).
- Swagger UI still loads. Existing contract decorators on `/register`, `/login`, `/me` are unchanged.
- Onboarding doc lists the new env vars.

## Implementation Order (Execution Plan)

The order below minimizes broken intermediate states.

1. Install deps and add env vars (build still green; nothing is wired yet).
2. Add `EnvSchema` + `ConfigModule.forRoot({ validate })` in `AppModule`. Boot to confirm validation works.
3. Add JWT primitives: `jwt-payload.type.ts`, `public.decorator.ts`, `current-user.decorator.ts`. (No runtime effect yet — pure types/decorators.)
4. Add `JwtStrategy` and `JwtAuthGuard`.
5. Update `AuthModule` to import `JwtModule.registerAsync` + `PassportModule`, register `JwtStrategy`.
6. Replace `AuthService` register/login/getMe with real implementations. Build + smoke test endpoints individually before global guard.
7. Update `AuthController` — `@Public()` on register/login, `@CurrentUser()` on `/me`.
8. Wire `APP_GUARD` globally in `AppModule`.
9. Run full smoke test sequence.
10. Update onboarding doc.
