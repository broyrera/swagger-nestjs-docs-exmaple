import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ParticipantStatus } from './participant-status.enum';
import { ParticipantType } from './participant-type.enum';

export class ParticipantDto {
  @ApiProperty({
    description: 'Unique participant identifier.',
    example: 'par_123',
  })
  id: string;

  @ApiProperty({
    description: 'Competition identifier where this participant is registered.',
    example: 'cmp_123',
  })
  competitionId: string;

  @ApiProperty({
    description: 'Participant type.',
    enum: ParticipantType,
    example: ParticipantType.TEAM,
  })
  type: ParticipantType;

  @ApiProperty({
    description: 'Display name shown in competition views.',
    example: 'Garuda FC',
  })
  displayName: string;

  @ApiPropertyOptional({
    description: 'Optional user account linked to this participant.',
    example: 'usr_123',
    nullable: true,
  })
  linkedUserId?: string | null;

  @ApiProperty({
    description: 'Participant lifecycle status.',
    enum: ParticipantStatus,
    example: ParticipantStatus.PENDING,
  })
  status: ParticipantStatus;
}
