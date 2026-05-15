import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { AuthenticatedUser } from '../../common/auth/jwt-payload.type';
import {
  ArchiveCompetitionApiDocs,
  CreateCompetitionApiDocs,
  GetCompetitionApiDocs,
  ListCompetitionsApiDocs,
  PublishCompetitionApiDocs,
  UpdateCompetitionApiDocs,
} from './docs/competitions.swagger';
import { CreateCompetitionRequestDto } from './dto/create-competition-request.dto';
import { ListCompetitionsQueryDto } from './dto/list-competitions-query.dto';
import { UpdateCompetitionRequestDto } from './dto/update-competition-request.dto';
import { CompetitionsService } from './competitions.service';

@ApiTags('Competitions')
@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Post()
  @CreateCompetitionApiDocs()
  create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: CreateCompetitionRequestDto,
  ) {
    return this.competitionsService.create(currentUser, dto);
  }

  @Get()
  @ListCompetitionsApiDocs()
  findAll(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: ListCompetitionsQueryDto,
  ) {
    return this.competitionsService.findAll(currentUser, query);
  }

  @Get(':competitionId')
  @GetCompetitionApiDocs()
  findOne(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('competitionId') competitionId: string,
  ) {
    return this.competitionsService.findOne(currentUser, competitionId);
  }

  @Patch(':competitionId')
  @UpdateCompetitionApiDocs()
  update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('competitionId') competitionId: string,
    @Body() dto: UpdateCompetitionRequestDto,
  ) {
    return this.competitionsService.update(currentUser, competitionId, dto);
  }

  @Patch(':competitionId/publish')
  @PublishCompetitionApiDocs()
  publish(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('competitionId') competitionId: string,
  ) {
    return this.competitionsService.publish(currentUser, competitionId);
  }

  @Patch(':competitionId/archive')
  @ArchiveCompetitionApiDocs()
  archive(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('competitionId') competitionId: string,
  ) {
    return this.competitionsService.archive(currentUser, competitionId);
  }
}
