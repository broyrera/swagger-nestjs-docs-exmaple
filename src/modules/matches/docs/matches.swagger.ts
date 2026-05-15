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
import { CreateMatchRequestDto } from '../dto/create-match-request.dto';
import { MatchDto } from '../dto/match.dto';
import { MatchStatus } from '../dto/match-status.enum';
import { UpdateMatchRequestDto } from '../dto/update-match-request.dto';
import { UpdateMatchScoreRequestDto } from '../dto/update-match-score-request.dto';
import { UpdateMatchStatusRequestDto } from '../dto/update-match-status-request.dto';

function ApiCompetitionIdParam() {
  return ApiParam({
    name: 'competitionId',
    description: 'Competition ID.',
    example: 'cmp_123',
  });
}

function ApiMatchIdParam() {
  return ApiParam({
    name: 'matchId',
    description: 'Match ID.',
    example: 'mat_123',
  });
}

export function CreateMatchApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Create match',
      description:
        'Creates a match between two participants inside a competition. The match starts as scheduled.',
    }),
    ApiCompetitionIdParam(),
    ApiBody({ type: CreateMatchRequestDto }),
    ApiSuccessResponse({
      status: 201,
      description: 'Match created successfully',
      dataType: MatchDto,
    }),
    ApiValidationErrorResponse(),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Competition or participant'),
    ApiConflictErrorResponse('Match conflicts with current competition state'),
  );
}

export function ListMatchesApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'List competition matches',
      description: 'Returns matches for the given competition.',
    }),
    ApiCompetitionIdParam(),
    ApiQuery({ name: 'status', required: false, enum: MatchStatus }),
    ApiSuccessResponse({
      status: 200,
      description: 'Matches retrieved successfully',
      dataType: MatchDto,
      isArray: true,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Competition'),
  );
}

export function GetMatchApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get match detail',
      description: 'Returns match detail for the given match ID.',
    }),
    ApiMatchIdParam(),
    ApiSuccessResponse({
      status: 200,
      description: 'Match retrieved successfully',
      dataType: MatchDto,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Match'),
  );
}

export function UpdateMatchApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update match',
      description:
        'Updates match metadata. Changing participants may be blocked after score submission.',
    }),
    ApiMatchIdParam(),
    ApiBody({ type: UpdateMatchRequestDto }),
    ApiSuccessResponse({
      status: 200,
      description: 'Match updated successfully',
      dataType: MatchDto,
    }),
    ApiValidationErrorResponse(),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Match'),
    ApiConflictErrorResponse('Invalid match state for update'),
  );
}

export function UpdateMatchScoreApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update match score',
      description:
        'Inputs or updates a match score. A valid score submission completes the match.',
    }),
    ApiMatchIdParam(),
    ApiBody({ type: UpdateMatchScoreRequestDto }),
    ApiSuccessResponse({
      status: 200,
      description: 'Match score updated successfully',
      dataType: MatchDto,
    }),
    ApiValidationErrorResponse(),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Match'),
    ApiConflictErrorResponse('Invalid match state for score update'),
  );
}

export function UpdateMatchStatusApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update match status',
      description: 'Updates match status manually.',
    }),
    ApiMatchIdParam(),
    ApiBody({ type: UpdateMatchStatusRequestDto }),
    ApiSuccessResponse({
      status: 200,
      description: 'Match status updated successfully',
      dataType: MatchDto,
    }),
    ApiValidationErrorResponse(),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Match'),
    ApiConflictErrorResponse('Invalid match lifecycle transition'),
  );
}
