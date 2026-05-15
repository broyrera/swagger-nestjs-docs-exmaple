import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { OrganizationRole } from './organization-role.enum';

export class AddOrganizationMemberRequestDto {
  @ApiProperty({
    description: 'Email address of the user to add as organization member.',
    example: 'member@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Organization role to assign.',
    enum: OrganizationRole,
    example: OrganizationRole.ADMIN,
  })
  @IsEnum(OrganizationRole)
  role: OrganizationRole;
}
