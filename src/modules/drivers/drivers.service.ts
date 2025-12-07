import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDriverDto, DriverStatus } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PrismaService } from '@/core/prisma/prisma.service';
import { FilterDriverDto } from './dto/filter-driver.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateDriverDto) {
    // 1. check userId (findOne driver where userId) -> if exist throw BadRequest
    // 2. create driver

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const driver = await this.prisma.driver.findUnique({
      where: {
        userId: dto.userId,
      },
    })
    if (driver) {
      throw new BadRequestException('Driver already exists')
    }
    const newDriver = await this.prisma.driver.create({
      data: {
        userId: dto.userId,
        licenseNo: dto.licenseNo,
        status: dto.status || DriverStatus.AVAILABLE,
        hiredAt: dto.hiredAt || new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          }
        }
      }
    })
    return newDriver
  }
  async findAll(filter: FilterDriverDto) {
    const { status, search } = filter;

    const where: Prisma.DriverWhereInput = {}
    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { licenseNo: { contains: search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
            ]
          }
        }
      ]
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.driver.count({ where }),
      this.prisma.driver.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            }
          },
          _count: { select: { assignments: true } } // đếm số chuyến đã gán
        },
        orderBy: { createdAt: 'desc' },
        skip: (filter.page - 1) * filter.limit,
        take: filter.limit,
      }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page: filter.page,
        limit: filter.limit,
        totalPages: Math.ceil(total / filter.limit),
      },
    };
  }

  async findOne(id: string) {
    // if null throw NotFoundException
    const driver = await this.prisma.driver.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          }
        },
        assignments: {
          where: { vehicleId: { not: null } },
          take: 5,
          orderBy: { assignedAt: 'desc' },
          include: { vehicle: true }
        }
      },
    })
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    return driver;
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    const driver = await this.findOne(id);
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    return this.prisma.driver.update({
      where: { id },
      data: updateDriverDto,
      include: {
        user: { select: { fullName: true } }
      }
    });

  }

  async remove(id: string) {
    const driver = await this.findOne(id);
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return this.prisma.driver.delete({ where: { id } });
  }
}
