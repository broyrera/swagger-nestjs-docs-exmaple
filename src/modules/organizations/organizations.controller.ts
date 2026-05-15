import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  create(@Body() dto: CreateOrganizationRequestDto) {
    return this.organizationsService.create(dto);
  }

  @Get()
  @ListOrganizationsApiDocs()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':organizationId')
  @GetOrganizationApiDocs()
  findOne(@Param('organizationId') organizationId: string) {
    return this.organizationsService.findOne(organizationId);
  }

  @Post(':organizationId/members')
  @AddOrganizationMemberApiDocs()
  addMember(
    @Param('organizationId') organizationId: string,
    @Body() dto: AddOrganizationMemberRequestDto,
  ) {
    return this.organizationsService.addMember(organizationId, dto);
  }
}
