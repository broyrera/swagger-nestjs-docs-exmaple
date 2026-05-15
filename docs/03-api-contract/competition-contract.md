# Competition API Contract

## Overview

The Competition API manages competition resources.

A competition represents a sport or esport event that contains participants, matches, scores, standings, and brackets.

A competition belongs to an organization.

## Base Path

```txt
/api/v1/competitions
```

## Endpoints

| Method | Path                       | Auth Required | Description                  |
| ------ | -------------------------- | ------------: | ---------------------------- |
| POST   | `/`                        |           Yes | Create competition           |
| GET    | `/`                        |           Yes | List accessible competitions |
| GET    | `/{competitionId}`         |           Yes | Get competition detail       |
| PATCH  | `/{competitionId}`         |           Yes | Update competition           |
| PATCH  | `/{competitionId}/publish` |           Yes | Publish competition          |
| PATCH  | `/{competitionId}/archive` |           Yes | Archive competition          |

---

# Competition Fields

## Competition Type

Possible values:

```txt
SPORT
ESPORT
```

## Competition Format

Possible values:

```txt
SINGLE_MATCH
ROUND_ROBIN
GROUP_STAGE
KNOCKOUT
GROUP_STAGE_KNOCKOUT
LEAGUE
TWO_LEGGED_TIE
```

## Competition Visibility

Possible values:

```txt
PUBLIC
PRIVATE
```

## Competition Status

Possible values:

```txt
DRAFT
PUBLISHED
ARCHIVED
```

---

# POST /api/v1/competitions

## Purpose

Creates a new competition under an organization.

The authenticated user must have access to create competitions under the target organization.

## Authentication

Requires Bearer token.

## Required Roles

Allowed roles:

- `SUPER_ADMIN`
- `ORGANIZATION_OWNER`
- `ORGANIZATION_ADMIN`

## Request Body

```json
{
  "organizationId": "org_123",
  "name": "Futsal RT Cup 2026",
  "description": "Community futsal competition.",
  "type": "SPORT",
  "format": "GROUP_STAGE_KNOCKOUT",
  "visibility": "PUBLIC"
}
```

## Request Fields

| Field          | Type   | Required | Description             |
| -------------- | ------ | -------: | ----------------------- |
| organizationId | string |      Yes | Owner organization ID   |
| name           | string |      Yes | Competition name        |
| description    | string |       No | Competition description |
| type           | enum   |      Yes | Competition type        |
| format         | enum   |      Yes | Competition format      |
| visibility     | enum   |      Yes | Competition visibility  |

## Success Response

HTTP status:

```txt
201 Created
```

Response body:

```json
{
  "success": true,
  "message": "Competition created successfully",
  "data": {
    "id": "cmp_123",
    "organizationId": "org_123",
    "name": "Futsal RT Cup 2026",
    "description": "Community futsal competition.",
    "type": "SPORT",
    "format": "GROUP_STAGE_KNOCKOUT",
    "visibility": "PUBLIC",
    "status": "DRAFT"
  }
}
```

## Error Responses

- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

---

# GET /api/v1/competitions

## Purpose

Returns competitions accessible to the current authenticated user.

## Authentication

Requires Bearer token.

## Query Parameters

| Parameter      | Type   | Required | Description                  |
| -------------- | ------ | -------: | ---------------------------- |
| organizationId | string |       No | Filter by organization ID    |
| type           | enum   |       No | Filter by competition type   |
| format         | enum   |       No | Filter by competition format |
| status         | enum   |       No | Filter by competition status |

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Competitions retrieved successfully",
  "data": [
    {
      "id": "cmp_123",
      "organizationId": "org_123",
      "name": "Futsal RT Cup 2026",
      "description": "Community futsal competition.",
      "type": "SPORT",
      "format": "GROUP_STAGE_KNOCKOUT",
      "visibility": "PUBLIC",
      "status": "DRAFT"
    }
  ]
}
```

## Error Responses

- `401 Unauthorized`

---

# GET /api/v1/competitions/{competitionId}

## Purpose

Returns competition detail.

## Authentication

Requires Bearer token.

## Path Parameters

| Parameter     | Type   | Required | Description    |
| ------------- | ------ | -------: | -------------- |
| competitionId | string |      Yes | Competition ID |

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Competition retrieved successfully",
  "data": {
    "id": "cmp_123",
    "organizationId": "org_123",
    "name": "Futsal RT Cup 2026",
    "description": "Community futsal competition.",
    "type": "SPORT",
    "format": "GROUP_STAGE_KNOCKOUT",
    "visibility": "PUBLIC",
    "status": "DRAFT"
  }
}
```

## Error Responses

- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

---

# PATCH /api/v1/competitions/{competitionId}

## Purpose

Updates competition information.

## Authentication

Requires Bearer token.

## Request Body

```json
{
  "name": "Futsal RT Cup 2026 Updated",
  "description": "Updated description.",
  "visibility": "PRIVATE"
}
```

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Competition updated successfully",
  "data": {
    "id": "cmp_123",
    "organizationId": "org_123",
    "name": "Futsal RT Cup 2026 Updated",
    "description": "Updated description.",
    "type": "SPORT",
    "format": "GROUP_STAGE_KNOCKOUT",
    "visibility": "PRIVATE",
    "status": "DRAFT"
  }
}
```

## Error Responses

- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`

---

# PATCH /api/v1/competitions/{competitionId}/publish

## Purpose

Publishes a draft competition.

## Authentication

Requires Bearer token.

## Business Rules

- Draft competition can be published.
- Archived competition cannot be published.
- Published competition should not be published again.

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Competition published successfully",
  "data": {
    "id": "cmp_123",
    "organizationId": "org_123",
    "name": "Futsal RT Cup 2026",
    "description": "Community futsal competition.",
    "type": "SPORT",
    "format": "GROUP_STAGE_KNOCKOUT",
    "visibility": "PUBLIC",
    "status": "PUBLISHED"
  }
}
```

## Error Responses

- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`

---

# PATCH /api/v1/competitions/{competitionId}/archive

## Purpose

Archives a competition.

## Authentication

Requires Bearer token.

## Business Rules

- Draft competition can be archived.
- Published competition can be archived.
- Archived competition should be treated as read-only for most operations.

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Competition archived successfully",
  "data": {
    "id": "cmp_123",
    "organizationId": "org_123",
    "name": "Futsal RT Cup 2026",
    "description": "Community futsal competition.",
    "type": "SPORT",
    "format": "GROUP_STAGE_KNOCKOUT",
    "visibility": "PUBLIC",
    "status": "ARCHIVED"
  }
}
```

## Error Responses

- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
