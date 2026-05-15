import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateMatchRequestDto {
  @ApiPropertyOptional({
    description: 'Home participant identifier.',
    example: 'par_home',
  })
  @IsOptional()
  @IsString()
  homeParticipantId?: string;

  @ApiPropertyOptional({
    description: 'Away participant identifier.',
    example: 'par_away',
  })
  @IsOptional()
  @IsString()
  awayParticipantId?: string;

  @ApiPropertyOptional({
    description: 'Scheduled match time.',
    example: '2026-06-01T12:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string | null;
}
