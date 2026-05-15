import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MatchParticipantDto } from './match-participant.dto';
import { MatchScoreDto } from './match-score.dto';
import { MatchStatus } from './match-status.enum';

export class MatchDto {
  @ApiProperty({
    description: 'Unique match identifier.',
    example: 'mat_123',
  })
  id: string;

  @ApiProperty({
    description: 'Competition identifier where this match belongs.',
    example: 'cmp_123',
  })
  competitionId: string;

  @ApiProperty({
    description: 'Home participant summary.',
    type: MatchParticipantDto,
  })
  homeParticipant: MatchParticipantDto;

  @ApiProperty({
    description: 'Away participant summary.',
    type: MatchParticipantDto,
  })
  awayParticipant: MatchParticipantDto;

  @ApiPropertyOptional({
    description: 'Submitted match score.',
    type: MatchScoreDto,
    nullable: true,
  })
  score?: MatchScoreDto | null;

  @ApiProperty({
    description: 'Match lifecycle status.',
    enum: MatchStatus,
    example: MatchStatus.SCHEDULED,
  })
  status: MatchStatus;

  @ApiPropertyOptional({
    description: 'Scheduled match time.',
    example: '2026-06-01T10:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  scheduledAt?: string | null;
}
