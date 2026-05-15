import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiAuthErrorResponses,
  ApiConflictErrorResponse,
  ApiValidationErrorResponse,
} from '../../../common/decorators/api-error-responses.decorator';
import { ApiSuccessResponse } from '../../../common/decorators/api-success-response.decorator';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDataDto } from '../dto/login-response.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { UserProfileDto } from '../dto/user-profile.dto';

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
      dataType: UserProfileDto,
    }),
    ApiValidationErrorResponse(),
    ApiConflictErrorResponse('Email already exists'),
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
    ApiAuthErrorResponses('Invalid email or password'),
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
      dataType: UserProfileDto,
    }),
    ApiAuthErrorResponses(),
  );
}
