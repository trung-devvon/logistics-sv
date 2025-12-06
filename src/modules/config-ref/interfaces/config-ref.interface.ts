export interface IListRegions {
  q?: string;
  active?: boolean;
  cursor?: string;
  take: number;
}

export interface IUpdateRegion {
  name?: string;
  active?: boolean;
}

export interface IRegion {
  code: string;
  name: string;
}

export interface IServiceLevel {
  orgId: string;
  code: string;
  name: string;
}

export interface IListServiceLevels extends IListRegions {
  orgId: string;
}
