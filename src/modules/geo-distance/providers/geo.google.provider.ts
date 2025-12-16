import axios, { AxiosInstance } from 'axios';
import { GeoProvider } from './geo.provider';
import {
  IDistanceMatrixResult,
  IGeocodeResult,
} from '../interfaces/geo-code.interface';

function isLatLngKey(key: string): boolean {
  const m = key.trim().match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
  return !!m;
}

export class GeoGoogleProvider implements GeoProvider {
  name = 'google';
  private http: AxiosInstance;

  constructor(
    private readonly apiKey = process.env.GOOGLE_MAPS_API_KEY ?? '',
    private readonly timeoutMs = Number(
      process.env.GOOGLE_MAPS_TIMEOUT_MS ?? 7000,
    ),
  ) {
    this.http = axios.create({
      timeout: this.timeoutMs,
      validateStatus: (s) => s >= 200 && s < 500,
    });
  }

  async geocode(raw: string): Promise<IGeocodeResult | null> {
    if (!this.apiKey) return null;

    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = { address: raw, key: this.apiKey };

    const res = await this.http.get(url, { params });
    if (res.status !== 200) return null;

    const data = res.data;
    if (
      !data ||
      data.status !== 'OK' ||
      !Array.isArray(data.results) ||
      data.results.length === 0
    )
      return null;

    const r = data.results[0];
    const loc = r.geometry?.location;
    if (!loc) return null;

    return {
      lat: Number(loc.lat),
      lng: Number(loc.lng),
      formattedAddress: r.formatted_address,
      raw: r,
    };
  }

  async reverseGeocode(
    lat: number,
    lng: number,
  ): Promise<IGeocodeResult | null> {
    if (!this.apiKey) return null;

    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = { latlng: `${lat},${lng}`, key: this.apiKey };

    const res = await this.http.get(url, { params });
    if (res.status !== 200) return null;

    const data = res.data;
    if (
      !data ||
      data.status !== 'OK' ||
      !Array.isArray(data.results) ||
      data.results.length === 0
    ) {
      return { lat, lng, formattedAddress: undefined, raw: data };
    }

    const r = data.results[0];
    return {
      lat,
      lng,
      formattedAddress: r.formatted_address,
      raw: r,
    };
  }

  async distanceMatrix(
    fromKey: string,
    toKey: string,
  ): Promise<IDistanceMatrixResult | null> {
    if (!this.apiKey) return null;

    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
    const origins = isLatLngKey(fromKey) ? fromKey : fromKey.trim();
    const destinations = isLatLngKey(toKey) ? toKey : toKey.trim();

    const params: Record<string, string> = {
      key: this.apiKey,
      units: 'metric',
      origins,
      destinations,
      mode: 'driving',
    };

    const res = await this.http.get(url, { params });
    if (res.status !== 200) return null;

    const data = res.data;
    if (
      !data ||
      data.status !== 'OK' ||
      !Array.isArray(data.rows) ||
      data.rows.length === 0
    )
      return null;

    const e = data.rows[0]?.elements?.[0];
    if (!e || e.status !== 'OK') {
      return { distanceM: undefined, durationS: undefined, raw: data };
    }

    const distanceM = e.distance?.value;
    const durationS = e.duration?.value;

    return {
      distanceM: typeof distanceM === 'number' ? distanceM : undefined,
      durationS: typeof durationS === 'number' ? durationS : undefined,
      raw: e,
    };
  }
}
