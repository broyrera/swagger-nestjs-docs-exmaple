import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { MatchStatus } from '../../matches/dto/match-status.enum';

export class ListResultsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter result matches by status.',
    enum: MatchStatus,
    example: MatchStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;
}
