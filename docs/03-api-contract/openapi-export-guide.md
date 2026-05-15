# OpenAPI Export Guide

## Overview

Lawan PMO Sports uses Swagger/OpenAPI generated from NestJS source code as the API contract source of truth.

The OpenAPI document can be exported as JSON and used by:

- frontend developers
- QA engineers
- API client generators
- contract testing tools
- documentation portals
- CI/CD validation

## Source of Truth

The source of truth is not a manually written Postman collection.

The source of truth is generated from:

- NestJS controllers
- request DTOs
- response DTOs
- Swagger decorators
- reusable API documentation decorators

## Runtime Swagger UI

During development, Swagger UI is available at:

```txt
http://localhost:3000/docs
```

The API itself uses global prefix:

```txt
/api/v1
```

## Recommended Export Path

Use this path for generated OpenAPI output:

```txt
openapi/openapi.json
```

Suggested folder:

```txt
openapi/
  openapi.json
```

## Export Strategy

There are two common strategies.

## Strategy 1: Runtime Endpoint Export

Expose the OpenAPI JSON through Swagger UI setup.

This is useful for local development and external tools.

Example URL:

```txt
http://localhost:3000/docs-json
```

Depending on Swagger setup, NestJS can expose the JSON definition from the Swagger module.

## Strategy 2: Script-Based Export

Create a script that boots the NestJS app, generates the OpenAPI document, writes it to a JSON file, then closes the app.

This is useful for CI/CD.

Example script location:

```txt
scripts/export-openapi.ts
```

Expected output:

```txt
openapi/openapi.json
```

## Why Export OpenAPI

Exported OpenAPI can be used to:

- generate frontend API clients
- import into Postman
- validate API changes
- review contract diffs
- share API contract without running the backend

## Contract Review Flow

Before exporting OpenAPI:

1. Run build.
2. Run tests if available.
3. Start Swagger locally.
4. Review Swagger UI manually.
5. Export OpenAPI JSON.
6. Commit or publish the generated file depending on project policy.

## Suggested Commands

```bash
npm run build
npm run start:dev
```

Then open:

```txt
http://localhost:3000/docs
```

## Future CI/CD Plan

Future versions may add:

```bash
npm run openapi:export
npm run openapi:lint
npm run openapi:diff
```

Potential tools:

- OpenAPI Generator
- Swagger CLI
- Redocly CLI
- Schemathesis
- Dredd

## Repository Policy

For this learning project, the OpenAPI export may be committed later after the API contract stabilizes.

During early learning phases, the generated Swagger UI is enough.

Once the API contract is reviewed and stable, export `openapi/openapi.json`.
