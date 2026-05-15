import { Injectable } from '@nestjs/common';
import { CreateMatchRequestDto } from './dto/create-match-request.dto';
import { ListMatchesQueryDto } from './dto/list-matches-query.dto';
import { MatchStatus } from './dto/match-status.enum';
import { UpdateMatchRequestDto } from './dto/update-match-request.dto';
import { UpdateMatchScoreRequestDto } from './dto/update-match-score-request.dto';
import { UpdateMatchStatusRequestDto } from './dto/update-match-status-request.dto';

@Injectable()
export class MatchesService {
  create(competitionId: string, dto: CreateMatchRequestDto) {
    return {
      success: true,
      message: 'Match created successfully',
      data: {
        id: 'mat_123',
        competitionId,
        homeParticipant: {
          id: dto.homeParticipantId,
          displayName: 'Garuda FC',
        },
        awayParticipant: {
          id: dto.awayParticipantId,
          displayName: 'Rajawali FC',
        },
        score: null,
        status: MatchStatus.SCHEDULED,
        scheduledAt: dto.scheduledAt ?? null,
      },
    };
  }

  findAll(competitionId: string, query: ListMatchesQueryDto) {
    return {
      success: true,
      message: 'Matches retrieved successfully',
      data: [
        {
          id: 'mat_123',
          competitionId,
          homeParticipant: {
            id: 'par_home',
            displayName: 'Garuda FC',
          },
          awayParticipant: {
            id: 'par_away',
            displayName: 'Rajawali FC',
          },
          score:
            query.status === MatchStatus.SCHEDULED
              ? null
              : {
                  homeScore: 2,
                  awayScore: 1,
                },
          status: query.status ?? MatchStatus.COMPLETED,
          scheduledAt: '2026-06-01T10:00:00.000Z',
        },
      ],
    };
  }

  findOne(matchId: string) {
    return {
      success: true,
      message: 'Match retrieved successfully',
      data: {
        id: matchId,
        competitionId: 'cmp_123',
        homeParticipant: {
          id: 'par_home',
          displayName: 'Garuda FC',
        },
        awayParticipant: {
          id: 'par_away',
          displayName: 'Rajawali FC',
        },
        score: {
          homeScore: 2,
          awayScore: 1,
        },
        status: MatchStatus.COMPLETED,
        scheduledAt: '2026-06-01T10:00:00.000Z',
      },
    };
  }

  update(matchId: string, dto: UpdateMatchRequestDto) {
    return {
      success: true,
      message: 'Match updated successfully',
      data: {
        id: matchId,
        competitionId: 'cmp_123',
        homeParticipant: {
          id: dto.homeParticipantId ?? 'par_home',
          displayName: 'Garuda FC',
        },
        awayParticipant: {
          id: dto.awayParticipantId ?? 'par_away',
          displayName: 'Rajawali FC',
        },
        score: null,
        status: MatchStatus.SCHEDULED,
        scheduledAt: dto.scheduledAt ?? '2026-06-01T12:00:00.000Z',
      },
    };
  }

  updateScore(matchId: string, dto: UpdateMatchScoreRequestDto) {
    return {
      success: true,
      message: 'Match score updated successfully',
      data: {
        id: matchId,
        competitionId: 'cmp_123',
        homeParticipant: {
          id: 'par_home',
          displayName: 'Garuda FC',
        },
        awayParticipant: {
          id: 'par_away',
          displayName: 'Rajawali FC',
        },
        score: {
          homeScore: dto.homeScore,
          awayScore: dto.awayScore,
        },
        status: MatchStatus.COMPLETED,
        scheduledAt: '2026-06-01T10:00:00.000Z',
      },
    };
  }

  updateStatus(matchId: string, dto: UpdateMatchStatusRequestDto) {
    return {
      success: true,
      message: 'Match status updated successfully',
      data: {
        id: matchId,
        competitionId: 'cmp_123',
        homeParticipant: {
          id: 'par_home',
          displayName: 'Garuda FC',
        },
        awayParticipant: {
          id: 'par_away',
          displayName: 'Rajawali FC',
        },
        score:
          dto.status === MatchStatus.COMPLETED
            ? { homeScore: 2, awayScore: 1 }
            : null,
        status: dto.status,
        scheduledAt: '2026-06-01T10:00:00.000Z',
      },
    };
  }
}
