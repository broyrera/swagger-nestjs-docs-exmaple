import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    description: 'Unique user identifier.',
    example: 'usr_123',
  })
  id: string;

  @ApiProperty({
    description: 'User display name.',
    example: 'Suci Nurul Ilham',
  })
  name: string;

  @ApiProperty({
    description: 'User email address.',
    example: 'suci@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Global user role.',
    example: 'USER',
  })
  role: string;
}
