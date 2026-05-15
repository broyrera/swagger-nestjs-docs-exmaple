import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateParticipantRequestDto {
  @ApiPropertyOptional({
    description: 'Display name shown in competition views.',
    example: 'Garuda FC Updated',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Optional user account linked to this participant.',
    example: 'usr_123',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  linkedUserId?: string | null;
}
