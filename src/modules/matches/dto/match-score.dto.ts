import { ApiProperty } from '@nestjs/swagger';

export class MatchScoreDto {
  @ApiProperty({
    description: 'Home participant score.',
    example: 2,
    minimum: 0,
  })
  homeScore: number;

  @ApiProperty({
    description: 'Away participant score.',
    example: 1,
    minimum: 0,
  })
  awayScore: number;
}
