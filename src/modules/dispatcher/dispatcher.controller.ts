import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DispatcherService } from './dispatcher.service';
import { BoardQueryDto } from './dto/board-query.dto';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/role.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { CurrentOrgId } from '@/common/decorators/current-org-id.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { DispatchManualDto } from './dto/dispatcher-manual.dto';
import { DispatchAutoDto } from './dto/dispatcher-auto.dto';
import { DispatchBulkDto } from './dto/dispatcher-bulk.dto';

@ApiTags('Dispatcher')
@ApiBearerAuth()
@UseGuards(RolesGuard, PermissionsGuard)
@Controller('dispatcher')
export class DispatcherController {
  constructor(private readonly service: DispatcherService) {}

  @Get('board')
  @Roles('admin', 'manager', 'dispatcher')
  @Permissions('shipments:read', 'drivers:read', 'routes:read')
  @ApiOkResponse({
    description:
      'Dữ liệu board điều phối: shipments chưa gán + driver/vehicle khả dụng',
  })
  async board(@CurrentOrgId() orgId: string, @Query() q: BoardQueryDto) {
    return this.service.getBoard(orgId, {
      hubId: q.hubId,
      regionCode: q.regionCode,
      since: q.since ? new Date(q.since) : undefined,
      until: q.until ? new Date(q.until) : undefined,
      limit: q.limit,
      offset: q.offset,
    });
  }

  @Post('dispatch/manual')
  @Roles('admin', 'dispatcher')
  @Permissions('shipments:assign')
  @ApiOkResponse({ description: 'Gán thủ công 1 shipment cho driver/vehicle' })
  async dispatchManual(
    @CurrentOrgId() orgId: string,
    @CurrentUser() user: any,
    @Body() dto: DispatchManualDto,
  ) {
    return this.service.dispatchManual(orgId, user?.id ?? null, dto);
  }

  @Post('dispatch/auto')
  @Roles('admin', 'dispatcher')
  @Permissions('shipments:assign', 'routes:plan')
  @ApiOkResponse({
    description: 'Tự động gán 1 shipment theo heuristic scoring',
  })
  async dispatchAuto(
    @CurrentOrgId() orgId: string,
    @CurrentUser() user: any,
    @Body() dto: DispatchAutoDto,
  ) {
    return this.service.dispatchAuto(orgId, user?.id ?? null, dto);
  }

  @Post('dispatch/bulk')
  @Roles('admin', 'dispatcher')
  @Permissions('shipments:assign')
  @ApiOkResponse({
    description: 'Gán hàng loạt (hỗn hợp thủ công/auto theo từng item)',
  })
  async dispatchBulk(
    @CurrentOrgId() orgId: string,
    @CurrentUser() user: any,
    @Body() dto: DispatchBulkDto,
  ) {
    return this.service.dispatchBulk(orgId, user?.id ?? null, dto);
  }
}
