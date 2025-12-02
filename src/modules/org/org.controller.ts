import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrgService } from './org.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { AssignMemberDto } from './dto/assign-member.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  ListMembersResponse,
  ListOrgsResponse,
  OrgBrief,
  SwitchOrgResponse,
} from './dto/responses';
import { AuditAction } from '@/common/audit/audit.types';
import { UseAudit } from '@/common/decorators/audit.decorator';
import { AdvancedScopeGuard } from '@/common/guards/advanced-scope.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/role.guard';

@ApiTags('Orgs')
@ApiBearerAuth()
@Controller('orgs')
export class OrgController {
  constructor(private readonly service: OrgService) {}
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Permissions('org.create')
  @UseAudit({ entity: 'Org', action: AuditAction.Create })
  @ApiOperation({
    summary: 'Create a new organization',
    description:
      'Create a new organization. Only SUPER_ADMIN, ADMIN, or MANAGER roles can create organizations.',
  })
  @ApiCreatedResponse({ type: OrgBrief })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - user does not have required role or permission',
  })
  @ApiBadRequestResponse({ description: 'Bad Request - invalid input data' })
  async createOrg(@Body() dto: CreateOrgDto) {
    return this.service.createOrg(dto);
  }

  @Get()
  @Permissions('org.read')
  @ApiOperation({
    summary: 'List all organizations',
    description:
      'Get a paginated list of organizations. Supports cursor-based pagination and search by name or code.',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for org name or code',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Pagination cursor',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of items to return (default: 20)',
  })
  @ApiOkResponse({ type: ListOrgsResponse })
  async listOrgs(
    @Query('q') q?: string,
    @Query('cursor') cursor?: string,
    @Query('take') take = '20',
  ) {
    return this.service.listOrgs({ q, cursor, take: Number(take) });
  }

  @Get(':id')
  @UseGuards(AdvancedScopeGuard)
  @ApiOperation({
    summary: 'Get organization by ID',
    description:
      'Retrieve a specific organization by its ID. User must have scope access to the organization.',
  })
  @ApiParam({ name: 'id', description: 'Organization ID (UUID)' })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiForbiddenResponse({
    description:
      'Forbidden - user does not have scope access to this organization',
  })
  @Permissions('org.read')
  @ApiOkResponse({ type: OrgBrief })
  async getOrg(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.getOrg(id);
  }
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Permissions('org.update')
  @UseAudit({ entity: 'Org', action: AuditAction.Update })
  @ApiOperation({
    summary: 'Update organization',
    description:
      'Update organization details (name). Only SUPER_ADMIN, ADMIN, or MANAGER can update.',
  })
  @ApiParam({ name: 'id', description: 'Organization ID (UUID)' })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiForbiddenResponse({
    description: 'Forbidden - user does not have required role or permission',
  })
  @ApiOkResponse({ type: OrgBrief })
  async updateOrg(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOrgDto,
  ) {
    return this.service.updateOrg(id, dto);
  }
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Permissions('org.delete')
  @UseAudit({ entity: 'Org', action: AuditAction.Delete })
  @ApiOperation({
    summary: 'Delete organization',
    description:
      'Delete an organization and all associated data. Only SUPER_ADMIN, ADMIN, or MANAGER can delete.',
  })
  @ApiParam({ name: 'id', description: 'Organization ID (UUID)' })
  @ApiOkResponse({ schema: { properties: { ok: { type: 'boolean' } } } })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiForbiddenResponse({
    description: 'Forbidden - user does not have required role or permission',
  })
  async deleteOrg(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.deleteOrg(id);
  }

  // Members
  @Get(':id/members')
  @UseGuards(AdvancedScopeGuard)
  @Permissions('org.members.read')
  @ApiOperation({
    summary: 'List organization members',
    description:
      'Get all members of a specific organization. User must have scope access to the organization.',
  })
  @ApiParam({ name: 'id', description: 'Organization ID (UUID)' })
  @ApiOkResponse({ type: ListMembersResponse })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiForbiddenResponse({
    description:
      'Forbidden - user does not have scope access to this organization',
  })
  async listMembers(@Param('id', new ParseUUIDPipe()) id: string) {
    const items = await this.service.listMembers(id);
    return { items };
  }
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/members')
  @Permissions('org.members.assign')
  @UseAudit({ entity: 'UserOrg', action: AuditAction.Create })
  @ApiOperation({
    summary: 'Assign member to organization',
    description:
      'Add a user as a member to an organization. Only SUPER_ADMIN, ADMIN, or MANAGER can assign members.',
  })
  @ApiParam({ name: 'id', description: 'Organization ID (UUID)' })
  @ApiBadRequestResponse({
    description: 'Bad Request - invalid user ID or user already member',
  })
  @ApiNotFoundResponse({ description: 'Organization or user not found' })
  @ApiForbiddenResponse({
    description: 'Forbidden - user does not have required role or permission',
  })
  @ApiOkResponse({ schema: { properties: { ok: { type: 'boolean' } } } })
  async assignMember(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignMemberDto,
  ) {
    return this.service.assignMember(id, dto.userId);
  }
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id/members/:userId')
  @Permissions('org.members.remove')
  @UseAudit({ entity: 'UserOrg', action: AuditAction.Delete })
  @ApiOperation({
    summary: 'Remove member from organization',
    description:
      'Remove a user from an organization. Only SUPER_ADMIN, ADMIN, or MANAGER can remove members.',
  })
  @ApiParam({ name: 'id', description: 'Organization ID (UUID)' })
  @ApiParam({ name: 'userId', description: 'User ID (UUID)' })
  @ApiNotFoundResponse({
    description: 'Organization or user membership not found',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - user does not have required role or permission',
  })
  @ApiOkResponse({ schema: { properties: { ok: { type: 'boolean' } } } })
  async removeMember(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.service.removeMember(id, userId);
  }

  // My memberships
  @Get('/me/memberships')
  @ApiOperation({
    summary: 'Get my organization memberships',
    description: 'Get all organizations that the current user is a member of.',
  })
  @Permissions('org.read')
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        properties: {
          orgId: { type: 'string' },
          code: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  })
  async myMemberships() {
    return this.service.myMemberships();
  }

  // Switch Org
  @Post(':id/switch')
  @UseGuards(AdvancedScopeGuard)
  @Permissions('org.switch')
  @ApiOperation({
    summary: 'Switch current organization context',
    description:
      'Switch the user context to a different organization and return a new access token with the new org scope.',
  })
  @ApiParam({ name: 'id', description: 'Organization ID (UUID)' })
  @ApiOkResponse({ type: SwitchOrgResponse })
  @ApiForbiddenResponse({
    description: 'Forbidden - user is not a member of this organization',
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async switchOrg(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.switchOrg(id);
  }
}
