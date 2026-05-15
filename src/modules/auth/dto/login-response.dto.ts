import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';

export class LoginResponseDataDto {
  @ApiProperty({
    description: 'JWT access token.',
    example: 'jwt-access-token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Authenticated user profile.',
    type: UserProfileDto,
  })
  user: UserProfileDto;
}
