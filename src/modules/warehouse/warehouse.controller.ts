/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderScanDto, ScanDirection } from './dto/order-scan.dto';
import { ShipmentScanDto } from './dto/shipment-scan.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { CurrentOrgId } from '@/common/decorators/current-org-id.decorator';
import { AuditLogInterceptor } from '@/common/interceptors/audit.interceptor';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { WarehouseService } from './warehouse.service';
@ApiTags('Warehouse Scan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(AuditLogInterceptor) // sẽ tự ghi audit create/update theo config interceptor
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly service: WarehouseService) {}

  // -------- ORDER --------

  @Post('order/scan-in')
  @ApiOperation({ summary: 'Scan INBOUND cho Order tại hub' })
  @Permissions('hubs:scan_in')
  async orderScanIn(
    @CurrentOrgId() orgId: string | null,
    @CurrentUser() userId: string,
    @Body()
    body: Omit<OrderScanDto, 'direction'> & { direction?: ScanDirection },
  ) {
    return this.service.scanOrder(orgId, userId, {
      ...body,
      direction: ScanDirection.INBOUND,
    });
  }

  @Post('order/scan-out')
  @ApiOperation({
    summary: 'Scan OUTBOUND cho Order tại hub (chỉ sau khi đã INBOUND)',
  })
  @Permissions('hubs:scan_out')
  async orderScanOut(
    @CurrentOrgId() orgId: string | null,
    @CurrentUser() userId: string,
    @Body()
    body: Omit<OrderScanDto, 'direction'> & { direction?: ScanDirection },
  ) {
    return this.service.scanOrder(orgId, userId, {
      ...body,
      direction: ScanDirection.OUTBOUND,
    });
  }

  // -------- SHIPMENT --------

  @Post('shipment/scan-in')
  @ApiOperation({ summary: 'Scan INBOUND cho Shipment tại hub' })
  @Permissions('hubs:scan_in')
  async shipmentScanIn(
    @CurrentOrgId() orgId: string | null,
    @CurrentUser() userId: string,
    @Body()
    body: Omit<ShipmentScanDto, 'direction'> & { direction?: ScanDirection },
  ) {
    return this.service.scanShipment(orgId, userId, {
      ...body,
      direction: ScanDirection.INBOUND,
    });
  }

  @Post('shipment/scan-out')
  @ApiOperation({
    summary: 'Scan OUTBOUND cho Shipment tại hub (chỉ sau khi đã INBOUND)',
  })
  @Permissions('hubs:scan_out')
  async shipmentScanOut(
    @CurrentOrgId() orgId: string | null,
    @CurrentUser() userId: string,
    @Body()
    body: Omit<ShipmentScanDto, 'direction'> & { direction?: ScanDirection },
  ) {
    return this.service.scanShipment(orgId, userId, {
      ...body,
      direction: ScanDirection.OUTBOUND,
    });
  }
}
