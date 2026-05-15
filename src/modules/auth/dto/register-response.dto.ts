import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';

class RegisterResponseDataDto {
  @ApiProperty({
    description: 'Registered user profile.',
    type: UserProfileDto,
  })
  user: UserProfileDto;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Indicates whether the request was successful.',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable response message.',
    example: 'User registered successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response payload.',
    type: RegisterResponseDataDto,
  })
  data: RegisterResponseDataDto;
}
