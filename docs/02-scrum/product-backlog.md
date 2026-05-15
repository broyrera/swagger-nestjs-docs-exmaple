# Product Backlog

## Overview

This document defines the initial product backlog for Lawan PMO Sports.

The backlog is written incrementally. Each epic represents a major business capability, and each story should eventually map to one or more API contracts.

## Product Goal

Build a flexible sport and esport competition management API with clear Swagger/OpenAPI documentation and clean NestJS implementation patterns.

## Epic 1: Authentication & User Access

### Story 1.1: User can register

As a new user,  
I want to create an account,  
so that I can manage organizations or competitions.

Acceptance criteria:

- User can register with name, email, and password.
- Email must be unique.
- Password must follow validation rules.
- API returns user profile without password.
- Swagger documents request body, success response, and error responses.

Potential API:

```txt
POST /api/v1/auth/register
```

### Story 1.2: User can login

As a registered user,
I want to login,
so that I can access protected resources.

Acceptance criteria:

* User can login with email and password.
* API returns access token and user profile.
* Invalid credentials return standardized error response.
* Swagger documents `401 Unauthorized`.

Potential API:

```txt
POST /api/v1/auth/login
```

### Story 1.3: User can view current profile

As an authenticated user,
I want to view my current profile,
so that I know which account is active.

Acceptance criteria:

* Endpoint requires Bearer token.
* API returns current authenticated user.
* Swagger documents auth requirement.

Potential API:

```txt
GET /api/v1/auth/me
```

---

## Epic 2: Organization Management

### Story 2.1: User can create organization

As an organizer,
I want to create an organization,
so that I can manage competitions under a community, club, school, or office.

Acceptance criteria:

* Authenticated user can create organization.
* Creator becomes organization owner.
* Organization name must be unique within reasonable scope.
* Swagger documents protected endpoint and response.

Potential API:

```txt
POST /api/v1/organizations
```

### Story 2.2: Organization owner can invite members

As an organization owner,
I want to invite members,
so that other users can help manage competitions.

Acceptance criteria:

* Only authorized users can invite members.
* Invited member receives organization role.
* Invalid role returns validation error.
* Unauthorized user receives `403 Forbidden`.

Potential API:

```txt
POST /api/v1/organizations/{organizationId}/members
```

---

## Epic 3: Competition Management

### Story 3.1: Organizer can create competition

As an organizer,
I want to create a competition,
so that participants, matches, scores, standings, and brackets can be managed.

Acceptance criteria:

* Competition has name, type, format, and visibility.
* Competition belongs to an organization.
* Creator becomes competition owner.
* Competition starts as draft.
* Swagger documents enum values.

Potential API:

```txt
POST /api/v1/competitions
```

### Story 3.2: Organizer can publish competition

As a competition owner,
I want to publish a competition,
so that participants and viewers can access it.

Acceptance criteria:

* Only authorized users can publish.
* Draft competition can become published.
* Invalid lifecycle transition returns conflict error.
* Swagger documents possible `409 Conflict`.

Potential API:

```txt
PATCH /api/v1/competitions/{competitionId}/publish
```

---

## Epic 4: Participant Management

### Story 4.1: Admin can create team participant

As a competition admin,
I want to create a team participant,
so that a team can join a competition without requiring every player to create an account.

Acceptance criteria:

* Participant can be created using display name only.
* Participant does not require user account.
* Participant type must be `TEAM`.
* Swagger documents participant model clearly.

Potential API:

```txt
POST /api/v1/competitions/{competitionId}/participants/teams
```

### Story 4.2: Admin can create individual participant

As a competition admin,
I want to create an individual participant,
so that a single player can join a competition without needing an account.

Acceptance criteria:

* Participant can be created using display name only.
* Optional linked user may be supported later.
* Participant type must be `INDIVIDUAL`.

Potential API:

```txt
POST /api/v1/competitions/{competitionId}/participants/individuals
```

---

## Epic 5: Match & Score Management

### Story 5.1: Admin can create match manually

As a competition admin,
I want to create a match manually,
so that informal competitions can be managed flexibly.

Acceptance criteria:

* Match can be created between two participants.
* Match can have optional schedule.
* Match starts as scheduled or draft depending on business rule.
* Swagger documents participant references.

Potential API:

```txt
POST /api/v1/competitions/{competitionId}/matches
```

### Story 5.2: Score admin can input score

As a score admin,
I want to input match score,
so that match results and standings can be updated.

Acceptance criteria:

* Only authorized users can input score.
* Score must match competition scoring rules.
* Completed match updates standings.
* Invalid match state returns conflict error.

Potential API:

```txt
PATCH /api/v1/matches/{matchId}/score
```

---

## Epic 6: Standings, Brackets, and Results

### Story 6.1: Viewer can see standings

As a viewer,
I want to see competition standings,
so that I can understand current rankings.

Acceptance criteria:

* Public competition standings can be viewed without login.
* Private competition standings require access.
* Response includes rank, participant, played, won, drawn, lost, points, and score stats where applicable.

Potential API:

```txt
GET /api/v1/competitions/{competitionId}/standings
```

### Story 6.2: Viewer can see bracket

As a viewer,
I want to see competition bracket,
so that I can understand knockout progression.

Acceptance criteria:

* Bracket supports non-perfect participant counts.
* Bracket may include bye rounds.
* Response structure is documented clearly.

Potential API:

```txt
GET /api/v1/competitions/{competitionId}/bracket
```
