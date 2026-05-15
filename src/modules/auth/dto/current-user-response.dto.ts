import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';

class CurrentUserResponseDataDto {
  @ApiProperty({
    description: 'Current authenticated user profile.',
    type: UserProfileDto,
  })
  user: UserProfileDto;
}

export class CurrentUserResponseDto {
  @ApiProperty({
    description: 'Indicates whether the request was successful.',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable response message.',
    example: 'Current user retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response payload.',
    type: CurrentUserResponseDataDto,
  })
  data: CurrentUserResponseDataDto;
}
