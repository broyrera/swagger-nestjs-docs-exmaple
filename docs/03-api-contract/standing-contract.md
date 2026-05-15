# Standings and Results API Contract

## Overview

The Standings API provides computed competition standings and match results.

Standings are calculated from participants, matches, and submitted scores.

This API is read-only in the current sprint.

## Base Path

```txt
/api/v1/competitions/{competitionId}
```

## Endpoints

| Method | Path         | Auth Required | Description               |
| ------ | ------------ | ------------: | ------------------------- |
| GET    | `/standings` |           Yes | Get competition standings |
| GET    | `/results`   |           Yes | Get competition results   |

---

# GET /api/v1/competitions/{competitionId}/standings

## Purpose

Returns computed standings for a competition.

Standings are generated from approved participants and completed matches.

## Authentication

Requires Bearer token.

## Path Parameters

| Parameter     | Type   | Required | Description    |
| ------------- | ------ | -------: | -------------- |
| competitionId | string |      Yes | Competition ID |

## Standing Fields

| Field           | Type   | Description                      |
| --------------- | ------ | -------------------------------- |
| rank            | number | Participant rank                 |
| participant     | object | Participant summary              |
| played          | number | Total matches played             |
| won             | number | Total matches won                |
| drawn           | number | Total matches drawn              |
| lost            | number | Total matches lost               |
| scoreFor        | number | Total score/goals/points for     |
| scoreAgainst    | number | Total score/goals/points against |
| scoreDifference | number | scoreFor minus scoreAgainst      |
| points          | number | Standing points                  |

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Standings retrieved successfully",
  "data": [
    {
      "rank": 1,
      "participant": {
        "id": "par_123",
        "displayName": "Garuda FC"
      },
      "played": 3,
      "won": 2,
      "drawn": 1,
      "lost": 0,
      "scoreFor": 7,
      "scoreAgainst": 3,
      "scoreDifference": 4,
      "points": 7
    }
  ]
}
```

## Error Responses

* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`

---

# GET /api/v1/competitions/{competitionId}/results

## Purpose

Returns competition match results.

This endpoint focuses on completed matches and result-related match data.

## Authentication

Requires Bearer token.

## Path Parameters

| Parameter     | Type   | Required | Description    |
| ------------- | ------ | -------: | -------------- |
| competitionId | string |      Yes | Competition ID |

## Query Parameters

| Parameter | Type | Required | Description                     |
| --------- | ---- | -------: | ------------------------------- |
| status    | enum |       No | Filter result matches by status |

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Results retrieved successfully",
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

# Computation Notes

Standings are computed from match scores.

Default point rule:

```txt
Win  = 3 points
Draw = 1 point
Loss = 0 points
```

Future versions may support custom point rules and tie breaker rules.
