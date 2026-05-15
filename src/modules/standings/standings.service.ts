import { Injectable } from '@nestjs/common';
import { MatchStatus } from '../matches/dto/match-status.enum';
import { ListResultsQueryDto } from './dto/list-results-query.dto';

@Injectable()
export class StandingsService {
  getStandings(competitionId: string) {
    return {
      success: true,
      message: 'Standings retrieved successfully',
      data: [
        {
          rank: 1,
          participant: {
            id: 'par_123',
            displayName: 'Garuda FC',
          },
          played: 3,
          won: 2,
          drawn: 1,
          lost: 0,
          scoreFor: 7,
          scoreAgainst: 3,
          scoreDifference: 4,
          points: 7,
        },
        {
          rank: 2,
          participant: {
            id: 'par_456',
            displayName: 'Rajawali FC',
          },
          played: 3,
          won: 1,
          drawn: 1,
          lost: 1,
          scoreFor: 5,
          scoreAgainst: 5,
          scoreDifference: 0,
          points: 4,
        },
      ],
    };
  }

  getResults(competitionId: string, query: ListResultsQueryDto) {
    return {
      success: true,
      message: 'Results retrieved successfully',
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
          score: {
            homeScore: 2,
            awayScore: 1,
          },
          status: query.status ?? MatchStatus.COMPLETED,
          scheduledAt: '2026-06-01T10:00:00.000Z',
        },
      ],
    };
  }
}
