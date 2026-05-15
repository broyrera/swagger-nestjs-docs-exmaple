import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiValidationErrorResponse } from '../../../common/decorators/api-error-responses.decorator';
import { ApiSuccessResponse } from '../../../common/decorators/api-success-response.decorator';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
import { CurrentUserResponseDataDto } from '../dto/current-user-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDataDto } from '../dto/login-response.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { RegisterResponseDataDto } from '../dto/register-response.dto';

export function RegisterApiDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register new user',
      description:
        'Creates a new user account that can manage organizations and competitions.',
    }),
    ApiBody({ type: RegisterRequestDto }),
    ApiSuccessResponse({
      status: 201,
      description: 'User registered successfully',
      dataType: RegisterResponseDataDto,
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
    ApiSuccessResponse({
      status: 200,
      description: 'User logged in successfully',
      dataType: LoginResponseDataDto,
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
    ApiSuccessResponse({
      status: 200,
      description: 'Current user retrieved successfully',
      dataType: CurrentUserResponseDataDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Authentication is required or token is invalid',
      type: ErrorResponseDto,
    }),
  );
}
