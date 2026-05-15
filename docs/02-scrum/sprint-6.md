# Sprint 6: Standings and Results API Contract

## Sprint Goal

Define and implement the Standings and Results API contract.

This sprint focuses on documenting computed competition data generated from participants, matches, and scores.

## Why Standings Come After Matches

Standings depend on match results.

A competition cannot calculate meaningful standings before participants and scored matches exist.

## Sprint Scope

This sprint focuses on two read-only endpoints:

```txt
GET /api/v1/competitions/{competitionId}/standings
GET /api/v1/competitions/{competitionId}/results
```

## User Stories

### Story 6.1: User can view competition standings

As an authorized user or viewer,
I want to view competition standings,
so that I can understand the current ranking.

Acceptance criteria:

* Endpoint requires Bearer token for this sprint.
* API returns ranked participant standings.
* Standing includes played, won, drawn, lost, score stats, and points.
* Response is computed from match results.
* Swagger documents the computed response clearly.

### Story 6.2: User can view competition results

As an authorized user or viewer,
I want to view completed match results,
so that I can understand past match outcomes.

Acceptance criteria:

* Endpoint requires Bearer token for this sprint.
* API returns completed or result-related matches.
* Response includes participants, score, status, and scheduled time.
* Swagger documents array response.

## API Contract Deliverables

* Standing row DTO
* Standing participant DTO
* Competition standings response DTO if needed
* Result match DTO
* Results query DTO
* Reusable Swagger decorators for standings endpoints

## Module Stub Deliverables

After the API contract is documented, this sprint also adds the initial Standings module scaffold:

```txt
src/modules/standings/
 ┣ docs/
 ┃ ┗ standings.swagger.ts
 ┣ dto/
 ┃ ┣ standing-participant.dto.ts
 ┃ ┣ standing-row.dto.ts
 ┃ ┗ list-results-query.dto.ts
 ┣ standings.controller.ts
 ┣ standings.module.ts
 ┗ standings.service.ts
```

The module stub should expose the documented read-only standings and results endpoints with placeholder computed responses.

The goal is to make Swagger UI show computed response contracts before persistence, scoring rules, and tie breaker rules are implemented.

## Swagger Learning Goals

By the end of this sprint, the project should demonstrate:

* computed response documentation
* ranked array response
* nested DTOs
* read-only endpoint documentation
* array response convention
* query parameter documentation for result filters

## Definition of Done

Sprint 6 is complete when:

* `standing-contract.md` is documented.
* Standings request/response DTOs are created.
* Standings Swagger decorators are extracted into `standings.swagger.ts`.
* Controller uses reusable docs decorators.
* Swagger UI clearly shows standings and results endpoints.
* Docs explain that standings are computed data.
