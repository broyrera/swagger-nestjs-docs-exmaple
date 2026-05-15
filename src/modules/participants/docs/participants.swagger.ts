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
import { CreateParticipantRequestDto } from '../dto/create-participant-request.dto';
import { ParticipantDto } from '../dto/participant.dto';
import { ParticipantStatus } from '../dto/participant-status.enum';
import { ParticipantType } from '../dto/participant-type.enum';
import { UpdateParticipantRequestDto } from '../dto/update-participant-request.dto';

function ApiCompetitionIdParam() {
  return ApiParam({
    name: 'competitionId',
    description: 'Competition ID.',
    example: 'cmp_123',
  });
}

function ApiParticipantIdParam() {
  return ApiParam({
    name: 'participantId',
    description: 'Participant ID.',
    example: 'par_123',
  });
}

export function CreateParticipantApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Create participant',
      description:
        'Creates a team or individual participant inside a competition. A linked user account is optional.',
    }),
    ApiCompetitionIdParam(),
    ApiBody({ type: CreateParticipantRequestDto }),
    ApiSuccessResponse({
      status: 201,
      description: 'Participant created successfully',
      dataType: ParticipantDto,
    }),
    ApiValidationErrorResponse(),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Competition'),
    ApiConflictErrorResponse(
      'Participant conflicts with current competition state',
    ),
  );
}

export function ListParticipantsApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'List competition participants',
      description: 'Returns participants registered in the given competition.',
    }),
    ApiCompetitionIdParam(),
    ApiQuery({ name: 'type', required: false, enum: ParticipantType }),
    ApiQuery({ name: 'status', required: false, enum: ParticipantStatus }),
    ApiSuccessResponse({
      status: 200,
      description: 'Participants retrieved successfully',
      dataType: ParticipantDto,
      isArray: true,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Competition'),
  );
}

export function GetParticipantApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get participant detail',
      description: 'Returns participant detail for the given participant ID.',
    }),
    ApiParticipantIdParam(),
    ApiSuccessResponse({
      status: 200,
      description: 'Participant retrieved successfully',
      dataType: ParticipantDto,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Participant'),
  );
}

export function UpdateParticipantApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update participant',
      description:
        'Updates participant information. Some changes may be blocked after matches exist.',
    }),
    ApiParticipantIdParam(),
    ApiBody({ type: UpdateParticipantRequestDto }),
    ApiSuccessResponse({
      status: 200,
      description: 'Participant updated successfully',
      dataType: ParticipantDto,
    }),
    ApiValidationErrorResponse(),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Participant'),
    ApiConflictErrorResponse('Invalid participant state for update'),
  );
}

export function ApproveParticipantApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Approve participant',
      description:
        'Approves a participant so it can be used for match generation, standings, and brackets.',
    }),
    ApiParticipantIdParam(),
    ApiSuccessResponse({
      status: 200,
      description: 'Participant approved successfully',
      dataType: ParticipantDto,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Participant'),
    ApiConflictErrorResponse('Invalid participant lifecycle transition'),
  );
}

export function RejectParticipantApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Reject participant',
      description:
        'Rejects a participant so it is excluded from active match generation.',
    }),
    ApiParticipantIdParam(),
    ApiSuccessResponse({
      status: 200,
      description: 'Participant rejected successfully',
      dataType: ParticipantDto,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Participant'),
    ApiConflictErrorResponse('Invalid participant lifecycle transition'),
  );
}

export function RemoveParticipantApiDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Remove participant',
      description:
        'Removes a participant. This may be blocked if locked matches depend on it.',
    }),
    ApiParticipantIdParam(),
    ApiSuccessResponse({
      status: 200,
      description: 'Participant removed successfully',
      dataType: ParticipantDto,
    }),
    ApiAuthErrorResponses(),
    ApiForbiddenErrorResponse(),
    ApiNotFoundErrorResponse('Participant'),
    ApiConflictErrorResponse('Participant is already used in locked matches'),
  );
}
