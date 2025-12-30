import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { OrderScanDto, ScanDirection } from './dto/order-scan.dto';
import { ShipmentScanDto } from './dto/shipment-scan.dto';
import { WarehouseScanRepository } from './repos/warehouse.repository';

@Injectable()
export class WarehouseService {
  constructor(private readonly repo: WarehouseScanRepository) {}

  /** ORDER */

  async scanOrder(orgId: string | null, userId: string, dto: OrderScanDto) {
    // 0) scope
    const hubOk = await this.repo.ensureHubBelongsToOrg(dto.hubId, orgId);
    if (!hubOk)
      throw new ForbiddenException('Hub không thuộc tổ chức hiện tại');

    // 1) order exist
    const exists = await this.repo.ensureOrderExists(dto.orderId);
    if (!exists) throw new BadRequestException('Order không tồn tại');

    // 2) outbound rule
    if (dto.direction === ScanDirection.OUTBOUND) {
      const rule = await this.repo.canOutboundOrder(dto.orderId, dto.hubId);
      if (!rule.ok)
        throw new BadRequestException(`Không thể OUTBOUND: ${rule.reason}`);
    }

    // 3) create scan
    const rec = await this.repo.createOrderScan({
      orderId: dto.orderId,
      hubId: dto.hubId,
      direction: dto.direction,
      scannedBy: userId,
      note: dto.note ?? null,
    });

    return rec;
  }

  /** SHIPMENT */

  async scanShipment(
    orgId: string | null,
    userId: string,
    dto: ShipmentScanDto,
  ) {
    const hubOk = await this.repo.ensureHubBelongsToOrg(dto.hubId, orgId);
    if (!hubOk)
      throw new ForbiddenException('Hub không thuộc tổ chức hiện tại');

    const exists = await this.repo.ensureShipmentExists(dto.shipmentId);
    if (!exists) throw new BadRequestException('Shipment không tồn tại');

    if (dto.direction === ScanDirection.OUTBOUND) {
      const rule = await this.repo.canOutboundShipment(
        dto.shipmentId,
        dto.hubId,
      );
      if (!rule.ok)
        throw new BadRequestException(`Không thể OUTBOUND: ${rule.reason}`);
    }

    const rec = await this.repo.createShipmentScan({
      shipmentId: dto.shipmentId,
      hubId: dto.hubId,
      direction: dto.direction,
      scannedBy: userId,
      note: dto.note ?? null,
    });

    return rec;
  }
}
