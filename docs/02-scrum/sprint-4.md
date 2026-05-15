# Sprint 4: Participant API Contract

## Sprint Goal

Define and implement the Participant API contract.

This sprint focuses on documenting participants as competition entities that do not require user accounts.

## Why Participants Come After Competitions

Participants belong to competitions.

A competition cannot have matches, standings, or brackets before participants are registered or manually created.

## Core Domain Rule

Participants are not authentication principals.

A participant can exist without a user account.

Only users who manage the system need authentication and authorization.

## Sprint Scope

This sprint focuses on seven participant endpoints:

```txt
POST /api/v1/competitions/{competitionId}/participants
GET /api/v1/competitions/{competitionId}/participants
GET /api/v1/participants/{participantId}
PATCH /api/v1/participants/{participantId}
PATCH /api/v1/participants/{participantId}/approve
PATCH /api/v1/participants/{participantId}/reject
DELETE /api/v1/participants/{participantId}
```

## User Stories

### Story 4.1: Admin can create participant

As a competition admin,
I want to create a participant manually,
so that a team or individual can join a competition without requiring a user account.

Acceptance criteria:

* Endpoint requires Bearer token.
* Request includes participant type and display name.
* Participant can be created without linked user.
* Participant may optionally include linked user ID.
* API returns created participant.
* Swagger clearly documents that linked user is optional.

### Story 4.2: Admin can list competition participants

As a competition admin or viewer,
I want to list participants in a competition,
so that I can see who joined the competition.

Acceptance criteria:

* Endpoint requires Bearer token for this sprint.
* API returns participant list.
* Response uses direct array data convention.

### Story 4.3: User can view participant detail

As an authorized user,
I want to view participant detail,
so that I can inspect participant information.

Acceptance criteria:

* Endpoint requires Bearer token.
* Invalid participant ID returns `404 Not Found`.

### Story 4.4: Admin can update participant

As a competition admin,
I want to update participant information,
so that I can correct team or individual data.

Acceptance criteria:

* Endpoint requires Bearer token.
* Request supports partial update.
* Participant type cannot always be changed after matches exist.
* Invalid state may return `409 Conflict`.

### Story 4.5: Admin can approve participant

As a competition admin,
I want to approve participant registration,
so that the participant can be included in matches and brackets.

Acceptance criteria:

* Endpoint requires Bearer token.
* Pending participant can become approved.
* Rejected participant may require manual decision to approve again.
* Invalid transition returns `409 Conflict`.

### Story 4.6: Admin can reject participant

As a competition admin,
I want to reject participant registration,
so that invalid or duplicate entries are not included in the competition.

Acceptance criteria:

* Endpoint requires Bearer token.
* Pending participant can be rejected.
* Rejected participant does not appear in active match generation.
* Invalid transition returns `409 Conflict`.

### Story 4.7: Admin can remove participant

As a competition admin,
I want to remove a participant,
so that incorrect participant data can be deleted before matches are generated.

Acceptance criteria:

* Endpoint requires Bearer token.
* Participant can be removed if no locked match depends on it.
* Invalid state may return `409 Conflict`.

## API Contract Deliverables

* Participant enums
* Create participant request DTO
* Update participant request DTO
* Participant response DTO
* Participant list query DTO
* Reusable Swagger decorators for participant endpoints

## Swagger Learning Goals

By the end of this sprint, the project should demonstrate:

* nested resource path documentation
* participant type enum documentation
* optional linked user documentation
* lifecycle endpoints
* delete endpoint documentation
* direct data convention
* array response convention
* `409 Conflict` for invalid state

## Definition of Done

Sprint 4 is complete when:

* `participant-contract.md` is documented.
* Participant request and response DTOs are created.
* Participant Swagger decorators are extracted into `participants.swagger.ts`.
* Controller uses reusable docs decorators.
* Swagger UI clearly shows participant endpoints.
* Participant docs clearly state that user account is optional.
