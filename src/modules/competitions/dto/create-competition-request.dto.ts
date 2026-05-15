import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CompetitionFormat } from './competition-format.enum';
import { CompetitionType } from './competition-type.enum';
import { CompetitionVisibility } from './competition-visibility.enum';

export class CreateCompetitionRequestDto {
  @ApiProperty({
    description: 'Owner organization identifier.',
    example: 'org_123',
  })
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({
    description: 'Competition name.',
    example: 'Futsal RT Cup 2026',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({
    description: 'Competition description.',
    example: 'Community futsal competition.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Competition type.',
    enum: CompetitionType,
    example: CompetitionType.SPORT,
  })
  @IsEnum(CompetitionType)
  type: CompetitionType;

  @ApiProperty({
    description: 'Competition format.',
    enum: CompetitionFormat,
    example: CompetitionFormat.GROUP_STAGE_KNOCKOUT,
  })
  @IsEnum(CompetitionFormat)
  format: CompetitionFormat;

  @ApiProperty({
    description: 'Competition visibility.',
    enum: CompetitionVisibility,
    example: CompetitionVisibility.PUBLIC,
  })
  @IsEnum(CompetitionVisibility)
  visibility: CompetitionVisibility;
}
