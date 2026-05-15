# Sprint 11: Organizations Real Implementation

## Sprint Goal

Replace `OrganizationsService` stubs with real persisted logic against Prisma. Establish the per-module RBAC pattern that future module sprints will copy. Validate that the `@CurrentUser()` + global `JwtAuthGuard` foundation from Sprint 10 holds up under non-trivial authorization rules.

## Why This Sprint Exists

Organizations is the natural module to implement first after auth because:

- It's the parent container for everything else (competitions, participants, matches, brackets all live under an organization).
- It introduces the first cross-table write (`Organization` + `OrganizationMember` in one transaction).
- It exercises three authorization patterns: "any authenticated user" (create), "member of resource" (read), and "specific roles within resource" (write).
- The pattern established here will be copied for `competitions`, `participants`, `matches`, `standings`, `brackets`.

## Sprint Scope

This sprint focuses on:

- Real `OrganizationsService` for the 4 existing endpoints.
- Per-org RBAC enforced inside the service (using the authenticated user from `@CurrentUser()`).
- Transactional create (Organization + OrganizationMember in one `$transaction`).
- Adding a new `OrgRolesService` (or inline helper) to centralize "compute current user role for org" logic.
- Minor contract DTO adjustments where the stub examples diverge from real persistence (`currentUserRole` nullability for SUPER_ADMIN, `id` example prefix fix).

This sprint does NOT include:

- Update / delete / archive organization endpoints (not in current contract).
- List members / remove member endpoints (not in current contract).
- Pagination, sorting, search.
- Email invitation flow (members are added directly by existing-user email lookup).
- Audit log entries.
- Any service implementation in other modules.

## Authorization Rules (Locked)

| Endpoint | Allowed | 403 if |
| --- | --- | --- |
| `POST /organizations` | Any authenticated user | — |
| `GET /organizations` | Any authenticated user | — (returns only orgs user is member of; SUPER_ADMIN sees all) |
| `GET /organizations/{id}` | Member of org OR SUPER_ADMIN | Authenticated user is not a member and not SUPER_ADMIN |
| `POST /organizations/{id}/members` | Member with role OWNER or ADMIN OR SUPER_ADMIN | Member but role is MEMBER, or not a member |

Authorization checks live in the **service layer**, not the controller. Controllers stay thin (per [project-api-contract-conventions](../../memory/project_api_contract_conventions.md) — clean controllers).

SUPER_ADMIN bypasses all per-org checks. This is the project-wide convention going forward.

## Mid-flight Contract Adjustments (Pre-locked)

These adjustments are made because the stub-era examples don't match real persistence:

1. **`OrganizationDto.currentUserRole`** changes from required to nullable. Reason: SUPER_ADMIN viewing an org they're not a member of has no natural role value. Returning `null` is honest; faking a value is misleading. Stub responses that always returned `OWNER` are replaced.

2. **`OrganizationMemberDto.id` example** changes from `mem_123` to `om_<nanoid>` to match the actual prefix from [id-prefix.ts](../../src/common/ids/id-prefix.ts).

3. **`organization-contract.md`** is updated to note the nullable field and the role-prefix fix.

These are documented in story 11.5 below — they're not "scope creep" but the natural cost of moving from stub to real.

## User Stories

### Story 11.1: Authenticated user creates an organization

As an authenticated user,
I want to create an organization,
so that I can manage competitions under it.

Acceptance criteria:

- `POST /api/v1/organizations` requires Bearer token (already enforced by global guard).
- `name` is required and unique-per-owner is NOT enforced (two users can create orgs with the same name; not flagged by the contract).
- `description` is optional.
- The creator is inserted into `OrganizationMember` with role `ORGANIZATION_OWNER` in the same transaction as the `Organization` row.
- Response: 201 with `OrganizationDto` and `currentUserRole = ORGANIZATION_OWNER`.
- Validation failure → 400 (existing pipe).
- Database failure rolls back both inserts.

### Story 11.2: List accessible organizations

