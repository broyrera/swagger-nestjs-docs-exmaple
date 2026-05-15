import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateMatchScoreRequestDto {
  @ApiProperty({
    description: 'Home participant score.',
    example: 2,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  homeScore: number;

  @ApiProperty({
    description: 'Away participant score.',
    example: 1,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  awayScore: number;
}
