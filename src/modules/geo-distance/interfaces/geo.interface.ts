export interface IGeoCode {
  orgId: string;
  requestedBy?: string | null;
  raw: string;
  lat?: number | null;
  lng?: number | null;
  provider?: string | null;
  ttlUntil?: Date | null;
}
