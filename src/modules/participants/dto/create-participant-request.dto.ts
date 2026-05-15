import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ParticipantType } from './participant-type.enum';

export class CreateParticipantRequestDto {
  @ApiProperty({
    description: 'Participant type.',
    enum: ParticipantType,
    example: ParticipantType.TEAM,
  })
  @IsEnum(ParticipantType)
  type: ParticipantType;

  @ApiProperty({
    description: 'Display name shown in competition views.',
    example: 'Garuda FC',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  displayName: string;

  @ApiPropertyOptional({
    description: 'Optional user account linked to this participant.',
    example: 'usr_123',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  linkedUserId?: string | null;
}
