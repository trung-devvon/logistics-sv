export interface DrivingMatrix {
  distanceMeters: number;
  durationSeconds: number;
}

export interface ILatLng {
  lat: number;
  lng: number;
}
export interface IDrivingMatrix {
  distanceMeters: number;
  durationSeconds: number;
}
export interface IDrivingOptions {
  orgId?: string; // để cache theo org nếu cần
  mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
  avoid?: ('tolls' | 'highways' | 'ferries')[];
  language?: string; // 'vi'
  units?: 'metric' | 'imperial';
  ttlSeconds?: number; // override TTL
}
