# Sprint 12: Competitions Real Implementation

## Sprint Goal

Replace `CompetitionsService` stubs with real Prisma-backed logic for the 6 contract endpoints. Introduce the `CompetitionRoleAssignment` table into runtime use. Establish lifecycle-transition handling (DRAFT → PUBLISHED → ARCHIVED) as a reusable pattern.

## Why This Sprint Exists

Competitions are the central resource — participants, matches, standings, and brackets all live inside one. Without real competitions, every remaining module sprint is blocked.

This sprint also exercises:

- Two-tier RBAC (organization role + competition role).
- Visibility filtering (PUBLIC vs PRIVATE).
- Lifecycle state machine (DRAFT/PUBLISHED/ARCHIVED) with 409 on invalid transitions.

## Sprint Scope

This sprint focuses on:

- Real `CompetitionsService` for 6 endpoints (create, list, get, update, publish, archive).
- Per-org and per-competition RBAC enforced inside the service.
- Transactional create (Competition + CompetitionRoleAssignment with role COMPETITION_OWNER for the creator).
- Visibility-aware list/get (PUBLIC visible to any auth user; PRIVATE visible to org members or competition role assignees).
- Lifecycle state machine (DRAFT/PUBLISHED/ARCHIVED) with explicit transition rules.

This sprint does NOT include:

- Endpoints for managing competition role assignments (no contract endpoint exists yet — future sprint).
- Delete competition (not in contract).
- Update/republish after archive (treat ARCHIVED as terminal).
- Score-related logic (Sprint 14+).
- Pagination, sorting, search.
- `@Public()` exemption for PUBLIC competition viewing — kept behind auth per contract ("Auth Required: Yes" for all 6).
- `currentUserRole` field on `CompetitionDto` — not in contract, no mid-flight DTO change.

## Authorization Rules (Locked)

| Endpoint | Allowed |
| --- | --- |
| `POST /competitions` | `ORG_OWNER` or `ORG_ADMIN` of target org, or `SUPER_ADMIN` |
| `GET /competitions` (list) | Any auth user; results filtered by visibility rules below |
| `GET /competitions/{id}` | Visible per visibility rules (else 403) |
| `PATCH /competitions/{id}` | `ORG_OWNER`/`ORG_ADMIN`, or `COMP_OWNER`/`COMP_ADMIN`, or `SUPER_ADMIN` |
| `PATCH /publish` | Same as update |
| `PATCH /archive` | Same as update |

**Visibility rules (for read access):**

A user can see a competition if any of the following is true:

1. User is `SUPER_ADMIN`.
2. Competition `visibility = PUBLIC`.
3. User is a member of the competition's organization (any org role).
4. User has any `CompetitionRoleAssignment` for this competition.

**Manage rules (for write/lifecycle):**

A user can manage a competition if any of the following is true:

1. User is `SUPER_ADMIN`.
2. User is `ORG_OWNER` or `ORG_ADMIN` of the competition's organization.
3. User has `COMP_OWNER` or `COMP_ADMIN` role for this competition.

(`SCORE_ADMIN` is excluded from management — it's reserved for score endpoints in Sprint 14+.)

## Lifecycle State Machine (Locked)

| From | publish → | archive → | update |
| --- | --- | --- | --- |
| `DRAFT` | `PUBLISHED` ✓ | `ARCHIVED` ✓ | allowed |
| `PUBLISHED` | 409 (already published) | `ARCHIVED` ✓ | **409** (not allowed after publish) |
| `ARCHIVED` | 409 (terminal) | 409 (already archived) | 409 (terminal) |

**Reasoning for "DRAFT-only update":** Once a competition is published, participants/matches/brackets can be created against it. Allowing arbitrary edits to type/format/visibility post-publish would invalidate downstream data. The contract `409 Conflict` slot is the natural place to enforce this. If the project later wants to allow some fields (e.g. `description`) to be edited post-publish, that's a follow-up sprint with a clearer requirement.

## On Create: Two-Row Transaction

```ts
prisma.db.$transaction(async (tx) => {
  const cmp = await tx.competition.create({ data: { ...input } });
  await tx.competitionRoleAssignment.create({
    data: {
      competitionId: cmp.id,
      userId: currentUser.id,
      role: CompetitionRole.COMPETITION_OWNER,
    },
  });
  return cmp;
});
```

Creator always becomes `COMPETITION_OWNER`, even if they're already `ORG_OWNER` of the parent. Multiple competition owners are allowed (consistent with multiple-org-owners decision from Sprint 11).

## Error Mapping

| Situation | Status |
| --- | --- |
| Validation failure | 400 (existing pipe) |
| Missing/invalid token | 401 (existing guard) |
| Authorized but no permission for this op | 403 |
| Org not found on create | 404 |
| Competition not found on get/update/publish/archive | 404 (after auth check passes) |
| Non-member trying to GET PRIVATE competition | 403 (info-leak prevention; no 404 enumeration) |
| Invalid lifecycle transition (publish/archive/update on wrong state) | 409 |

**Info-leak note:** for `GET /competitions/{id}`, if the competition is PRIVATE and the user isn't authorized to see it, return 403 — same as the org pattern. If the competition genuinely doesn't exist, also 403 (not 404) for non-SUPER_ADMINs to prevent ID enumeration. SUPER_ADMIN gets a real 404 because they have global visibility.

## User Stories

### Story 12.1: Authorized user creates a competition

Acceptance criteria:

- `POST /competitions` requires `ORG_OWNER`/`ORG_ADMIN` of `organizationId` or `SUPER_ADMIN`.
- Body validates per existing `CreateCompetitionRequestDto` (already covers all enums via `class-validator`).
- Returns 201 + `CompetitionDto` with `status = DRAFT`.
- Creator inserted as `COMPETITION_OWNER` in same transaction.
- Non-existent `organizationId` → 404.
- Insufficient role on existing org → 403.

### Story 12.2: List accessible competitions with visibility filter

Acceptance criteria:

- `GET /competitions` returns competitions visible to the requester per visibility rules.
- Optional query filters (`organizationId`, `type`, `format`, `status`) AND'd with visibility filter.
- 200 + array of `CompetitionDto`. Empty array if nothing visible.
- Sorted by `createdAt desc` (not in contract, but useful default; document in code).

### Story 12.3: Get competition detail

Acceptance criteria:

- `GET /competitions/{competitionId}` returns 200 + `CompetitionDto` if visible.
- Returns 403 if competition is PRIVATE and user isn't authorized (or if competition doesn't exist for non-SUPER_ADMIN).
- SUPER_ADMIN gets 404 for non-existent competition.

