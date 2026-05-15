import { Injectable } from '@nestjs/common';
import { CreateParticipantRequestDto } from './dto/create-participant-request.dto';
import { ListParticipantsQueryDto } from './dto/list-participants-query.dto';
import { ParticipantStatus } from './dto/participant-status.enum';
import { ParticipantType } from './dto/participant-type.enum';
import { UpdateParticipantRequestDto } from './dto/update-participant-request.dto';

@Injectable()
export class ParticipantsService {
  create(competitionId: string, dto: CreateParticipantRequestDto) {
    return {
      success: true,
      message: 'Participant created successfully',
      data: {
        id: 'par_123',
        competitionId,
        type: dto.type,
        displayName: dto.displayName,
        linkedUserId: dto.linkedUserId ?? null,
        status: ParticipantStatus.PENDING,
      },
    };
  }

  findAll(competitionId: string, query: ListParticipantsQueryDto) {
    return {
      success: true,
      message: 'Participants retrieved successfully',
      data: [
        {
          id: 'par_123',
          competitionId,
          type: query.type ?? ParticipantType.TEAM,
          displayName: 'Garuda FC',
          linkedUserId: null,
          status: query.status ?? ParticipantStatus.PENDING,
        },
      ],
    };
  }

  findOne(participantId: string) {
    return {
      success: true,
      message: 'Participant retrieved successfully',
      data: {
        id: participantId,
        competitionId: 'cmp_123',
        type: ParticipantType.TEAM,
        displayName: 'Garuda FC',
        linkedUserId: null,
        status: ParticipantStatus.PENDING,
      },
    };
  }

  update(participantId: string, dto: UpdateParticipantRequestDto) {
    return {
      success: true,
      message: 'Participant updated successfully',
      data: {
        id: participantId,
        competitionId: 'cmp_123',
        type: ParticipantType.TEAM,
        displayName: dto.displayName ?? 'Garuda FC',
        linkedUserId: dto.linkedUserId ?? null,
        status: ParticipantStatus.PENDING,
      },
    };
  }

  approve(participantId: string) {
    return {
      success: true,
      message: 'Participant approved successfully',
      data: {
        id: participantId,
        competitionId: 'cmp_123',
        type: ParticipantType.TEAM,
        displayName: 'Garuda FC',
        linkedUserId: null,
        status: ParticipantStatus.APPROVED,
      },
    };
  }

  reject(participantId: string) {
    return {
      success: true,
      message: 'Participant rejected successfully',
      data: {
        id: participantId,
        competitionId: 'cmp_123',
        type: ParticipantType.TEAM,
        displayName: 'Garuda FC',
        linkedUserId: null,
        status: ParticipantStatus.REJECTED,
      },
    };
  }

  remove(participantId: string) {
    return {
      success: true,
      message: 'Participant removed successfully',
      data: {
        id: participantId,
        competitionId: 'cmp_123',
        type: ParticipantType.TEAM,
        displayName: 'Garuda FC',
        linkedUserId: null,
        status: ParticipantStatus.REMOVED,
      },
    };
  }
}
