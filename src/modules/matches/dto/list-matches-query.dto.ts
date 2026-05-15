import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { MatchStatus } from './match-status.enum';

export class ListMatchesQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by match status.',
    enum: MatchStatus,
    example: MatchStatus.SCHEDULED,
  })
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;
}
