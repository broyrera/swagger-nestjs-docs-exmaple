import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import {
  ApiAuthErrorResponses,
  ApiConflictErrorResponse,
  ApiForbiddenErrorResponse,
  ApiNotFoundErrorResponse,
  ApiValidationErrorResponse,
} from '../../../common/decorators/api-error-responses.decorator';
import { ApiSuccessResponse } from '../../../common/decorators/api-success-response.decorator';
import { BracketDto } from '../dto/bracket.dto';
import { BracketMatchDto } from '../dto/bracket-match.dto';
import { GenerateBracketRequestDto } from '../dto/generate-bracket-request.dto';
import { UpdateBracketMatchRequestDto } from '../dto/update-bracket-match-request.dto';

function ApiCompetitionIdParam() {
  return ApiParam({
    name: 'competitionId',
    description: 'Competition ID.',
    example: 'cmp_123',
  });
}

function ApiBracketMatchIdParam() {
  return ApiParam({
    name: 'bracketMatchId',
    description: 'Bracket match ID.',
    example: 'bm_123',
  });
}

export function GetBracketApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get competition bracket',
      description:
        'Returns the bracket tree for a competition. Supports flexible participant counts and bye slots.',
    }),
    ApiCompetitionIdParam(),
    ApiSuccessResponse({
      status: 200,
      description: 'Bracket retrieved successfully',
      dataType: BracketDto,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Competition'),
  );
}

export function GenerateBracketApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Generate bracket',
      description:
        'Generates a bracket from approved participants. Non-perfect participant counts can be handled using byes.',
    }),
    ApiCompetitionIdParam(),
    ApiBody({ type: GenerateBracketRequestDto }),
    ApiSuccessResponse({
      status: 201,
      description: 'Bracket generated successfully',
      dataType: BracketDto,
    }),
    ApiValidationErrorResponse(),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Competition'),
    ApiConflictErrorResponse(
      'Bracket cannot be generated in current competition state',
    ),
  );
}

export function UpdateBracketMatchApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update bracket match',
      description:
        'Updates bracket match placement manually. Useful for informal competitions or bracket correction.',
    }),
    ApiBracketMatchIdParam(),
    ApiBody({ type: UpdateBracketMatchRequestDto }),
    ApiSuccessResponse({
      status: 200,
      description: 'Bracket match updated successfully',
      dataType: BracketMatchDto,
    }),
    ApiValidationErrorResponse(),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Bracket match'),
    ApiConflictErrorResponse('Invalid bracket match state for update'),
  );
}
