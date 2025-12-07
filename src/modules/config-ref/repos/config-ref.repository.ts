import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  IListRegions,
  IListServiceLevels,
  IRegion,
  IServiceLevel,
  IUpdateRegion,
} from '../interfaces/config-ref.interface';

@Injectable()
export class ConfigRefRepository {
  constructor(private readonly prisma: PrismaService) {}

  // -------- Regions (global) --------
  async createRegion(data: IRegion) {
    return this.prisma.configRegion.create({ data });
  }

  async listRegions(opts: IListRegions) {
    const where: Prisma.ConfigRegionWhereInput = {
      ...(opts.q
        ? {
            OR: [
              { code: { contains: opts.q, mode: 'insensitive' } },
              { name: { contains: opts.q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(typeof opts.active === 'boolean' ? { active: opts.active } : {}),
    };

    const data = await this.prisma.configRegion.findMany({
      where,
      take: opts.take,
      skip: opts.cursor ? 1 : 0,
      cursor: opts.cursor ? { id: opts.cursor } : undefined,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        code: true,
        name: true,
        active: true,
        updatedAt: true,
      },
    });
    const nextCursor = data.length === opts.take ? data.at(-1).id : null;
    return { data, nextCursor };
  }

  async getRegion(id: string) {
    return this.prisma.configRegion.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        active: true,
        updatedAt: true,
      },
    });
  }

  async updateRegion(id: string, data: IUpdateRegion) {
    return this.prisma.configRegion.update({
      where: { id },
      data,
      select: {
        id: true,
        code: true,
        name: true,
        active: true,
        updatedAt: true,
      },
    });
  }

  async deleteRegion(id: string) {
    await this.prisma.configRegion.delete({ where: { id } });
  }

  // -------- Service Levels (per org) --------
  async createServiceLevel(data: IServiceLevel) {
    return this.prisma.configServiceLevel.create({
      data,
      select: {
        id: true,
        orgId: true,
        code: true,
        name: true,
        active: true,
        updatedAt: true,
      },
    });
  }

  async listServiceLevels(opts: IListServiceLevels) {
    const where: Prisma.ConfigServiceLevelWhereInput = {
      orgId: opts.orgId,
      ...(opts.q
        ? {
            OR: [
              { code: { contains: opts.q, mode: 'insensitive' } },
              { name: { contains: opts.q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(typeof opts.active === 'boolean' ? { active: opts.active } : {}),
    };

    const items = await this.prisma.configServiceLevel.findMany({
      where,
      take: opts.take,
      skip: opts.cursor ? 1 : 0,
      cursor: opts.cursor ? { id: opts.cursor } : undefined,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        orgId: true,
        code: true,
        name: true,
        active: true,
        updatedAt: true,
      },
    });

    const nextCursor = items.length === opts.take ? items.at(-1).id : null;
    return { items, nextCursor };
  }

  async getServiceLevel(id: string) {
    return this.prisma.configServiceLevel.findUnique({
      where: { id },
      select: {
        id: true,
        orgId: true,
        code: true,
        name: true,
        active: true,
        updatedAt: true,
      },
    });
  }

  async updateServiceLevel(id: string, data: IUpdateRegion) {
    return this.prisma.configServiceLevel.update({
      where: { id },
      data,
      select: {
        id: true,
        orgId: true,
        code: true,
        name: true,
        active: true,
        updatedAt: true,
      },
    });
  }

  async deleteServiceLevel(id: string) {
    await this.prisma.configServiceLevel.delete({ where: { id } });
  }
}
