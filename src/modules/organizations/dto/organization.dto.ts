import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationRole } from './organization-role.enum';

export class OrganizationDto {
  @ApiProperty({
    description: 'Unique organization identifier.',
    example: 'org_123',
  })
  id: string;

  @ApiProperty({
    description: 'Organization name.',
    example: 'Garuda Sports Community',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Organization description.',
    example: 'Community for sport and esport events.',
  })
  description?: string;

  @ApiProperty({
    description: 'Current authenticated user role in this organization.',
    enum: OrganizationRole,
    example: OrganizationRole.OWNER,
  })
  currentUserRole: OrganizationRole;
}
