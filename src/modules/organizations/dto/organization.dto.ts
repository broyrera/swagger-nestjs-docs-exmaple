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

  @ApiPropertyOptional({
    description:
      'Current authenticated user role in this organization. Null when the requester is a SUPER_ADMIN viewing an organization they are not a member of.',
    enum: OrganizationRole,
    example: OrganizationRole.OWNER,
    nullable: true,
  })
  currentUserRole: OrganizationRole | null;
}
