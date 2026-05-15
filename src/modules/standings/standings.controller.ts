import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  GetResultsApiDocs,
  GetStandingsApiDocs,
} from './docs/standings.swagger';
import { ListResultsQueryDto } from './dto/list-results-query.dto';
import { StandingsService } from './standings.service';

@ApiTags('Standings')
@Controller('competitions/:competitionId')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get('standings')
  @GetStandingsApiDocs()
  getStandings(@Param('competitionId') competitionId: string) {
    return this.standingsService.getStandings(competitionId);
  }

  @Get('results')
  @GetResultsApiDocs()
  getResults(
    @Param('competitionId') competitionId: string,
    @Query() query: ListResultsQueryDto,
  ) {
    return this.standingsService.getResults(competitionId, query);
  }
}
