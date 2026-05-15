import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BracketParticipantDto } from './bracket-participant.dto';

export class BracketSlotDto {
  @ApiPropertyOptional({
    description: 'Participant assigned to this bracket slot.',
    type: BracketParticipantDto,
    nullable: true,
  })
  participant?: BracketParticipantDto | null;

  @ApiProperty({
    description: 'Indicates whether this slot is a bye.',
    example: false,
  })
  isBye: boolean;
}
