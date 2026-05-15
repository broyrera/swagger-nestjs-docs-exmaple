import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BracketMatchStatus } from './bracket-match-status.enum';
import { BracketSlotDto } from './bracket-slot.dto';

export class BracketMatchDto {
  @ApiProperty({
    description: 'Bracket match identifier.',
    example: 'bm_123',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Linked match identifier.',
    example: 'mat_123',
    nullable: true,
  })
  matchId?: string | null;

  @ApiProperty({
    description: 'Match order inside the bracket round.',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Home bracket slot.',
    type: BracketSlotDto,
  })
  homeSlot: BracketSlotDto;

  @ApiProperty({
    description: 'Away bracket slot.',
    type: BracketSlotDto,
  })
  awaySlot: BracketSlotDto;

  @ApiPropertyOptional({
    description: 'Winner participant identifier.',
    example: 'par_1',
    nullable: true,
  })
  winnerParticipantId?: string | null;

  @ApiProperty({
    description: 'Bracket match status.',
    enum: BracketMatchStatus,
    example: BracketMatchStatus.SCHEDULED,
  })
  status: BracketMatchStatus;
}
