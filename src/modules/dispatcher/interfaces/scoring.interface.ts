export interface IScoreContext {
  etaPenaltySec?: number;
  distanceKm?: number;
  driverStatusWeight?: number;
  capacityOk?: boolean;
}

export interface IAssignmentScore {
  driverId: string;
  vehicleId?: string;
  score: number;
  reason?: string;
}
