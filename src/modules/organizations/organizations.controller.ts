import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { AuthenticatedUser } from '../../common/auth/jwt-payload.type';
import {
  AddOrganizationMemberApiDocs,
  CreateOrganizationApiDocs,
  GetOrganizationApiDocs,
  ListOrganizationsApiDocs,
} from './docs/organizations.swagger';
import { AddOrganizationMemberRequestDto } from './dto/add-organization-member-request.dto';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @CreateOrganizationApiDocs()
  create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: CreateOrganizationRequestDto,
  ) {
    return this.organizationsService.create(currentUser, dto);
  }

  @Get()
  @ListOrganizationsApiDocs()
  findAll(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.organizationsService.findAll(currentUser);
  }

  @Get(':organizationId')
  @GetOrganizationApiDocs()
  findOne(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('organizationId') organizationId: string,
  ) {
    return this.organizationsService.findOne(currentUser, organizationId);
  }

  @Post(':organizationId/members')
  @AddOrganizationMemberApiDocs()
  addMember(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('organizationId') organizationId: string,
    @Body() dto: AddOrganizationMemberRequestDto,
  ) {
    return this.organizationsService.addMember(
      currentUser,
      organizationId,
      dto,
    );
  }
}
