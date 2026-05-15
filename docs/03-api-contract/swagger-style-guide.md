# Swagger Style Guide

## Overview

This guide defines how Swagger/OpenAPI documentation should be written in Lawan PMO Sports.

The goal is to keep API documentation clear, consistent, and maintainable.

## Main Rule

Do not overload controller methods with many Swagger decorators.

Use reusable documentation decorators inside each module's `docs` folder.

## Recommended Module Structure

```txt
src/modules/auth/
  auth.controller.ts
  auth.service.ts
  dto/
    register-request.dto.ts
    register-response.dto.ts
    login-request.dto.ts
    login-response.dto.ts
  docs/
    auth.swagger.ts
```

## Controller Example

```ts
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Post('register')
  @RegisterApiDocs()
  register(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
  }
}
```

## Docs Decorator Example

```ts
export function RegisterApiDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register new user',
      description:
        'Creates a new user account that can manage organizations and competitions.',
    }),
    ApiBody({ type: RegisterRequestDto }),
    ApiCreatedResponse({
      description: 'User registered successfully',
      type: RegisterResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Validation failed',
      type: ErrorResponseDto,
    }),
    ApiConflictResponse({
      description: 'Email already exists',
      type: ErrorResponseDto,
    }),
  );
}
```

## Required Documentation Per Endpoint

Each endpoint should document:

- operation summary
- operation description when business rules are important
- request body
- path parameters
- query parameters
- success response
- error responses
- authentication requirement
- authorization requirement
- example values when helpful

## Summary Style

Use short, action-based summaries.

Good:

```txt
Register new user
Create competition
Publish competition
Input match score
Get competition standings
```

Avoid vague summaries:

```txt
Register
Create
Update data
Do action
```

## Description Style

Use description to explain business rules.

Example:

```txt
Creates a team participant for a competition.
The participant does not need to be linked to a user account.
Only competition owners and competition admins can perform this action.
```

## DTO Documentation

Use `@ApiProperty` for required fields.

Use `@ApiPropertyOptional` for optional fields.

Every important field should include:

- description
- example
- enum if applicable

Example:

```ts
export class CreateCompetitionRequestDto {
  @ApiProperty({
    description: 'Competition name shown to participants and viewers.',
    example: 'Futsal RT Cup 2026',
  })
  name: string;

  @ApiProperty({
    description: 'Competition type.',
    enum: CompetitionType,
    example: CompetitionType.SPORT,
  })
  type: CompetitionType;
}
```

## Enum Documentation

Enums must be documented clearly.

Example:

```ts
@ApiProperty({
  enum: CompetitionFormat,
  example: CompetitionFormat.GROUP_STAGE_KNOCKOUT,
})
format: CompetitionFormat;
```

## Response Documentation

Every endpoint should return a documented response DTO.

Avoid undocumented `any` responses.

Good:

```ts
@ApiOkResponse({
  description: 'Competition retrieved successfully',
  type: CompetitionResponseDto,
})
```

Avoid:

```ts
@ApiOkResponse()
```

---

## Success Response Documentation Pattern

Use `ApiSuccessResponse` for success responses.

Good:

```ts
ApiSuccessResponse({
  status: 201,
  description: 'User registered successfully',
  dataType: RegisterResponseDataDto,
});
```

Avoid repeating full response wrappers in every module DTO.

Avoid:

```ts
export class RegisterResponseDto {
  success: boolean;
  message: string;
  data: RegisterResponseDataDto;
}
```

Preferred:

```ts
export class RegisterResponseDataDto {
  user: UserProfileDto;
}
```

Then document the wrapper using:

```ts
ApiSuccessResponse({
  status: 201,
  description: 'User registered successfully',
  dataType: RegisterResponseDataDto,
});
```

This keeps controller documentation clean and keeps DTOs focused.

## Error Documentation

Document expected error responses.

Common errors:

- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`

## Auth Documentation

Protected endpoints must include:

```ts
@ApiBearerAuth()
```

And the operation description should mention allowed roles.

## Public Documentation

Public endpoints should explicitly mention public behavior.

Example:

```txt
This endpoint is public when the competition is published.
Private competitions require authorized access.
```

## Naming Convention

Use this naming pattern:

```txt
{Action}{Resource}ApiDocs
```

Examples:

```ts
RegisterApiDocs;
LoginApiDocs;
CreateCompetitionApiDocs;
PublishCompetitionApiDocs;
InputMatchScoreApiDocs;
GetStandingsApiDocs;
```

## Anti-Patterns

Avoid:

- putting all Swagger decorators directly in controller
- using raw entity as response schema
- returning password or internal fields
- using vague DTO names like `DataDto`
- using undocumented enums
- using `any` response
- documenting only happy path
- forgetting `401` and `403` for protected endpoints
