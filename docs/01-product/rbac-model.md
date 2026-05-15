# RBAC Model

## Overview

RBAC stands for Role-Based Access Control.

Lawan PMO Sports uses RBAC to control which authenticated users can perform actions in the system.

RBAC applies to users, not participants.

## Core Principle

Only authenticated users can receive permissions.

Participants do not need to login and do not need roles.

## Access Control Layers

The system uses multiple access control layers:

1. Authentication
2. Global authorization
3. Organization authorization
4. Competition authorization
5. Resource ownership validation

## Authentication

Authentication verifies who the user is.

Example:

```txt
GET /auth/me
```

requires a valid access token.

## Authorization

Authorization verifies what the user can do.

Example:

```txt
PATCH /competitions/{competitionId}/publish
```

requires the user to be one of:

* SUPER_ADMIN
* ORGANIZATION_OWNER
* COMPETITION_OWNER

## Permission Matrix

| Action                     | SUPER_ADMIN | ORG_OWNER | ORG_ADMIN | COMP_OWNER | COMP_ADMIN | SCORE_ADMIN | VIEWER |
| -------------------------- | ----------: | --------: | --------: | ---------: | ---------: | ----------: | -----: |
| Create organization        |         Yes |       Yes |       Yes |        Yes |        Yes |         Yes |    Yes |
| Update organization        |         Yes |       Yes |        No |         No |         No |          No |     No |
| Invite organization member |         Yes |       Yes |  Optional |         No |         No |          No |     No |
| Create competition         |         Yes |       Yes |       Yes |         No |         No |          No |     No |
| Update competition         |         Yes |       Yes |  Optional |        Yes |         No |          No |     No |
| Publish competition        |         Yes |       Yes |        No |        Yes |         No |          No |     No |
| Manage participants        |         Yes |       Yes |  Optional |        Yes |        Yes |          No |     No |
| Create matches             |         Yes |       Yes |  Optional |        Yes |        Yes |          No |     No |
| Input score                |         Yes |       Yes |  Optional |        Yes |        Yes |         Yes |     No |
| View private competition   |         Yes |       Yes |       Yes |        Yes |        Yes |         Yes |    Yes |
| View public competition    |         Yes |       Yes |       Yes |        Yes |        Yes |         Yes |    Yes |

## Public vs Private Competition

A competition can be public or private.

### Public Competition

Anyone can view:

* competition detail
* participants
* matches
* standings
* bracket
* results

### Private Competition

Only authorized users can view the competition.

Private competitions are useful for:

* internal events
* draft competitions
* invitation-only tournaments
* testing before publish

## API Contract Impact

Every protected endpoint must document:

* authentication requirement
* required role
* possible `401 Unauthorized`
* possible `403 Forbidden`

Example Swagger documentation note:

```txt
Requires Bearer token.
Allowed roles: COMPETITION_OWNER, COMPETITION_ADMIN.
```

## Error Behavior

### 401 Unauthorized

Returned when the request does not include a valid access token.

### 403 Forbidden

Returned when the user is authenticated but does not have permission to perform the action.

## Important Rule

Do not use participant identity for authorization.

Authorization must be based on authenticated user roles and resource access.
