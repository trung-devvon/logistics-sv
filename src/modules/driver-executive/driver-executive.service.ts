import { Injectable } from '@nestjs/common';
import { CreateDriverExecutiveDto } from './dto/create-driver-executive.dto';
import { UpdateDriverExecutiveDto } from './dto/update-driver-executive.dto';

@Injectable()
export class DriverExecutiveService {
  create(createDriverExecutiveDto: CreateDriverExecutiveDto) {
    return 'This action adds a new driverExecutive';
  }

  findAll() {
    return `This action returns all driverExecutive`;
  }

  findOne(id: number) {
    return `This action returns a #${id} driverExecutive`;
  }

  update(id: number, updateDriverExecutiveDto: UpdateDriverExecutiveDto) {
    return `This action updates a #${id} driverExecutive`;
  }

  remove(id: number) {
    return `This action removes a #${id} driverExecutive`;
  }
}
