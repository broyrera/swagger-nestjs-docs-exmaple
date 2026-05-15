# Competition Formats

## Overview

Lawan PMO Sports supports flexible sport and esport competition formats.

The system must support both formal and informal events.

A competition format defines how participants are arranged, how matches are created, and how winners or standings are calculated.

## Core Format Types

## 1. Single Match

A single match between two participants.

Useful for:

- friendly match
- one-off challenge
- exhibition match
- casual esport match

Example:

```txt
Team A vs Team B
```

## 2. Round Robin

Every participant plays against every other participant.

Useful for:

- small leagues
- group stage
- casual competitions
- badminton groups
- futsal mini league

Example with 4 participants:

```txt
A vs B
A vs C
A vs D
B vs C
B vs D
C vs D
```

## 3. Group Stage

Participants are divided into groups.

Each group usually uses round robin format.

Useful for:

- competitions with many participants
- esport tournaments
- school events
- community tournaments

Example:

```txt
Group A:
- Team A
- Team B
- Team C

Group B:
- Team D
- Team E
- Team F
```

## 4. Knockout

Participants are eliminated after losing.

Useful for:

- bracket tournaments
- cup competitions
- elimination events

The system should support non-perfect participant counts.

Example:

```txt
5 participants should still be supported.
The system may use byes or manual bracket placement.
```

## 5. Group Stage + Knockout

Participants start in groups, then top participants advance to knockout rounds.

Useful for:

- formal tournaments
- esport events
- futsal competitions
- school competitions

Example:

```txt
Top 2 teams from each group advance to semifinals.
```

## 6. League

A long-running competition where participants play multiple matchdays.

Useful for:

- sport leagues
- office leagues
- community seasons
- recurring competitions

A league may support:

- one round
- double round
- home-away matches
- custom matchdays

## 7. Two-Legged Tie

Two participants play two matches.

The winner is calculated using aggregate score.

Useful for:

- home-away format
- football-style knockout
- esport rematch format

Example:

```txt
Leg 1: Team A 2 - 1 Team B
Leg 2: Team B 1 - 1 Team A

Aggregate:
Team A 3 - 2 Team B
```

## Flexible Participant Count

The system must not require participant counts to follow perfect bracket numbers like:

- 4
- 8
- 16
- 32

Informal competitions may have:

- 3 participants
- 5 participants
- 7 participants
- 9 participants
- 13 participants

The API contract must allow flexible participant counts.

## Manual Control

Organizers should be allowed to manually adjust:

- group assignment
- match schedule
- bracket placement
- score
- match status
- participant order

This is important because real-world competitions often need manual corrections.

## API Contract Impact

Competition creation must include a format field.

Example:

```json
{
  "name": "Futsal RT Cup 2026",
  "type": "SPORT",
  "format": "GROUP_STAGE_KNOCKOUT",
  "visibility": "PUBLIC"
}
```

Possible format values:

```txt
SINGLE_MATCH
ROUND_ROBIN
GROUP_STAGE
KNOCKOUT
GROUP_STAGE_KNOCKOUT
LEAGUE
TWO_LEGGED_TIE
```

## Future Considerations

Future versions may support:

- Swiss format
- double elimination
- custom point rules
- custom tie breaker rules
- best of series
- map-based esport scoring
