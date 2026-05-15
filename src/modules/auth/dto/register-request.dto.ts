import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'User display name.',
    example: 'Suci Nurul Ilham',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unique user email address.',
    example: 'suci@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password. Must be at least 8 characters.',
    example: 'Password123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
