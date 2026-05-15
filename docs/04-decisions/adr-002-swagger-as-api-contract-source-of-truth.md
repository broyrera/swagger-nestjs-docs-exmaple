# ADR-002: Swagger as API Contract Source of Truth

## Status

Accepted

## Context

Lawan PMO Sports is a learning project focused on building API documentation and API contract best practices using NestJS Swagger/OpenAPI.

The project needs a consistent way to document endpoints, request bodies, response bodies, authentication, authorization, validation rules, and error responses.

API documentation should not be separated from the backend source code because separated documentation can easily become outdated.

## Decision

Swagger/OpenAPI generated from NestJS source code will be used as the main API contract source of truth.

The project will use NestJS Swagger decorators, DTO classes, response DTOs, and reusable documentation decorators to generate the OpenAPI document.

Manual Postman JSON collections are not the primary contract source.

## Consequences

### Positive

- API contract stays close to backend implementation.
- DTOs and validation rules can be reflected in Swagger documentation.
- Frontend developers can read the contract from Swagger UI.
- The OpenAPI document can later be exported for client generation or testing.
- Documentation is easier to keep updated during development.

### Negative

- Controller files can become crowded if Swagger decorators are not managed well.
- Developers must be disciplined when creating DTOs and response contracts.
- Complex response schemas may require extra documentation effort.

## Implementation Rule

Swagger decorators should not be heavily stacked directly inside controller methods.

Instead, each module should place reusable API documentation decorators inside a `docs` folder.

Example structure:

```txt
src/modules/auth/
  auth.controller.ts
  dto/
    login-request.dto.ts
    login-response.dto.ts
  docs/
    auth.swagger.ts
```

Controller example:

```ts
@Post('login')
@LoginApiDocs()
login(@Body() dto: LoginRequestDto) {
  return this.authService.login(dto);
}
```

Documentation decorator example:

```ts
export function LoginApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Login user' }),
    ApiBody({ type: LoginRequestDto }),
    ApiOkResponse({
      description: 'Login success',
      type: LoginResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid credentials',
      type: ErrorResponseDto,
    }),
  );
}
```

## API Contract Rule

Every endpoint must document:

- endpoint purpose
- authentication requirement
- required role if protected
- request body
- path parameters
- query parameters
- success response
- error responses
- example payload when useful

## Related Documents

- `docs/03-api-contract/swagger-style-guide.md`
- `docs/03-api-contract/response-convention.md`
- `docs/03-api-contract/error-convention.md`
