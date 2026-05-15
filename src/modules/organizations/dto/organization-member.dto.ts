import { ApiProperty } from '@nestjs/swagger';
import { OrganizationRole } from './organization-role.enum';

export class OrganizationMemberDto {
  @ApiProperty({
    description: 'Unique organization member identifier.',
    example: 'om_V1StGXR8_Z5jdHi6B-myT',
  })
  id: string;

  @ApiProperty({
    description: 'User identifier of the organization member.',
    example: 'usr_456',
  })
  userId: string;

  @ApiProperty({
    description: 'Member email address.',
    example: 'member@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Organization role assigned to this member.',
    enum: OrganizationRole,
    example: OrganizationRole.ADMIN,
  })
  role: OrganizationRole;
}
