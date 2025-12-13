import {
  IDistanceMatrixResult,
  IGeocodeResult,
} from '../interfaces/geo-code.interface';

export abstract class GeoProvider {
  abstract name: string;
  abstract geocode(raw: string): Promise<IGeocodeResult | null>;
  abstract reverseGeocode(
    lat: number,
    lng: number,
  ): Promise<IGeocodeResult | null>;
  abstract distanceMatrix(
    fromKey: string,
    toKey: string,
  ): Promise<IDistanceMatrixResult | null>;
}
