import { ApiProperty } from '@nestjs/swagger';
import { StandingParticipantDto } from './standing-participant.dto';

export class StandingRowDto {
  @ApiProperty({
    description: 'Participant rank in the standings.',
    example: 1,
  })
  rank: number;

  @ApiProperty({
    description: 'Participant summary.',
    type: StandingParticipantDto,
  })
  participant: StandingParticipantDto;

  @ApiProperty({
    description: 'Total matches played.',
    example: 3,
  })
  played: number;

  @ApiProperty({
    description: 'Total matches won.',
    example: 2,
  })
  won: number;

  @ApiProperty({
    description: 'Total matches drawn.',
    example: 1,
  })
  drawn: number;

  @ApiProperty({
    description: 'Total matches lost.',
    example: 0,
  })
  lost: number;

  @ApiProperty({
    description: 'Total score/goals/points for.',
    example: 7,
  })
  scoreFor: number;

  @ApiProperty({
    description: 'Total score/goals/points against.',
    example: 3,
  })
  scoreAgainst: number;

  @ApiProperty({
    description: 'Score difference. Calculated as scoreFor minus scoreAgainst.',
    example: 4,
  })
  scoreDifference: number;

  @ApiProperty({
    description: 'Standing points.',
    example: 7,
  })
  points: number;
}
