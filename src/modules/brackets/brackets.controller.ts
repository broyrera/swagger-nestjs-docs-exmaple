import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BracketsService } from './brackets.service';
import {
  GenerateBracketApiDocs,
  GetBracketApiDocs,
  UpdateBracketMatchApiDocs,
} from './docs/brackets.swagger';
import { GenerateBracketRequestDto } from './dto/generate-bracket-request.dto';
import { UpdateBracketMatchRequestDto } from './dto/update-bracket-match-request.dto';

@ApiTags('Brackets')
@Controller()
export class BracketsController {
  constructor(private readonly bracketsService: BracketsService) {}

  @Get('competitions/:competitionId/bracket')
  @GetBracketApiDocs()
  getBracket(@Param('competitionId') competitionId: string) {
    return this.bracketsService.getBracket(competitionId);
  }

  @Post('competitions/:competitionId/bracket/generate')
  @GenerateBracketApiDocs()
  generate(
    @Param('competitionId') competitionId: string,
    @Body() dto: GenerateBracketRequestDto,
  ) {
    return this.bracketsService.generate(competitionId, dto);
  }

  @Patch('bracket-matches/:bracketMatchId')
  @UpdateBracketMatchApiDocs()
  updateBracketMatch(
    @Param('bracketMatchId') bracketMatchId: string,
    @Body() dto: UpdateBracketMatchRequestDto,
  ) {
    return this.bracketsService.updateBracketMatch(bracketMatchId, dto);
  }
}
