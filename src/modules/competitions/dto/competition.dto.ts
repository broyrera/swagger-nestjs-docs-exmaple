import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompetitionFormat } from './competition-format.enum';
import { CompetitionStatus } from './competition-status.enum';
import { CompetitionType } from './competition-type.enum';
import { CompetitionVisibility } from './competition-visibility.enum';

export class CompetitionDto {
  @ApiProperty({
    description: 'Unique competition identifier.',
    example: 'cmp_123',
  })
  id: string;

  @ApiProperty({
    description: 'Owner organization identifier.',
    example: 'org_123',
  })
  organizationId: string;

  @ApiProperty({
    description: 'Competition name.',
    example: 'Futsal RT Cup 2026',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Competition description.',
    example: 'Community futsal competition.',
  })
  description?: string;

  @ApiProperty({
    description: 'Competition type.',
    enum: CompetitionType,
    example: CompetitionType.SPORT,
  })
  type: CompetitionType;

  @ApiProperty({
    description: 'Competition format.',
    enum: CompetitionFormat,
    example: CompetitionFormat.GROUP_STAGE_KNOCKOUT,
  })
  format: CompetitionFormat;

  @ApiProperty({
    description: 'Competition visibility.',
    enum: CompetitionVisibility,
    example: CompetitionVisibility.PUBLIC,
  })
  visibility: CompetitionVisibility;

  @ApiProperty({
    description: 'Competition lifecycle status.',
    enum: CompetitionStatus,
    example: CompetitionStatus.DRAFT,
  })
  status: CompetitionStatus;
}
