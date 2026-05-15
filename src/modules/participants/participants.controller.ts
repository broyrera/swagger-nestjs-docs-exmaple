import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApproveParticipantApiDocs,
  CreateParticipantApiDocs,
  GetParticipantApiDocs,
  ListParticipantsApiDocs,
  RejectParticipantApiDocs,
  RemoveParticipantApiDocs,
  UpdateParticipantApiDocs,
} from './docs/participants.swagger';
import { CreateParticipantRequestDto } from './dto/create-participant-request.dto';
import { ListParticipantsQueryDto } from './dto/list-participants-query.dto';
import { UpdateParticipantRequestDto } from './dto/update-participant-request.dto';
import { ParticipantsService } from './participants.service';

@ApiTags('Participants')
@Controller()
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post('competitions/:competitionId/participants')
  @CreateParticipantApiDocs()
  create(
    @Param('competitionId') competitionId: string,
    @Body() dto: CreateParticipantRequestDto,
  ) {
    return this.participantsService.create(competitionId, dto);
  }

  @Get('competitions/:competitionId/participants')
  @ListParticipantsApiDocs()
  findAll(
    @Param('competitionId') competitionId: string,
    @Query() query: ListParticipantsQueryDto,
  ) {
    return this.participantsService.findAll(competitionId, query);
  }

  @Get('participants/:participantId')
  @GetParticipantApiDocs()
  findOne(@Param('participantId') participantId: string) {
    return this.participantsService.findOne(participantId);
  }

  @Patch('participants/:participantId')
  @UpdateParticipantApiDocs()
  update(
    @Param('participantId') participantId: string,
    @Body() dto: UpdateParticipantRequestDto,
  ) {
    return this.participantsService.update(participantId, dto);
  }

  @Patch('participants/:participantId/approve')
  @ApproveParticipantApiDocs()
  approve(@Param('participantId') participantId: string) {
    return this.participantsService.approve(participantId);
  }

  @Patch('participants/:participantId/reject')
  @RejectParticipantApiDocs()
  reject(@Param('participantId') participantId: string) {
    return this.participantsService.reject(participantId);
  }

  @Delete('participants/:participantId')
  @RemoveParticipantApiDocs()
  remove(@Param('participantId') participantId: string) {
    return this.participantsService.remove(participantId);
  }
}
