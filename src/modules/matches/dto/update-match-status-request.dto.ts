import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MatchStatus } from './match-status.enum';

export class UpdateMatchStatusRequestDto {
  @ApiProperty({
    description: 'Match lifecycle status.',
    enum: MatchStatus,
    example: MatchStatus.CANCELLED,
  })
  @IsEnum(MatchStatus)
  status: MatchStatus;
}
