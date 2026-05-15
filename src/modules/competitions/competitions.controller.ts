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
  create(@Body() dto: CreateCompetitionRequestDto) {
    return this.competitionsService.create(dto);
  }

  @Get()
  @ListCompetitionsApiDocs()
  findAll(@Query() query: ListCompetitionsQueryDto) {
    return this.competitionsService.findAll(query);
  }

  @Get(':competitionId')
  @GetCompetitionApiDocs()
  findOne(@Param('competitionId') competitionId: string) {
    return this.competitionsService.findOne(competitionId);
  }

  @Patch(':competitionId')
  @UpdateCompetitionApiDocs()
  update(
    @Param('competitionId') competitionId: string,
    @Body() dto: UpdateCompetitionRequestDto,
  ) {
    return this.competitionsService.update(competitionId, dto);
  }

  @Patch(':competitionId/publish')
  @PublishCompetitionApiDocs()
  publish(@Param('competitionId') competitionId: string) {
    return this.competitionsService.publish(competitionId);
  }

  @Patch(':competitionId/archive')
  @ArchiveCompetitionApiDocs()
  archive(@Param('competitionId') competitionId: string) {
    return this.competitionsService.archive(competitionId);
  }
}
