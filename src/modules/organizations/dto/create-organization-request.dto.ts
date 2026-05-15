import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOrganizationRequestDto {
  @ApiProperty({
    description: 'Organization name.',
    example: 'Garuda Sports Community',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Organization description.',
    example: 'Community for sport and esport events.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
