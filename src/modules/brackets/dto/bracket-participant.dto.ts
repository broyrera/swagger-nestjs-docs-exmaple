import { ApiProperty } from '@nestjs/swagger';

export class BracketParticipantDto {
  @ApiProperty({
    description: 'Participant identifier.',
    example: 'par_1',
  })
  id: string;

  @ApiProperty({
    description: 'Participant display name.',
    example: 'Garuda FC',
  })
  displayName: string;
}
