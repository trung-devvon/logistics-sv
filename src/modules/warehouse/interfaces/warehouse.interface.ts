export interface IOrderScanRecord {
  id: string;
  orderId: string;
  hubId: string;
  direction: 'INBOUND' | 'OUTBOUND';
  scannedBy: string | null;
  scannedAt: Date;
  note?: string | null;
}

export interface IShipmentScanRecord {
  id: string;
  shipmentId: string;
  hubId: string;
  direction: 'INBOUND' | 'OUTBOUND';
  scannedBy: string | null;
  scannedAt: Date;
  note?: string | null;
}

/** Kết quả ràng buộc hợp lệ cho OUTBOUND */
export interface IOutboundRuleCheck {
  ok: boolean;
  reason?: string;
}
