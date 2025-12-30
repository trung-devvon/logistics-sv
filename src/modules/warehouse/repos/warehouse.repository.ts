import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ScanDirection } from '../dto/order-scan.dto';
import {
  IOrderScanRecord,
  IOutboundRuleCheck,
  IShipmentScanRecord,
} from '../interfaces/warehouse.interface';

@Injectable()
export class WarehouseScanRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** --------- ORDER SCANS ---------- */

  async getLastOrderScanAtHub(orderId: string, hubId: string) {
    return this.prisma.orderScan.findFirst({
      where: { orderId, hubId },
      orderBy: { scannedAt: 'desc' },
    });
  }

  async createOrderScan(params: {
    orderId: string;
    hubId: string;
    direction: ScanDirection;
    scannedBy: string | null;
    note?: string | null;
  }): Promise<IOrderScanRecord> {
    const rec = await this.prisma.orderScan.create({
      data: {
        orderId: params.orderId,
        hubId: params.hubId,
        direction: params.direction,
        scannedBy: params.scannedBy,
        note: params.note ?? null,
      },
    });
    // cast BigInt on id if needed by your TS config
    return rec as unknown as IOrderScanRecord;
  }

  async canOutboundOrder(
    orderId: string,
    hubId: string,
  ): Promise<IOutboundRuleCheck> {
    const last = await this.getLastOrderScanAtHub(orderId, hubId);
    if (!last) return { ok: false, reason: 'Chưa có INBOUND tại hub này' };
    if (last.direction !== 'INBOUND') {
      return { ok: false, reason: 'Bản ghi gần nhất không phải INBOUND' };
    }
    return { ok: true };
  }

  /** --------- SHIPMENT SCANS ---------- */

  async getLastShipmentScanAtHub(shipmentId: string, hubId: string) {
    return this.prisma.shipmentScan.findFirst({
      where: { shipmentId, hubId },
      orderBy: { scannedAt: 'desc' },
    });
  }

  async createShipmentScan(params: {
    shipmentId: string;
    hubId: string;
    direction: ScanDirection;
    scannedBy: string | null;
    note?: string | null;
  }): Promise<IShipmentScanRecord> {
    const rec = await this.prisma.shipmentScan.create({
      data: {
        shipmentId: params.shipmentId,
        hubId: params.hubId,
        direction: params.direction,
        scannedBy: params.scannedBy,
        note: params.note ?? null,
      },
    });
    return rec as unknown as IShipmentScanRecord;
  }

  async canOutboundShipment(
    shipmentId: string,
    hubId: string,
  ): Promise<IOutboundRuleCheck> {
    const last = await this.getLastShipmentScanAtHub(shipmentId, hubId);
    if (!last) return { ok: false, reason: 'Chưa có INBOUND tại hub này' };
    if (last.direction !== 'INBOUND') {
      return { ok: false, reason: 'Bản ghi gần nhất không phải INBOUND' };
    }
    return { ok: true };
  }

  /** --------- VALIDATIONS / EXISTENCE ---------- */

  async ensureOrderExists(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    return !!order;
  }

  async ensureShipmentExists(shipmentId: string) {
    const sp = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
    });
    return !!sp;
  }

  async ensureHubBelongsToOrg(hubId: string, orgId: string | null) {
    if (!orgId) return false;
    const hub = await this.prisma.hub.findUnique({ where: { id: hubId } });
    return !!hub && hub.orgId === orgId;
  }
}
