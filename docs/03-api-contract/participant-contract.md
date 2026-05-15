# Participant API Contract

## Overview

The Participant API manages competition participants.

A participant is an entity that joins a competition.

A participant can represent:

- an individual player
- a team
- a squad
- a club
- a manually entered name

Participants are not required to have user accounts.

## Important Domain Rule

A participant is not the same as a user.

User:

- can login
- can receive roles
- can manage resources
- can be audited

Participant:

- appears in competition
- appears in matches
- appears in standings
- appears in brackets
- may only have a display name
- does not need login access

## Base Paths

```txt
/api/v1/competitions/{competitionId}/participants
/api/v1/participants
```

## Endpoints

| Method | Path                                         | Auth Required | Description                   |
| ------ | -------------------------------------------- | ------------: | ----------------------------- |
| POST   | `/competitions/{competitionId}/participants` |           Yes | Create participant            |
| GET    | `/competitions/{competitionId}/participants` |           Yes | List competition participants |
| GET    | `/participants/{participantId}`              |           Yes | Get participant detail        |
| PATCH  | `/participants/{participantId}`              |           Yes | Update participant            |
| PATCH  | `/participants/{participantId}/approve`      |           Yes | Approve participant           |
| PATCH  | `/participants/{participantId}/reject`       |           Yes | Reject participant            |
| DELETE | `/participants/{participantId}`              |           Yes | Remove participant            |

---

# Participant Fields

## Participant Type

Possible values:

```txt
INDIVIDUAL
TEAM
```

## Participant Status

Possible values:

```txt
PENDING
APPROVED
REJECTED
REMOVED
```

---

# POST /api/v1/competitions/{competitionId}/participants

## Purpose

Creates a participant inside a competition.

The participant does not need to be linked to a user account.

## Authentication

Requires Bearer token.

## Required Roles

Allowed roles:

- `SUPER_ADMIN`
- `ORGANIZATION_OWNER`
- `COMPETITION_OWNER`
- `COMPETITION_ADMIN`

## Path Parameters

| Parameter     | Type   | Required | Description    |
| ------------- | ------ | -------: | -------------- |
| competitionId | string |      Yes | Competition ID |

## Request Body

### Team participant

```json
{
  "type": "TEAM",
  "displayName": "Garuda FC"
}
```

### Individual participant

```json
{
  "type": "INDIVIDUAL",
  "displayName": "Budi"
}
```

### Optional linked user

```json
{
  "type": "INDIVIDUAL",
  "displayName": "Budi",
  "linkedUserId": "usr_123"
}
```

## Request Fields

| Field        | Type   | Required | Description                                 |
| ------------ | ------ | -------: | ------------------------------------------- |
| type         | enum   |      Yes | Participant type                            |
| displayName  | string |      Yes | Name shown in competition                   |
| linkedUserId | string |       No | Optional user account linked to participant |

## Success Response

HTTP status:

```txt
201 Created
```

Response body:

```json
{
  "success": true,
  "message": "Participant created successfully",
  "data": {
    "id": "par_123",
    "competitionId": "cmp_123",
    "type": "TEAM",
    "displayName": "Garuda FC",
    "linkedUserId": null,
    "status": "PENDING"
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

# GET /api/v1/competitions/{competitionId}/participants

## Purpose

Returns participants in a competition.

## Authentication

Requires Bearer token.

## Query Parameters

| Parameter | Type | Required | Description                  |
| --------- | ---- | -------: | ---------------------------- |
| type      | enum |       No | Filter by participant type   |
| status    | enum |       No | Filter by participant status |

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Participants retrieved successfully",
  "data": [
    {
      "id": "par_123",
      "competitionId": "cmp_123",
      "type": "TEAM",
      "displayName": "Garuda FC",
      "linkedUserId": null,
      "status": "PENDING"
    }
  ]
}
```

## Error Responses

- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

---

# GET /api/v1/participants/{participantId}

## Purpose

Returns participant detail.

## Authentication

Requires Bearer token.

## Path Parameters

| Parameter     | Type   | Required | Description    |
| ------------- | ------ | -------: | -------------- |
| participantId | string |      Yes | Participant ID |

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Participant retrieved successfully",
  "data": {
    "id": "par_123",
    "competitionId": "cmp_123",
    "type": "TEAM",
    "displayName": "Garuda FC",
    "linkedUserId": null,
    "status": "PENDING"
  }
}
```

## Error Responses

- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

---

# PATCH /api/v1/participants/{participantId}

## Purpose

Updates participant information.

## Authentication

Requires Bearer token.

## Request Body

```json
{
  "displayName": "Garuda FC Updated",
  "linkedUserId": "usr_123"
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
  "message": "Participant updated successfully",
  "data": {
    "id": "par_123",
    "competitionId": "cmp_123",
    "type": "TEAM",
    "displayName": "Garuda FC Updated",
    "linkedUserId": "usr_123",
    "status": "PENDING"
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

# PATCH /api/v1/participants/{participantId}/approve

## Purpose

Approves a participant.

Approved participants can be used for match generation, standings, and brackets.

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
  "message": "Participant approved successfully",
  "data": {
    "id": "par_123",
    "competitionId": "cmp_123",
    "type": "TEAM",
    "displayName": "Garuda FC",
    "linkedUserId": null,
    "status": "APPROVED"
  }
}
```

## Error Responses

- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`

---

# PATCH /api/v1/participants/{participantId}/reject

## Purpose

Rejects a participant.

Rejected participants should not be used for active match generation.

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
  "message": "Participant rejected successfully",
  "data": {
    "id": "par_123",
    "competitionId": "cmp_123",
    "type": "TEAM",
    "displayName": "Garuda FC",
    "linkedUserId": null,
    "status": "REJECTED"
  }
}
```

## Error Responses

- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`

---

# DELETE /api/v1/participants/{participantId}

## Purpose

Removes a participant.

DELETE here means marking the participant as `REMOVED`, not permanently deleting the participant record.

This action may be blocked if the participant is already used in locked matches.

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
  "message": "Participant removed successfully",
  "data": {
    "id": "par_123",
    "competitionId": "cmp_123",
    "type": "TEAM",
    "displayName": "Garuda FC",
    "linkedUserId": null,
    "status": "REMOVED"
  }
}
```

## Error Responses

- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
