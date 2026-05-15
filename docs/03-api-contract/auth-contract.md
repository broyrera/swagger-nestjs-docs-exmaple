# Auth API Contract

## Overview

The Auth API handles user registration, login, and current user profile retrieval.

Authentication is required for managing organizations, competitions, participants, matches, scores, and private competition data.

Participants do not need authentication. Only users who manage the system need accounts.

## Base Path

```txt
/api/v1/auth
```

## Endpoints

| Method | Path        | Auth Required | Description                    |
| ------ | ----------- | ------------: | ------------------------------ |
| POST   | `/register` |            No | Register new user              |
| POST   | `/login`    |            No | Login user                     |
| GET    | `/me`       |           Yes | Get current authenticated user |

---

# POST /api/v1/auth/register

## Purpose

Registers a new user account.

The created user can later create organizations, manage competitions, or receive admin roles.

## Authentication

This endpoint is public.

## Request Body

```json
{
  "name": "Suci Nurul Ilham",
  "email": "suci@example.com",
  "password": "Password123!"
}
```

## Request Fields

| Field    | Type   | Required | Description       |
| -------- | ------ | -------: | ----------------- |
| name     | string |      Yes | User display name |
| email    | string |      Yes | Unique user email |
| password | string |      Yes | User password     |

## Validation Rules

| Field    | Rule                          |
| -------- | ----------------------------- |
| name     | must be a non-empty string    |
| email    | must be a valid email         |
| password | must be at least 8 characters |

## Success Response

HTTP status:

```txt
201 Created
```

Response body:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "usr_123",
      "name": "Suci Nurul Ilham",
      "email": "suci@example.com",
      "role": "USER"
    }
  }
}
```

## Error Responses

### 400 Bad Request

Returned when request validation fails.

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

### 409 Conflict

Returned when email already exists.

```json
{
  "success": false,
  "message": "Email already exists",
  "error": {
    "code": "CONFLICT"
  }
}
```

---

# POST /api/v1/auth/login

## Purpose

Authenticates a user and returns an access token.

## Authentication

This endpoint is public.

## Request Body

```json
{
  "email": "suci@example.com",
  "password": "Password123!"
}
```

## Request Fields

| Field    | Type   | Required | Description   |
| -------- | ------ | -------: | ------------- |
| email    | string |      Yes | User email    |
| password | string |      Yes | User password |

## Success Response

HTTP status:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "jwt-access-token",
    "user": {
      "id": "usr_123",
      "name": "Suci Nurul Ilham",
      "email": "suci@example.com",
      "role": "USER"
    }
  }
}
```

## Error Responses

### 400 Bad Request

Returned when request validation fails.

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

### 401 Unauthorized

Returned when email or password is invalid.

```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": {
    "code": "UNAUTHORIZED"
  }
}
```

---

# GET /api/v1/auth/me

## Purpose

Returns the current authenticated user profile.

## Authentication

This endpoint requires Bearer token.

```txt
Authorization: Bearer <accessToken>
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
  "message": "Current user retrieved successfully",
  "data": {
    "user": {
      "id": "usr_123",
      "name": "Suci Nurul Ilham",
      "email": "suci@example.com",
      "role": "USER"
    }
  }
}
```

## Error Responses

### 401 Unauthorized

Returned when access token is missing, invalid, or expired.

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": {
    "code": "UNAUTHORIZED"
  }
}
```

---

# Auth Contract Notes

## User vs Participant

A user is an authenticated actor.

A participant is a competition entity.

Participants do not need accounts and cannot authenticate unless they are linked to a user.

## Security Rules

The API must never expose:

* password
* password hash
* refresh token raw value
* internal security metadata

## Swagger Documentation Rules

Each Auth endpoint must use reusable API documentation decorators.

Expected docs file:

```txt
src/modules/auth/docs/auth.swagger.ts
```

Expected controller style:

```ts
@Post('login')
@LoginApiDocs()
login(@Body() dto: LoginRequestDto) {
  return this.authService.login(dto);
}
```