As an authenticated user,
I want to see organizations I can access,
so that I can pick where to manage competitions.

Acceptance criteria:

- `GET /api/v1/organizations` returns:
  - All orgs where the authenticated user has any `OrganizationMember` row, OR
  - All orgs in the system if the user is `SUPER_ADMIN`.
- Each org item includes the `currentUserRole` for the requester (`null` if SUPER_ADMIN sees an org they're not a member of).
- Response: 200 with array of `OrganizationDto`.
- Empty array if user has no memberships and is not SUPER_ADMIN.

### Story 11.3: Get organization detail

As an organization member,
I want to view organization detail,
so that I can confirm profile and my access level.

Acceptance criteria:

- `GET /api/v1/organizations/{organizationId}` returns the org if requester is a member or SUPER_ADMIN.
- Returns 403 if requester is authenticated but not a member and not SUPER_ADMIN. (Not 404 — info leak prevention; the existence/non-existence of an org should not be discoverable by non-members.)
- Returns 404 if the org genuinely doesn't exist (only after auth check passes — not exploitable for enumeration because non-members get 403 before lookup result is leaked).
- Response includes `currentUserRole` (or `null` for SUPER_ADMIN non-member).

### Story 11.4: Authorized user adds a member

As an organization owner or admin,
I want to add a member by email,
so that another existing user can help manage the org.

Acceptance criteria:

- `POST /api/v1/organizations/{organizationId}/members` requires the requester to be `ORGANIZATION_OWNER` or `ORGANIZATION_ADMIN` in that org, OR `SUPER_ADMIN`.
- Request body: `{ email, role }` where `role ∈ {ORGANIZATION_OWNER, ORGANIZATION_ADMIN, ORGANIZATION_MEMBER}`.
- The target user is looked up by email. 404 if user not found.
- 409 if user is already a member of this org (regardless of existing role).
- 403 if requester does not have the required role.
- 404 if the organization itself doesn't exist (after auth check).
- Multiple OWNERs are allowed — the schema and contract don't prohibit it.
- Response: 201 with `OrganizationMemberDto` (id starts with `om_`).

### Story 11.5: DTO and contract doc reflect real persistence

As a frontend developer,
I want the contract examples to match real responses,
so that the documentation is trustworthy.

Acceptance criteria:

- `OrganizationDto.currentUserRole` is decorated with `@ApiPropertyOptional` and typed `OrganizationRole | null`.
- `OrganizationMemberDto.id` example is `om_<nanoid>` (or a representative `om_xxx` short form).
- `docs/03-api-contract/organization-contract.md` updated to reflect nullable field.
- Swagger UI renders the updated examples cleanly.

## Implementation Pattern (For Reuse in Later Module Sprints)

The pattern established here:

1. **Controller** stays thin — only `@CurrentUser()` extraction and service delegation.
2. **Service** receives the authenticated user as a parameter, performs auth checks, then performs the data operation.
3. **Auth checks** are inline in the service for now. Once we have 3+ modules with similar checks, extract to an `AuthorizationService` or guard helpers (Sprint 13+ refactor candidate).
4. **Cross-table writes** use `prisma.db.$transaction([...])` or interactive `$transaction(async tx => ...)` if conditional logic is needed.
5. **Errors** thrown as Nest exceptions (`ForbiddenException`, `NotFoundException`, `ConflictException`) with the standard envelope payload.

## Deliverables

**Modified files:**

- `src/modules/organizations/organizations.service.ts` — real impl
- `src/modules/organizations/organizations.controller.ts` — add `@CurrentUser()`
- `src/modules/organizations/dto/organization.dto.ts` — `currentUserRole` nullable
- `src/modules/organizations/dto/organization-member.dto.ts` — `id` example fix
- `docs/03-api-contract/organization-contract.md` — note nullability + prefix fix
- `docs/02-scrum/sprint-11.md` — this file

**New files:** none (no new modules; all primitives from Sprint 9/10 are reused).

**No new migration:** Sprint 9 schema covers everything.

## Manual Smoke Test (DoD check)

```sh
# Setup: register two users
curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"Password123!"}'
curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","email":"bob@example.com","password":"Password123!"}'

# Login both
ALICE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Password123!"}' \
  | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
BOB=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@example.com","password":"Password123!"}' \
  | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

# 1. Alice creates org → 201, currentUserRole = ORGANIZATION_OWNER
ORG_ID=$(curl -s -X POST http://localhost:3000/api/v1/organizations \
  -H "Authorization: Bearer $ALICE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Garuda FC","description":"Community futsal"}' \
  | grep -o '"id":"org_[^"]*"' | cut -d'"' -f4)

# 2. Alice lists orgs → 200, contains ORG_ID
curl -s http://localhost:3000/api/v1/organizations -H "Authorization: Bearer $ALICE"

# 3. Bob lists orgs → 200, empty array (not yet a member)
curl -s http://localhost:3000/api/v1/organizations -H "Authorization: Bearer $BOB"

# 4. Bob tries to GET Alice's org → 403
curl -s http://localhost:3000/api/v1/organizations/$ORG_ID -H "Authorization: Bearer $BOB" -w "\nHTTP %{http_code}\n"

# 5. Bob tries to add a member to Alice's org → 403
curl -s -X POST http://localhost:3000/api/v1/organizations/$ORG_ID/members \
  -H "Authorization: Bearer $BOB" \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@example.com","role":"ORGANIZATION_MEMBER"}' \
  -w "\nHTTP %{http_code}\n"

# 6. Alice adds Bob as ADMIN → 201
curl -s -X POST http://localhost:3000/api/v1/organizations/$ORG_ID/members \
  -H "Authorization: Bearer $ALICE" \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@example.com","role":"ORGANIZATION_ADMIN"}' \
  -w "\nHTTP %{http_code}\n"

# 7. Alice adds Bob again → 409 (already member)
curl -s -X POST http://localhost:3000/api/v1/organizations/$ORG_ID/members \
  -H "Authorization: Bearer $ALICE" \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@example.com","role":"ORGANIZATION_MEMBER"}' \
  -w "\nHTTP %{http_code}\n"

# 8. Alice adds non-existent user → 404
curl -s -X POST http://localhost:3000/api/v1/organizations/$ORG_ID/members \
  -H "Authorization: Bearer $ALICE" \
  -H "Content-Type: application/json" \
  -d '{"email":"ghost@example.com","role":"ORGANIZATION_MEMBER"}' \
  -w "\nHTTP %{http_code}\n"

# 9. Bob (now ADMIN) GETs the org → 200, currentUserRole = ORGANIZATION_ADMIN
curl -s http://localhost:3000/api/v1/organizations/$ORG_ID -H "Authorization: Bearer $BOB"

# 10. Bob (ADMIN) adds another member → 201
curl -s -X POST http://localhost:3000/api/v1/organizations/$ORG_ID/members \
  -H "Authorization: Bearer $BOB" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","role":"ORGANIZATION_MEMBER"}' \
  -w "\nHTTP %{http_code}\n"
# Expect 409 (Alice is already a member as OWNER)
```

## Definition of Done

Sprint 11 is complete when:

- All 10 manual smoke test steps produce the expected status codes.
- `npm run build` is green.
- `OrganizationsService` no longer returns hardcoded data.
- DTO + contract doc adjustments shipped (story 11.5).
- Swagger UI loads, examples render correctly.
- Pattern is documented above so Sprint 12+ can copy it.

## Implementation Order (Execution Plan)

1. Update `OrganizationDto` to make `currentUserRole` nullable; update `OrganizationMemberDto` id example. Build verify.
2. Update `OrganizationsService` — write all 4 methods. Build verify.
3. Update `OrganizationsController` — pass `@CurrentUser()` to service. Build verify.
4. Update `organization-contract.md` to reflect DTO change.
5. Run full smoke test sequence against fresh DB.
6. Capture any drift discovered, patch, re-test.
