# Lawan PMO Sports — Product Vision

## Summary

Lawan PMO Sports is a flexible sport and esport competition management platform.

The platform helps organizers create, manage, and publish competitions for both formal and informal events. It supports flexible participant structures, dynamic competition formats, match scheduling, score management, standings, brackets, and role-based access control.

## Problem

Many competition tools are optimized for formal bracket-based tournaments, but informal sport and esport events often need more flexibility.

Common problems include:

- Participants may not have user accounts.
- Competitions may have odd numbers of participants.
- Events may use custom formats.
- Organizers may need manual control over matches and scores.
- Small communities need simple tools without complex onboarding.
- Both sport and esport competitions need similar but flexible data structures.

## Vision

Lawan PMO Sports aims to provide a flexible competition management system that can be used for casual events, community tournaments, school competitions, office games, local sport leagues, and esport events.

## Target Users

- Organizer
- Competition admin
- Score admin
- Team manager
- Participant
- Viewer

## Core Principles

- Participants do not need to have user accounts.
- Only users who manage the system need authentication.
- Access control is handled through RBAC.
- Competition formats must be flexible.
- API documentation must be treated as API contract.
- Swagger/OpenAPI is the source of truth for API contract.
- Controller code must stay clean and readable.
