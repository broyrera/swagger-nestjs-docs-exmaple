# Participant Model

## Overview

In Lawan PMO Sports, a participant is an entity that joins a competition.

A participant does not always represent an authenticated user. This is intentional because many real-world competitions involve teams or players who do not need to create accounts.

## Key Rule

Participants are not required to have user accounts.

Only users who manage the system need authentication and authorization.

## Participant Types

### Individual Participant

An individual participant represents a single person.

Example:

```json
{
  "type": "INDIVIDUAL",
  "displayName": "Budi"
}
```

### Team Participant

A team participant represents a group, team, squad, or club.

Example:

```json
{
  "type": "TEAM",
  "displayName": "Garuda FC"
}
```

## Optional User Link

A participant may optionally be linked to a user account.

This is useful when:

- A player wants to manage their own profile.
- A team manager wants to manage team registration.
- A participant needs access to private information.

Example:

```json
{
  "type": "INDIVIDUAL",
  "displayName": "Budi",
  "linkedUserId": "optional-user-id"
}
```

## Important Distinction

User:

- Can login
- Can receive roles
- Can manage resources
- Can be audited

Participant:

- Appears in competition
- Appears in bracket
- Appears in standings
- May only be a display name
- Does not need login access

## Business Rule

A competition can contain participants that are:

- manually created by organizer
- registered by authenticated users
- imported from a list
- linked to user accounts later
