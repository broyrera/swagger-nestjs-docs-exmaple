import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GlobalUserRole,
  Organization,
  OrganizationMember,
  OrganizationRole,
  Prisma,
} from '@prisma/client';
import { AuthenticatedUser } from '../../common/auth/jwt-payload.type';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AddOrganizationMemberRequestDto } from './dto/add-organization-member-request.dto';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';

const WRITE_MEMBER_ROLES: OrganizationRole[] = [
  OrganizationRole.ORGANIZATION_OWNER,
  OrganizationRole.ORGANIZATION_ADMIN,
];

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    currentUser: AuthenticatedUser,
    dto: CreateOrganizationRequestDto,
  ) {
    const organization = await this.prisma.db.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: dto.name,
          description: dto.description,
          ownerId: currentUser.id,
        },
      });
      await tx.organizationMember.create({
        data: {
          organizationId: org.id,
          userId: currentUser.id,
          role: OrganizationRole.ORGANIZATION_OWNER,
        },
      });
      return org;
    });

    return {
      success: true,
      message: 'Organization created successfully',
      data: this.toOrganizationDto(
        organization,
        OrganizationRole.ORGANIZATION_OWNER,
      ),
    };
  }

  async findAll(currentUser: AuthenticatedUser) {
    const isSuperAdmin = currentUser.role === GlobalUserRole.SUPER_ADMIN;

    const organizations = await this.prisma.db.organization.findMany({
      where: isSuperAdmin
        ? undefined
        : {
            members: { some: { userId: currentUser.id } },
          },
      include: {
        members: {
          where: { userId: currentUser.id },
          select: { role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'Organizations retrieved successfully',
      data: organizations.map((org) =>
        this.toOrganizationDto(org, org.members[0]?.role ?? null),
      ),
    };
  }

  async findOne(currentUser: AuthenticatedUser, organizationId: string) {
    const organization = await this.prisma.db.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: {
          where: { userId: currentUser.id },
          select: { role: true },
        },
      },
    });

    const isSuperAdmin = currentUser.role === GlobalUserRole.SUPER_ADMIN;
    const membership = organization?.members[0];

    if (!organization || (!membership && !isSuperAdmin)) {
      // Non-members get 403 even for non-existent orgs to prevent enumeration.
      throw this.forbidden();
    }

    return {
      success: true,
      message: 'Organization retrieved successfully',
      data: this.toOrganizationDto(organization, membership?.role ?? null),
    };
  }

  async addMember(
    currentUser: AuthenticatedUser,
    organizationId: string,
    dto: AddOrganizationMemberRequestDto,
  ) {
    await this.assertCanManageMembers(currentUser, organizationId);

    const targetUser = await this.prisma.db.user.findUnique({
      where: { email: dto.email },
    });
    if (!targetUser) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
        error: {
          code: 'USER_NOT_FOUND',
          details: [
            { field: 'email', message: 'User with this email does not exist' },
          ],
        },
      });
    }

    try {
      const member = await this.prisma.db.organizationMember.create({
        data: {
          organizationId,
          userId: targetUser.id,
          role: dto.role,
        },
      });
      return {
        success: true,
        message: 'Organization member added successfully',
        data: this.toMemberDto(member, targetUser.email),
      };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException({
          success: false,
          message: 'User is already a member of this organization',
          error: { code: 'MEMBER_ALREADY_EXISTS', details: [] },
        });
      }
      throw err;
    }
  }

  private async assertCanManageMembers(
    currentUser: AuthenticatedUser,
    organizationId: string,
  ) {
    if (currentUser.role === GlobalUserRole.SUPER_ADMIN) {
      const exists = await this.prisma.db.organization.findUnique({
        where: { id: organizationId },
        select: { id: true },
      });
      if (!exists) {
        throw new NotFoundException({
          success: false,
          message: 'Organization not found',
          error: { code: 'ORGANIZATION_NOT_FOUND', details: [] },
        });
      }
      return;
    }

    const membership = await this.prisma.db.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: currentUser.id,
        },
      },
      select: { role: true },
    });

    if (!membership || !WRITE_MEMBER_ROLES.includes(membership.role)) {
      throw this.forbidden();
    }
  }

  private forbidden() {
    return new ForbiddenException({
      success: false,
      message: 'User does not have permission to perform this action',
      error: { code: 'FORBIDDEN', details: [] },
    });
  }

  private toOrganizationDto(
    org: Organization,
    currentUserRole: OrganizationRole | null,
  ) {
    return {
      id: org.id,
      name: org.name,
      description: org.description ?? undefined,
      currentUserRole,
    };
  }

  private toMemberDto(member: OrganizationMember, email: string) {
    return {
      id: member.id,
      userId: member.userId,
      email,
      role: member.role,
    };
  }
}