### Story 12.4: Authorized user updates a DRAFT competition

Acceptance criteria:

- `PATCH /competitions/{competitionId}` requires manage permission (per rules above).
- Body validates per existing `UpdateCompetitionRequestDto` (all fields optional).
- Allowed only if `status = DRAFT`. Otherwise 409.
- 404 if competition not found (after auth check).
- 200 + updated `CompetitionDto`.

### Story 12.5: Publish a draft competition

Acceptance criteria:

- `PATCH /competitions/{competitionId}/publish` requires manage permission.
- Allowed only from `DRAFT`. Otherwise 409.
- 200 + `CompetitionDto` with `status = PUBLISHED`.

### Story 12.6: Archive a competition

Acceptance criteria:

- `PATCH /competitions/{competitionId}/archive` requires manage permission.
- Allowed from `DRAFT` or `PUBLISHED`. From `ARCHIVED` → 409.
- 200 + `CompetitionDto` with `status = ARCHIVED`.

## Deliverables

**Modified files:**

- `src/modules/competitions/competitions.service.ts` — real impl
- `src/modules/competitions/competitions.controller.ts` — pass `@CurrentUser()` to all 6 methods
- `docs/02-scrum/sprint-12.md` — this file

**No DTO changes:** existing `CompetitionDto`/`CreateCompetitionRequestDto`/`UpdateCompetitionRequestDto`/`ListCompetitionsQueryDto` already match the schema and contract examples (no `mem_123`-style mismatches).

**No new migration:** Sprint 9 schema covers everything.

## Manual Smoke Test (DoD)

