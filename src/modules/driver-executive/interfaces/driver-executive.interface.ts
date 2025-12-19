export interface IDriverTodayShipment {
  id: string;
  type: string;
  plannedStart?: string | null;
  plannedEnd?: string | null;
  status: string;
  stops: Array<{
    id: string;
    sequenceNo: number;
    stopType: string;
    status: string;
    eta?: string | null;
    ata?: string | null;
    address?: string | null;
    orderId?: string | null;
  }>;
}
