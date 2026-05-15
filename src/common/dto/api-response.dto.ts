import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto<TData = unknown> {
  @ApiProperty({
    description: 'Indicates whether the request was successful.',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable response message.',
    example: 'Request completed successfully',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Main response payload.',
  })
  data?: TData;
}
