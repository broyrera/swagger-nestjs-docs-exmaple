import { ApiProperty } from '@nestjs/swagger';

export class MatchParticipantDto {
  @ApiProperty({
    description: 'Participant identifier.',
    example: 'par_home',
  })
  id: string;

  @ApiProperty({
    description: 'Participant display name.',
    example: 'Garuda FC',
  })
  displayName: string;
}
