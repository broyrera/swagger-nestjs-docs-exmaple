import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';

export function ApiValidationErrorResponse() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Validation failed',
      type: ErrorResponseDto,
    }),
  );
}

export function ApiAuthErrorResponses(
  description = 'Authentication is required or token is invalid',
) {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description,
      type: ErrorResponseDto,
    }),
  );
}

export function ApiForbiddenErrorResponse() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'User does not have permission to perform this action',
      type: ErrorResponseDto,
    }),
  );
}

export function ApiNotFoundErrorResponse(resourceName = 'Resource') {
  return applyDecorators(
    ApiNotFoundResponse({
      description: `${resourceName} not found`,
      type: ErrorResponseDto,
    }),
  );
}

export function ApiConflictErrorResponse(
  description = 'Request conflicts with current resource state',
) {
  return applyDecorators(
    ApiConflictResponse({
      description,
      type: ErrorResponseDto,
    }),
  );
}

export function ApiServerErrorResponse() {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      description: 'Unexpected server error',
      type: ErrorResponseDto,
    }),
  );
}
