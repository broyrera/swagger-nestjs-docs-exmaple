import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';

class LoginResponseDataDto {
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

export class LoginResponseDto {
  @ApiProperty({
    description: 'Indicates whether the request was successful.',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable response message.',
    example: 'User logged in successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response payload.',
    type: LoginResponseDataDto,
  })
  data: LoginResponseDataDto;
}
