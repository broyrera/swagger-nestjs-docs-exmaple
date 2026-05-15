# Error Convention

## Overview

This document defines the error response convention for Lawan PMO Sports APIs.

A consistent error structure helps API consumers handle failures predictably.

## Standard Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "email must be an email"
      }
    ]
  }
}
```

## Field Rules

### success

For error responses, this must be:

```json
false
```

### message

Human-readable error message.

### error.code

Machine-readable error code.

Clients may use this field for error handling.

### error.details

Optional detailed error information.

Useful for validation errors.

## Common Error Codes

| HTTP Status | Code                  | Meaning                                       |
| ----------: | --------------------- | --------------------------------------------- |
|         400 | VALIDATION_ERROR      | Request validation failed                     |
|         400 | BAD_REQUEST           | Request is malformed                          |
|         401 | UNAUTHORIZED          | User is not authenticated                     |
|         403 | FORBIDDEN             | User does not have permission                 |
|         404 | NOT_FOUND             | Requested resource does not exist             |
|         409 | CONFLICT              | Request conflicts with current resource state |
|         500 | INTERNAL_SERVER_ERROR | Unexpected server error                       |

## Validation Error

Used when request data fails validation.

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "format",
        "message": "format must be one of SINGLE_MATCH, ROUND_ROBIN, GROUP_STAGE, KNOCKOUT, GROUP_STAGE_KNOCKOUT, LEAGUE, TWO_LEGGED_TIE"
      }
    ]
  }
}
```

## Unauthorized Error

Used when request does not include valid authentication.

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": {
    "code": "UNAUTHORIZED"
  }
}
```

## Forbidden Error

Used when authenticated user does not have permission.

```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "error": {
    "code": "FORBIDDEN"
  }
}
```

## Not Found Error

Used when requested resource does not exist.

```json
{
  "success": false,
  "message": "Competition not found",
  "error": {
    "code": "NOT_FOUND"
  }
}
```

## Conflict Error

Used when request violates a business state rule.

Example: publishing an archived competition.

```json
{
  "success": false,
  "message": "Archived competition cannot be published",
  "error": {
    "code": "CONFLICT"
  }
}
```

## API Contract Rule

Every endpoint must document expected error responses in Swagger.

Protected endpoints should usually document:

* `401 Unauthorized`
* `403 Forbidden`

Resource lookup endpoints should usually document:

* `404 Not Found`

Lifecycle endpoints should usually document:

* `409 Conflict`
