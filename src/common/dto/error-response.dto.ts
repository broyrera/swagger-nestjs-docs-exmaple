import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorDetailDto {
  @ApiProperty({
    description: 'Field that caused the error.',
    example: 'email',
  })
  field: string;

  @ApiProperty({
    description: 'Validation or error message for the field.',
    example: 'email must be an email',
  })
  message: string;
}

export class ErrorBodyDto {
  @ApiProperty({
    description: 'Machine-readable error code.',
    example: 'VALIDATION_ERROR',
  })
  code: string;

  @ApiPropertyOptional({
    description: 'Detailed error information.',
    type: [ErrorDetailDto],
  })
  details?: ErrorDetailDto[];
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Indicates whether the request was successful.',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable error message.',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description: 'Error object containing machine-readable error information.',
    type: ErrorBodyDto,
  })
  error: ErrorBodyDto;
}
