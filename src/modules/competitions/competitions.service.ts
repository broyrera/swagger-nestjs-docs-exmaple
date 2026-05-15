import { Injectable } from '@nestjs/common';
import { CompetitionFormat } from './dto/competition-format.enum';
import { CompetitionStatus } from './dto/competition-status.enum';
import { CompetitionType } from './dto/competition-type.enum';
import { CompetitionVisibility } from './dto/competition-visibility.enum';
import { CreateCompetitionRequestDto } from './dto/create-competition-request.dto';
import { ListCompetitionsQueryDto } from './dto/list-competitions-query.dto';
import { UpdateCompetitionRequestDto } from './dto/update-competition-request.dto';

@Injectable()
export class CompetitionsService {
  create(dto: CreateCompetitionRequestDto) {
    return {
      success: true,
      message: 'Competition created successfully',
      data: {
        id: 'cmp_123',
        organizationId: dto.organizationId,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        format: dto.format,
        visibility: dto.visibility,
        status: CompetitionStatus.DRAFT,
      },
    };
  }

  findAll(query: ListCompetitionsQueryDto) {
    return {
      success: true,
      message: 'Competitions retrieved successfully',
      data: [
        {
          id: 'cmp_123',
          organizationId: query.organizationId ?? 'org_123',
          name: 'Futsal RT Cup 2026',
          description: 'Community futsal competition.',
          type: query.type ?? CompetitionType.SPORT,
          format: query.format ?? CompetitionFormat.GROUP_STAGE_KNOCKOUT,
          visibility: CompetitionVisibility.PUBLIC,
          status: query.status ?? CompetitionStatus.DRAFT,
        },
      ],
    };
  }

  findOne(competitionId: string) {
    return {
      success: true,
      message: 'Competition retrieved successfully',
      data: {
        id: competitionId,
        organizationId: 'org_123',
        name: 'Futsal RT Cup 2026',
        description: 'Community futsal competition.',
        type: CompetitionType.SPORT,
        format: CompetitionFormat.GROUP_STAGE_KNOCKOUT,
        visibility: CompetitionVisibility.PUBLIC,
        status: CompetitionStatus.DRAFT,
      },
    };
  }

  update(competitionId: string, dto: UpdateCompetitionRequestDto) {
    return {
      success: true,
      message: 'Competition updated successfully',
      data: {
        id: competitionId,
        organizationId: 'org_123',
        name: dto.name ?? 'Futsal RT Cup 2026',
        description: dto.description ?? 'Community futsal competition.',
        type: dto.type ?? CompetitionType.SPORT,
        format: dto.format ?? CompetitionFormat.GROUP_STAGE_KNOCKOUT,
        visibility: dto.visibility ?? CompetitionVisibility.PUBLIC,
        status: CompetitionStatus.DRAFT,
      },
    };
  }

  publish(competitionId: string) {
    return {
      success: true,
      message: 'Competition published successfully',
      data: {
        id: competitionId,
        organizationId: 'org_123',
        name: 'Futsal RT Cup 2026',
        description: 'Community futsal competition.',
        type: CompetitionType.SPORT,
        format: CompetitionFormat.GROUP_STAGE_KNOCKOUT,
        visibility: CompetitionVisibility.PUBLIC,
        status: CompetitionStatus.PUBLISHED,
      },
    };
  }

  archive(competitionId: string) {
    return {
      success: true,
      message: 'Competition archived successfully',
      data: {
        id: competitionId,
        organizationId: 'org_123',
        name: 'Futsal RT Cup 2026',
        description: 'Community futsal competition.',
        type: CompetitionType.SPORT,
        format: CompetitionFormat.GROUP_STAGE_KNOCKOUT,
        visibility: CompetitionVisibility.PUBLIC,
        status: CompetitionStatus.ARCHIVED,
      },
    };
  }
}
