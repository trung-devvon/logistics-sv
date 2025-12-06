import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateVehicleDto) {
    // Check duplicate plate
    const existing = await this.prisma.vehicle.findUnique({
      where: { plateNumber: dto.plateNumber },
    });
    if (existing) {
      throw new BadRequestException('Biển số xe đã tồn tại');
    }

    return this.prisma.vehicle.create({
      data: {
        plateNumber: dto.plateNumber,
        type: dto.type,
        capacityKg: dto.capacityKg,
        capacityM3: dto.capacityM3,
        status: dto.status,
      },
    });
  }

  async findAll(query: FilterVehicleDto) {
    const { q, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.VehicleWhereInput = {
      AND: [
        status ? { status } : {},
        q
          ? {
            plateNumber: { contains: q, mode: 'insensitive' },
          }
          : {},
      ],
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.vehicle.count({ where }),
      this.prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async update(id: string, dto: UpdateVehicleDto) {
    await this.findOne(id); // check exist

    if (dto.plateNumber) {
      const existing = await this.prisma.vehicle.findUnique({
        where: { plateNumber: dto.plateNumber },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Biển số xe đã tồn tại');
      }
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // check exist
    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}
