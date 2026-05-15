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
  CreateMatchApiDocs,
  GetMatchApiDocs,
  ListMatchesApiDocs,
  UpdateMatchApiDocs,
  UpdateMatchScoreApiDocs,
  UpdateMatchStatusApiDocs,
} from './docs/matches.swagger';
import { CreateMatchRequestDto } from './dto/create-match-request.dto';
import { ListMatchesQueryDto } from './dto/list-matches-query.dto';
import { UpdateMatchRequestDto } from './dto/update-match-request.dto';
import { UpdateMatchScoreRequestDto } from './dto/update-match-score-request.dto';
import { UpdateMatchStatusRequestDto } from './dto/update-match-status-request.dto';
import { MatchesService } from './matches.service';

@ApiTags('Matches')
@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('competitions/:competitionId/matches')
  @CreateMatchApiDocs()
  create(
    @Param('competitionId') competitionId: string,
    @Body() dto: CreateMatchRequestDto,
  ) {
    return this.matchesService.create(competitionId, dto);
  }

  @Get('competitions/:competitionId/matches')
  @ListMatchesApiDocs()
  findAll(
    @Param('competitionId') competitionId: string,
    @Query() query: ListMatchesQueryDto,
  ) {
    return this.matchesService.findAll(competitionId, query);
  }

  @Get('matches/:matchId')
  @GetMatchApiDocs()
  findOne(@Param('matchId') matchId: string) {
    return this.matchesService.findOne(matchId);
  }

  @Patch('matches/:matchId')
  @UpdateMatchApiDocs()
  update(
    @Param('matchId') matchId: string,
    @Body() dto: UpdateMatchRequestDto,
  ) {
    return this.matchesService.update(matchId, dto);
  }

  @Patch('matches/:matchId/score')
  @UpdateMatchScoreApiDocs()
  updateScore(
    @Param('matchId') matchId: string,
    @Body() dto: UpdateMatchScoreRequestDto,
  ) {
    return this.matchesService.updateScore(matchId, dto);
  }

  @Patch('matches/:matchId/status')
  @UpdateMatchStatusApiDocs()
  updateStatus(
    @Param('matchId') matchId: string,
    @Body() dto: UpdateMatchStatusRequestDto,
  ) {
    return this.matchesService.updateStatus(matchId, dto);
  }
}
