import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';
import { FilterHubDto } from './dto/filter-hub.dto';
import { PrismaService } from '@/core/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HubsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateHubDto) {
    if (dto.orgId) {
      const org = await this.prisma.org.findUnique({
        where: { id: dto.orgId },
      });
      if (!org) throw new NotFoundException('Organization not found');
    }

    return this.prisma.hub.create({
      data: {
        name: dto.name,
        address: dto.address,
        lat: dto.lat,
        lng: dto.lng,
        orgId: dto.orgId,
      },
    });
  }

  async findAll(query: FilterHubDto) {
    const { q, orgId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.HubWhereInput = {
      AND: [
        orgId ? { orgId } : {},
        q
          ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { address: { contains: q, mode: 'insensitive' } },
            ],
          }
          : {},
      ],
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.hub.count({ where }),
      this.prisma.hub.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { org: { select: { id: true, name: true, code: true } } },
      }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const hub = await this.prisma.hub.findUnique({
      where: { id },
      include: { org: { select: { id: true, name: true, code: true } } },
    });
    if (!hub) throw new NotFoundException('Hub not found');
    return hub;
  }

  async update(id: string, dto: UpdateHubDto) {
    await this.findOne(id); // check exist

    if (dto.orgId) {
      const org = await this.prisma.org.findUnique({
        where: { id: dto.orgId },
      });
      if (!org) throw new NotFoundException('Organization not found');
    }

    return this.prisma.hub.update({
      where: { id },
      data: {
        name: dto.name,
        address: dto.address,
        lat: dto.lat,
        lng: dto.lng,
        orgId: dto.orgId,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // check exist
    // Check dependencies if needed (e.g. shipments)
    return this.prisma.hub.delete({
      where: { id },
    });
  }
}
