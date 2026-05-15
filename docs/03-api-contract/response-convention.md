# Response Convention

## Overview

This document defines the success response convention for Lawan PMO Sports APIs.

A consistent response structure helps frontend developers, API consumers, and testers understand the API contract.

## Single Resource Response

Use this structure when returning a single resource.

```json
{
  "success": true,
  "message": "Competition retrieved successfully",
  "data": {
    "id": "competition-id",
    "name": "Futsal RT Cup 2026"
  }
}
```

## Collection Response

Use this structure when returning an array.

```json
{
  "success": true,
  "message": "Competitions retrieved successfully",
  "data": [
    {
      "id": "competition-id",
      "name": "Futsal RT Cup 2026"
    }
  ]
}
```

## Paginated Response

Use this structure when returning paginated data.

```json
{
  "success": true,
  "message": "Competitions retrieved successfully",
  "data": [
    {
      "id": "competition-id",
      "name": "Futsal RT Cup 2026"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Command Response

Use this structure when an action succeeds but does not need to return a large resource.

Example:

```json
{
  "success": true,
  "message": "Competition published successfully",
  "data": {
    "id": "competition-id",
    "status": "PUBLISHED"
  }
}
```

## Field Rules

### success

Boolean value indicating whether the request succeeded.

For success responses, this must be:

```json
true
```

### message

Human-readable message.

The message should be clear but not used by clients as business logic.

### data

Main response payload.

The shape depends on the endpoint.

### meta

Optional metadata.

Used for pagination or additional response context.

## API Contract Rule

Every success response DTO must represent this convention.

Avoid returning raw values directly.

Good:

```json
{
  "success": true,
  "message": "Match score updated successfully",
  "data": {
    "matchId": "match-id",
    "status": "COMPLETED"
  }
}
```

Avoid:

```json
{
  "matchId": "match-id",
  "status": "COMPLETED"
}
```

## Message Style

Use past-tense success messages.

Examples:

```txt
User registered successfully
Competition created successfully
Participants retrieved successfully
Match score updated successfully
Competition published successfully
```
