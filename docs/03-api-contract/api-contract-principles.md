# API Contract Principles

## Overview

This document defines the API contract principles for Lawan PMO Sports.

The API contract describes how clients communicate with the backend. It includes endpoints, request bodies, response bodies, authentication requirements, authorization rules, validation behavior, and error behavior.

## Source of Truth

Swagger/OpenAPI generated from NestJS source code is the main API contract source of truth.

The contract must be maintained through:

- DTO classes
- validation decorators
- Swagger decorators
- reusable API documentation decorators
- consistent response DTOs
- consistent error DTOs

## Contract-First Mindset

Even though the OpenAPI document is generated from code, every endpoint should be designed as a contract before implementation.

Before implementing service logic, define:

1. Endpoint path
2. HTTP method
3. Purpose
4. Required authentication
5. Required authorization
6. Request DTO
7. Response DTO
8. Error responses
9. Example payload
10. Business rules

## Controller Cleanliness

Controller methods should stay readable.

Avoid stacking too many Swagger decorators directly above controller methods.

Preferred pattern:

```ts
@Post('login')
@LoginApiDocs()
login(@Body() dto: LoginRequestDto) {
  return this.authService.login(dto);
}
```

Swagger documentation should be extracted into module-level `docs` files.

Example:

```txt
src/modules/auth/docs/auth.swagger.ts
```

## DTO Rules

Every request body must use a request DTO.

Every success response should use a response DTO.

Avoid returning raw entities directly from API responses.

Do not expose sensitive fields such as:

- password
- password hash
- internal tokens
- private audit metadata
- internal system flags

## Error Contract Rules

Errors must follow a consistent structure.

Every protected endpoint should document:

- `401 Unauthorized`
- `403 Forbidden` when role-based access applies

Every endpoint with validation should document:

- `400 Bad Request`

Every endpoint that fetches a resource by ID should document:

- `404 Not Found`

Every endpoint with lifecycle or business rule conflict should document:

- `409 Conflict`

## Authentication Documentation

Protected endpoints must include Bearer authentication documentation.

The Swagger description should mention the required access level.

Example:

```txt
Requires Bearer token.
Allowed roles: COMPETITION_OWNER, COMPETITION_ADMIN.
```

## Public Endpoint Documentation

Public endpoints must clearly state that authentication is not required.

Example:

```txt
This endpoint is public for published competitions.
Private competitions require authorized access.
```

## Versioning

All API endpoints should use versioned paths.

Initial version:

```txt
/api/v1
```

## Naming Convention

Use resource-based endpoint naming.

Good:

```txt
GET /api/v1/competitions/{competitionId}/participants
PATCH /api/v1/matches/{matchId}/score
```

Avoid action-heavy names unless representing lifecycle commands.

Acceptable lifecycle/action endpoints:

```txt
PATCH /api/v1/competitions/{competitionId}/publish
PATCH /api/v1/participants/{participantId}/approve
PATCH /api/v1/matches/{matchId}/score
```

## Review Checklist

Before an endpoint is considered done, check:

- Does it have a clear request DTO?
- Does it have a clear response DTO?
- Are success examples provided where useful?
- Are validation errors documented?
- Are auth requirements documented?
- Are role requirements documented?
- Are business rule errors documented?
- Is the controller still readable?
