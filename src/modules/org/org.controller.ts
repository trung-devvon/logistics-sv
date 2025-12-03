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
import { AuditAction } from '@/common/types/audit.types';
import { UseAudit } from '@/common/decorators/audit.decorator';
import { AdvancedScopeGuard } from '@/common/guards/advanced-scope.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/role.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtUser } from '@/common/types/user.types';

@ApiTags('Orgs')
@ApiBearerAuth('JWT-auth')
@Controller('orgs')
export class OrgController {
  constructor(private readonly service: OrgService) {}
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Permissions('org.create')
  @UseAudit({ entity: 'Org', action: AuditAction.Create })
  @ApiOperation({
    summary: 'Tạo tổ chức mới',
    description:
      'Tạo một tổ chức mới. Chỉ các vai trò SUPER_ADMIN, ADMIN hoặc MANAGER mới có thể tạo tổ chức.',
  })
  @ApiCreatedResponse({ type: OrgBrief })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - user does not have required role or permission',
  })
  @ApiBadRequestResponse({ description: 'Bad Request - invalid input data' })
  async createOrg(@Body() dto: CreateOrgDto, @CurrentUser() me: JwtUser) {
    return this.service.createOrg(dto, me.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Permissions('org.read')
  @ApiOperation({
    summary: 'Liệt kê tổ chức',
    description:
      'Trả về danh sách tổ chức phân trang. Hỗ trợ phân trang theo cursor và tìm kiếm theo tên hoặc mã.',
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
  @UseGuards(JwtAuthGuard, AdvancedScopeGuard)
  @ApiOperation({
    summary: 'Lấy tổ chức theo ID',
    description:
      'Lấy thông tin tổ chức theo ID. Người dùng phải có phạm vi truy cập (scope) với tổ chức đó.',
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
    summary: 'Cập nhật tổ chức',
    description:
      'Cập nhật thông tin tổ chức (ví dụ: tên). Chỉ SUPER_ADMIN, ADMIN hoặc MANAGER có thể cập nhật.',
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
    summary: 'Xóa tổ chức',
    description:
      'Xóa tổ chức và tất cả dữ liệu liên quan. Chỉ SUPER_ADMIN, ADMIN hoặc MANAGER có thể xóa.',
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
  @UseGuards(JwtAuthGuard, AdvancedScopeGuard)
  @Permissions('org.members.read')
  @ApiOperation({
    summary: 'Liệt kê thành viên tổ chức',
    description:
      'Lấy tất cả thành viên của một tổ chức cụ thể. Người dùng phải có phạm vi truy cập với tổ chức đó.',
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
    summary: 'Gán thành viên vào tổ chức',
    description:
      'Thêm user vào tổ chức với vai trò thành viên. Chỉ SUPER_ADMIN, ADMIN hoặc MANAGER có thể gán thành viên.',
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
    summary: 'Gỡ thành viên khỏi tổ chức',
    description:
      'Gỡ user ra khỏi tổ chức. Chỉ SUPER_ADMIN, ADMIN hoặc MANAGER có thể thực hiện.',
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Lấy các tổ chức tôi tham gia',
    description: 'Lấy tất cả tổ chức mà người dùng hiện tại là thành viên.',
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
  async myMemberships(@CurrentUser() me: JwtUser) {
    return this.service.myMemberships(me.sub);
  }

  // Switch Org
  @Post(':id/switch')
  @UseGuards(JwtAuthGuard, AdvancedScopeGuard)
  @Permissions('org.switch')
  @ApiOperation({
    summary: 'Chuyển tổ chức hiện tại',
    description:
      'Chuyển ngữ cảnh người dùng sang một tổ chức khác và trả về access token mới có phạm vi (scope) của tổ chức đó.',
  })
  @ApiParam({ name: 'id', description: 'Organization ID (UUID)' })
  @ApiOkResponse({ type: SwitchOrgResponse })
  @ApiForbiddenResponse({
    description: 'Forbidden - user is not a member of this organization',
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async switchOrg(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() me: JwtUser,
  ) {
    return this.service.switchOrg(id, me.sub);
  }
}
