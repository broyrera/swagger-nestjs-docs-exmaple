# Sprint 8: API Contract Review and Swagger Quality Gate

## Sprint Goal

Review and harden the API contract quality for Lawan PMO Sports.

This sprint focuses on making the Swagger/OpenAPI documentation consistent, readable, reusable, and ready to be used by frontend developers, QA, and future automation.

## Why This Sprint Exists

The project already has the main API contract modules:

- Auth
- Organizations
- Competitions
- Participants
- Matches
- Standings
- Brackets

Before adding more features, the project needs a repeatable review process to keep API documentation consistent.

## Sprint Scope

This sprint focuses on:

- API contract review checklist
- Swagger consistency rules
- OpenAPI export guide
- response convention verification
- error response verification
- DTO naming verification
- auth and RBAC documentation verification

## User Stories

### Story 8.1: Developer can review an API contract

As a backend developer,  
I want a review checklist,  
so that every endpoint follows the same API contract standard.

Acceptance criteria:

- Checklist covers request DTOs.
- Checklist covers response DTOs.
- Checklist covers error responses.
- Checklist covers authentication.
- Checklist covers authorization.
- Checklist covers Swagger readability.

### Story 8.2: Developer can export OpenAPI JSON

As a backend developer,  
I want to export the OpenAPI document,  
so that frontend developers, QA, or external tools can consume the contract.

Acceptance criteria:

- Project documents how OpenAPI JSON can be exported.
- Exported contract can be committed or generated in CI later.
- Documentation explains when to export and how to use the file.

### Story 8.3: Project has Swagger quality rules

As a project maintainer,  
I want Swagger quality rules,  
so that future modules do not degrade documentation quality.

Acceptance criteria:

- Swagger decorators remain extracted from controllers.
- Success responses use `ApiSuccessResponse`.
- Error responses use reusable decorators.
- DTOs do not expose internal fields.
- Public/protected behavior is documented.

## API Contract Deliverables

- `api-contract-review-checklist.md`
- `openapi-export-guide.md`
- Updated README if needed

## Definition of Done

Sprint 8 is complete when:

- API contract review checklist exists.
- OpenAPI export guide exists.
- Existing modules are reviewed against the checklist.
- Swagger UI remains readable.
- All endpoint docs follow direct `data` convention.
