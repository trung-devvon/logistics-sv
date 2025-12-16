import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AssignmentService } from './assignment.service';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CurrentOrgId } from '@/common/decorators/current-org-id.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { AssignRequestDto } from './dto/assignment-request.dto';
import { AssignmentViewDto } from './dto/assignment-view.dto';
import { ReassignRequestDto } from './dto/reassign-request.dto';
import { UnassignRequestDto } from './dto/unassign-request.dto';
import { IAssignmentView } from './interfaces/assignment.interfaces';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/role.guard';

@ApiTags('Assignments')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard, PermissionsGuard)
@Controller('assignments')
export class AssignmentController {
  constructor(private readonly service: AssignmentService) {}
  @Get(':shipmentId')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'DISPATCHER')
  @Permissions('shipments:read')
  @ApiOkResponse({
    type: AssignmentViewDto,
    description: 'Xem assignment của 1 shipment',
  })
  async getByShipment(
    @CurrentOrgId() orgId: string | undefined,
    @Param('shipmentId') shipmentId: string,
  ): Promise<IAssignmentView | null> {
    const a = await this.service.getAssignmentByShipment(orgId, shipmentId);
    if (!a) return null;
    return {
      id: a.id,
      shipmentId: a.shipmentId,
      driverId: a.driverId ?? null,
      vehicleId: a.vehicleId ?? null,
      assignedBy: a.assignedBy ?? null,
      assignedAt: a.assignedAt
        ? a.assignedAt.toISOString()
        : new Date(0).toISOString(),
      note: null,
    };
  }

  @Post('assign')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DISPATCHER')
  @Permissions('shipments:assign')
  @ApiOkResponse({
    type: AssignmentViewDto,
    description: 'Gán driver/vehicle cho shipment',
  })
  async assign(
    @CurrentOrgId() orgId: string | undefined,
    @CurrentUser() user: any,
    @Body() dto: AssignRequestDto,
  ): Promise<IAssignmentView> {
    const a = await this.service.assign(orgId, user?.id ?? null, dto);
    return {
      id: a.id,
      shipmentId: a.shipmentId,
      driverId: a.driverId ?? null,
      vehicleId: a.vehicleId ?? null,
      assignedBy: a.assignedBy ?? null,
      assignedAt: a.assignedAt
        ? a.assignedAt.toISOString()
        : new Date().toISOString(),
      note: null,
    };
  }

  @Post('reassign')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DISPATCHER')
  @Permissions('shipments:assign')
  @ApiOkResponse({
    type: AssignmentViewDto,
    description: 'Đổi gán driver/vehicle cho shipment',
  })
  async reassign(
    @CurrentOrgId() orgId: string | undefined,
    @CurrentUser() user: any,
    @Body() dto: ReassignRequestDto,
  ): Promise<IAssignmentView> {
    const a = await this.service.reassign(orgId, user?.id ?? null, dto);
    return {
      id: a.id,
      shipmentId: a.shipmentId,
      driverId: a.driverId ?? null,
      vehicleId: a.vehicleId ?? null,
      assignedBy: a.assignedBy ?? null,
      assignedAt: a.assignedAt
        ? a.assignedAt.toISOString()
        : new Date().toISOString(),
      note: null,
    };
  }

  @Post('unassign')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DISPATCHER')
  @Permissions('shipments:assign')
  @ApiOkResponse({ description: 'Bỏ gán driver/vehicle của shipment' })
  async unassign(
    @CurrentOrgId() orgId: string | undefined,
    @CurrentUser() user: any,
    @Body() dto: UnassignRequestDto,
  ) {
    return this.service.unassign(orgId, user?.id ?? null, dto);
  }
}
