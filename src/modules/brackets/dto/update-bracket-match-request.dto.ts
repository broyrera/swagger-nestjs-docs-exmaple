import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBracketMatchRequestDto {
  @ApiPropertyOptional({
    description: 'Home participant identifier.',
    example: 'par_1',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  homeParticipantId?: string | null;

  @ApiPropertyOptional({
    description: 'Away participant identifier.',
    example: 'par_2',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  awayParticipantId?: string | null;

  @ApiPropertyOptional({
    description: 'Linked match identifier.',
    example: 'mat_123',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  matchId?: string | null;
}
