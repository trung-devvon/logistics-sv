import { Injectable } from '@nestjs/common';
import { GeocodeDto } from './dto/geocode.dto';
import { ReverseGeocodeDto } from './dto/reverse-geocode.dto';
import { DistanceMatrixDto } from './dto/distance-matrix.dto';
import { GeoProvider } from './providers/geo.provider';
import { GeoRepository } from './repositories/geo.repository';
import { EventEmitter2 } from 'eventemitter2';

const DEFAULT_GEOCODE_TTL_SEC = 24 * 3600; // 1 ngày
const DEFAULT_DISTANCE_TTL_SEC = 3600; // 1 giờ

@Injectable()
export class GeoService {
  constructor(
    private readonly repo: GeoRepository,
    private readonly provider: GeoProvider,
    private readonly events: EventEmitter2,
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
}
