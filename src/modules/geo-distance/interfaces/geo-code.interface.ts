export interface IGeocodeResult {
  lat: number;
  lng: number;
  formattedAddress?: string;
  raw?: any;
}

export interface IDistanceMatrixResult {
  distanceM?: number; // meters
  durationS?: number; // seconds
  raw?: any;
}
