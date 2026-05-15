# Sprint 3: Competition API Contract

## Sprint Goal

Define and implement the Competition API contract using the reusable Swagger documentation pattern established in previous sprints.

This sprint focuses on documenting competition creation, listing, detail retrieval, update, and lifecycle actions.

## Why Competition Comes After Organization

Competitions are the core resource in Lawan PMO Sports.

A competition belongs to an organization and contains participants, matches, scores, standings, and brackets.

## Sprint Scope

This sprint focuses on six competition endpoints:

```txt
POST /api/v1/competitions
GET /api/v1/competitions
GET /api/v1/competitions/{competitionId}
PATCH /api/v1/competitions/{competitionId}
PATCH /api/v1/competitions/{competitionId}/publish
PATCH /api/v1/competitions/{competitionId}/archive
```

## User Stories

### Story 3.1: Organizer can create competition

As an organization owner or admin,
I want to create a competition,
so that I can manage participants, matches, scores, standings, and brackets.

Acceptance criteria:

- Endpoint requires Bearer token.
- Request includes organization ID.
- Request includes name, type, format, and visibility.
- Created competition starts as draft.
- API returns created competition.
- Swagger documents enum fields clearly.

### Story 3.2: User can list accessible competitions

As an authenticated user,
I want to view competitions I can access,
so that I can manage or monitor them.

Acceptance criteria:

- Endpoint requires Bearer token.
- API supports optional filters.
- API returns competition list.
- Swagger documents query parameters.

### Story 3.3: User can view competition detail

As an authorized user or viewer,
I want to view competition detail,
so that I can understand the competition configuration.

Acceptance criteria:

- Published public competitions may be viewable publicly in the future.
- Current sprint treats endpoint as protected.
- Invalid competition ID returns `404 Not Found`.
- Unauthorized access returns `403 Forbidden`.

### Story 3.4: Organizer can update competition

As a competition owner,
I want to update competition information,
so that I can correct or improve competition details before or during the event.

Acceptance criteria:

- Endpoint requires Bearer token.
- Only authorized users can update.
- Request supports partial update.
- Invalid lifecycle state may return `409 Conflict`.

### Story 3.5: Organizer can publish competition

As a competition owner,
I want to publish a competition,
so that participants and viewers can access it.

Acceptance criteria:

- Endpoint requires Bearer token.
- Draft competition can become published.
- Archived competition cannot be published.
- Invalid transition returns `409 Conflict`.

### Story 3.6: Organizer can archive competition

As a competition owner,
I want to archive a competition,
so that completed or inactive competitions are no longer actively managed.

Acceptance criteria:

- Endpoint requires Bearer token.
- Published or draft competition can be archived.
- Archived competition is read-only for most operations.
- Swagger documents conflict behavior.

## API Contract Deliverables

- Competition enums
- Create competition request DTO
- Update competition request DTO
- Competition response DTO
- Competition query DTO
- Reusable Swagger decorators for competition endpoints

## Swagger Learning Goals

By the end of this sprint, the project should demonstrate:

- enum documentation
- query parameter documentation
- partial update DTO
- lifecycle endpoint documentation
- `409 Conflict` documentation
- reusable success response wrapper
- protected endpoint documentation

## Definition of Done

Sprint 3 is complete when:

- `competition-contract.md` is documented.
- Competition request and response DTOs are created.
- Competition Swagger decorators are extracted into `competitions.swagger.ts`.
- Controller uses reusable docs decorators.
- Swagger UI clearly shows competition endpoints.
- Controller remains clean.
- Response examples follow direct `data` convention.
