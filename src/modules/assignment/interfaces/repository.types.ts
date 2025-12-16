export interface IShipmentLite {
  id: string;
  status: string | null;
  hubOriginId: string | null;
  hubDestId: string | null;
}

export interface IOrgOfShipment {
  orgId: string | null;
}

export interface IDriverLite {
  id: string;
  status: string;
}

export interface IVehicleLite {
  id: string;
  status: string;
}

export interface IAssignTxParams {
  shipmentId: string;
  driverId?: string | null;
  vehicleId?: string | null;
  byUserId?: string | null;
  note?: string | null;
}
