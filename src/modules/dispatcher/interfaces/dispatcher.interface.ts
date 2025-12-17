export interface IDispatcherCandidateDriver {
  id: string;
  status: string;            // AVAILABLE | BUSY | OFF | SUSPENDED
  lastLocationAt?: Date | null;
  lastLat?: number | null;
  lastLng?: number | null;
  activeAssignmentCount: number;
}

export interface IDispatcherCandidateVehicle {
  id: string;
  status: string;            // AVAILABLE | IN_SERVICE | MAINTENANCE | INACTIVE
  capacityKg?: string | null; // Prisma Decimal -> string
  capacityM3?: string | null;
  activeAssignmentCount: number;
}

export interface IUnassignedShipmentLite {
  id: string;
  type: string;              // INTERHUB | LASTMILE | ...
  status: string;            // PLANNED | DISPATCHED | ...
  hubOriginId?: string | null;
  hubDestId?: string | null;
  plannedStart?: Date | null;
  promisedAtMax?: Date | null; // derive from orders
  ordersCount: number;
  totalWeightKg?: string | null;
  totalVolumeM3?: string | null;
}

export interface IDispatchResult {
  shipmentId: string;
  driverId?: string | null;
  vehicleId?: string | null;
  assigned: boolean;
  reason?: string;
}
