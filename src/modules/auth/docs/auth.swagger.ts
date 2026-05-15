import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiValidationErrorResponse } from '../../../common/decorators/api-error-responses.decorator';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
import { CurrentUserResponseDto } from '../dto/current-user-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';

export function RegisterApiDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register new user',
      description:
        'Creates a new user account that can manage organizations and competitions.',
    }),
    ApiBody({ type: RegisterRequestDto }),
    ApiCreatedResponse({
      description: 'User registered successfully',
      type: RegisterResponseDto,
    }),
    ApiValidationErrorResponse(),
    ApiConflictResponse({
      description: 'Email already exists',
      type: ErrorResponseDto,
    }),
  );
}

export function LoginApiDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login user',
      description: 'Authenticates a user and returns an access token.',
    }),
    ApiBody({ type: LoginRequestDto }),
    ApiOkResponse({
      description: 'User logged in successfully',
      type: LoginResponseDto,
    }),
    ApiValidationErrorResponse(),
    ApiUnauthorizedResponse({
      description: 'Invalid email or password',
      type: ErrorResponseDto,
    }),
  );
}

export function GetCurrentUserApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get current authenticated user',
      description: 'Returns the current authenticated user profile.',
    }),
    ApiOkResponse({
      description: 'Current user retrieved successfully',
      type: CurrentUserResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Authentication is required or token is invalid',
      type: ErrorResponseDto,
    }),
  );
}
