import { Injectable, Logger } from '@nestjs/common';
import { GeocodeDto } from './dto/geocode.dto';
import { ReverseGeocodeDto } from './dto/reverse-geocode.dto';
import { DistanceMatrixDto } from './dto/distance-matrix.dto';
import { GeoProvider } from './providers/geo.provider';
import { HttpService } from '@nestjs/axios';
import { GeoRepository } from './repositories/geo.repository';
import { EventEmitter2 } from 'eventemitter2';
import {
  DrivingMatrix,
  IDrivingOptions,
  ILatLng,
} from './interfaces/driving-matrix.interface';
import { firstValueFrom } from 'rxjs';

import { PrismaService } from '@/core/prisma/prisma.service';

const DEFAULT_GEOCODE_TTL_SEC = 24 * 3600; // 1 ngày
const DEFAULT_DISTANCE_TTL_SEC = 3600; // 1 giờ

@Injectable()
export class GeoService {
  private readonly logger = new Logger(GeoService.name);
  private readonly apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
  private readonly defaultTtlSec = parseInt(
    process.env.GEO_TTL_SECONDS ?? '86400',
    10,
  );
  constructor(
    private readonly repo: GeoRepository,
    private readonly events: EventEmitter2,
    private readonly http: HttpService,
    private readonly prisma: PrismaService,
    private provider: GeoProvider,
  ) {}

  private ttlDate(sec: number | undefined, defaultSec: number) {
    const ttl = typeof sec === 'number' && sec > 0 ? sec : defaultSec;
    const d = new Date();
    d.setSeconds(d.getSeconds() + ttl);
    return d;
  }

  private isValidTtl(ttlUntil?: Date | null) {
    if (!ttlUntil) return false;
    return new Date(ttlUntil).getTime() > Date.now();
  }

  async geocode(orgId: string, userId: string | null, dto: GeocodeDto) {
    const providerName = dto.provider ?? this.provider.name;
    const cached = await this.repo.findGeocode(orgId, dto.raw, providerName);
    if (cached && this.isValidTtl(cached.ttlUntil)) {
      return {
        source: 'cache',
        lat: cached.lat,
        lng: cached.lng,
        provider: providerName,
      };
    }

    const res = await this.provider.geocode(dto.raw);
    const ttlUntil = this.ttlDate(dto.ttlSec, DEFAULT_GEOCODE_TTL_SEC);

    await this.repo.upsertGeocode({
      orgId,
      requestedBy: userId,
      raw: dto.raw,
      lat: res?.lat ?? null,
      lng: res?.lng ?? null,
      provider: providerName,
      ttlUntil,
    });

    this.events.emit('geo.cache.filled', {
      type: 'geocode',
      orgId,
      provider: providerName,
      raw: dto.raw,
    });
    return {
      source: res ? 'provider' : 'provider-null',
      lat: res?.lat ?? null,
      lng: res?.lng ?? null,
      provider: providerName,
    };
  }

  async reverseGeocode(
    orgId: string,
    userId: string | null,
    dto: ReverseGeocodeDto,
  ) {
    const providerName = dto.provider ?? this.provider.name;
    const rawKey = `REV:${dto.lat},${dto.lng}`;
    const cached = await this.repo.findGeocode(orgId, rawKey, providerName);
    if (cached && this.isValidTtl(cached.ttlUntil)) {
      return {
        source: 'cache',
        lat: cached.lat,
        lng: cached.lng,
        provider: providerName,
      };
    }

    const res = await this.provider.reverseGeocode(
      Number(dto.lat),
      Number(dto.lng),
    );
    const ttlUntil = this.ttlDate(dto.ttlSec, DEFAULT_GEOCODE_TTL_SEC);

    await this.repo.upsertGeocode({
      orgId,
      requestedBy: userId,
      raw: rawKey,
      lat: res?.lat ?? Number(dto.lat),
      lng: res?.lng ?? Number(dto.lng),
      provider: providerName,
      ttlUntil,
    });

    this.events.emit('geo.cache.filled', {
      type: 'reverse',
      orgId,
      provider: providerName,
      key: rawKey,
    });
    return {
      source: res ? 'provider' : 'provider-null',
      lat: res?.lat ?? Number(dto.lat),
      lng: res?.lng ?? Number(dto.lng),
      provider: providerName,
    };
  }

