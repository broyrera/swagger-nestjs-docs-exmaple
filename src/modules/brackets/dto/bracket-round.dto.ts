import { ApiProperty } from '@nestjs/swagger';
import { BracketMatchDto } from './bracket-match.dto';

export class BracketRoundDto {
  @ApiProperty({
    description: 'Bracket round identifier.',
    example: 'round_1',
  })
  id: string;

  @ApiProperty({
    description: 'Bracket round name.',
    example: 'Semifinal',
  })
  name: string;

  @ApiProperty({
    description: 'Round order in the bracket.',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Bracket matches in this round.',
    type: [BracketMatchDto],
  })
  matches: BracketMatchDto[];
}
