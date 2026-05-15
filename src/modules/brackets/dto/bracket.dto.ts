import { ApiProperty } from '@nestjs/swagger';
import { BracketRoundDto } from './bracket-round.dto';

export class BracketDto {
  @ApiProperty({
    description: 'Competition identifier.',
    example: 'cmp_123',
  })
  competitionId: string;

  @ApiProperty({
    description: 'Bracket rounds.',
    type: [BracketRoundDto],
  })
  rounds: BracketRoundDto[];
}
