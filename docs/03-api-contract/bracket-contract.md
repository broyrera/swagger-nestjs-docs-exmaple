# Bracket API Contract

## Overview

The Bracket API manages knockout bracket views and bracket generation.

A bracket represents participant progression through knockout rounds.

Lawan PMO Sports must support flexible participant counts and should not require perfect bracket numbers such as 4, 8, 16, or 32.

## Base Paths

```txt
/api/v1/competitions/{competitionId}/bracket
/api/v1/bracket-matches
```

## Endpoints

| Method | Path                                             | Auth Required | Description             |
| ------ | ------------------------------------------------ | ------------: | ----------------------- |
| GET    | `/competitions/{competitionId}/bracket`          |           Yes | Get competition bracket |
| POST   | `/competitions/{competitionId}/bracket/generate` |           Yes | Generate bracket        |
| PATCH  | `/bracket-matches/{bracketMatchId}`              |           Yes | Update bracket match    |

---

# Bracket Concepts

## Round

A bracket round groups bracket matches.

Examples:

```txt
Round of 16
Quarterfinal
Semifinal
Final
```

For informal competitions, the round name may be generated or manually defined.

## Bracket Match

A bracket match represents one match slot inside a bracket round.

A bracket match may optionally link to a real match record.

## Participant Slot

A participant slot represents one side of a bracket match.

The slot may contain:

* participant summary
* null participant
* bye marker

## Bye

A bye means a participant advances without playing a match in that round.

This is important for non-perfect participant counts.

Example:

```txt
5 participants:
- Some participants play in Round 1
- Some participants receive a bye into the next round
```

---

# GET /api/v1/competitions/{competitionId}/bracket

## Purpose

Returns the competition bracket tree.

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
  "message": "Bracket retrieved successfully",
  "data": {
    "competitionId": "cmp_123",
    "rounds": [
      {
        "id": "round_1",
        "name": "Semifinal",
        "order": 1,
        "matches": [
          {
            "id": "bm_123",
            "matchId": "mat_123",
            "order": 1,
            "homeSlot": {
              "participant": {
                "id": "par_1",
                "displayName": "Garuda FC"
              },
              "isBye": false
            },
            "awaySlot": {
              "participant": null,
              "isBye": true
            },
            "winnerParticipantId": "par_1",
            "status": "COMPLETED"
          }
        ]
      }
    ]
  }
}
```

## Error Responses

* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`

---

# POST /api/v1/competitions/{competitionId}/bracket/generate

## Purpose

Generates a bracket from approved participants.

This endpoint supports non-perfect participant counts.

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
  "mode": "AUTO",
  "allowByes": true
}
```

## Request Fields

| Field     | Type    | Required | Description                             |
| --------- | ------- | -------: | --------------------------------------- |
| mode      | enum    |      Yes | Bracket generation mode                 |
| allowByes | boolean |      Yes | Whether bracket generation can use byes |

## Success Response

HTTP status:

```txt
201 Created
```

Response body:

```json
{
  "success": true,
  "message": "Bracket generated successfully",
  "data": {
    "competitionId": "cmp_123",
    "rounds": [
      {
        "id": "round_1",
        "name": "Semifinal",
        "order": 1,
        "matches": [
          {
            "id": "bm_123",
            "matchId": "mat_123",
            "order": 1,
            "homeSlot": {
              "participant": {
                "id": "par_1",
                "displayName": "Garuda FC"
              },
              "isBye": false
            },
            "awaySlot": {
              "participant": null,
              "isBye": true
            },
            "winnerParticipantId": "par_1",
            "status": "COMPLETED"
          }
        ]
      }
    ]
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

# PATCH /api/v1/bracket-matches/{bracketMatchId}

## Purpose

Updates a bracket match manually.

This is useful for informal competitions or manual bracket correction.

## Authentication

Requires Bearer token.

## Path Parameters

| Parameter      | Type   | Required | Description      |
| -------------- | ------ | -------: | ---------------- |
| bracketMatchId | string |      Yes | Bracket match ID |

## Request Body

```json
{
  "homeParticipantId": "par_1",
  "awayParticipantId": "par_2",
  "matchId": "mat_123"
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
  "message": "Bracket match updated successfully",
  "data": {
    "id": "bm_123",
    "matchId": "mat_123",
    "order": 1,
    "homeSlot": {
      "participant": {
        "id": "par_1",
        "displayName": "Garuda FC"
      },
      "isBye": false
    },
    "awaySlot": {
      "participant": {
        "id": "par_2",
        "displayName": "Rajawali FC"
      },
      "isBye": false
    },
    "winnerParticipantId": null,
    "status": "SCHEDULED"
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

# Generation Notes

Initial generation mode:

```txt
AUTO
MANUAL
```

## AUTO

The system places approved participants automatically.

AUTO mode may create bye slots if `allowByes` is true.

## MANUAL

The system creates bracket structure but lets the admin manually place participants.

Future versions may support:

* seeded bracket
* random bracket
* regional separation
* custom bracket slots
* double elimination
