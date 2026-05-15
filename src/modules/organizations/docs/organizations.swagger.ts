import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import {
  ApiAuthErrorResponses,
  ApiForbiddenErrorResponse,
  ApiNotFoundErrorResponse,
  ApiValidationErrorResponse,
} from '../../../common/decorators/api-error-responses.decorator';
import { ApiSuccessResponse } from '../../../common/decorators/api-success-response.decorator';
import { AddOrganizationMemberRequestDto } from '../dto/add-organization-member-request.dto';
import { CreateOrganizationRequestDto } from '../dto/create-organization-request.dto';
import { OrganizationMemberDto } from '../dto/organization-member.dto';
import { OrganizationDto } from '../dto/organization.dto';

function ApiOrganizationIdParam() {
  return ApiParam({
    name: 'organizationId',
    description: 'Organization ID.',
    example: 'org_123',
  });
}

export function CreateOrganizationApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Create organization',
      description:
        'Creates a new organization. The authenticated user becomes the organization owner.',
    }),
    ApiBody({ type: CreateOrganizationRequestDto }),
    ApiSuccessResponse({
      status: 201,
      description: 'Organization created successfully',
      dataType: OrganizationDto,
    }),
    ApiValidationErrorResponse(),
    ApiAuthErrorResponses(),
  );
}

export function ListOrganizationsApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'List accessible organizations',
      description:
        'Returns organizations accessible to the current authenticated user.',
    }),
    ApiSuccessResponse({
      status: 200,
      description: 'Organizations retrieved successfully',
      dataType: OrganizationDto,
      isArray: true,
    }),
    ApiAuthErrorResponses(),
  );
}

export function GetOrganizationApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get organization detail',
      description:
        'Returns organization detail if the current user has access to it.',
    }),
    ApiOrganizationIdParam(),
    ApiSuccessResponse({
      status: 200,
      description: 'Organization retrieved successfully',
      dataType: OrganizationDto,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Organization'),
  );
}

export function AddOrganizationMemberApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Add organization member',
      description:
        'Adds a user as an organization member. Allowed roles: SUPER_ADMIN, ORGANIZATION_OWNER, ORGANIZATION_ADMIN depending on organization policy.',
    }),
    ApiOrganizationIdParam(),
    ApiBody({ type: AddOrganizationMemberRequestDto }),
    ApiSuccessResponse({
      status: 201,
      description: 'Organization member added successfully',
      dataType: OrganizationMemberDto,
    }),
    ApiValidationErrorResponse(),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Organization'),
  );
}
