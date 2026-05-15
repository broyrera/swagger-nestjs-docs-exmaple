import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';

export class RegisterResponseDataDto {
  @ApiProperty({
    description: 'Registered user profile.',
    type: UserProfileDto,
  })
  user: UserProfileDto;
}
