# Sprint 0: Documentation and API Contract Foundation

## Sprint Goal

Prepare the repository documentation, product boundaries, and API contract standards before implementing the NestJS API.

Sprint 0 does not focus on feature implementation.

## Why Sprint 0 Exists

Lawan PMO Sports is also a learning project for NestJS Swagger/OpenAPI best practices.

Before coding endpoints, the project needs clear standards for:

- product domain
- user roles
- participant model
- RBAC
- response format
- error format
- Swagger documentation style
- API contract review process

## Sprint Deliverables

### Product Documentation

- `docs/00-overview/product-vision.md`
- `docs/01-product/participant-model.md`
- `docs/01-product/user-roles.md`
- `docs/01-product/rbac-model.md`
- `docs/01-product/competition-formats.md`

### Architecture Decision Records

- `docs/04-decisions/adr-001-participants-do-not-require-user-account.md`
- `docs/04-decisions/adr-002-swagger-as-api-contract-source-of-truth.md`

### Scrum Documentation

- `docs/02-scrum/product-backlog.md`
- `docs/02-scrum/sprint-0.md`

### API Contract Documentation

- `docs/03-api-contract/api-contract-principles.md`
- `docs/03-api-contract/swagger-style-guide.md`
- `docs/03-api-contract/response-convention.md`
- `docs/03-api-contract/error-convention.md`

## Definition of Done

Sprint 0 is complete when:

- Product vision is documented.
- Participant model is documented.
- RBAC model is documented.
- Competition formats are documented.
- Product backlog exists.
- API contract principles are documented.
- Swagger style guide exists.
- Response and error conventions are documented.
- No feature coding is started before these documents are reviewed.

## Sprint Notes

This sprint intentionally avoids implementation.

The goal is to make future implementation easier, cleaner, and more consistent.