```sh
# Setup: register Alice (org owner), Bob (org member), Charlie (outsider)
for u in alice bob charlie; do
  curl -s -X POST http://localhost:3000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$u\",\"email\":\"$u@example.com\",\"password\":\"Password123!\"}" >/dev/null
done

ALICE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"Password123!"}' | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
BOB=$(curl -s -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"bob@example.com","password":"Password123!"}' | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
CHARLIE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"charlie@example.com","password":"Password123!"}' | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

# Alice creates org, adds Bob as MEMBER
ORG=$(curl -s -X POST http://localhost:3000/api/v1/organizations -H "Authorization: Bearer $ALICE" -H "Content-Type: application/json" -d '{"name":"Test Org"}' | grep -o '"id":"org_[^"]*"' | cut -d'"' -f4)
curl -s -X POST http://localhost:3000/api/v1/organizations/$ORG/members -H "Authorization: Bearer $ALICE" -H "Content-Type: application/json" -d '{"email":"bob@example.com","role":"ORGANIZATION_MEMBER"}' >/dev/null

# 1. Alice (ORG_OWNER) creates PRIVATE competition → 201
CMP=$(curl -s -X POST http://localhost:3000/api/v1/competitions -H "Authorization: Bearer $ALICE" -H "Content-Type: application/json" -d "{\"organizationId\":\"$ORG\",\"name\":\"Private Cup\",\"type\":\"SPORT\",\"format\":\"KNOCKOUT\",\"visibility\":\"PRIVATE\"}" | grep -o '"id":"cmp_[^"]*"' | cut -d'"' -f4)
echo "CMP=$CMP"

# 2. Alice creates PUBLIC competition → 201
PUB=$(curl -s -X POST http://localhost:3000/api/v1/competitions -H "Authorization: Bearer $ALICE" -H "Content-Type: application/json" -d "{\"organizationId\":\"$ORG\",\"name\":\"Public Cup\",\"type\":\"SPORT\",\"format\":\"ROUND_ROBIN\",\"visibility\":\"PUBLIC\"}" | grep -o '"id":"cmp_[^"]*"' | cut -d'"' -f4)
echo "PUB=$PUB"

# 3. Bob (ORG_MEMBER) creates competition under same org → 403 (only OWNER/ADMIN can create)
curl -s -X POST http://localhost:3000/api/v1/competitions -H "Authorization: Bearer $BOB" -H "Content-Type: application/json" -d "{\"organizationId\":\"$ORG\",\"name\":\"Bob Cup\",\"type\":\"SPORT\",\"format\":\"KNOCKOUT\",\"visibility\":\"PUBLIC\"}" -w "\nHTTP %{http_code}\n"

# 4. Charlie (outsider) creates competition under Alice's org → 403
curl -s -X POST http://localhost:3000/api/v1/competitions -H "Authorization: Bearer $CHARLIE" -H "Content-Type: application/json" -d "{\"organizationId\":\"$ORG\",\"name\":\"Charlie Cup\",\"type\":\"SPORT\",\"format\":\"KNOCKOUT\",\"visibility\":\"PUBLIC\"}" -w "\nHTTP %{http_code}\n"

# 5. Alice creates competition under non-existent org → 404
curl -s -X POST http://localhost:3000/api/v1/competitions -H "Authorization: Bearer $ALICE" -H "Content-Type: application/json" -d '{"organizationId":"org_nope","name":"X","type":"SPORT","format":"KNOCKOUT","visibility":"PUBLIC"}' -w "\nHTTP %{http_code}\n"

# 6. Charlie lists competitions → only PUBLIC visible
curl -s http://localhost:3000/api/v1/competitions -H "Authorization: Bearer $CHARLIE"

# 7. Bob lists competitions → both visible (org member sees PRIVATE)
curl -s http://localhost:3000/api/v1/competitions -H "Authorization: Bearer $BOB"

# 8. Charlie GETs PRIVATE competition → 403
curl -s http://localhost:3000/api/v1/competitions/$CMP -H "Authorization: Bearer $CHARLIE" -w "\nHTTP %{http_code}\n"

# 9. Charlie GETs PUBLIC competition → 200
curl -s http://localhost:3000/api/v1/competitions/$PUB -H "Authorization: Bearer $CHARLIE" -w "\nHTTP %{http_code}\n"

# 10. Bob (ORG_MEMBER) tries to update DRAFT comp → 403 (only OWNER/ADMIN can manage)
curl -s -X PATCH http://localhost:3000/api/v1/competitions/$CMP -H "Authorization: Bearer $BOB" -H "Content-Type: application/json" -d '{"name":"Hijacked"}' -w "\nHTTP %{http_code}\n"

# 11. Alice updates DRAFT → 200
curl -s -X PATCH http://localhost:3000/api/v1/competitions/$CMP -H "Authorization: Bearer $ALICE" -H "Content-Type: application/json" -d '{"description":"Updated"}' -w "\nHTTP %{http_code}\n"

# 12. Alice publishes DRAFT → 200, status=PUBLISHED
curl -s -X PATCH http://localhost:3000/api/v1/competitions/$CMP/publish -H "Authorization: Bearer $ALICE" -w "\nHTTP %{http_code}\n"

# 13. Alice publishes again → 409
curl -s -X PATCH http://localhost:3000/api/v1/competitions/$CMP/publish -H "Authorization: Bearer $ALICE" -w "\nHTTP %{http_code}\n"

# 14. Alice updates PUBLISHED → 409 (DRAFT-only update rule)
curl -s -X PATCH http://localhost:3000/api/v1/competitions/$CMP -H "Authorization: Bearer $ALICE" -H "Content-Type: application/json" -d '{"description":"Should fail"}' -w "\nHTTP %{http_code}\n"

# 15. Alice archives PUBLISHED → 200, status=ARCHIVED
curl -s -X PATCH http://localhost:3000/api/v1/competitions/$CMP/archive -H "Authorization: Bearer $ALICE" -w "\nHTTP %{http_code}\n"

# 16. Alice archives ARCHIVED → 409
curl -s -X PATCH http://localhost:3000/api/v1/competitions/$CMP/archive -H "Authorization: Bearer $ALICE" -w "\nHTTP %{http_code}\n"

# 17. List with status=PUBLISHED filter (Alice) → only PUB
curl -s "http://localhost:3000/api/v1/competitions?status=PUBLISHED" -H "Authorization: Bearer $ALICE"
```

## Definition of Done

- All 17 manual smoke test steps produce expected status codes.
- `npm run build` is green.
- `CompetitionsService` no longer returns hardcoded data.
- Lifecycle transitions enforced exactly per the state machine table.
- Visibility filter behaves correctly for SUPER_ADMIN, org member, comp role assignee, and outsider.
- Swagger UI loads.

## Implementation Order

1. Update `CompetitionsService` — write all 6 methods with RBAC, visibility, and lifecycle. Build verify.
2. Update `CompetitionsController` — pass `@CurrentUser()` to all 6 methods. Build verify.
3. Run smoke test (17 steps).
4. Patch any drift, re-test.
