import { Injectable } from '@nestjs/common';
import { BracketMatchStatus } from './dto/bracket-match-status.enum';
import { GenerateBracketRequestDto } from './dto/generate-bracket-request.dto';
import { UpdateBracketMatchRequestDto } from './dto/update-bracket-match-request.dto';

@Injectable()
export class BracketsService {
  getBracket(competitionId: string) {
    return {
      success: true,
      message: 'Bracket retrieved successfully',
      data: this.createStubBracket(competitionId),
    };
  }

  generate(competitionId: string, _dto: GenerateBracketRequestDto) {
    return {
      success: true,
      message: 'Bracket generated successfully',
      data: this.createStubBracket(competitionId),
    };
  }

  updateBracketMatch(
    bracketMatchId: string,
    dto: UpdateBracketMatchRequestDto,
  ) {
    return {
      success: true,
      message: 'Bracket match updated successfully',
      data: {
        id: bracketMatchId,
        matchId: dto.matchId ?? 'mat_123',
        order: 1,
        homeSlot: {
          participant: {
            id: dto.homeParticipantId ?? 'par_1',
            displayName: 'Garuda FC',
          },
          isBye: false,
        },
        awaySlot: {
          participant: {
            id: dto.awayParticipantId ?? 'par_2',
            displayName: 'Rajawali FC',
          },
          isBye: false,
        },
        winnerParticipantId: null,
        status: BracketMatchStatus.SCHEDULED,
      },
    };
  }

  private createStubBracket(competitionId: string) {
    return {
      competitionId,
      rounds: [
        {
          id: 'round_1',
          name: 'Semifinal',
          order: 1,
          matches: [
            {
              id: 'bm_123',
              matchId: 'mat_123',
              order: 1,
              homeSlot: {
                participant: {
                  id: 'par_1',
                  displayName: 'Garuda FC',
                },
                isBye: false,
              },
              awaySlot: {
                participant: null,
                isBye: true,
              },
              winnerParticipantId: 'par_1',
              status: BracketMatchStatus.COMPLETED,
            },
          ],
        },
      ],
    };
  }
}
