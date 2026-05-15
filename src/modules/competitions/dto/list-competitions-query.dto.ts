import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CompetitionFormat } from './competition-format.enum';
import { CompetitionStatus } from './competition-status.enum';
import { CompetitionType } from './competition-type.enum';

export class ListCompetitionsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by organization ID.',
    example: 'org_123',
  })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional({
    description: 'Filter by competition type.',
    enum: CompetitionType,
    example: CompetitionType.SPORT,
  })
  @IsOptional()
  @IsEnum(CompetitionType)
  type?: CompetitionType;

  @ApiPropertyOptional({
    description: 'Filter by competition format.',
    enum: CompetitionFormat,
    example: CompetitionFormat.GROUP_STAGE_KNOCKOUT,
  })
  @IsOptional()
  @IsEnum(CompetitionFormat)
  format?: CompetitionFormat;

  @ApiPropertyOptional({
    description: 'Filter by competition status.',
    enum: CompetitionStatus,
    example: CompetitionStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(CompetitionStatus)
  status?: CompetitionStatus;
}
