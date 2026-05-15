# Organization API Contract

## Overview

The Organization API manages organization resources.

An organization represents a community, club, school, office, event committee, or team of organizers that can create and manage competitions.

## Base Path

```txt
/api/v1/organizations
```

## Endpoints

| Method | Path                        | Auth Required | Description                   |
| ------ | --------------------------- | ------------: | ----------------------------- |
| POST   | `/`                         |           Yes | Create organization           |
| GET    | `/`                         |           Yes | List accessible organizations |
| GET    | `/{organizationId}`         |           Yes | Get organization detail       |
| POST   | `/{organizationId}/members` |           Yes | Add organization member       |

---

# POST /api/v1/organizations

## Purpose

Creates a new organization.

The authenticated user who creates the organization becomes the organization owner.

## Authentication

Requires Bearer token.

## Request Body

```json
{
  "name": "Garuda Sports Community",
  "description": "Community for sport and esport events."
}
```

## Request Fields

| Field       | Type   | Required | Description              |
| ----------- | ------ | -------: | ------------------------ |
| name        | string |      Yes | Organization name        |
| description | string |       No | Organization description |

## Success Response

HTTP status:

```txt
201 Created
```

Response body:

```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "id": "org_123",
    "name": "Garuda Sports Community",
    "description": "Community for sport and esport events.",
    "currentUserRole": "ORGANIZATION_OWNER"
  }
}
```

## Error Responses

- `400 Bad Request`
- `401 Unauthorized`

---

# GET /api/v1/organizations

## Purpose

Returns organizations accessible to the current authenticated user.

## Authentication

Requires Bearer token.

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Organizations retrieved successfully",
  "data": [
    {
      "id": "org_123",
      "name": "Garuda Sports Community",
      "description": "Community for sport and esport events.",
      "currentUserRole": "ORGANIZATION_OWNER"
    }
  ]
}
```

## Error Responses

- `401 Unauthorized`

---

# GET /api/v1/organizations/{organizationId}

## Purpose

Returns organization detail.

## Authentication

Requires Bearer token.

## Path Parameters

| Parameter      | Type   | Required | Description     |
| -------------- | ------ | -------: | --------------- |
| organizationId | string |      Yes | Organization ID |

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Organization retrieved successfully",
  "data": {
    "id": "org_123",
    "name": "Garuda Sports Community",
    "description": "Community for sport and esport events.",
    "currentUserRole": "ORGANIZATION_OWNER"
  }
}
```

## Error Responses

- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

---

# POST /api/v1/organizations/{organizationId}/members

## Purpose

Adds a user as an organization member.

Only authorized organization users can add members.

## Authentication

Requires Bearer token.

## Required Roles

Allowed roles:

- `SUPER_ADMIN`
- `ORGANIZATION_OWNER`
- `ORGANIZATION_ADMIN` depending on organization policy

## Path Parameters

| Parameter      | Type   | Required | Description     |
| -------------- | ------ | -------: | --------------- |
| organizationId | string |      Yes | Organization ID |

## Request Body

```json
{
  "email": "member@example.com",
  "role": "ORGANIZATION_ADMIN"
}
```

## Request Fields

| Field | Type   | Required | Description       |
| ----- | ------ | -------: | ----------------- |
| email | string |      Yes | User email to add |
| role  | string |      Yes | Organization role |

Allowed role values:

```txt
ORGANIZATION_OWNER
ORGANIZATION_ADMIN
ORGANIZATION_MEMBER
```

## Success Response

HTTP status:

```txt
201 Created
```

Response body:

```json
{
  "success": true,
  "message": "Organization member added successfully",
  "data": {
    "id": "mem_123",
    "userId": "usr_456",
    "email": "member@example.com",
    "role": "ORGANIZATION_ADMIN"
  }
}
```

## Error Responses

- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
