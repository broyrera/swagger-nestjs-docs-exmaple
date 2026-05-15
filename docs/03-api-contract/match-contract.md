# Match API Contract

## Overview

The Match API manages competition matches and scores.

A match represents a scheduled or completed contest between two participants.

Matches are used later to calculate standings, brackets, and results.

## Base Paths

```txt
/api/v1/competitions/{competitionId}/matches
/api/v1/matches
```

## Endpoints

| Method | Path                                    | Auth Required | Description              |
| ------ | --------------------------------------- | ------------: | ------------------------ |
| POST   | `/competitions/{competitionId}/matches` |           Yes | Create match             |
| GET    | `/competitions/{competitionId}/matches` |           Yes | List competition matches |
| GET    | `/matches/{matchId}`                    |           Yes | Get match detail         |
| PATCH  | `/matches/{matchId}`                    |           Yes | Update match             |
| PATCH  | `/matches/{matchId}/score`              |           Yes | Input match score        |
| PATCH  | `/matches/{matchId}/status`             |           Yes | Update match status      |

---

# Match Fields

## Match Status

Possible values:

```txt
SCHEDULED
ONGOING
COMPLETED
DISPUTED
CANCELLED
```

## Match Score

A score contains:

* home score
* away score

Scores must be zero or positive.

---

# POST /api/v1/competitions/{competitionId}/matches

## Purpose

Creates a match inside a competition.

This supports manual match creation for informal competitions.

## Authentication

Requires Bearer token.

## Required Roles

Allowed roles:

* `SUPER_ADMIN`
* `ORGANIZATION_OWNER`
* `COMPETITION_OWNER`
* `COMPETITION_ADMIN`

## Path Parameters

| Parameter     | Type   | Required | Description    |
| ------------- | ------ | -------: | -------------- |
| competitionId | string |      Yes | Competition ID |

## Request Body

```json
{
  "homeParticipantId": "par_home",
  "awayParticipantId": "par_away",
  "scheduledAt": "2026-06-01T10:00:00.000Z"
}
```

## Request Fields

| Field             | Type            | Required | Description          |
| ----------------- | --------------- | -------: | -------------------- |
| homeParticipantId | string          |      Yes | Home participant ID  |
| awayParticipantId | string          |      Yes | Away participant ID  |
| scheduledAt       | string datetime |       No | Scheduled match time |

## Success Response

HTTP status:

```txt
201 Created
```

Response body:

```json
{
  "success": true,
  "message": "Match created successfully",
  "data": {
    "id": "mat_123",
    "competitionId": "cmp_123",
    "homeParticipant": {
      "id": "par_home",
      "displayName": "Garuda FC"
    },
    "awayParticipant": {
      "id": "par_away",
      "displayName": "Rajawali FC"
    },
    "score": null,
    "status": "SCHEDULED",
    "scheduledAt": "2026-06-01T10:00:00.000Z"
  }
}
```

## Error Responses

* `400 Bad Request`
* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`
* `409 Conflict`

---

# GET /api/v1/competitions/{competitionId}/matches

## Purpose

Returns matches in a competition.

## Authentication

Requires Bearer token.

## Query Parameters

| Parameter | Type | Required | Description            |
| --------- | ---- | -------: | ---------------------- |
| status    | enum |       No | Filter by match status |

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Matches retrieved successfully",
  "data": [
    {
      "id": "mat_123",
      "competitionId": "cmp_123",
      "homeParticipant": {
        "id": "par_home",
        "displayName": "Garuda FC"
      },
      "awayParticipant": {
        "id": "par_away",
        "displayName": "Rajawali FC"
      },
      "score": {
        "homeScore": 2,
        "awayScore": 1
      },
      "status": "COMPLETED",
      "scheduledAt": "2026-06-01T10:00:00.000Z"
    }
  ]
}
```

## Error Responses

* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`

---

# GET /api/v1/matches/{matchId}

## Purpose

Returns match detail.

## Authentication

Requires Bearer token.

## Path Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------: | ----------- |
| matchId   | string |      Yes | Match ID    |

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Match retrieved successfully",
  "data": {
    "id": "mat_123",
    "competitionId": "cmp_123",
    "homeParticipant": {
      "id": "par_home",
      "displayName": "Garuda FC"
    },
    "awayParticipant": {
      "id": "par_away",
      "displayName": "Rajawali FC"
    },
    "score": {
      "homeScore": 2,
      "awayScore": 1
    },
    "status": "COMPLETED",
    "scheduledAt": "2026-06-01T10:00:00.000Z"
  }
}
```

## Error Responses

* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`

---

# PATCH /api/v1/matches/{matchId}

## Purpose

Updates match metadata.

## Authentication

Requires Bearer token.

## Request Body

```json
{
  "scheduledAt": "2026-06-01T12:00:00.000Z"
}
```

Possible editable fields:

* home participant ID
* away participant ID
* scheduled time

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Match updated successfully",
  "data": {
    "id": "mat_123",
    "competitionId": "cmp_123",
    "homeParticipant": {
      "id": "par_home",
      "displayName": "Garuda FC"
    },
    "awayParticipant": {
      "id": "par_away",
      "displayName": "Rajawali FC"
    },
    "score": null,
    "status": "SCHEDULED",
    "scheduledAt": "2026-06-01T12:00:00.000Z"
  }
}
```

## Error Responses

* `400 Bad Request`
* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`
* `409 Conflict`

---

# PATCH /api/v1/matches/{matchId}/score

## Purpose

Inputs or updates match score.

## Authentication

Requires Bearer token.

## Required Roles

Allowed roles:

* `SUPER_ADMIN`
* `ORGANIZATION_OWNER`
* `COMPETITION_OWNER`
* `COMPETITION_ADMIN`
* `SCORE_ADMIN`

## Request Body

```json
{
  "homeScore": 2,
  "awayScore": 1
}
```

## Request Fields

| Field     | Type   | Required | Description            |
| --------- | ------ | -------: | ---------------------- |
| homeScore | number |      Yes | Home participant score |
| awayScore | number |      Yes | Away participant score |

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Match score updated successfully",
  "data": {
    "id": "mat_123",
    "competitionId": "cmp_123",
    "homeParticipant": {
      "id": "par_home",
      "displayName": "Garuda FC"
    },
    "awayParticipant": {
      "id": "par_away",
      "displayName": "Rajawali FC"
    },
    "score": {
      "homeScore": 2,
      "awayScore": 1
    },
    "status": "COMPLETED",
    "scheduledAt": "2026-06-01T10:00:00.000Z"
  }
}
```

## Error Responses

* `400 Bad Request`
* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`
* `409 Conflict`

---

# PATCH /api/v1/matches/{matchId}/status

## Purpose

Updates match status manually.

## Authentication

Requires Bearer token.

## Request Body

```json
{
  "status": "CANCELLED"
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
  "message": "Match status updated successfully",
  "data": {
    "id": "mat_123",
    "competitionId": "cmp_123",
    "homeParticipant": {
      "id": "par_home",
      "displayName": "Garuda FC"
    },
    "awayParticipant": {
      "id": "par_away",
      "displayName": "Rajawali FC"
    },
    "score": null,
    "status": "CANCELLED",
    "scheduledAt": "2026-06-01T10:00:00.000Z"
  }
}
```

## Error Responses

* `400 Bad Request`
* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`
* `409 Conflict`
