import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  ApiAuthErrorResponses,
  ApiConflictErrorResponse,
  ApiForbiddenErrorResponse,
  ApiNotFoundErrorResponse,
  ApiValidationErrorResponse,
} from '../../../common/decorators/api-error-responses.decorator';
import { ApiSuccessResponse } from '../../../common/decorators/api-success-response.decorator';
import { CompetitionDto } from '../dto/competition.dto';
import { CompetitionFormat } from '../dto/competition-format.enum';
import { CompetitionStatus } from '../dto/competition-status.enum';
import { CompetitionType } from '../dto/competition-type.enum';
import { CreateCompetitionRequestDto } from '../dto/create-competition-request.dto';
import { UpdateCompetitionRequestDto } from '../dto/update-competition-request.dto';

function ApiCompetitionIdParam() {
  return ApiParam({
    name: 'competitionId',
    description: 'Competition ID.',
    example: 'cmp_123',
  });
}

export function CreateCompetitionApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Create competition',
      description:
        'Creates a new competition under an organization. The competition starts as draft.',
    }),
    ApiBody({ type: CreateCompetitionRequestDto }),
    ApiSuccessResponse({
      status: 201,
      description: 'Competition created successfully',
      dataType: CompetitionDto,
    }),
    ApiValidationErrorResponse(),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Organization'),
  );
}

export function ListCompetitionsApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'List accessible competitions',
      description:
        'Returns competitions accessible to the current authenticated user.',
    }),
    ApiQuery({ name: 'organizationId', required: false, type: String }),
    ApiQuery({ name: 'type', required: false, enum: CompetitionType }),
    ApiQuery({ name: 'format', required: false, enum: CompetitionFormat }),
    ApiQuery({ name: 'status', required: false, enum: CompetitionStatus }),
    ApiSuccessResponse({
      status: 200,
      description: 'Competitions retrieved successfully',
      dataType: CompetitionDto,
      isArray: true,
    }),
    ApiAuthErrorResponses(),
  );
}

export function GetCompetitionApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get competition detail',
      description: 'Returns competition detail for the given competition ID.',
    }),
    ApiCompetitionIdParam(),
    ApiSuccessResponse({
      status: 200,
      description: 'Competition retrieved successfully',
      dataType: CompetitionDto,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Competition'),
  );
}

export function UpdateCompetitionApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update competition',
      description: 'Updates competition information.',
    }),
    ApiCompetitionIdParam(),
    ApiBody({ type: UpdateCompetitionRequestDto }),
    ApiSuccessResponse({
      status: 200,
      description: 'Competition updated successfully',
      dataType: CompetitionDto,
    }),
    ApiValidationErrorResponse(),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Competition'),
    ApiConflictErrorResponse('Invalid competition lifecycle transition'),
  );
}

export function PublishCompetitionApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Publish competition',
      description: 'Publishes a draft competition.',
    }),
    ApiCompetitionIdParam(),
    ApiSuccessResponse({
      status: 200,
      description: 'Competition published successfully',
      dataType: CompetitionDto,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Competition'),
    ApiConflictErrorResponse('Invalid competition lifecycle transition'),
  );
}

export function ArchiveCompetitionApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Archive competition',
      description: 'Archives a competition.',
    }),
    ApiCompetitionIdParam(),
    ApiSuccessResponse({
      status: 200,
      description: 'Competition archived successfully',
      dataType: CompetitionDto,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Competition'),
    ApiConflictErrorResponse('Invalid competition lifecycle transition'),
  );
}
