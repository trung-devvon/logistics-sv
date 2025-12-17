export interface IBoardQuery {
  hubId?: string;
  regionCode?: string;
  since?: Date;
  until?: Date;
  limit?: number;
  offset?: number;
}

export interface IDispatchManualInput {
  shipmentId: string;
  driverId: string;
  vehicleId?: string;
  note?: string;
}

export interface IDispatchAutoInput {
  shipmentId: string;
  note?: string;
}

export interface IDispatchBulkInput {
  items: Array<{
    shipmentId: string;
    driverId?: string;
    vehicleId?: string;
    note?: string;
  }>;
}
