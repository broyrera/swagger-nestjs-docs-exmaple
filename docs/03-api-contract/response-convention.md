# Response Convention

## Overview

This document defines the success response convention for Lawan PMO Sports APIs.

A consistent response structure helps frontend developers, API consumers, and testers understand the API contract.

## Single Resource Response

Use this structure when returning a single resource.

```json
{
  "success": true,
  "message": "Competition retrieved successfully",
  "data": {
    "id": "competition-id",
    "name": "Futsal RT Cup 2026"
  }
}
```

## Collection Response

Use this structure when returning an array.

```json
{
  "success": true,
  "message": "Competitions retrieved successfully",
  "data": [
    {
      "id": "competition-id",
      "name": "Futsal RT Cup 2026"
    }
  ]
}
```

## Paginated Response

Use this structure when returning paginated data.

```json
{
  "success": true,
  "message": "Competitions retrieved successfully",
  "data": [
    {
      "id": "competition-id",
      "name": "Futsal RT Cup 2026"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Command Response

Use this structure when an action succeeds but does not need to return a large resource.

Example:

```json
{
  "success": true,
  "message": "Competition published successfully",
  "data": {
    "id": "competition-id",
    "status": "PUBLISHED"
  }
}
```

## Data Shape Rule

For single-resource responses, `data` should contain the resource object directly.

Good:

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

Avoid unnecessary nested resource wrappers:

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

Nested objects inside `data` are allowed only when the response naturally contains multiple named resources or computed context.

Example:

```json
{
  "success": true,
  "message": "Match score updated successfully",
  "data": {
    "match": {},
    "standingUpdated": true
  }
}
```

## Field Rules

### success

Boolean value indicating whether the request succeeded.

For success responses, this must be:

```json
true
```

### message

Human-readable message.

The message should be clear but not used by clients as business logic.

### data

Main response payload.

The shape depends on the endpoint.

### meta

Optional metadata.

Used for pagination or additional response context.

## API Contract Rule

Every success response DTO must represent this convention.

Avoid returning raw values directly.

Good:

```json
{
  "success": true,
  "message": "Match score updated successfully",
  "data": {
    "matchId": "match-id",
    "status": "COMPLETED"
  }
}
```

Avoid:

```json
{
  "matchId": "match-id",
  "status": "COMPLETED"
}
```

## Message Style

Use past-tense success messages.

Examples:

```txt
User registered successfully
Competition created successfully
Participants retrieved successfully
Match score updated successfully
Competition published successfully
```

---

## Swagger Response Wrapper Pattern

The API uses a reusable success response wrapper.

Every success response should follow this shape:

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

However, individual response DTOs should not repeat `success`, `message`, and `data` for every endpoint.

Instead, each endpoint should define only the data payload DTO.

Example:

```ts
export class LoginResponseDataDto {
  @ApiProperty({
    description: 'JWT access token.',
    example: 'jwt-access-token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Authenticated user profile.',
    type: UserProfileDto,
  })
  user: UserProfileDto;
}
```

The response wrapper is documented using a reusable Swagger decorator:

```ts
ApiSuccessResponse({
  status: 200,
  description: 'User logged in successfully',
  dataType: LoginResponseDataDto,
});
```

This generates a Swagger response schema with:

- `success`
- `message`
- `data`

while keeping module-specific DTOs focused only on the actual response payload.

## Why This Pattern Exists

TypeScript generics are useful in code, but Swagger/OpenAPI cannot always infer generic response types at runtime.

Avoid this pattern for Swagger documentation:

```ts
class LoginResponseDto extends ApiResponseDto<LoginResponseDataDto> {}
```

Preferred pattern:

```ts
ApiSuccessResponse({
  description: 'User logged in successfully',
  dataType: LoginResponseDataDto,
});
```

The reusable decorator internally uses:

- `ApiExtraModels`
- `getSchemaPath`
- `allOf`

to produce a clear OpenAPI schema.

## Response DTO Naming

Use this naming pattern:

```txt
{Action}{Resource}ResponseDataDto
```

Examples:

```txt
RegisterResponseDataDto
LoginResponseDataDto
CurrentUserResponseDataDto
CreateCompetitionResponseDataDto
GetStandingsResponseDataDto
```

## Rule

Module response DTOs should only describe the `data` object.

The common response wrapper is handled by shared Swagger decorators.
