import { Injectable } from '@nestjs/common';
import { AddOrganizationMemberRequestDto } from './dto/add-organization-member-request.dto';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { OrganizationRole } from './dto/organization-role.enum';

@Injectable()
export class OrganizationsService {
  create(dto: CreateOrganizationRequestDto) {
    return {
      success: true,
      message: 'Organization created successfully',
      data: {
        id: 'org_123',
        name: dto.name,
        description: dto.description,
        currentUserRole: OrganizationRole.OWNER,
      },
    };
  }

  findAll() {
    return {
      success: true,
      message: 'Organizations retrieved successfully',
      data: [
        {
          id: 'org_123',
          name: 'Garuda Sports Community',
          description: 'Community for sport and esport events.',
          currentUserRole: OrganizationRole.OWNER,
        },
      ],
    };
  }

  findOne(organizationId: string) {
    return {
      success: true,
      message: 'Organization retrieved successfully',
      data: {
        id: organizationId,
        name: 'Garuda Sports Community',
        description: 'Community for sport and esport events.',
        currentUserRole: OrganizationRole.OWNER,
      },
    };
  }

  addMember(organizationId: string, dto: AddOrganizationMemberRequestDto) {
    return {
      success: true,
      message: 'Organization member added successfully',
      data: {
        id: 'mem_123',
        userId: 'usr_456',
        email: dto.email,
        role: dto.role,
      },
    };
  }
}
