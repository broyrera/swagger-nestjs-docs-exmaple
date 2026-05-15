import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Competition,
  CompetitionRole,
  CompetitionStatus,
  CompetitionVisibility,
  GlobalUserRole,
  OrganizationRole,
  Prisma,
} from '@prisma/client';
import { AuthenticatedUser } from '../../common/auth/jwt-payload.type';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCompetitionRequestDto } from './dto/create-competition-request.dto';
import { ListCompetitionsQueryDto } from './dto/list-competitions-query.dto';
import { UpdateCompetitionRequestDto } from './dto/update-competition-request.dto';

const ORG_MANAGE_ROLES: OrganizationRole[] = [
  OrganizationRole.ORGANIZATION_OWNER,
  OrganizationRole.ORGANIZATION_ADMIN,
];
const COMP_MANAGE_ROLES: CompetitionRole[] = [
  CompetitionRole.COMPETITION_OWNER,
  CompetitionRole.COMPETITION_ADMIN,
];

@Injectable()
export class CompetitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    currentUser: AuthenticatedUser,
    dto: CreateCompetitionRequestDto,
  ) {
    await this.assertCanCreateUnderOrg(currentUser, dto.organizationId);

    const competition = await this.prisma.db.$transaction(async (tx) => {
      const cmp = await tx.competition.create({
        data: {
          organizationId: dto.organizationId,
          name: dto.name,
          description: dto.description,
          type: dto.type,
          format: dto.format,
          visibility: dto.visibility,
        },
      });
      await tx.competitionRoleAssignment.create({
        data: {
          competitionId: cmp.id,
          userId: currentUser.id,
          role: CompetitionRole.COMPETITION_OWNER,
        },
      });
      return cmp;
    });

    return {
      success: true,
      message: 'Competition created successfully',
      data: this.toDto(competition),
    };
  }

  async findAll(
    currentUser: AuthenticatedUser,
    query: ListCompetitionsQueryDto,
  ) {
    const visibilityFilter = this.buildVisibilityFilter(currentUser);

    const filters: Prisma.CompetitionWhereInput[] = [];
    if (query.organizationId) {
      filters.push({ organizationId: query.organizationId });
    }
    if (query.type) filters.push({ type: query.type });
    if (query.format) filters.push({ format: query.format });
    if (query.status) filters.push({ status: query.status });

    const where: Prisma.CompetitionWhereInput =
      visibilityFilter && filters.length
        ? { AND: [visibilityFilter, ...filters] }
        : visibilityFilter ?? (filters.length ? { AND: filters } : {});

    const competitions = await this.prisma.db.competition.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'Competitions retrieved successfully',
      data: competitions.map((c) => this.toDto(c)),
    };
  }

  async findOne(currentUser: AuthenticatedUser, competitionId: string) {
    const isSuperAdmin = currentUser.role === GlobalUserRole.SUPER_ADMIN;
    const competition = await this.prisma.db.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      // SUPER_ADMIN gets honest 404; others get 403 to prevent enumeration.
      throw isSuperAdmin ? this.notFound() : this.forbidden();
    }

    if (!(await this.canRead(currentUser, competition))) {
      throw this.forbidden();
    }

    return {
      success: true,
      message: 'Competition retrieved successfully',
      data: this.toDto(competition),
    };
  }

  async update(
    currentUser: AuthenticatedUser,
    competitionId: string,
    dto: UpdateCompetitionRequestDto,
  ) {
    const competition = await this.assertCanManage(currentUser, competitionId);
    if (competition.status !== CompetitionStatus.DRAFT) {
      throw this.lifecycleConflict('Competition can only be updated in DRAFT state');
    }

    const updated = await this.prisma.db.competition.update({
      where: { id: competitionId },
      data: {
        name: dto.name ?? undefined,
        description: dto.description ?? undefined,
        type: dto.type ?? undefined,
        format: dto.format ?? undefined,
        visibility: dto.visibility ?? undefined,
      },
    });

    return {
      success: true,
      message: 'Competition updated successfully',
      data: this.toDto(updated),
    };
  }

  async publish(currentUser: AuthenticatedUser, competitionId: string) {
    const competition = await this.assertCanManage(currentUser, competitionId);
    if (competition.status !== CompetitionStatus.DRAFT) {
      throw this.lifecycleConflict(
        `Competition cannot be published from ${competition.status} state`,
      );
    }

    const updated = await this.prisma.db.competition.update({
      where: { id: competitionId },
      data: { status: CompetitionStatus.PUBLISHED },
    });

    return {
      success: true,
      message: 'Competition published successfully',
      data: this.toDto(updated),
    };
  }

  async archive(currentUser: AuthenticatedUser, competitionId: string) {
    const competition = await this.assertCanManage(currentUser, competitionId);
    if (competition.status === CompetitionStatus.ARCHIVED) {
      throw this.lifecycleConflict('Competition is already archived');
    }

    const updated = await this.prisma.db.competition.update({
      where: { id: competitionId },
      data: { status: CompetitionStatus.ARCHIVED },
    });

    return {
      success: true,
      message: 'Competition archived successfully',
      data: this.toDto(updated),
    };
  }

  // ─── Authorization helpers ─────────────────────────────────────────────

  private async assertCanCreateUnderOrg(
    currentUser: AuthenticatedUser,
    organizationId: string,
  ) {
    const org = await this.prisma.db.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });
    if (!org) {
      throw new NotFoundException({
        success: false,
        message: 'Organization not found',
        error: { code: 'ORGANIZATION_NOT_FOUND', details: [] },
      });
    }

    if (currentUser.role === GlobalUserRole.SUPER_ADMIN) return;

    const membership = await this.prisma.db.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: currentUser.id,
        },
      },
      select: { role: true },
    });

    if (!membership || !ORG_MANAGE_ROLES.includes(membership.role)) {
      throw this.forbidden();
    }
  }

  private async assertCanManage(
    currentUser: AuthenticatedUser,
    competitionId: string,
  ): Promise<Competition> {
    const competition = await this.prisma.db.competition.findUnique({
      where: { id: competitionId },
    });
    const isSuperAdmin = currentUser.role === GlobalUserRole.SUPER_ADMIN;

    if (!competition) {
      throw isSuperAdmin ? this.notFound() : this.forbidden();
    }

    if (isSuperAdmin) return competition;

    // Org-level manage
    const orgMembership = await this.prisma.db.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: competition.organizationId,
          userId: currentUser.id,
        },
      },
      select: { role: true },
    });
    if (orgMembership && ORG_MANAGE_ROLES.includes(orgMembership.role)) {
      return competition;
    }

    // Competition-level manage
    const compRole = await this.prisma.db.competitionRoleAssignment.findFirst({
      where: {
        competitionId,
        userId: currentUser.id,
        role: { in: COMP_MANAGE_ROLES },
      },
      select: { role: true },
    });
    if (compRole) return competition;

    throw this.forbidden();
  }

  private async canRead(
    currentUser: AuthenticatedUser,
    competition: Competition,
  ): Promise<boolean> {
    if (currentUser.role === GlobalUserRole.SUPER_ADMIN) return true;
    if (competition.visibility === CompetitionVisibility.PUBLIC) return true;

    const orgMembership = await this.prisma.db.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: competition.organizationId,
          userId: currentUser.id,
        },
      },
      select: { id: true },
    });
    if (orgMembership) return true;

    const compRole = await this.prisma.db.competitionRoleAssignment.findFirst({
      where: { competitionId: competition.id, userId: currentUser.id },
      select: { id: true },
    });
    return !!compRole;
  }

  private buildVisibilityFilter(
    currentUser: AuthenticatedUser,
  ): Prisma.CompetitionWhereInput | null {
    if (currentUser.role === GlobalUserRole.SUPER_ADMIN) return null;
    return {
      OR: [
        { visibility: CompetitionVisibility.PUBLIC },
        {
          organization: {
            members: { some: { userId: currentUser.id } },
          },
        },
        {
          roleAssignments: { some: { userId: currentUser.id } },
        },
      ],
    };
  }

  // ─── Error helpers ─────────────────────────────────────────────────────

  private forbidden() {
    return new ForbiddenException({
      success: false,
      message: 'User does not have permission to perform this action',
      error: { code: 'FORBIDDEN', details: [] },
    });
  }

  private notFound() {
    return new NotFoundException({
      success: false,
      message: 'Competition not found',
      error: { code: 'COMPETITION_NOT_FOUND', details: [] },
    });
  }

  private lifecycleConflict(message: string) {
    return new ConflictException({
      success: false,
      message,
      error: { code: 'INVALID_LIFECYCLE_TRANSITION', details: [] },
    });
  }

  private toDto(c: Competition) {
    return {
      id: c.id,
      organizationId: c.organizationId,
      name: c.name,
      description: c.description ?? undefined,
      type: c.type,
      format: c.format,
      visibility: c.visibility,
      status: c.status,
    };
  }
}
