import { Injectable } from '@nestjs/common';
import { IGeoCode } from '../interfaces/geo.interface';
import { PrismaService } from '@/core/prisma/prisma.service';

@Injectable()
export class GeoRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- Geocoding Cache ----------
  findGeocode(orgId: string, raw: string, provider?: string | null) {
    return this.prisma.geocodingCache.findUnique({
      where: {
        raw_provider_orgId: { raw, provider: provider ?? null, orgId },
      },
    });
  }

  upsertGeocode(params: IGeoCode) {
    const { orgId, raw, provider } = params;
    return this.prisma.geocodingCache.upsert({
      where: { raw_provider_orgId: { raw, provider: provider ?? null, orgId } },
      update: {
        lat: params.lat ?? null,
        lng: params.lng ?? null,
        requestedBy: params.requestedBy ?? null,
        ttlUntil: params.ttlUntil ?? null,
      },
      create: {
        orgId,
        requestedBy: params.requestedBy ?? null,
        raw,
        lat: params.lat ?? null,
        lng: params.lng ?? null,
        provider: provider ?? null,
        ttlUntil: params.ttlUntil ?? null,
      },
    });
  }

  // ---------- Distance Matrix Cache ----------
  findDistance(
    orgId: string,
    fromKey: string,
    toKey: string,
    provider?: string | null,
  ) {
    return this.prisma.distanceMatrixCache.findUnique({
      where: {
        fromKey_toKey_provider_orgId: {
          fromKey,
          toKey,
          provider: provider ?? null,
          orgId,
        },
      },
    });
  }

  upsertDistance(params: {
    orgId: string;
    requestedBy?: string | null;
    fromKey: string;
    toKey: string;
    distanceM?: number | null;
    durationS?: number | null;
    provider?: string | null;
    ttlUntil?: Date | null;
  }) {
    const { orgId, fromKey, toKey, provider } = params;
    return this.prisma.distanceMatrixCache.upsert({
      where: {
        fromKey_toKey_provider_orgId: {
          fromKey,
          toKey,
          provider: provider ?? null,
          orgId,
        },
      },
      update: {
        distanceM: params.distanceM ?? null,
        durationS: params.durationS ?? null,
        requestedBy: params.requestedBy ?? null,
        ttlUntil: params.ttlUntil ?? null,
      },
      create: {
        orgId,
        requestedBy: params.requestedBy ?? null,
        fromKey,
        toKey,
        distanceM: params.distanceM ?? null,
        durationS: params.durationS ?? null,
        provider: provider ?? null,
        ttlUntil: params.ttlUntil ?? null,
      },
    });
  }
}
