import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { CompetitionFormat } from './competition-format.enum';
import { CompetitionType } from './competition-type.enum';
import { CompetitionVisibility } from './competition-visibility.enum';

export class UpdateCompetitionRequestDto {
  @ApiPropertyOptional({
    description: 'Competition name.',
    example: 'Futsal RT Cup 2026 Updated',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({
    description: 'Competition description.',
    example: 'Updated description.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Competition type.',
    enum: CompetitionType,
    example: CompetitionType.SPORT,
  })
  @IsOptional()
  @IsEnum(CompetitionType)
  type?: CompetitionType;

  @ApiPropertyOptional({
    description: 'Competition format.',
    enum: CompetitionFormat,
    example: CompetitionFormat.GROUP_STAGE_KNOCKOUT,
  })
  @IsOptional()
  @IsEnum(CompetitionFormat)
  format?: CompetitionFormat;

  @ApiPropertyOptional({
    description: 'Competition visibility.',
    enum: CompetitionVisibility,
    example: CompetitionVisibility.PRIVATE,
  })
  @IsOptional()
  @IsEnum(CompetitionVisibility)
  visibility?: CompetitionVisibility;
}
