import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'User email address.',
    example: 'suci@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password.',
    example: 'Password123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
