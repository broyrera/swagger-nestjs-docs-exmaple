import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMatchRequestDto {
  @ApiProperty({
    description: 'Home participant identifier.',
    example: 'par_home',
  })
  @IsString()
  @IsNotEmpty()
  homeParticipantId: string;

  @ApiProperty({
    description: 'Away participant identifier.',
    example: 'par_away',
  })
  @IsString()
  @IsNotEmpty()
  awayParticipantId: string;

  @ApiPropertyOptional({
    description: 'Scheduled match time.',
    example: '2026-06-01T10:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string | null;
}
