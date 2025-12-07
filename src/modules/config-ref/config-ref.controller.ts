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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ConfigRefService } from './config-ref.service';
import { UpdateRegionDto } from './dto/update-region.dto';
import { CreateServiceLevelDto } from './dto/create-service-level.dto';
import { UpdateServiceLevelDto } from './dto/update-service-level.dto';
import { UseAudit } from '@/common/decorators/audit.decorator';
import { AdvancedScopeGuard } from '@/common/guards/advanced-scope.guard';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/role.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { AuditAction } from '@/common/types/audit.types';
import { Permissions } from '@/common/decorators/permissions.decorator';
import {
  RegionRow,
  ListRegionsResponse,
  ServiceLevelRow,
  ListServiceLevelsResponse,
} from './dto/responses';
import { CreateRegionDto } from './dto/create-region.dto.ts';
import { Roles } from '@/common/decorators/roles.decorator';
@ApiTags('Configs')
@ApiBearerAuth()
@Controller('configs')
export class ConfigRefController {
  constructor(private readonly service: ConfigRefService) {}

  // ------- Regions (global) -------

  @Post('regions')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard, AdvancedScopeGuard, PermissionsGuard)
  @Permissions('config.region.create')
  @UseAudit({ entity: 'ConfigRegion', action: AuditAction.Create })
  @ApiOkResponse({ type: RegionRow })
  createRegion(@Body() dto: CreateRegionDto) {
    return this.service.createRegion(dto);
  }

  @Get('regions')
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'HUB_MANAGER',
    'DISPATCHER',
    'STATION_MANAGER',
  )
  @UseGuards(JwtAuthGuard, RolesGuard, AdvancedScopeGuard, PermissionsGuard)
  @Permissions('config.region.read')
  @ApiOkResponse({ type: ListRegionsResponse })
  listRegions(
    @Query('q') q?: string,
    @Query('active') active?: string,
    @Query('cursor') cursor?: string,
    @Query('take') take = '20',
  ) {
    const activeBool =
      typeof active === 'string' ? active === 'true' : undefined;
    return this.service.listRegions({
      q,
      active: activeBool,
      cursor,
      take: Number(take),
    });
  }

  @Get('regions/:id')
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'HUB_MANAGER',
    'DISPATCHER',
    'STATION_MANAGER',
  )
  @UseGuards(JwtAuthGuard, RolesGuard, AdvancedScopeGuard, PermissionsGuard)
  @Permissions('config.region.read')
  @ApiOkResponse({ type: RegionRow })
  async getRegion(@Param('id', new ParseUUIDPipe()) id: string) {
    return { data: await this.service.getRegion(id) };
  }

  @Patch('regions/:id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard, AdvancedScopeGuard, PermissionsGuard)
  @Permissions('config.region.update')
  @UseAudit({ entity: 'ConfigRegion', action: AuditAction.Update })
  @ApiOkResponse({ type: RegionRow })
  async updateRegion(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateRegionDto,
  ) {
    return { data: await this.service.updateRegion(id, dto) };
  }

  @Delete('regions/:id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard, AdvancedScopeGuard, PermissionsGuard)
  @Permissions('config.region.delete')
  @UseAudit({ entity: 'ConfigRegion', action: AuditAction.Delete })
  @ApiOkResponse({ schema: { properties: { ok: { type: 'boolean' } } } })
  async deleteRegion(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.deleteRegion(id);
    return { ok: true };
  }

  // ------- Service Levels (per org) -------
  @Post('service-levels')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard, AdvancedScopeGuard)
  @Permissions('config.serviceLevel.create')
  @UseAudit({ entity: 'ConfigServiceLevel', action: AuditAction.Create })
  @ApiOkResponse({ type: ServiceLevelRow })
  createServiceLevel(@Body() dto: CreateServiceLevelDto) {
    return this.service.createServiceLevel(dto);
  }

  @Get('orgs/:orgId/service-levels')
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'HUB_MANAGER',
    'DISPATCHER',
    'STATION_MANAGER',
  )
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard, AdvancedScopeGuard)
  @Permissions('config.serviceLevel.read')
  @ApiOkResponse({ type: ListServiceLevelsResponse })
  listServiceLevels(
    @Param('orgId', new ParseUUIDPipe()) orgId: string,
    @Query('q') q?: string,
    @Query('active') active?: string,
    @Query('cursor') cursor?: string,
    @Query('take') take = '20',
  ) {
    const activeBool =
      typeof active === 'string' ? active === 'true' : undefined;
    return this.service.listServiceLevels(orgId, {
      q,
      active: activeBool,
      cursor,
      take: Number(take),
    });
  }

  @Get('service-levels/:id')
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'HUB_MANAGER',
    'DISPATCHER',
    'STATION_MANAGER',
  )
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard, AdvancedScopeGuard)
  @Permissions('config.serviceLevel.read')
  @ApiOkResponse({ type: ServiceLevelRow })
  getServiceLevel(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.getServiceLevel(id);
  }

  @Patch('service-levels/:id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard, AdvancedScopeGuard)
  @Permissions('config.serviceLevel.update')
  @UseAudit({ entity: 'ConfigServiceLevel', action: AuditAction.Update })
  @ApiOkResponse({ type: ServiceLevelRow })
  updateServiceLevel(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateServiceLevelDto,
  ) {
    return this.service.updateServiceLevel(id, dto);
  }

  @Delete('service-levels/:id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard, AdvancedScopeGuard)
  @Permissions('config.serviceLevel.delete')
  @UseAudit({ entity: 'ConfigServiceLevel', action: AuditAction.Delete })
  @ApiOkResponse({ schema: { properties: { ok: { type: 'boolean' } } } })
  async deleteServiceLevel(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.deleteServiceLevel(id);
    return { ok: true };
  }
}
