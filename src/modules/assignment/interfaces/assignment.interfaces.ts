export interface IAssignment {
  id: string;
  shipmentId: string;
  driverId: string | null;
  vehicleId: string | null;
  assignedBy: string | null;
  assignedAt: Date | null;
  note?: string | null;
}

export interface IAssignInput {
  shipmentId: string;
  driverId?: string;
  vehicleId?: string;
  note?: string;
}

export interface IReassignInput {
  shipmentId: string;
  driverId?: string;
  vehicleId?: string;
  note?: string;
}

export interface IUnassignInput {
  shipmentId: string;
  note?: string;
}

export interface IAssignmentView {
  id: string;
  shipmentId: string;
  driverId?: string | null;
  vehicleId?: string | null;
  assignedBy?: string | null;
  assignedAt: string; // ISO
  note?: string | null;
}
