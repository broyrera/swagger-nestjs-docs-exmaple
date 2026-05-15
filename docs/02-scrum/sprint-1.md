# Sprint 1: Authentication API Contract

## Sprint Goal

Define and implement the first API contract module for authentication using NestJS Swagger/OpenAPI best practices.

The main goal is not only to create authentication endpoints, but also to establish a repeatable documentation pattern for future modules.

## Why Authentication First

Authentication is the foundation for protected resources in Lawan PMO Sports.

Future modules such as organizations, competitions, participants, matches, and scores will depend on authenticated users and RBAC.

## Sprint Scope

This sprint focuses on three authentication endpoints:

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/auth/me
```

## User Stories

### Story 1.1: User can register

As a new user,
I want to create an account,
so that I can create organizations and manage competitions.

Acceptance criteria:

- User can register with name, email, and password.
- Email must be unique.
- Password must follow validation rules.
- API returns user profile without password.
- API documents validation error.
- API documents conflict error when email already exists.

### Story 1.2: User can login

As a registered user,
I want to login,
so that I can access protected resources.

Acceptance criteria:

- User can login with email and password.
- API returns access token and user profile.
- Invalid credentials return `401 Unauthorized`.
- Swagger documents the request body and success response.

### Story 1.3: User can view current profile

As an authenticated user,
I want to view my current profile,
so that I can confirm which account is active.

Acceptance criteria:

- Endpoint requires Bearer token.
- API returns current authenticated user.
- Missing or invalid token returns `401 Unauthorized`.
- Swagger documents Bearer authentication.

## API Contract Deliverables

- Request DTO for register
- Response DTO for register
- Request DTO for login
- Response DTO for login
- Response DTO for current user
- Error response DTO
- Reusable Swagger decorators for auth endpoints

## Swagger Learning Goals

By the end of this sprint, the project should demonstrate:

- `@ApiTags`
- `@ApiOperation`
- `@ApiBody`
- `@ApiCreatedResponse`
- `@ApiOkResponse`
- `@ApiBadRequestResponse`
- `@ApiUnauthorizedResponse`
- `@ApiConflictResponse`
- `@ApiBearerAuth`
- Reusable documentation decorators using `applyDecorators`

## Implementation Rules

Controller methods must stay clean.

Allowed pattern:

```ts
@Post('register')
@RegisterApiDocs()
register(@Body() dto: RegisterRequestDto) {
  return this.authService.register(dto);
}
```

Avoid this pattern:

```ts
@Post('register')
@ApiOperation(...)
@ApiBody(...)
@ApiCreatedResponse(...)
@ApiBadRequestResponse(...)
@ApiConflictResponse(...)
register(@Body() dto: RegisterRequestDto) {
  return this.authService.register(dto);
}
```

## Definition of Done

Sprint 1 is complete when:

- `auth-contract.md` is documented.
- Auth request and response DTOs are created.
- Auth Swagger decorators are extracted into `auth.swagger.ts`.
- Controller uses reusable docs decorators.
- Swagger UI clearly shows register, login, and me endpoints.
- Controller is still readable.
- Error responses are documented.
