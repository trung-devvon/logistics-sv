import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PrismaService } from '@/core/prisma/prisma.service';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateDriverDto) {
    // 1. check userId (findOne driver where userId) -> if exist throw BadRequest
    // 2. create driver
    return ''
  }

  async findAll() {
    // 1. return list drivers.
    // 2. include: { user: true } get name.
    return ''
  }

  async findOne(id: string) {
    // if null throw NotFoundException
    return ''
  }

  async update(id: string, dto: UpdateDriverDto) {
    return ''
  }

  async remove(id: string) {
    return ''
  }
}
