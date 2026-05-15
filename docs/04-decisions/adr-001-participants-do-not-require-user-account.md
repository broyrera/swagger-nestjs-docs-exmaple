# ADR-001: Participants Do Not Require User Accounts

## Status

Accepted

## Context

Lawan PMO Sports is designed for flexible sport and esport competitions.

In many real-world cases, participants do not need to login to the system. For example:

- A futsal organizer may input team names manually.
- A badminton event may only need player display names.
- A casual esport tournament may be managed entirely by one admin.
- A school or office competition may not want every participant to create an account.

If every participant is required to have a user account, the system becomes harder to use for informal competitions.

## Decision

Participants are not required to have user accounts.

The system will separate:

- User: authenticated actor who can login and manage resources.
- Participant: competition entity that appears in matches, brackets, and standings.

A participant may optionally be linked to a user account, but this is not required.

## Consequences

### Positive

- Easier onboarding for informal competitions.
- Organizers can create participants manually.
- Supports casual sport and esport events.
- Flexible enough for both team and individual competitions.

### Negative

- Some participants cannot manage their own data unless linked to a user.
- Additional logic is needed if a participant is later claimed by a user.
- Audit logs apply to user actions, not participant identity.

## API Contract Impact

Participant creation APIs must not require `userId`.

Example:

```json
{
  "type": "TEAM",
  "displayName": "Garuda FC"
}
```

Optional user linking may be supported later:

```json
{
  "linkedUserId": "user-id"
}
```
