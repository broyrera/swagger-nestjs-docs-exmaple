# Lawan PMO Sports API

Lawan PMO Sports API is a documentation-first NestJS learning project focused on Swagger/OpenAPI API contract best practices.

The project uses a flexible sport and esport competition management system as the case study.

## Learning Goal

The main goal of this repository is to learn how to design, document, and implement API contracts using NestJS Swagger/OpenAPI in a clean and scalable way.

This project focuses on:

- API contract design
- Swagger/OpenAPI documentation
- clean controller documentation pattern
- request and response DTO design
- consistent success and error response structure
- authentication and RBAC documentation
- incremental Scrum-based development

## Product Summary

Lawan PMO Sports is a flexible competition management platform for sport and esport events.

It supports:

- informal and formal competitions
- team and individual participants
- participants without user accounts
- flexible competition formats
- match scheduling
- score input
- standings
- brackets
- role-based access control

## Important Domain Rule

Participants are not required to have user accounts.

Only users who manage the system need authentication and authorization.

This means:

- User = authenticated actor who can login and manage resources
- Participant = competition entity that appears in matches, brackets, and standings

## Documentation Structure

```txt
docs/
  00-overview/
    product-vision.md

  01-product/
    participant-model.md
    user-roles.md
    rbac-model.md
    competition-formats.md

  02-scrum/
    product-backlog.md
    sprint-0.md
    sprint-1.md

  03-api-contract/
    api-contract-principles.md
    swagger-style-guide.md
    response-convention.md
    error-convention.md
    auth-contract.md

  04-decisions/
    adr-001-participants-do-not-require-user-account.md
    adr-002-swagger-as-api-contract-source-of-truth.md
```

## Recommended Reading Order

1. `docs/00-overview/product-vision.md`
2. `docs/01-product/participant-model.md`
3. `docs/01-product/user-roles.md`
4. `docs/01-product/rbac-model.md`
5. `docs/01-product/competition-formats.md`
6. `docs/03-api-contract/api-contract-principles.md`
7. `docs/03-api-contract/swagger-style-guide.md`
8. `docs/03-api-contract/response-convention.md`
9. `docs/03-api-contract/error-convention.md`
10. `docs/03-api-contract/auth-contract.md`

## Current Sprint

Current sprint:

```txt
Sprint 8: API Contract Review and Swagger Quality Gate
```

Sprint 8 focuses on:

- API contract review checklist
- Swagger quality rules
- OpenAPI export guide
- response and error convention verification
- auth and RBAC documentation verification

## API Contract Source of Truth

Swagger/OpenAPI generated from NestJS source code will be used as the main API contract source of truth.

Manual Postman collections are not the primary source of truth for this project.

## Planned Implementation Pattern

Controller files should stay clean.

Preferred controller style:

```ts
@Post('login')
@LoginApiDocs()
login(@Body() dto: LoginRequestDto) {
  return this.authService.login(dto);
}
```

Swagger decorators should be extracted into module-level docs files:

```txt
src/modules/auth/docs/auth.swagger.ts
```

## Project Status

Current status:

- Product documentation: started
- Domain documentation: started
- Scrum documentation: Sprint 8
- API contract standard: started
- Auth API contract stub: done
- Organization API contract stub: done
- Competition API contract stub: done
- Participant API contract stub: done
- Match API contract stub: done
- Standings API contract stub: done
- Bracket API contract stub: done
- NestJS implementation: contract stubs only
