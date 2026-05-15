# Sprint 2: Organization API Contract

## Sprint Goal

Define and implement the Organization API contract using the reusable Swagger documentation pattern established in Sprint 1.

This sprint focuses on documenting protected endpoints, path parameters, list responses, and organization role concepts.

## Why Organization Comes After Auth

Organizations are the main ownership container in Lawan PMO Sports.

A user can create an organization and manage competitions under it.

Future resources such as competitions, participants, matches, and standings will usually belong to an organization or competition created by an organization.

## Sprint Scope

This sprint focuses on four organization endpoints:

```txt
POST /api/v1/organizations
GET /api/v1/organizations
GET /api/v1/organizations/{organizationId}
POST /api/v1/organizations/{organizationId}/members
```

## User Stories

### Story 2.1: User can create organization

As an authenticated user,
I want to create an organization,
so that I can manage competitions under a community, club, school, or office.

Acceptance criteria:

- Endpoint requires Bearer token.
- User can create organization with name and optional description.
- Creator becomes organization owner.
- API returns created organization.
- Swagger documents request body, success response, validation error, and unauthorized error.

### Story 2.2: User can list organizations

As an authenticated user,
I want to view organizations that I can access,
so that I can choose where to manage competitions.

Acceptance criteria:

- Endpoint requires Bearer token.
- API returns organizations accessible to the current user.
- Swagger documents collection response.

### Story 2.3: User can view organization detail

As an organization member,
I want to view organization detail,
so that I can understand the organization profile and my access level.

Acceptance criteria:

- Endpoint requires Bearer token.
- API returns organization detail.
- Invalid organization ID returns `404 Not Found`.
- Unauthorized access returns `403 Forbidden`.

### Story 2.4: Organization owner can add member

As an organization owner,
I want to add a member,
so that another user can help manage competitions.

Acceptance criteria:

- Endpoint requires Bearer token.
- Only organization owner or authorized admin can add members.
- Request includes user email and role.
- Invalid role returns validation error.
- Unauthorized role returns `403 Forbidden`.

## API Contract Deliverables

- Create organization request DTO
- Organization response data DTO
- Organization list item DTO
- Organization member request DTO
- Reusable Swagger decorators for organization endpoints

## Swagger Learning Goals

By the end of this sprint, the project should demonstrate:

- `@ApiBearerAuth`
- `@ApiParam`
- `@ApiBody`
- reusable success response wrapper
- array response schema
- protected endpoint documentation
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

## Definition of Done

Sprint 2 is complete when:

- `organization-contract.md` is documented.
- Organizations request and response DTOs are created.
- Organizations Swagger decorators are extracted into `organizations.swagger.ts`.
- Controller uses reusable docs decorators.
- Swagger UI clearly shows organization endpoints.
- Protected endpoints document Bearer auth.
- Controller remains clean.
