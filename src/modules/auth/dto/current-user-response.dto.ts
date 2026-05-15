import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';

export class CurrentUserResponseDataDto {
  @ApiProperty({
    description: 'Current authenticated user profile.',
    type: UserProfileDto,
  })
  user: UserProfileDto;
}
