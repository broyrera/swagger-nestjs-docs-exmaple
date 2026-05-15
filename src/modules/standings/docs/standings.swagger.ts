import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  ApiAuthErrorResponses,
  ApiForbiddenErrorResponse,
  ApiNotFoundErrorResponse,
} from '../../../common/decorators/api-error-responses.decorator';
import { ApiSuccessResponse } from '../../../common/decorators/api-success-response.decorator';
import { MatchDto } from '../../matches/dto/match.dto';
import { MatchStatus } from '../../matches/dto/match-status.enum';
import { StandingRowDto } from '../dto/standing-row.dto';

function ApiCompetitionIdParam() {
  return ApiParam({
    name: 'competitionId',
    description: 'Competition ID.',
    example: 'cmp_123',
  });
}

export function GetStandingsApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get competition standings',
      description:
        'Returns computed competition standings generated from participants, matches, and scores.',
    }),
    ApiCompetitionIdParam(),
    ApiSuccessResponse({
      status: 200,
      description: 'Standings retrieved successfully',
      dataType: StandingRowDto,
      isArray: true,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Competition'),
  );
}

export function GetResultsApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get competition results',
      description:
        'Returns competition match results. Results are derived from completed or result-related matches.',
    }),
    ApiCompetitionIdParam(),
    ApiQuery({ name: 'status', required: false, enum: MatchStatus }),
    ApiSuccessResponse({
      status: 200,
      description: 'Results retrieved successfully',
      dataType: MatchDto,
      isArray: true,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Competition'),
  );
}
