import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';
import { PrismaService } from '@/core/prisma/prisma.service';

@Injectable()
export class HubsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateHubDto) {
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

  async findAll(orgId?: string) {
    const where = orgId ? { orgId } : {};
    return this.prisma.hub.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { org: { select: { id: true, name: true, code: true } } },
    });
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
    return this.prisma.hub.delete({
      where: { id },
    });
  }
}
