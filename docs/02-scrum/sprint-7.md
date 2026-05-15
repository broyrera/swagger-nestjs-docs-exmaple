# Sprint 7: Bracket API Contract

## Sprint Goal

Define and implement the Bracket API contract.

This sprint focuses on documenting bracket tree responses, bracket generation, bracket match updates, flexible participant counts, and bye handling.

## Why Bracket Comes After Participants and Matches

Brackets depend on participants and matches.

A bracket is a structured competition view that shows how participants progress through knockout rounds.

## Core Domain Rule

The system must not require perfect bracket participant counts such as 4, 8, 16, or 32.

Lawan PMO Sports must support flexible participant counts such as:

- 3 participants
- 5 participants
- 7 participants
- 9 participants
- 13 participants

## Sprint Scope

This sprint focuses on three bracket endpoints:

```txt
GET /api/v1/competitions/{competitionId}/bracket
POST /api/v1/competitions/{competitionId}/bracket/generate
PATCH /api/v1/bracket-matches/{bracketMatchId}
```

## User Stories

### Story 7.1: User can view competition bracket

As an authorized user or viewer,
I want to view the competition bracket,
so that I can understand knockout progression.

Acceptance criteria:

* Endpoint requires Bearer token for this sprint.
* API returns bracket rounds.
* Each round contains bracket matches.
* Bracket match includes participant slots.
* Bracket supports bye slots.
* Swagger documents nested bracket structure clearly.

### Story 7.2: Admin can generate bracket

As a competition admin,
I want to generate a bracket from approved participants,
so that knockout matches can be prepared.

Acceptance criteria:

* Endpoint requires Bearer token.
* Only authorized users can generate bracket.
* Competition must support bracket format.
* Approved participants are used for generation.
* Non-perfect participant counts are supported using byes or manual placement.
* Invalid state returns `409 Conflict`.

### Story 7.3: Admin can update bracket match

As a competition admin,
I want to update a bracket match manually,
so that informal competitions can be adjusted.

Acceptance criteria:

* Endpoint requires Bearer token.
* Admin can update participant slots.
* Admin can update match reference if needed.
* Invalid bracket state returns `409 Conflict`.

## API Contract Deliverables

* Bracket status enum
* Bracket participant slot DTO
* Bracket match DTO
* Bracket round DTO
* Bracket response DTO
* Generate bracket request DTO
* Update bracket match request DTO
* Reusable Swagger decorators for bracket endpoints

## Module Stub Deliverables

After the API contract is documented, this sprint also adds the initial Brackets module scaffold:

```txt
src/modules/brackets/
 ┣ docs/
 ┃ ┗ brackets.swagger.ts
 ┣ dto/
 ┃ ┣ bracket-generation-mode.enum.ts
 ┃ ┣ bracket-match-status.enum.ts
 ┃ ┣ bracket-participant.dto.ts
 ┃ ┣ bracket-slot.dto.ts
 ┃ ┣ bracket-match.dto.ts
 ┃ ┣ bracket-round.dto.ts
 ┃ ┣ bracket.dto.ts
 ┃ ┣ generate-bracket-request.dto.ts
 ┃ ┗ update-bracket-match-request.dto.ts
 ┣ brackets.controller.ts
 ┣ brackets.module.ts
 ┗ brackets.service.ts
```

The module stub should expose the documented bracket endpoints with placeholder bracket tree responses.

The goal is to make Swagger UI show flexible bracket structures before generation logic, seeding, and advancement rules are implemented.

## Swagger Learning Goals

By the end of this sprint, the project should demonstrate:

* nested array response documentation
* nullable participant slot documentation
* bye slot documentation
* command endpoint documentation
* bracket tree response documentation
* `409 Conflict` for invalid bracket state

## Definition of Done

Sprint 7 is complete when:

* `bracket-contract.md` is documented.
* Bracket request and response DTOs are created.
* Bracket Swagger decorators are extracted into `brackets.swagger.ts`.
* Controller uses reusable docs decorators.
* Swagger UI clearly shows bracket endpoints.
* Docs clearly explain flexible participant count and bye handling.
