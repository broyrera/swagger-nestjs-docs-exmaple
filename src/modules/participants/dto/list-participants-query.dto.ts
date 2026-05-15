import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ParticipantStatus } from './participant-status.enum';
import { ParticipantType } from './participant-type.enum';

export class ListParticipantsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by participant type.',
    enum: ParticipantType,
    example: ParticipantType.TEAM,
  })
  @IsOptional()
  @IsEnum(ParticipantType)
  type?: ParticipantType;

  @ApiPropertyOptional({
    description: 'Filter by participant lifecycle status.',
    enum: ParticipantStatus,
    example: ParticipantStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ParticipantStatus)
  status?: ParticipantStatus;
}