  async distanceMatrix(
    orgId: string,
    userId: string | null,
    dto: DistanceMatrixDto,
  ) {
    const providerName = dto.provider ?? this.provider.name;
    const cached = await this.repo.findDistance(
      orgId,
      dto.fromKey,
      dto.toKey,
      providerName,
    );
    if (cached && this.isValidTtl(cached.ttlUntil)) {
      return {
        source: 'cache',
        distanceM: cached.distanceM,
        durationS: cached.durationS,
        provider: providerName,
      };
    }

    const res = await this.provider.distanceMatrix(dto.fromKey, dto.toKey);
    const ttlUntil = this.ttlDate(dto.ttlSec, DEFAULT_DISTANCE_TTL_SEC);

    await this.repo.upsertDistance({
      orgId,
      requestedBy: userId,
      fromKey: dto.fromKey,
      toKey: dto.toKey,
      distanceM: res?.distanceM ?? null,
      durationS: res?.durationS ?? null,
      provider: providerName,
      ttlUntil,
    });

    this.events.emit('geo.cache.filled', {
      type: 'distance',
      orgId,
      provider: providerName,
      fromKey: dto.fromKey,
      toKey: dto.toKey,
    });
    return {
      source: res ? 'provider' : 'provider-null',
      distanceM: res?.distanceM ?? null,
      durationS: res?.durationS ?? null,
      provider: providerName,
    };
  }

  async drivingOneToOne(
    from: ILatLng,
    to: ILatLng,
    options: IDrivingOptions = {},
  ): Promise<DrivingMatrix> {
    const mode = options.mode ?? 'driving';
    const units = options.units ?? 'metric';
    const language = options.language ?? 'vi';
    const ttlSeconds = options.ttlSeconds ?? this.defaultTtlSec;
    const orgId = options.orgId ?? null;

    // 1) Chuẩn hoá key (làm tròn 6 chữ số thập phân để tăng hit rate)
    const fromKey = this.formatKey(from);
    const toKey = this.formatKey(to);

    // 2) Thử lấy từ cache DB
    const cached = await this.repo.getCache(
      fromKey,
      toKey,
      this.provider.name,
      orgId,
    );
    if (cached) {
      return {
        distanceMeters: cached.distanceM ?? 0,
        durationSeconds: cached.durationS ?? 0,
      };
    }

    // 3) Gọi Google Distance Matrix API
    try {
      const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
      const params: Record<string, string> = {
        origins: `${from.lat},${from.lng}`,
        destinations: `${to.lat},${to.lng}`,
        key: this.apiKey,
        mode,
        language,
        units,
      };
      if (options.avoid?.length) params.avoid = options.avoid.join('|');

      const res = await firstValueFrom(this.http.get(url, { params }));
      if (res.data?.status !== 'OK') {
        this.logger.warn(`Google DM status=${res.data?.status}`);
        throw new Error(`Google DistanceMatrix status=${res.data?.status}`);
      }

      const element = res.data?.rows?.[0]?.elements?.[0];
      if (!element || element.status !== 'OK') {
        this.logger.warn(`Google DM element.status=${element?.status}`);
        throw new Error(
          `Google DistanceMatrix element status=${element?.status}`,
        );
      }

      const distanceMeters: number = element.distance?.value ?? 0;
      const durationSeconds: number = element.duration?.value ?? 0;

      // 4) Lưu cache
      await this.repo.upsertCache({
        orgId,
        fromKey,
        toKey,
        provider: this.provider.name,
        distanceM: distanceMeters,
        durationS: durationSeconds,
        ttlSeconds,
      });

      return { distanceMeters, durationSeconds };
    } catch (err) {
      this.logger.error(
        `Google DistanceMatrix failed, fallback haversine. Reason: ${(err as Error)?.message}`,
      );

      // 5) Fallback Haversine
      const fallbackDistanceMeters = this.haversineMeters(from, to);
      // Tốc độ giả định 35km/h trong nội đô → 9.72 m/s (tuỳ chỉnh nếu muốn)
      const assumedSpeedMps = 9.72;
      const fallbackDurationSeconds = Math.round(
        fallbackDistanceMeters / assumedSpeedMps,
      );

      // Lưu cache fallback để tránh lặp API khi provider lỗi tạm thời (TTL ngắn hơn 5 phút)
      await this.repo.upsertCache({
        orgId,
        fromKey,
        toKey,
        provider: `${this.provider.name}:fallback`,
        distanceM: Math.round(fallbackDistanceMeters),
        durationS: fallbackDurationSeconds,
        ttlSeconds: Math.min(ttlSeconds, 300),
      });

      return {
        distanceMeters: Math.round(fallbackDistanceMeters),
        durationSeconds: fallbackDurationSeconds,
      };
    }
  }

  private formatKey(p: ILatLng): string {
    const lat = Number(p.lat).toFixed(6);
    const lng = Number(p.lng).toFixed(6);
    return `${lat},${lng}`;
  }

  private haversineMeters(a: ILatLng, b: ILatLng): number {
    const R = 6371000; // m
    const dLat = this.toRad(b.lat - a.lat);
    const dLng = this.toRad(b.lng - a.lng);
    const lat1 = this.toRad(a.lat);
    const lat2 = this.toRad(b.lat);

    const sinDlat = Math.sin(dLat / 2);
    const sinDlng = Math.sin(dLng / 2);

    const x =
      sinDlat * sinDlat + Math.cos(lat1) * Math.cos(lat2) * sinDlng * sinDlng;
    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    return R * c;
  }
  private toRad(v: number) {
    return (v * Math.PI) / 180;
  }
}
