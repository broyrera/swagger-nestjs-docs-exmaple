# Sprint 5: Match and Score API Contract

## Sprint Goal

Define and implement the Match and Score API contract.

This sprint focuses on documenting match creation, match listing, match detail, match updates, score input, and match status transitions.

## Why Matches Come After Participants

Matches require participants.

A competition can only generate standings, brackets, and results after matches and scores exist.

## Sprint Scope

This sprint focuses on six match endpoints:

```txt
POST /api/v1/competitions/{competitionId}/matches
GET /api/v1/competitions/{competitionId}/matches
GET /api/v1/matches/{matchId}
PATCH /api/v1/matches/{matchId}
PATCH /api/v1/matches/{matchId}/score
PATCH /api/v1/matches/{matchId}/status
```

## User Stories

### Story 5.1: Admin can create match manually

As a competition admin,
I want to create a match manually,
so that informal competitions can be managed flexibly.

Acceptance criteria:

* Endpoint requires Bearer token.
* Request includes home participant ID and away participant ID.
* Match can have optional scheduled time.
* Match starts as `SCHEDULED`.
* API returns created match.

### Story 5.2: User can list competition matches

As an authorized user,
I want to list matches in a competition,
so that I can see the competition schedule and results.

Acceptance criteria:

* Endpoint requires Bearer token.
* API supports optional status filter.
* API returns match list.

### Story 5.3: User can view match detail

As an authorized user,
I want to view match detail,
so that I can see participants, score, and status.

Acceptance criteria:

* Endpoint requires Bearer token.
* Invalid match ID returns `404 Not Found`.

### Story 5.4: Admin can update match metadata

As a competition admin,
I want to update match metadata,
so that I can correct schedule or participant placement.

Acceptance criteria:

* Endpoint requires Bearer token.
* Request supports partial update.
* Updating participants may be blocked after score is submitted.
* Invalid state returns `409 Conflict`.

### Story 5.5: Score admin can input match score

As a score admin,
I want to input match score,
so that match results can be recorded.

Acceptance criteria:

* Endpoint requires Bearer token.
* Request includes home score and away score.
* Score must be zero or positive.
* Match status becomes `COMPLETED`.
* Invalid state returns `409 Conflict`.

### Story 5.6: Admin can update match status

As a competition admin,
I want to update match status,
so that match lifecycle can be controlled manually.

Acceptance criteria:

* Endpoint requires Bearer token.
* Request includes match status.
* Invalid status transition returns `409 Conflict`.

## API Contract Deliverables

* Match enums
* Match participant summary DTO
* Match score DTO
* Match response DTO
* Create match request DTO
* Update match request DTO
* Update score request DTO
* Update match status request DTO
* Match list query DTO
* Reusable Swagger decorators for match endpoints

## Module Stub Deliverables

After the API contract is documented, this sprint also adds the initial Matches module scaffold:

```txt
src/modules/matches/
 ┣ docs/
 ┃ ┗ matches.swagger.ts
 ┣ dto/
 ┃ ┣ match-status.enum.ts
 ┃ ┣ match-participant.dto.ts
 ┃ ┣ match-score.dto.ts
 ┃ ┣ match.dto.ts
 ┃ ┣ create-match-request.dto.ts
 ┃ ┣ update-match-request.dto.ts
 ┃ ┣ update-match-score-request.dto.ts
 ┃ ┣ update-match-status-request.dto.ts
 ┃ ┗ list-matches-query.dto.ts
 ┣ matches.controller.ts
 ┣ matches.module.ts
 ┗ matches.service.ts
```

The module stub should expose the documented match endpoints with placeholder service responses.

The goal is to make Swagger UI show the match and score contract clearly before persistence, match generation, standings, or bracket rules are implemented.

## Swagger Learning Goals

By the end of this sprint, the project should demonstrate:

* nested response DTOs
* score payload documentation
* status transition endpoints
* optional scheduled time documentation
* `409 Conflict` for invalid match state
* direct data convention
* array response convention

## Definition of Done

Sprint 5 is complete when:

* `match-contract.md` is documented.
* Match request and response DTOs are created.
* Match Swagger decorators are extracted into `matches.swagger.ts`.
* Controller uses reusable docs decorators.
* Swagger UI clearly shows match endpoints.
* Match score and status transition docs are clear.
