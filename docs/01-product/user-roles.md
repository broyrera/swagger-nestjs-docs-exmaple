# User Roles

## Overview

In Lawan PMO Sports, users are authenticated actors who can access and manage system resources.

Users are different from participants.

A participant may appear in a competition without having a user account. A user is someone who can login, receive permissions, and perform actions in the system.

## Role Scope

Roles are divided by scope:

1. Global role
2. Organization role
3. Competition role

This separation is important because a user may have different access levels in different contexts.

Example:

- A user can be an organization owner in one organization.
- The same user can be only a score admin in another competition.
- A participant may not have any user role at all.

## Global Roles

### SUPER_ADMIN

A platform-level administrator.

Responsibilities:

- Manage platform-wide data
- Access all organizations
- Access all competitions
- Resolve system-level issues

This role should be limited to internal maintainers.

### USER

A regular authenticated user.

Responsibilities:

- Create organizations
- Join organizations if invited
- Manage competitions if granted access
- View private resources if permitted

## Organization Roles

### ORGANIZATION_OWNER

The highest role inside an organization.

Permissions:

- Manage organization profile
- Invite organization members
- Remove organization members
- Create competitions
- Manage all competitions under the organization
- Assign organization admins

### ORGANIZATION_ADMIN

An admin inside an organization.

Permissions:

- Create competitions
- Manage competitions assigned to the organization
- Help manage members depending on organization policy

### ORGANIZATION_MEMBER

A regular member inside an organization.

Permissions:

- View organization resources
- Access competitions if granted permission

## Competition Roles

### COMPETITION_OWNER

The main owner of a competition.

Permissions:

- Update competition settings
- Publish competition
- Archive competition
- Manage participants
- Manage matches
- Assign competition admins
- Assign score admins

### COMPETITION_ADMIN

An admin for a specific competition.

Permissions:

- Manage participants
- Manage matches
- Input and update scores
- Generate standings
- Manage bracket data

### SCORE_ADMIN

A user who is only allowed to manage match scores.

Permissions:

- View assigned matches
- Input match scores
- Update match scores before final confirmation

### VIEWER

A user who can view competition data.

Permissions:

- View private competition data if granted access
- Cannot modify competition data

## Important Rule

Roles are assigned to users, not participants.

Participants may be linked to users, but the participant itself does not receive RBAC permissions.
