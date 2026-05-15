import { ApiProperty } from '@nestjs/swagger';

export class StandingParticipantDto {
  @ApiProperty({
    description: 'Participant identifier.',
    example: 'par_123',
  })
  id: string;

  @ApiProperty({
    description: 'Participant display name.',
    example: 'Garuda FC',
  })
  displayName: string;
}
