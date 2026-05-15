# API Contract Review Checklist

## Overview

This checklist is used to review API contracts in Lawan PMO Sports.

Every endpoint should pass this checklist before it is considered contract-ready.

## 1. Endpoint Design

Check:

- [ ] Endpoint path is resource-based.
- [ ] HTTP method matches the action.
- [ ] Versioned path uses `/api/v1`.
- [ ] Action-style endpoint is only used for lifecycle or command actions.
- [ ] Path parameters are clear and consistent.

Good examples:

```txt
GET /api/v1/competitions/{competitionId}
PATCH /api/v1/competitions/{competitionId}/publish
PATCH /api/v1/matches/{matchId}/score
```

Avoid unclear paths:

```txt
POST /api/v1/do-update
GET /api/v1/get-data
```

---

## 2. Controller Cleanliness

Check:

- [ ] Controller method uses reusable API docs decorator.
- [ ] Controller does not contain long Swagger decorator stacks.
- [ ] Controller method focuses on routing and delegation.
- [ ] Swagger documentation is placed in module `docs` folder.

Good:

```ts
@Post('login')
@LoginApiDocs()
login(@Body() dto: LoginRequestDto) {
  return this.authService.login(dto);
}
```

Avoid:

```ts
@Post('login')
@ApiOperation(...)
@ApiBody(...)
@ApiOkResponse(...)
@ApiBadRequestResponse(...)
@ApiUnauthorizedResponse(...)
login(@Body() dto: LoginRequestDto) {
  return this.authService.login(dto);
}
```

---

## 3. Request DTO

Check:

- [ ] Request body uses a DTO.
- [ ] DTO uses `class-validator`.
- [ ] DTO uses `@ApiProperty` or `@ApiPropertyOptional`.
- [ ] Required and optional fields are clear.
- [ ] Enum fields document enum values.
- [ ] Examples are realistic.
- [ ] Sensitive fields are not exposed unnecessarily.
- [ ] Unknown fields are rejected by validation pipe.

Required field example:

```ts
@ApiProperty({
  description: 'Competition name.',
  example: 'Futsal RT Cup 2026',
})
@IsString()
@IsNotEmpty()
name: string;
```

Optional field example:

```ts
@ApiPropertyOptional({
  description: 'Competition description.',
  example: 'Community futsal competition.',
})
@IsOptional()
@IsString()
description?: string;
```

---

## 4. Response DTO

Check:

- [ ] Success response uses `ApiSuccessResponse`.
- [ ] Response uses direct `data` convention.
- [ ] Single resource response does not add unnecessary nested resource wrapper.
- [ ] Array response uses `isArray: true`.
- [ ] Response DTO does not expose internal database fields.
- [ ] Response DTO does not expose password or security metadata.

Good single resource response:

```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "id": "org_123",
    "name": "Garuda Sports Community"
  }
}
```

Avoid unnecessary nesting:

```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "organization": {
      "id": "org_123",
      "name": "Garuda Sports Community"
    }
  }
}
```

Good array response:

```ts
ApiSuccessResponse({
  status: 200,
  description: 'Participants retrieved successfully',
  dataType: ParticipantDto,
  isArray: true,
});
```

---

## 5. Error Responses

Check:

- [ ] Validation errors document `400 Bad Request`.
- [ ] Protected endpoints document `401 Unauthorized`.
- [ ] Role-protected endpoints document `403 Forbidden`.
- [ ] Resource lookup endpoints document `404 Not Found`.
- [ ] Lifecycle or invalid state endpoints document `409 Conflict`.
- [ ] Error response uses `ErrorResponseDto`.

Common reusable decorators:

```ts
ApiValidationErrorResponse();
ApiAuthErrorResponses();
ApiForbiddenErrorResponse();
ApiNotFoundErrorResponse('Competition');
ApiConflictErrorResponse('Invalid competition lifecycle transition');
```

---

## 6. Authentication Documentation

Check:

- [ ] Protected endpoint uses `ApiBearerAuth('access-token')`.
- [ ] Swagger operation description mentions authentication requirement when useful.
- [ ] Endpoint contract explains whether endpoint is public or protected.

Good:

```ts
ApiBearerAuth('access-token');
```

Avoid:

```ts
ApiBearerAuth();
```

because this project uses a named bearer auth scheme.

---

## 7. Authorization / RBAC Documentation

Check:

- [ ] Protected business action documents allowed roles.
- [ ] Role requirement is written in endpoint description or contract docs.
- [ ] Participant is not treated as an authenticated actor.
- [ ] Authorization uses user roles, not participant identity.

Example:

```txt
Allowed roles:
- SUPER_ADMIN
- ORGANIZATION_OWNER
- COMPETITION_OWNER
- COMPETITION_ADMIN
```

---

## 8. Domain Rules

Check:

- [ ] Endpoint respects participant does not require user account.
- [ ] Competition format supports flexible participant counts.
- [ ] Bracket contract supports byes.
- [ ] Match completed state requires score in future implementation.
- [ ] Standings are documented as computed data.
- [ ] Soft remove behavior is documented when used.

---

## 9. Swagger Readability

Check:

- [ ] Operation summary is short and action-based.
- [ ] Description explains important business rules.
- [ ] DTO field descriptions are useful.
- [ ] Example values are realistic.
- [ ] Tags are grouped clearly.
- [ ] Response schemas are readable in Swagger UI.

Good summaries:

```txt
Create competition
Publish competition
Create participant
Update match score
Get competition standings
Generate bracket
```

Avoid vague summaries:

```txt
Create
Update
Do action
Get data
```

---

## 10. Final Endpoint Review

Before marking endpoint contract-ready:

- [ ] Request schema is clear.
- [ ] Success response schema is clear.
- [ ] Error responses are documented.
- [ ] Auth requirement is documented.
- [ ] RBAC rule is documented.
- [ ] Business rule is documented.
- [ ] Controller remains clean.
- [ ] DTO naming is consistent.
- [ ] Swagger UI renders correctly.
