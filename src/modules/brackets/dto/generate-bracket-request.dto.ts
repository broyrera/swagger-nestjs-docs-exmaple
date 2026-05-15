import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';
import { BracketGenerationMode } from './bracket-generation-mode.enum';

export class GenerateBracketRequestDto {
  @ApiProperty({
    description: 'Bracket generation mode.',
    enum: BracketGenerationMode,
    example: BracketGenerationMode.AUTO,
  })
  @IsEnum(BracketGenerationMode)
  mode: BracketGenerationMode;

  @ApiProperty({
    description: 'Whether bracket generation can use bye slots.',
    example: true,
  })
  @IsBoolean()
  allowByes: boolean;
}
